const express = require('express');
const { Connection, Request } = require('tedious');

const app = express();
const port = 5000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Connection config for Windows Authentication
const config = {
    server: 'MSI\\SQLEXPRESS', // Adjust this to your server
    authentication: {
        type: 'ntlm', // Windows Authentication
        options: {
            domain: '',  // Leave blank for default domain or set it explicitly
            userName: '', // Leave blank as Windows Authentication doesn't need username and password
            password: ''  // Leave blank for Windows Authentication
        }
    },
    options: {
        database: 'OnlineJournalWebApp',
        encrypt: true,
        trustServerCertificate: true
    }
};

// Root route to handle GET requests to "/"
app.get('/', (req, res) => {
    res.send('Welcome to the Journal App API!');
});

// POST route to insert a new entry
app.post('/entries', async (req, res) => {
    const { userId, entryText } = req.body;

    const query = 'INSERT INTO DearDiary.Entries (userId, entryText) VALUES (?, ?)';

    const connection = new Connection(config);

    connection.on('connect', err => {
        if (err) {
            console.error('Database connection failed:', err);
            res.status(500).send('Failed to connect to the database');
        } else {
            const request = new Request(query, (err, rowCount) => {
                if (err) {
                    console.error('Insert failed:', err);
                    res.status(500).send('Failed to insert entry');
                } else {
                    res.status(201).send('Entry inserted successfully');
                }
            });

            request.addParameter('userId', TYPES.Int, userId);
            request.addParameter('entryText', TYPES.NVarChar, entryText);

            connection.execSql(request);
        }
    });

    connection.connect();
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
