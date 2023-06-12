const { MongoClient } = require('mongodb')
const { mongodb_uri, mongodb_db_name } = require("./config")
//
let database
let urls_collection
//
async function connect_mongodb(){
    const client = new MongoClient(mongodb_uri)
    //
    await client.connect();
    //
    console.log("MongoDB successfully connected")
    //
    const db = client.db(mongodb_db_name)
    //
    database = db
    //
    urls_collection = database.collection("urls")
}

async function find_short_url(short_url) {
    return new Promise(async (res, err) => {
        const result = await urls_collection.findOne({ short_url: short_url })
        res(result)
    })
}

async function insert_short_url(document) {
    return new Promise(async (res, err) => {
        const result = await urls_collection.insertOne(document)
        res(result.insertedId)
    })
}

module.exports = { connect_mongodb, find_short_url, insert_short_url }