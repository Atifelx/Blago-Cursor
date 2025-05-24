

// //------------------------------------------------------------------------------------------

// import React, { useState, useEffect } from 'react';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import { Button, Spinner, Clipboard, Textarea } from 'flowbite-react';
// import { useDispatch } from 'react-redux';
// import { loadData } from '../../app/user/userDataSlice';
// import axios from 'axios';
// import * as mammoth from 'mammoth';
// import * as XLSX from 'xlsx';

// const apiUrlA = import.meta.env.VITE_API_BASE_URL;

// import { parseResponse } from '../../util/parseresponse';

// const ChatComponent = () => {
//     const [input, setInput] = useState('');
//     const [response, setResponse] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [contentType, setContentType] = useState('blog-post'); // Default to blog post
//     const [contentLength, setContentLength] = useState(300); // Default to 300 words
//     const [toneStyle, setToneStyle] = useState('standard'); // Default to standard tone
//     const [activeTab, setActiveTab] = useState('chat'); // Default to chat tab
//     const [primaryKeyword, setPrimaryKeyword] = useState(''); // Added primary keyword
//     const [secondaryKeyword, setSecondaryKeyword] = useState(''); // Added secondary keyword
    
//     // Document processing states
//     const [uploadedFile, setUploadedFile] = useState(null);
//     const [parsedText, setParsedText] = useState('');
//     const [processingMode, setProcessingMode] = useState('tutorial'); // Default to tutorial
//     const [documentProcessing, setDocumentProcessing] = useState(false);

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

//     // Only Blog Post for content generation
//     const contentTypes = [
//         { id: 'blog-post', label: 'Blog Post' }
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

//     // Processing modes for document processing
//     const processingModes = [
//         { id: 'tutorial', label: 'Tutorial' },
//         { id: 'self-help-guide', label: 'Self Help Guide' },
//         { id: 'summary', label: 'Summary' },
//         { id: 'article', label: 'Article' }
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

//     const handlePrimaryKeywordChange = (e) => {
//         setPrimaryKeyword(e.target.value);
//     };

//     const handleSecondaryKeywordChange = (e) => {
//         setSecondaryKeyword(e.target.value);
//     };

//     const handleProcessingModeChange = (e) => {
//         setProcessingMode(e.target.value);
//     };

//     const handleTabChange = (tab) => {
//         setActiveTab(tab);
//         // Reset response when switching tabs
//         if (tab !== activeTab) {
//             setResponse('');
//             // Reset document-specific states when switching away from document tab
//             if (activeTab === 'document') {
//                 setUploadedFile(null);
//                 setParsedText('');
//             }
//         }
//     };

//     // Client-side file parsing functions
//     const parseTextFile = (file) => {
//         return new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onload = (e) => resolve(e.target.result);
//             reader.onerror = reject;
//             reader.readAsText(file);
//         });
//     };

//     const parseWordFile = (file) => {
//         return new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onload = async (e) => {
//                 try {
//                     const arrayBuffer = e.target.result;
//                     const result = await mammoth.extractRawText({ arrayBuffer });
//                     resolve(result.value);
//                 } catch (error) {
//                     reject(error);
//                 }
//             };
//             reader.onerror = reject;
//             reader.readAsArrayBuffer(file);
//         });
//     };

//     const parsePDFFile = (file) => {
//         return new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onload = async (e) => {
//                 try {
//                     // For PDF parsing, we'll use a simple approach
//                     // Note: This is a basic implementation. For better PDF parsing,
//                     // you might want to use pdf-parse or similar libraries
//                     const text = await extractTextFromPDF(e.target.result);
//                     resolve(text);
//                 } catch (error) {
//                     reject(error);
//                 }
//             };
//             reader.onerror = reject;
//             reader.readAsArrayBuffer(file);
//         });
//     };

//     // Basic PDF text extraction (simplified)
//     const extractTextFromPDF = async (arrayBuffer) => {
//         // This is a simplified PDF parser
//         // In a real implementation, you might want to use pdf-lib or pdf2pic
//         const uint8Array = new Uint8Array(arrayBuffer);
//         const text = String.fromCharCode.apply(null, uint8Array);
        
//         // Very basic text extraction - look for readable text patterns
//         const textRegex = /\[(.*?)\]/g;
//         const matches = text.match(textRegex);
        
//         if (matches && matches.length > 0) {
//             return matches.join(' ').replace(/[\[\]]/g, '');
//         }
        
//         // Fallback: try to extract any readable text
//         const readableText = text.replace(/[^\x20-\x7E\n\r\t]/g, '').trim();
//         return readableText || 'Unable to extract text from PDF. Please try a different file format.';
//     };

//     const parseExcelFile = (file) => {
//         return new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 try {
//                     const data = new Uint8Array(e.target.result);
//                     const workbook = XLSX.read(data, { type: 'array' });
//                     let allText = '';
                    
//                     workbook.SheetNames.forEach(sheetName => {
//                         const worksheet = workbook.Sheets[sheetName];
//                         const sheetText = XLSX.utils.sheet_to_txt(worksheet);
//                         allText += `Sheet: ${sheetName}\n${sheetText}\n\n`;
//                     });
                    
