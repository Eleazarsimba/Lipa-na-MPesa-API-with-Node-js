const express = require('express');
const cors = require('cors')
const app = express();
var bodyParser = require('body-parser');
require('dotenv').config();
const port = process.env.PORT;

const corsOptions = {
    // origin: 'http://localhost:3000',
    origin: 'https://beautiful-cannoli-3b9505.netlify.app/',
    optionsSuccessStatus: 200
  }
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const mpesaroute = require('./routes/mpesaRoutes');
app.use(mpesaroute)

app.listen(port, () => {
    console.log(`The app is running in port ${port}`);
})