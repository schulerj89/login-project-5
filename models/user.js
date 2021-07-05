const { connectDB, db } = require('./model.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const UserStore = {
    create: async (data) => {
        try {
            await connectDB();
            const collection = db().collection(process.env.MONGO_COLLECTION);
            data.password = await hashpass(password);
            await collection.insertOne(data);
            console.log("inserted one");
        } catch(err) {
            console.log(err);
        }
        return data;
    },
    checkPassword: async (username, password) => {
        return false;
    },
    readAll: async () => {
        let col = [];

        try {
            await connectDB();
            const collection = db().collection(process.env.MONGO_COLLECTION);
            col = await collection.find().toArray();
            return col;
        } catch(err) {
            console.log(err);
        }

        return col;
    }
}

async function hashpass(password) {
    let salt = await bcrypt.getSalt(saltRounds);
    let hashed = await bcrypt.hash(password, salt);
    return hashed;
}

module.exports = {
    usersModel: UserStore,
    hashPass: hashpass
}