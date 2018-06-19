// const express = require('express');
// const http = require('http');

// const app = express();
// const server = http.createServer(app);
// const io = require('socket.io').listen(server);
// const request = require('request-promise');

// // app.use(cors({ origin: '*' }));
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Origin', 'http://159.65.75.193');
//   res.header('Access-Control-Allow-Origin', 'http://159.65.75.193/');
//   res.header('Access-Control-Allow-Origin', 'http://philbain.com');
//   res.header('Access-Control-Allow-Origin', 'http://philbain.com/');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//   next();
// });

// const port = 8080;

// io.on('connection', (client) => {
//   client.on('getPoloniexData', (interval, pair) => {
//     setInterval(() => {
//       const options = {
//         uri: `https://poloniex.com/public?command=returnOrderBook&currencyPair=${pair.primary}_${
//           pair.secondary
//         }&depth=20`,
//         headers: { 'User-Agent': 'Request-Promise' },
//         json: true
//       };
//       request(options).then(res => client.emit('pushPoloniexData', res));
//     }, interval);
//   });

//   client.on('getBittrexData', (interval, pair) => {
//     setInterval(() => {
//       const options = {
//         uri: `https://bittrex.com/api/v1.1/public/getorderbook?market=${pair.primary}-${
//           pair.secondary
//         }&type=both`,
//         headers: { 'User-Agent': 'Request-Promise' },
//         json: true
//       };
//       request(options).then(res => client.emit('pushBittrexData', res.result));
//     }, interval);
//   });

//   client.on('getBinanceData', (interval, pair) => {
//     setInterval(() => {
//       const options = {
//         uri: `https://api.binance.com/api/v1/depth?symbol=${pair.secondary}${
//           pair.primary
//         }&limit=20`,
//         headers: { 'User-Agent': 'Request-Promise' },
//         json: true
//       };
//       request(options).then(res => client.emit('pushBinanceData', res));
//     }, interval);
//   });
// });

// // routes (works):
// app.get('/api/getOrderBookPoloniex', (req, res) => {
//   const options = {
//     uri: 'https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_NXT&depth=20',
//     headers: { 'User-Agent': 'Request-Promise' },
//     json: true
//   };
//   request(options).then((x) => {
//     res.send(x);
//   });
// });

// server.listen(port, () => console.log(`Socket listening on port ${port}`));
