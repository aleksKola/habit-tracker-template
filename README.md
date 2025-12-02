# Habit Tracker

A habit tracking web app build with Node.js, Express and SQLite.

## Features

- Track your daily jabits
- View progress with progress bar and percentage
- Navigate between different dates
- Archive and recover habits
- SQLite database stores your data

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** SQLite (better-sqlite3)
- **Frontend:** Vanilla JavaScript, HTML, CSS
- **Deployment:** Railway (I chose this, you can run it locally)

## Prerequisites

Before you begin, ensure you have installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)

## Installation

1. **Clone the repository**
```bash
   git clone https://github.com/aleksKola/habit-tracker.git
   cd habit-tracker
```

2. **Install dependencies**
```bash
   npm install
```

3. **Create environment file**
   
   Create a `.env` file in the root directory:
```bash
   APP_PASSWORD=YourPasswordHere
```

4. **Start the development server**
```bash
   npm run devStart
```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

## Usage

### First Time Setup

The app will automatically create a SQLite database (`habit-tracker.db`) on first run.

### Adding Habits

1. Click "Add Habit" button
2. Enter habit name, type, and time
3. Click "Add"

### Tracking Habits

- Click on a habit row to mark it complete/incomplete
- Use date selector to view different days
- View your progress in the progress bar

### Managing Habits

- Deactivate habits you no longer want to track
- View inactive habits in the "Inactive Habits" section
- Recover inactive habits if needed

## Project Structure
```
habit-tracker/
├── client/              # Frontend files
│   ├── index.html       # Main HTML file
│   ├── scripts/         # JavaScript modules
│   │   ├── app.js       # Main application logic
│   │   ├── api.js       # API calls
│   │   ├── render.js    # DOM rendering
│   │   └── utils.js     # Utility functions
│   └── styles.css       # CSS styles
├── server/              # Backend files
│   ├── server.js        # Express server
│   └── database.js      # Database configuration
├── .env                 # Environment variables (Make this yourself!!!)
├── .gitignore
├── package.json
└── README.md
```

## API Endpoints

### Habits
- `GET /api/habits` - Get all active habits
- `GET /api/habits/inactive` - Get all inactive habits
- `POST /api/habits` - Create a new habit
- `PUT /api/habits/:id` - Deactivate a habit
- `PUT /api/habits/:id/recover` - Recover an inactive habit

### Logs
- `GET /api/logs?date=YYYY-MM-DD` - Get logs for a specific date
- `POST /api/logs` - Create a new log
- `PUT /api/logs/:id` - Update a log

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `APP_PASSWORD` | Password for basic authentication | Yes |
| `PORT` | Server port (default: 3000) | No |
| `NODE_ENV` | Environment (development/production) | No |

## Deployment

### Railway

1. Push your code to GitHub
2. Create a new project on [Railway](https://railway.app)
3. Connect your GitHub repository
4. Add environment variables in Railway dashboard
5. Deploy!

See [Railway documentation](https://docs.railway.app) for more details.

## Development

### Running in development mode
```bash
npm run devStart
```

This uses nodemon to automatically restart the server on file changes.

### Database

The SQLite database is created automatically on first run. To reset the database, simply delete `habit-tracker.db` and restart the server.

## Security Notes

- The app uses HTTP Basic Authentication
- Always use HTTPS in production
- Never commit `.env` file to version control
- Change the default password in `.env`

## Customization

### Removing Authentication

If you want to run this locally without password protection, comment out or remove the authentication middleware in `server/server.js`:
```javascript
// Comment out this entire block:
/*
app.use((req, res, next) => {
    // ... authentication code
})
*/
```

### Changing the Database Location

Edit `server/database.js` to change the database file path.

## Troubleshooting

### Port already in use
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill
```

### Database locked error
- Make sure only one instance of the server is running
- Close any database browser tools

### Module not found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Author

Aleksander Kolasinski - [GitHub](https://github.com/aleksKola)

## Acknowledgments

- Built with [Express.js](https://expressjs.com/)
- Database with [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
- Deployed on [Railway](https://railway.app)
```