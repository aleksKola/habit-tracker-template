// render.js - updates the screen, DOM manipulation

const renderDateSelector = (date = getLocalDateString()) => {
    const dateSelectorEl = document.querySelector('#date-selector')
    const weekday = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa']

    const parts = date.split('-') // [year, month, day]
    const year = Number(parts[0])
    const month = Number(parts[1]) - 1 // Month is zero indexed
    const day = Number(parts[2])
    date = new Date(year, month, day) 

    dateSelectorEl.textContent = ""

    today = new Date() // For underlining TODAY's date
    for (let day = 0; day < 7; day++) {
        currentDate = new Date(date)
        currentDate.setDate(date.getDate() - date.getDay() + day)

        const buttonEl = document.createElement('button')
        const textEl = document.createElement('div')
        const dayNumberEl = document.createElement('strong')
        const dayEl = document.createElement('small')

        buttonEl.className = "btn btn-outline-secondary rounded-pill"
        buttonEl.setAttribute('type', 'button')
        buttonEl.setAttribute("data-date", currentDate.toISOString().split('T')[0]) // YYYY-MM-DD

        dayEl.className = "d-block"
        dayEl.textContent = weekday[day]
        textEl.appendChild(dayEl)
        
        dayNumberEl.textContent = currentDate.getDate()
        if (currentDate.getDate() == today.getDate()) { // Underlines today
            dayNumberEl.style = "text-decoration: underline"
        }
        textEl.appendChild(dayNumberEl)

        // only if active
        if (day === date.getDay()) {
            buttonEl.className = "btn btn-primary rounded-pill"

            const activeEl = document.createElement('small')
            activeEl.className = "d-block"
            activeEl.textContent = ""
            textEl.appendChild(activeEl)
        }

        buttonEl.appendChild(textEl)
        
        dateSelectorEl.appendChild(buttonEl)
    }
}

const renderLogs = (habits, date = getLocalDateString()) => {
    const dailyLogEl = document.querySelector("#daily-log")
    const logDateEl = document.querySelector("#log-date")

    // Display today's date
    logDateEl.value = date
    dailyLogEl.innerHTML = ""

    habits.forEach((habit) => {
        const log = logs.find((log) => log.habit_id === habit.id)

        const li = document.createElement('li')
        li.className = 'list-group-item'

        const checkbox = document.createElement('input')
        checkbox.setAttribute('type', 'checkbox')
        checkbox.className = 'form-check-input p-2 me-1'
        checkbox.setAttribute('data-habit-id', habit.id) // ID to be extracted in event delegation
        checkbox.setAttribute('data-date', date)
        checkbox.checked = log?.completed === 1

        const nameEl = document.createElement('span')
        nameEl.textContent = capitalize(habit.name)

        li.appendChild(checkbox)
        li.appendChild(nameEl)

        // Makes checkbox toggle if checkbox OR li is clicked
        li.addEventListener('click', (e) => {
        if (e.target === checkbox) return // If checkbox clicked, let checkbox listener handle it
            
            checkbox.checked = !checkbox.checked
            // Manually fires an event to event delegation for checkbox listener
            checkbox.dispatchEvent(new Event('change', { bubbles: true }))
            renderProgressBar()
        })
        dailyLogEl.appendChild(li)
    })


    // Progress bar
    const progessLi = document.createElement('li')
    progessLi.className = 'list-group-item'

    const progressWrapper = document.createElement('div')
    progressWrapper.className = 'progress'
    progressWrapper.id = 'progress-wrapper'

    const progressBar = document.createElement('div')
    const progress = calculateProgress(habits, logs)
    progressBar.className = 'progress-bar'
    progressBar.id = 'progress-bar'
    progressBar.style = `width: ${progress}%`
    progressBar.textContent = `${progress}%`
    
    progressWrapper.appendChild(progressBar)
    progessLi.appendChild(progressWrapper)

    dailyLogEl.appendChild(progessLi)
}

// Renders progress bar
const renderProgressBar = () => {
    const progressBar = document.querySelector('#progress-bar')
    const progress = calculateProgress(habits, logs)
    progressBar.style = `width: ${progress}%`
    progressBar.textContent = `${progress}%`
}

