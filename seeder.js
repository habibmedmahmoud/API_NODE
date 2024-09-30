const {
    Book
} = require('./models/books');
const { books } = require('./data');
require('dotenv').config();
const connectToDB = require('./config/db');
//Coonection to db 


connectToDB();

// insert books seeder  database 

const
    importBooks = async() => {


        try {

            await Book.insertMany(books);
            console.log("books import");
        } catch (error) {
            console.log(error);
            process.exit(1);

        }
    }
    // remove books 
const removeBooks = async() => {


    try {

        await Book.deleteMany();
        console.log("books Removed");
    } catch (error) {
        console.log(error);
        process.exit(1);

    }
}

if (process.argv[2] === "-import") {
    importBooks();
} else if (process.argv[2] === "-remove") {
    removeBooks();

}