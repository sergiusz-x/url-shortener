const express = require("express")
const https = require('https')
const http = require('http')
const { port_http, port_https, redirect_url_not_found, short_url_allowed_characters, short_url_length, create_request_limiter } = require("./config")
//
const app = express()
//
const https_server = https.createServer(app)
const http_server = http.createServer(app)
//
app.use(express.json())
//
//
const { connect_mongodb, find_url, insert_short_url, update_document_stats } = require("./database")
const { start_random_string_generator, get_random_short_url } = require("./short_url_generator")
//
connect_mongodb().then(() => {
    //
    start_random_string_generator()
    update_document_stats()
    //
})
//
//
const reserved_links = [redirect_url_not_found.substring(1)]
app.get("/:SHORT_URL", async (req, res, next) => {
    const { SHORT_URL } = req.params
    if(!SHORT_URL) return send_error(res, 404)
    //
    if(reserved_links.includes(SHORT_URL)) return next()
    if(SHORT_URL.length != short_url_length || !validate_short_url_string(SHORT_URL)) return res.redirect(308, redirect_url_not_found)
    //
    const find = await find_url(SHORT_URL, undefined, true)
    //
    if(find) {
        res.redirect(307, find.long_url)
    } else {
        res.redirect(308, redirect_url_not_found)
    }
})
//
let map_request_counter = new Map()
app.post("/create", async (req, res) => {
    const ans = {
        success: false,
        message: "",
        result: ""
    }
    const document = {
        short_url: "",
        long_url: "",
        expiration_timestamp: Date.now() + 1000 * 60 * 60 * 24 * 365 * 1, // 1 year
        uses: 0,
        max_uses: -1
    }
    //
    let ip_request_count = map_request_counter.get(req.ip) || 0
    if(ip_request_count >= create_request_limiter.max) {
        ans.message = "Too many requests"
        return send_error(res, 400, ans)
    } else {
        map_request_counter.set(req.ip, ip_request_count+1)
        setTimeout(() => {
            ip_request_count = map_request_counter.get(req.ip) || 1
            map_request_counter.set(req.ip, ip_request_count-1)
        }, create_request_limiter.time);
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
    const check_if_exist = await find_url(undefined, req.body.url)
    if(check_if_exist) {
        ans.success = true
        ans.message = "This short URL is already created"
        ans.result = check_if_exist.short_url
        return res.status(200).json(ans)
    }
    //
    //
    const short_url = await get_random_short_url()
    document.short_url = short_url
    document.long_url = req.body.url
    //
    if(req.body.expiration_timestamp && !isNaN(req.body.expiration_timestamp)) {
        if(req.body.expiration_timestamp > Date.now() && req.body.expiration_timestamp < document.expiration_timestamp) {
            document.expiration_timestamp = req.body.expiration_timestamp
        }
    }
    if(req.body.max_uses && !isNaN(req.body.max_uses)) {
        if(req.body.max_uses > 0) {
            document.max_uses = req.body.max_uses
        }
    }
    //
    await insert_short_url(document)
    //
    ans.success = true
    ans.message = "Successfully created new short url"
    ans.result = short_url
    //
    res.status(200).json(ans)
})
//
app.post("/stats/:SHORT_URL", async (req, res) => {
    const { SHORT_URL } = req.params
    //
    let ans = {
        success: false,
        message: "",
        short_url: "",
        long_url: "",
        expiration_timestamp: 0,
        uses: 0,
        max_uses: -1
    }
    //
    if(!SHORT_URL || SHORT_URL.length != short_url_length || !validate_short_url_string(SHORT_URL)) {
        ans.message = "Invalid short URL"
        return send_error(res, 400, ans)
    }
    //
    const document = await find_url(SHORT_URL)
    //
    if(!document) {
        ans.message = "Short URL not found"
        return send_error(res, 400, ans)
    }
    //
    ans.success = true
    ans.message = "Short URL found"
    ans.short_url = SHORT_URL
    ans.long_url = document.long_url
    ans.expiration_timestamp = document.expiration_timestamp
    ans.uses = document.uses
    ans.max_uses = document.max_uses
    //
    res.status(200).json(ans)
})
//
app.get("*", (req, res) => {
    send_error(res, 404)
})
//
function validate_url(url) {
    // if(!url.startsWith("http")) return false
    if(!url.includes(".")) return false
    if(url.split(".")[0].length == 0 || url.split(".")[1].length == 0) return false
    if(url.split(".").reverse()[0].length == 0) return false
    return true
}
//
function validate_short_url_string(short_url_string) {
    let pass = true
    short_url_string.split("").forEach(char => {
        if(!short_url_allowed_characters.includes(char)) return pass = false
    })
    //
    return pass
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
    res.send("Error 500")
}
//
http_server.listen(port_http, () => {
    console.log(`API HTTP  working on port ${port_http}`)
})
https_server.listen(port_https, () => {
    console.log(`API HTTPS working on port ${port_https}`)
})