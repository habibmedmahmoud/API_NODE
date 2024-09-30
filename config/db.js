const mongoose = require('mongoose');

async function connectToDB() {


    try {
        await mongoose.
        connect(process.env.MONGO_URL);
        console.log("Connected to Mongodb");

    } catch (error) {
        console.log("connection failed to mongodb ", error);

    }
}


module.exports = connectToDB;





// function connectToDB() {
//     //Connexion à la base de données MongoDB
//     mongoose.
//     connect(process.env.MONGO_URL).
//     then(() => console.log("Connected to Mongodb")).catch(((error) => console.log("connection failed to mongodb ", error)));
// }