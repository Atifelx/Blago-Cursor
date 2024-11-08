import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const chatController = async (req, res) => {
    const { input } = req.body;

    try {
        const response = await axios.post(
            process.env.open_AI_API_URL,
            {
                model: 'gpt-4',
                messages: [
                    {
                        role: 'user',
                        content: input // Use the 'input' variable for user content
                    }
                ],
                max_tokens: 5000 // Adjust as needed
            },
            {
                headers: {
                    'api-key': process.env.OPENAI_API_KEY,
                    'Content-Type': 'application/json',
                }
            }
        );

        // Axios will throw an error if the response status is not 2xx
        if (response.status !== 200) {
            throw new Error('Network response was not ok openAi-backend');
        }

        // Extracting the content of the response
        const data = response.data;
        res.json(data.choices[0].message.content);

    } catch (error) {
        console.error(error);
        res.status(500).send('OpenAI request failed');
    }
};

export default chatController;
