# 📚 Book Rating App

This is a simple Book Rating application where you can add, edit, and view a list of books. The backend is built using Node.js and PostgreSQL, with dynamic content updates and cover images fetched from the OpenLibrary API.

## 🔧 Technologies Used

- **Node.js** + **Express.js**
- **EJS** template engine
- **PostgreSQL** database
- **OpenLibrary API** for book cover fetching
- **Bootstrap / SASS** (optional for frontend styling)

---

## 🚀 Features

- 📖 Add new books (with automatic cover fetch from OpenLibrary)
- 📝 Edit book details directly from the list
- ✅ Store all data in the PostgreSQL database
- 🎯 All fields are editable (title, author, summary, genre, rating, date, cover)

---

## 🛠️ Installation
 **Clone the repository:**
   ```bash
   git clone https://github.com/username/book-rating-app.git
   cd book-rating-app

```
**Install dependecies:**
```bash
npm install
```
**Set up environment variables:**
DB_USER=postgres
DB_PASSWORD=YOUR_PASSWORD
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bookrating

**Run the app:**

```bash
node index.js
```

✍️ Author
Developed by WhoKnocks