// scripts.js

document.getElementById('filterButton').addEventListener('click', fetchIncidents);

function fetchIncidents() {
    const nameFilter = document.getElementById('nameFilter').value;
    const url = nameFilter ? `http://localhost:5000/api/incidents?name=${nameFilter}` : 'http://localhost:5000/api/incidents';


    fetch(url)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#incidentTable tbody');
            tableBody.innerHTML = ''; // Clear previous data

            data.forEach(incident => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${new Date(incident.dateOfIncident).toLocaleDateString()}</td>
                    <td>${incident.timeOfIncident}</td>
                    <td>${incident.locationOfIncident}</td>
                    <td>${incident.waterbody}</td>
                    <td>${incident.activityConcern}</td>
                    <td>${incident.additionalInformation}</td>
                    <td>${incident.name}</td>
                    <td>${incident.email}</td>
                    <td>${incident.phone}</td>
                    <td>${incident.lat}</td>
                    <td>${incident.lng}</td>
                    <td>${incident.address}</td>
                  <td><a href="${incident.incidentPhotoPath}" target="_blank">View Photo</a></td>

                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching incidents:', error));
}

// Fetch all incidents on page load
fetchIncidents();
