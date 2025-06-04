

// import React, { useState, useRef } from 'react';
// import axios from 'axios';
// import * as mammoth from 'mammoth';
// import * as XLSX from 'xlsx';
// // import { parseResponse } from '../util/parseresponse'; // Adjust path as needed
// import { parseResponse } from '../../../util/parseresponse';

// const apiUrlA = import.meta.env.VITE_API_BASE_URL;

// // Memory Management System
// class DocumentMemory {
//     constructor() {
//         this.documents = new Map();
//         this.cache = new Map();
//         this.maxCacheSize = 50; // Maximum cached documents
//         this.maxDocumentSize = 10 * 1024 * 1024; // 10MB max per document
//     }

//     // Store document with metadata
//     store(id, data, metadata = {}) {
//         if (this.cache.size >= this.maxCacheSize) {
//             // Remove oldest entry
//             const firstKey = this.cache.keys().next().value;
//             this.cache.delete(firstKey);
//             this.documents.delete(firstKey);
//         }

//         const documentData = {
//             content: data,
//             metadata: {
//                 ...metadata,
//                 timestamp: Date.now(),
//                 size: new Blob([data]).size
//             }
//         };

//         this.documents.set(id, documentData);
//         this.cache.set(id, true);
//         return id;
//     }

//     // Retrieve document
//     get(id) {
//         return this.documents.get(id);
//     }

//     // Check if document exists
//     has(id) {
//         return this.documents.has(id);
//     }

//     // Remove document
//     remove(id) {
//         this.documents.delete(id);
//         this.cache.delete(id);
//     }

//     // Clear all documents
//     clear() {
//         this.documents.clear();
//         this.cache.clear();
//     }

//     // Get memory usage stats
//     getStats() {
//         let totalSize = 0;
//         this.documents.forEach(doc => {
//             totalSize += doc.metadata.size || 0;
//         });

//         return {
//             documentsCount: this.documents.size,
//             totalSize: totalSize,
//             totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2)
//         };
//     }

//     // Chunk large content for processing
//     chunkContent(content, maxChunkSize = 8000) {
//         if (content.length <= maxChunkSize) {
//             return [content];
//         }

//         const chunks = [];
//         let start = 0;

//         while (start < content.length) {
//             let end = start + maxChunkSize;
            
//             // Try to break at sentence boundary
//             if (end < content.length) {
//                 const lastPeriod = content.lastIndexOf('.', end);
//                 const lastNewline = content.lastIndexOf('\n', end);
//                 const breakPoint = Math.max(lastPeriod, lastNewline);
                
//                 if (breakPoint > start) {
//                     end = breakPoint + 1;
//                 }
//             }

//             chunks.push(content.slice(start, end));
//             start = end;
//         }

//         return chunks;
//     }
// }

// const DocumentProcessing = () => {
//     const [input, setInput] = useState('');
//     const [response, setResponse] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [processingMode, setProcessingMode] = useState('tutorial');
    
//     // Document processing states with memory
//     const [uploadedFile, setUploadedFile] = useState(null);
//     const [parsedText, setParsedText] = useState('');
//     const [documentProcessing, setDocumentProcessing] = useState(false);
//     const [documentId, setDocumentId] = useState(null);
//     const [documentStats, setDocumentStats] = useState(null);
//     const [processingProgress, setProcessingProgress] = useState(0);

//     // Memory system reference
//     const documentMemory = useRef(new DocumentMemory());

//     const processingModes = [
//         { id: 'tutorial', label: 'Tutorial' },
//         { id: 'self-help-guide', label: 'Self Help Guide' },
//         { id: 'summary', label: 'Summary' },
//         { id: 'article', label: 'Article' }
//     ];

//     // Enhanced PDF text extraction using better parsing
//     const extractTextFromPDF = (arrayBuffer) => {
//         return new Promise((resolve, reject) => {
//             try {
//                 const uint8Array = new Uint8Array(arrayBuffer);
//                 let text = '';
                
//                 // Convert to string for pattern matching
//                 const pdfString = String.fromCharCode.apply(null, uint8Array);
                
//                 // Multiple PDF text extraction strategies
//                 const strategies = [
//                     // Strategy 1: Look for stream objects with text
//                     () => {
//                         const streamRegex = /stream\s*(.*?)\s*endstream/gs;
//                         const matches = pdfString.match(streamRegex);
//                         if (matches) {
//                             return matches.map(match => {
//                                 const content = match.replace(/^stream\s*/, '').replace(/\s*endstream$/, '');
//                                 // Decode simple text content
//                                 return content.replace(/[^\x20-\x7E\n\r\t]/g, ' ').trim();
//                             }).filter(content => content.length > 10).join('\n');
//                         }
//                         return '';
//                     },
                    
//                     // Strategy 2: Look for text objects
//                     () => {
//                         const textRegex = /BT\s*(.*?)\s*ET/gs;
//                         const matches = pdfString.match(textRegex);
//                         if (matches) {
//                             return matches.map(match => {
//                                 // Extract text from BT...ET blocks
//                                 const tjRegex = /\[(.*?)\]\s*TJ/g;
//                                 const tjMatches = match.match(tjRegex);
//                                 if (tjMatches) {
//                                     return tjMatches.map(tj => {
//                                         const textContent = tj.match(/\[(.*?)\]/);
//                                         return textContent ? textContent[1].replace(/[()]/g, '') : '';
//                                     }).join(' ');
//                                 }
//                                 return '';
//                             }).filter(content => content.length > 0).join('\n');
//                         }
//                         return '';
//                     },
                    
//                     // Strategy 3: Simple parentheses content extraction
//                     () => {
//                         const parenRegex = /\(([^)]+)\)/g;
//                         const matches = pdfString.match(parenRegex);
//                         if (matches) {
//                             return matches.map(match => match.slice(1, -1)).join(' ');
//                         }
//                         return '';
//                     },
                    
//                     // Strategy 4: Look for readable ASCII text sequences
//                     () => {
//                         const readableRegex = /[a-zA-Z0-9\s.,!?;:'"()-]{10,}/g;
//                         const matches = pdfString.match(readableRegex);
//                         if (matches) {
//                             return matches.filter(match => 
//                                 match.trim().length > 10 && 
//                                 /[a-zA-Z]/.test(match)
//                             ).join(' ');
//                         }
//                         return '';
//                     }
//                 ];

//                 // Try each strategy
//                 for (const strategy of strategies) {
//                     const result = strategy();
//                     if (result && result.trim().length > 50) {
//                         text = result;
//                         break;
//                     }
//                 }

//                 // If no strategy worked, try a general approach
//                 if (!text || text.trim().length < 50) {
//                     // Extract any readable text sequences
//                     const allText = pdfString.replace(/[^\x20-\x7E\n\r\t]/g, ' ')
//                         .replace(/\s+/g, ' ')
//                         .trim();
                    
//                     if (allText.length > 100) {
//                         text = allText;
//                     }
//                 }

//                 if (text.trim().length === 0) {
//                     resolve('Unable to extract text from this PDF. The file might be image-based or encrypted. Please try converting it to text format first or use a different file.');
//                 } else {
//                     // Clean up the extracted text
//                     const cleanedText = text
//                         .replace(/\s+/g, ' ')
//                         .replace(/(.)\1{3,}/g, '$1')
//                         .trim();
//                     resolve(cleanedText);
//                 }
//             } catch (error) {
//                 reject(new Error(`PDF parsing failed: ${error.message}`));
//             }
//         });
//     };

//     // Enhanced file parsing functions
//     const parseTextFile = (file) => {
//         return new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onload = (e) => resolve(e.target.result);
//             reader.onerror = reject;
//             reader.readAsText(file, 'utf-8');
//         });
//     };

