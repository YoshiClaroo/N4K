const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://n4k_user:7BgIIyjXuE78ScRC@cluster0.ehGufGu.mongodb.net/n4k_db?retryWrites=true&w=majority&appName=Cluster0";

exports.handler = async (event, context) => {
    // Solo acepta solicitudes POST
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Método no permitido" })
        };
    }

    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        const { videoUrl, redirectUrl } = JSON.parse(event.body);
        const id = Math.random().toString(36).substring(2, 7); // Genera ID como "d73j2"

        const db = client.db("n4k_db");
        await db.collection("urls").insertOne({
            id,
            videoUrl,
            redirectUrl: redirectUrl || "",
            createdAt: new Date()
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ id }), // Asegúrate de devolver { id }
            headers: { 'Content-Type': 'application/json' }
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    } finally {
        await client.close();
    }
};
