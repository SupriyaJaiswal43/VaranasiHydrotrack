document.getElementById('filterButton').addEventListener('click', fetchDocuments);

function fetchDocuments() {
    const nameFilter = document.getElementById('nameFilter').value;
    const url = nameFilter ? `http://localhost:5000/api/documents?name=${nameFilter}` : 'http://localhost:5000/api/documents';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.querySelector('#documentTable tbody');
            tableBody.innerHTML = ''; // Clear previous data

            data.forEach(doc => {
                const row = document.createElement('tr'); 

                // Correctly construct the document link
                const documentLink = doc.documentSource === 'your computer' 
                    ? `<a href="http://localhost:5000${doc.documentPath}" target="_blank">View Document</a>` // Use HTTP path
                    : `<a href="${doc.documentPath}" target="_blank">External Link</a>`;

                row.innerHTML = `
                    <td>${doc.name}</td>
                    <td>${doc.email}</td>
                    <td>${doc.phone}</td>
                    <td>${doc.title}</td>
                    <td>${doc.description}</td>
                    <td>${doc.author}</td>
                    <td>${doc.publishingOrganization}</td>
                    <td><a href="${doc.organizationWebsite}" target="_blank">${doc.organizationWebsite}</a></td>
                    <td>${doc.yearPublished}</td>
                    <td>${doc.documentSource}</td>
                    <td>${documentLink}</td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching documents:', error));
}

// Fetch all documents on page load
fetchDocuments();
