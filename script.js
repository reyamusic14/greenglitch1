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

    // API Keys - Store these securely in environment variables in production!
    const API_KEYS = {
        DALLE_API_KEY: 'your-dalle-api-key',
        STABLE_DIFFUSION_API_KEY: 'your-stable-diffusion-api-key',
        HUGGINGFACE_API_KEY: 'your-huggingface-api-key'
    };

    // Show loading state
    const generateBtn = document.getElementById('generate-btn');
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';

    // Prepare the prompt for AI
    const prompt = `Show the impact of ${issue} on ${place} in a realistic style`;

    // Make parallel API calls to different AI services
    Promise.all([
        generateDallEImage(prompt, API_KEYS.DALLE_API_KEY),
        generateStableDiffusionImage(prompt, API_KEYS.STABLE_DIFFUSION_API_KEY),
        generateHuggingFaceImage(prompt, API_KEYS.HUGGINGFACE_API_KEY)
    ])
    .then(images => {
        // Update the image cards in the DOM
        updateImageCards(images);
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

// Helper functions for API calls
async function generateDallEImage(prompt, apiKey) {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            prompt: prompt,
            n: 1,
            size: '1024x1024'
        })
    });

    const data = await response.json();
    return data.data[0].url;
}

async function generateStableDiffusionImage(prompt, apiKey) {
    const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            text_prompts: [{ text: prompt }],
            cfg_scale: 7,
            height: 1024,
            width: 1024,
            steps: 30,
            samples: 1
        })
    });

    const data = await response.json();
    return data.artifacts[0].base64; // You might need to convert base64 to URL
}

async function generateHuggingFaceImage(prompt, apiKey) {
    const response = await fetch('https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            inputs: prompt,
            parameters: {
                num_inference_steps: 30,
                guidance_scale: 7.5,
                width: 1024,
                height: 1024
            }
        })
    });

    // The API returns the image directly as a blob
    const blob = await response.blob();
    return URL.createObjectURL(blob);
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