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
        // Update all image cards
        const imageCards = document.querySelectorAll('.image-card img');
        data.images.forEach((imageUrl, index) => {
            if (imageCards[index]) {
                imageCards[index].src = imageUrl;
            }
        });
    })
    .catch(error => {
        console.error('Error generating images:', error);
        alert('Error generating images. Please try again.');
    })
    .finally(() => {
        // Reset button state
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate Visualizations';
    });
}

// Add event listeners for action buttons
document.addEventListener('DOMContentLoaded', () => {
    // Save button functionality
    document.querySelectorAll('.save-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const img = this.closest('.image-card').querySelector('img');
            const link = document.createElement('a');
            link.href = img.src;
            link.download = 'climate-visualization.png';
            link.click();
        });
    });

    // Share button functionality
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const img = this.closest('.image-card').querySelector('img');
            if (navigator.share) {
                navigator.share({
                    title: 'Climate Change Visualization',
                    text: 'Check out this climate change visualization',
                    url: img.src
                });
            } else {
                alert('Sharing is not supported on this browser');
            }
        });
    });

    // Like button functionality
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.textContent = this.textContent === '❤️' ? '💚' : '❤️';
        });
    });
}); 
