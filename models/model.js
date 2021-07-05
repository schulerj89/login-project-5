const mongodb = require('mongodb');
const mongodbClient = mongodb.MongoClient;

let client;

const connectDB = async() => {
    if(!client) client = await mongodbClient.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});
}

const db = () => {
    return client.db(process.env.MONGO_DBNAME);
}

module.exports = {
    connectDB: connectDB,
    db: db
}