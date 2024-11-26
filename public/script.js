document.addEventListener('DOMContentLoaded', () => {
    const tablesContainer = document.getElementById('tables-container');

    fetch('/api/data')
        .then((response) => response.json())
        .then((dataSets) => {
            console.log(dataSets,"dataSets")
            dataSets.forEach((dataSet, index) => {
                createTable(dataSet, index);
            });
        });

    function createTable(dataSet, index) {
        const table = document.createElement('table');
        table.id = `table-${index}`;
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Purchase Date</th>
                    <th>City</th>
                    <th>Product</th>
                    <th>Expenses</th>
                    <th>Revenue</th>
                    <th>Days</th>
                </tr>
            </thead>
            <tbody>
                ${dataSet
                    .map(
                        (row) => `
                    <tr>
                        <td><input type="date" class="input-field" value="${row.purchaseDate}"></td>
                        <td><input type="text" class="input-field" value="${row.city}"></td>
                        <td><input type="text" class="input-field" value="${row.product}"></td>
                        <td><input type="number" class="input-field" step="0.01" value="${row.expenses / 100}"></td>
                        <td><input type="number" class="input-field" step="0.01" value="${row.revenue / 100}"></td>
                        <td>${row.days}</td>
                    </tr>
                `
                    )
                    .join('')}
            </tbody>
        `;
        tablesContainer.appendChild(table);
       
    }

  
});
