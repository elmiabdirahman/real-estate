//dependencies
const express = require('express');
const bodyParser = require('body-parser');
const listings = require('./routers/listings.router');
//globals
const app = express();
const PORT = 5000;

//uses
app.use(express.static('server/public'));
app.use(bodyParser.urlencoded( { extended: true } ) );
app.use('/listings', listings);

//port listen
app.listen(PORT, () => {
    console.log('listening on port', PORT)
});
