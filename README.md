
# 🔗 URL Shortener 🔗

This project includes API and React.js app for frontend

## API Reference

### Redirect from short to long URL

```http
  GET /${SHORT_CODE}
```

| Parameter | Type | Required | Description |
| :- | :- | :- | :- |
| `SHORT_CODE` | `string` | yes | Code from short URL |

**Response**
Redirects to long URL or to /404 if not found




### Create short URL

```http
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

```http
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




