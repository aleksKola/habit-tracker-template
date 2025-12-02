// utils.js - helper functions

const getLocalDateString = () => {
    return new Date().toLocaleDateString('en-CA')
}

const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

const calculateProgress = (habits, logs) => {
    const completed = logs.filter((log) => log.completed === 1).length
    const total = habits.length

    if (total === 0) return 0

    return Math.floor(completed / total * 100)
}