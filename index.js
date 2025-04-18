import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: process.env.DB_USER,           
    host: process.env.DB_HOST,           
    database: process.env.DB_NAME,       
    password: process.env.DB_PASSWORD,   
    port: process.env.DB_PORT,           
  });
db.connect();
let books = [];

await db.query("SELECT * FROM books",(err, dbres)=>{
    try {
        dbres.rows.forEach(book => {
            books.push(book);
        });
    } catch (err) {
        console.log(err);
    }
})
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/",(req,res)=>{
    res.render("index.ejs",{
        title:"Book Rating App",
        books:books
    })
   // console.log(books);
})
app.get("/new",(req,res)=>{
    res.render("new.ejs",{
        books:books
    });
})
app.post("/edit", async (req, res) => {
    const updatedBooks = req.body.books; 
    console.log(updatedBooks);
    try {
      for (const id in updatedBooks) {
        const book = updatedBooks[id];
        
        const updID = parseInt(book.id); 
        const updTit = book.title;
        const updAuth = book.writer;
        const updSum = book.summary;
        const updGnr = book.genre;
        const updDate = book.dateofreading;
        const updRat = parseInt(book.rating);
        const updURL = book.coverurl;
  
        if (!updID || !updTit) continue;

        await db.query(
          `UPDATE books SET 
            title = $1, 
            writer = $2,  
            summary = $3, 
            genre = $4, 
            rating = $5, 
            coverurl = $6, 
            dateofreading = $7 
           WHERE id = $8`,
          [updTit, updAuth, updSum, updGnr, updRat, updURL, updDate, updID]
        );
        //changing locally in books[]
        const index = books.findIndex(book => book.id === updID);
        if (index !== -1) {
          books[index] = {
            ...books[index], 
            title: updTit,
            writer: updAuth,
            summary: updSum,
            genre: updGnr,
            rating: updRat,
            coverurl: updURL,
            dateofreading: updDate
          };
        }
      }
   
      res.redirect("/new");

    } catch (err) {
      console.error("Failed to update books", err);
      res.status(500).send("Failed to update books");
    }
  });
  
app.post("/new",async(req,res)=>{
    const newTitle = req.body.title;
    const newAuthor = req.body.author;
    const newSummary = req.body.summary;
    const newRating = req.body.ratings;
    const newGenre = req.body.genre;
    const newDate = req.body.date;
    const url = `https://openlibrary.org/search.json?title=
    ${encodeURIComponent(newTitle)}&author=${encodeURIComponent(newAuthor)}`;
    let response, data;
try {
    response = await fetch(url);
    data = await response.json();
} catch (err) {
    console.error("API error:", err);
    return res.render("index", { book: null, error: "Unable to reach API" });
}
let coverUrl = "/placeholder.jpg"; 
if (data.docs.length > 0) {
    const bookData = data.docs[0];
    const isbn = bookData.cover_i ? bookData.cover_i : null;
    console.log(isbn);
    coverUrl = isbn ? `https://covers.openlibrary.org/b/id/${isbn}-L.jpg` : coverUrl;
        } else {   
            res.render("index", { book: null, error: "Not found!" });
        }
    try {
        await db.query(
            "INSERT INTO books (title, writer, summary, genre, rating, coverurl, dateofreading) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            [newTitle, newAuthor, newSummary, newGenre, newRating, coverUrl, newDate],
            (err, result) => {
                if (err) {
                    console.error("SQL error:", err);
                    return res.render("index", { book: null, error: "Failed to save to the database" });
                }
                books.push({ title: newTitle, writer: newAuthor, summary: newSummary, genre: newGenre,rating:newRating, coverurl: coverUrl , date: newDate});
                res.redirect("/"); 
            }
        )
    } catch (err) {
        console.log(err);
    }
}) 
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});

