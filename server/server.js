require('dotenv').config()

const express = require('express')
const path = require('path')
const app = express()
const PORT = 3000 // process.env.PORT || 3000
const db = require('./database') // Pulls database from database.js

const clientPath = path.join(__dirname, '../client')
console.log('Client path:', clientPath)

app.use(express.static(clientPath))
app.use(express.json())

// Password protection
app.use((req, res, next) => {
    const auth = req.headers.authorization
    
    if (!auth || !auth.startsWith('Basic ')) {
        res.set('WWW-Authenticate', 'Basic realm="Habit Tracker"')
        return res.status(401).send('Authentication required')
    }
    
    const credentials = Buffer.from(auth.split(' ')[1], 'base64').toString()
    const [, password] = credentials.split(':')
    
    if (password === process.env.APP_PASSWORD) {
        next()
    } else {
        res.set('WWW-Authenticate', 'Basic realm="Habit Tracker"')
        res.status(401).send('Invalid credentials')
    }
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'))
})

// Get active habits
app.get('/api/habits', (req, res) => {
    const habits = db.prepare('SELECT * FROM habits WHERE active = 1').all()

    console.log('ALL ACTIVE HABITS: ', habits)

    res.json(habits) // Send habits to frontend
})

// Get inactive habits
app.get('/api/habits/inactive', (req, res) => { 
    const inactiveHabits = db.prepare('SELECT * FROM habits WHERE active = 0').all()

    console.log('ALL INACTIVE HABITS:', inactiveHabits)

    res.json(inactiveHabits) // Send inactive habits to frontend
})

// Create a new habit
app.post('/api/habits', (req, res) => {
    const { name, type, time } = req.body // Extract data from the frontend request's body

    const result = db.prepare('INSERT INTO habits (name, type, time_range) VALUES (?, ?, ?)').run(name, type, time)
    
    res.json({ // Send new habit back to frontend
        id: result.lastInsertRowid, // id of habit that was just made
        name,
        type,
        time_range: time,
        active: 1
    })
})

// Soft delete a habit
app.put('/api/habits/:id', (req, res) => {
    const { id } = req.params

    const result = db.prepare('UPDATE habits SET active = ? WHERE id = ?').run(0, id)

    res.json({ success: true })
})

// Recover an inactive habit
app.put('/api/habits/:id/recover', (req, res) => {
    const { id } = req.params

    db.prepare('UPDATE habits SET active = ? WHERE id = ?').run(1, id)

    res.json({success: true})
})

// WIP: need to cascade delete all logs
// Hard delete a habit
// app.delete('/api/habits/:id', (req, res) => {
//     const { id } = req.params

//     db.prepare('DELETE FROM habits WHERE id = ?').run(id)

//     res.json({ success: true })
// })

// Get all logs
app.get('/api/logs', (req, res) => {
    const logs = db.prepare('SELECT * FROM logs').all()

    console.log('ALL LOGS:', logs)

    res.json(logs) // Send logs to frontend
})

// Get logs with a certain date and that are active
app.get('/api/logs/:date', (req, res) => {
    const { date } = req.params
    const logs = db.prepare(`
        SELECT logs.* FROM logs
        INNER JOIN habits on logs.habit_id = habits.id
        WHERE logs.date = ? AND habits.active = 1`
    ).all(date)

    console.log('ALL LOGS:', logs)

    res.json(logs) // Send logs to frontend
})

// Create a new log
app.post('/api/logs', (req, res) => {
    const { habit_id, date, completed } = req.body // Extract data from the frontend request's body 

    const result = db.prepare('INSERT INTO logs (habit_id, date, completed) VALUES (?, ?, ?)')
    result.run(habit_id, date, completed)

    res.json({ // Send new log back to frontend
        id: result.lastInsertRowid,
        habit_id,
        date,
        completed
    })
})

// Update a log's completed status
app.put('/api/logs/:id', (req, res) => {
    const { id } = req.params // Retrieve log ID from URL
    const { completed } = req.body // Retrieve completed status

    db.prepare('UPDATE logs SET completed = ? WHERE id = ?').run(completed, id)

    res.json({ success: true})
})

app.listen(PORT, '0.0.0.0', (error) => {
    if (!error) {
        console.log(`Server running on port ${PORT}}`)
    } else {
        console.log(`Error occured ${error}`)
    }
    
})