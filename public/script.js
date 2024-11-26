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
                    <th>Actions </th>
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
                        <td><button id="save"> Save </button> </td>
                    </tr>
                `
                    )
                    .join('')}
            </tbody>
        `;
        tablesContainer.appendChild(table);
        const addRowBtn = document.createElement('button');
        addRowBtn.textContent = 'Add Row';
        addRowBtn.addEventListener('click', (e) => {
            e.preventDefault()
            addRow(index)
        });
        tablesContainer.appendChild(addRowBtn);
    }

    function addRow(tableIndex) {
        const table = document.getElementById(`table-${tableIndex}`).querySelector('tbody');
        const newRow = `
            <tr>
                <td><input type="date" class="input-field"></td>
                <td><input type="text" class="input-field"></td>
                <td><input type="text" class="input-field"></td>
                <td><input type="number" class="input-field" step="0.01"></td>
                <td><input type="number" class="input-field" step="0.01"></td>
                <td></td>
                <td><button id="save"> Save </button> </td>


            </tr>
        `;
        table.insertAdjacentHTML('beforeend', newRow);
    }

    document.getElementById('data-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const updatedData = [];
        document.querySelectorAll('table').forEach((table) => {
            const rows = [];
            table.querySelectorAll('tbody tr').forEach((row) => {
                const cells = row.querySelectorAll('td input');
                const purchaseDate = cells[0].value;
                const days = Math.floor((new Date() - new Date(purchaseDate)) / (1000 * 60 * 60 * 24));
                rows.push({
                    "purchaseDate": purchaseDate,
                    "city": cells[1].value,
                    "product": cells[2].value,
                    "expenses": Math.round(parseFloat(cells[3].value) * 100),
                    "revenue": Math.round(parseFloat(cells[4].value) * 100),
                    "days": days,
                });
            });
            updatedData.push(rows);
        });

        fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        }).then(() => alert('Data saved successfully!'));
    });
});
