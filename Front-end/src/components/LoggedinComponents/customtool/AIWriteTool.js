class AIWriteTool {
    constructor({ api }) {
        this.api = api;
        this.button = null; // Initialize button as null

        // Use onInit to create the button
        this.init();
    }

    init() {
        if (this.api.button) {
            this.button = this.renderButton();
            this.button.addEventListener('click', () => this.checkGrammar());
        } else {
            console.error('API button is undefined. Unable to initialize AIWriteTool.');
        }
    }

    renderButton() {
        const button = this.api.button.render('AI Write');
        button.classList.add('cdx-button');
        return button;
    }

    checkGrammar() {
        const selectedText = this.api.selection.getText();
        if (selectedText) {
            this.callAIWriteAPI(selectedText);
        } else {
            alert("Please select some text to correct.");
        }
    }

    callAIWriteAPI(selectedText) {
        fetch('https://myopenai-ai.openai.azure.com/openai/deployments/gpt40-demo/chat/completions?api-version=2024-02-15-preview', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': 'your-api-key-here', // Replace with your API key
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: "user",
                        content: `Rewrite this text with correct grammar: "${selectedText}"`
                    }
                ]
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            this.handleResponse(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    handleResponse(data) {
        const enhancedText = data.choices[0]?.message.content || '';
        this.api.selection.replaceText(enhancedText);
    }

    static get toolbox() {
        return {
            title: 'AI Write',
            icon: `<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-3">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path>
                  </svg>`,
        };
    }
}

export default AIWriteTool;
