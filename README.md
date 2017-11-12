# ExpressJS vs Ts.ED perfomance

## Preparation

```bash
npm i
tsc
```
## Run apps

1. Express
```bash
NODE_ENV=production node pure_express.js
```
2. Ts.ED

```bash
NODE_ENV=production node TsED_server.js
```

## Test
Node version - v8.9.1
```bash
ab -k -c 20 -n 30000 http://127.0.0.1:8080/
```

## Results


| Framework                                            | requests per second (rps) | 50% response time, ms | 95%, ms | 100%, ms(longest request) |
|------------------------------------------------------|---------------------------|-----------------------|---------|---------------------------|
| pure express (pure_express.js)                       | 10314                     | 2                     | 3       | 7                         |
| express with some TsED features (express_as_TsED.js) | 6770                      | 2                     | 5       | 14                        |
| TsED (TsED_server.js)                                | 2983                      | 6                     | 13      | 24                        |
