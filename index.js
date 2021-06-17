const express = require("express");
var bodyParser = require("body-parser");
const cors = require("cors");
var braintree = require("braintree");

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "XXXXX",
  publicKey: "XXXX",
  privateKey: "XXXX",
});

const app = express();
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const port = 4000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/createCustomer", (req, res) => {
  gateway.customer
    .create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      company: req.body.company,
      email: req.body.email,
    })
    .then((result) => {
      res.json({ ...req.body, ...result });
    });
});
app.post("/getClientToken", (req, res) => {
  gateway.clientToken
    .generate({
      customerId: req.body.values,
    })
    .then((response) => {
      // pass clientToken to your front-end
      const clientToken = response.clientToken;
      res.json({ clientToken: clientToken });
    });
});
app.post("/payAmount", (req, res) => {
  gateway.transaction
    .sale({
      amount: "150.00",
      paymentMethodNonce: req.body.nonce,
      options: {
        submitForSettlement: true,
      },
    })
    .then((result) => {
      if (result.success) {
        // See result.transaction for details
        res.json({ ...result });
      } else {
        // Handle errors
        res.json({ ...result });
      }
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
