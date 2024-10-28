import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const Rewrite = async (req, res) => {


    const { input, action } = req.body;

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
                        content: `${action}: ${input}`,
                    }
                ],
                max_tokens: 4000 // Adjust as needed
            }),
        });
    

        if (!response.ok) {
            throw new Error('Network response was not ok openAi-backend');
           
        }

 
     const data = await response.json();
        
     const modifiedText = data.choices[0].message.content.trim();

     res.status(200).json({ modifiedText });

console.log("moodified tex",modifiedText);
       
    

    } catch (error) {
        console.error(error);
        res.status(900).send('OpenAI fetch Failed');
    }
};

export default Rewrite;
