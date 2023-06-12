const express = require("express")
const https = require('https')
const http = require('http')
//
const app = express()
const port_http = 3000
const port_https = 3001
//
const https_server = https.createServer(app)
const http_server = http.createServer(app)
//
app.use(express.json())
//
//
const { connect_mongodb, find_short_url, insert_short_url } = require("./database")
const { start_short_url_generator, get_random_short_url } = require("./short_url_generator")
//
connect_mongodb().then(() => {
    //
    start_short_url_generator()
    //
})
//
//
//
app.get("/:SHORT_URL", async (req, res) => {
    const { SHORT_URL } = req.params
    if(!SHORT_URL) return send_error(res, 404)
    //
    const find = await find_short_url(SHORT_URL)
    //
    if(find) {
        res.redirect(307, find.long_url)
    }
})
//
app.post("/create", async (req, res) => {
    const ans = {
        success: false,
        message: "",
        result: ""
    }
    const document = {
        short_url: "",
        long_url: "",
        expiration_timestamp: Date.now() + 1000 * 60 * 60 * 24 * 365 * 1 // 1 year 
    }
    //
    if(!req.body?.url) {
        ans.message = "No required data"
        return send_error(res, 400, ans)
    }
    //
    if(!validate_url(req.body.url)) {
        ans.message = "Invalid URL link"
        return send_error(res, 400, ans)
    }
    //
    //
    /* SPRAWDZIĆ CZY LINK JEST JUŻ W BAZIE DANYCH, JEŚLI TAK TO ZWRÓCIĆ DANE Z TEGO DOKUMENTU I ZAKTUALIZOWAĆ DATE WYGAŚNIĘCIA */
    //
    //
    const short_url = await get_random_short_url()
    document.short_url = short_url
    document.long_url = req.body?.url
    //
    const save_in_db = await insert_short_url(document)
    //
    ans.success = true
    ans.message = "Successfully created new short url"
    ans.result = short_url
    //
    res.status(200).json(ans)
})
//
app.get("*", (req, res) => {
    send_error(res, 404)
})
//
function validate_url(url) {
    if(!url.startsWith("http")) return false
    if(!url.includes(".")) return false
    if(url.split(".")[0].length == 0 || url.split(".")[1].length == 0) return false
    if(url.split(".").reverse()[0].length == 0) return false
    return true
}
//
function send_error(res, code, ans) {
    if(code == 404) {
        return res.send("Error 404")
    }
    if(code == 400) {
        return res.json(ans)
    }
    //
    res.send("Error ???")
}
//
http_server.listen(port_http, () => {
    console.log(`API HTTP  working on port ${port_http}`)
})
https_server.listen(port_https, () => {
    console.log(`API HTTPS working on port ${port_https}`)
})