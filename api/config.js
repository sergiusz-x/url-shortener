module.exports = {
    redirect_url_not_found: "/404",
    //
    short_url_allowed_characters: "ABCDEFGHKMNPQRSTUVWXYZabcdefghkmnpqrstuvwxyz0123456789", // [A-Z], [a-z], [0-9] / Without I,J,L,O,i,j,l,o because they are easy to missprehent
    short_url_length: 5,
    //
    create_request_limiter: {
        max: 5,
        time: 1000 * 60
    },
    //
    host_website: false,
    website_location: "/../website/build",
    //
}