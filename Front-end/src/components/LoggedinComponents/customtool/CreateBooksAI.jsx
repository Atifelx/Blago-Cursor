import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { loadData } from '../../../app/user/userDataSlice';
import axios from 'axios';
import { Copy, Check, BookOpen, FileText, Download, Edit3, Save, Trash2, Wand2, FileText as WordIcon } from 'lucide-react';
import { marked } from 'marked';

const CreateBooksAI = () => {
    // Form inputs
    const [topic, setTopic] = useState('');
    const [referenceUrl, setReferenceUrl] = useState('');
    const [discussionPoints, setDiscussionPoints] = useState('');
    const [conclusion, setConclusion] = useState('');
    const [wordCount, setWordCount] = useState(5000);
    const [pageCount, setPageCount] = useState(10);

    // Processing states
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState('');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');

    // Content states
    const [scrapedContent, setScrapedContent] = useState('');
    const [ebookOutline, setEbookOutline] = useState('');
    const [ebookChapters, setEbookChapters] = useState([]);
    const [currentChapter, setCurrentChapter] = useState(0);
    const [isGeneratingChapter, setIsGeneratingChapter] = useState(false);
    const [chapterProgress, setChapterProgress] = useState(0);

    // Redux state for storing ebook data
    const [ebookData, setEbookData] = useState({
        title: '',
        outline: '',
        chapters: [],
        metadata: {
            wordCount: 0,
            pageCount: 0,
            topic: '',
            referenceUrl: '',
            discussionPoints: '',
            conclusion: ''
        }
    });

    // UI states
    const [showOutline, setShowOutline] = useState(false);
    const [showChapters, setShowChapters] = useState(false);
    const [editingChapter, setEditingChapter] = useState(null);
    const [editedContent, setEditedContent] = useState('');
    const [selectedChapter, setSelectedChapter] = useState(0);
    const [showEbookView, setShowEbookView] = useState(false);
    
    // AI Rewrite states
    const [selectedText, setSelectedText] = useState('');
    const [isRewriting, setIsRewriting] = useState(false);
    const [rewritePosition, setRewritePosition] = useState({ start: 0, end: 0 });
    const [showRewriteTooltip, setShowRewriteTooltip] = useState(false);
    
    const contentRef = useRef(null);

    const dispatch = useDispatch();
    const apiUrlA = import.meta.env.VITE_API_BASE_URL;

    // Configure marked for better rendering
    marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: false,
        mangle: false
    });

    // Render markdown to HTML
    const renderMarkdown = (text) => {
        if (!text) return '';
        return marked(text);
    };

    // AI Rewrite functionality
    const handleTextSelection = () => {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        
        if (selectedText && selectedText.length > 0) {
            setSelectedText(selectedText);
            setShowRewriteTooltip(true);
            
            // Get selection position
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            setRewritePosition({
                start: range.startOffset,
                end: range.endOffset,
                top: rect.top,
                left: rect.left
            });
        } else {
            setShowRewriteTooltip(false);
        }
    };

    const handleAIRewrite = async () => {
        if (!selectedText) return;

        setIsRewriting(true);
        setShowRewriteTooltip(false);

        try {
            const prompt = `You are an advanced text rephraser with a knack for making things sound natural.
            1. For a single word, return a synonym or fix it if it's incorrect.
            2. Rewrite the text to sound like it was written by a real human. Use simpler, everyday vocabulary while keeping the original tone and writing style. Change the wording completely, but don't change the meaning. Make sure the result feels natural, clear, and 100% human-like.
            3. Additionally, apply a humanizer tool to make the text sound even more relatable and genuine.
            Under no circumstances should you ask any questions, seek clarification, or make any assumptions. You must **only return the corrected text** as a result—nothing more, nothing less. Keep it real and straightforward, no exceptions.
        
            Input: ${selectedText}`;

            const response = await axios.post(`${apiUrlA}/rewrite`, {
                input: prompt,
                action: "Rewrite text to sound more human and natural"
            }, {
                timeout: 30000,
                headers: { 'Content-Type': 'application/json' }
            });

            const rewrittenText = response.data.modifiedText || selectedText;
            
            // Replace the selected text in the current chapter
            if (editingChapter !== null) {
                const updatedContent = editedContent.replace(selectedText, rewrittenText);
                setEditedContent(updatedContent);
            } else {
                const updatedChapters = [...ebookChapters];
                updatedChapters[selectedChapter].content = updatedChapters[selectedChapter].content.replace(selectedText, rewrittenText);
                setEbookChapters(updatedChapters);
            }

            setSelectedText('');
        } catch (error) {
            console.error('AI Rewrite error:', error);
            setError(`AI rewrite failed: ${error.message}`);
        } finally {
            setIsRewriting(false);
        }
    };

    // Word count options
    const wordCountOptions = [
        { value: 2000, label: '2,000 words (~8 pages)' },
        { value: 5000, label: '5,000 words (~20 pages)' },
        { value: 10000, label: '10,000 words (~40 pages)' },
        { value: 15000, label: '15,000 words (~60 pages)' },
        { value: 20000, label: '20,000 words (~80 pages)' },
        { value: 25000, label: '25,000 words (~100 pages)' }
    ];

    // Validate URL
    const isValidUrl = (string) => {
        try {
            const urlObj = new URL(string);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch (error) {
            return false;
        }
    };

    // Normalize URL
    const normalizeUrl = (inputUrl) => {
        if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
            return 'https://' + inputUrl;
        }
        return inputUrl;
    };

    // Copy to clipboard function
    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    // Step 1: Scrape reference content
    const scrapeReferenceContent = async () => {
        if (!referenceUrl.trim()) {
            setError('Please enter a reference URL');
            return;
        }

        const normalizedUrl = normalizeUrl(referenceUrl.trim());
        if (!isValidUrl(normalizedUrl)) {
            setError('Please enter a valid URL');
            return;
        }

        setCurrentStep('Scraping reference content...');
        setProgress(10);

        try {
            const response = await axios.post(`${apiUrlA}/scraper/scrape`, {
                url: normalizedUrl
            }, {
                timeout: 60000,
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.data.success) {
                setScrapedContent(response.data.content);
                setProgress(20);
                setCurrentStep('Reference content scraped successfully');
                return true;
            } else {
                throw new Error('Failed to scrape content');
            }
        } catch (error) {
            setError(`Scraping failed: ${error.message}`);
            return false;
        }
    };

    // Step 2: Generate ebook outline
    const generateEbookOutline = async () => {
        setCurrentStep('Generating ebook outline...');
        setProgress(30);

        try {
            const outlinePrompt = `Create a comprehensive ebook outline for the topic: "${topic}"

Reference Content: ${scrapedContent.substring(0, 2000)}...

Discussion Points to Cover: ${discussionPoints}

Conclusion Focus: ${conclusion}

Target Word Count: ${wordCount} words (approximately ${pageCount} pages)

Requirements:
- Create a detailed chapter-by-chapter outline
- Each chapter should have 3-5 main sections
- Include introduction and conclusion chapters
- Ensure logical flow and progression
- Make it comprehensive and engaging
- Format as a structured outline with chapter titles and section headings

Please provide a detailed outline that will guide the creation of a professional ebook.`;

            const response = await axios.post(`${apiUrlA}/askai`, {
                input: outlinePrompt
            }, {
                timeout: 60000,
                headers: { 'Content-Type': 'application/json' }
            });

            setEbookOutline(response.data);
            setProgress(50);
            setCurrentStep('Ebook outline generated successfully');
            return true;
        } catch (error) {
            setError(`Outline generation failed: ${error.message}`);
            return false;
        }
    };

    // Step 3: Generate individual chapters with chunked processing
    const generateEbookChapters = async () => {
        setCurrentStep('Generating ebook chapters...');
        setProgress(60);
        setIsGeneratingChapter(true);

        try {
            // Parse outline to extract chapters
            const chapters = parseOutlineToChapters(ebookOutline);
            const generatedChapters = [];

            for (let i = 0; i < chapters.length; i++) {
                setCurrentStep(`Generating Chapter ${i + 1} of ${chapters.length}...`);
                setChapterProgress((i / chapters.length) * 100);

                const chapterPrompt = `Write Chapter ${i + 1}: "${chapters[i].title}"

Chapter Outline: ${chapters[i].sections.join('\n')}

Topic: ${topic}
Reference Content: ${scrapedContent.substring(0, 1500)}...
Discussion Points: ${discussionPoints}
Conclusion Focus: ${conclusion}

Requirements:
- Write in a professional, engaging style
- Make it human-written and undetectable by AI
- Include relevant examples and insights
- Maintain consistency with the overall ebook theme
- Target approximately ${Math.round(wordCount / chapters.length)} words per chapter
- Use proper formatting with headings and subheadings
- Make it informative and valuable for readers

Please write the complete chapter content.`;

                const response = await axios.post(`${apiUrlA}/askai`, {
                    input: chapterPrompt
                }, {
                    timeout: 120000,
                    headers: { 'Content-Type': 'application/json' }
                });

                generatedChapters.push({
                    chapterNumber: i + 1,
                    title: chapters[i].title,
                    content: response.data,
                    wordCount: response.data.split(' ').length
                });

                // Small delay between chapters to prevent API overload
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            setEbookChapters(generatedChapters);
            setProgress(90);
            setCurrentStep('All chapters generated successfully');
            setIsGeneratingChapter(false);
            setChapterProgress(100);

            // Save to Redux state
            const totalWordCount = generatedChapters.reduce((sum, chapter) => sum + chapter.wordCount, 0);
            const ebookData = {
                title: `${topic} - Complete Guide`,
                outline: ebookOutline,
                chapters: generatedChapters,
                metadata: {
                    wordCount: totalWordCount,
                    pageCount: Math.round(totalWordCount / 250),
                    topic,
                    referenceUrl,
                    discussionPoints,
                    conclusion
                }
            };

            setEbookData(ebookData);
            dispatch(loadData(ebookData));
            setProgress(100);
            setCurrentStep('Ebook creation completed successfully!');

            return true;
        } catch (error) {
            setError(`Chapter generation failed: ${error.message}`);
            setIsGeneratingChapter(false);
            return false;
        }
    };

    // Parse outline to extract chapter structure
    const parseOutlineToChapters = (outline) => {
        const lines = outline.split('\n');
        const chapters = [];
        let currentChapter = null;

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.match(/^Chapter \d+/i) || trimmedLine.match(/^\d+\./)) {
                if (currentChapter) {
                    chapters.push(currentChapter);
                }
                currentChapter = {
                    title: trimmedLine,
                    sections: []
                };
            } else if (trimmedLine && currentChapter && (trimmedLine.startsWith('-') || trimmedLine.startsWith('•') || trimmedLine.startsWith('*'))) {
                currentChapter.sections.push(trimmedLine);
            }
        }

        if (currentChapter) {
            chapters.push(currentChapter);
        }

        return chapters.length > 0 ? chapters : [
            { title: 'Chapter 1: Introduction', sections: ['Introduction to the topic', 'Overview of key concepts'] },
            { title: 'Chapter 2: Main Content', sections: ['Core concepts', 'Detailed explanations'] },
            { title: 'Chapter 3: Conclusion', sections: ['Summary', 'Key takeaways'] }
        ];
    };

    // Main ebook generation function
    const generateEbook = async () => {
        if (!topic.trim()) {
            setError('Please enter a topic for your ebook');
            return;
        }

        setLoading(true);
        setError('');
        setProgress(0);
        setCurrentStep('Starting ebook generation...');

        try {
            // Step 1: Scrape reference content
            if (referenceUrl.trim()) {
                const scraped = await scrapeReferenceContent();
                if (!scraped) return;
            }

            // Step 2: Generate outline
            const outlined = await generateEbookOutline();
            if (!outlined) return;

            // Step 3: Generate chapters
            const chaptersGenerated = await generateEbookChapters();
            if (!chaptersGenerated) return;

            setShowOutline(true);
            setShowChapters(true);

        } catch (error) {
            setError(`Ebook generation failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Edit chapter content
    const startEditingChapter = (chapterIndex) => {
        setEditingChapter(chapterIndex);
        setEditedContent(ebookChapters[chapterIndex].content);
    };

    const saveEditedChapter = () => {
        if (editingChapter !== null) {
            const updatedChapters = [...ebookChapters];
            updatedChapters[editingChapter].content = editedContent;
            updatedChapters[editingChapter].wordCount = editedContent.split(' ').length;
            setEbookChapters(updatedChapters);
            setEditingChapter(null);
            setEditedContent('');
        }
    };

    const cancelEditing = () => {
        setEditingChapter(null);
        setEditedContent('');
    };

    // Export ebook as text
    const exportEbook = () => {
        let ebookText = `${ebookData.title}\n\n`;
        ebookText += `Table of Contents:\n${ebookOutline}\n\n`;
        
        ebookChapters.forEach((chapter, index) => {
            ebookText += `\n${chapter.title}\n\n${chapter.content}\n\n`;
        });

        const blob = new Blob([ebookText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${topic.replace(/[^a-zA-Z0-9]/g, '_')}_ebook.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Export as Microsoft Word document
    const exportAsWord = () => {
        // Create HTML content with proper formatting
        let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${ebookData.title}</title>
            <style>
                body {
                    font-family: 'Times New Roman', serif;
                    font-size: 12pt;
                    line-height: 1.5;
                    margin: 1in;
                    color: #000;
                }
                h1 {
                    font-size: 18pt;
                    font-weight: bold;
                    text-align: center;
                    margin-bottom: 24pt;
                    page-break-before: always;
                }
                h2 {
                    font-size: 16pt;
                    font-weight: bold;
                    margin-top: 18pt;
                    margin-bottom: 12pt;
                }
                h3 {
                    font-size: 14pt;
                    font-weight: bold;
                    margin-top: 12pt;
                    margin-bottom: 6pt;
                }
                p {
                    margin-bottom: 6pt;
                    text-align: justify;
                }
                .toc {
                    page-break-after: always;
                }
                .chapter {
                    page-break-before: always;
                }
                @page {
                    margin: 1in;
                    size: 8.5in 11in;
                }
            </style>
        </head>
        <body>
            <h1>${ebookData.title}</h1>
            <div class="toc">
                <h2>Table of Contents</h2>
                <div>${renderMarkdown(ebookOutline)}</div>
            </div>
        `;
        
        ebookChapters.forEach((chapter, index) => {
            htmlContent += `
                <div class="chapter">
                    <h1>${chapter.title}</h1>
                    <div>${renderMarkdown(chapter.content)}</div>
                </div>
            `;
        });
        
        htmlContent += `
        </body>
        </html>
        `;

        // Create blob and download
        const blob = new Blob([htmlContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${topic.replace(/[^a-zA-Z0-9]/g, '_')}_ebook.doc`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <BookOpen className="w-8 h-8 text-slate-700 mr-3" />
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Create Books AI</h2>
                            <p className="text-slate-600 text-sm">Generate comprehensive ebooks with AI-powered content creation</p>
                        </div>
                    </div>
                    {ebookChapters.length > 0 && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowEbookView(!showEbookView)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm transition-colors duration-200"
                            >
                                {showEbookView ? 'Edit Mode' : 'Ebook View'}
                            </button>
                            <button
                                onClick={exportEbook}
                                className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm transition-colors duration-200"
                            >
                                <Download className="w-4 h-4 mr-1 inline" />
                                Export TXT
                            </button>
                            <button
                                onClick={exportAsWord}
                                className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition-colors duration-200"
                            >
                                <WordIcon className="w-4 h-4 mr-1 inline" />
                                Export Word
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex h-full">
                {/* Left Sidebar - Navigation */}
                {showEbookView && ebookChapters.length > 0 ? (
                    <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto">
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">Table of Contents</h3>
                            <div className="space-y-2">
                                <div 
                                    className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                                        selectedChapter === -1 ? 'bg-slate-200 text-slate-800' : 'hover:bg-slate-100 text-slate-600'
                                    }`}
                                    onClick={() => setSelectedChapter(-1)}
                                >
                                    <div className="font-medium">Outline</div>
                                    <div className="text-sm text-slate-500">Ebook structure</div>
                                </div>
                                {ebookChapters.map((chapter, index) => (
                                    <div 
                                        key={index}
                                        className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                                            selectedChapter === index ? 'bg-slate-200 text-slate-800' : 'hover:bg-slate-100 text-slate-600'
                                        }`}
                                        onClick={() => setSelectedChapter(index)}
                                    >
                                        <div className="font-medium">{chapter.title}</div>
                                        <div className="text-sm text-slate-500">{chapter.wordCount} words</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Form Section */
                    <div className="w-96 bg-white border-r border-slate-200 overflow-y-auto p-6">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Ebook Topic *
                                </label>
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g., Digital Marketing Strategies"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all duration-200"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Reference URL (Optional)
                                </label>
                                <input
                                    type="url"
                                    value={referenceUrl}
                                    onChange={(e) => setReferenceUrl(e.target.value)}
                                    placeholder="https://example.com/article"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all duration-200"
                                    disabled={loading}
                                />
                                <p className="text-xs text-slate-500 mt-1">AI will analyze this content for reference</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Discussion Points
                                </label>
                                <textarea
                                    value={discussionPoints}
                                    onChange={(e) => setDiscussionPoints(e.target.value)}
                                    placeholder="What specific aspects should be covered? Key points to discuss..."
                                    rows={3}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Conclusion Focus
                                </label>
                                <textarea
                                    value={conclusion}
                                    onChange={(e) => setConclusion(e.target.value)}
                                    placeholder="What should readers take away? Key conclusions..."
                                    rows={3}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Target Length
                                </label>
                                <select
                                    value={wordCount}
                                    onChange={(e) => {
                                        setWordCount(parseInt(e.target.value));
                                        setPageCount(Math.round(parseInt(e.target.value) / 250));
                                    }}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all duration-200"
                                    disabled={loading}
                                >
                                    {wordCountOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <h4 className="font-semibold text-slate-700 mb-2">Ebook Specifications</h4>
                                <div className="text-sm text-slate-600 space-y-1">
                                    <p>• Target Word Count: {wordCount.toLocaleString()} words</p>
                                    <p>• Estimated Pages: ~{pageCount} pages</p>
                                    <p>• Chapters: ~{Math.max(3, Math.round(wordCount / 2000))} chapters</p>
                                    <p>• Processing: Chunked AI generation</p>
                                </div>
                            </div>

                            <button
                                onClick={generateEbook}
                                disabled={loading || !topic.trim()}
                                className="w-full px-6 py-4 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-lg hover:from-slate-800 hover:to-slate-900 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                        Generating Ebook...
                                    </>
                                ) : (
                                    <>
                                        <BookOpen className="w-5 h-5 mr-3" />
                                        Generate Ebook
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Right Content Area */}
                <div className="flex-1 flex flex-col">
                    {/* Progress Display */}
                    {loading && (
                        <div className="bg-white border-b border-slate-200 p-4">
                            <div className="space-y-4">
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-semibold text-slate-700">Generation Progress</span>
                                        <span className="text-sm font-bold text-slate-700">{progress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-3 shadow-inner">
                                        <div 
                                            className="bg-gradient-to-r from-slate-500 to-slate-600 h-3 rounded-full transition-all duration-500 relative overflow-hidden shadow-sm"
                                            style={{ width: `${progress}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                                        </div>
                                    </div>
                                    {currentStep && (
                                        <p className="text-sm text-slate-600 font-medium mt-2">{currentStep}</p>
                                    )}
                                </div>

                                {/* Chapter Progress */}
                                {isGeneratingChapter && (
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-semibold text-green-700">Chapter Generation</span>
                                            <span className="text-sm font-bold text-green-700">{Math.round(chapterProgress)}%</span>
                                        </div>
                                        <div className="w-full bg-green-200 rounded-full h-2 shadow-inner">
                                            <div 
                                                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${chapterProgress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Error Display */}
                    {error && (
                        <div className="bg-white border-b border-slate-200 p-4">
                            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700 font-medium">{error}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content Display */}
                    <div className="flex-1 overflow-y-auto bg-white">
                        {showEbookView && ebookChapters.length > 0 ? (
                            /* Ebook Reading View */
                            <div className="max-w-4xl mx-auto p-8">
                                {selectedChapter === -1 ? (
                                    /* Outline View */
                                    <div>
                                        <h1 className="text-3xl font-bold text-slate-800 mb-6">Ebook Outline</h1>
                                        <div 
                                            className="prose prose-slate max-w-none"
                                            dangerouslySetInnerHTML={{ __html: renderMarkdown(ebookOutline) }}
                                        />
                                    </div>
                                ) : (
                                    /* Chapter View */
                                    <div>
                                        <h1 className="text-3xl font-bold text-slate-800 mb-6">
                                            {ebookChapters[selectedChapter]?.title}
                                        </h1>
                                        <div 
                                            ref={contentRef}
                                            className="prose prose-slate max-w-none select-text"
                                            onMouseUp={handleTextSelection}
                                            dangerouslySetInnerHTML={{ 
                                                __html: renderMarkdown(ebookChapters[selectedChapter]?.content || '') 
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Default View */
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-slate-600 mb-2">Ready to Create Your Ebook</h3>
                                    <p className="text-slate-500">Fill out the form on the left to get started</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* AI Rewrite Tooltip */}
            {showRewriteTooltip && selectedText && (
                <div 
                    className="fixed z-50 bg-slate-800 text-white px-3 py-2 rounded-lg shadow-lg"
                    style={{
                        top: rewritePosition.top - 50,
                        left: rewritePosition.left,
                    }}
                >
                    <button
                        onClick={handleAIRewrite}
                        disabled={isRewriting}
                        className="flex items-center text-sm hover:bg-slate-700 px-2 py-1 rounded transition-colors duration-200"
                    >
                        {isRewriting ? (
                            <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                                Rewriting...
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-3 h-3 mr-2" />
                                AI Rewrite
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CreateBooksAI;