//     const parseWordFile = (file) => {
//         return new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onload = async (e) => {
//                 try {
//                     const arrayBuffer = e.target.result;
//                     const result = await mammoth.extractRawText({ arrayBuffer });
//                     resolve(result.value || 'No text content found in Word document.');
//                 } catch (error) {
//                     reject(new Error(`Word document parsing failed: ${error.message}`));
//                 }
//             };
//             reader.onerror = reject;
//             reader.readAsArrayBuffer(file);
//         });
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
//                         const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                        
//                         allText += `\n=== Sheet: ${sheetName} ===\n`;
//                         sheetData.forEach((row, index) => {
//                             if (row.length > 0) {
//                                 allText += `Row ${index + 1}: ${row.join(' | ')}\n`;
//                             }
//                         });
//                     });
                    
//                     resolve(allText.trim() || 'No data found in Excel file.');
//                 } catch (error) {
//                     reject(new Error(`Excel parsing failed: ${error.message}`));
//                 }
//             };
//             reader.onerror = reject;
//             reader.readAsArrayBuffer(file);
//         });
//     };

//     const parseCSVFile = (file) => {
//         return new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 try {
//                     const csvData = e.target.result;
//                     const lines = csvData.split('\n');
//                     let formattedText = '=== CSV Data ===\n';
                    
//                     lines.forEach((line, index) => {
//                         if (line.trim()) {
//                             formattedText += `Row ${index + 1}: ${line.split(',').join(' | ')}\n`;
//                         }
//                     });
                    
//                     resolve(formattedText.trim() || 'No data found in CSV file.');
//                 } catch (error) {
//                     reject(new Error(`CSV parsing failed: ${error.message}`));
//                 }
//             };
//             reader.onerror = reject;
//             reader.readAsText(file, 'utf-8');
//         });
//     };

//     // Main file upload handler with memory management
//     const handleFileUpload = async (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         // Check file size
//         if (file.size > documentMemory.current.maxDocumentSize) {
//             alert(`File too large. Maximum size is ${documentMemory.current.maxDocumentSize / (1024 * 1024)}MB`);
//             return;
//         }

//         setUploadedFile(file);
//         setDocumentProcessing(true);
//         setParsedText('');
//         setProcessingProgress(0);
        
//         try {
//             let extractedText = '';
//             const fileExtension = file.name.split('.').pop().toLowerCase();
//             const fileId = `${file.name}-${Date.now()}`;
            
//             // Update progress
//             setProcessingProgress(25);
            
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
//                     const arrayBuffer = await file.arrayBuffer();
//                     extractedText = await extractTextFromPDF(arrayBuffer);
//                     break;
//                 case 'xls':
//                 case 'xlsx':
//                     extractedText = await parseExcelFile(file);
//                     break;
//                 case 'csv':
//                     extractedText = await parseCSVFile(file);
//                     break;
//                 default:
//                     throw new Error(`Unsupported file format: ${fileExtension}`);
//             }
            
//             setProcessingProgress(75);
            
//             if (extractedText.trim()) {
//                 // Store in memory
//                 const storedId = documentMemory.current.store(fileId, extractedText, {
//                     fileName: file.name,
//                     fileType: fileExtension,
//                     fileSize: file.size,
//                     uploadTime: new Date().toISOString()
//                 });
                
//                 setDocumentId(storedId);
//                 setParsedText(extractedText);
//                 setDocumentStats(documentMemory.current.getStats());
//                 setProcessingProgress(100);
//             } else {
//                 throw new Error('No text content found in the file.');
//             }
//         } catch (error) {
//             console.error('Error parsing document:', error);
//             setParsedText(`Error parsing document: ${error.message}`);
//             setDocumentId(null);
//         } finally {
//             setDocumentProcessing(false);
//             setTimeout(() => setProcessingProgress(0), 2000);
//         }
//     };

//     // Event handlers
//     const handleInputChange = (e) => {
//         setInput(e.target.value);
//     };

//     const handleProcessingModeChange = (e) => {
//         setProcessingMode(e.target.value);
//     };

//     // Clear document memory
//     const clearDocumentMemory = () => {
//         documentMemory.current.clear();
//         setUploadedFile(null);
//         setParsedText('');
//         setDocumentId(null);
//         setDocumentStats(null);
//         setResponse('');
//     };

//     // Document prompt preparation
//     const prepareDocumentPrompt = (parsedText, mode, additionalInstructions) => {
//         const modeInstructions = {
//             'tutorial': 'Transform this content into a comprehensive, step-by-step tutorial. Break down complex concepts into easy-to-follow steps with clear explanations, practical examples, and actionable advice. Use numbered steps, bullet points where appropriate, and include tips and best practices.',
//             'self-help-guide': 'Rewrite this content as an empowering self-help guide. Focus on actionable advice, motivational language, and practical strategies that readers can implement immediately. Include personal development insights, encouraging tone, and real-world applications.',
//             'summary': 'Create a concise but comprehensive summary that captures all the key points, main ideas, and important details. Organize the information logically and make it easy to understand and reference.',
//             'article': 'Transform this content into a well-structured, engaging article with a compelling introduction, organized body sections, and a strong conclusion. Make it informative yet accessible to a general audience.'
//         };

//         const humanizationInstructions = `Write this content to be 100% unique and humanized - completely undetectable by AI detection tools. Use natural language patterns, varied sentence structures, personal insights where appropriate, and a conversational yet informative tone. Include occasional transitional phrases and natural flow that mimics human writing style.`;

//         const additionalContext = additionalInstructions?.trim() ? `Additional requirements: ${additionalInstructions}` : '';

//         return `${modeInstructions[mode]} 

// Original content to process:
// ${parsedText}

// ${additionalContext}

// ${humanizationInstructions}

// Please ensure the output is well-formatted with appropriate headings, subheadings, and clear organization.`;
//     };

//     // Main API call function for document processing
//     const processDocument = async () => {
//         setLoading(true);

//         try {
//             if (!documentId || !documentMemory.current.has(documentId)) {
//                 setResponse('Please upload a document first.');
//                 setLoading(false);
//                 return;
//             }

//             const documentData = documentMemory.current.get(documentId);
//             const chunks = documentMemory.current.chunkContent(documentData.content);
            
//             if (chunks.length === 1) {
//                 // Single chunk processing
//                 const documentPrompt = prepareDocumentPrompt(chunks[0], processingMode, input);
                
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
//             } else {
//                 // Multi-chunk processing
//                 let combinedResponse = '';
                
//                 for (let i = 0; i < chunks.length; i++) {
//                     const chunkPrompt = prepareDocumentPrompt(
//                         chunks[i], 
//                         processingMode, 
//                         `${input} (Part ${i + 1}/${chunks.length})`
//                     );
                    
//                     const response = await axios.post(
//                         `${apiUrlA}/rewrite`, 
//                         { 
//                             input: chunkPrompt,
//                             action: "Write a humanized, 100% unique content that is undetectable by AI" 
//                         }, 
//                         {
//                             headers: { 'Content-Type': 'application/json' },
//                         }
//                     );
                    
//                     combinedResponse += `\n\n=== Part ${i + 1} ===\n${response.data.modifiedText}`;
//                 }
                
//                 setResponse(combinedResponse.trim());
//             }
//         } catch (error) {
//             console.error('Error processing document:', error);
//             setResponse('Error processing document. Please try again.');
//         } finally {
//             setLoading(false);
//             setInput('');
//         }
//     };

//     return (



{/* <div className="mb-4 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg border border-emerald-300">
<h2 className="text-xl font-semibold text-black mb-2">🤖 AI Document Processor</h2>
<p className="text-sm text-gray-900">
    Upload any document (up to 50MB) and I'll intelligently chunk large files, 
    read and understand the content, then rewrite it in active voice as an engaging narrator. 
    Perfect for creating tutorials, guides, summaries, and articles from your documents.
</p>
</div> */}
//         <div className="flex flex-col flex-1 bg-white p-4 rounded-lg lg:h-screen sm:h-auto sm:w-auto overflow-x-auto overflow-y-auto">
//             {/* Memory Stats Display */}
//             {documentStats && (
//                 <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
//                     <div className="flex justify-between items-center">
//                         <div className="text-sm text-blue-700">
//                             <span className="font-medium">Memory:</span> {documentStats.documentsCount} documents, {documentStats.totalSizeMB}MB used
//                         </div>
//                         <button
//                             onClick={clearDocumentMemory}
//                             className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
//                         >
//                             Clear Memory
//                         </button>
//                     </div>
//                 </div>
//             )}
            
