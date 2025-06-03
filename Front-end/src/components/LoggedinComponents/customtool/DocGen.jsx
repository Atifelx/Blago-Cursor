// import React, { useState, useRef, useCallback } from 'react';
// import * as mammoth from 'mammoth';
// import { FileText, Upload, Trash2, Settings, Eye, EyeOff, BarChart3 } from 'lucide-react';

// // Enhanced Memory Management System
// class DocumentMemory {
//   constructor() {
//     this.documents = new Map();
//     this.cache = new Map();
//     this.maxCacheSize = 50;
//     this.maxDocumentSize = 30 * 1024 * 1024; // 30MB
//   }

//   store(id, data, metadata = {}) {
//     // Clean up old documents if cache is full
//     if (this.cache.size >= this.maxCacheSize) {
//       const firstKey = this.cache.keys().next().value;
//       this.cache.delete(firstKey);
//       this.documents.delete(firstKey);
//     }

//     const documentData = {
//       content: data,
//       metadata: {
//         ...metadata,
//         timestamp: Date.now(),
//         size: new Blob([data]).size
//       }
//     };

//     this.documents.set(id, documentData);
//     this.cache.set(id, true);
//     return id;
//   }

//   get(id) {
//     return this.documents.get(id);
//   }

//   has(id) {
//     return this.documents.has(id);
//   }

//   remove(id) {
//     this.documents.delete(id);
//     this.cache.delete(id);
//   }

//   clear() {
//     this.documents.clear();
//     this.cache.clear();
//   }

//   getStats() {
//     let totalSize = 0;
//     this.documents.forEach(doc => {
//       totalSize += doc.metadata.size || 0;
//     });

//     return {
//       documentsCount: this.documents.size,
//       totalSize: totalSize,
//       totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2)
//     };
//   }

//   chunkContent(content, maxChunkSize = 8000) {
//     if (content.length <= maxChunkSize) {
//       return [content];
//     }

//     const chunks = [];
//     let start = 0;

//     while (start < content.length) {
//       let end = start + maxChunkSize;
      
//       if (end < content.length) {
//         // Try to break at natural boundaries
//         const lastPeriod = content.lastIndexOf('.', end);
//         const lastNewline = content.lastIndexOf('\n', end);
//         const lastSpace = content.lastIndexOf(' ', end);
        
//         const breakPoint = Math.max(lastPeriod, lastNewline, lastSpace);
//         if (breakPoint > start) {
//           end = breakPoint + 1;
//         }
//       }

//       chunks.push(content.slice(start, end).trim());
//       start = end;
//     }

//     return chunks.filter(chunk => chunk.length > 0);
//   }
// }

// const DocumentProcessor = ({
//   onResponse = () => {},
//   onError = () => {},
//   className = '',
//   showPreview = true,
//   showMemoryStats = true
// }) => {
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [parsedText, setParsedText] = useState('');
//   const [processingMode, setProcessingMode] = useState('summary');
//   const [documentProcessing, setDocumentProcessing] = useState(false);
//   const [documentId, setDocumentId] = useState(null);
//   const [documentStats, setDocumentStats] = useState(null);
//   const [processingProgress, setProcessingProgress] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [additionalInstructions, setAdditionalInstructions] = useState('');
//   const [processedResult, setProcessedResult] = useState('');
//   const [showPreviewContent, setShowPreviewContent] = useState(false);
//   const [error, setError] = useState('');

//   const documentMemory = useRef(new DocumentMemory());
//   const fileInputRef = useRef(null);

//   const processingModes = [
//     { id: 'summary', label: '📄 Condensed Summary', description: 'Extract key points and main ideas' },
//     { id: 'rewrite', label: '📝 Rewrite Content', description: 'Rewrite with improved clarity and flow' },
//     { id: 'analysis', label: '🔍 Content Analysis', description: 'Analyze structure and themes' },
//     { id: 'keywords', label: '🏷️ Extract Keywords', description: 'Identify key terms and concepts' }
//   ];

//   // Enhanced AI processing simulation
//   const processWithAI = useCallback(async (text, mode, instructions = '') => {
//     // Simulate realistic API delay
//     await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

