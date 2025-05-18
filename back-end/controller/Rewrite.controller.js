// import fetch from 'node-fetch';
// import dotenv from 'dotenv';

// dotenv.config();

// const Rewrite = async (req, res) => {


//     const { input, action } = req.body;

//     try {

   
//         const response = await fetch(process.env.open_AI_API_URL, {
//             method: 'POST',
//             headers: {
//                 'api-key': process.env.OPENAI_API_KEY,
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 model: 'gpt-4',
//                 messages: [
//                     {
//                         role: 'user',
//                         content: `${action}: ${input}`,
//                     }
//                 ],
//                 max_tokens: 4000 // Adjust as needed
//             }),
//         });
    

//         if (!response.ok) {
//             throw new Error('Network response was not ok openAi-backend');
           
//         }

 
//      const data = await response.json();
        
//      const modifiedText = data.choices[0].message.content.trim();

//      res.status(200).json({ modifiedText });

// console.log("moodified tex",modifiedText);
       
    

//     } catch (error) {
//         console.error(error);
//         res.status(900).send('OpenAI fetch Failed');
//     }
// };

// export default Rewrite;

//----------------------------------------- Gemini API--------------------------------------



import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const Rewrite = async (req, res) => {
    const { input, action } = req.body;

    try {
        // Hardcoded API key (for development only - move to .env in production)
        const apiKey = process.env.GEMINI_API_KEY; // Uncomment this line to use the environment variable
        // const apiKey = 'AIzaSyDLc8JxIjctNJ8nnxHQKIggpMS_isl3k7E';
        const modelName = "gemini-2.0-flash"; // Using Gemini 2.0 Flash model
        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

        // Format the prompt the same way: action: input
        const prompt = `${action}: ${input}`;

        const response = await fetch(geminiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: prompt }
                        ]
                    }
                ]
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok gemini-backend');
        }

        const data = await response.json();
        
        // Extract the content from Gemini's response structure
        // Gemini returns content in data.candidates[0].content.parts[0].text
        const modifiedText = data.candidates[0].content.parts[0].text.trim();

        res.status(200).json({ modifiedText });

       // console.log("modified text", modifiedText);

    } catch (error) {
        console.error(error);
        res.status(900).send('Gemini fetch Failed');
    }
};

export default Rewrite;

