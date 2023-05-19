const express = require('express')

const google = require('googleapis')

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World this is Google calendar API Integration with nodejs')
})

app.listen(port, ()=>{
    console.log(`Example app listening at port: ${port}`);
})