//     const basePrompt = instructions ? `Additional instructions: ${instructions}\n\n` : '';
    
//     switch (mode) {
//       case 'summary':
//         const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
//         const keyPoints = sentences.slice(0, Math.min(7, sentences.length));
//         return `## Document Summary

// ### Key Points:
// ${keyPoints.map((point, i) => `${i + 1}. ${point.trim().replace(/^\s*[-•]\s*/, '')}.`).join('\n')}

// ### Overview:
// This document contains ${sentences.length} main statements covering various topics. The content has been condensed to highlight the most important information and key takeaways.

// **Word Count:** Original: ${text.split(' ').length} words → Summary: ${keyPoints.join(' ').split(' ').length} words`;

//       case 'rewrite':
//         return `## Rewritten Content

// ### Enhanced Version:
// The original content has been processed and rewritten to improve readability, flow, and clarity while maintaining all essential information and meaning.

// ### Key Improvements:
// - Enhanced readability and natural flow
// - Improved sentence structure and transitions  
// - Maintained original meaning and context
// - Professional tone and clarity
// - Optimized for better comprehension

// ### Content Preview:
// ${text.substring(0, 800).split(' ').slice(0, -1).join(' ')}${text.length > 800 ? '...' : ''}

// *Note: This is a preview of the rewritten content. The full rewritten version would maintain all original information while improving clarity and engagement.*`;

//       case 'analysis':
//         const wordCount = text.split(' ').length;
//         const avgSentenceLength = text.split(/[.!?]+/).length > 0 ? 
//           Math.round(wordCount / text.split(/[.!?]+/).length) : 0;
        
//         return `## Content Analysis

// ### Document Statistics:
// - **Total Words:** ${wordCount.toLocaleString()}
// - **Characters:** ${text.length.toLocaleString()}
// - **Estimated Reading Time:** ${Math.ceil(wordCount / 200)} minutes
// - **Average Sentence Length:** ${avgSentenceLength} words

// ### Content Structure:
// - **Paragraphs:** ${text.split('\n\n').length}
// - **Sentences:** ${text.split(/[.!?]+/).length}
// - **Complexity Level:** ${wordCount > 1000 ? 'High' : wordCount > 500 ? 'Medium' : 'Low'}

// ### Key Themes Identified:
// ${text.split(' ').slice(0, 50).join(' ').match(/\b[A-Z][a-z]+\b/g)?.slice(0, 5).map((theme, i) => `${i + 1}. ${theme}`).join('\n') || 'No clear themes identified'}

// ### Content Quality Assessment:
// The document appears to be ${wordCount > 2000 ? 'comprehensive and detailed' : wordCount > 500 ? 'moderately detailed' : 'concise'} with ${avgSentenceLength > 20 ? 'complex' : avgSentenceLength > 15 ? 'moderate' : 'simple'} sentence structure.`;

//       case 'keywords':
//         const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
//         const wordFreq = {};
//         words.forEach(word => {
//           if (!['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'had', 'with', 'have', 'this', 'will', 'his', 'they', 'from', 'been', 'that', 'said', 'each', 'which', 'what', 'were', 'when', 'would', 'them', 'some', 'like', 'into', 'him', 'has', 'more', 'could', 'than', 'only', 'other', 'time', 'very', 'their', 'after', 'first', 'well', 'also', 'back', 'these', 'being', 'now', 'made', 'before', 'here', 'how', 'should', 'where', 'see', 'through', 'way', 'much', 'then', 'both', 'most', 'over', 'such', 'take', 'come', 'does', 'many', 'own', 'too', 'any', 'may', 'say', 'same', 'those', 'use', 'work', 'just', 'think'].includes(word)) {
//             wordFreq[word] = (wordFreq[word] || 0) + 1;
//           }
//         });
        
//         const sortedKeywords = Object.entries(wordFreq)
//           .sort(([,a], [,b]) => b - a)
//           .slice(0, 15);

//         return `## Keyword Analysis

// ### Most Frequent Keywords:
// ${sortedKeywords.map(([word, freq], i) => `${i + 1}. **${word}** (${freq} occurrences)`).join('\n')}

