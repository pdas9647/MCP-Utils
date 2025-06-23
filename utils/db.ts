import {MongoClient} from 'mongodb';
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {printInConsole} from "./printInConsole";
import {sendError} from "./sendError";

async function connect(transport: StdioServerTransport, MONGODB_URI: string, dbName: string) {
    let db: any;
    try {
        if (!MONGODB_URI) {
            sendError(transport, new Error('MONGODB_URI not defined'), 'db-config');
            return null;
        }

        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        db = client.db(dbName);
        await printInConsole(transport, 'Database connected');
    } catch (error: any) {
        sendError(transport, error instanceof Error ? error : new Error(String(error)), 'db-connection');
        process.exit(1);
    }
    return db;
}

export {connect}
