// Custom ConsoleTool for CreateBooksAI that prevents editor refresh
import AIicon from "../../../assets/AIicon.svg"

const apiUrRR = import.meta.env.VITE_API_BASE_URL;

export default class CreateBooksConsoleTool {
    static get isInline() {
        return true; // Mark this tool as inline
    }

    constructor({ api }) {
        this.api = api;
        this.button = null;
    }

    render() {
        this.button = document.createElement('button');
        this.button.type = 'button';
        this.button.title = 'AI Write'; 
        this.button.innerHTML = `
        <svg
            width="14"
            height="14"
            viewBox="0 0 64 64"
            stroke-width="3"
            stroke="#000000"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="34.52" cy="11.43" r="5.82" />
            <circle cx="53.63" cy="31.6" r="5.82" />
            <circle cx="34.52" cy="50.57" r="5.82" />
            <circle cx="15.16" cy="42.03" r="5.82" />
            <circle cx="15.16" cy="19.27" r="5.82" />
            <circle cx="34.51" cy="29.27" r="4.7" />
            <line x1="20.17" y1="16.3" x2="28.9" y2="12.93" />
            <line x1="38.6" y1="15.59" x2="49.48" y2="27.52" />
            <line x1="50.07" y1="36.2" x2="38.67" y2="46.49" />
            <line x1="18.36" y1="24.13" x2="30.91" y2="46.01" />
            <line x1="20.31" y1="44.74" x2="28.7" y2="48.63" />
            <line x1="17.34" y1="36.63" x2="31.37" y2="16.32" />
            <line x1="20.52" y1="21.55" x2="30.34" y2="27.1" />
            <line x1="39.22" y1="29.8" x2="47.81" y2="30.45" />
            <line x1="34.51" y1="33.98" x2="34.52" y2="44.74" />
        </svg>
    `; // AI icon

        this.button.addEventListener('click', this.handleClick.bind(this));
        return this.button;
    }

    async handleClick() {
        const selection = window.getSelection();
        const selectedText = selection.toString();
      
        if (selectedText) {
          try {
            // Notify parent component that AIWrite is processing
            window.dispatchEvent(new CustomEvent('aiwrite-start'));

            const prompt = `You are an advanced text rephraser with a knack for making things sound natural.
            1. For a single word, return a synonym or fix it if it's incorrect.
            2. Rewrite the text to sound like it was written by a real human. Use simpler, everyday vocabulary while keeping the original tone and writing style. Change the wording completely, but don't change the meaning. Make sure the result feels natural, clear, and 100% human-like.
            3. Additionally, apply a humanizer tool to make the text sound even more relatable and genuine.
            Under no circumstances should you ask any questions, seek clarification, or make any assumptions. You must **only return the corrected text** as a result—nothing more, nothing less. Keep it real and straightforward, no exceptions.
        
            Input: ${selectedText}`;

            const response = await fetch(`${apiUrRR}/Rewrite`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ input: prompt }),
            });
      
            if (!response.ok) {
              throw new Error(`API error! Status: ${response.status}`);
            }
      
            const data = await response.json();
            const newText = data.modifiedText || selectedText;
            
            console.log("sendingtext", selectedText);
            console.log("Api response", data);
            console.log("Modified text from API:", newText);

            const range = selection.getRangeAt(0); 
            range.deleteContents(); 
      
            const newNode = document.createTextNode(newText);
            range.insertNode(newNode); 

            range.setStartAfter(newNode);
            range.collapse(true);

            // Clear the selection after modification (optional)
            selection.removeAllRanges();
            selection.addRange(range); // Reselect the new text if desired

            // Notify parent component that AIWrite is complete
            window.dispatchEvent(new CustomEvent('aiwrite-complete'));
      
          } catch (error) {
            console.error('Error fetching data:', error);
            // Notify parent component that AIWrite failed
            window.dispatchEvent(new CustomEvent('aiwrite-complete'));
          }
        } else {
          console.warn('No text selected to modify');
        }
      }
      
    
    static get sanitize() {
        return {
            span: true,
        };
    }

    surround(range) {
        // No additional surround logic needed if modifying selected text directly
    }
}
