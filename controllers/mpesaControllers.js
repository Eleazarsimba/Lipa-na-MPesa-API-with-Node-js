require('dotenv').config();
const datetime = require('node-datetime');
const axios = require('axios');
    
//generate password
const passkey = process.env.PassKey;
const shortcode = process.env.ShortCode;
const consumerkey = process.env.ConsumerKey;
const consumersecret = process.env.ConsumerSecret;

const newPassword = () => {
    const dt = datetime.create();
    const formatted = dt.format("YmdHMS");

    const passString = shortcode + passkey + formatted;
    const base64EncodedPassword = Buffer.from(passString).toString('base64');
    return base64EncodedPassword;
}

//general route
exports.home = (req, res) => {
    res.send('Welcome here');
 };

//get authentication token
exports.tokenauth = (req, res, next) => {
    const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
    const auth = 'Basic ' + Buffer.from(consumerkey + ':' + consumersecret).toString('base64');
    const headers = {
        Authorization: auth
    }

    axios
    .get(url, {
        headers
    })
    .then((response) => {
        console.log(response.data);
        let data = response.data;
        let access_token = data.access_token
        req.token = access_token;
        next();
    })
    .catch((error) => console.log(error));
}

// stk push
exports.stkpush = (req, res) => {
    const token = req.token;
    const amount = req.body.amount;
    const phone = req.body.phone;
    
    const timestamp = datetime.create().format("YmdHMS");
    const stkurl = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

    const headers = {
        Authorization: 'Bearer ' + token
    }
    let data = {
        BusinessShortCode: shortcode,
        Password: newPassword(),
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: shortcode,
        PhoneNumber: phone,
        CallBackURL: "https://mydomain.com/path",
        AccountReference: "Eleazar store",
        TransactionDesc: "Lipa na M-Pesa" 
    }
    // var amount = 10;
    axios
    .post(stkurl, data, { headers })
    .then(response => {
        res.send(response.data)
        console.log(response.data.CheckoutRequestID)
    })
    .catch((error) => console.log(error))
}