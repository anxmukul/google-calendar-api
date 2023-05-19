const express = require('express')
const dotenv = require('dotenv')
const google = require('googleapis');
// const { auth } = require('googleapis/build/src/apis/abusiveexperiencereport');

const app = express();
const port = 3000;
dotenv.config({});

const oauth2Client = new google.Auth.OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
)

const scopes = ['https://www.googleapis.com/auth/calendar']


app.get('/rest/v1/calendar/init/', (req, res) => {

    const url = oauth2Client.generateAuthUrl({
        access_type : "offline",
        scope : scopes
    })
    res.redirect(url)
})

app.get('/rest/v1/calendar/redirect/', async (req, res) => {

    const code = req.query.code;

    const {tokens} = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens);

 
})

app.listen(port, ()=>{
    console.log(`Example app listening at port: ${port}`);
})