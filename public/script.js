document.addEventListener('DOMContentLoaded', () => {
    const tablesContainer = document.getElementById('tables-container');

    fetch('/api/data')
        .then((response) => response.json())
        .then((dataSets) => {
            dataSets.forEach((dataSet, index) => {
                createTable(dataSet, index);
            });
        });

    function validateInput(input, type) {
        const value = parseFloat(input.value);
        let isValid = true;
        let message = '';

        switch(type) {
            case 'expenses':
                if (value > 0 || value < -10000) {
                    isValid = false;
                    message = 'Expenses must be between 0 and -10000';
                }
                break;
            case 'revenue':
                if (value < 0 || value > 15000) {
                    isValid = false;
                    message = 'Revenue must be between 0 and 15000';
                }
                break;
        }

        input.setCustomValidity(message);
        return isValid;
    }

    function validateDate(dateInput) {
        const purchaseDate = new Date(dateInput.value);
        const today = new Date();
        const daysDifference = Math.floor((today - purchaseDate) / (1000 * 60 * 60 * 24));
        
        if (daysDifference > 100) {
            dateInput.setCustomValidity('Purchase date cannot be more than 100 days in the past');
            return false;
        }
        
        dateInput.setCustomValidity('');
        return true;
    }

    function formatDecimal(input) {
        if (input.value) {
            input.value = parseFloat(input.value).toFixed(2);
        }
    }

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
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${dataSet
                    .map(
                        (row) => `
                    <tr>
                        <td><input type="date" class="input-field" value="${row.purchaseDate}" required></td>
                        <td><input type="text" class="input-field" value="${row.city}" required></td>
                        <td><input type="text" class="input-field" value="${row.product}" required></td>
                        <td><input type="number" class="input-field expenses" step="0.01" value="${(row.expenses / 100).toFixed(2)}" required></td>
                        <td><input type="number" class="input-field revenue" step="0.01" value="${(row.revenue / 100).toFixed(2)}" required></td>
                        <td>${row.days}</td>
                        <td><button class="save-btn">Save</button></td>
                    </tr>
                `
                    )
                    .join('')}
            </tbody>
        `;

        table.querySelectorAll('.expenses').forEach(input => {
            input.addEventListener('input', () => validateInput(input, 'expenses'));
            input.addEventListener('blur', () => formatDecimal(input));
        });

        table.querySelectorAll('.revenue').forEach(input => {
            input.addEventListener('input', () => validateInput(input, 'revenue'));
            input.addEventListener('blur', () => formatDecimal(input));
        });

        table.querySelectorAll('input[type="date"]').forEach(input => {
            input.addEventListener('change', () => validateDate(input));
        });

        tablesContainer.appendChild(table);

        const addRowBtn = document.createElement('button');
        addRowBtn.className = "add-btn";
        addRowBtn.textContent = 'Add Row';
        addRowBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addRow(index);
        });
        tablesContainer.appendChild(addRowBtn);
    }

    function addRow(tableIndex) {
        const table = document.getElementById(`table-${tableIndex}`).querySelector('tbody');
        const newRow = `
            <tr>
                <td><input type="date" class="input-field" required></td>
                <td><input type="text" class="input-field" required></td>
                <td><input type="text" class="input-field" required></td>
                <td><input type="number" class="input-field expenses" step="0.01" required></td>
                <td><input type="number" class="input-field revenue" step="0.01" required></td>
                <td></td>
                <td><button class="save-btn">Save</button></td>
            </tr>
        `;
        table.insertAdjacentHTML('beforeend', newRow);

        const lastRow = table.lastElementChild;
        lastRow.querySelector('.expenses').addEventListener('input', (e) => validateInput(e.target, 'expenses'));
        lastRow.querySelector('.expenses').addEventListener('blur', (e) => formatDecimal(e.target));
        lastRow.querySelector('.revenue').addEventListener('input', (e) => validateInput(e.target, 'revenue'));
        lastRow.querySelector('.revenue').addEventListener('blur', (e) => formatDecimal(e.target));
        lastRow.querySelector('input[type="date"]').addEventListener('change', (e) => validateDate(e.target));
    }

    document.getElementById('data-form').addEventListener('submit', (event) => {
        event.preventDefault();
        
        const inputs = document.querySelectorAll('.input-field');
        let isValid = true;

        inputs.forEach(input => {
            if (input.type === 'number') {
                if (input.classList.contains('expenses')) {
                    isValid = validateInput(input, 'expenses') && isValid;
                } else if (input.classList.contains('revenue')) {
                    isValid = validateInput(input, 'revenue') && isValid;
                }
            } else if (input.type === 'date') {
                isValid = validateDate(input) && isValid;
            }
        });

        if (!isValid) {
            alert('Please correct the invalid entries before saving.');
            return;
        }

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