// import React, { useState, useEffect } from 'react';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import { Button, Spinner, Clipboard, Textarea } from 'flowbite-react';
// import { useDispatch } from 'react-redux';
// import { loadData } from '../../app/user/userDataSlice';
// import axios from 'axios';
// const apiUrlA = import.meta.env.VITE_API_BASE_URL;

// import { parseResponse } from '../../util/parseresponse';

// const ChatComponent = () => {
//     const [input, setInput] = useState('');
//     const [response, setResponse] = useState(localStorage.getItem('response') || '');
//     const [loading, setLoading] = useState(false);
//     const [combineString, setCombineString] = useState('');

//     const dispatch = useDispatch();

//     const codeBlockStyle = {
//         backgroundColor: '#282c34',
//         borderRadius: '10px',
//         padding: '15px',
//         overflow: 'auto',
//         color: '#abb2bf',
//         fontFamily: 'Consolas, monospace',
//         fontSize: '12px',
//         lineHeight: '1.4',
//         textShadow: 'none',
//     };

//     const handleInputChange = (e) => {
//         setInput(e.target.value);
//     };

//     const fetchData = async () => {
//         setLoading(true);

//         try {
//             // const response = await axios.post(`${apiUrlA}/askai`, { input }, {
//             //     headers: { 'Content-Type': 'application/json' },
//             // });

//             const response = await axios.post(
//                 `${apiUrlA}/askai`, 
//                 { input: input?.trim() ? input : "hi" }, 
//                 {
//                     headers: { 'Content-Type': 'application/json' },
//                 }
//             );

//             setResponse(response.data);
//             localStorage.setItem('response', response.data); // Save response to localStorage to prevent data deletion from page refresh
//         } catch (error) {
//             console.error('Error fetching data:', error);
//             setResponse('Error fetching data. Please try again.');
//         } finally {
//             setLoading(false);
//             setInput('');
//         }
//     };

//     // Save response to localStorage every time it changes
//     useEffect(() => {
//         if (response && response.trim() !== '') {
//             localStorage.setItem('response', response);
//         }
//         dispatch(loadData(response));
//     }, [response]);

//     return (
//         <div className="flex flex-col flex-1 bg-white p-4 rounded-lg lg:h-screen sm:h-auto sm:w-auto overflow-x-auto overflow-y-auto ml-10 mr-10">
//             <div className='flex items-center rounded-md p-5'>
//                 <textarea
//                     value={input}
//                     onChange={handleInputChange}
//                     placeholder="Type your question here."
//                     className='flex-1 p-2 bg-gray-200 rounded-xl font-normal from-neutral-700 border-none resize-none outline-none'
//                     rows={1}
//                     style={{ minHeight: '40px', overflow: 'hidden' }}
//                     onInput={(e) => {
//                         e.target.style.height = 'auto';  // Reset the height
//                         e.target.style.height = `${e.target.scrollHeight}px`;  // Set new height based on scroll height
//                     }}
//                 />
//                 <button
//                     color="light"
//                     onClick={fetchData}
//                     disabled={loading}
//                     className="text-neutral-600 ml-2 rounded-xl p-2 bg-gray-200 hover:text-neutral-900 text-base"
//                     pill
//                 >
//                     {loading ? <span className="loading loading-dots loading-lg bg-slate-950"></span> : 'Get Response'}
//                 </button>
//             </div>

//             <div className='mt-4 mb-4 p-4 flex flex-col font-light text-neutral-900 mr-5 ml-5 rounded-xl'>
//                 {parseResponse(response)}
//             </div>
//         </div>
//     );
// };

// export default ChatComponent;

//----------------------------------------- Gemini API--------------------------------------

// import React, { useState, useEffect } from 'react';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import { Button, Spinner, Clipboard, Textarea } from 'flowbite-react';
// import { useDispatch } from 'react-redux';
// import { loadData } from '../../app/user/userDataSlice';
// import axios from 'axios';
// const apiUrlA = import.meta.env.VITE_API_BASE_URL;

// import { parseResponse } from '../../util/parseresponse';

// const ChatComponent = () => {
//     const [input, setInput] = useState('');
//     const [response, setResponse] = useState(localStorage.getItem('response') || '');
//     const [loading, setLoading] = useState(false);
//     const [contentType, setContentType] = useState('blog-post'); // Default to blog post
//     const [contentLength, setContentLength] = useState(300); // Default to 300 words
//     const [toneStyle, setToneStyle] = useState('standard'); // Default to standard tone
//     const [activeTab, setActiveTab] = useState('chat'); // Default to chat tab

//     const dispatch = useDispatch();

