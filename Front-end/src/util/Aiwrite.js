// utility.js
export async function rephraseText(selectedText) {
    if (!selectedText) {
        throw new Error('No text provided for rephrasing.');
    }

    const prompt = `You are an advanced text rephraser. 
Your task is to take the provided input text, correct any grammatical or structural errors, and return a rephrased version. 
If you encounter any text that appears unstructured, nonsensical, or gibberish (such as random characters or words that do not form coherent sentences), return the original text without any alterations or questions.

Input text: ${selectedText}`;

    try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
        const res = await fetch(`${baseUrl}/Rewrite`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input: prompt }),
        });

        if (!res.ok) {
            throw new Error(`API error! Status: ${res.status}`);
        }

        const data = await res.json();
        return data.modifiedText || selectedText; // Return modifiedText or fallback to selectedText

    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Rethrow the error for handling in the calling function
    }
}




/// import { rephraseText } from './utility'; // Adjust the path based on your project structure

// async handleClick() {
//     
//             const newText = await rephraseText(selectedText); // 

// }