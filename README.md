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
```bash
ab -k -c 20 -n 30000 http://127.0.0.1:8080/
```

## Results

* Express ~ 10000 rps
* Ts.ED ~ 2000 rps
