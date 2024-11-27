const fs = require('fs');
const path = require('path');
const { dataDir } = require('../constants/directory');

const saveData = (dataSets) => {
    for (let i = 0; i < dataSets.length; i++) {
        const filePath = path.join(dataDir, `data${i + 1}.txt`);
        fs.writeFileSync(filePath, JSON.stringify(dataSets[i], null, 2));
    }
}

module.exports = {
    saveData
}