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

    // Simulate API call to AI platforms
    console.log('Generating images for:', { place, issue });
    
    // Here you would typically:
    // 1. Show loading state
    // 2. Make API calls to AI platforms
    // 3. Update the images in the DOM
    // 4. Hide loading state
    
    alert('Image generation simulation complete! In a real app, this would call AI APIs.');
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