//     const codeBlockStyle = {
//         backgroundColor: '#282c34',
//         borderRadius: '10px',
//         padding: '15px',
//         overflow: 'auto',
//         color: '#abb2bf',
//         fontFamily: 'Consolas, monospace',
//         fontSize: '12px',
//         lineHeight: '1.4',
//         textShadow: 'none',
//     };

//     const contentTypes = [
//         { id: 'blog-post', label: 'Blog Post' },
//         { id: 'essay', label: 'Essay' },
//         { id: 'legal-document', label: 'Legal Document' },
//         { id: 'story', label: 'Story' }
//     ];
    
//     const contentLengths = [
//         { id: 100, label: '100 words' },
//         { id: 200, label: '200 words' },
//         { id: 300, label: '300 words' },
//         { id: 500, label: '500 words' },
//         { id: 700, label: '700 words' },
//         { id: 900, label: '900 words' }
//     ];
    
//     const toneStyles = [
//         { id: 'standard', label: 'Standard' },
//         { id: 'active', label: 'Active' },
//         { id: 'storytelling', label: 'Storytelling' },
//         { id: 'professional', label: 'Professional' }
//     ];

//     const handleInputChange = (e) => {
//         setInput(e.target.value);
//     };

//     const handleContentTypeChange = (e) => {
//         setContentType(e.target.value);
//     };
    
//     const handleContentLengthChange = (e) => {
//         setContentLength(Number(e.target.value));
//     };
    
//     const handleToneStyleChange = (e) => {
//         setToneStyle(e.target.value);
//     };

//     const handleTabChange = (tab) => {
//         setActiveTab(tab);
//         // Reset response when switching tabs
//         if (tab !== activeTab) {
//             setResponse('');
//             localStorage.removeItem('response');
//         }
//     };

//     const fetchData = async () => {
//         setLoading(true);

//         try {
//             // Send different requests based on active tab
//             if (activeTab === 'chat') {
//                 const response = await axios.post(
//                     `${apiUrlA}/askai`, 
//                     { input: input?.trim() ? input : "hi" }, 
//                     {
//                         headers: { 'Content-Type': 'application/json' },
//                     }
//                 );
                
//                 setResponse(response.data);
//                 localStorage.setItem('response', response.data);
//             } else {
//                 // For content generation tab, send to rewrite endpoint with action parameter
//                 const contentPrompt = prepareContentPrompt(input, contentType, contentLength, toneStyle);
                
//                 const response = await axios.post(
//                     `${apiUrlA}/rewrite`, 
//                     { 
//                         input: contentPrompt,
//                         action: "Write a humanized, undetectable by AI" 
//                     }, 
//                     {
//                         headers: { 'Content-Type': 'application/json' },
//                     }
//                 );
                
//                 setResponse(response.data.modifiedText);
//                 localStorage.setItem('response', response.data.modifiedText);
//             }
//         } catch (error) {
//             console.error('Error fetching data:', error);
//             setResponse('Error fetching data. Please try again.');
//         } finally {
//             setLoading(false);
//             setInput('');
//         }
//     };

//     // Function to prepare content prompt based on content type
//     const prepareContentPrompt = (userInput, type, length, tone) => {
//         const promptPrefix = {
//             'blog-post': 'Write a detailed, engaging blog post about',
//             'essay': 'Write a comprehensive essay on the topic of',
//             'legal-document': 'Draft a legal document regarding',
//             'story': 'Create an engaging story about'
//         };
        
//         const toneInstructions = {
//             'standard': 'Use a balanced, neutral tone with a mix of sentence structures.',
//             'active': 'Use active voice, direct statements, and energetic language. Keep it engaging and dynamic.',
//             'storytelling': 'Use narrative techniques, descriptive language, and a conversational flow. Include anecdotes where appropriate.',
//             'professional': 'Use formal language, industry-specific terminology, and structured arguments. Maintain a business-appropriate tone.'
//         };
        
//         const formattingInstructions = 'Use appropriate formatting including bold text for important points, headers for sections, and a compelling title.';
        
//         return `${promptPrefix[type] || ''} ${userInput}. The content should be approximately ${length} words long. ${toneInstructions[tone]} ${formattingInstructions} Make the writing style natural, human-like, and undetectable by AI detection tools. Vary sentence structure, include minor imperfections, and use a conversational tone.`;
//     };

//     // Save response to localStorage every time it changes
//     useEffect(() => {
//         if (response && response.trim() !== '') {
//             localStorage.setItem('response', response);
//         }
//         dispatch(loadData(response));
//     }, [response]);

