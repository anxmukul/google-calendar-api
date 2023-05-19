const express = require("express");
const dotenv = require("dotenv");
const google = require("googleapis");

const app = express();

dotenv.config({});

const port = process.env.PORT || 3000;

const oauth2Client = new google.Auth.OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

const scopes = ["https://www.googleapis.com/auth/calendar"];


app.get("/rest/v1/calendar/init/", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  res.redirect(url);
});

app.get("/rest/v1/calendar/redirect/", async (req, res) => {
  const code = req.query.code;

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  const calendar = google.google.calendar({
    version: "v3",
    auth: oauth2Client,
  });
  const result = await calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });
  const events = result.data.items;

  // Creating json to return events summary and time
  var jsonObj = {}; // empty Object
  var key = "Events";
  jsonObj[key] = []; // empty Array, which we can push() values into
  if (!events || events.length === 0) {
    console.log("No events found.");
    return;
  }
  console.log("Events are:-------> ");
  events.map((event, i) => {
    const start = event.start.dateTime || event.start.date;
    console.log(`${start} - ${event.summary}`);
    var tempobj = {
        "startTime": start,
        "Summary": event.summary
    }
    jsonObj[key].push(tempobj);
  });
  res.send(jsonObj);
});

app.listen(port, () => {
  console.log(`Example app listening at port: ${port}`);
});
