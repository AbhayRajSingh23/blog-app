import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
// app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory post array
let posts = [];
let idCounter = 1;

// Routes

// Home - Show all posts and form
app.get("/", (req, res) => {
  res.render("index.ejs", { posts });
});

// Handle post creation
app.post("/create", (req, res) => {
  const { title, content } = req.body;
  posts.push({ id: idCounter++, title, content });
  res.redirect("/");
});

// Show edit form
app.get("/edit/:id", (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  res.render("edit.ejs", { post });
});

// Handle edit submission
app.post("/edit/:id", (req, res) => {
  const { title, content } = req.body;
  const post = posts.find(p => p.id == req.params.id);
  if (post) {
    post.title = title;
    post.content = content;
  }
  res.redirect("/");
});

// Handle post deletion
app.post("/delete/:id", (req, res) => {
  posts = posts.filter(p => p.id != req.params.id);
  res.redirect("/");
});

// Start server
app.listen(port, () => {
  console.log(`✅ Blog app running at: http://localhost:${port}`);
});
