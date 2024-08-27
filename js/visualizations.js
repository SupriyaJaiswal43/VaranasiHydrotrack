document.addEventListener('DOMContentLoaded', async () => {
    // Fetch your data
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/water-quality');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    };

    let data = await fetchData();

    // Check if data is not empty
    if (data.length === 0) {
        console.error('No data found');
        return;
    }

    // Define threshold values
    const thresholds = {
        pH: { min: 6.5, max: 8.5 },
        TDS: { max: 500 },
        Iron: { max: 200 },  // You need to adjust these values based on your requirement
        Calcium: { max: 75 },
        Turbidity: { max: 5 }, // Example threshold
        Magnesium: { max: 50 },
        Nitrate: { max: 45 },
        Fluoride: { max: 1 }, // Example threshold
        Chloride: { max: 250 },
        Sulfate: { max: 250 },
        Alkalinity: { max: 500 },
        Hardness: { max: 300 } // Example threshold
    };

    // Process and prepare data for visualizations
    const parsedData = data.map(d => ({
        ...d,
        TimePeriod: luxon.DateTime.fromISO(d.TimePeriod).year,
        pH: d.pH || 0,
        TDS: d.TDS || 0,
        Iron: d.Iron || 0,
        Calcium: d.Calcium || 0,
        Turbidity: d.Turbidity || 0,
        location: d.location || 'Unknown Site'
    }));

    // Extract unique sites
    const sites = [...new Set(parsedData.map(d => d.location))];

    // Populate the site selector with unique sites
    const siteSelector = document.getElementById('siteSelector');
    sites.forEach(site => {
        const option = document.createElement('option');
        option.value = site;
        option.textContent = site;
        siteSelector.appendChild(option);
    });

    // Function to create a new chart
    const createChart = (siteData) => {
        const chartContainer = document.getElementById('chartContainer');
        chartContainer.innerHTML = ''; // Clear existing chart
        const canvas = document.createElement('canvas');
        canvas.id = 'waterQualityChart';
        chartContainer.appendChild(canvas);

        const chartCtx = canvas.getContext('2d');

        // Prepare data and colors based on thresholds
        const labels = ['pH', 'TDS', 'Turbidity', 'Iron', 'Calcium', 'Magnesium', 'Nitrate', 'Fluoride', 'Chloride', 'Sulfate', 'Alkalinity', 'Hardness'];
        const dataValues = [
            siteData.pH,
            siteData.TDS,
            siteData.Turbidity,
            siteData.Iron,
            siteData.Calcium,
            siteData.Magnesium,
            siteData.Nitrate,
            siteData.Fluoride,
            siteData.Chloride,
            siteData.Sulfate,
            siteData.Alkalinity,
            siteData.Hardness
        ];

        const backgroundColors = dataValues.map((value, index) => {
            const label = labels[index];
            const threshold = thresholds[label];
            if (threshold) {
                if (value > (threshold.max || Infinity) || value < (threshold.min || -Infinity)) {
                    return 'rgba(255, 99, 132, 0.8)'; // Red color for exceeding thresholds
                }
            }
            return 'rgba(54, 162, 235, 0.8)'; // Default color
        });

        return new Chart(chartCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Parameters (Mg/L)',
                    data: dataValues,
                    backgroundColor: backgroundColors,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return `${tooltipItem.label}: ${tooltipItem.raw} Mg/L`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };

    // Function to update the chart and the label
    const updateChart = (site) => {
        const siteData = parsedData.find(d => d.location === site);
        createChart(siteData);
        document.getElementById('selectedLocationLabel').textContent = `Selected Location: ${site}`;
    };

    // Initialize with the first site
    updateChart(sites[0]);

    // Event listener for site selection
    siteSelector.addEventListener('change', (event) => {
        updateChart(event.target.value);
    });

    // Event listener for year range filter
    document.getElementById('filterDateRange').addEventListener('click', () => {
        const year = document.getElementById('yearInput').value;

        const filteredData = parsedData.filter(d => d.TimePeriod === parseInt(year));

        if (filteredData.length > 0) {
            updateChart(filteredData[0].location);
        } else {
            console.error('No data found for the selected year');
        }
    });

    // Function to download chart as image
    const downloadChart = (canvas, filename) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL();
        link.download = filename;
        link.click();
    };

    // Event listener for downloading chart as image
    document.getElementById('downloadChart').addEventListener('click', () => {
        const canvas = document.getElementById('waterQualityChart');
        downloadChart(canvas, 'Water_Quality_Chart.png');
    });

    // Function to download all charts as PDF
    const downloadAllChartsAsPDF = () => {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        
        const canvas = document.getElementById('waterQualityChart');
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 10, 10, 180, 160);

        pdf.save('All_Charts.pdf');
    };

    // Event listener for downloading all charts as PDF
    document.getElementById('downloadAllCharts').addEventListener('click', downloadAllChartsAsPDF);

    // Real-time data updates (optional, e.g., every 5 minutes)
    setInterval(async () => {
        const newData = await fetchData();
        if (newData.length > 0) {
            // Update the visualizations with new data
            const updatedParsedData = newData.map(d => ({
                ...d,
                TimePeriod: luxon.DateTime.fromISO(d.TimePeriod).year,
                pH: d.pH || 0,
                TDS: d.TDS || 0,
                Iron: d.Iron || 0,
                Calcium: d.Calcium || 0,
                Turbidity: d.Turbidity || 0,
                location: d.location || 'Unknown Site'
            }));
            parsedData.length = 0; // Clear the old data
            parsedData.push(...updatedParsedData);
            updateChart(document.getElementById('siteSelector').value);
        }
    }, 300000); // 5 minutes
});
