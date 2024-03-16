# 🔗 URL Shortener

This project includes backend API (using [express.js](https://expressjs.com/) and [MongoDB](https://www.mongodb.com/)) and frontend (using [React.js](https://react.dev/)). With this project I wanted to learn some React.js so frontend is not perfect. <br />
This is a simple URL shortener that converts long links to short ones. And then it redirects the user from the short URL to the long equivalent. <br />

## 💻 Preview


![MP4]([https://github.com/sergiusz-x/url-shortener/raw/main/readme/url-shortener.mp4](https://github.com/sergiusz-x/url-shortener/assets/80598300/50fc5972-a3f3-4430-8562-d469bbe26af9))

![Main Page](https://github.com/sergiusz-x/url-shortener/blob/main/readme/main_page_1.png)

![Main Page](https://github.com/sergiusz-x/url-shortener/blob/main/readme/main_page_2.png)

![Stats Page](https://github.com/sergiusz-x/url-shortener/blob/main/readme/stats_page.png)


## API Reference


### Redirect from short to long URL

```
  GET /${SHORT_CODE}
```

| Parameter | Type | Required | Description |
| :- | :- | :- | :- |
| `SHORT_CODE` | `string` | yes | Code from short URL |

**Response** <br />
Redirects to long URL or to /404 if not found




### Create short URL

```
  POST /create
```

| Parameter | Type | Required | Description |
| :- | :- | :- | :- |
| `url` | `string` | yes | Long URL |
| `expiration_timestamp` | `timestamp` | no | Short URL expiration date, no more than one year |
| `max_uses` | `number` | no | Max number of short URL uses |

**Response**  
```javascript
{
    success: boolean,
    message: "string",
    result: "string"
}
```
| Value  | Description |
| :- | :- |
| `success` | If short URL created successfully |
| `message` | Information message |
| `result` | Short URL code |





### Get short URL statistics

```
  POST /stats/${SHORT_CODE}
```

| Parameter | Type | Required | Description |
| :- | :- | :- | :- |
| `SHORT_CODE` | `string` | yes | Code from short URL |

**Response**
```javascript
{
    success: boolean,
    message: "string",
    short_url: "string",
    long_url: "string",
    expiration_timestamp: number,
    uses: number,
    max_uses: number
}
```
| Value  | Description |
| :- | :- |
| `success` | Whether the short URL was found |
| `message` | Information message |
| `short_url` | Short URL code |
| `long_url` | Long URL |
| `expiration_timestamp` | Short URL expiration date |
| `uses` | Number of short URL uses |
| `max_uses` | Maximum number of short URL uses or `-1` if unlimited |