// Opens / closes new habit form 
const toggleHabitForm = () => {
    const newHabitForm = document.querySelector('#add-habit')

    if (newHabitForm.style.display == 'none') {
        newHabitForm.style.display = 'block'
        showHabitFormBtn.textContent = 'Cancel'
        showHabitFormBtn.classList.remove('btn-primary')
        showHabitFormBtn.classList.add('btn-danger')
    } else {
        newHabitForm.style.display = 'none'
        newHabitForm.reset()
        showHabitFormBtn.textContent = 'Create a new habit!'
        showHabitFormBtn.classList.remove('btn-danger')
        showHabitFormBtn.classList.add('btn-primary')
    }
}

const renderHabits = () => {
    const tableEl = document.querySelector("#habits-table")
    const habitsEl = document.querySelector("#habits-tbody")
    const emptyMessageEl = document.querySelector('#habits-message')

    habitsEl.innerHTML = ""

    if (habits.length <= 0) {
        tableEl.classList.add('d-none')
        emptyMessageEl.classList.remove('d-none')
    } else {
        tableEl.classList.remove('d-none')
        emptyMessageEl.classList.add('d-none')
    
        habits.forEach((habit) => {
            // Only render if habit is active
            const tableRowEl = document.createElement('tr')
            const nameEl = document.createElement('td')
            const typeEl = document.createElement('td')
            const timeEl = document.createElement('td')
            const deleteEl = document.createElement('td')
            const deleteBtn = document.createElement('button')

            // Set habit name
            nameEl.textContent = capitalize(habit.name)
            tableRowEl.appendChild(nameEl)

            // Set habit type
            typeEl.textContent = habit.type
            tableRowEl.appendChild(typeEl)

            // Set habit time range
            timeEl.textContent = habit.time_range
            tableRowEl.appendChild(timeEl)

            // Add delete button
            deleteBtn.textContent = "X"
            deleteBtn.className = "btn btn-danger btn-sm btn-circle btn-soft-delete"
            deleteBtn.setAttribute('type', 'button')

            // For ID access for delete button
            deleteBtn.setAttribute('data-habit-id', habit.id)

            deleteEl.appendChild(deleteBtn)
            tableRowEl.appendChild(deleteEl)

            // Add habits to table
            habitsEl.appendChild(tableRowEl)
        })
    }
}

const renderInactiveHabits = () => {
    const tableEl = document.querySelector('#inactive-habits-table')
    const habitsEl = document.querySelector('#inactive-habits-tbody')
    const emptyMessageEl = document.querySelector('#inactive-habits-message')

    habitsEl.innerHTML = ""

    if (inactiveHabits.length <= 0) {
        tableEl.classList.add('d-none')
        emptyMessageEl.classList.remove('d-none')
    } else {
        tableEl.classList.remove('d-none')
        emptyMessageEl.classList.add('d-none')

        inactiveHabits.forEach((habit) => {
            // Only render if habit is active
            const tableRowEl = document.createElement('tr')
            const nameEl = document.createElement('td')
            const typeEl = document.createElement('td')
            const timeEl = document.createElement('td')
            const recoverEl = document.createElement('td')
            const recoverBtn = document.createElement('button')
            // const deleteEl = document.createElement('td')
            // const deleteBtn = document.createElement('button')

            // Set habit name
            nameEl.textContent = capitalize(habit.name)
            tableRowEl.appendChild(nameEl)

            // Set habit type
            typeEl.textContent = habit.type
            tableRowEl.appendChild(typeEl)

            // Set habit time range
            timeEl.textContent = habit.time_range
            tableRowEl.appendChild(timeEl)

            // Add recover button
            recoverBtn.textContent = "✓"
            recoverBtn.className = "btn btn-success btn-sm btn-circle btn-recover"
            recoverBtn.setAttribute('type', 'button')
            // For ID access for recover button
            recoverBtn.setAttribute('data-habit-id', habit.id)

            recoverEl.appendChild(recoverBtn)
            tableRowEl.appendChild(recoverEl)

            // WIP
            // Add a hard delete button
            // deleteBtn.textContent = "X"
            // deleteBtn.className = "btn btn-danger btn-sm btn-circle btn-hard-delete"
            // deleteBtn.setAttribute('type', 'button')
            // // For ID access for delete button
            // deleteBtn.setAttribute('data-habit-id', habit.id)
            // deleteEl.appendChild(deleteBtn)
            // tableRowEl.appendChild(deleteEl)

            // Add habits to table
            habitsEl.appendChild(tableRowEl)
        })
    }
}