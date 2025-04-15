const express = require('express');

const router = require('./src/routers/router')

const app = express();

app.use(express.json());

app.use("/api", router);

app.listen(8000, () => {
    console.log("API ONLINE");
});