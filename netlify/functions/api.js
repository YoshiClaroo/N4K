const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://n4k_user:7BgIIyjXuE78ScRC@cluster0.ehGufGu.mongodb.net/n4k_db?retryWrites=true&w=majority&appName=Cluster0"; // Reemplaza con tu string de conexión

exports.handler = async (event, context) => {
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        const db = client.db("n4k_db");
        const collection = db.collection("urls");
        
        if (event.httpMethod === "POST") {
            // Guardar nueva URL
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
                body: JSON.stringify({ id })
            };
        } 
        else if (event.httpMethod === "GET") {
            // Obtener URL por ID
            const { id } = event.queryStringParameters;
            const data = await collection.findOne({ id });
            
            if (!data) {
                return { statusCode: 404, body: "URL no encontrada" };
            }
            
            return {
                statusCode: 200,
                body: JSON.stringify(data)
            };
        }
    } catch (error) {
        return { statusCode: 500, body: error.toString() };
    } finally {
        await client.close();
    }
};
