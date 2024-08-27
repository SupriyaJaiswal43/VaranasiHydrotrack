document.addEventListener('DOMContentLoaded', async () => {
    const map = L.map('map').setView([25.2723, 82.9876], 13);
    const baseLayers = {
        "Street Map": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map),
        "Satellite View": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'
        }),
        "Terrain View": L.tileLayer('https://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.jpg', {
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
        })
    };

    const markers = L.layerGroup().addTo(map);
    const heatMapLayer = L.heatLayer([], { radius: 25 }).addTo(map);
    const clusterGroup = L.markerClusterGroup().addTo(map);

    let allData = [];
    const locationDropdown = document.getElementById('locationDropdown');

    // Function to determine marker color based on WQI
    const getMarkerColor = (WQI) => {
        if (WQI <= 50) return 'green';
        if (WQI <= 100) return 'yellow';
        return 'red';
    };

    // Function to populate dropdown with unique locations
    const populateLocationDropdown = (data) => {
        const locations = new Set();
        data.forEach(entry => {
            if (entry.location) {
                locations.add(entry.location);
            }
        });
        const sortedLocations = Array.from(locations).sort();
        sortedLocations.forEach(location => {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            locationDropdown.appendChild(option);
        });
    };

    // Function to set map view to a specific location
    const setMapViewToLocation = (location) => {
        const locationData = allData.find(entry => entry.location === location);
        if (locationData && locationData.latitude && locationData.longitude) {
            map.setView([locationData.latitude, locationData.longitude], 13);
        }
    };

    // Fetch and process data
    try {
        console.log('Fetching data from API...');
        const response = await fetch('http://localhost:5000/api/water-quality');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        allData = await response.json();
        console.log('Data fetched successfully:', allData);

        populateLocationDropdown(allData);

        let maxWQI = -Infinity;
        let minWQI = Infinity;
        let maxLocation = '';
        let minLocation = '';

        allData.forEach(entry => {
            if (entry.latitude && entry.longitude) {
                const WQI = entry.WQI || 0;
                const color = getMarkerColor(WQI);
                const marker = L.circleMarker([entry.latitude, entry.longitude], {
                    color,
                    radius: 8
                }).bindPopup(`
                    <strong>Location:</strong> ${entry.location}<br>
                    <strong>State:</strong> ${entry.state}<br>
                    <strong>City:</strong> ${entry.city}<br>
                    <strong>Country:</strong> ${entry.country}<br>
                    <strong>pH:</strong> ${entry.pH}<br>
                    <strong>TDS:</strong> ${entry.TDS}<br>
                    <strong>Turbidity:</strong> ${entry.Turbidity}<br>
                    <strong>Iron (Fe):</strong> ${entry.Iron}<br>
                    <strong>Calcium (Ca):</strong> ${entry.Calcium}<br>
                    <strong>Magnesium (Mg):</strong> ${entry.Magnesium}<br>
                    <strong>Nitrate (NO3-):</strong> ${entry.Nitrate}<br>
                    <strong>Fluoride (F-):</strong> ${entry.Fluoride}<br>
                    <strong>Chloride (Cl-):</strong> ${entry.Chloride}<br>
                    <strong>Sulfate (SO42-):</strong> ${entry.Sulfate}<br>
                    <strong>Alkalinity:</strong> ${entry.Alkalinity}<br>
                    <strong>Hardness:</strong> ${entry.Hardness}<br>
                    <strong>WQI:</strong> ${WQI || 'Not Calculated'}
                `);

                markers.addLayer(marker);
                clusterGroup.addLayer(marker);
                heatMapLayer.addLatLng([entry.latitude, entry.longitude]);

                // Check for highest and lowest WQI
                if (WQI > maxWQI) {
                    maxWQI = WQI;
                    maxLocation = entry.location;
                }
                if (WQI < minWQI) {
                    minWQI = WQI;
                    minLocation = entry.location;
                }
            }
        });

        // Update the stats overview with the highest and lowest WQI locations
        document.getElementById('goodQualityLocations').textContent = minLocation;
        document.getElementById('poorQualityLocations').textContent = maxLocation;

        // Event listeners for checkboxes and download button
        document.getElementById('toggleHeatMap').addEventListener('change', (e) => {
            if (e.target.checked) {
                map.addLayer(heatMapLayer);
            } else {
                map.removeLayer(heatMapLayer);
            }
        });

        document.getElementById('toggleMarkers').addEventListener('change', (e) => {
            if (e.target.checked) {
                map.addLayer(markers);
            } else {
                map.removeLayer(markers);
            }
        });

        document.getElementById('toggleCluster').addEventListener('change', (e) => {
            if (e.target.checked) {
                map.addLayer(clusterGroup);
            } else {
                map.removeLayer(clusterGroup);
            }
        });

        document.getElementById('toggleSatellite').addEventListener('change', (e) => {
            if (e.target.checked) {
                map.addLayer(baseLayers["Satellite View"]);
                map.removeLayer(baseLayers["Street Map"]);
                map.removeLayer(baseLayers["Terrain View"]);
            } else {
                map.removeLayer(baseLayers["Satellite View"]);
                map.addLayer(baseLayers["Street Map"]);
            }
        });

        // Download Data Button
        document.getElementById('downloadData').addEventListener('click', () => {
            const csvData = [
                ["Location", "State", "City", "Country", "pH", "TDS", "Turbidity", "Iron", "Calcium", "Magnesium", "Nitrate", "Fluoride", "Chloride", "Sulfate", "Alkalinity", "Hardness", "WQI"]
            ];

            allData.forEach(entry => {
                csvData.push([
                    entry.location,
                    entry.state,
                    entry.city,
                    entry.country,
                    entry.pH,
                    entry.TDS,
                    entry.Turbidity,
                    entry.Iron,
                    entry.Calcium,
                    entry.Magnesium,
                    entry.Nitrate,
                    entry.Fluoride,
                    entry.Chloride,
                    entry.Sulfate,
                    entry.Alkalinity,
                    entry.Hardness,
                    entry.WQI || 'Not Calculated'
                ]);
            });

            const csvContent = "data:text/csv;charset=utf-8," + csvData.map(e => e.join(",")).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "water_quality_data.csv");
            document.body.appendChild(link);
            link.click();
        });

        // Event listener for location dropdown
        locationDropdown.addEventListener('change', (e) => {
            setMapViewToLocation(e.target.value);
        });

    } catch (error) {
        console.error('Error fetching data:', error);
    }
});