//             {/* Input Area */}
//             <div className='flex flex-col items-center rounded-md p-5'>
//                 <div className="w-full mb-4">
//                     {/* File Upload Section */}
//                     <div className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
//                         <label htmlFor="file-upload" className="block mb-2 text-sm font-medium text-gray-700">
//                             Upload Document (PDF, Word, Text, Excel, CSV files supported)
//                         </label>
//                         <input
//                             type="file"
//                             id="file-upload"
//                             accept=".pdf,.doc,.docx,.txt,.rtf,.xls,.xlsx,.csv"
//                             onChange={handleFileUpload}
//                             className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                         />
//                         {uploadedFile && (
//                             <div className="mt-2">
//                                 <p className="text-sm text-green-600">
//                                     ✓ Uploaded: {uploadedFile.name}
//                                 </p>
//                                 <p className="text-xs text-gray-500">
//                                     Size: {(uploadedFile.size / 1024).toFixed(1)} KB
//                                 </p>
//                             </div>
//                         )}
//                         {documentProcessing && (
//                             <div className="mt-2">
//                                 <div className="flex items-center mb-2">
//                                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
//                                     <p className="text-sm text-blue-600">
//                                         Processing document...
//                                     </p>
//                                 </div>
//                                 {processingProgress > 0 && (
//                                     <div className="w-full bg-gray-200 rounded-full h-2">
//                                         <div 
//                                             className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                                             style={{ width: `${processingProgress}%` }}
//                                         ></div>
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </div>

//                     {/* Processing Options - Only show after successful upload */}
//                     {parsedText && documentId && (
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
//                             <div>
//                                 <label htmlFor="processing-mode" className="block mb-2 text-sm font-medium text-gray-700">
//                                     Processing Mode
//                                 </label>
//                                 <select
//                                     id="processing-mode"
//                                     value={processingMode}
//                                     onChange={handleProcessingModeChange}
//                                     className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                                 >
//                                     {processingModes.map((mode) => (
//                                         <option key={mode.id} value={mode.id}>
//                                             {mode.label}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
                            
//                             <div>
//                                 <label className="block mb-2 text-sm font-medium text-gray-700">
//                                     Output Style
//                                 </label>
//                                 <div className="bg-green-100 p-2 rounded-lg text-sm text-green-700 flex items-center">
//                                     <span className="mr-2">✓</span>
//                                     100% Unique & Humanized
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Enhanced Document Preview */}
//                     {parsedText && documentId && (
//                         <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
//                             <div className="flex justify-between items-center mb-2">
//                                 <h4 className="text-sm font-medium text-gray-700">Document Preview:</h4>
//                                 <div className="text-xs text-gray-500">
//                                     ID: {documentId.split('-')[0]}...
//                                 </div>
//                             </div>
//                             <div className="text-xs text-gray-600 max-h-32 overflow-y-auto bg-white p-2 rounded border">
//                                 {parsedText.length > 500 
//                                     ? `${parsedText.substring(0, 500)}...` 
//                                     : parsedText
//                                 }
//                             </div>
//                             <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
//                                 <span>
//                                     Extracted {parsedText.length.toLocaleString()} characters
//                                 </span>
//                                 <span>
//                                     {documentMemory.current.chunkContent(parsedText).length > 1 
//                                         ? `Will process in ${documentMemory.current.chunkContent(parsedText).length} chunks`
//                                         : 'Single chunk processing'
//                                     }
//                                 </span>
//                             </div>
//                         </div>
//                     )}

//                     {/* Document Error Display */}
//                     {parsedText && parsedText.includes('Error parsing document') && (
//                         <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
//                             <div className="flex items-center">
//                                 <span className="text-red-500 mr-2">⚠️</span>
//                                 <div className="text-sm text-red-700">
//                                     <p className="font-medium">Document Processing Error</p>
//                                     <p className="text-xs mt-1">{parsedText}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>
                
//                 <textarea
//                     value={input}
//                     onChange={handleInputChange}
//                     placeholder="Enter additional instructions for document processing (optional)"
//                     className='w-full p-2 bg-gray-200 rounded-xl font-normal from-neutral-700 border-none resize-none outline-none'
//                     rows={1}
//                     style={{ minHeight: '40px', overflow: 'hidden' }}
//                     onInput={(e) => {
//                         e.target.style.height = 'auto';
//                         e.target.style.height = `${e.target.scrollHeight}px`;
//                     }}
//                 />
                
//                 <button
//                     onClick={processDocument}
//                     disabled={loading || (!parsedText || !documentId)}
//                     className="text-neutral-600 mt-3 w-full rounded-xl p-2 bg-gray-200 hover:text-neutral-900 hover:bg-gray-300 text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                     {loading ? 
//                         <span className="loading loading-dots loading-lg bg-slate-950"></span> : 
//                         `Process Document as ${processingMode.replace('-', ' ')}`
//                     }
//                 </button>

//                 {/* Processing Status */}
//                 {loading && documentId && (
//                     <div className="mt-2 text-sm text-blue-600 text-center">
//                         {documentMemory.current.chunkContent(parsedText).length > 1 
//                             ? 'Processing document in multiple chunks for better results...'
//                             : 'Processing document...'
//                         }
//                     </div>
//                 )}
//             </div>

//             {/* Response Area */}
//             <div className='mt-4 mb-4 p-4 flex flex-col font-light text-neutral-900 mr-5 ml-5 rounded-xl'>
//                 {parseResponse(response)}
//             </div>

//             {/* Debug Information (Only in development) */}
//             {process.env.NODE_ENV === 'development' && documentStats && (
//                 <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs text-gray-600">
//                     <h5 className="font-medium mb-2">Debug Info:</h5>
//                     <div className="grid grid-cols-2 gap-2">
//                         <div>Documents in Memory: {documentStats.documentsCount}</div>
//                         <div>Total Memory Used: {documentStats.totalSizeMB}MB</div>
//                         <div>Current Document ID: {documentId || 'None'}</div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default DocumentProcessing;






























// import React, { useState, useRef } from 'react';
// import axios from 'axios';
// import * as mammoth from 'mammoth';
// import * as XLSX from 'xlsx';
// import { parseResponse } from '../../../util/parseresponse';

// const apiUrlA = import.meta.env.VITE_API_BASE_URL;

// class DocumentMemory {
//     constructor() {
//         this.documents = new Map();
//         this.maxCacheSize = 50;
//         this.maxDocumentSize = 50 * 1024 * 1024;
//     }

//     store(id, data, metadata = {}) {
//         if (this.documents.size >= this.maxCacheSize) {
//             const firstKey = this.documents.keys().next().value;
//             this.documents.delete(firstKey);
//         }
//         this.documents.set(id, {
//             content: data,
//             metadata: { ...metadata, timestamp: Date.now(), size: new Blob([data]).size }
//         });
//         return id;
//     }

//     get(id) { return this.documents.get(id); }
//     has(id) { return this.documents.has(id); }
//     clear() { this.documents.clear(); }

//     chunkContent(content, maxChunkSize = 15000) {
//         if (!content || content.length <= maxChunkSize) return [content];
        
//         const chunks = [];
//         const overlap = 500;
//         let start = 0;

//         while (start < content.length) {
//             let end = Math.min(start + maxChunkSize, content.length);
//             if (end < content.length) {
//                 const boundary = ['\n\n', '. ', '\n'].map(b => content.lastIndexOf(b, end))
//                     .find(b => b > start + maxChunkSize * 0.8);
//                 if (boundary) end = boundary + 1;
//             }
            