//                     resolve(allText);
//                 } catch (error) {
//                     reject(error);
//                 }
//             };
//             reader.onerror = reject;
//             reader.readAsArrayBuffer(file);
//         });
//     };

//     // File upload handler with client-side parsing
//     const handleFileUpload = async (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         setUploadedFile(file);
//         setDocumentProcessing(true);
//         setParsedText('');
        
//         try {
//             let extractedText = '';
//             const fileExtension = file.name.split('.').pop().toLowerCase();
            
//             switch (fileExtension) {
//                 case 'txt':
//                 case 'rtf':
//                     extractedText = await parseTextFile(file);
//                     break;
//                 case 'doc':
//                 case 'docx':
//                     extractedText = await parseWordFile(file);
//                     break;
//                 case 'pdf':
//                     extractedText = await parsePDFFile(file);
//                     break;
//                 case 'xls':
//                 case 'xlsx':
//                 case 'csv':
//                     extractedText = await parseExcelFile(file);
//                     break;
//                 default:
//                     throw new Error('Unsupported file format');
//             }
            
//             if (extractedText.trim()) {
//                 setParsedText(extractedText);
//             } else {
//                 setParsedText('No text content found in the file.');
//             }
//         } catch (error) {
//             console.error('Error parsing document:', error);
//             setParsedText(`Error parsing document: ${error.message}. Please try a different file or format.`);
//         } finally {
//             setDocumentProcessing(false);
//         }
//     };

//     const fetchData = async () => {
//         setLoading(true);

//         try {
//             if (activeTab === 'chat') {
//                 const response = await axios.post(
//                     `${apiUrlA}/askai`, 
//                     { input: input?.trim() ? input : "hi" }, 
//                     {
//                         headers: { 'Content-Type': 'application/json' },
//                     }
//                 );
                
//                 setResponse(response.data);
//             } else if (activeTab === 'content') {
//                 // For content generation tab
//                 const contentPrompt = prepareContentPrompt(input, contentType, contentLength, toneStyle, primaryKeyword, secondaryKeyword);
                
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
//             } else if (activeTab === 'document') {
//                 // For document processing tab
//                 if (!parsedText.trim()) {
//                     setResponse('Please upload a document first.');
//                     setLoading(false);
//                     return;
//                 }

//                 const documentPrompt = prepareDocumentPrompt(parsedText, processingMode, input);
                
//                 const response = await axios.post(
//                     `${apiUrlA}/rewrite`, 
//                     { 
//                         input: documentPrompt,
//                         action: "Write a humanized, 100% unique content that is undetectable by AI" 
//                     }, 
//                     {
//                         headers: { 'Content-Type': 'application/json' },
//                     }
//                 );
                
//                 setResponse(response.data.modifiedText);
//             }
//         } catch (error) {
//             console.error('Error fetching data:', error);
//             setResponse('Error fetching data. Please try again.');
//         } finally {
//             setLoading(false);
//             setInput('');
//         }
//     };

//     // Function to prepare content prompt for blog posts
//     const prepareContentPrompt = (userInput, type, length, tone, primaryKw, secondaryKw) => {
//         const promptPrefix = {
//             'blog-post': 'Craft a detailed and engaging blog post in a relaxed, conversational style—as if you are sharing your thoughts with a curious friend. Let the writing flow naturally with a mix of sentence lengths, a few casual phrases, and occasional imperfections. Include personal reflections, hypothetical situations, or relatable commentary to give the post a human touch. Avoid overly formal language or robotic structure. The final result should feel original, sincere, and indistinguishable from something written entirely by a human.'
//         };
        
//         const toneInstructions = {
//             'standard': 'Use a balanced, neutral tone with a mix of sentence structures.',
//             'active': 'Use active voice, direct statements, and energetic language. Keep it engaging and dynamic.',
//             'storytelling': 'Use narrative techniques, descriptive language, and a conversational flow. Include anecdotes where appropriate.',
//             'professional': 'Use formal language, industry-specific terminology, and structured arguments. Maintain a business-appropriate tone.'
//         };
        
//         const formattingInstructions = 'Use appropriate formatting including bold text for important points, headers for sections, and a compelling title.';
        
//         let keywordInstructions = '';
//         if (primaryKw.trim() || secondaryKw.trim()) {
//             keywordInstructions = `Use "${primaryKw.trim()}" as the primary keyword and "${secondaryKw.trim()}" as the secondary keyword. Incorporate these keywords naturally throughout the content in a way that feels organic and not forced. The primary keyword should appear in the title and first paragraph.`;
//         }
        
//         const humanizationInstructions = `Make the writing style natural, human-generated, and 100% unique - not AI-generated. Include occasional pauses, personal anecdotes, or reflective thoughts as if a human is writing based on personal experience. Use varied sentence structures with occasional imperfections, conversational phrases, and a natural flow that resembles human writing patterns.`;
        
//         return `${promptPrefix[type] || ''} ${userInput}. The content should be approximately ${length} words long. ${toneInstructions[tone]} ${formattingInstructions} ${keywordInstructions} ${humanizationInstructions}`;
//     };

