const express = require('express');
const sql = require('msnodesqlv8');

const app = express();
const port = 5000;

const connectionString = 
  `Driver={SQL Server Native Client 11.0};` +
  `Server=MSI\\SQLEXPRESS;` +
  `Database=OnlineJournalWebApp;` +
  `Trusted_Connection=yes;`;

app.use(express.json());  // Middleware to parse JSON request bodies

// Root route to handle GET requests to "/"
app.get('/', (req, res) => {
    res.send('Welcome to the Journal App API!');
});

// POST route to insert a new entry
app.post('/entries', (req, res) => {
    const { userId, entryText } = req.body;

    const query = `INSERT INTO DearDiary.Entries (userId, entryText) VALUES (${userId}, '${entryText}')`;

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
                connection.close();
            });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
