const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://n4k_user:7BgIIyjXuE78ScRC@cluster0.ehGufGu.mongodb.net/n4k_db?retryWrites=true&w=majority&appName=Cluster0";

exports.handler = async (event, context) => {
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        const db = client.db("n4k_db");
        const collection = db.collection("urls");

        if (event.httpMethod === "POST") {
            const { videoUrl, redirectUrl } = JSON.parse(event.body);
            const id = Math.random().toString(36).substring(2, 7);

            await collection.insertOne({
                id,
                videoUrl,
                redirectUrl: redirectUrl || "",
                createdAt: new Date()
            });

            return {
                statusCode: 200,
                body: JSON.stringify({ id }),
                headers: { 'Content-Type': 'application/json' } // Añade esta línea
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }), // Asegúrate de devolver JSON
            headers: { 'Content-Type': 'application/json' }
        };
    } finally {
        await client.close();
    }
};
