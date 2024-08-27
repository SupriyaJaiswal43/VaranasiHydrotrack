document.addEventListener('DOMContentLoaded', async () => {
    const yearRange = document.getElementById('yearRange');
    const yearLabel = document.getElementById('yearLabel');
    const waterQualityChartCanvas = document.getElementById('waterQualityChart').getContext('2d');
    const downloadButton = document.getElementById('downloadChart');
    const fullScreenButton = document.getElementById('fullScreenChart');

    let chartInstance;

    // Fetch and process data
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

    const data = await fetchData();
    console.log('Fetched data:', data);  // Debugging step

    // Check if data is available
    if (!data || data.length === 0) {
        console.error('No data available.');
        return;
    }

    // Process data
    const processData = () => {
        const years = [...new Set(data.map(d => d.timePeriod.split(' ')[3]))];
        const locations = [...new Set(data.map(d => d.location))];

        const datasets = years.map(year => {
            const dataPoints = locations.map(location => {
                const dataPoint = data.find(d => d.location === location && d.timePeriod.split(' ')[3] === year);
                return dataPoint ? dataPoint.WQI : null;
            });

            // Calculate average WQI for the year
            const averageWQI = dataPoints.reduce((sum, wqi) => sum + (wqi || 0), 0) / dataPoints.length;

            let borderColor;
            if (averageWQI > 75) {
                borderColor = 'rgba(0, 255, 0, 1)'; // Good (Green)
            } else if (averageWQI > 50) {
                borderColor = 'rgba(255, 255, 0, 1)'; // Average (Yellow)
            } else {
                borderColor = 'rgba(255, 0, 0, 1)'; // Poor (Red)
            }

            return {
                label: year,
                data: dataPoints,
                fill: false,
                borderColor: borderColor,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            };
        });

        return { locations, datasets };
    };

    // Function to create or update chart
    const createOrUpdateChart = () => {
        const { locations, datasets } = processData();

        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(waterQualityChartCanvas, {
            type: 'line',
            data: {
                labels: locations,
                datasets: datasets
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Location'
                        },
                        grid: {
                            display: true,
                            color: 'rgba(200, 200, 200, 0.3)'
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Water Quality Index (WQI)'
                        },
                        beginAtZero: true,
                        grid: {
                            display: true,
                            color: 'rgba(200, 200, 200, 0.3)'
                        },
                        ticks: {
                            callback: function(value, index, values) {
                                return value.toFixed(2);
                            }
                        }
                    }
                }
            }
        });
    };

    // Initial chart creation
    createOrUpdateChart();

    // Update chart on year range change
    yearRange.addEventListener('input', (event) => {
        const year = event.target.value;
        yearLabel.textContent = year;
        createOrUpdateChart();
    });

    // Download chart as an image
    downloadButton.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = chartInstance.toBase64Image();
        a.download = 'water-quality-chart.png';
        a.click();
    });

    // Full screen chart
    fullScreenButton.addEventListener('click', () => {
        const canvasContainer = document.getElementById('waterQualityChart').parentNode;
        if (canvasContainer.requestFullscreen) {
            canvasContainer.requestFullscreen();
        } else if (canvasContainer.mozRequestFullScreen) { // Firefox
            canvasContainer.mozRequestFullScreen();
        } else if (canvasContainer.webkitRequestFullscreen) { // Chrome, Safari and Opera
            canvasContainer.webkitRequestFullscreen();
        } else if (canvasContainer.msRequestFullscreen) { // IE/Edge
            canvasContainer.msRequestFullscreen();
        }
    });
});
