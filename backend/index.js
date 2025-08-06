require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
const upload = multer({ dest: 'uploads/' });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());

app.post('/analyze', upload.single('image'), async (req, res) => {
    try {
        const imagePath = req.file.path;

        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });
        const base64Data = `data:image/jpeg;base64,${imageBase64}`;

        const prompt = `
You are a dermatologist assistant. Analyze this image and return the following in JSON:
- Condition name
- Confidence level (estimate in %)
- Disease overview
- Visit urgency (low, moderate, high)
- Previsit care
- Visit preparation
- Similar conditions
- Any other useful medical info
        `;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: prompt },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image_url',
                            image_url: { url: base64Data }
                        }
                    ]
                }
            ],
            max_tokens: 1000
        });

        const result = response.choices[0].message.content;
        res.json({ result });

        fs.unlinkSync(imagePath); // Cleanup
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Image analysis failed.' });
    }
});

app.listen(3000, () => {
    console.log('🟢 Server running at http://localhost:3000');
});
