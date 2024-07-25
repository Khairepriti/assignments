require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const configureMulter=require('./middleware/multer')
const functions = require('./util/functions');





app.post('/upload',configureMulter().single('file') , async (req, res) => {
    try {
     const file = req.file.path;
        const records = functions.parseCSVFile(file);
        await functions.saveData(records);
     const {ageGroups,total}=   await functions.calculateAgeDistribution();
     for (const group in ageGroups) {
        console.log(`${group}: ${(ageGroups[group] / total * 100).toFixed(2)}%`);
    }
        res.send('CSV file processed and data uploaded to DB.');
    } catch (error) {
        console.error('Error processing CSV file:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
