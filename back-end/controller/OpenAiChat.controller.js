import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const chatController = async (req, res) => {
    const { input } = req.body;

    try {

   
        const response = await fetch(process.env.open_AI_API_URL, {
            method: 'POST',
            headers: {
                'api-key': process.env.OPENAI_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'user',
                        content: input // Use the 'input' variable for user content
                    }
                ],
                max_tokens: 4000 // Adjust as needed
            }),
        });
    

        if (!response.ok) {
            throw new Error('Network response was not ok openAi-backend');
           
        }

        const data = await response.json();
        res.json(data.choices[0].message.content);





       
    

    } catch (error) {
        console.error(error);
        res.status(900).send('OpenAI fetch Failed');
    }
};

export default chatController;
