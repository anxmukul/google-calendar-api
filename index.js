const express = require('express')
const dotenv = require('dotenv')
const google = require('googleapis')

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
    // res.send('Hello World this is Google calendar API Integration with nodejs')
})

app.get('/rest/v1/calendar/redirect/', (req, res) => {
    res.send("Got access to google calender");
})

app.listen(port, ()=>{
    console.log(`Example app listening at port: ${port}`);
})