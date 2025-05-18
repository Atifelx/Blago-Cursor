// import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

// const chatController = async (req, res) => {
//     const { input } = req.body;


//     try {
//         const response = await axios.post(
//             process.env.open_AI_API_URL,
//             {
//                 model: 'gpt-40',
//                 messages: [
//                     {
//                         role: 'user',
//                         content: input // Use the 'input' variable for user content
//                     }
//                 ],
//                 max_tokens: 6000 // Adjust as needed
//             },
//             {
//                 headers: {
//                     'api-key': process.env.OPENAI_API_KEY,
//                     'Content-Type': 'application/json',
//                 }
//             }
//         );

//         // Axios will throw an error if the response status is not 2xx
//         if (response.status !== 200) {
//             throw new Error('Network response was not ok openAi-backend');
//         }

//         // Extracting the content of the response
//         const data = response.data;
//         res.json(data.choices[0].message.content);

//     } catch (error) {
//         console.error(error);
//         res.status(500).send('OpenAI request failed');
//     }
// };

// export default chatController;


//---------------------------------------- Gemini API--------------------------------------

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const chatController = async (req, res) => {
    const { input } = req.body;

    // Handle empty input
    if (!input || input.trim() === '') {
        return res.status(400).json({ error: 'Input cannot be empty' });
    }
    
    try {
      
        const apiKey = process.env.GEMINI_API_KEY; // Uncomment this line to use the environment variable

   
        const modelName = "gemini-2.0-flash"; // Using Gemini 2.0 Flash model
        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

        console.log('Sending request to Gemini API...');
        console.log('Request payload:', JSON.stringify({
            contents: [{ parts: [{ text: input }] }]
        }, null, 2));

        const response = await axios.post(
            geminiEndpoint,
            {
                contents: [
                    {
                        parts: [
                            { text: input } // Using the input variable for user content
                        ]
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('Gemini API response status:', response.status);
        
        // Extracting the content from the Gemini response structure
        const data = response.data;
        console.log('Gemini API response data:', JSON.stringify(data, null, 2));
        
        // Check if the response has the expected structure
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
            console.error('Unexpected response structure from Gemini API:', data);
            return res.status(500).json({ error: 'Unexpected response structure from Gemini API' });
        }
        
        // Gemini API returns content in a different structure than OpenAI
        const content = data.candidates[0].content.parts[0].text;
        
        res.json(content);

    } catch (error) {
        console.error('Gemini API error details:', error.message);
        
        // Check if error response contains more details
        if (error.response) {
            console.error('Gemini API error response:', error.response.data);
            console.error('Gemini API error status:', error.response.status);
            return res.status(error.response.status).json({ 
                error: 'Gemini API request failed', 
                details: error.response.data 
            });
        }
        
        res.status(500).json({ 
            error: 'Gemini API request failed', 
            message: error.message 
        });
    }
};

export default chatController;