//             const chunk = content.slice(start, end).trim();
//             if (chunk) chunks.push(chunk);
//             start = Math.max(end - overlap, start + 1);
            
//             if (chunks.length > 20) break; // Much smaller limit
//         }
//         return chunks.length ? chunks : [content];
//     }

//     getStats() {
//         const totalSize = Array.from(this.documents.values())
//             .reduce((sum, doc) => sum + (doc.metadata?.size || 0), 0);
//         return {
//             documentsCount: this.documents.size,
//             totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2)
//         };
//     }
// }

// const DocumentProcessing = () => {
//     const [input, setInput] = useState('');
//     const [response, setResponse] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [processingMode, setProcessingMode] = useState('tutorial');
//     const [uploadedFile, setUploadedFile] = useState(null);
//     const [parsedText, setParsedText] = useState('');
//     const [documentProcessing, setDocumentProcessing] = useState(false);
//     const [documentId, setDocumentId] = useState(null);
//     const [processingProgress, setProcessingProgress] = useState({ current: 0, total: 0, phase: '' });
//     const [error, setError] = useState(null);

//     const documentMemory = useRef(new DocumentMemory());
//     const fileInputRef = useRef(null);

//     const processingModes = [
//         { id: 'tutorial', label: 'Tutorial Guide' },
//         { id: 'self-help-guide', label: 'Self-Help Guide' },
//         { id: 'summary', label: 'Executive Summary' },
//         { id: 'article', label: 'Engaging Article' }
//     ];

//     const validateFile = (file) => {
//         const allowedExt = ['txt', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'rtf'];
//         const fileExt = file.name.split('.').pop().toLowerCase();
        
//         if (!allowedExt.includes(fileExt)) throw new Error(`Unsupported file type: .${fileExt}`);
//         if (file.size > documentMemory.current.maxDocumentSize) throw new Error('File too large (max 50MB)');
//         if (file.size === 0) throw new Error('File is empty');
//         return true;
//     };

//     const parseFile = async (file) => {
//         return new Promise((resolve, reject) => {
//             const extension = file.name.split('.').pop().toLowerCase();
//             const reader = new FileReader();
            
//             const timeout = setTimeout(() => {
//                 reader.abort();
//                 reject(new Error('File reading timeout'));
//             }, 30000);

//             reader.onload = async (e) => {
//                 clearTimeout(timeout);
//                 try {
//                     let text = '';
//                     const data = e.target.result;

//                     switch (extension) {
//                         case 'txt':
//                         case 'rtf':
//                             text = typeof data === 'string' ? data : new TextDecoder().decode(data);
//                             break;
//                         case 'doc':
//                         case 'docx':
//                             const result = await mammoth.extractRawText({ arrayBuffer: data });
//                             text = result.value || '';
//                             break;
//                         case 'pdf':
//                             text = await extractPDFText(data);
//                             break;
//                         case 'xls':
//                         case 'xlsx':
//                             text = parseExcelData(data);
//                             break;
//                         case 'csv':
//                             text = parseCSVData(typeof data === 'string' ? data : new TextDecoder().decode(data));
//                             break;
//                         default:
//                             throw new Error(`Unsupported format: ${extension}`);
//                     }

//                     resolve(text.trim() || 'No readable content found');
//                 } catch (error) {
//                     reject(new Error(`Failed to parse ${extension.toUpperCase()}: ${error.message}`));
//                 }
//             };

//             reader.onerror = () => {
//                 clearTimeout(timeout);
//                 reject(new Error('Failed to read file'));
//             };
            
//             ['txt', 'rtf', 'csv'].includes(extension) ? reader.readAsText(file, 'utf-8') : reader.readAsArrayBuffer(file);
//         });
//     };

//     const extractPDFText = async (arrayBuffer) => {
//         try {
//             const uint8Array = new Uint8Array(arrayBuffer);
//             const pdfString = String.fromCharCode.apply(null, uint8Array.slice(0, 1000000));
            
//             if (!pdfString.startsWith('%PDF')) throw new Error('Invalid PDF file');

//             const strategies = [
//                 () => pdfString.match(/BT\s*(.*?)\s*ET/gs)?.map(extractTextFromBT).join('\n'),
//                 () => pdfString.match(/\(([^)]+)\)/g)?.map(m => m.slice(1, -1)).join(' '),
//                 () => pdfString.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim()
//             ];

//             for (const strategy of strategies) {
//                 const result = strategy();
//                 if (result && result.length > 100) return result;
//             }
            
//             return 'PDF text extraction failed. Try converting to text format.';
//         } catch (error) {
//             return `PDF processing error: ${error.message}`;
//         }
//     };

//     const extractTextFromBT = (match) => {
//         const tjMatches = match.match(/\[(.*?)\]\s*TJ/g);
//         return tjMatches?.map(tj => tj.match(/\[(.*?)\]/)?.[1]?.replace(/[()]/g, '') || '').join(' ') || '';
//     };

//     const parseExcelData = (data) => {
//         try {
//             const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
//             return workbook.SheetNames.map(sheetName => {
//                 const worksheet = workbook.Sheets[sheetName];
//                 const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
//                 const content = sheetData.filter(row => row?.length).map((row, i) => `${i + 1}: ${row.join(' | ')}`).join('\n');
//                 return `=== ${sheetName} ===\n${content || '(No data)'}`;
//             }).join('\n\n');
//         } catch (error) {
//             return `Excel parsing error: ${error.message}`;
//         }
//     };

//     const parseCSVData = (data) => {
//         try {
//             const lines = data.split('\n').filter(line => line.trim());
//             const content = lines.map((line, i) => `${i + 1}: ${line.split(',').join(' | ')}`).join('\n');
//             return `=== CSV Data ===\n${content || '(Empty file)'}`;
//         } catch (error) {
//             return `CSV parsing error: ${error.message}`;
//         }
//     };

//     const handleFileUpload = async (e) => {
//         const file = e.target.files?.[0];
//         if (!file) return;

//         setError(null);
//         setUploadedFile(null);
//         setParsedText('');
//         setDocumentId(null);
//         setResponse('');

//         try {
//             validateFile(file);
//             setUploadedFile(file);
//             setDocumentProcessing(true);
//             setProcessingProgress({ current: 10, total: 100, phase: 'Validating file...' });

//             setProcessingProgress({ current: 30, total: 100, phase: 'Reading file content...' });
//             const extractedText = await parseFile(file);
            
//             setProcessingProgress({ current: 70, total: 100, phase: 'Processing content...' });

//             if (!extractedText?.trim()) throw new Error('No content extracted from file');

//             const fileId = `${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}-${Date.now()}`;
//             documentMemory.current.store(fileId, extractedText, {
//                 fileName: file.name,
//                 fileType: file.name.split('.').pop(),
//                 fileSize: file.size
//             });

//             setDocumentId(fileId);
//             setParsedText(extractedText);
//             setProcessingProgress({ current: 100, total: 100, phase: 'Complete!' });

//         } catch (error) {
//             setError(error.message);
//             setParsedText('');
//             setUploadedFile(null);
//             setDocumentId(null);
//             if (fileInputRef.current) fileInputRef.current.value = '';
//         } finally {
//             setDocumentProcessing(false);
//             setTimeout(() => setProcessingProgress({ current: 0, total: 0, phase: '' }), 2000);
//         }
//     };

//     const preparePrompt = (content, mode, userInstructions) => {
//         const modeInstructions = {
//             'tutorial': 'Transform into a comprehensive, step-by-step tutorial with clear explanations and actionable advice.',
//             'self-help-guide': 'Rewrite as an empowering self-help guide with actionable advice and motivational language.',
//             'summary': 'Create a concise but comprehensive summary capturing all key points and main ideas.',
//             'article': 'Transform into a well-structured, engaging article with compelling introduction and strong conclusion.'
//         };

