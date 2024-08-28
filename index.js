const express = require('express');
const fs = require('fs');
const path = require('path');
const WEB_SERVER =express();
const app = express();
const PORT = process.env.PORT || 3000;
const FILES_DIR = path.join(__dirname, 'files');

// Ensure the directory exists
if (!fs.existsSync(FILES_DIR)){
    fs.mkdirSync(FILES_DIR);
}

app.use(express.json());

// API Endpoint to create a text file with current timestamp
app.post('/create-file', (req, res) => {
    const now = new Date();
    const timestamp = now.toISOString();
    const filename = `${now.toISOString().replace(/:/g, '-')}.txt`;
    const filePath = path.join(FILES_DIR, filename);
    
    fs.writeFile(filePath, timestamp, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to create file' });
        }
        res.status(201).json({ message: 'File created successfully', filename });
    });
});

// API Endpoint to retrieve all text files in the folder
app.get('/list-files', (req, res) => {
    fs.readdir(FILES_DIR, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to list files' });
        }
        const textFiles = files.filter(file => file.endsWith('.txt'));
        res.status(200).json({ files: textFiles });
        res.render("list-files");
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

