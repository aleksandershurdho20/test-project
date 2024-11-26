const fs = require('fs');

const saveData = () => {
    for (let i = 0; i < dataSets.length; i++) {
        const filePath = path.join(dataDir, `data${i + 1}.json`);
        fs.writeFileSync(filePath, JSON.stringify(dataSets[i], null, 2));
    }
}

module.exports = {
    saveData
}