//         return `${modeInstructions[mode]}

// Original content: ${content}

// ${userInstructions?.trim() ? `Additional requirements: ${userInstructions}` : ''}

// Write this to be 100% unique and humanized with natural language patterns, varied sentence structures, and conversational tone. Use appropriate headings and clear organization.`;
//     };

//     // OPTIMIZED: Smart processing - no chunking for small content
//     const processDocument = async () => {
//         if (!documentId || !documentMemory.current.has(documentId)) {
//             setResponse('Please upload a document first.');
//             return;
//         }

//         setLoading(true);
//         setError(null);
        
//         try {
//             const documentData = documentMemory.current.get(documentId);
//             const content = documentData.content;
            
//             // For small content (< 10,000 chars), process directly without chunking
//             if (content.length < 10000) {
//                 setProcessingProgress({ current: 1, total: 1, phase: 'Processing document...' });
                
//                 const prompt = preparePrompt(content, processingMode, input);
                
//                 const response = await axios.post(
//                     `${apiUrlA}/rewrite`, 
//                     { 
//                         input: prompt,
//                         action: "Write a humanized, 100% unique content that is undetectable by AI" 
//                     }, 
//                     { 
//                         headers: { 'Content-Type': 'application/json' },
//                         timeout: 30000 
//                     }
//                 );

//                 setResponse(response.data?.modifiedText || 'No content generated');
//                 setProcessingProgress({ current: 1, total: 1, phase: 'Complete!' });
                
//             } else {
//                 // Only chunk for large content
//                 const chunks = documentMemory.current.chunkContent(content);
//                 setProcessingProgress({ current: 0, total: chunks.length, phase: 'Processing large document...' });

//                 const BATCH_SIZE = 5; // Increased batch size
//                 const results = [];
                
//                 for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
//                     const batch = chunks.slice(i, i + BATCH_SIZE);
//                     setProcessingProgress({ 
//                         current: i, 
//                         total: chunks.length, 
//                         phase: `Processing batch ${Math.floor(i/BATCH_SIZE) + 1}...` 
//                     });

//                     const batchPromises = batch.map(async (chunk, batchIndex) => {
//                         const chunkPrompt = preparePrompt(
//                             chunk, 
//                             processingMode, 
//                             `${input} (Part ${i + batchIndex + 1}/${chunks.length})`
//                         );

//                         try {
//                             const response = await axios.post(
//                                 `${apiUrlA}/rewrite`, 
//                                 { 
//                                     input: chunkPrompt,
//                                     action: "Write a humanized, 100% unique content that is undetectable by AI" 
//                                 }, 
//                                 { 
//                                     headers: { 'Content-Type': 'application/json' },
//                                     timeout: 30000 
//                                 }
//                             );

//                             return {
//                                 index: i + batchIndex,
//                                 content: response.data?.modifiedText || '[No content generated]'
//                             };
//                         } catch (error) {
//                             return {
//                                 index: i + batchIndex,
//                                 content: `[Error processing section: ${error.message}]`
//                             };
//                         }
//                     });

//                     const batchResults = await Promise.all(batchPromises);
//                     results.push(...batchResults);
                    
//                     // No delay for faster processing
//                 }

//                 const sortedResults = results.sort((a, b) => a.index - b.index);
//                 const combinedResponse = sortedResults.map(r => `\n\n=== Section ${r.index + 1} ===\n${r.content}`).join('');

//                 setResponse(combinedResponse.trim());
//                 setProcessingProgress({ current: chunks.length, total: chunks.length, phase: 'Complete!' });
//             }

//         } catch (error) {
//             setError(`Processing failed: ${error.message}`);
//             setResponse('');
//         } finally {
//             setLoading(false);
//             setInput('');
//             setTimeout(() => setProcessingProgress({ current: 0, total: 0, phase: '' }), 2000);
//         }
//     };

//     const clearMemory = () => {
//         documentMemory.current.clear();
//         setUploadedFile(null);
//         setParsedText('');
//         setDocumentId(null);
//         setResponse('');
//         setError(null);
//         setProcessingProgress({ current: 0, total: 0, phase: '' });
//         if (fileInputRef.current) fileInputRef.current.value = '';
//     };

//     const stats = documentMemory.current.getStats();
//     const chunks = parsedText ? documentMemory.current.chunkContent(parsedText) : [];

//     return (
//         <div className="flex flex-col flex-1 bg-white p-4 rounded-lg lg:h-screen sm:h-auto overflow-y-auto">
//             <div className="mb-4 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg border border-emerald-300">
//                 <h2 className="text-xl font-semibold text-black mb-2">🤖 AI Document Processor</h2>
//                 <p className="text-sm text-gray-900">
//                     Upload any document (up to 50MB) and I'll intelligently chunk large files, 
//                     read and understand the content, then rewrite it in active voice as an engaging narrator. 
//                     Perfect for creating tutorials, guides, summaries, and articles from your documents.
//                 </p>
//             </div>

//             {error && (
//                 <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
//                     <div className="flex items-start">
//                         <span className="text-red-500 mr-2 mt-0.5">❌</span>
//                         <div>
//                             <h4 className="text-red-800 font-medium mb-1">Upload Error</h4>
//                             <p className="text-red-700 text-sm">{error}</p>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {stats.documentsCount > 0 && (
//                 <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200 flex justify-between items-center">
//                     <span className="text-sm text-green-700">
//                         📁 {stats.documentsCount} documents ({stats.totalSizeMB}MB) in memory
//                     </span>
//                     <button onClick={clearMemory} className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200">
//                         Clear All
//                     </button>
//                 </div>
//             )}

//             <div className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
//                 <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept=".pdf,.doc,.docx,.txt,.rtf,.xls,.xlsx,.csv"
//                     onChange={handleFileUpload}
//                     disabled={documentProcessing}
//                     className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
//                 />
//                 <div className="mt-2 text-xs text-gray-500">
//                     Supported: DOC, DOCX (Max: 50MB) (plain Word Doc)
//                 </div>
//                 {uploadedFile && !error && (
//                     <div className="mt-2 flex items-center text-sm text-green-600">
//                         <span className="mr-2">✅</span>
//                         {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
//                     </div>
//                 )}
//             </div>

//             {(documentProcessing || (loading && processingProgress.total > 0)) && (
//                 <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
//                     <div className="flex items-center mb-2">
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
//                         <span className="text-sm font-medium text-blue-700">{processingProgress.phase}</span>
//                     </div>
//                     <div className="w-full bg-blue-200 rounded-full h-2">
//                         <div 
//                             className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                             style={{ 
//                                 width: `${processingProgress.total > 0 
//                                     ? (processingProgress.current / processingProgress.total) * 100 
//                                     : 0}%` 
//                             }}
//                         />
//                     </div>
//                     <div className="text-xs text-blue-600 mt-1">
//                         {processingProgress.total > 0 && 
//                             `${processingProgress.current}/${processingProgress.total} ${
//                                 loading ? 'chunks processed' : 'steps completed'
//                             }`
//                         }
//                     </div>
//                 </div>
//             )}

//             {parsedText && documentId && !error && (
//                 <>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                         <div>
//                             <label className="block mb-2 text-sm font-medium text-gray-700">Processing Mode</label>
//                             <select
//                                 value={processingMode}
//                                 onChange={(e) => setProcessingMode(e.target.value)}
//                                 className="w-full p-2.5 bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500"
//                             >
//                                 {processingModes.map(mode => (
//                                     <option key={mode.id} value={mode.id}>{mode.label}</option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div>
//                             <label className="block mb-2 text-sm font-medium text-gray-700">Output Style</label>
//                             <div className="bg-green-100 p-2.5 rounded-lg text-sm text-green-700 flex items-center">
//                                 <span className="mr-2">🎯</span>
//                                 Active Voice + Humanized Content
//                             </div>
//                         </div>
//                     </div>

