import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadData } from '../../../app/user/userDataSlice';
import axios from 'axios';
import { Copy, Check, BookOpen, FileText, Download, Edit3, Save, Trash2 } from 'lucide-react';

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

    const dispatch = useDispatch();
    const apiUrlA = import.meta.env.VITE_API_BASE_URL;

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

    return (
        <div className="space-y-6 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            {/* Header */}
            <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-4">
                    <BookOpen className="w-8 h-8 text-slate-700 mr-3" />
                    <h2 className="text-3xl font-bold text-slate-800">Create Books AI</h2>
                </div>
                <p className="text-slate-600">Generate comprehensive ebooks with AI-powered content creation</p>
            </div>

            {/* Input Form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Basic Info */}
                <div className="space-y-4">
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
                </div>

                {/* Right Column - Advanced Settings */}
                <div className="space-y-4">
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
                </div>
            </div>

            {/* Generate Button */}
            <div className="text-center">
                <button
                    onClick={generateEbook}
                    disabled={loading || !topic.trim()}
                    className="px-8 py-4 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-lg hover:from-slate-800 hover:to-slate-900 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center mx-auto"
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

            {/* Progress Display */}
            {loading && (
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
            )}

            {/* Error Display */}
            {error && (
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
            )}

            {/* Ebook Outline */}
            {showOutline && ebookOutline && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center">
                            <FileText className="w-6 h-6 mr-2" />
                            Ebook Outline
                        </h3>
                        <button
                            onClick={() => copyToClipboard(ebookOutline)}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-sm transition-colors duration-200"
                        >
                            <Copy className="w-4 h-4 mr-1 inline" />
                            Copy
                        </button>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 max-h-96 overflow-y-auto">
                        <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono">{ebookOutline}</pre>
                    </div>
                </div>
            )}

            {/* Ebook Chapters */}
            {showChapters && ebookChapters.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center">
                            <BookOpen className="w-6 h-6 mr-2" />
                            Generated Chapters ({ebookChapters.length})
                        </h3>
                        <div className="flex gap-2">
                            <button
                                onClick={exportEbook}
                                className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-md text-sm transition-colors duration-200"
                            >
                                <Download className="w-4 h-4 mr-1 inline" />
                                Export
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {ebookChapters.map((chapter, index) => (
                            <div key={index} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-semibold text-slate-800">{chapter.title}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                            {chapter.wordCount} words
                                        </span>
                                        <button
                                            onClick={() => startEditingChapter(index)}
                                            className="p-1 text-slate-500 hover:text-slate-700 transition-colors duration-200"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {editingChapter === index ? (
                                    <div className="space-y-3">
                                        <textarea
                                            value={editedContent}
                                            onChange={(e) => setEditedContent(e.target.value)}
                                            rows={8}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all duration-200 resize-none text-sm"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={saveEditedChapter}
                                                className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-md text-sm transition-colors duration-200"
                                            >
                                                <Save className="w-4 h-4 mr-1 inline" />
                                                Save
                                            </button>
                                            <button
                                                onClick={cancelEditing}
                                                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-sm transition-colors duration-200"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-sm text-slate-700 max-h-48 overflow-y-auto">
                                        <pre className="whitespace-pre-wrap font-sans">{chapter.content}</pre>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Ebook Summary */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <h4 className="font-semibold text-slate-700 mb-2">Ebook Summary</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
                            <div>
                                <p className="font-medium">Total Chapters</p>
                                <p className="text-lg font-bold text-slate-800">{ebookChapters.length}</p>
                            </div>
                            <div>
                                <p className="font-medium">Total Words</p>
                                <p className="text-lg font-bold text-slate-800">
                                    {ebookChapters.reduce((sum, chapter) => sum + chapter.wordCount, 0).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="font-medium">Estimated Pages</p>
                                <p className="text-lg font-bold text-slate-800">
                                    ~{Math.round(ebookChapters.reduce((sum, chapter) => sum + chapter.wordCount, 0) / 250)}
                                </p>
                            </div>
                            <div>
                                <p className="font-medium">Topic</p>
                                <p className="text-lg font-bold text-slate-800 truncate">{topic}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateBooksAI;
