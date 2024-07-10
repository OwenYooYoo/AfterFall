const { MongoClient, ServerApiVersion } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://6420015:afterfallSP1@clusteraf.lcvf3mb.mongodb.net/?retryWrites=true&w=majority&appName=ClusterAF"; 
    const client = new MongoClient(uri, {
        serverApi: ServerApiVersion.v1,
        connectTimeoutMS: 10000, // 10-second timeout
    });

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('afterfall');
        console.log('Connected to database');
        const usersCollection = db.collection('users');
        console.log('Connected to Users collection');

    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    } finally {
        await client.close();
    }
}

main().catch(console.error);