// ### Keyword Density:
// - **Total Unique Keywords:** ${Object.keys(wordFreq).length}
// - **Total Word Count:** ${words.length}
// - **Keyword Diversity:** ${(Object.keys(wordFreq).length / words.length * 100).toFixed(1)}%

// ### Content Focus Areas:
// The document primarily focuses on topics related to: ${sortedKeywords.slice(0, 5).map(([word]) => word).join(', ')}.

// ### SEO Keywords Identified:
// ${sortedKeywords.slice(0, 10).map(([word]) => `#${word}`).join(', ')}`;

//       default:
//         return `## Processed Content\n\nContent has been processed successfully. Please select a specific processing mode for detailed results.`;
//     }
//   }, []);

//   // Enhanced text extraction functions
//   const extractTextFromPDF = useCallback((arrayBuffer) => {
//     return new Promise((resolve, reject) => {
//       try {
//         const uint8Array = new Uint8Array(arrayBuffer);
//         const pdfString = String.fromCharCode.apply(null, uint8Array);
        
//         // Multiple extraction strategies
//         const strategies = [
//           // Stream content extraction
//           () => {
//             const streamRegex = /stream\s*(.*?)\s*endstream/gs;
//             const matches = pdfString.match(streamRegex);
//             if (matches) {
//               return matches.map(match => {
//                 const content = match.replace(/^stream\s*/, '').replace(/\s*endstream$/, '');
//                 return content.replace(/[^\x20-\x7E\n\r\t]/g, ' ').trim();
//               }).filter(content => content.length > 10).join('\n');
//             }
//             return '';
//           },
          
//           // Text object extraction
//           () => {
//             const textRegex = /BT\s*(.*?)\s*ET/gs;
//             const matches = pdfString.match(textRegex);
//             if (matches) {
//               return matches.map(match => {
//                 const tjRegex = /\[(.*?)\]\s*TJ/g;
//                 const tjMatches = match.match(tjRegex);
//                 if (tjMatches) {
//                   return tjMatches.map(tj => {
//                     const textContent = tj.match(/\[(.*?)\]/);
//                     return textContent ? textContent[1].replace(/[()]/g, '') : '';
//                   }).join(' ');
//                 }
//                 return '';
//               }).filter(content => content.length > 0).join('\n');
//             }
//             return '';
//           },
          
//           // Parentheses content extraction
//           () => {
//             const parenRegex = /\(([^)]+)\)/g;
//             const matches = pdfString.match(parenRegex);
//             if (matches) {
//               return matches.map(match => match.slice(1, -1)).join(' ');
//             }
//             return '';
//           }
//         ];

//         let extractedText = '';
//         for (const strategy of strategies) {
//           const result = strategy();
//           if (result && result.trim().length > 100) {
//             extractedText = result;
//             break;
//           }
//         }

//         if (!extractedText || extractedText.trim().length < 50) {
//           resolve('Unable to extract readable text from this PDF. The file might be image-based, encrypted, or use complex formatting. Please try converting it to a text format first.');
//         } else {
//           const cleanedText = extractedText
//             .replace(/\s+/g, ' ')
//             .replace(/(.)\1{3,}/g, '$1')
//             .trim();
//           resolve(cleanedText);
//         }
//       } catch (error) {
//         reject(new Error(`PDF parsing failed: ${error.message}`));
//       }
//     });
//   }, []);

//   const parseTextFile = useCallback((file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = (e) => resolve(e.target.result);
//       reader.onerror = () => reject(new Error('Failed to read text file'));
//       reader.readAsText(file, 'utf-8');
//     });
//   }, []);

//   const parseWordFile = useCallback((file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = async (e) => {
//         try {
//           const arrayBuffer = e.target.result;
//           const result = await mammoth.extractRawText({ arrayBuffer });
//           resolve(result.value || 'No text content found in Word document.');
//         } catch (error) {
//           reject(new Error(`Word document parsing failed: ${error.message}`));
//         }
//       };
//       reader.onerror = () => reject(new Error('Failed to read Word document'));
//       reader.readAsArrayBuffer(file);
//     });
//   }, []);

//   const parseCSVFile = useCallback((file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         try {
//           const csvData = e.target.result;
//           const lines = csvData.split('\n').filter(line => line.trim());
          
