module.exports = {
    port_http: 8080,
    port_https: 8081,
    //
    mongodb_uri: "MONGO_DB_URI_ADDRESS",
    mongodb_db_name: "MONGO_DB_NAME",
    //
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
    host_website: false, // set to true if you want API server to host the website
    website_location: "/../website/build", // location of the react build
    //
}