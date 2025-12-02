// app.js - where everything comes together, global vars, event listeners, function calls, init

let habits = []
let logs = []
let inactiveHabits = []

const dailyLogEl = document.querySelector('#daily-log')
const logDateEl = document.querySelector('#log-date')
const dateSelectorEl = document.querySelector('#date-selector')
const showHabitFormBtn = document.querySelector('#show-habit-form')
const newHabitForm = document.querySelector('#add-habit')
const habitsEl = document.querySelector('#habits-tbody')
const inactiveHabitsEl = document.querySelector('#inactive-habits-tbody')


// On date change, update logs to specified date
logDateEl.addEventListener('change', async (e) => {
    const date = e.target.value
    await loadLogs(date)
    
    renderDateSelector(date)
    renderLogs(habits, date)
})

// Date selector button press
dateSelectorEl.addEventListener('click', async (e) => {
    button = e.target.closest('.btn')
    if (button && button.dataset.date) {
        const date = button.dataset.date

        // Update active button
        document.querySelectorAll('#date-selector .btn').forEach(btn => {
            btn.classList.remove('btn-primary')
            btn.classList.add('btn-outline-secondary')
        })
        button.classList.remove('btn-outline-secondary')
        button.classList.add('btn-primary')
        
        // Load and render logs
        await loadLogs(date)
        renderLogs(habits, date)
    }
})

// Log checkbox (Event delegation)
dailyLogEl.addEventListener('change', async (e) => {
    if (e.target.type == 'checkbox') {
        const habitId = parseInt(e.target.dataset.habitId)
        const date = logDateEl.value || getLocalDateString()
        const completed = e.target.checked

        // Locate current log (if exists)
        let log = logs.find(l => l.habit_id === habitId && l.date === date)

        if (log) {
            log.completed = completed ? 1 : 0
            await updateLog(log.id, completed)

        } else { // If log does not exist
            const newLog = await createLog(habitId, date, completed ? 1 : 0)
            logs.push(newLog)
        }
        
        await loadLogs(date)
        console.log('Log updated:', habitId, date, completed)
        renderProgressBar()
    }
})

// Tie 'Create a new habit!' button to its function
showHabitFormBtn.addEventListener('click', toggleHabitForm)

const handleHabitSubmit = async (e) => {
    e.preventDefault() // Prevents page reload from form submission
    
    // Extracts values from submitted form
    const habitData = new FormData(newHabitForm)

    const newHabit = await createHabit(
        habitData.get('name'),
        habitData.get('type'),
        habitData.get('time')
    )
     
    if (newHabit) {
        habits.push(newHabit) // Add to local habits array, no need for reload (slow)
        renderDateSelector()
        renderHabits()
        renderLogs(habits)
    }

    // Resets form values
    newHabitForm.reset()
    toggleHabitForm()
}

// Habit submission
newHabitForm.addEventListener('submit', handleHabitSubmit)

// Habit deletion (Event delegation)
habitsEl.addEventListener('click', async (e) => {
    if (e.target.closest('.btn-soft-delete')) {
        const habitId = parseInt(e.target.dataset.habitId)

        await softDeleteHabit(habitId)

        await loadHabits()
        await loadInactiveHabits()

        renderLogs(habits, logDateEl.value)
        renderHabits()
        renderInactiveHabits()
        console.log(`Habit ${habitId} removed`)
    }
})

// Inactive habit recovery
inactiveHabitsEl.addEventListener('click', async (e) => {
    if (e.target.closest('.btn-recover')) {
        const habitId = parseInt(e.target.dataset.habitId)

        await recoverInactiveHabit(habitId)

        await loadInactiveHabits()
        await loadHabits()

        renderLogs(habits, logDateEl.value)
        renderHabits()
        renderInactiveHabits()
        console.log(`Habit ${habitId} restored`)

    }
    // WIP
    // else if (e.target.closest('.btn-hard-delete')) {
        // const habitId = parseInt(e.target.dataset.habitId)

        // await hardDeleteHabit(habitId)

        // await loadInactiveHabits()
        // await loadHabits()

        // renderLogs(habits, logDateEl.value)
        // renderHabits()
        // renderInactiveHabits()
        // console.log(`Habit ${habitId} permanently deleted`)
    // }
})

const init = async () => {
    console.log('Starting app!!!')
    await loadHabits()
    await loadLogs(getLocalDateString())
    await loadInactiveHabits()

    renderDateSelector()

    renderLogs(habits)
    renderHabits()
    renderInactiveHabits()
}

// Start habit tracker
init()