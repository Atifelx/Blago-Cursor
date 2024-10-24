import React, { useState , useEffect} from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button , Spinner , Clipboard,Textarea} from 'flowbite-react'; 
import { useDispatch } from 'react-redux';
 import {loadData} from '../../app/user/userDataSlice';
 const apiUrlA = import.meta.env.VITE_API_BASE_URL;
//  import Text_Component from "./extareaComponent";




const ChatComponent = () => {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState(localStorage.getItem('response') || ''); // Retrieve response from localStorage
    const [loading, setLoading] = useState(false);
    const [combineString, setCombineString] = useState('');

    const dispatch = useDispatch();





    const codeBlockStyle = {
        backgroundColor: '#282c34', // Dark background
        borderRadius: '10px', // More rounded corners
        padding: '15px', // Padding inside the code block
        overflow: 'auto', // Scrollbar for overflow
        color: '#abb2bf', // Lighter grey text color
        fontFamily: 'Consolas, monospace', // Monospace font
        fontSize: '12px', // Smaller font size
        lineHeight: '1.4', // Slightly increased line height for readability
        textShadow: 'none', // Remove text shadow
    };
    





    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const fetchData = async () => {
        setLoading(true);


      
        try {
            const response = await fetch(`${apiUrlA}/askai`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input }),
            });

            if (!res.ok) {
               // throw new Error('Network response was not ok');
                throw new Error(`api error! status: ${res.status}`);
            }

            const data = await res.json();

            setResponse(data);
            localStorage.setItem('response', data); // Save response to localStorage prevent data delte from page reresh

            //----------------------------------------------- for editer.js only 
           
  


           console.log('Full API Response:', data); 
         // dispatch(loadData(data));
     
            



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
            else if (line.includes('**')) {
                const parts = line.split(/\*\*(.*?)\*\*/g);
                result.push(
                    <p key={index}>
                        {parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
                    </p>
                );
                // result.push(<br key={index + lines.length} />); // Add empty row after paragraph
            } else if (line.includes('*') && line.includes('*')) {
                const parts = line.split(/\*(.*?)\*/g);
                result.push(
                    <p key={index}>
                        {parts.map((part, i) => (i % 2 === 1 ? <em key={i}>{part}</em> : part))}
                    </p>
                );
                // result.push(<br key={index + lines.length} />); // Add empty row after paragraph
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
                             customStyle={codeBlockStyle} // Apply inline styles
                            style={atomDark}
                          
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
                // result.push(<br key={index + lines.length} />); // Add empty row after blockquote
            } else {
                result.push(<p key={index}>{line}</p>);
                result.push(<br key={index + lines.length} />); // Add empty row after paragraph
            }
        });
      
        return result;

     
     
       
    };




    


    
 // Save response to localStorage every time it changes
 useEffect(() => {
    if (response && response.trim() !== '') {
        localStorage.setItem('response', response);
    }
    dispatch(loadData(response));
}, [response]);




    return (

       
        <div className="flex flex-col flex-1 bg-gray-100 p-4 rounded-lg lg:h-auto sm:w-auto ">

{/* <Text_Component/> */}
        
            <div className='flex items-center bg-gray-100  rounded-md p-5'>
                {/* <input
                
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your question here."
                    className='flex-1 p-2 border  bg-gray-200 rounded-xl font-normal from-neutral-700'
                    

                /> */}


<textarea
    value={input}
    onChange={handleInputChange}
    placeholder="Type your question here."
    className='flex-1 p-2 bg-gray-200 rounded-xl font-normal from-neutral-700 border-none resize-none outline-none'
    rows={1}
    style={{ minHeight: '40px', overflow: 'hidden' }}
    onInput={(e) => {
      e.target.style.height = 'auto';  // Reset the height
      e.target.style.height = `${e.target.scrollHeight}px`;  // Set new height based on scroll height
    }}
  />















                <button  color="light" 
                
                    onClick={fetchData} 
                    disabled={loading}
                    className=" text-neutral-600 ml-2 rounded-xl p-2 bg-gray-200 hover:text-neutral-900 text-base" pill
                >
                    {/* {loading ? <Spinner aria-label="Medium sized spinner example" size="md" /> : 'Get Response'} */}
                    {loading ? <span className="loading loading-dots loading-lg bg-slate-950"></span>: 'Get Response'}

                    
                    
                </button >

                {/* <  MainComponent/> */}

            </div>
            <div className='mt-4 flex flex-col font-normal text-neutral-800 '>
                {parseResponse(response)}
          
            </div>
        

        </div>



    );
};


export default ChatComponent;