//                     <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
//                         <div className="flex justify-between items-center mb-2">
//                             <h4 className="text-sm font-medium text-gray-700">📄 Document Preview</h4>
//                             <div className="text-xs text-gray-500">
//                                 {parsedText.length < 10000 ? 'Single API call' : `${chunks.length} chunks (batch processing)`}
//                             </div>
//                         </div>
//                         <div className="text-xs text-gray-600 max-h-32 overflow-y-auto bg-white p-2 rounded border">
//                             {parsedText.length > 500 ? `${parsedText.substring(0, 500)}...` : parsedText}
//                         </div>
//                         <div className="text-xs text-gray-500 mt-2">
//                             📊 {parsedText.length.toLocaleString()} characters extracted
//                         </div>
//                     </div>

//                     <textarea
//                         value={input}
//                         onChange={(e) => setInput(e.target.value)}
//                         placeholder="Additional instructions for AI processing (optional)"
//                         className="w-full p-3 bg-gray-200 rounded-lg border-none resize-none outline-none mb-4"
//                         rows={2}
//                     />

//                     <button
//                         onClick={processDocument}
//                         disabled={loading}
//                         className="w-full p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-green-500 hover:to-green-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                         {loading ? (
//                             <span className="flex items-center justify-center">
//                                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                                 {parsedText.length < 10000 ? 'Processing (single call)...' : `Processing ${chunks.length} chunks...`}
//                             </span>
//                         ) : (
//                             `🚀 Process as ${processingMode.replace('-', ' ').toUpperCase()}`
//                         )}
//                     </button>
//                 </>
//             )}

//             {response && (
//                 <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-3">✨ Processed Content</h3>
//                     <div className="text-gray-900 leading-relaxed">
//                         {parseResponse(response)}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default DocumentProcessing;










































































import React, { useState, useRef } from 'react';
import axios from 'axios';
import * as mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import { parseResponse } from '../../../util/parseresponse';

const apiUrlA = import.meta.env.VITE_API_BASE_URL;

// PDF.js Integration - Robust PDF Text Extraction
class PDFProcessor {
    constructor() {
        this.pdfjsLib = null;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;
        
        try {
            // Load PDF.js from CDN
            if (typeof window !== 'undefined' && !window.pdfjsLib) {
                await this.loadPDFJS();
            }
            this.pdfjsLib = window.pdfjsLib;
            this.initialized = true;
        } catch (error) {
            console.error('Failed to initialize PDF.js:', error);
            throw new Error('PDF processing library failed to load');
        }
    }

    async loadPDFJS() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.onload = () => {
                // Set worker path
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
                    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                resolve();
            };
            script.onerror = () => reject(new Error('Failed to load PDF.js'));
            document.head.appendChild(script);
        });
    }

    async extractText(arrayBuffer, progressCallback = null) {
        await this.initialize();
        
        try {
            const pdf = await this.pdfjsLib.getDocument({
                data: arrayBuffer,
                verbosity: 0 // Suppress console warnings
            }).promise;

            const totalPages = pdf.numPages;
            let fullText = '';
            let metadata = {
                title: '',
                author: '',
                subject: '',
                totalPages: totalPages,
                extractedPages: 0
            };

            // Extract PDF metadata
            try {
                const pdfMetadata = await pdf.getMetadata();
                if (pdfMetadata.info) {
                    metadata.title = pdfMetadata.info.Title || '';
                    metadata.author = pdfMetadata.info.Author || '';
                    metadata.subject = pdfMetadata.info.Subject || '';
                }
            } catch (metaError) {
                console.warn('Could not extract PDF metadata:', metaError);
            }

            // Process pages in batches for better performance
            const BATCH_SIZE = 5;
            const pageTexts = new Array(totalPages);

            for (let batchStart = 0; batchStart < totalPages; batchStart += BATCH_SIZE) {
                const batchEnd = Math.min(batchStart + BATCH_SIZE, totalPages);
                const batchPromises = [];

                for (let pageNum = batchStart + 1; pageNum <= batchEnd; pageNum++) {
                    batchPromises.push(this.extractPageText(pdf, pageNum));
                }

                const batchResults = await Promise.all(batchPromises);
                
                // Store results in order
                batchResults.forEach((text, index) => {
                    pageTexts[batchStart + index] = text;
                    metadata.extractedPages++;
                });

                // Update progress
                if (progressCallback) {
                    progressCallback({
                        current: metadata.extractedPages,
                        total: totalPages,
                        phase: `Extracting text from page ${metadata.extractedPages}/${totalPages}...`
                    });
                }
            }

            // Combine all page texts
            fullText = pageTexts
                .filter(text => text && text.trim())
                .map((text, index) => `\n--- Page ${index + 1} ---\n${text.trim()}`)
                .join('\n\n');

            // Clean up the extracted text
            fullText = this.cleanExtractedText(fullText);

            if (!fullText.trim()) {
                throw new Error('No readable text found in PDF. The document may be image-based or encrypted.');
            }

            return {
                text: fullText,
                metadata: metadata,
                success: true
            };

        } catch (error) {
            console.error('PDF extraction error:', error);
            throw new Error(`PDF text extraction failed: ${error.message}`);
        }
    }

    async extractPageText(pdf, pageNumber) {
        try {
            const page = await pdf.getPage(pageNumber);
            const textContent = await page.getTextContent();
            
            // Extract text items and combine them
            let pageText = '';
            let lastY = null;
            
            textContent.items.forEach(item => {
                // Add line break if Y position changed significantly (new line)
                if (lastY !== null && Math.abs(lastY - item.transform[5]) > 5) {
                    pageText += '\n';
                }
                
                // Add space if there's a significant gap between text items
                if (pageText && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
                    const lastItem = textContent.items[textContent.items.indexOf(item) - 1];
                    if (lastItem && (item.transform[4] - (lastItem.transform[4] + lastItem.width)) > 10) {
                        pageText += ' ';
                    }
                }
                
                pageText += item.str;
                lastY = item.transform[5];
            });

            return pageText.trim();
        } catch (error) {
            console.warn(`Failed to extract text from page ${pageNumber}:`, error);
            return `[Error extracting page ${pageNumber}]`;
        }
    }

    cleanExtractedText(text) {
        return text
            // Remove excessive whitespace
            .replace(/\s+/g, ' ')
            // Fix common PDF extraction issues
            .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
            .replace(/(\w)(\d)/g, '$1 $2') // Add space between word and number
            .replace(/(\d)(\w)/g, '$1 $2') // Add space between number and word
            // Remove page headers/footers patterns
            .replace(/^[\s\d\-\|]+$/gm, '') // Remove lines with only numbers, spaces, dashes
            .replace(/^Page \d+ of \d+$/gim, '') // Remove "Page X of Y"
            // Clean up line breaks
            .replace(/\n\s*\n\s*\n/g, '\n\n') // Multiple line breaks to double
            .replace(/^\s+|\s+$/g, '') // Trim start and end
            .trim();
    }
}

class DocumentMemory {
    constructor() {
        this.documents = new Map();
        this.maxCacheSize = 50;
        this.maxDocumentSize = 50 * 1024 * 1024;
    }

    store(id, data, metadata = {}) {
        if (this.documents.size >= this.maxCacheSize) {
            const firstKey = this.documents.keys().next().value;
            this.documents.delete(firstKey);
        }
        this.documents.set(id, {
            content: data,
            metadata: { ...metadata, timestamp: Date.now(), size: new Blob([data]).size }
        });
        return id;
    }

    get(id) { return this.documents.get(id); }
    has(id) { return this.documents.has(id); }
    clear() { this.documents.clear(); }