//           if (lines.length === 0) {
//             resolve('No data found in CSV file.');
//             return;
//           }

//           let formattedText = '=== CSV Data Analysis ===\n\n';
          
//           // Assume first row is headers
//           if (lines.length > 0) {
//             const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
//             formattedText += `Headers: ${headers.join(' | ')}\n\n`;
            
//             formattedText += `Data Rows (${lines.length - 1} total):\n`;
//             lines.slice(1, Math.min(6, lines.length)).forEach((line, index) => {
//               const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
//               formattedText += `Row ${index + 1}: ${values.join(' | ')}\n`;
//             });
            
//             if (lines.length > 6) {
//               formattedText += `... and ${lines.length - 6} more rows\n`;
//             }
//           }
          
//           resolve(formattedText.trim());
//         } catch (error) {
//           reject(new Error(`CSV parsing failed: ${error.message}`));
//         }
//       };
//       reader.onerror = () => reject(new Error('Failed to read CSV file'));
//       reader.readAsText(file, 'utf-8');
//     });
//   }, []);

//   const handleFileUpload = useCallback(async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Reset previous states
//     setError('');
//     setProcessedResult('');

//     if (file.size > documentMemory.current.maxDocumentSize) {
//       const errorMsg = `File too large. Maximum size is ${documentMemory.current.maxDocumentSize / (1024 * 1024)}MB`;
//       setError(errorMsg);
//       onError(errorMsg);
//       return;
//     }

//     setUploadedFile(file);
//     setDocumentProcessing(true);
//     setParsedText('');
//     setProcessingProgress(0);

//     try {
//       let extractedText = '';
//       const fileExtension = file.name.split('.').pop().toLowerCase();
//       const fileId = `${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}-${Date.now()}`;

//       setProcessingProgress(25);

//       switch (fileExtension) {
//         case 'txt':
//         case 'rtf':
//           extractedText = await parseTextFile(file);
//           break;
//         case 'doc':
//         case 'docx':
//           extractedText = await parseWordFile(file);
//           break;
//         case 'pdf':
//           const arrayBuffer = await file.arrayBuffer();
//           extractedText = await extractTextFromPDF(arrayBuffer);
//           break;
//         case 'csv':
//           extractedText = await parseCSVFile(file);
//           break;
//         default:
//           throw new Error(`Unsupported file format: ${fileExtension}. Supported formats: PDF, DOC, DOCX, TXT, RTF, CSV`);
//       }

//       setProcessingProgress(75);

//       if (extractedText.trim()) {
//         const storedId = documentMemory.current.store(fileId, extractedText, {
//           fileName: file.name,
//           fileType: fileExtension,
//           fileSize: file.size,
//           uploadTime: new Date().toISOString()
//         });

//         setDocumentId(storedId);
//         setParsedText(extractedText);
//         setDocumentStats(documentMemory.current.getStats());
//         setProcessingProgress(100);
//       } else {
//         throw new Error('No text content found in the file.');
//       }
//     } catch (error) {
//       console.error('Error parsing document:', error);
//       const errorMsg = error.message;
//       setError(errorMsg);
//       setParsedText('');
//       setDocumentId(null);
//       onError(errorMsg);
//     } finally {
//       setDocumentProcessing(false);
//       setTimeout(() => setProcessingProgress(0), 2000);
//     }
//   }, [extractTextFromPDF, parseTextFile, parseWordFile, parseCSVFile, onError]);

//   const clearDocumentMemory = useCallback(() => {
//     documentMemory.current.clear();
//     setUploadedFile(null);
//     setParsedText('');
//     setDocumentId(null);
//     setDocumentStats(null);
//     setAdditionalInstructions('');
//     setProcessedResult('');
//     setError('');
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   }, []);

//   const processDocument = useCallback(async () => {
//     if (!documentId || !documentMemory.current.has(documentId)) {
//       const errorMsg = 'Please upload a document first.';
//       setError(errorMsg);
//       onError(errorMsg);
//       return;
//     }

//     if (error || !parsedText) {
//       const errorMsg = 'Cannot process document due to parsing errors. Please upload a different file.';
//       setError(errorMsg);
//       onError(errorMsg);
//       return;
//     }

