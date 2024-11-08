// db.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Connection, Request } = require('tedious');

const app = express();
const PORT = process.env.PORT || 5000;

const config = {
    server: 'MSI\\SQLEXPRESS',
    authentication: {
        type: 'ntlm',  // Use NTLM for Windows Authentication
        options: {
            domain: '', // You can leave this empty for a local connection
        }
    },
    options: {
        database: 'OnlineJournalWebApp',
        encrypt: true,
        trustServerCertificate: true
    }
};

app.use(bodyParser.json());
app.use(cors());

// Basic test route
app.get('/', (req, res) => {
    console.log('Received a request at the root route');
    res.send('Hello from Express server!');
});

// Test database connection
app.get('/test-db', (req, res) => {
    const connection = new Connection(config);
    connection.on('connect', err => {
        if (err) {
            res.status(500).send('Failed to connect to database');
            console.error('Database connection error:', err);
        } else {
            res.send('Database connected successfully!');
        }
    });
    connection.connect();
});

// Route to handle POST request to add a journal entry
app.post('/entries', (req, res) => {
    const { userId, entryText } = req.body;

    const connection = new Connection(config);
    connection.on('connect', err => {
        if (err) {
            console.error('Database connection failed:', err);
            res.status(500).send('Failed to connect to the database');
        } else {
            const query = `INSERT INTO DearDiary.Entries (userId, entryText) VALUES (${userId}, '${entryText}')`;
            const request = new Request(query, (err, rowCount) => {
                if (err) {
                    console.error('Insert failed:', err);
                    res.status(500).send('Failed to insert entry');
                } else {
                    res.status(201).send('Entry inserted successfully');
                }
            });

            connection.execSql(request);
        }
    });
    connection.connect();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
