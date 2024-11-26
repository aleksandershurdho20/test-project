const fs = require('fs');
const { dataDir } = require('../constants/directory');
const path = require('path');
const { generateData } = require('./generateData');

const initializeData = () => {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

    for (let i = 1; i <= 3; i++) {
        const filePath = path.join(dataDir, `data${i}.json`);
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(generateData(), null, 2));
        }
    }
}

module.exports = {
    initializeData
}