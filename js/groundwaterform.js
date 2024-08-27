// Initialize the map
let map = L.map('map').setView([25.2723, 82.9876], 10);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Function to load and display water data on the map
function loadMapData() {
    fetch('http://localhost:5000/api/water/records')
        .then(res => res.json())
        .then(data => {
            data.forEach(record => {
                let color;

                // Set color based on fluctuation
                if (record.fluctuation > 5) {
                    color = 'red';
                } else if (record.fluctuation >= 3) {
                    color = 'yellow';
                } else {
                    color = 'green';
                }

                // Add a circle marker to the map
                L.circle([record.latitude, record.longitude], {
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.5,
                    radius: 1500
                }).addTo(map)
                    .bindPopup(`<b>${record.block}</b><br>Fluctuation: ${record.fluctuation}<br><b>Hydrograph Station:</b>${record.hydrographStation}`);
            });
        })
        .catch(err => {
            console.error('Error loading map data:', err);
        });
}

// Load the map data on page load
window.onload = loadMapData;

// Form submission logic
document.getElementById('waterForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const block = document.getElementById('block').value;
    const hydrographStation = document.getElementById('hydrographStation').value;
    const longitude = parseFloat(document.getElementById('longitude').value);
    const latitude = parseFloat(document.getElementById('latitude').value);
    const preMonsoon = parseFloat(document.getElementById('preMonsoon').value);
    const postMonsoon = parseFloat(document.getElementById('postMonsoon').value);
    const fluctuation = parseFloat(document.getElementById('fluctuation').value);

    const data = { block, hydrographStation, longitude, latitude, preMonsoon, postMonsoon, fluctuation };

    // Send data to backend
    try {
        const res = await fetch('http://localhost:5000/api/water/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await res.json();
        alert(result.message);

        // Reload the map to reflect the new data
        loadMapData();

        // Reset form fields
        document.getElementById('waterForm').reset();
    } catch (error) {
        console.error('Error:', error);
    }
});
