// index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectToMongo = require("./db");
const path = require('path');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from 'uploads'

// Error handling middleware for JSON parsing errors
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('Bad JSON');
        return res.status(400).send({ error: 'Invalid JSON' });
    }
    next();
});

connectToMongo();

app.use(express.json())

app.use("/products", require("./Routes/products"))
app.use("/admin", require("./Routes/adminPanel"))
app.use("/auth", require("./Routes/auth"))

app.get('/', (req, res) => {
    res.json({ message: 'The server is working' });
});


app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
