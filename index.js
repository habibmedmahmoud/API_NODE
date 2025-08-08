const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./middlewaes/logger');
const connectToDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewaes/errors');
require('dotenv').config();



// // Vérifier la connexion à la base de données
// const db = mongoose.connection;
connectToDB();
const app = express()
// Middleware pour analyser les requêtes JSON
app.use(express.json());
app.use(logger);

// routes 
app.use("/api/books", require('./routes/books'));
app.use("/api/authors", require('./routes/author'));
app.use("/api/auth", require('./routes/auth'));
app.use("/api/users", require('./routes/user'));
app.use("/api/exchange-offers", require('./routes/exchangeOffers'));
app.use("/api/transactions", require('./routes/transaction'));
app.use("/api/mediators", require('./routes/mediatorRoutes'));
app.use("/api/complaints", require('./routes/complaintRoutes'));
app.use("/api/notifications", require("./routes/notificationRoutes"));




// Errur Hanbler middlwere 
app.use(notFound);
app.use(errorHandler);


// db.on('error', (error) => console.error('Connection error:', error));
// db.once('open', () => console.log('Connected to Database'));

// app.use(bodyParser.json()); // Pour parser les requêtes JSON


// error handler middlwaers

app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: err.message });
});
// Démarrer le serveur
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port: ${PORT}`);
});