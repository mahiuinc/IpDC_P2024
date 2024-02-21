const express = require('express');
const app = express();

const PORT = process.env.PORT || 6000;

app.get("/", (req, res) => {
    //console.log("Hello world from console")
    res.send('Hello World!!!!');
});

const server = app.listen(PORT, () => {
    console.log("server is running on port", server.address().port);
});