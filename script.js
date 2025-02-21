document.addEventListener('DOMContentLoaded', function() {
    // Tab Switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Generate Button Click Handler
    const generateBtn = document.getElementById('generate-btn');
    generateBtn.addEventListener('click', handleGenerate);

    // Like Button Handlers
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(button => {
        button.addEventListener('click', handleLike);
    });

    // Save Button Handlers
    const saveButtons = document.querySelectorAll('.save-btn');
    saveButtons.forEach(button => {
        button.addEventListener('click', handleSave);
    });

    // Share Button Handlers
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
        button.addEventListener('click', handleShare);
    });
});

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
        updateImageCards(data.images);
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

function updateImageCards(images) {
    const imageCards = document.querySelectorAll('.image-card img');
    images.forEach((imageUrl, index) => {
        if (imageCards[index]) {
            imageCards[index].src = imageUrl;
        }
    });
}

function handleLike(event) {
    const button = event.currentTarget;
    // Toggle between filled and outline heart emoji
    button.textContent = button.textContent === '❤️' ? '🤍' : '❤️';
}

function handleSave(event) {
    const imageCard = event.currentTarget.closest('.image-card');
    const imageUrl = imageCard.querySelector('img').src;
    
    // In a real app, you would:
    // 1. Save the image to local storage or a database
    // 2. Show a success message
    
    alert('Image saved to gallery!');
}

function handleShare(event) {
    const imageCard = event.currentTarget.closest('.image-card');
    const imageUrl = imageCard.querySelector('img').src;

    // Check if Web Share API is supported
    if (navigator.share) {
        navigator.share({
            title: 'Climate Change Visualization',
            text: 'Check out this climate change visualization!',
            url: imageUrl
        })
        .catch(error => console.log('Error sharing:', error));
    } else {
        // Fallback for browsers that don't support Web Share API
        alert('Share functionality is not supported in your browser. You can copy the image URL instead.');
    }
}
 API
        alert('Share functionality is not supported in your browser. You can copy the image URL instead.');
    }
}
