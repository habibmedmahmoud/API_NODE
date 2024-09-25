const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const logger = require('./middlewaes/logger');
const booksPath = require('./routes/books');
const authorsPath = require('./routes/author');
const authPath = require('./routes/auth');
const dotenv = require('dotenv');
dotenv.config();


// Initialiser l'application express
const app = express();
const PORT = process.env.PORT;



// Middleware pour analyser les requêtes JSON
app.use(bodyParser.json());
app.use(logger);

//Connexion à la base de données MongoDB
mongoose.
connect(process.env.MONGO_URL).
then(() => console.log("Connected to Mongodb")).catch(((error) => console.log("connection failed to mongodb ", error)));

// // Vérifier la connexion à la base de données
// const db = mongoose.connection;

// db.on('error', (error) => console.error('Connection error:', error));
// db.once('open', () => console.log('Connected to Database'));

// app.use(bodyParser.json()); // Pour parser les requêtes JSON
// routes 
app.use("/api/books", booksPath);
app.use("/api/authors", authorsPath);
app.use("/api/auth", authPath);


// error handler middlwaers

app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: err.message });
});
// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port: ${PORT}`);
});