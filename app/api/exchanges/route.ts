import {
  SecretsManagerClient,
  GetSecretValueCommand,
  CreateSecretCommand,
  UpdateSecretCommand,
  DeleteSecretCommand,
  RestoreSecretCommand,
  ResourceNotFoundException,
  ResourceExistsException,
  InvalidRequestException,
} from "@aws-sdk/client-secrets-manager";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { validateExchangeCredentials } from "@/helpers/exchanges/validate";

let client: SecretsManagerClient | null = null;

function getSecretsManagerClient(): SecretsManagerClient {
  if (!client) {
    client = new SecretsManagerClient({
      region: process.env.AWS_REGION,
      profile: process.env.AWS_PROFILE,
    });
  }
  return client;
}

// Get all exchange API
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = getSecretsManagerClient();
    const secretName = `trading-journal/${session.user.id}/exchanges`;

    try {
      const getCommand = new GetSecretValueCommand({ SecretId: secretName });
      const getResult = await client.send(getCommand);
      const exchangeData = JSON.parse(getResult.SecretString || "{}");

      // Transform the data to return a list of exchanges with masked secrets
      const exchanges = Object.entries(exchangeData).map(
        ([exchangeName, data]: [string, any]) => ({
          id: exchangeName,
          name: data.name || exchangeName,
          exchange: exchangeName,
          apiKey: data.api_key ? data.api_key.slice(0, 8) + "***" : "",
          secretKey: "***hidden***",
          isActive: true,
          created_at: data.created_at,
        }),
      );

      return NextResponse.json({ exchanges });
    } catch (error) {
      if (error instanceof ResourceNotFoundException) {
        // No secrets stored yet
        return NextResponse.json({ exchanges: [] });
      }
      // If the secret is scheduled for deletion, treat as no exchanges instead of 500
      if (error instanceof InvalidRequestException) {
        return NextResponse.json({ exchanges: [] });
      }
      throw error;
    }
  } catch (error) {
    console.error("Error retrieving exchange APIs:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve exchange API credentials",
      },
      { status: 500 },
    );
  }
}

// Create exchange API
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { apiName, exchangeName, apiKey, secretKey } = await request.json();

    if (!exchangeName || !apiKey || !secretKey) {
      return NextResponse.json(
        {
          error: "Missing required fields: exchangeName, apiKey, secretKey",
        },
        { status: 400 },
      );
    }

    // Validate credentials with the target exchange before persisting
    const validation = await validateExchangeCredentials(exchangeName, apiKey, secretKey);
    if (!validation.ok) {
      return NextResponse.json(
        { error: validation.error || "Invalid API credentials" },
        { status: 400 },
      );
    }

    const client = getSecretsManagerClient();
    const secretName = `trading-journal/${session.user.id}/exchanges`;

    // Structure for storing multiple exchange APIs in one secret
    // Example structure stored in AWS Secrets Manager:
    // {
    //   "binance": {
    //     "api_key": "your_binance_api_key",
    //     "secret_key": "your_binance_secret_key",
    //     "created_at": "2024-01-15T10:30:00.000Z"
    //   },
    //   "coinbase": {
    //     "api_key": "your_coinbase_api_key",
    
    //     "secret_key": "your_coinbase_secret_key",
    //     "created_at": "2024-01-16T14:20:00.000Z"
    //   }
    // }

    let existingData = {};

    // Try to get existing secret first
    try {
      const getCommand = new GetSecretValueCommand({ SecretId: secretName });
      const getResult = await client.send(getCommand);
      existingData = JSON.parse(getResult.SecretString || "{}");
      console.log("Existing data:", existingData);
    } catch (error) {
      // Secret doesn't exist yet, or is marked for deletion
      if (error instanceof ResourceNotFoundException) {
        // proceed with create path
      } else if (error instanceof InvalidRequestException) {
        // Try to restore, then fetch again; if that fails, proceed to create path
        try {
          await client.send(new RestoreSecretCommand({ SecretId: secretName }));
          const retry = await client.send(
            new GetSecretValueCommand({ SecretId: secretName }),
          );
          existingData = JSON.parse(retry.SecretString || "{}");
        } catch {
          existingData = {};
        }
      } else {
        throw error;
      }
    }

    // Add new exchange to existing data
    const updatedData = {
      ...existingData,
      [exchangeName]: {
        name: apiName,
        api_key: apiKey,
        secret_key: secretKey,
        created_at: new Date().toISOString(),
      },
    };

    // Create or update secret
    if (Object.keys(existingData).length === 0) {
      try {
        const createCommand = new CreateSecretCommand({
          // TODO: For production we will need to add KMS
          Name: secretName,
          SecretString: JSON.stringify(updatedData),
          Description: `Exchange API credentials for user ${session.user.id}`,
        });
        const response = await client.send(createCommand);
        console.log(response);
      } catch (createError) {
        if (createError instanceof ResourceExistsException) {
          // Secret exists but might be in pending deletion state - try to restore it
          try {
            const restoreCommand = new RestoreSecretCommand({
              SecretId: secretName,
            });
            await client.send(restoreCommand);
            
            // Now update with new data
            const updateCommand = new UpdateSecretCommand({
              SecretId: secretName,
              SecretString: JSON.stringify(updatedData),
            });
            await client.send(updateCommand);
          } catch (restoreError) {
            // If restore fails, the secret might already be active, try update directly
            if (restoreError instanceof InvalidRequestException) {
              const updateCommand = new UpdateSecretCommand({
                SecretId: secretName,
                SecretString: JSON.stringify(updatedData),
              });
              await client.send(updateCommand);
            } else {
              throw restoreError;
            }
          }
        } else {
          throw createError;
        }
      }
    } else {
      const updateCommand = new UpdateSecretCommand({
        // TODO: For production we will need to add KMS
        SecretId: secretName,
        SecretString: JSON.stringify(updatedData),
      });
      const response = await client.send(updateCommand);
      console.log(response);
    }

    return NextResponse.json({
      success: true,
      message: "Exchange API credentials stored successfully",
      exchangeName,
    });
  } catch (error) {
    console.error("Error creating exchange API:", error);
    
    if (error instanceof ResourceExistsException) {
      return NextResponse.json(
        {
          error: "Exchange API key already exists for this exchange",
        },
        { status: 409 },
      );
    }
    
    return NextResponse.json(
      {
        error: "Failed to store exchange API credentials",
      },
      { status: 500 },
    );
  }
}

