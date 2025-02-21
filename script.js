function handleGenerate() {
    const place = document.getElementById('place').value;
    const issue = document.getElementById('issue').value;

    if (!place || !issue) {
        alert('Please fill in both fields');
        return;
    }

    // Show loading state
    const generateBtn = document.getElementById('generate-btn');
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';

    // Prepare the prompt for AI
    const prompt = `Show the impact of ${issue} on ${place} in a realistic style`;

    // Make API call to backend
    fetch('/api/generate-images', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
    })
    .then(response => response.json())
    .then(data => {
        // Update images
        document.getElementById('dalle-image').src = data.images[0];
        document.getElementById('sd-image').src = data.images[1];
        document.getElementById('hf-image').src = data.images[2];
    })
    .catch(error => {
        console.error('Error generating images:', error);
        alert('Error generating images. Please try again.');
    })
    .finally(() => {
        // Reset button state
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate';
    });
} 
