// api.js - talks to the server, fetch calls and async functions that speak to backend

// Creates new habit, adds it to habits list and saves new addition
const createHabit = async (name, type, time) => {
    try {
        const response = await fetch('/api/habits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({name, type, time})
        })

        const newHabit = response.json() // Parse new habit from backend response

        return newHabit

    } catch (error) {
        console.error('Error creating new habit:', error)
    }
}

const softDeleteHabit = async (habitId) => {
    try {
        await fetch(`/api/habits/${habitId}`, {
            method: 'PUT',
        })
        console.log(`Soft deleting habit ${habitId}`)

    } catch (error) {
        console.error('Error soft deleting habit', error)
    }
}

const hardDeleteHabit = async (habitId) => {
    try {
        await fetch(`/api/habits/${habitId}`, {
            method: 'DELETE'
        })
    } catch (error) {
        console.log("Error hard deleting habit:", error)
    }
}

const loadHabits = async () => {
    try {
        const response = await fetch('/api/habits')
        habits = await response.json()
        console.log("Habits loaded:", habits)
        
    } catch (error) {
        console.error('Error loading habits: ', error)
        habits = []
    }
}

const loadInactiveHabits = async () => {
    try {
        const response = await fetch('/api/habits/inactive')
        inactiveHabits = await response.json()
        console.log('Inactive habits loaded:', inactiveHabits)

    } catch (error) {
        console.error('Error loading inactive habits:', error)
    }
}

const recoverInactiveHabit = async (habitId) => {
    try {
        await fetch(`/api/habits/${habitId}/recover`, {
            method: 'PUT',
        })
        console.log(`Recovering habit ${habitId}`)
    } catch (error) {
        console.error('Error recovering inactive habit:', error)
    }
}

const createLog = async (habitId, date, completed) => {
    try {
        const response = await fetch('/api/logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                habit_id: habitId,
                date: date,
                completed: completed ? 1 : 0
            })
        })

        const newLog = response.json()

        return newLog

    } catch (error) {
        console.error('Error creating log:', error)
    }
}

const loadLogs = async (date) => {
    try {
        const response = await fetch(`/api/logs/${date}`)
        logs = await response.json()
        console.log("Logs loaded:", logs)
    } catch (error) {
        console.error("Error loading logs:", error)
    }
}

const updateLog = async (logId, completed) => {
    try {
        await fetch(`api/logs/${logId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({completed: completed ? 1 : 0})
        })
        console.log(`Updating ${logId} to ${completed}`)
        
    } catch (error) {
        console.error("Error updating log:", error)
    }
}