//     return (
//         <div className="flex flex-col flex-1 bg-white p-4 rounded-lg lg:h-screen sm:h-auto sm:w-auto overflow-x-auto overflow-y-auto ml-10 mr-10">
//             {/* Tab Navigation */}
//             <div className="flex mb-4 border-b">
//                 <button 
//                     className={`py-2 px-4 mr-2 ${activeTab === 'chat' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
//                     onClick={() => handleTabChange('chat')}
//                 >
//                     General Chat
//                 </button>
//                 <button 
//                     className={`py-2 px-4 ${activeTab === 'content' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
//                     onClick={() => handleTabChange('content')}
//                 >
//                     Content Generation
//                 </button>
//             </div>
            
//             {/* Input Area */}
//             <div className='flex flex-col items-center rounded-md p-5'>
//                 {activeTab === 'content' && (
//                     <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
//                         <div>
//                             <label htmlFor="content-type" className="block mb-2 text-sm font-medium text-gray-700">
//                                 Content Type
//                             </label>
//                             <select
//                                 id="content-type"
//                                 value={contentType}
//                                 onChange={handleContentTypeChange}
//                                 className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                             >
//                                 {contentTypes.map((type) => (
//                                     <option key={type.id} value={type.id}>
//                                         {type.label}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
                        
//                         <div>
//                             <label htmlFor="content-length" className="block mb-2 text-sm font-medium text-gray-700">
//                                 Content Length
//                             </label>
//                             <select
//                                 id="content-length"
//                                 value={contentLength}
//                                 onChange={handleContentLengthChange}
//                                 className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                             >
//                                 {contentLengths.map((length) => (
//                                     <option key={length.id} value={length.id}>
//                                         {length.label}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
                        
//                         <div>
//                             <label htmlFor="tone-style" className="block mb-2 text-sm font-medium text-gray-700">
//                                 Tone Style
//                             </label>
//                             <select
//                                 id="tone-style"
//                                 value={toneStyle}
//                                 onChange={handleToneStyleChange}
//                                 className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                             >
//                                 {toneStyles.map((tone) => (
//                                     <option key={tone.id} value={tone.id}>
//                                         {tone.label}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>
//                 )}
                
//                 <textarea
//                     value={input}
//                     onChange={handleInputChange}
//                     placeholder={activeTab === 'chat' 
//                         ? "Type your question here." 
//                         : `Enter topic for your ${contentType.replace('-', ' ')}`}
//                     className='w-full p-2 bg-gray-200 rounded-xl font-normal from-neutral-700 border-none resize-none outline-none'
//                     rows={1}
//                     style={{ minHeight: '40px', overflow: 'hidden' }}
//                     onInput={(e) => {
//                         e.target.style.height = 'auto';  // Reset the height
//                         e.target.style.height = `${e.target.scrollHeight}px`;  // Set new height based on scroll height
//                     }}
//                 />
                
//                 <button
//                     onClick={fetchData}
//                     disabled={loading}
//                     className="text-neutral-600 mt-3 w-full rounded-xl p-2 bg-gray-200 hover:text-neutral-900 hover:bg-gray-300 text-base transition-colors"
//                 >
//                     {loading ? 
//                         <span className="loading loading-dots loading-lg bg-slate-950"></span> : 
//                         activeTab === 'chat' ? 'Get Response' : 
//                         `Generate ${contentType.replace('-', ' ')} (${contentLength} words, ${toneStyle} tone)`
//                     }
//                 </button>
//             </div>

//             {/* Response Area */}
//             <div className='mt-4 mb-4 p-4 flex flex-col font-light text-neutral-900 mr-5 ml-5 rounded-xl'>
//                 {parseResponse(response)}
//             </div>
//         </div>
//     );
// };

// export default ChatComponent;

//-----------------------------------------------------------------------------------------------------------------



import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button, Spinner, Clipboard, Textarea } from 'flowbite-react';
import { useDispatch } from 'react-redux';
import { loadData } from '../../app/user/userDataSlice';
import axios from 'axios';
const apiUrlA = import.meta.env.VITE_API_BASE_URL;

import { parseResponse } from '../../util/parseresponse';

