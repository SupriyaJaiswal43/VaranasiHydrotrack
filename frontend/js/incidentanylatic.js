document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:5000/api/incidents/analytics');

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Process data for Incidents Over Time Chart
        const labels = data.map(item => `${item._id.month}-${item._id.year}`);
        const incidentsData = data.map(item => item.totalIncidents);

        // Incidents Over Time Chart with Attractive Colors
        const incidentsOverTimeChartCtx = document.getElementById('incidentsOverTimeChart').getContext('2d');
        const incidentsOverTimeChart = new Chart(incidentsOverTimeChartCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Incidents Over Time',
                    data: incidentsData,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)', // Softer cyan color with transparency
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    hoverBackgroundColor: 'rgba(75, 192, 192, 0.8)', // Darker on hover
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(200, 200, 200, 0.3)', // Light grid lines
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(200, 200, 200, 0.3)', // Light grid lines
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#333', // Darker text color for contrast
                        }
                    }
                }
            }
        });

        // Process data for Activity Concerns Pie Chart
        const activityConcerns = data.reduce((acc, item) => {
            item.activityConcerns.forEach(concern => {
                if (!acc[concern]) {
                    acc[concern] = 0;
                }
                acc[concern]++;
            });
            return acc;
        }, {});

        const concernLabels = Object.keys(activityConcerns);
        const concernCounts = Object.values(activityConcerns);

        // Activity Concerns Pie Chart with Attractive Colors
        const activityConcernsChartCtx = document.getElementById('activityConcernsChart').getContext('2d');
        const activityConcernsChart = new Chart(activityConcernsChartCtx, {
            type: 'pie',
            data: {
                labels: concernLabels,
                datasets: [{
                    label: 'Activity Concerns',
                    data: concernCounts,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',  // Soft red
                        'rgba(54, 162, 235, 0.7)',  // Soft blue
                        'rgba(255, 206, 86, 0.7)',  // Soft yellow
                        'rgba(75, 192, 192, 0.7)',  // Soft cyan
                        'rgba(153, 102, 255, 0.7)', // Soft purple
                        'rgba(255, 159, 64, 0.7)',  // Soft orange
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 2,
                    hoverOffset: 15 // Increases size on hover for effect
                }]
            },
            options: {
                plugins: {
                    legend: {
                        labels: {
                            color: '#333', // Darker text color for contrast
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});
