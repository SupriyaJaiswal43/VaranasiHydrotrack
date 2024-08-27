document.addEventListener('DOMContentLoaded', function () {
    const localRadio = document.getElementById('local');
    const webRadio = document.getElementById('web');
    const fileUploadDiv = document.getElementById('fileUpload');
    const websiteLinkDiv = document.getElementById('websiteLink');
    const form = document.getElementById('submissionForm');

    if (localRadio && webRadio && fileUploadDiv && websiteLinkDiv) {
        localRadio.addEventListener('change', function () {
            if (localRadio.checked) {
                fileUploadDiv.style.display = 'block';
                websiteLinkDiv.style.display = 'none';
            }
        });

        webRadio.addEventListener('change', function () {
            if (webRadio.checked) {
                fileUploadDiv.style.display = 'none';
                websiteLinkDiv.style.display = 'block';
            }
        });
    } else {
        console.error('One or more elements not found in the DOM');
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        fetch('http://localhost:5000/api/documents/create', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while submitting your document.');
        });
    });
});