//     // Function to prepare document processing prompt
//     const prepareDocumentPrompt = (parsedText, mode, additionalInstructions) => {
//         const modeInstructions = {
//             'tutorial': 'Transform this content into a comprehensive, step-by-step tutorial. Break down complex concepts into easy-to-follow steps with clear explanations, practical examples, and actionable advice. Use numbered steps, bullet points where appropriate, and include tips and best practices.',
//             'self-help-guide': 'Rewrite this content as an empowering self-help guide. Focus on actionable advice, motivational language, and practical strategies that readers can implement immediately. Include personal development insights, encouraging tone, and real-world applications.',
//             'summary': 'Create a concise but comprehensive summary that captures all the key points, main ideas, and important details. Organize the information logically and make it easy to understand and reference.',
//             'article': 'Transform this content into a well-structured, engaging article with a compelling introduction, organized body sections, and a strong conclusion. Make it informative yet accessible to a general audience.'
//         };

//         const humanizationInstructions = `Write this content to be 100% unique and humanized - completely undetectable by AI detection tools. Use natural language patterns, varied sentence structures, personal insights where appropriate, and a conversational yet informative tone. Include occasional transitional phrases and natural flow that mimics human writing style.`;

//         const additionalContext = additionalInstructions?.trim() ? `Additional requirements: ${additionalInstructions}` : '';

//         // Truncate parsed text if it's too long to avoid API limits
//         const maxLength = 8000; // Adjust based on your API limits
//         const truncatedText = parsedText.length > maxLength 
//             ? parsedText.substring(0, maxLength) + '...\n[Content truncated due to length]' 
//             : parsedText;

//         return `${modeInstructions[mode]} 

// Original content to process:
// ${truncatedText}

// ${additionalContext}

// ${humanizationInstructions}

// Please ensure the output is well-formatted with appropriate headings, subheadings, and clear organization.`;
//     };

//     // Save response to localStorage every time it changes (only for chat and content tabs)
//     useEffect(() => {
//         if (response && response.trim() !== '' && activeTab !== 'document') {
//             const storageKey = activeTab === 'chat' ? 'response' : 'content_response';
//             // Using in-memory storage since localStorage is not supported
//             // You can replace this with a state management solution if needed
//         }
//         dispatch(loadData(response));
//     }, [response, activeTab]);

//     // Load saved responses when switching tabs
//     useEffect(() => {
//         const loadSavedResponse = () => {
//             if (activeTab === 'chat') {
//                 // Load from your state management or keep empty
//                 // const saved = getStoredResponse('response') || '';
//                 // setResponse(saved);
//             } else if (activeTab === 'content') {
//                 // Load from your state management or keep empty
//                 // const saved = getStoredResponse('content_response') || '';
//                 // setResponse(saved);
//             } else if (activeTab === 'document') {
//                 setResponse('');
//             }
//         };
        
//         loadSavedResponse();
//     }, [activeTab]);

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
//                     className={`py-2 px-4 mr-2 ${activeTab === 'content' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
//                     onClick={() => handleTabChange('content')}
//                 >
//                     Content Generation
//                 </button>
//                 <button 
//                     className={`py-2 px-4 ${activeTab === 'document' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
//                     onClick={() => handleTabChange('document')}
//                 >
//                     Document Processing
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
                        
//                         <div>
//                             <label htmlFor="primary-keyword" className="block mb-2 text-sm font-medium text-gray-700">
//                                 Primary Keyword
//                             </label>
//                             <input
//                                 type="text"
//                                 id="primary-keyword"
//                                 value={primaryKeyword}
//                                 onChange={handlePrimaryKeywordChange}
//                                 placeholder="Enter primary keyword"
//                                 className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                             />
//                         </div>
                        
//                         <div>
//                             <label htmlFor="secondary-keyword" className="block mb-2 text-sm font-medium text-gray-700">
//                                 Secondary Keyword
//                             </label>
//                             <input
//                                 type="text"
//                                 id="secondary-keyword"
//                                 value={secondaryKeyword}
//                                 onChange={handleSecondaryKeywordChange}
//                                 placeholder="Enter secondary keyword"
//                                 className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                             />
//                         </div>
//                     </div>
//                 )}

//                 {activeTab === 'document' && (
//                     <div className="w-full mb-4">
//                         {/* File Upload Section */}
//                         <div className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
//                             <label htmlFor="file-upload" className="block mb-2 text-sm font-medium text-gray-700">
//                                 Upload Document (PDF, Word, Text, Excel files supported)
//                             </label>
//                             <input
//                                 type="file"
//                                 id="file-upload"
//                                 accept=".pdf,.doc,.docx,.txt,.rtf,.xls,.xlsx,.csv"
//                                 onChange={handleFileUpload}
//                                 className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                             />
//                             {uploadedFile && (
//                                 <div className="mt-2">
//                                     <p className="text-sm text-green-600">
//                                         ✓ Uploaded: {uploadedFile.name}
//                                     </p>
//                                     <p className="text-xs text-gray-500">
//                                         Size: {(uploadedFile.size / 1024).toFixed(1)} KB
//                                     </p>
//                                 </div>
//                             )}
//                             {documentProcessing && (
//                                 <div className="mt-2 flex items-center">
//                                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
//                                     <p className="text-sm text-blue-600">
//                                         Processing document...
//                                     </p>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Processing Options - Only show after successful upload */}
//                         {parsedText && (
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
//                                 <div>
//                                     <label htmlFor="processing-mode" className="block mb-2 text-sm font-medium text-gray-700">
//                                         Processing Mode
//                                     </label>
//                                     <select
//                                         id="processing-mode"
//                                         value={processingMode}
//                                         onChange={handleProcessingModeChange}
//                                         className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                                     >
//                                         {processingModes.map((mode) => (
//                                             <option key={mode.id} value={mode.id}>
//                                                 {mode.label}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
                                
