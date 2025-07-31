import {MongoClient, Db} from 'mongodb';
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {sendError} from "./sendError";
import {printInConsole} from "./printInConsole";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function connect(transport: StdioServerTransport, MONGODB_URI: string, dbName: string) {
    try {
        if (!MONGODB_URI) {
            sendError(transport, new Error('MONGODB_URI not defined'), 'db-config');
            return null;
        }

        // Return cached connection if available
        if (cachedClient && cachedDb) {
            await printInConsole(transport, 'Using cached database connection');
            return cachedDb;
        }

        // Create new connection with proper pooling
        const client = new MongoClient(MONGODB_URI, {
            maxPoolSize: 10,          // Limit concurrent connections
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4,                // Use IPv4
            maxIdleTimeMS: 30000,     // Close idle connections
            retryWrites: true,
        });

        await client.connect();
        const db = client.db(dbName);

        // Cache the connection
        cachedClient = client;
        cachedDb = db;

        await printInConsole(transport, 'New database connection established with pooling');

        process.on('SIGINT', async () => {
            if (cachedClient) {
                await cachedClient.close();
                cachedClient = null;
                cachedDb = null;
                console.log('MongoDB connection closed');
            }
        });

        return db;
    } catch (error: any) {
        sendError(transport, error instanceof Error ? error : new Error(String(error)), 'db-connection');
        throw error; // Don't exit process, let the application handle it
    }
}

async function closeConnection() {
    if (cachedClient) {
        await cachedClient.close();
        cachedClient = null;
        cachedDb = null;
    }
}

export {connect, closeConnection};
