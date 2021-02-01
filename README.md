# dr-collector-api

### API References
The following GET requests are supported to fetch data from Dr. Collector.

#### /v1/ping
> Check if server is still alive.
```javascript
Arguments: none
Returns: <Object>
Example: {
  statusCode: 200
}
```

#### /v1/intervals
> Get a list of supported intervals by Dr. Collector
```javascript
Arguments: none
Returns: <Array>
Example: [
  {
    "interval": "1m" <String>
    "intervalInSeconds": 60 <Number>
  }
]
```

#### /v1/pools
> Get a list of supported poolContracts by Dr. Collector. Contains additional information about the pool itself as well.
```javascript
Arguments: none
Returns: <Array>
Example: [
  {

  }
]
```
