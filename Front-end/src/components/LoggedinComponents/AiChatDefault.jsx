import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button , Spinner } from 'flowbite-react'; 

const ChatComponent = () => {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const fetchData = async () => {
        setLoading(true);
      
        try {
            const res = await fetch('http://localhost:3000/api/askai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input }),
            });

            if (!res.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await res.json();
            setResponse(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setResponse('Error fetching data. Please try again.');
        } finally {
            setLoading(false);
            setInput('');
          
        }
    };

    const parseResponse = (text) => {
        const lines = text.split('\n');
        const result = [];
        let inCodeBlock = false;
        let codeBlockContent = '';

        lines.forEach((line, index) => {
            // Header parsing
            if (line.startsWith('###### ')) {
                result.push(<h6 key={index}>{line.slice(7)}</h6>);
            } else if (line.startsWith('##### ')) {
                result.push(<h5 key={index}>{line.slice(6)}</h5>);
            } else if (line.startsWith('#### ')) {
                result.push(<h4 key={index}>{line.slice(5)}</h4>);
            } else if (line.startsWith('### ')) {
                result.push(<h3 key={index}>{line.slice(4)}</h3>);
            } else if (line.startsWith('## ')) {
                result.push(<h2 key={index}>{line.slice(3)}</h2>);
            } else if (line.startsWith('# ')) {
                result.push(<h1 key={index}>{line.slice(2)}</h1>);
            }
            // Bold and italic parsing
            else if (line.includes('**') && line.includes('**')) {
                const parts = line.split(/\*\*(.*?)\*\*/g);
                result.push(
                    <p key={index}>
                        {parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
                    </p>
                );
            } else if (line.includes('*') && line.includes('*')) {
                const parts = line.split(/\*(.*?)\*/g);
                result.push(
                    <p key={index}>
                        {parts.map((part, i) => (i % 2 === 1 ? <em key={i}>{part}</em> : part))}
                    </p>
                );
            }
            // List and ordered list parsing
            else if (/^\d+\./.test(line)) {
                result.push(<li key={index}>{line.slice(line.indexOf('.') + 1).trim()}</li>);
            } else if (line.startsWith('- ') || line.startsWith('* ')) {
                result.push(<li key={index}>{line.slice(2).trim()}</li>);
            }
            // Code block parsing
            else if (line.startsWith('```')) {
                if (inCodeBlock) {
                    result.push(
                        <SyntaxHighlighter 
                            key={index} 
                            language="javascript"
                            style={prism}
                        >
                            {codeBlockContent.trim()}
                        </SyntaxHighlighter>
                    );
                    inCodeBlock = false;
                    codeBlockContent = '';
                } else {
                    inCodeBlock = true;
                }
            } else if (inCodeBlock) {
                codeBlockContent += line + '\n';
            }
            // Blockquote parsing
            else if (line.startsWith('> ')) {
                result.push(<blockquote key={index} className="border-l-4 pl-4 italic">{line.slice(2).trim()}</blockquote>);
            } else {
                result.push(<p key={index}>{line}</p>);
            }
        });
      
        return result;
    };

    return (
        <div className="flex flex-col flex-1 bg-gray-100 p-4 rounded-lg  lg:h-screen md:h-auto w-full sm:w-auto">
            <div className='flex items-center bg-gray-100 border border-slate-200 rounded-md p-5'>
                <input 
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your question here."
                    className='flex-1 p-2 border  bg-gray-200 rounded-xl font-normal from-neutral-700'
                />
                <Button Button color="light" 
                
                    onClick={fetchData} 
                    disabled={loading}
                    className="bg-slate-600 text-neutral-600 ml-2 rounded-xl bg-transparent hover:text-neutral-900 border-solid " pill
                >
                    {loading ? <Spinner aria-label="Medium sized spinner example" size="md" /> : 'Get Response'}
                    
                </Button>
            </div>
            <div className='mt-4 flex  font-normal text-neutral-800 '>
                {parseResponse(response)}
            </div>
        </div>
    );
};

export default ChatComponent;
