import React, { useState , useEffect} from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button , Spinner , Clipboard,Textarea} from 'flowbite-react'; 
import { useDispatch } from 'react-redux';
 import {loadData} from '../../app/user/userDataSlice';
 const apiUrlA = import.meta.env.VITE_API_BASE_URL;

import { parseResponse } from '../../util/parseresponse';



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

            if (!response.ok) {
            
                throw new Error(`api error! status: ${response.status}`);
            }

            const data = await response.json();

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




    




    


    
 // Save response to localStorage every time it changes
 useEffect(() => {
    if (response && response.trim() !== '') {
        localStorage.setItem('response', response);
    }
    dispatch(loadData(response));
}, [response]);




    return (

       
        <div className="flex flex-col flex-1 bg-gray-50 p-4 rounded-lg lg:h-screen sm:h-auto sm:w-auto overflow-y-auto ml-1 mr-5">


        
            <div className='flex items-center bg-gray-100  rounded-md p-5'>
 


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
            <div className='mt-4 p-2 flex flex-col font-light text-neutral-800 '>
                {parseResponse(response)}
          
            </div>
        

        </div>



    );
};


export default ChatComponent;
