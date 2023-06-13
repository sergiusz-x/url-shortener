const short_urls = []
//
const { find_url } = require("./database")
const { short_url_allowed_characters, short_url_length } = require("./config")
//
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
async function start_random_string_generator() {
    if(short_urls.length < 3) {
        await check_and_push_random_string()
    }
    //
    setTimeout(() => {
        start_random_string_generator()
    }, 1000);
}
//
async function check_and_push_random_string() {
    return new Promise(async (res, err) => {
        const random_string = generate_random_string(short_url_length)
        const check_if_exist = await find_url(random_string)
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
function generate_random_string(length) {
    let string = ""
    for(let i = 0; i < length; i++) {
        string += short_url_allowed_characters.charAt(Math.floor(Math.random()*short_url_allowed_characters.length))
    }
    //
    return string
}
//
module.exports = { start_random_string_generator, get_random_short_url }