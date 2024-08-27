document.addEventListener('DOMContentLoaded', async () => {
    const dataTableBody = document.getElementById('data-tbody');
    const editSection = document.getElementById('edit-section');
    const editForm = document.getElementById('edit-form');
    const cancelEditBtn = document.getElementById('cancel-edit');
    const generateExcelBtn = document.getElementById('generateExcel');
    const addDetailsBtn = document.getElementById('addDetails');
    const locationFilter = document.getElementById('locationFilter');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    const itemsPerPage = 10;

    let allData = [];
    let currentPage = 1;
    let currentEditId = null;

    // Fetch data and populate the table
    const fetchData = async () => {
        const response = await fetch('http://localhost:5000/api/water-quality');
        allData = await response.json();
        populateLocationFilter(allData);
        updateTable();
    };

    // Populate the data table
    const updateTable = () => {
        const paginatedData = paginateData(allData);
        dataTableBody.innerHTML = '';
        paginatedData.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.location}</td>
                <td>${entry.pH}</td>
                <td>${entry.TDS}</td>
                <td>${entry.Turbidity}</td>
                <td>${entry.Iron}</td>
                <td>${entry.Calcium}</td>
                <td>${entry.Magnesium}</td>
                <td>${entry.Nitrate}</td>
                <td>${entry.Fluoride}</td>
                <td>${entry.Chloride}</td>
                <td>${entry.Sulfate}</td>
                <td>${entry.Alkalinity}</td>
                <td>${entry.Hardness}</td>
               
            `;
            dataTableBody.appendChild(row);
        });
        updatePaginationControls();
    };

    // Populate the location filter dropdown
    const populateLocationFilter = (data) => {
        const locations = [...new Set(data.map(entry => entry.location))];
        locations.sort();
        locationFilter.innerHTML = '<option value="">All Locations</option>';
        locations.forEach(location => {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            locationFilter.appendChild(option);
        });
    };

    // Filter data based on selected location
    locationFilter.addEventListener('change', () => {
        currentPage = 1; // Reset to first page
        const selectedLocation = locationFilter.value;
        const filteredData = selectedLocation 
            ? allData.filter(entry => entry.location === selectedLocation) 
            : allData;
        updateTable(filteredData);
    });

    // Paginate data
    const paginateData = (data) => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return data.slice(start, end);
    };

    // Update pagination controls
    const updatePaginationControls = () => {
        pageInfo.textContent = `Page ${currentPage}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = (currentPage * itemsPerPage) >= allData.length;
    };

    // Handle edit button click
    window.handleEdit = async (id) => {
        const response = await fetch(`http://localhost:5000/api/water-quality/${id}`);
        const data = await response.json();

        currentEditId = id;
        editForm.innerHTML = '';

        for (const key in data) {
            if (data.hasOwnProperty(key) && key !== '_id' && key !== '__v') {
                const label = document.createElement('label');
                label.textContent = key;
                const input = document.createElement('input');
                input.type = 'text';
                input.name = key;
                input.value = data[key];
                editForm.appendChild(label);
                editForm.appendChild(input);
            }
        }

        editSection.style.display = 'block';
    };

    // Handle delete button click
    window.handleDelete = async (id) => {
        await fetch(`http://localhost:5000/api/water-quality/${id}`, { method: 'DELETE' });
        fetchData();
    };

    // Handle form submission for editing
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(editForm);
        const updatedData = {};
        formData.forEach((value, key) => {
            updatedData[key] = value;
        });

        await fetch(`http://localhost:5000/api/water-quality/${currentEditId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        editSection.style.display = 'none';
        fetchData();
    });

    // Handle cancel button click
    cancelEditBtn.addEventListener('click', () => {
        editSection.style.display = 'none';
    });

    // Handle form submission for adding new data
    addDetailsBtn.addEventListener('click', () => {
        window.location.href = 'form.html';
    });

    // Handle Excel report generation
    generateExcelBtn.addEventListener('click', async () => {
        const response = await fetch('http://localhost:5000/api/water-quality');
        const data = await response.json();
        
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Water Quality Data');

        XLSX.writeFile(workbook, 'WaterQualityData.xlsx');
    });

    // Pagination controls
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updateTable();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if ((currentPage * itemsPerPage) < allData.length) {
            currentPage++;
            updateTable();
        }
    });

    // Initial data fetch
    fetchData();
});
