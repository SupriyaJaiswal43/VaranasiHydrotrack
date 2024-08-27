document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('waterQualityForm');
    const viewDataButton = document.getElementById('viewDataButton');

    // Check local storage to see if the button should be visible
    if (localStorage.getItem('viewDataButtonVisible') === 'true') {
        viewDataButton.style.display = 'block';
    }

    // Function to populate dropdowns
    const populateDropdowns = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/water-quality/dropdowns');
            const { locations, years, countries, states, cities } = await response.json();

            // Store the dropdown options globally for validation
            window.dropdownOptions = {
                locations: locations,
                countries: countries,
                states: states,
                cities: cities,
                years: years
            };

            // Helper function to add "None" option if it doesn't already exist
            const addNoneOption = (selectElement) => {
                if (!Array.from(selectElement.options).some(option => option.value === 'none')) {
                    const noneOption = document.createElement('option');
                    noneOption.value = 'none';
                    noneOption.textContent = 'None';
                    selectElement.appendChild(noneOption);
                }
            };

            // Populate select elements and add "None" option
            const populateSelect = (selectElement, options) => {
                options.forEach(optionValue => {
                    const option = document.createElement('option');
                    option.value = optionValue;
                    option.textContent = optionValue;
                    selectElement.appendChild(option);
                });
                addNoneOption(selectElement);
            };

            // Populate each dropdown
            populateSelect(document.getElementById('locations'), locations);
            populateSelect(document.getElementById('countries'), countries);
            populateSelect(document.getElementById('states'), states);
            populateSelect(document.getElementById('cities'), cities);
            populateSelect(document.getElementById('years'), years);
        } catch (error) {
            console.error('Error fetching dropdown data:', error);
        }
    };

    // Handle dropdown change events
    document.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', (event) => {
            const selectElement = event.target;
            const textInput = document.getElementById(`${selectElement.id}Text`);
            if (textInput) {
                if (selectElement.value === 'none') {
                    textInput.style.display = 'block';
                    textInput.required = true;
                } else {
                    textInput.style.display = 'none';
                    textInput.required = false;
                }
            }
        });
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const data = {};

        let validationFailed = false;

        formData.forEach((value, key) => {
            if (value === 'none') {
                const textInput = document.getElementById(`${key}Text`);
                if (textInput && textInput.style.display === 'block') {
                    const existingOptions = window.dropdownOptions[key] || [];
                    if (existingOptions.includes(textInput.value)) {
                        alert(`The value "${textInput.value}" already exists in the dropdown for ${key}. Please select from the dropdown.`);
                        validationFailed = true;
                        return;
                    }
                    data[key] = textInput.value; // Use the text input value if "None" is selected
                } else {
                    data[key] = null; // Or set to null if no text input is provided
                }
            } else {
                data[key] = value; // Use the dropdown value
            }
        });

        // Ensure required fields are properly set
        if (!data.state) data.state = form.querySelector('#statesText').value || null;
        if (!data.city) data.city = form.querySelector('#citiesText').value || null;
        if (!data.country) data.country = form.querySelector('#countriesText').value || null;
        if (!data.location) data.location = form.querySelector('#locationsText').value || null;
        if (!data.timePeriod) data.timePeriod = form.querySelector('#yearsText').value || null;

        // Format the timePeriod field to only store the year
        if (data.timePeriod && !isNaN(new Date(data.timePeriod).getFullYear())) {
            data.timePeriod = new Date(data.timePeriod).getFullYear().toString(); // Extract only the year part
        }

        if (validationFailed) {
            return; // Prevent form submission if validation failed
        }

        try {
            const response = await fetch('http://localhost:5000/api/water-quality', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Data submitted successfully!');
                form.reset();

                // Make the "View Your Submitted Data" button visible after successful submission
                viewDataButton.style.display = 'block';

                // Save button visibility state to local storage
                localStorage.setItem('viewDataButtonVisible', 'true');
            } else {
                throw new Error('Failed to submit data');
            }
        } catch (error) {
            console.error('Error submitting data:', error);
            alert('Error submitting data. Please try again.');
        }
    });

    populateDropdowns();
});
