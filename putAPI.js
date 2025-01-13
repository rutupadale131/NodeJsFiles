const path = require('path');
const express = require('express');
const app = express();
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

const dbPath = path.join(__dirname, "goodreads.db");

let db = null;

// Initialize DB and Server
const initializeDbAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
        app.listen(3000, () => {
            console.log("Server has been initialized.");
        });
    } catch (e) {
        console.log(e);
    }
};

// Middleware to parse JSON bodies
app.use(express.json());

// PUT route to update book details
app.put("/books/:bookId/", async (request, response) => {
    const { bookId } = request.params;
    const bookDetails = request.body;
    const {
        title,
        authorId,
        rating,
        ratingCount,
        reviewCount,
        description,
        pages,
        dateOfPublication,
        editionLanguage,
        price,
        onlineStores,
    } = bookDetails;

    const updateBookQuery = `
      UPDATE
        book
      SET
        title = ?,
        author_id = ?,
        rating = ?,
        rating_count = ?,
        review_count = ?,
        description = ?,
        pages = ?,
        date_of_publication = ?,
        edition_language = ?,
        price = ?,
        online_stores = ?
      WHERE
        book_id = ?;
    `;

    try {
        await db.run(updateBookQuery, [
            title,
            authorId,
            rating,
            ratingCount,
            reviewCount,
            description,
            pages,
            dateOfPublication,
            editionLanguage,
            price,
            onlineStores,
            bookId
        ]);
        response.send("Book Updated Successfully");
    } catch (e) {
        console.log(e);
        response.status(500).send("Internal Server Error");
    }
});

initializeDbAndServer();
