const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Route for generating images
app.post('/api/generate-images', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        // Generate images from all three services
        const [dalleImage, stabilityImage, huggingfaceImage] = await Promise.all([
            // DALL-E
            fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.DALLE_API_KEY}`
                },
                body: JSON.stringify({
                    prompt: prompt,
                    n: 1,
                    size: '1024x1024'
                })
            }).then(res => res.json()).then(data => data.data[0].url),

            // Stability AI
            fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.STABLE_DIFFUSION_API_KEY}`
                },
                body: JSON.stringify({
                    text_prompts: [{ text: prompt }],
                    cfg_scale: 7,
                    height: 1024,
                    width: 1024,
                    steps: 30,
                    samples: 1
                })
            }).then(res => res.json()).then(data => data.artifacts[0].base64),

            // Hugging Face
            fetch('https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`
                },
                body: JSON.stringify({
                    inputs: prompt
                })
            }).then(res => res.blob()).then(blob => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            })
        ]);

        res.json({
            images: [dalleImage, stabilityImage, huggingfaceImage]
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to generate images' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 