//                                 <div>
//                                     <label className="block mb-2 text-sm font-medium text-gray-700">
//                                         Output Style
//                                     </label>
//                                     <div className="bg-green-100 p-2 rounded-lg text-sm text-green-700 flex items-center">
//                                         <span className="mr-2">✓</span>
//                                         100% Unique & Humanized
//                                     </div>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Preview of parsed text */}
//                         {parsedText && (
//                             <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
//                                 <h4 className="text-sm font-medium text-gray-700 mb-2">Document Preview:</h4>
//                                 <div className="text-xs text-gray-600 max-h-32 overflow-y-auto bg-white p-2 rounded border">
//                                     {parsedText.length > 500 
//                                         ? `${parsedText.substring(0, 500)}...` 
//                                         : parsedText
//                                     }
//                                 </div>
//                                 <p className="text-xs text-gray-500 mt-2">
//                                     Extracted {parsedText.length} characters from document
//                                 </p>
//                             </div>
//                         )}
//                     </div>
//                 )}
                
//                 <textarea
//                     value={input}
//                     onChange={handleInputChange}
//                     placeholder={
//                         activeTab === 'chat' 
//                             ? "Type your question here." 
//                             : activeTab === 'content'
//                             ? `Enter topic for your ${contentType.replace('-', ' ')}`
//                             : "Enter additional instructions for document processing (optional)"
//                     }
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
//                     disabled={loading || (activeTab === 'document' && !parsedText)}
//                     className="text-neutral-600 mt-3 w-full rounded-xl p-2 bg-gray-200 hover:text-neutral-900 hover:bg-gray-300 text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                     {loading ? 
//                         <span className="loading loading-dots loading-lg bg-slate-950"></span> : 
//                         activeTab === 'chat' ? 'Get Response' : 
//                         activeTab === 'content' ? `Generate ${contentType.replace('-', ' ')} (${contentLength} words, ${toneStyle} tone)` :
//                         `Process Document as ${processingMode.replace('-', ' ')}`
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

//----------------------------------------------------------------------------------------------



import React, { useState, useEffect, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button, Spinner, Clipboard, Textarea } from 'flowbite-react';
import { useDispatch } from 'react-redux';
import { loadData } from '../../app/user/userDataSlice';
import axios from 'axios';
import * as mammoth from 'mammoth';
import * as XLSX from 'xlsx';




const apiUrlA = import.meta.env.VITE_API_BASE_URL;

import { parseResponse } from '../../util/parseresponse';

// Memory Management System
class DocumentMemory {
    constructor() {
        this.documents = new Map();
        this.cache = new Map();
        this.maxCacheSize = 50; // Maximum cached documents
        this.maxDocumentSize = 10 * 1024 * 1024; // 10MB max per document
    }

    // Store document with metadata
    store(id, data, metadata = {}) {
        if (this.cache.size >= this.maxCacheSize) {
            // Remove oldest entry
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
            this.documents.delete(firstKey);
        }

        const documentData = {
            content: data,
            metadata: {
                ...metadata,
                timestamp: Date.now(),
                size: new Blob([data]).size
            }
        };

        this.documents.set(id, documentData);
        this.cache.set(id, true);
        return id;
    }

    // Retrieve document
    get(id) {
        return this.documents.get(id);
    }

    // Check if document exists
    has(id) {
        return this.documents.has(id);
    }

    // Remove document
    remove(id) {
        this.documents.delete(id);
        this.cache.delete(id);
    }

    // Clear all documents
    clear() {
        this.documents.clear();
        this.cache.clear();
    }

    // Get memory usage stats
    getStats() {
        let totalSize = 0;
        this.documents.forEach(doc => {
            totalSize += doc.metadata.size || 0;
        });

        return {
            documentsCount: this.documents.size,
            totalSize: totalSize,
            totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2)
        };
    }

    // Chunk large content for processing
    chunkContent(content, maxChunkSize = 8000) {
        if (content.length <= maxChunkSize) {
            return [content];
        }

        const chunks = [];
        let start = 0;

        while (start < content.length) {
            let end = start + maxChunkSize;
            
            // Try to break at sentence boundary
            if (end < content.length) {
                const lastPeriod = content.lastIndexOf('.', end);
                const lastNewline = content.lastIndexOf('\n', end);
                const breakPoint = Math.max(lastPeriod, lastNewline);
                
                if (breakPoint > start) {
                    end = breakPoint + 1;
                }
            }

            chunks.push(content.slice(start, end));
            start = end;
        }

        return chunks;
    }
}

