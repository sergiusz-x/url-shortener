const short_urls = []
//
const { find_short_url } = require("./database")
//
async function start_short_url_generator() {
    if(short_urls.length < 10) {
        await check_and_push_random_string()
    }
    //
    setTimeout(() => {
        start_short_url_generator()
    }, 1000);
}
//
async function get_random_short_url() {
    if(short_urls[0]) {
        return short_urls.shift()
    }
    //
    return new Promise((res, err) => {
        setTimeout(() => {
            return res(get_random_short_url())
        }, 10);
    })
    //
}
//
async function check_and_push_random_string() {
    return new Promise(async (res, err) => {
        const random_string = generate_random_string(7)
        const check_if_exist = await find_short_url(random_string)
        //
        if(!check_if_exist && !short_urls.includes(random_string)) {
            short_urls.push(random_string)
            res(true)
        } else {
            res(false)
        }
    })
}
//
const allowedCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
function generate_random_string(length) {
    let string = ""
    for(let i = 0; i < length; i++) {
        string += allowedCharacters.charAt(Math.floor(Math.random()*allowedCharacters.length))
    }
    //
    return string
}
//
module.exports = { start_short_url_generator, get_random_short_url }