//     setLoading(true);
//     setProcessedResult('');
//     setError('');

//     try {
//       const documentData = documentMemory.current.get(documentId);
//       if (!documentData || !documentData.content) {
//         throw new Error('Document data not found in memory');
//       }

//       const chunks = documentMemory.current.chunkContent(documentData.content);
      
//       if (chunks.length === 1) {
//         const result = await processWithAI(chunks[0], processingMode, additionalInstructions);
//         setProcessedResult(result);
//         onResponse(result);
//       } else {
//         let combinedResponse = '';
        
//         for (let i = 0; i < chunks.length; i++) {
//           setProcessingProgress(Math.floor(((i + 1) / chunks.length) * 100));
//           const result = await processWithAI(chunks[i], processingMode, additionalInstructions);
//           combinedResponse += `\n\n=== Part ${i + 1} of ${chunks.length} ===\n${result}`;
//         }
        
//         setProcessedResult(combinedResponse.trim());
//         onResponse(combinedResponse.trim());
//       }
//     } catch (error) {
//       console.error('Error processing document:', error);
//       const errorMsg = `Processing failed: ${error.message}`;
//       setError(errorMsg);
//       setProcessedResult('');
//       onError(errorMsg);
//     } finally {
//       setLoading(false);
//       setProcessingProgress(0);
//     }
//   }, [documentId, error, parsedText, processingMode, additionalInstructions, processWithAI, onError, onResponse]);

//   const selectedMode = processingModes.find(mode => mode.id === processingMode);

//   return (
//     <div className={`max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg ${className}`}>
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
//           <FileText className="w-6 h-6 text-blue-600" />
//           Advanced Document Processor
//         </h2>
//         <p className="text-gray-600">Upload and process documents with AI-powered analysis and transformation</p>
//       </div>

//       {/* Memory Stats */}
//       {showMemoryStats && documentStats && (
//         <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center gap-3">
//               <BarChart3 className="w-4 h-4 text-blue-600" />
//               <div className="text-sm">
//                 <span className="font-medium text-blue-800">Memory Usage:</span>
//                 <span className="text-blue-700 ml-2">
//                   {documentStats.documentsCount} document{documentStats.documentsCount !== 1 ? 's' : ''}, {documentStats.totalSizeMB}MB
//                 </span>
//               </div>
//             </div>
//             <button
//               onClick={clearDocumentMemory}
//               className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200 transition-colors"
//             >
//               <Trash2 className="w-3 h-3" />
//               Clear Memory
//             </button>
//           </div>
//         </div>
//       )}

//       {/* File Upload */}
//       <div className="mb-6">
//         <div className="relative">
//           <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
//             <div className="text-center">
//               <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
//               <label htmlFor="file-upload" className="block">
//                 <span className="text-lg font-medium text-gray-700 cursor-pointer hover:text-blue-600">
//                   Choose Document
//                 </span>
//                 <p className="text-sm text-gray-500 mt-1">
//                   PDF, Word, Text, or CSV files (max {documentMemory.current.maxDocumentSize / (1024 * 1024)}MB)
//                 </p>
//               </label>
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 id="file-upload"
//                 accept=".pdf,.doc,.docx,.txt,.rtf,.csv"
//                 onChange={handleFileUpload}
//                 className="hidden"
//               />
//             </div>
//           </div>
//         </div>

//         {uploadedFile && (
//           <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-green-800">
//                   ✓ {uploadedFile.name}
//                 </p>
//                 <p className="text-xs text-green-600">
//                   {(uploadedFile.size / 1024).toFixed(1)} KB • {uploadedFile.type || 'Unknown type'}
//                 </p>
//               </div>
//               {documentProcessing && (
//                 <div className="flex items-center gap-2">
//                   <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent"></div>
//                   <span className="text-sm text-green-700">Processing...</span>
//                 </div>
//               )}
//             </div>
            
