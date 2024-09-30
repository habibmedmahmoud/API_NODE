const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./middlewaes/logger');
const { notFound, errorHandler } = require('./middlewaes/errors');
require('dotenv').config();
const connectToDB = require('./config/db');



// Initialiser l'application express
const app = express();
const PORT = process.env.PORT;



// Middleware pour analyser les requêtes JSON
app.use(bodyParser.json());
app.use(logger);

// routes 
app.use("/api/books", require('./routes/books'));
app.use("/api/authors", require('./routes/author'));
app.use("/api/auth", require('./routes/auth'));
app.use("/api/users", require('./routes/user'));


// Errur Hanbler middlwere 
app.use(notFound);
app.use(errorHandler);
// // Vérifier la connexion à la base de données
// const db = mongoose.connection;
connectToDB();

// db.on('error', (error) => console.error('Connection error:', error));
// db.once('open', () => console.log('Connected to Database'));

// app.use(bodyParser.json()); // Pour parser les requêtes JSON


// error handler middlwaers

app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: err.message });
});
// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port: ${PORT}`);
});