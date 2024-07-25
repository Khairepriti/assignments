const fs = require('fs');
const connection =require('../data-source')
 module.exports = {
    

// Read and parse CSV file
parseCSVFile: function (filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const [header, ...rows] = content.split('\n').map(line => line.split(','));

    const records = rows.map(row => {
        const record = {};
        row.forEach((value, index) => {
            const keys = header[index].split('.');
            keys.reduce((acc, key, i) => {
                if (i === keys.length - 1) {
                    acc[key] = value;
                } else {
                    if (!acc[key]) acc[key] = {};
                    return acc[key];
                }
            }, record);
        });
        return record;
    });

    return records;
},

 // Save records to MySQL
    saveData: async function (records) {
        for (const record of records) {
            const name = `${record.firstName} ${record.lastName}`;
            const age = parseInt(record.age);
            const address = {
                line1: record.line1,
                line2: record.line2,
                city: record.city,
                state: record.state
            };
            const additionalInfo = {
                gender: record.gender,
                ...record // Add other properties
            };

            await connection.execute(
                'INSERT INTO users (name, age, address, additional_info) VALUES (?, ?, ?, ?)',
                [name, age, JSON.stringify(address), JSON.stringify(additionalInfo),]
            );
        }
    },

// Calculate age distribution
calculateAgeDistribution : async function () {
    const [rows] = await connection.execute('SELECT age FROM users');
    const ageGroups = { '<20': 0, '20-40': 0, '40-60': 0, '>60': 0 };
    const total = rows.length;

    rows.forEach(row => {
        const age = row.age;
        if (age < 20) ageGroups['<20']++;
        else if (age <= 40) ageGroups['20-40']++;
        else if (age <= 60) ageGroups['40-60']++;
        else ageGroups['>60']++;
    });
console.log("ageGroups===",ageGroups);
return {ageGroups,total}
}
}