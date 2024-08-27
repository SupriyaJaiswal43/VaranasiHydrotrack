document.addEventListener('DOMContentLoaded', function () {
    function setCurrentDateTime() {
        const now = new Date();
        const dateString = now.toISOString().substring(0, 10); // YYYY-MM-DD
        const timeString = now.toTimeString().substring(0, 5); // HH:MM

        document.getElementById('dateOfIncident').value = dateString;
        document.getElementById('timeOfIncident').value = timeString;
    }

    window.onload = setCurrentDateTime;

    const map = L.map('map').setView([25.2723, 82.9876], 13); // Default to some location

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    let userMarker;
    const latField = document.getElementById('lat');
    const lngField = document.getElementById('lng');
    const addressField = document.getElementById('address');
    const locationField = document.getElementById('locationOfIncident');
    const displayLat = document.getElementById('displayLat');
    const displayLng = document.getElementById('displayLng');
    const displayAddress = document.getElementById('displayAddress');
    const confirmLocation = document.getElementById('confirmLocation');
    const manualAddress = document.getElementById('manualAddress');
    const checkAddressButton = document.getElementById('checkAddress');
    const form = document.getElementById('incidentForm');
    const messageContainer = document.getElementById('messageContainer');

    function updateLocation(lat, lng, address) {
        latField.value = lat;
        lngField.value = lng;
        addressField.value = address;
        locationField.value = address;
        displayLat.textContent = lat;
        displayLng.textContent = lng;
        displayAddress.textContent = address;
    }

    function enableManualAddressEntry(enable) {
        manualAddress.disabled = !enable;
    }

    function disableFormWithMessage(message) {
        form.querySelectorAll('input, textarea, button').forEach(el => el.disabled = true);
        messageContainer.textContent = message;
        messageContainer.style.display = 'block'; // Show the message
    }

    map.on('click', function (e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
            .then(response => response.json())
            .then(data => {
                const address = data.display_name;
                updateLocation(lat, lng, address);
                enableManualAddressEntry(false);
                confirmLocation.checked = false;
            })
            .catch(error => {
                console.error('Error fetching address:', error);
                alert('Address not found.');
                updateLocation(lat, lng, 'Address not found');
            });
    });

    function geocodeAddress(address) {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const lat = data[0].lat;
                    const lng = data[0].lon;
                    const displayName = data[0].display_name;

                    updateLocation(lat, lng, displayName);
                    map.setView([lat, lng], 13);

                    alert('Address found. Coordinates updated.');
                    disableFormWithMessage(''); // Clear message and enable form
                } else {
                    disableFormWithMessage('Sorry, your address was not found. You are not able to fill out the form.');
                }
            })
            .catch(error => {
                console.error('Error fetching address:', error);
                alert('There was an error processing your address.');
            });
    }

    checkAddressButton.addEventListener('click', function () {
        const manualAddressValue = manualAddress.value.trim();
        if (manualAddressValue) {
            geocodeAddress(manualAddressValue);
        } else {
            alert('Please enter an address to check.');
        }
    });

    document.getElementById('zoomToMyLocation').addEventListener('click', function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                map.setView([lat, lng], 13);

                if (userMarker) {
                    userMarker.setLatLng([lat, lng]);
                } else {
                    userMarker = L.marker([lat, lng], { draggable: true }).addTo(map);

                    userMarker.on('moveend', function (e) {
                        const lat = e.target.getLatLng().lat;
                        const lng = e.target.getLatLng().lng;
                        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
                            .then(response => response.json())
                            .then(data => {
                                const address = data.display_name;
                                updateLocation(lat, lng, address);
                                enableManualAddressEntry(false);
                                confirmLocation.checked = false;
                            })
                            .catch(error => console.error('Error fetching address:', error));
                    });
                }

                fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
                    .then(response => response.json())
                    .then(data => {
                        const address = data.display_name;
                        updateLocation(lat, lng, address);
                        enableManualAddressEntry(false);
                        confirmLocation.checked = false;
                    })
                    .catch(error => console.error('Error fetching address:', error));
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    });

    confirmLocation.addEventListener('change', function () {
        if (!this.checked) {
            enableManualAddressEntry(true);
        } else {
            manualAddress.value = '';
            enableManualAddressEntry(false);
        }
    });

    document.getElementById('incidentForm').addEventListener('submit', function (event) {
        event.preventDefault();

        if (!confirmLocation.checked && !manualAddress.value) {
            alert('Please confirm the location or enter the address manually.');
            return;
        }

        if (manualAddress.value) {
            addressField.value = manualAddress.value;
            locationField.value = manualAddress.value;
        }

        const formData = new FormData(this);

        fetch('http://localhost:5000/api/incidents/create', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(result => {
            alert('Your record was saved successfully!');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was a problem with your submission.');
        });
    });
});
