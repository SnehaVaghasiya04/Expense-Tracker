const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("App"));

let users = [];
let expenses = [];

// REGISTER
app.post("/api/register", (req, res) => {
    const { username, password, email, mobile, gender, city } = req.body;

    let exist = users.find(u => u.username === username);

    if (exist) {
        res.json({ msg: "User already exists" });
    } else {
        users.push({ username, password, email, mobile, gender, city });
        res.json({ msg: "Registration successful" });
    }
});

// LOGIN
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    let user = users.find(u => 
        u.username === username && u.password === password
    );

    if (user) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// EXPENSE APIs

// GET
app.get("/api/expenses", (req, res) => {
    res.json(expenses);
});

// ADD
app.post("/api/addExpense", (req, res) => {
    let data = req.body;
    data.id = Date.now();
    expenses.push(data);
    res.json({ msg: "Expense Added" });
});

// DELETE
app.delete("/api/deleteExpense/:id", (req, res) => {
    expenses = expenses.filter(e => e.id != req.params.id);
    res.json({ msg: "Deleted" });
});

// UPDATE
app.put("/api/updateExpense/:id", (req, res) => {
    let id = req.params.id;
    let updatedData = req.body;

    let index = expenses.findIndex(e => e.id == id);

    if(index !== -1){
        expenses[index] = { ...expenses[index], ...updatedData };
        res.json({ msg: "Expense Updated" });
    } else {
        res.json({ msg: "Not Found" });
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});