

 🌍 Water Quality Monitoring and Geocoding Application

This project is a Water Quality Monitoring and Geocoding Application that provides a comprehensive platform for mapping, visualizing, and analyzing water quality data. It leverages the power of OpenStreetMap, Nominatim, and Chart.js to offer users an interactive experience for submitting, visualizing, and interpreting water quality metrics.



 🚀 Features

- Geocoding Functionality: Converts user-provided addresses into geographic coordinates using the Nominatim service from OpenStreetMap.
- Water Quality Data Integration: Users can submit water quality data (pH, turbidity, contaminant levels, etc.) via a user-friendly form.
- Interactive Map: Visualizes water quality data on a map with clustering techniques to avoid clutter and provide insights into regional trends.
- Pollution Reporting: Users can report water quality pollution incidents directly on the map by selecting the location.
- Data Visualization: Display water quality trends over time using charts powered by Chart.js.
- Document Submission: Upload and store documents related to water quality incidents.

 🛠️ Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB (Spatial indexing for quick location-based queries)
- Geospatial Mapping: OpenStreetMap, Nominatim API, Leaflet.js
- Data Visualization: Chart.js

 📋 Project Setup

 Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v12 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) installed locally or an online MongoDB service (e.g., MongoDB Atlas)

 Installation

1. Clone the repository:

   ```bash
   git clone origin https://github.com/SupriyaJaiswal43/VaranasiHydrotrack.git
   cd water-quality-monitoring-app
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up your MongoDB connection in `.env`:

   ```bash
   MONGO_URI=your_mongodb_connection_string
   ```

4. Start the application:

   ```bash
   npm start
   ```

5. Visit the app locally:

   ```
   http://localhost:3000
   ```

 Demo

- Static Demo: https://supriyajaiswal43.github.io/VaranasiHydrotrack/
- Dynamic Version: Download the full project and run it locally by following the steps above.

 🖼️ Screenshots

<!-- Add some screenshots or gifs showing your application features -->

- Water Quality Map with Clustering
- Pollution Reporting Form
- Data Visualization Charts

 📑 Usage

1. Submit Water Quality Data: Fill in the form with metrics like pH, turbidity, and other relevant parameters.
2. Report Pollution Incidents: Choose a location and provide details about the pollution incident.
3. Visualize Trends: Use the interactive charts and map to analyze water quality data across different locations and time periods.

 🔗 API Integration

- Nominatim API: Converts user-provided addresses into geographic coordinates.
- OpenStreetMap: Provides the mapping platform for visualizing data.

 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](link_to_issues_page).

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

 📧 Contact

If you have any questions or feedback, feel free to reach out at supriyajswl43@gmail.com