//             {processingProgress > 0 && processingProgress < 100 && (
//               <div className="mt-2">
//                 <div className="w-full bg-green-200 rounded-full h-2">
//                   <div
//                     className="bg-green-600 h-2 rounded-full transition-all duration-300"
//                     style={{ width: `${processingProgress}%` }}
//                   ></div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Error Display */}
//       {error && (
//         <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
//           <div className="flex items-start gap-3">
//             <div className="text-red-500 mt-0.5">⚠️</div>
//             <div>
//               <p className="font-medium text-red-800">Processing Error</p>
//               <p className="text-sm text-red-700 mt-1">{error}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Processing Configuration */}
//       {parsedText && documentId && !error && (
//         <div className="mb-6 space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 <Settings className="w-4 h-4 inline mr-1" />
//                 Processing Mode
//               </label>
//               <select
//                 value={processingMode}
//                 onChange={(e) => setProcessingMode(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 {processingModes.map((mode) => (
//                   <option key={mode.id} value={mode.id}>
//                     {mode.label}
//                   </option>
//                 ))}
//               </select>
//               {selectedMode && (
//                 <p className="text-xs text-gray-500 mt-1">{selectedMode.description}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Output Quality
//               </label>
//               <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                   <span className="text-sm font-medium text-green-800">AI-Powered Processing</span>
//                 </div>
//                 <p className="text-xs text-green-600 mt-1">High-quality, contextual analysis</p>
//               </div>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Additional Instructions (Optional)
//             </label>
//             <textarea
//               value={additionalInstructions}
//               onChange={(e) => setAdditionalInstructions(e.target.value)}
//               placeholder="Add specific instructions for processing (e.g., focus on technical aspects, include citations, maintain formal tone...)"
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//               rows={3}
//             />
//           </div>
//         </div>
//       )}

//       {/* Document Preview */}
//       {showPreview && parsedText && documentId && !error && (
//         <div className="mb-6">
//           <div className="border border-gray-200 rounded-lg overflow-hidden">
//             <div className="flex justify-between items-center p-3 bg-gray-50 border-b border-gray-200">
//               <h4 className="font-medium text-gray-700 flex items-center gap-2">
//                 <FileText className="w-4 h-4" />
//                 Document Preview
//               </h4>
//               <div className="flex items-center gap-2">
//                 <span className="text-xs text-gray-500">
//                   {parsedText.length.toLocaleString()} chars
//                 </span>
//                 <button
//                   onClick={() => setShowPreviewContent(!showPreviewContent)}
//                   className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 flex items-center gap-1"
//                 >
//                   {showPreviewContent ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
//                   {showPreviewContent ? 'Hide' : 'Show'}
//                 </button>
//               </div>
//             </div>
            
//             {showPreviewContent && (
//               <div className="p-3 bg-white">
//                 <div className="text-sm text-gray-600 max-h-40 overflow-y-auto font-mono bg-gray-50 p-3 rounded border">
//                   {parsedText.length > 1000
//                     ? `${parsedText.substring(0, 1000)}...`
//                     : parsedText
//                   }
//                 </div>
//                 <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
//                   <span>
//                     Word count: {parsedText.split(' ').length.toLocaleString()}
//                   </span>
//                   <span>
//                     {documentMemory.current.chunkContent(parsedText).length > 1
//                       ? `Will process in ${documentMemory.current.chunkContent(parsedText).length} chunks`
//                       : 'Single chunk processing'
//                     }
//                   </span>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Process Button */}
//       <div className="mb-6">
//         <button
//           onClick={processDocument}
//           disabled={loading || !parsedText || !documentId || error}
//           className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
//         >
//           {loading ? (
//             <>
//               <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
//               Processing Document...
//             </>
//           ) : (
//             <>
//               <Settings className="w-4 h-4" />
//               Process as {selectedMode?.label.replace(/^\S+\s/, '') || 'Summary'}
//             </>
//           )}
//         </button>
//       </div>

//       {/* Processing Status */}
//       {loading && (
//         <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
//           <div className="flex items-center justify-between mb-2">
//             <div className="flex items-center gap-2">
//               <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
//               <span className="text-sm font-medium text-blue-800">
//                 Processing your document...
//               </span>
//             </div>
//             {processingProgress > 0 && (
//               <span className="text-xs text-blue-600">{processingProgress}%</span>
//             )}
//           </div>
          
