const midtTransCLient = require("midtrans-client");

let snap = new midtTransCLient.Snap({
  isProduction: false,
  serverKey: process.env.SERVER_KEY_MIDTRANS,
  clientKey: process.env.CLIENT_KEY_MIDTRANS,
});

module.exports = snap;