    chunkContent(content, maxChunkSize = 15000) {
        if (!content || content.length <= maxChunkSize) return [content];
        
        const chunks = [];
        const overlap = 500;
        let start = 0;

        while (start < content.length) {
            let end = Math.min(start + maxChunkSize, content.length);
            if (end < content.length) {
                const boundary = ['\n\n', '. ', '\n'].map(b => content.lastIndexOf(b, end))
                    .find(b => b > start + maxChunkSize * 0.8);
                if (boundary) end = boundary + 1;
            }
            
            const chunk = content.slice(start, end).trim();
            if (chunk) chunks.push(chunk);
            start = Math.max(end - overlap, start + 1);
            
            if (chunks.length > 20) break; // Much smaller limit
        }
        return chunks.length ? chunks : [content];
    }

    getStats() {
        const totalSize = Array.from(this.documents.values())
            .reduce((sum, doc) => sum + (doc.metadata?.size || 0), 0);
        return {
            documentsCount: this.documents.size,
            totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2)
        };
    }
}

const DocumentProcessing = () => {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [processingMode, setProcessingMode] = useState('tutorial');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [parsedText, setParsedText] = useState('');
    const [documentProcessing, setDocumentProcessing] = useState(false);
    const [documentId, setDocumentId] = useState(null);
    const [processingProgress, setProcessingProgress] = useState({ current: 0, total: 0, phase: '' });
    const [error, setError] = useState(null);
    const [pdfMetadata, setPdfMetadata] = useState(null);

    const documentMemory = useRef(new DocumentMemory());
    const fileInputRef = useRef(null);
    const pdfProcessor = useRef(new PDFProcessor());

    const processingModes = [
        { id: 'tutorial', label: 'Tutorial Guide' },
        { id: 'self-help-guide', label: 'Self-Help Guide' },
        { id: 'summary', label: 'Executive Summary' },
        { id: 'article', label: 'Engaging Article' }
    ];

    const validateFile = (file) => {
        const allowedExt = ['txt', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'rtf'];
        const fileExt = file.name.split('.').pop().toLowerCase();
        
        if (!allowedExt.includes(fileExt)) throw new Error(`Unsupported file type: .${fileExt}`);
        if (file.size > documentMemory.current.maxDocumentSize) throw new Error('File too large (max 50MB)');
        if (file.size === 0) throw new Error('File is empty');
        return true;
    };

    const parseFile = async (file) => {
        return new Promise(async (resolve, reject) => {
            const extension = file.name.split('.').pop().toLowerCase();
            const reader = new FileReader();
            
            const timeout = setTimeout(() => {
                reader.abort();
                reject(new Error('File reading timeout'));
            }, 60000); // Increased timeout for PDF processing

            try {
                let text = '';
                let metadata = null;

                if (extension === 'pdf') {
                    // Use enhanced PDF processing
                    setProcessingProgress({ current: 10, total: 100, phase: 'Initializing PDF processor...' });
                    
                    const arrayBuffer = await file.arrayBuffer();
                    const result = await pdfProcessor.current.extractText(arrayBuffer, (progress) => {
                        setProcessingProgress({
                            current: 20 + (progress.current / progress.total) * 60,
                            total: 100,
                            phase: progress.phase
                        });
                    });
                    
                    text = result.text;
                    metadata = result.metadata;
                    setPdfMetadata(metadata);
                    
                } else {
                    // Handle other file types with existing logic
                    reader.onload = async (e) => {
                        clearTimeout(timeout);
                        try {
                            const data = e.target.result;

                            switch (extension) {
                                case 'txt':
                                case 'rtf':
                                    text = typeof data === 'string' ? data : new TextDecoder().decode(data);
                                    break;
                                case 'doc':
                                case 'docx':
                                    const result = await mammoth.extractRawText({ arrayBuffer: data });
                                    text = result.value || '';
                                    break;
                                case 'xls':
                                case 'xlsx':
                                    text = parseExcelData(data);
                                    break;
                                case 'csv':
                                    text = parseCSVData(typeof data === 'string' ? data : new TextDecoder().decode(data));
                                    break;
                                default:
                                    throw new Error(`Unsupported format: ${extension}`);
                            }

                            resolve(text.trim() || 'No readable content found');
                        } catch (error) {
                            reject(new Error(`Failed to parse ${extension.toUpperCase()}: ${error.message}`));
                        }
                    };

                    reader.onerror = () => {
                        clearTimeout(timeout);
                        reject(new Error('Failed to read file'));
                    };
                    
                    ['txt', 'rtf', 'csv'].includes(extension) ? reader.readAsText(file, 'utf-8') : reader.readAsArrayBuffer(file);
                }

                if (extension === 'pdf') {
                    clearTimeout(timeout);
                    resolve(text.trim() || 'No readable content found');
                }

            } catch (error) {
                clearTimeout(timeout);
                reject(new Error(`Failed to parse ${extension.toUpperCase()}: ${error.message}`));
            }
        });
    };

    const parseExcelData = (data) => {
        try {
            const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
            return workbook.SheetNames.map(sheetName => {
                const worksheet = workbook.Sheets[sheetName];
                const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
                const content = sheetData.filter(row => row?.length).map((row, i) => `${i + 1}: ${row.join(' | ')}`).join('\n');
                return `=== ${sheetName} ===\n${content || '(No data)'}`;
            }).join('\n\n');
        } catch (error) {
            return `Excel parsing error: ${error.message}`;
        }
    };

    const parseCSVData = (data) => {
        try {
            const lines = data.split('\n').filter(line => line.trim());
            const content = lines.map((line, i) => `${i + 1}: ${line.split(',').join(' | ')}`).join('\n');
            return `=== CSV Data ===\n${content || '(Empty file)'}`;
        } catch (error) {
            return `CSV parsing error: ${error.message}`;
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);
        setUploadedFile(null);
        setParsedText('');
        setDocumentId(null);
        setResponse('');
        setPdfMetadata(null);

        try {
            validateFile(file);
            setUploadedFile(file);
            setDocumentProcessing(true);
            setProcessingProgress({ current: 10, total: 100, phase: 'Validating file...' });

            setProcessingProgress({ current: 30, total: 100, phase: 'Reading file content...' });
            const extractedText = await parseFile(file);
            
            setProcessingProgress({ current: 90, total: 100, phase: 'Processing content...' });

            if (!extractedText?.trim()) throw new Error('No content extracted from file');

            const fileId = `${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}-${Date.now()}`;
            documentMemory.current.store(fileId, extractedText, {
                fileName: file.name,
                fileType: file.name.split('.').pop(),
                fileSize: file.size,
                pdfMetadata: pdfMetadata
            });

            setDocumentId(fileId);
            setParsedText(extractedText);
            setProcessingProgress({ current: 100, total: 100, phase: 'Complete!' });

        } catch (error) {
            setError(error.message);
            setParsedText('');
            setUploadedFile(null);
            setDocumentId(null);
            setPdfMetadata(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        } finally {
            setDocumentProcessing(false);
            setTimeout(() => setProcessingProgress({ current: 0, total: 0, phase: '' }), 2000);
        }
    };

    const preparePrompt = (content, mode, userInstructions) => {
        const modeInstructions = {
            'tutorial': 'Transform into a comprehensive, step-by-step tutorial with clear explanations and actionable advice.',
            'self-help-guide': 'Rewrite as an empowering self-help guide with actionable advice and motivational language.',
            'summary': 'Create a concise but comprehensive summary capturing all key points and main ideas.',
            'article': 'Transform into a well-structured, engaging article with compelling introduction and strong conclusion.'
        };

        return `${modeInstructions[mode]}

Original content: ${content}

${userInstructions?.trim() ? `Additional requirements: ${userInstructions}` : ''}

Write this to be 100% unique and humanized with natural language patterns, varied sentence structures, and conversational tone. Use appropriate headings and clear organization.`;
    };

    // OPTIMIZED: Smart processing - no chunking for small content
    const processDocument = async () => {
        if (!documentId || !documentMemory.current.has(documentId)) {
            setResponse('Please upload a document first.');
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const documentData = documentMemory.current.get(documentId);
            const content = documentData.content;
            
            // For small content (< 10,000 chars), process directly without chunking
            if (content.length < 10000) {
                setProcessingProgress({ current: 1, total: 1, phase: 'Processing document...' });
                
                const prompt = preparePrompt(content, processingMode, input);
                
                const response = await axios.post(
                    `${apiUrlA}/rewrite`, 
                    { 
                        input: prompt,
                        action: "Write a humanized, 100% unique content that is undetectable by AI" 
                    }, 
                    { 
                        headers: { 'Content-Type': 'application/json' },
                        timeout: 30000 
                    }
                );

                setResponse(response.data?.modifiedText || 'No content generated');
                setProcessingProgress({ current: 1, total: 1, phase: 'Complete!' });
                
            } else {
                // Only chunk for large content
                const chunks = documentMemory.current.chunkContent(content);
                setProcessingProgress({ current: 0, total: chunks.length, phase: 'Processing large document...' });

                const BATCH_SIZE = 5; // Increased batch size
                const results = [];
                
                for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
                    const batch = chunks.slice(i, i + BATCH_SIZE);
                    setProcessingProgress({ 
                        current: i, 
                        total: chunks.length, 
                        phase: `Processing batch ${Math.floor(i/BATCH_SIZE) + 1}...` 
                    });

                    const batchPromises = batch.map(async (chunk, batchIndex) => {
                        const chunkPrompt = preparePrompt(
                            chunk, 
                            processingMode, 
                            `${input} (Part ${i + batchIndex + 1}/${chunks.length})`
                        );

                        try {
                            const response = await axios.post(
                                `${apiUrlA}/rewrite`, 
                                { 
                                    input: chunkPrompt,
                                    action: "Write a humanized, 100% unique content that is undetectable by AI" 
                                }, 
                                { 
                                    headers: { 'Content-Type': 'application/json' },
                                    timeout: 30000 
                                }
                            );

                            return {
                                index: i + batchIndex,
                                content: response.data?.modifiedText || '[No content generated]'
                            };
                        } catch (error) {
                            return {
                                index: i + batchIndex,
                                content: `[Error processing section: ${error.message}]`
                            };
                        }
                    });

                    const batchResults = await Promise.all(batchPromises);
                    results.push(...batchResults);
                    
                    // No delay for faster processing
                }

                const sortedResults = results.sort((a, b) => a.index - b.index);
                const combinedResponse = sortedResults.map(r => `\n\n=== Section ${r.index + 1} ===\n${r.content}`).join('');

                setResponse(combinedResponse.trim());
                setProcessingProgress({ current: chunks.length, total: chunks.length, phase: 'Complete!' });
            }

        } catch (error) {
            setError(`Processing failed: ${error.message}`);
            setResponse('');
        } finally {
            setLoading(false);
            setInput('');
            setTimeout(() => setProcessingProgress({ current: 0, total: 0, phase: '' }), 2000);
        }
    };

    const clearMemory = () => {
        documentMemory.current.clear();
        setUploadedFile(null);
        setParsedText('');
        setDocumentId(null);
        setResponse('');
        setError(null);
        setPdfMetadata(null);
        setProcessingProgress({ current: 0, total: 0, phase: '' });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const stats = documentMemory.current.getStats();
    const chunks = parsedText ? documentMemory.current.chunkContent(parsedText) : [];

    return (
        <div className="flex flex-col flex-1 bg-white p-4 rounded-lg lg:h-screen sm:h-auto overflow-y-auto">
            <div className="mb-4 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg border border-emerald-300">
                <h2 className="text-xl font-semibold text-black mb-2">🤖 AI Document Processor</h2>
                <p className="text-sm text-gray-900">
                    Upload any document (up to 50MB) with <strong>enhanced PDF text extraction</strong>. 
                    I'll intelligently chunk large files, read and understand the content, then rewrite it in active voice as an engaging narrator. 
                    Perfect for creating tutorials, guides, summaries, and articles from your documents.
                </p>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-start">
                        <span className="text-red-500 mr-2 mt-0.5">❌</span>
                        <div>
                            <h4 className="text-red-800 font-medium mb-1">Upload Error</h4>
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {stats.documentsCount > 0 && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200 flex justify-between items-center">
                    <span className="text-sm text-green-700">
                        📁 {stats.documentsCount} documents ({stats.totalSizeMB}MB) in memory
                    </span>
                    <button onClick={clearMemory} className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200">
                        Clear All
                    </button>
                </div>
            )}

            <div className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.rtf,.xls,.xlsx,.csv"
                    onChange={handleFileUpload}
                    disabled={documentProcessing}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                />
                <div className="mt-2 text-xs text-gray-500">
                    Supported: PDF (Enhanced), DOC, DOCX, TXT, RTF, XLS, XLSX, CSV (Max: 50MB)
                </div>
                {uploadedFile && !error && (
                    <div className="mt-2 flex items-center text-sm text-green-600">
                        <span className="mr-2">✅</span>
                        {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
                        {pdfMetadata && (
                            <div className="ml-4 text-xs text-blue-600">
                                📄 {pdfMetadata.totalPages} pages • {pdfMetadata.extractedPages} extracted
                                {pdfMetadata.title && ` • "${pdfMetadata.title}"`}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {(documentProcessing || (loading && processingProgress.total > 0)) && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        <span className="text-sm font-medium text-blue-700">{processingProgress.phase}</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                        <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ 
                                width: `${processingProgress.total > 0 
                                    ? (processingProgress.current / processingProgress.total) * 100 
                                    : 0}%` 
                            }}
                        />
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                        {processingProgress.total > 0 && 
                            `${Math.round(processingProgress.current)}/${processingProgress.total} ${
                                loading ? 'chunks processed' : 'steps completed'
                            }`
                        }
                    </div>
                </div>
            )}

            {parsedText && documentId && !error && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">Processing Mode</label>
                            <select
                                value={processingMode}
                                onChange={(e) => setProcessingMode(e.target.value)}
                                className="w-full p-2.5 bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500"
                            >
                                {processingModes.map(mode => (
                                    <option key={mode.id} value={mode.id}>{mode.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">Output Style</label>
                            <div className="bg-green-100 p-2.5 rounded-lg text-sm text-green-700 flex items-center">
                                <span className="mr-2">🎯</span>
                                Active Voice + Humanized Content
                            </div>
                        </div>
                    </div>

                    <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-medium text-gray-700">📄 Document Preview</h4>
                            <div className="text-xs text-gray-500">
                                {parsedText.length < 10000 ? 'Single API call' : `${chunks.length} chunks (batch processing)`}
                                {pdfMetadata && <span className="ml-2 text-blue-600">PDF Enhanced ✨</span>}
                            </div>
                        </div>
                        <div className="text-xs text-gray-600 max-h-32 overflow-y-auto bg-white p-2 rounded border">
                            {parsedText.length > 500 ? `${parsedText.substring(0, 500)}...` : parsedText}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                            📊 {parsedText.length.toLocaleString()} characters extracted
                            {pdfMetadata && (
                                <span className="ml-4 text-blue-600">
                                    📄 PDF: {pdfMetadata.extractedPages}/{pdfMetadata.totalPages} pages processed
                                </span>
                            )}
                        </div>
                    </div>

                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Additional instructions for AI processing (optional)"
                        className="w-full p-3 bg-gray-200 rounded-lg border-none resize-none outline-none mb-4"
                        rows={2}
                    />

                    <button
                        onClick={processDocument}
                        disabled={loading}
                        className="w-full p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-green-500 hover:to-green-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                {parsedText.length < 10000 ? 'Processing (single call)...' : `Processing ${chunks.length} chunks...`}
                            </span>
                        ) : (
                            `🚀 Process as ${processingMode.replace('-', ' ').toUpperCase()}`
                        )}
                    </button>
                </>
            )}

            {response && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">✨ Processed Content</h3>
                    <div className="text-gray-900 leading-relaxed">
                        {parseResponse(response)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentProcessing;