//           <p className="text-xs text-blue-600 mb-2">
//             {documentMemory.current.chunkContent(parsedText).length > 1
//               ? `Processing ${documentMemory.current.chunkContent(parsedText).length} chunks for optimal results...`
//               : 'Analyzing content and generating results...'
//             }
//           </p>
          
//           {processingProgress > 0 && (
//             <div className="w-full bg-blue-200 rounded-full h-2">
//               <div
//                 className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                 style={{ width: `${processingProgress}%` }}
//               ></div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Results Display */}
//       {processedResult && (
//         <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
//           <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 border-b border-gray-200">
//             <div className="flex items-center justify-between">
//               <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                 <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                 Processing Complete
//               </h3>
//               <div className="text-xs text-gray-500">
//                 Mode: {selectedMode?.label.replace(/^\S+\s/, '')}
//               </div>
//             </div>
//           </div>
          
//           <div className="p-6 bg-white">
//             <div className="prose max-w-none">
//               <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
//                 {processedResult}
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-gray-50 p-3 border-t border-gray-200 flex justify-between items-center">
//             <div className="text-xs text-gray-500">
//               Generated: {new Date().toLocaleString()}
//             </div>
//             <div className="text-xs text-gray-500">
//               {processedResult.split(' ').length} words • {processedResult.length} characters
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Help Information */}
//       <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
//         <h4 className="font-medium text-gray-800 mb-2">Supported Features:</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
//           <div>
//             <p><strong>File Formats:</strong> PDF, DOC/DOCX, TXT, RTF, CSV</p>
//             <p><strong>Max File Size:</strong> {documentMemory.current.maxDocumentSize / (1024 * 1024)}MB</p>
//           </div>
//           <div>
//             <p><strong>Processing Modes:</strong> Summary, Rewrite, Analysis, Keywords</p>
//             <p><strong>Memory Management:</strong> Automatic cleanup and optimization</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DocumentProcessor;




import React, { useState, useRef } from 'react';
import axios from 'axios';
import * as mammoth from 'mammoth';
import * as XLSX from 'xlsx';
// import { parseResponse } from '../util/parseresponse'; // Adjust path as needed
import { parseResponse } from '../../../util/parseresponse';

const apiUrlA = import.meta.env.VITE_API_BASE_URL;

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

const DocumentProcessing = () => {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [processingMode, setProcessingMode] = useState('tutorial');
    
    // Document processing states with memory
    const [uploadedFile, setUploadedFile] = useState(null);
    const [parsedText, setParsedText] = useState('');
    const [documentProcessing, setDocumentProcessing] = useState(false);
    const [documentId, setDocumentId] = useState(null);
    const [documentStats, setDocumentStats] = useState(null);
    const [processingProgress, setProcessingProgress] = useState(0);

    // Memory system reference
    const documentMemory = useRef(new DocumentMemory());

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

    const handleProcessingModeChange = (e) => {
        setProcessingMode(e.target.value);
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

    // Main API call function for document processing
    const processDocument = async () => {
        setLoading(true);

        try {
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
        } catch (error) {
            console.error('Error processing document:', error);
            setResponse('Error processing document. Please try again.');
        } finally {
            setLoading(false);
            setInput('');
        }
    };

    return (
        <div className="flex flex-col flex-1 bg-white p-4 rounded-lg lg:h-screen sm:h-auto sm:w-auto overflow-x-auto overflow-y-auto">
            {/* Memory Stats Display */}
            {documentStats && (
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
                
                <textarea
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Enter additional instructions for document processing (optional)"
                    className='w-full p-2 bg-gray-200 rounded-xl font-normal from-neutral-700 border-none resize-none outline-none'
                    rows={1}
                    style={{ minHeight: '40px', overflow: 'hidden' }}
                    onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                />
                
                <button
                    onClick={processDocument}
                    disabled={loading || (!parsedText || !documentId)}
                    className="text-neutral-600 mt-3 w-full rounded-xl p-2 bg-gray-200 hover:text-neutral-900 hover:bg-gray-300 text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 
                        <span className="loading loading-dots loading-lg bg-slate-950"></span> : 
                        `Process Document as ${processingMode.replace('-', ' ')}`
                    }
                </button>

                {/* Processing Status */}
                {loading && documentId && (
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentProcessing;