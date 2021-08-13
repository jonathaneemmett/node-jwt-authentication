const express = require('express');
const connectDB = require('./config/db');

const port = process.env.PORT || 5000;

const app = express();

// Connect Database
connectDB();

// init
app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
    res.status(200).json({msg: `Welcome to the Herbal Events api...`})
})

// define routes
app.use('/api/users', require('./routes/users'));

const server = app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
});

