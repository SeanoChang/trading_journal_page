import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

/*
 load trade logs from exchanges.
 */
export default async function GET() {
    // check session
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // fetch user secret api key

    // iterate through all the api keys and fetch trade logs from exchanges

    // parse the trade logs

    // convert to defined trade schema

    // add all to our database

    // return trade logs
}