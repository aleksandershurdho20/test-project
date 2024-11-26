const loadData = () => {
    const records = [];
    for (let i = 1; i <= 3; i++) {
        const filePath = path.join(dataDir, `data${i}.json`);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        records.push(JSON.parse(fileContent));
    }
    return records;
}

module.exports = {
    loadData
}