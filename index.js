const express = require('express')
const dotenv = require('dotenv')
const google = require('googleapis');
dotenv.config({});


const app = express();
const port = 3000;

const oauth2Client = new google.Auth.OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
)

const scopes = ['https://www.googleapis.com/auth/calendar']

/*
async function getEvents() {
    const calendar = google.google.calendar({
        version: 'v3',
        auth: oauth2Client
    });
    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
    const events = res.data.items;
    if (!events || events.length === 0) {
      console.log('No events found.');
      return;
    }
    console.log('Events are:-------> ');


    events.map((event, i) => {
      const start = event.start.dateTime || event.start.date;
      console.log(`${ start} - ${ event.summary}`);
    });

  }
  */



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
    const calendar = google.google.calendar({
        version: 'v3',
        auth: oauth2Client
    });
    const result = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
    const events = result.data.items;

    if (!events || events.length === 0) {
      console.log('No events found.');
      return;
    }
    console.log('Events are:-------> ');
    events.map((event, i) => {
      const start = event.start.dateTime || event.start.date;
      console.log(`${ start} - ${ event.summary}`);
    });
    res.send(events);

})

app.listen(port, ()=>{
    console.log(`Example app listening at port: ${port}`);
})

