document.addEventListener('DOMContentLoaded', () => {
    const dataTableBody = document.querySelector('#data-table tbody');
    const filterButton = document.getElementById('filterButton');
    const locationDropdown = document.getElementById('location');
    const yearDropdown = document.getElementById('year');
    const locationFilterSection = document.getElementById('location-filter');
    const yearFilterSection = document.getElementById('year-filter');
    const filterTypeRadios = document.querySelectorAll('input[name="filterType"]');

    const fetchData = async (filters = {}) => {
        try {
            const query = new URLSearchParams(filters).toString();
            const response = await fetch(`http://localhost:5000/api/water-quality?${query}`);
            const data = await response.json();

            dataTableBody.innerHTML = ''; // Clear existing data

            data.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row.state}</td>
                    <td>${row.city}</td>
                    <td>${row.country}</td>
                    <td>${row.location}</td>
                    <td>${row.latitude}</td>
                    <td>${row.longitude}</td>
                    <td>${row.pH}</td>
                    <td>${row.TDS}</td>
                    <td>${row.Turbidity}</td>
                    <td>${row.Iron}</td>
                    <td>${row.Calcium}</td>
                    <td>${row.Magnesium}</td>
                    <td>${row.Nitrate}</td>
                    <td>${row.Fluoride}</td>
                    <td>${row.Chloride}</td>
                    <td>${row.Sulfate}</td>
                    <td>${row.Alkalinity}</td>
                    <td>${row.Hardness}</td>
                    <td>${new Date(row.timePeriod).getFullYear()}</td>
                `;
                dataTableBody.appendChild(tr);
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const populateDropdowns = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/water-quality/dropdowns');
            const { locations, years } = await response.json();

            locationDropdown.innerHTML = `<option value="">All</option>` + locations.map(location => `<option value="${location}">${location}</option>`).join('');
            yearDropdown.innerHTML = `<option value="">All</option>` + years.map(year => `<option value="${year}">${year}</option>`).join(''); // Only year values

        } catch (error) {
            console.error('Error fetching dropdown data:', error);
        }
    };

    // Initial fetch
    populateDropdowns();
    fetchData();

    filterButton.addEventListener('click', () => {
        const selectedFilterType = document.querySelector('input[name="filterType"]:checked').value;
        const filters = {};

        if (selectedFilterType === 'location') {
            const location = locationDropdown.value;
            if (location) filters.location = location;
        } else if (selectedFilterType === 'year') {
            const year = yearDropdown.value;
            if (year) filters.timePeriod = year;
        }

        fetchData(filters);
    });

    filterTypeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const selectedFilterType = document.querySelector('input[name="filterType"]:checked').value;
            if (selectedFilterType === 'location') {
                locationFilterSection.style.display = 'block';
                yearFilterSection.style.display = 'none';
            } else {
                locationFilterSection.style.display = 'none';
                yearFilterSection.style.display = 'block';
            }
        });
    });
});
