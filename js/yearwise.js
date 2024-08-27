document.addEventListener("DOMContentLoaded", () => {
    const yearFilterRadio = document.getElementById("yearFilter");
    const locationFilterRadio = document.getElementById("locationFilter");
    const yearSelect = document.getElementById("yearSelect");
    const locationSelect = document.getElementById("locationSelect");
    const mapContainer = document.getElementById("mapContainer");

    document.getElementById("yearFilterContainer").style.display = 'none';
    document.getElementById("locationFilterContainer").style.display = 'none';

    let highestYear = null;

    // Fetch available years and locations
    fetch('http://localhost:5000/api/years')
        .then(response => response.json())
        .then(years => {
            highestYear = Math.max(...years);
            years.forEach(year => {
                const option = document.createElement("option");
                option.value = year;
                option.textContent = year;
                yearSelect.appendChild(option);
            });
            // Fetch default year data on load
            fetchYearData(highestYear);
        });

    fetch('http://localhost:5000/api/locations')
        .then(response => response.json())
        .then(locations => {
            locations.forEach(location => {
                const option = document.createElement("option");
                option.value = location;
                option.textContent = location;
                locationSelect.appendChild(option);
            });
        });

    yearFilterRadio.addEventListener("change", () => {
        if (yearFilterRadio.checked) {
            document.getElementById("yearFilterContainer").style.display = 'block';
            document.getElementById("locationFilterContainer").style.display = 'none';
        }
    });

    locationFilterRadio.addEventListener("change", () => {
        if (locationFilterRadio.checked) {
            document.getElementById("yearFilterContainer").style.display = 'none';
            document.getElementById("locationFilterContainer").style.display = 'block';
        }
    });

    yearSelect.addEventListener("change", (event) => {
        const year = event.target.value;
        fetchYearData(year);
    });

    locationSelect.addEventListener("change", (event) => {
        const location = event.target.value;
        fetchLocationData(location);
    });

    function fetchYearData(year) {
        fetch(`http://localhost:5000/api/data/${year}`)
            .then(response => response.json())
            .then(data => {
                displayDataOnMap(data);
            });
    }

    function fetchLocationData(location) {
        fetch(`http://localhost:5000/api/location/${location}`)
            .then(response => response.json())
            .then(data => {
                displayDataOnMap(data);
            });
    }

    function displayDataOnMap(data) {
        mapContainer.innerHTML = '';

        data.forEach(location => {
            const mapItemDiv = document.createElement("div");
            mapItemDiv.classList.add("map-item");
            mapContainer.appendChild(mapItemDiv);

            const mapDiv = document.createElement("div");
            mapDiv.style.height = "400px";
            mapDiv.style.width="400px";
            mapDiv.style.marginBottom = "20px";
            mapDiv.style.flex= "1 1 calc(50% - 40px);" /* 2 maps per row */
            mapDiv.style.boxSizing=" border-box";
            mapItemDiv.appendChild(mapDiv);

            const map = L.map(mapDiv).setView([location.latitude, location.longitude], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            const markerColor = getMarkerColor(location.WQI);
            const marker = L.marker([location.latitude, location.longitude], {
                icon: L.divIcon({
                    className: `custom-marker ${markerColor}`
                })
            }).addTo(map);

            marker.bindPopup(`<b>${location.location}</b><br>${location.state}, ${location.city}, ${location.country}`)
                .openPopup();

            const detailsDiv = document.createElement("div");
            detailsDiv.classList.add("location-details");
            detailsDiv.innerHTML = `
                <h3>${location.location}</h3>
                <p><b>State:</b> ${location.state}</p>
                <p><b>City:</b> ${location.city}</p>
                <p><b>Country:</b> ${location.country}</p>
            
               <a href="locationdetails.html?location=${encodeURIComponent(location.location)}" style="color:  #007bff;">Learn More..</a>
   `;
            mapItemDiv.appendChild(detailsDiv);
        });
    }

    function getMarkerColor(wqi) {
        if (wqi < 50) {
            return 'green';
        } else if (wqi >= 50 && wqi <= 100) {
            return 'yellow';
        } else {
            return 'red';
        }
    }
});
