const { MongoClient } = require('mongodb')
require('dotenv').config()
//
let database
let urls_collection
let documents_to_update_queue = []
//
async function connect_mongodb(){
    console.log("Starting MongoDB connection")
    //
    const client = new MongoClient(process.env.MONGODB_URI)
    //
    await client.connect()
    console.log("MongoDB successfully connected")
    //
    const db = client.db(process.env.MONGODB_DB_NAME)
    database = db
    //
    urls_collection = database.collection("urls")
}
//
async function find_url(short_url, long_url, is_user_search) {
    return new Promise(async (res, err) => {
        let query
        if(short_url) {
            query = { short_url: short_url }
            
        } else if(long_url) {
            query = { long_url: long_url }
        }
        //
        if(!query) return res(null)
        //
        const result = await urls_collection.findOne(query)
        res(result)
        //
        if(result && is_user_search) documents_to_update_queue.push(result)
    })
}
//
async function update_document_stats() {
    const document = documents_to_update_queue.shift()
    if(document) {
        if((document.max_uses > 0 && document.uses+1 == document.max_uses) || Date.now() > document.expiration_timestamp) {
            await urls_collection.deleteOne({ _id: document._id })
        }  else {
            await urls_collection.updateOne({ _id: document._id }, { $inc: { uses: 1 } })
        }
    }
    //
    setTimeout(() => {
        update_document_stats()
    }, 5);
}
//
async function insert_short_url(document) {
    return new Promise(async (res, err) => {
        const result = await urls_collection.insertOne(document)
        res(result.insertedId)
    })
}
//
module.exports = { connect_mongodb, find_url, insert_short_url, update_document_stats }