const ChatComponent = () => {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState(localStorage.getItem('response') || '');
    const [loading, setLoading] = useState(false);
    const [contentType, setContentType] = useState('blog-post'); // Default to blog post
    const [contentLength, setContentLength] = useState(300); // Default to 300 words
    const [toneStyle, setToneStyle] = useState('standard'); // Default to standard tone
    const [activeTab, setActiveTab] = useState('chat'); // Default to chat tab
    const [primaryKeyword, setPrimaryKeyword] = useState(''); // Added primary keyword
    const [secondaryKeyword, setSecondaryKeyword] = useState(''); // Added secondary keyword

    const dispatch = useDispatch();

    const codeBlockStyle = {
        backgroundColor: '#282c34',
        borderRadius: '10px',
        padding: '15px',
        overflow: 'auto',
        color: '#abb2bf',
        fontFamily: 'Consolas, monospace',
        fontSize: '12px',
        lineHeight: '1.4',
        textShadow: 'none',
    };

    const contentTypes = [
        { id: 'blog-post', label: 'Blog Post' },
        { id: 'essay', label: 'Essay' },
        { id: 'legal-document', label: 'Legal Document' },
        { id: 'story', label: 'Story' }
    ];
    
    const contentLengths = [
        { id: 100, label: '100 words' },
        { id: 200, label: '200 words' },
        { id: 300, label: '300 words' },
        { id: 500, label: '500 words' },
        { id: 700, label: '700 words' },
        { id: 900, label: '900 words' }
    ];
    
    const toneStyles = [
        { id: 'standard', label: 'Standard' },
        { id: 'active', label: 'Active' },
        { id: 'storytelling', label: 'Storytelling' },
        { id: 'professional', label: 'Professional' }
    ];

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleContentTypeChange = (e) => {
        setContentType(e.target.value);
    };
    
    const handleContentLengthChange = (e) => {
        setContentLength(Number(e.target.value));
    };
    
    const handleToneStyleChange = (e) => {
        setToneStyle(e.target.value);
    };

    const handlePrimaryKeywordChange = (e) => {
        setPrimaryKeyword(e.target.value);
    };

    const handleSecondaryKeywordChange = (e) => {
        setSecondaryKeyword(e.target.value);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        // Reset response when switching tabs
        if (tab !== activeTab) {
            setResponse('');
            localStorage.removeItem('response');
        }
    };

    const fetchData = async () => {
        setLoading(true);

        try {
            // Send different requests based on active tab
            if (activeTab === 'chat') {
                const response = await axios.post(
                    `${apiUrlA}/askai`, 
                    { input: input?.trim() ? input : "hi" }, 
                    {
                        headers: { 'Content-Type': 'application/json' },
                    }
                );
                
                setResponse(response.data);
                localStorage.setItem('response', response.data);
            } else {
                // For content generation tab, send to rewrite endpoint with action parameter
                const contentPrompt = prepareContentPrompt(input, contentType, contentLength, toneStyle, primaryKeyword, secondaryKeyword);
                
                const response = await axios.post(
                    `${apiUrlA}/rewrite`, 
                    { 
                        input: contentPrompt,
                        action: "Write a humanized, undetectable by AI" 
                    }, 
                    {
                        headers: { 'Content-Type': 'application/json' },
                    }
                );
                
                setResponse(response.data.modifiedText);
                localStorage.setItem('response', response.data.modifiedText);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setResponse('Error fetching data. Please try again.');
        } finally {
            setLoading(false);
            setInput('');
        }
    };

    // Function to prepare content prompt based on content type and keywords
    const prepareContentPrompt = (userInput, type, length, tone, primaryKw, secondaryKw) => {
        const promptPrefix = {
            'blog-post': 'Write a detailed, engaging blog post about',
            'essay': 'Write a comprehensive essay on the topic of',
            'legal-document': 'Draft a legal document regarding',
            'story': 'Create an engaging story about'
        };
        
        const toneInstructions = {
            'standard': 'Use a balanced, neutral tone with a mix of sentence structures.',
            'active': 'Use active voice, direct statements, and energetic language. Keep it engaging and dynamic.',
            'storytelling': 'Use narrative techniques, descriptive language, and a conversational flow. Include anecdotes where appropriate.',
            'professional': 'Use formal language, industry-specific terminology, and structured arguments. Maintain a business-appropriate tone.'
        };
        
        const formattingInstructions = 'Use appropriate formatting including bold text for important points, headers for sections, and a compelling title.';
        
        let keywordInstructions = '';
        if (type === 'blog-post' && (primaryKw.trim() || secondaryKw.trim())) {
            keywordInstructions = `Use "${primaryKw.trim()}" as the primary keyword and "${secondaryKw.trim()}" as the secondary keyword. Incorporate these keywords naturally throughout the content in a way that feels organic and not forced. The primary keyword should appear in the title and first paragraph.`;
        }
        
        const humanizationInstructions = `Make the writing style natural, human-generated, and 100% unique - not AI-generated. Include occasional pauses, personal anecdotes, or reflective thoughts as if a human is writing based on personal experience. Use varied sentence structures with occasional imperfections, conversational phrases, and a natural flow that resembles human writing patterns.`;
        
        return `${promptPrefix[type] || ''} ${userInput}. The content should be approximately ${length} words long. ${toneInstructions[tone]} ${formattingInstructions} ${keywordInstructions} ${humanizationInstructions}`;
    };

    // Save response to localStorage every time it changes
    useEffect(() => {
        if (response && response.trim() !== '') {
            localStorage.setItem('response', response);
        }
        dispatch(loadData(response));
    }, [response]);

    return (
        <div className="flex flex-col flex-1 bg-white p-4 rounded-lg lg:h-screen sm:h-auto sm:w-auto overflow-x-auto overflow-y-auto ml-10 mr-10">
            {/* Tab Navigation */}
            <div className="flex mb-4 border-b">
                <button 
                    className={`py-2 px-4 mr-2 ${activeTab === 'chat' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                    onClick={() => handleTabChange('chat')}
                >
                    General Chat
                </button>
                <button 
                    className={`py-2 px-4 ${activeTab === 'content' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                    onClick={() => handleTabChange('content')}
                >
                    Content Generation
                </button>
            </div>
            
            {/* Input Area */}
            <div className='flex flex-col items-center rounded-md p-5'>
                {activeTab === 'content' && (
                    <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <label htmlFor="content-type" className="block mb-2 text-sm font-medium text-gray-700">
                                Content Type
                            </label>
                            <select
                                id="content-type"
                                value={contentType}
                                onChange={handleContentTypeChange}
                                className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            >
                                {contentTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label htmlFor="content-length" className="block mb-2 text-sm font-medium text-gray-700">
                                Content Length
                            </label>
                            <select
                                id="content-length"
                                value={contentLength}
                                onChange={handleContentLengthChange}
                                className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            >
                                {contentLengths.map((length) => (
                                    <option key={length.id} value={length.id}>
                                        {length.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label htmlFor="tone-style" className="block mb-2 text-sm font-medium text-gray-700">
                                Tone Style
                            </label>
                            <select
                                id="tone-style"
                                value={toneStyle}
                                onChange={handleToneStyleChange}
                                className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            >
                                {toneStyles.map((tone) => (
                                    <option key={tone.id} value={tone.id}>
                                        {tone.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {contentType === 'blog-post' && (
                            <>
                                <div>
                                    <label htmlFor="primary-keyword" className="block mb-2 text-sm font-medium text-gray-700">
                                        Primary Keyword
                                    </label>
                                    <input
                                        type="text"
                                        id="primary-keyword"
                                        value={primaryKeyword}
                                        onChange={handlePrimaryKeywordChange}
                                        placeholder="Enter primary keyword"
                                        className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="secondary-keyword" className="block mb-2 text-sm font-medium text-gray-700">
                                        Secondary Keyword
                                    </label>
                                    <input
                                        type="text"
                                        id="secondary-keyword"
                                        value={secondaryKeyword}
                                        onChange={handleSecondaryKeywordChange}
                                        placeholder="Enter secondary keyword"
                                        className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                )}
                
                <textarea
                    value={input}
                    onChange={handleInputChange}
                    placeholder={activeTab === 'chat' 
                        ? "Type your question here." 
                        : `Enter topic for your ${contentType.replace('-', ' ')}`}
                    className='w-full p-2 bg-gray-200 rounded-xl font-normal from-neutral-700 border-none resize-none outline-none'
                    rows={1}
                    style={{ minHeight: '40px', overflow: 'hidden' }}
                    onInput={(e) => {
                        e.target.style.height = 'auto';  // Reset the height
                        e.target.style.height = `${e.target.scrollHeight}px`;  // Set new height based on scroll height
                    }}
                />
                
                <button
                    onClick={fetchData}
                    disabled={loading}
                    className="text-neutral-600 mt-3 w-full rounded-xl p-2 bg-gray-200 hover:text-neutral-900 hover:bg-gray-300 text-base transition-colors"
                >
                    {loading ? 
                        <span className="loading loading-dots loading-lg bg-slate-950"></span> : 
                        activeTab === 'chat' ? 'Get Response' : 
                        `Generate ${contentType.replace('-', ' ')} (${contentLength} words, ${toneStyle} tone)`
                    }
                </button>
            </div>

            {/* Response Area */}
            <div className='mt-4 mb-4 p-4 flex flex-col font-light text-neutral-900 mr-5 ml-5 rounded-xl'>
                {parseResponse(response)}
            </div>
        </div>
    );
};

export default ChatComponent;