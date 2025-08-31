import {
    SecretsManagerClient,
    GetSecretValueCommand,
    CreateSecretCommand,
    UpdateSecretCommand,
    ResourceNotFoundException
} from '@aws-sdk/client-secrets-manager'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

let client: SecretsManagerClient | null = null

function getSecretsManagerClient(): SecretsManagerClient {
    if (!client) {
        client = new SecretsManagerClient({
            region: process.env.AWS_REGION,
            profile: process.env.AWS_PROFILE,
        })
    }
    return client
}

// Get all exchange API
export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const client = getSecretsManagerClient()
        const secretName = `trading-journal/${session.user.id}/exchanges`
        
        try {
            const getCommand = new GetSecretValueCommand({ SecretId: secretName })
            const getResult = await client.send(getCommand)
            const exchangeData = JSON.parse(getResult.SecretString || '{}')
            
            // Transform the data to return a list of exchanges with masked secrets
            const exchanges = Object.entries(exchangeData).map(([exchangeName, data]: [string, any]) => ({
                id: exchangeName,
                name: exchangeName,
                exchange: exchangeName,
                apiKey: data.api_key ? data.api_key.slice(0, 8) + '***' : '',
                secretKey: '***hidden***',
                isActive: true,
                created_at: data.created_at
            }))
            
            return NextResponse.json({ exchanges })
            
        } catch (error) {
            if (error instanceof ResourceNotFoundException) {
                // No secrets stored yet
                return NextResponse.json({ exchanges: [] })
            }
            throw error
        }

    } catch (error) {
        console.error("Error retrieving exchange APIs:", error)
        return NextResponse.json({ 
            error: "Failed to retrieve exchange API credentials" 
        }, { status: 500 })
    }
}

// Create exchange API
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { exchangeName, apiKey, secretKey } = await request.json()
        
        if (!exchangeName || !apiKey || !secretKey) {
            return NextResponse.json({ 
                error: "Missing required fields: exchangeName, apiKey, secretKey" 
            }, { status: 400 })
        }

        const client = getSecretsManagerClient()
        const secretName = `trading-journal/${session.user.id}/exchanges`
        
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
        
        let existingData = {}
        
        // Try to get existing secret first
        try {
            const getCommand = new GetSecretValueCommand({ SecretId: secretName })
            const getResult = await client.send(getCommand)
            existingData = JSON.parse(getResult.SecretString || '{}')
            console.log("Existing data:", existingData)
        } catch (error) {
            // Secret doesn't exist yet, will create new one
            if (!(error instanceof ResourceNotFoundException)) {
                throw error
            }
        }
        
        // Add new exchange to existing data
        const updatedData = {
            ...existingData,
            [exchangeName]: {
                api_key: apiKey,
                secret_key: secretKey,
                created_at: new Date().toISOString()
            }
        }

        // Create or update secret
        if (Object.keys(existingData).length === 0) {
            const createCommand = new CreateSecretCommand({
                // TODO: For production we will need to add KMS
                Name: secretName,
                SecretString: JSON.stringify(updatedData),
                Description: `Exchange API credentials for user ${session.user.id}`
            })
            const response = await client.send(createCommand)
            console.log(response)
        } else {
            const updateCommand = new UpdateSecretCommand({
                // TODO: For production we will need to add KMS
                SecretId: secretName,
                SecretString: JSON.stringify(updatedData)
            })
            const response = await client.send(updateCommand)
            console.log(response)
        }
        
        return NextResponse.json({ 
            success: true, 
            message: "Exchange API credentials stored successfully",
            exchangeName 
        })

    } catch (error) {
        console.error("Error creating exchange API:", error)
        return NextResponse.json({ 
            error: "Failed to store exchange API credentials"
        }, { status: 500 })
    }
}

// Delete exchange API
export async function DELETE(){}