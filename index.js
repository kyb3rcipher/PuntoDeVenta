const express = require('express');

// App Settings
const app = express();

/********** Routes **********/ 
app.get('/', (req, res) => {
    res.send(`<h1>Hello Gael</h1>`)
})


app.listen(3000);