const Database = require('better-sqlite3')
const db = new Database('./habit-tracker.db')


// Habits table
db.exec(`CREATE TABLE IF NOT EXISTS habits (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        type TEXT NOT NULL,
        time_range TEXT NOT NULL,
        active INTEGER NOT NULL DEFAULT 1
    )`
)

// Logs table
db.exec(`CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY,
        habit_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (habit_id) references habits(id)
        UNIQUE(habit_id, date)
    )`
)

console.log("Database Tables Created!!!")

// Allows other files to utilize db object when require('./database')
module.exports = db