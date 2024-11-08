const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sql = require('msnodesqlv8');

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection string
const connectionString = 
  `Driver={SQL Server Native Client 11.0};` +
  `Server=MSI\\SQLEXPRESS;` +
  `Database=OnlineJournalWebApp;` +
  `Trusted_Connection=yes;`;

// Middleware setup
app.use(bodyParser.json());  // Parse incoming JSON requests
app.use(cors());  // Enable Cross-Origin Resource Sharing

// Basic test route
app.get('/', (req, res) => {
    console.log('Received a request at the root route');
    res.send('Hello from Express server!');
});

// Test database connection
app.get('/test-db', (req, res) => {
    sql.open(connectionString, (err, connection) => {
        if (err) {
            res.status(500).send('Failed to connect to database');
            console.error('Database connection error:', err);
        } else {
            res.send('Database connected successfully!');
            connection.close();  // Always close the connection
        }
    });
});

// Route to handle POST request to add a journal entry
app.post('/entries', (req, res) => {
    const { userId, entryText } = req.body;  // Get userId and entryText from the request body

    // SQL query to insert the new entry into the database
    const query = `INSERT INTO DearDiary.Entries (userId, entryText) VALUES (${userId}, '${entryText}')`;

    // Connect to the database and insert the entry
    sql.open(connectionString, (err, connection) => {
        if (err) {
            console.error('Database connection failed:', err);
            res.status(500).send('Failed to connect to the database');
        } else {
            connection.query(query, (err, result) => {
                if (err) {
                    console.error('Insert failed:', err);
                    res.status(500).send('Failed to insert entry');
                } else {
                    res.status(201).send('Entry inserted successfully');
                }
                connection.close();  // Always close the connection
            });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
