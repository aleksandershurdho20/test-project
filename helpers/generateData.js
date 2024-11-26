const generateData = () => {
    const cities = ["Rome", "Brussels", "Paris", "Berlin", "Tirana"];
    const products = ["Laptop", "Iphone", "Tablet", "Monitor", "Keyboard"];
    const data = [];

    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const getRandomDate = () => new Date(Date.now() - Math.floor(Math.random() * 120 * 24 * 60 * 60 * 1000));
    const getRandomExpense = () => Math.floor(Math.random() * -100000);
    const getRandomRevenue = () => Math.floor(Math.random() * 150000);

    for (let i = 0; i < 5; i++) {
        const purchaseDate = getRandomDate();
        const days = Math.floor((Date.now() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24));

        data.push({
            "purchaseDate": purchaseDate.toISOString().split('T')[0],
            "city": getRandomElement(cities),
            "product": getRandomElement(products),
            "expenses": getRandomExpense(),
            "revenue": getRandomRevenue(),
            "days": days,
        });
    }

    return data;
};

module.exports = {
    generateData
}