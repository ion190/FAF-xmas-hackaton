const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const app = express();
const fileUpload = require('express-fileupload');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(fileUpload());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const uploadedFile = req.files.image;
    const uploadDir = path.join(__dirname, 'public/images');

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }

    const filePath = path.join(uploadDir, uploadedFile.name);

    uploadedFile.mv(filePath, (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        console.log('File uploaded successfully.');

        const credentialsJSONFile = 'fourth-sphere-409017-b0a669afce37.json';
        const entryDirName = 'public/images';
        const commandToExecute = `npm start ${credentialsJSONFile} ${entryDirName}`;

        console.log(`Executing command: ${commandToExecute}`);

        exec(commandToExecute, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${error}`);
                return;
            }
            console.log(`Command output: ${stdout}`);
            console.error(`Command errors: ${stderr}`);

            // Get the filename (without extension)
            const fileName = uploadedFile.name.split('.')[0];
            const fileTxt = path.join(__dirname, 'public/images/', `${fileName}.txt`);

            // Check for the existence of the file at intervals
            const checkFileExists = setInterval(() => {
                if (fs.existsSync(fileTxt)) {
                    clearInterval(checkFileExists);
                    res.redirect(`/file/${fileName}`);
                }
            }, 1000); // Check every second
        });
    });

    // Send a response indicating successful upload, allowing the user to upload another file
    // res.send('File uploaded successfully. Processing...');
});

// Endpoint to retrieve file content by filename
app.get('/file/:filename', (req, res) => {
    const { filename } = req.params;
    const outputFileName = path.join(__dirname, 'public/images/', `${filename}.txt`);
    fs.readFile(outputFileName, 'utf-8', (err, data) => {
      if (err) {
        res.status(500).send('Error reading file');
      } else {
        const imagePath = `/images/${filename}.jpg`;
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Team 6</title>
            <style>
                /* Flexbox styles */
                .flex-container {
                    display: flex;
                    justify-content: space-around; /* Adjust as needed */
                    flex-wrap: wrap;
                }
            
                .card {
                    /* Add shadows to create the "card" effect */
                    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
                    transition: 0.3s;
                    border-radius: 5px; /* 5px rounded corners */
                    margin: 10px; /* Adjust margin as needed */
                    flex: 1 0 30%; /* Adjust width as needed */
                }
            
                /* On mouse-over, add a deeper shadow */
                .card:hover {
                    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
                }
            
                /* Add some padding inside the card container */
                .container {
                    padding: 2px 16px;
                }
            
                /* Add rounded corners to the top left and the top right corner of the image */
                img {
                    border-radius: 5px 5px 0 0;
                    width: 100%;
                }
            
                /* Adjust text alignment and styles */
                h4 {
                    margin-bottom: 5px;
                }
            
                p {
                    margin-top: 0;
                }

                h1 {
                    text-align: center;
                }

                footer {
                    text-align: center;
                    margin-top: 25px;
                }
            </style>
        </head>
        <body>
            <h1>OCR Handwriting Recognition</h1>
            <div class="flex-container">
                <div class="card">
                    <div class="container">
                        <h4><b>Input:</b></h4>
                        <img src="${imagePath}" alt="${filename}">
                    </div>
                </div>
                <div class="card">
                    <div class="container">
                        <h4><b>Output:</b></h4>
                        <p>${data}</p>
                    </div>
                </div>
            </div>
            <footer>
                <p>© 2023 XMAS FAF HACKATHON</p>
            </footer>
        </body>
        </html>

    `;

        // Send the HTML content as a response
        res.send(htmlContent);
      }
    });
  });

PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