const ChatComponent = () => {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [contentType, setContentType] = useState('blog-post');
    const [contentLength, setContentLength] = useState(300);
    const [toneStyle, setToneStyle] = useState('standard');
    const [activeTab, setActiveTab] = useState('chat');
    const [primaryKeyword, setPrimaryKeyword] = useState('');
    const [secondaryKeyword, setSecondaryKeyword] = useState('');
    
    // Document processing states with memory
    const [uploadedFile, setUploadedFile] = useState(null);
    const [parsedText, setParsedText] = useState('');
    const [processingMode, setProcessingMode] = useState('tutorial');
    const [documentProcessing, setDocumentProcessing] = useState(false);
    const [documentId, setDocumentId] = useState(null);
    const [documentStats, setDocumentStats] = useState(null);
    const [processingProgress, setProcessingProgress] = useState(0);

    // Memory system reference
    const documentMemory = useRef(new DocumentMemory());
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
        { id: 'blog-post', label: 'Blog Post' }
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

    const processingModes = [
        { id: 'tutorial', label: 'Tutorial' },
        { id: 'self-help-guide', label: 'Self Help Guide' },
        { id: 'summary', label: 'Summary' },
        { id: 'article', label: 'Article' }
    ];

    // Enhanced PDF text extraction using better parsing
    const extractTextFromPDF = (arrayBuffer) => {
        return new Promise((resolve, reject) => {
            try {
                const uint8Array = new Uint8Array(arrayBuffer);
                let text = '';
                
                // Convert to string for pattern matching
                const pdfString = String.fromCharCode.apply(null, uint8Array);
                
                // Multiple PDF text extraction strategies
                const strategies = [
                    // Strategy 1: Look for stream objects with text
                    () => {
                        const streamRegex = /stream\s*(.*?)\s*endstream/gs;
                        const matches = pdfString.match(streamRegex);
                        if (matches) {
                            return matches.map(match => {
                                const content = match.replace(/^stream\s*/, '').replace(/\s*endstream$/, '');
                                // Decode simple text content
                                return content.replace(/[^\x20-\x7E\n\r\t]/g, ' ').trim();
                            }).filter(content => content.length > 10).join('\n');
                        }
                        return '';
                    },
                    
                    // Strategy 2: Look for text objects
                    () => {
                        const textRegex = /BT\s*(.*?)\s*ET/gs;
                        const matches = pdfString.match(textRegex);
                        if (matches) {
                            return matches.map(match => {
                                // Extract text from BT...ET blocks
                                const tjRegex = /\[(.*?)\]\s*TJ/g;
                                const tjMatches = match.match(tjRegex);
                                if (tjMatches) {
                                    return tjMatches.map(tj => {
                                        const textContent = tj.match(/\[(.*?)\]/);
                                        return textContent ? textContent[1].replace(/[()]/g, '') : '';
                                    }).join(' ');
                                }
                                return '';
                            }).filter(content => content.length > 0).join('\n');
                        }
                        return '';
                    },
                    
                    // Strategy 3: Simple parentheses content extraction
                    () => {
                        const parenRegex = /\(([^)]+)\)/g;
                        const matches = pdfString.match(parenRegex);
                        if (matches) {
                            return matches.map(match => match.slice(1, -1)).join(' ');
                        }
                        return '';
                    },
                    
                    // Strategy 4: Look for readable ASCII text sequences
                    () => {
                        const readableRegex = /[a-zA-Z0-9\s.,!?;:'"()-]{10,}/g;
                        const matches = pdfString.match(readableRegex);
                        if (matches) {
                            return matches.filter(match => 
                                match.trim().length > 10 && 
                                /[a-zA-Z]/.test(match)
                            ).join(' ');
                        }
                        return '';
                    }
                ];

                // Try each strategy
                for (const strategy of strategies) {
                    const result = strategy();
                    if (result && result.trim().length > 50) {
                        text = result;
                        break;
                    }
                }

                // If no strategy worked, try a general approach
                if (!text || text.trim().length < 50) {
                    // Extract any readable text sequences
                    const allText = pdfString.replace(/[^\x20-\x7E\n\r\t]/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim();
                    
                    if (allText.length > 100) {
                        text = allText;
                    }
                }

                if (text.trim().length === 0) {
                    resolve('Unable to extract text from this PDF. The file might be image-based or encrypted. Please try converting it to text format first or use a different file.');
                } else {
                    // Clean up the extracted text
                    const cleanedText = text
                        .replace(/\s+/g, ' ')
                        .replace(/(.)\1{3,}/g, '$1')
                        .trim();
                    resolve(cleanedText);
                }
            } catch (error) {
                reject(new Error(`PDF parsing failed: ${error.message}`));
            }
        });
    };

    // Enhanced file parsing functions
    const parseTextFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file, 'utf-8');
        });
    };

    const parseWordFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const arrayBuffer = e.target.result;
                    const result = await mammoth.extractRawText({ arrayBuffer });
                    resolve(result.value || 'No text content found in Word document.');
                } catch (error) {
                    reject(new Error(`Word document parsing failed: ${error.message}`));
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    };

    const parseExcelFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    let allText = '';
                    
                    workbook.SheetNames.forEach(sheetName => {
                        const worksheet = workbook.Sheets[sheetName];
                        const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                        
                        allText += `\n=== Sheet: ${sheetName} ===\n`;
                        sheetData.forEach((row, index) => {
                            if (row.length > 0) {
                                allText += `Row ${index + 1}: ${row.join(' | ')}\n`;
                            }
                        });
                    });
                    
                    resolve(allText.trim() || 'No data found in Excel file.');
                } catch (error) {
                    reject(new Error(`Excel parsing failed: ${error.message}`));
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    };

    const parseCSVFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const csvData = e.target.result;
                    const lines = csvData.split('\n');
                    let formattedText = '=== CSV Data ===\n';
                    
                    lines.forEach((line, index) => {
                        if (line.trim()) {
                            formattedText += `Row ${index + 1}: ${line.split(',').join(' | ')}\n`;
                        }
                    });
                    
                    resolve(formattedText.trim() || 'No data found in CSV file.');
                } catch (error) {
                    reject(new Error(`CSV parsing failed: ${error.message}`));
                }
            };
            reader.onerror = reject;
            reader.readAsText(file, 'utf-8');
        });
    };

    // Main file upload handler with memory management
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file size
        if (file.size > documentMemory.current.maxDocumentSize) {
            alert(`File too large. Maximum size is ${documentMemory.current.maxDocumentSize / (1024 * 1024)}MB`);
            return;
        }

        setUploadedFile(file);
        setDocumentProcessing(true);
        setParsedText('');
        setProcessingProgress(0);
        
        try {
            let extractedText = '';
            const fileExtension = file.name.split('.').pop().toLowerCase();
            const fileId = `${file.name}-${Date.now()}`;
            
            // Update progress
            setProcessingProgress(25);
            
            switch (fileExtension) {
                case 'txt':
                case 'rtf':
                    extractedText = await parseTextFile(file);
                    break;
                case 'doc':
                case 'docx':
                    extractedText = await parseWordFile(file);
                    break;
                case 'pdf':
                    const arrayBuffer = await file.arrayBuffer();
                    extractedText = await extractTextFromPDF(arrayBuffer);
                    break;
                case 'xls':
                case 'xlsx':
                    extractedText = await parseExcelFile(file);
                    break;
                case 'csv':
                    extractedText = await parseCSVFile(file);
                    break;
                default:
                    throw new Error(`Unsupported file format: ${fileExtension}`);
            }
            
            setProcessingProgress(75);
            
            if (extractedText.trim()) {
                // Store in memory
                const storedId = documentMemory.current.store(fileId, extractedText, {
                    fileName: file.name,
                    fileType: fileExtension,
                    fileSize: file.size,
                    uploadTime: new Date().toISOString()
                });
                
                setDocumentId(storedId);
                setParsedText(extractedText);
                setDocumentStats(documentMemory.current.getStats());
                setProcessingProgress(100);
            } else {
                throw new Error('No text content found in the file.');
            }
        } catch (error) {
            console.error('Error parsing document:', error);
            setParsedText(`Error parsing document: ${error.message}`);
            setDocumentId(null);
        } finally {
            setDocumentProcessing(false);
            setTimeout(() => setProcessingProgress(0), 2000);
        }
    };

    // Event handlers
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

    const handleProcessingModeChange = (e) => {
        setProcessingMode(e.target.value);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab !== activeTab) {
            setResponse('');
            if (activeTab === 'document') {
                // Don't reset document data when switching away
                // Keep the parsed document in memory
            }
        }
    };

    // Clear document memory
    const clearDocumentMemory = () => {
        documentMemory.current.clear();
        setUploadedFile(null);
        setParsedText('');
        setDocumentId(null);
        setDocumentStats(null);
        setResponse('');
    };

    // Main API call function
    const fetchData = async () => {
        setLoading(true);

        try {
            if (activeTab === 'chat') {
                const response = await axios.post(
                    `${apiUrlA}/askai`, 
                    { input: input?.trim() ? input : "hi" }, 
                    {
                        headers: { 'Content-Type': 'application/json' },
                    }
                );
                
                setResponse(response.data);
            } else if (activeTab === 'content') {
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
            } else if (activeTab === 'document') {
                if (!documentId || !documentMemory.current.has(documentId)) {
                    setResponse('Please upload a document first.');
                    setLoading(false);
                    return;
                }

                const documentData = documentMemory.current.get(documentId);
                const chunks = documentMemory.current.chunkContent(documentData.content);
                
                if (chunks.length === 1) {
                    // Single chunk processing
                    const documentPrompt = prepareDocumentPrompt(chunks[0], processingMode, input);
                    
                    const response = await axios.post(
                        `${apiUrlA}/rewrite`, 
                        { 
                            input: documentPrompt,
                            action: "Write a humanized, 100% unique content that is undetectable by AI" 
                        }, 
                        {
                            headers: { 'Content-Type': 'application/json' },
                        }
                    );
                    
                    setResponse(response.data.modifiedText);
                } else {
                    // Multi-chunk processing
                    let combinedResponse = '';
                    
                    for (let i = 0; i < chunks.length; i++) {
                        const chunkPrompt = prepareDocumentPrompt(
                            chunks[i], 
                            processingMode, 
                            `${input} (Part ${i + 1}/${chunks.length})`
                        );
                        
                        const response = await axios.post(
                            `${apiUrlA}/rewrite`, 
                            { 
                                input: chunkPrompt,
                                action: "Write a humanized, 100% unique content that is undetectable by AI" 
                            }, 
                            {
                                headers: { 'Content-Type': 'application/json' },
                            }
                        );
                        
                        combinedResponse += `\n\n=== Part ${i + 1} ===\n${response.data.modifiedText}`;
                    }
                    
                    setResponse(combinedResponse.trim());
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setResponse('Error fetching data. Please try again.');
        } finally {
            setLoading(false);
            setInput('');
        }
    };

    // Content prompt preparation
    const prepareContentPrompt = (userInput, type, length, tone, primaryKw, secondaryKw) => {
        const promptPrefix = {
            'blog-post': 'Craft a detailed and engaging blog post in a relaxed, conversational style—as if you are sharing your thoughts with a curious friend. Let the writing flow naturally with a mix of sentence lengths, a few casual phrases, and occasional imperfections. Include personal reflections, hypothetical situations, or relatable commentary to give the post a human touch. Avoid overly formal language or robotic structure. The final result should feel original, sincere, and indistinguishable from something written entirely by a human.'
        };
        
        const toneInstructions = {
            'standard': 'Use a balanced, neutral tone with a mix of sentence structures.',
            'active': 'Use active voice, direct statements, and energetic language. Keep it engaging and dynamic.',
            'storytelling': 'Use narrative techniques, descriptive language, and a conversational flow. Include anecdotes where appropriate.',
            'professional': 'Use formal language, industry-specific terminology, and structured arguments. Maintain a business-appropriate tone.'
        };
        
        const formattingInstructions = 'Use appropriate formatting including bold text for important points, headers for sections, and a compelling title.';
        
        let keywordInstructions = '';
        if (primaryKw.trim() || secondaryKw.trim()) {
            keywordInstructions = `Use "${primaryKw.trim()}" as the primary keyword and "${secondaryKw.trim()}" as the secondary keyword. Incorporate these keywords naturally throughout the content in a way that feels organic and not forced. The primary keyword should appear in the title and first paragraph.`;
        }
        
        const humanizationInstructions = `Make the writing style natural, human-generated, and 100% unique - not AI-generated. Include occasional pauses, personal anecdotes, or reflective thoughts as if a human is writing based on personal experience. Use varied sentence structures with occasional imperfections, conversational phrases, and a natural flow that resembles human writing patterns.`;
        
        return `${promptPrefix[type] || ''} ${userInput}. The content should be approximately ${length} words long. ${toneInstructions[tone]} ${formattingInstructions} ${keywordInstructions} ${humanizationInstructions}`;
    };

    // Document prompt preparation
    const prepareDocumentPrompt = (parsedText, mode, additionalInstructions) => {
        const modeInstructions = {
            'tutorial': 'Transform this content into a comprehensive, step-by-step tutorial. Break down complex concepts into easy-to-follow steps with clear explanations, practical examples, and actionable advice. Use numbered steps, bullet points where appropriate, and include tips and best practices.',
            'self-help-guide': 'Rewrite this content as an empowering self-help guide. Focus on actionable advice, motivational language, and practical strategies that readers can implement immediately. Include personal development insights, encouraging tone, and real-world applications.',
            'summary': 'Create a concise but comprehensive summary that captures all the key points, main ideas, and important details. Organize the information logically and make it easy to understand and reference.',
            'article': 'Transform this content into a well-structured, engaging article with a compelling introduction, organized body sections, and a strong conclusion. Make it informative yet accessible to a general audience.'
        };

        const humanizationInstructions = `Write this content to be 100% unique and humanized - completely undetectable by AI detection tools. Use natural language patterns, varied sentence structures, personal insights where appropriate, and a conversational yet informative tone. Include occasional transitional phrases and natural flow that mimics human writing style.`;

        const additionalContext = additionalInstructions?.trim() ? `Additional requirements: ${additionalInstructions}` : '';

        return `${modeInstructions[mode]} 

Original content to process:
${parsedText}

${additionalContext}

${humanizationInstructions}

Please ensure the output is well-formatted with appropriate headings, subheadings, and clear organization.`;
    };

    // Effects
    useEffect(() => {
        if (response && response.trim() !== '' && activeTab !== 'document') {
            // Store in memory instead of localStorage
        }
        dispatch(loadData(response));
    }, [response, activeTab, dispatch]);

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
                    className={`py-2 px-4 mr-2 ${activeTab === 'content' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                    onClick={() => handleTabChange('content')}
                >
                    Content Generation
                </button>
                <button 
                    className={`py-2 px-4 ${activeTab === 'document' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                    onClick={() => handleTabChange('document')}
                >
                    Document Processing
                </button>
            </div>

            {/* Memory Stats Display */}
            {documentStats && activeTab === 'document' && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-blue-700">
                            <span className="font-medium">Memory:</span> {documentStats.documentsCount} documents, {documentStats.totalSizeMB}MB used
                        </div>
                        <button
                            onClick={clearDocumentMemory}
                            className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                        >
                            Clear Memory
                        </button>
                    </div>
                </div>
            )}
            
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
                    </div>
                )}

                {activeTab === 'document' && (
                    <div className="w-full mb-4">
                        {/* File Upload Section */}
                        <div className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                            <label htmlFor="file-upload" className="block mb-2 text-sm font-medium text-gray-700">
                                Upload Document (PDF, Word, Text, Excel, CSV files supported)
                            </label>
                            <input
                                type="file"
                                id="file-upload"
                                accept=".pdf,.doc,.docx,.txt,.rtf,.xls,.xlsx,.csv"
                                onChange={handleFileUpload}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {uploadedFile && (
                                <div className="mt-2">
                                    <p className="text-sm text-green-600">
                                        ✓ Uploaded: {uploadedFile.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Size: {(uploadedFile.size / 1024).toFixed(1)} KB
                                    </p>
                                </div>
                            )}
                            {documentProcessing && (
                                <div className="mt-2">
                                    <div className="flex items-center mb-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                        <p className="text-sm text-blue-600">
                                            Processing document...
                                        </p>
                                    </div>
                                    {processingProgress > 0 && (
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${processingProgress}%` }}
                                            ></div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Processing Options - Only show after successful upload */}
                        {parsedText && documentId && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                <div>
                                    <label htmlFor="processing-mode" className="block mb-2 text-sm font-medium text-gray-700">
                                        Processing Mode
                                    </label>
                                    <select
                                        id="processing-mode"
                                        value={processingMode}
                                        onChange={handleProcessingModeChange}
                                        className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    >
                                        {processingModes.map((mode) => (
                                            <option key={mode.id} value={mode.id}>
                                                {mode.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Output Style
                                    </label>
                                    <div className="bg-green-100 p-2 rounded-lg text-sm text-green-700 flex items-center">
                                        <span className="mr-2">✓</span>
                                        100% Unique & Humanized
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Enhanced Document Preview */}
                        {parsedText && documentId && (
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-sm font-medium text-gray-700">Document Preview:</h4>
                                    <div className="text-xs text-gray-500">
                                        ID: {documentId.split('-')[0]}...
                                    </div>
                                </div>
                                <div className="text-xs text-gray-600 max-h-32 overflow-y-auto bg-white p-2 rounded border">
                                    {parsedText.length > 500 
                                        ? `${parsedText.substring(0, 500)}...` 
                                        : parsedText
                                    }
                                </div>
                                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                                    <span>
                                        Extracted {parsedText.length.toLocaleString()} characters
                                    </span>
                                    <span>
                                        {documentMemory.current.chunkContent(parsedText).length > 1 
                                            ? `Will process in ${documentMemory.current.chunkContent(parsedText).length} chunks`
                                            : 'Single chunk processing'
                                        }
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Document Error Display */}
                        {parsedText && parsedText.includes('Error parsing document') && (
                            <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                                <div className="flex items-center">
                                    <span className="text-red-500 mr-2">⚠️</span>
                                    <div className="text-sm text-red-700">
                                        <p className="font-medium">Document Processing Error</p>
                                        <p className="text-xs mt-1">{parsedText}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                <textarea
                    value={input}
                    onChange={handleInputChange}
                    placeholder={
                        activeTab === 'chat' 
                            ? "Type your question here." 
                            : activeTab === 'content'
                            ? `Enter topic for your ${contentType.replace('-', ' ')}`
                            : "Enter additional instructions for document processing (optional)"
                    }
                    className='w-full p-2 bg-gray-200 rounded-xl font-normal from-neutral-700 border-none resize-none outline-none'
                    rows={1}
                    style={{ minHeight: '40px', overflow: 'hidden' }}
                    onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                />
                
                <button
                    onClick={fetchData}
                    disabled={loading || (activeTab === 'document' && (!parsedText || !documentId))}
                    className="text-neutral-600 mt-3 w-full rounded-xl p-2 bg-gray-200 hover:text-neutral-900 hover:bg-gray-300 text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 
                        <span className="loading loading-dots loading-lg bg-slate-950"></span> : 
                        activeTab === 'chat' ? 'Get Response' : 
                        activeTab === 'content' ? `Generate ${contentType.replace('-', ' ')} (${contentLength} words, ${toneStyle} tone)` :
                        `Process Document as ${processingMode.replace('-', ' ')}`
                    }
                </button>

                {/* Processing Status for Document Tab */}
                {activeTab === 'document' && loading && documentId && (
                    <div className="mt-2 text-sm text-blue-600 text-center">
                        {documentMemory.current.chunkContent(parsedText).length > 1 
                            ? 'Processing document in multiple chunks for better results...'
                            : 'Processing document...'
                        }
                    </div>
                )}
            </div>

            {/* Response Area */}
            <div className='mt-4 mb-4 p-4 flex flex-col font-light text-neutral-900 mr-5 ml-5 rounded-xl'>
                {parseResponse(response)}
            </div>

            {/* Debug Information (Only in development) */}
            {process.env.NODE_ENV === 'development' && documentStats && (
                <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs text-gray-600">
                    <h5 className="font-medium mb-2">Debug Info:</h5>
                    <div className="grid grid-cols-2 gap-2">
                        <div>Documents in Memory: {documentStats.documentsCount}</div>
                        <div>Total Memory Used: {documentStats.totalSizeMB}MB</div>
                        <div>Current Document ID: {documentId || 'None'}</div>
                        <div>Active Tab: {activeTab}</div>
                    </div>
                </div>
            )}


        </div>



    );
};

export default ChatComponent;