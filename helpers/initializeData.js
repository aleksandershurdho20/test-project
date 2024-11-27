const fs = require('fs');
const { dataDir } = require('../constants/directory');
const path = require('path');
const { generateData } = require('./generateData');

const initializeData = () => {
    if (!fs.existsSync(dataDir)) {
        console.log('cr dir:', dataDir);
        fs.mkdirSync(dataDir);
    }

    for (let i = 1; i <= 3; i++) {
        const filePath = path.join(dataDir, `data${i}.txt`);
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(generateData(), null, 2));
        } else {
            console.log(`File  exists: ${filePath}`);
        }
    }
}
module.exports = {
    initializeData
}