// Delete exchange API
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { exchangeName } = await request.json();

    if (!exchangeName) {
      return NextResponse.json(
        {
          error: "Missing required field: exchangeName",
        },
        { status: 400 },
      );
    }

    const client = getSecretsManagerClient();
    const secretName = `trading-journal/${session.user.id}/exchanges`;

    try {
      // Get existing data (handle scheduled deletion by attempting restore)
      let existingData: Record<string, any> = {};
      try {
        const getCommand = new GetSecretValueCommand({ SecretId: secretName });
        const getResult = await client.send(getCommand);
        existingData = JSON.parse(getResult.SecretString || "{}");
      } catch (err) {
        if (err instanceof InvalidRequestException) {
          try {
            await client.send(new RestoreSecretCommand({ SecretId: secretName }));
            const retry = await client.send(
              new GetSecretValueCommand({ SecretId: secretName }),
            );
            existingData = JSON.parse(retry.SecretString || "{}");
          } catch {
            // If we still can't read, treat as not found
            return NextResponse.json(
              { error: "No exchanges found" },
              { status: 404 },
            );
          }
        } else {
          throw err;
        }
      }

      // Check if exchange exists
      if (!(exchangeName in existingData)) {
        return NextResponse.json(
          {
            error: "Exchange not found",
          },
          { status: 404 },
        );
      }

      // Remove the exchange
      const { [exchangeName]: removed, ...updatedData } = existingData;

      // If no exchanges left, delete the secret entirely
      if (Object.keys(updatedData).length === 0) {
        const deleteCommand = new DeleteSecretCommand({
          SecretId: secretName,
          ForceDeleteWithoutRecovery: true,
        });
        await client.send(deleteCommand);
      } else {
        // Update the secret with remaining exchanges
        const updateCommand = new UpdateSecretCommand({
          SecretId: secretName,
          SecretString: JSON.stringify(updatedData),
        });
        await client.send(updateCommand);
      }

      return NextResponse.json({
        success: true,
        message: "Exchange API credentials deleted successfully",
        exchangeName,
      });
    } catch (error) {
      if (error instanceof ResourceNotFoundException) {
        return NextResponse.json(
          {
            error: "No exchanges found",
          },
          { status: 404 },
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Error deleting exchange API:", error);
    return NextResponse.json(
      {
        error: "Failed to delete exchange API credentials",
      },
      { status: 500 },
    );
  }
}
