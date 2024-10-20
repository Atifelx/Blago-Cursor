// src/components/LoggedinComponents/customtool/ConsoleTool.js
export default class ConsoleTool {
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
        this.button.innerHTML = '<svg width="14" height="14"><circle cx="7" cy="7" r="7" fill="green"></circle></svg>'; // Temporary icon
        this.button.addEventListener('click', this.handleClick.bind(this));
        return this.button;
    }

    async handleClick() {
        const selection = window.getSelection(); // Use native selection API
        const selectedText = selection.toString(); // Get the selected text
      
        if (selectedText) {
          try {

            const prompt = `You are an advanced text rephraser. 
            Your task is to take the provided input text, correct any grammatical or structural errors, and return a rephrased version. 
            If you encounter any text that appears unstructured, nonsensical, or gibberish (such as random characters or words that do not form coherent sentences), return the original text without any alterations or questions.
            
            Input text: ${selectedText}`;
            

            // Call the OpenAI API
            const res = await fetch('http://localhost:3000/api/Rewrite', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ input: prompt }),
            });
      
            if (!res.ok) {
              throw new Error(`API error! Status: ${res.status}`);
            }
      
            const data = await res.json();
      
            const newText = data.modifiedText || selectedText; // Use modifiedText from API response
            
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
      
          } catch (error) {
            console.error('Error fetching data:', error);
   
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
