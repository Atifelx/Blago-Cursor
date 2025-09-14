import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadData } from '../../../app/user/userDataSlice';
import { 
    updateBasicInfo, 
    updateChapterConfig, 
    updateChapterDetails, 
    updateProcessingStates,
    updateGeneratedContent,
    setDeepAnalysis,
    initializeMemory,
    clearMemory,
    setFormStep,
    saveAllEbookData,
    selectEbookMemory,
    selectBasicInfo,
    selectChapterConfig,
    selectChapterDetails,
    selectProcessingStates,
    selectGeneratedContent,
    selectDeepAnalysis,
    selectIsAnalysisComplete
} from '../../../app/user/ebookMemorySlice';
import axios from 'axios';
import { Copy, Check, BookOpen, FileText, Download, Edit3, Save, Trash2, Wand2, FileText as WordIcon } from 'lucide-react';
import { marked } from 'marked';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Table from '@editorjs/table';
import CodeTool from '@editorjs/code';
import Quote from '@editorjs/quote';
import Delimiter from '@editorjs/delimiter';
import InlineCode from '@editorjs/inline-code';
import AIWriteTool from './AIWriteTool';
import { converttoToEditor } from '../../../util/userApi.js';

const CreateBooksAI = () => {
    const dispatch = useDispatch();
    
    // Redux selectors
    const ebookMemory = useSelector(selectEbookMemory);
    const basicInfo = useSelector(selectBasicInfo);
    const chapterConfig = useSelector(selectChapterConfig);
    const chapterDetails = useSelector(selectChapterDetails);
    const processingStates = useSelector(selectProcessingStates);
    const generatedContent = useSelector(selectGeneratedContent);
    const deepAnalysis = useSelector(selectDeepAnalysis);
    const isAnalysisComplete = useSelector(selectIsAnalysisComplete);
    
    // Local state for UI interactions (not persisted)
    const [showMemoryClearConfirm, setShowMemoryClearConfirm] = useState(false);

    // Tone and style options
    const toneOptions = [
        'formal',
        'conversational', 
        'motivational',
        'storytelling',
        'research-backed',
        'casual',
        'academic',
        'inspiring'
    ];
    
    // Initialize Redux memory on component mount
    useEffect(() => {
        // Check if there's saved data in localStorage
        const savedMemory = localStorage.getItem('persist:ebookMemory');
        if (savedMemory) {
            try {
                const parsedMemory = JSON.parse(savedMemory);
                dispatch(initializeMemory(parsedMemory));
            } catch (error) {
                console.error('Error loading saved memory:', error);
                dispatch(initializeMemory(null));
            }
        } else {
            dispatch(initializeMemory(null));
        }
    }, [dispatch]);
    
    // Initialize chapter details structure when numChapters changes
    useEffect(() => {
        if (chapterConfig.numChapters > 0 && chapterDetails.length !== chapterConfig.numChapters) {
            const newChapterDetails = [];
            for (let i = 0; i < chapterConfig.numChapters; i++) {
                newChapterDetails[i] = chapterDetails[i] || {
                    title: '',
                    storyIdea: '',
                    mainLesson: '',
                    practicalExamples: '',
                    actionSteps: '',
                    keyTakeaway: ''
                };
            }
            dispatch(updateChapterDetails(newChapterDetails));
        }
    }, [chapterConfig.numChapters, chapterDetails.length, dispatch]);

    // Processing states (local UI state)
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState('');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [isGeneratingChapter, setIsGeneratingChapter] = useState(false);
    const [chapterProgress, setChapterProgress] = useState(0);

    // UI states (local UI state)
    const [showOutline, setShowOutline] = useState(false);
    const [showChapters, setShowChapters] = useState(false);
    const [editingChapter, setEditingChapter] = useState(null);
    const [editedContent, setEditedContent] = useState('');
    const [selectedChapter, setSelectedChapter] = useState(0);
    const [showEbookView, setShowEbookView] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);


    const contentRef = useRef(null);
    const editorInstance = useRef(null);
    const apiUrlA = import.meta.env.VITE_API_BASE_URL;

    // Initialize EditorJS with proper error handling
    const initializeEditor = (editorData = { blocks: [] }, isReadOnly = false) => {
        // Clean up existing instance
        if (editorInstance.current) {
            try {
                editorInstance.current.destroy();
            } catch (error) {
                console.log('Error destroying previous editor:', error);
            }
            editorInstance.current = null;
        }

        // Wait for DOM to be ready
        setTimeout(() => {
            const holderId = isReadOnly ? 'ebook-reader' : 'ebook-editor';
            const holderElement = document.getElementById(holderId);

            if (!holderElement) {
                console.error(`Holder element with ID "${holderId}" not found`);
                return;
            }

            try {
                editorInstance.current = new EditorJS({
                    holder: holderId,
                    tools: {
                        header: {
                            class: Header,
                            inlineToolbar: isReadOnly ? false : ['bold', 'italic', 'AIWrite'],
                            config: {
                                placeholder: 'Enter a header',
                                levels: [2, 3, 4],
                                defaultLevel: 3,
                            },
                        },
                        list: {
                            class: List,
                            config: {
                                inlineToolbar: isReadOnly ? false : ['bold', 'italic', 'AIWrite'],
                            },
                        },
                        paragraph: {
                            class: Paragraph,
                            inlineToolbar: isReadOnly ? false : ['bold', 'italic', 'AIWrite'],
                            config: {
                                preserveBlank: true,
                            },
                        },
                        table: {
                            class: Table,
                        },
                        quote: {
                            class: Quote,
                        },
                        delimiter: Delimiter,
                        inlineCode: InlineCode,
                        AIWrite: isReadOnly ? null : AIWriteTool,
                        code: CodeTool,
                    },
                    data: editorData,
                    readOnly: isReadOnly,
                    onReady: () => {
                        console.log(`EditorJS ${isReadOnly ? 'read-only' : 'editable'} is ready`);
                    },
                    onChange: isReadOnly ? undefined : () => {
                        // Save changes to chapter content - store EditorJS blocks directly
                        editorInstance.current.save().then((outputData) => {
                            const updatedChapters = [...ebookChapters];

                            // Store the EditorJS blocks directly
                            updatedChapters[selectedChapter].editorBlocks = outputData.blocks;

                            // Also create a text version for word count
                            const textContent = outputData.blocks
                                .map(block => {
                                    if (block.type === 'paragraph') return block.data.text;
                                    if (block.type === 'header') return block.data.text;
                                    if (block.type === 'list') {
                                        return block.data.items.map(item => item).join(' ');
                                    }
                                    if (block.type === 'quote') return block.data.text;
                                    return '';
                                })
                                .filter(Boolean)
                                .join(' ');

                            updatedChapters[selectedChapter].wordCount = textContent.split(' ').length;
                            setEbookChapters(updatedChapters);
                        }).catch((error) => {
                            console.log('Saving failed: ', error);
                        });
                    },
                });
            } catch (error) {
                console.error('Error initializing EditorJS:', error);
            }
        }, 100); // Small delay to ensure DOM is ready
    };

    // Configure marked for better rendering
    marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: false,
        mangle: false
    });

    // Add CSS styles for ebook page content
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .ebook-page-content {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                font-size: 17px;
                line-height: 1.6;
                color: #1d1d1f;
                text-align: left;
                max-width: 800px;
                margin: 0 auto;
                padding: 40px;
                background: white;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                border-radius: 12px;
                position: relative;
                font-weight: 400;
                letter-spacing: -0.01em;
            }
            
            .ebook-page-content h1 {
                font-size: 32px;
                font-weight: 600;
                text-align: center;
                margin-bottom: 32px;
                color: #1d1d1f;
                letter-spacing: -0.02em;
                line-height: 1.2;
            }
            
            .ebook-page-content h2 {
                font-size: 24px;
                font-weight: 600;
                margin-top: 32px;
                margin-bottom: 16px;
                color: #1d1d1f;
                letter-spacing: -0.01em;
                line-height: 1.3;
            }
            
            .ebook-page-content h3 {
                font-size: 20px;
                font-weight: 600;
                margin-top: 24px;
                margin-bottom: 12px;
                color: #1d1d1f;
                letter-spacing: -0.01em;
                line-height: 1.4;
            }
            
            .ebook-page-content p {
                margin-bottom: 20px;
                text-indent: 0;
                text-align: left;
                font-weight: 400;
            }
            
            .ebook-page-content p:first-child {
                text-indent: 0;
                margin-top: 0;
            }
            
            .ebook-page-content p:first-child::first-letter {
                float: none;
                font-size: inherit;
                line-height: inherit;
                margin: 0;
                font-weight: normal;
                color: inherit;
            }
            
            .ebook-page-content ul, .ebook-page-content ol {
                margin: 20px 0;
                padding-left: 24px;
            }
            
            .ebook-page-content li {
                margin-bottom: 12px;
                text-align: left;
                line-height: 1.6;
            }
            
            .ebook-page-content blockquote {
                margin: 24px 0;
                padding: 20px 24px;
                border-left: 4px solid #007AFF;
                background: #f8f9fa;
                font-style: italic;
                text-align: left;
                border-radius: 0 8px 8px 0;
                color: #1d1d1f;
            }
            
            .ebook-page-content strong {
                font-weight: 600;
                color: #1d1d1f;
            }
            
            .ebook-page-content em {
                font-style: italic;
            }
            
            .ebook-page-content code {
                background: #f1f2f6;
                padding: 2px 6px;
                border-radius: 3px;
                font-family: 'Courier New', monospace;
                font-size: 14px;
            }
            
            .ebook-page-content pre {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 5px;
                overflow-x: auto;
                margin: 20px 0;
            }
            
            .ebook-page-content[contenteditable="true"] {
                outline: none;
                border: 2px solid #3498db;
                box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
            }
            
            .ebook-page-content[contenteditable="true"]:focus {
                border-color: #2980b9;
                box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
            }
            
            .ebook-page-content[contenteditable="true"] p {
                text-indent: 0;
            }
            
            .ebook-page-content[contenteditable="true"] p:first-child::first-letter {
                float: none;
                font-size: inherit;
                line-height: inherit;
                margin: 0;
                font-weight: normal;
                color: inherit;
            }
            
            /* EditorJS Styles */
            .codex-editor {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            }
            
            .codex-editor__redactor {
                padding: 20px;
            }
            
            .ce-block__content {
                max-width: none;
            }
            
            .ce-paragraph {
                font-size: 17px;
                line-height: 1.6;
                color: #1d1d1f;
                margin-bottom: 20px;
            }
            
            .ce-header {
                font-weight: 600;
                color: #1d1d1f;
                letter-spacing: -0.01em;
                margin-bottom: 16px;
            }
            
            .ce-header[data-level="1"] {
                font-size: 32px;
                line-height: 1.2;
                letter-spacing: -0.02em;
                text-align: center;
                margin-bottom: 32px;
            }
            
            .ce-header[data-level="2"] {
                font-size: 24px;
                line-height: 1.3;
                margin-top: 32px;
            }
            
            .ce-header[data-level="3"] {
                font-size: 20px;
                line-height: 1.4;
                margin-top: 24px;
            }
            
            .ce-quote {
                margin: 24px 0;
                padding: 20px 24px;
                border-left: 4px solid #007AFF;
                background: #f8f9fa;
                font-style: italic;
                border-radius: 0 8px 8px 0;
                color: #1d1d1f;
            }
            
            .ce-list {
                margin: 20px 0;
                padding-left: 24px;
            }
            
            .ce-list__item {
                margin-bottom: 12px;
                line-height: 1.6;
            }
            
            .ce-delimiter {
                margin: 30px 0;
            }
            
            .ce-delimiter::before {
                content: '';
                display: block;
                width: 100px;
                height: 2px;
                background: #e0e0e0;
                margin: 0 auto;
            }
            
            /* Read-only mode styling */
            .ebook-page-content .codex-editor {
                background: white;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                border-radius: 12px;
                padding: 40px;
                max-width: 800px;
                margin: 0 auto;
            }
            
            .ebook-page-content .codex-editor__redactor {
                padding: 0;
            }
            
            /* Bold and italic styling */
            .ce-paragraph strong, .ce-header strong {
                font-weight: 600;
            }
            
            .ce-paragraph em, .ce-header em {
                font-style: italic;
            }
            
            /* Fix EditorJS + cursor positioning */
            .ce-block__content {
                position: relative;
            }
            
            .ce-toolbar__plus {
                position: absolute;
                left: -35px;
                top: 50%;
                transform: translateY(-50%);
                z-index: 2;
            }
            
            .ce-toolbar__plus:hover {
                background: rgba(0, 0, 0, 0.1);
                border-radius: 4px;
            }
            
            /* Minimal spacing for block content - only for + button */
            .ce-block {
                margin-left: 40px;
            }
            
            /* Fix for first block */
            .ce-block:first-child {
                margin-left: 40px;
            }
            
            /* Fix inline toolbar positioning - let EditorJS handle positioning naturally */
            .ce-inline-toolbar {
                background: white !important;
                border: 1px solid #e0e0e0 !important;
                border-radius: 6px !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
                padding: 4px !important;
                z-index: 1000 !important;
                display: flex !important;
                align-items: center !important;
                gap: 4px !important;
                pointer-events: auto !important;
            }
            
            .ce-inline-toolbar__button {
                width: 24px !important;
                height: 24px !important;
                border: none !important;
                background: transparent !important;
                border-radius: 4px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                cursor: pointer !important;
                transition: background-color 0.2s !important;
            }
            
            .ce-inline-toolbar__button:hover {
                background: rgba(0, 0, 0, 0.1) !important;
            }
            
            .ce-inline-toolbar__button svg {
                width: 14px !important;
                height: 14px !important;
            }
            
            /* Proper content spacing */
            .ce-block__content {
                padding-left: 10px !important;
                padding-right: 30px !important;
            }
            
            /* Better editor container */
            .codex-editor__redactor {
                max-width: none !important;
                padding: 20px 30px !important;
            }
            
            /* Read-only mode with proper margins */
            .ebook-page-content .codex-editor {
                max-width: 800px !important;
                padding: 40px 50px !important;
                margin: 0 auto !important;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);


    // Render markdown to HTML - handle both markdown and HTML content
    const renderMarkdown = (text) => {
        if (!text) return '';

        // Check if text already contains HTML tags
        if (text.includes('<') && text.includes('>')) {
            // Already HTML, return as is
            return text;
        }

        // Convert markdown to HTML
        return marked(text);
    };

    // Cleanup EditorJS on unmount
    useEffect(() => {
        return () => {
            if (editorInstance.current) {
                editorInstance.current.destroy();
            }
        };
    }, []);

    // Initialize editor when chapter is selected
    useEffect(() => {
        if (selectedChapter >= 0 && ebookChapters[selectedChapter]) {
            const chapter = ebookChapters[selectedChapter];
            const editorData = chapter.editorBlocks ? { blocks: chapter.editorBlocks } : { blocks: [] };

            // Use the unified initialization function
            initializeEditor(editorData, !isEditMode);
        }
    }, [selectedChapter, isEditMode, ebookChapters]);


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
        if (!basicInfo.referenceUrl.trim()) {
            setError('Please enter a reference URL');
            return;
        }

        const normalizedUrl = normalizeUrl(basicInfo.referenceUrl.trim());
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
                dispatch(updateProcessingStates({ scrapedContent: response.data.content }));
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

    // Step 1.5: Deep Thinking Analysis Phase
    const performDeepAnalysis = async () => {
        setCurrentStep('Performing deep analysis of all inputs...');
        setProgress(25);

        try {
            const deepAnalysisPrompt = `DEEP THINKING ANALYSIS - Analyze all provided information comprehensively:

USER INPUTS TO ANALYZE:
1. MAIN TOPIC: ${basicInfo.topic}
2. TARGET AUDIENCE: ${basicInfo.targetAudience}
3. END GOAL: ${basicInfo.endGoal}
4. TONE & STYLE: ${basicInfo.toneStyle}
5. NUMBER OF CHAPTERS: ${chapterConfig.numChapters}
6. WORD COUNT TARGET: ${basicInfo.wordCount} words
7. REFERENCE CONTENT: ${processingStates.scrapedContent ? processingStates.scrapedContent.substring(0, 3000) : 'No reference content provided'}

CHAPTER DETAILS PROVIDED:
${chapterDetails.map((chapter, index) => `
Chapter ${index + 1}:
- Title: ${chapter.title}
- Story Idea: ${chapter.storyIdea}
- Main Lesson: ${chapter.mainLesson}
- Practical Examples: ${chapter.practicalExamples}
- Action Steps: ${chapter.actionSteps}
- Key Takeaway: ${chapter.keyTakeaway}
`).join('\n')}

ADDITIONAL SECTIONS REQUESTED:
- Summary Chapter: ${chapterConfig.includeSummary ? 'Yes' : 'No'}
- Discussion Questions: ${chapterConfig.includeDiscussionQuestions ? 'Yes' : 'No'}
- Resources Section: ${chapterConfig.includeResources ? 'Yes' : 'No'}
- Author Bio: ${chapterConfig.includeAuthorBio ? 'Yes' : 'No'}

DEEP ANALYSIS REQUIREMENTS:
1. Understand the core objective: How does "${basicInfo.endGoal}" relate to "${basicInfo.topic}" for "${basicInfo.targetAudience}"?
2. Analyze the relevance: Which chapter details are most important for achieving the end goal?
3. Identify the logical flow: How should the chapters be ordered to create maximum impact?
4. Determine content depth: How much detail is needed in each chapter based on the target audience?
5. Assess reference material: How can the scraped content enhance the original chapter ideas?
6. Plan the narrative arc: How should the story/concept progress from beginning to end?
7. Consider practical application: How will readers actually use this information?

Provide a comprehensive analysis that will guide the content generation process. Focus on understanding the user's intent and creating the most valuable content structure.`;

            const response = await axios.post(`${apiUrlA}/askai`, {
                input: deepAnalysisPrompt
            }, {
                timeout: 120000,
                headers: { 'Content-Type': 'application/json' }
            });

            dispatch(setDeepAnalysis(response.data));
            setProgress(35);
            setCurrentStep('Deep analysis completed successfully');
            return true;
        } catch (error) {
            setError(`Deep analysis failed: ${error.message}`);
            return false;
        }
    };

    // Step 2: Generate ebook outline based on deep analysis
    const generateEbookOutline = async () => {
        setCurrentStep('Generating comprehensive outline based on analysis...');
        setProgress(40);

        try {
            const outlinePrompt = `Based on the deep analysis provided, create a detailed ebook outline:

DEEP ANALYSIS RESULTS:
${deepAnalysis}

USER CONFIGURATION:
- Main Topic: ${basicInfo.topic}
- Target Audience: ${basicInfo.targetAudience}
- End Goal: ${basicInfo.endGoal}
- Tone & Style: ${basicInfo.toneStyle}
- Number of Chapters: ${chapterConfig.numChapters}
- Target Word Count: ${basicInfo.wordCount} words
- Reference Content: ${processingStates.scrapedContent ? processingStates.scrapedContent.substring(0, 2000) : 'No reference content'}

CHAPTER REQUIREMENTS:
1. Create a logical progression that builds toward "${basicInfo.endGoal}"
2. Each chapter should be approximately ${Math.round(basicInfo.wordCount / chapterConfig.numChapters)} words
3. Maintain ${basicInfo.toneStyle} tone throughout
4. Structure content specifically for ${basicInfo.targetAudience}
5. Include clear learning objectives for each chapter
6. Ensure practical applicability and actionable insights

Please provide a detailed chapter-by-chapter outline that implements the insights from the deep analysis.`;

            const response = await axios.post(`${apiUrlA}/askai`, {
                input: outlinePrompt
            }, {
                timeout: 90000,
                headers: { 'Content-Type': 'application/json' }
            });

            dispatch(updateProcessingStates({ ebookOutline: response.data }));
            setProgress(50);
            setCurrentStep('Ebook outline generated successfully');
            return true;
        } catch (error) {
            setError(`Outline generation failed: ${error.message}`);
            return false;
        }
    };

    // Step 3: Generate individual chapters with chunked processing and human-like writing
    const generateEbookChapters = async () => {
        setCurrentStep('Generating ebook chapters with human-like style...');
        setProgress(60);
        setIsGeneratingChapter(true);

        try {
            // Use chapter details if provided, otherwise parse outline
            const chaptersToGenerate = chapterDetails.length > 0 ? 
                chapterDetails.map((detail, index) => ({
                    title: detail.title || `Chapter ${index + 1}`,
                    details: detail
                })) :
                parseOutlineToChapters(processingStates.ebookOutline).map(chapter => ({
                    title: chapter.title,
                    details: null
                }));

            const generatedChapters = [];

            for (let i = 0; i < chaptersToGenerate.length; i++) {
                setCurrentStep(`Writing Chapter ${i + 1} of ${chaptersToGenerate.length}...`);
                setChapterProgress((i / chaptersToGenerate.length) * 100);

                const chapter = chaptersToGenerate[i];
                const targetWordsPerChapter = Math.round(basicInfo.wordCount / chaptersToGenerate.length);

                // Create comprehensive chapter prompt with all user inputs and deep analysis
                const chapterPrompt = `Write Chapter ${i + 1}: "${chapter.title}"

DEEP ANALYSIS CONTEXT:
${deepAnalysis}

BOOK CONTEXT:
- Main Topic: ${basicInfo.topic}
- Target Audience: ${basicInfo.targetAudience}
- End Goal: ${basicInfo.endGoal}
- Tone & Style: ${basicInfo.toneStyle}
- Reference Content: ${processingStates.scrapedContent ? processingStates.scrapedContent.substring(0, 2000) : 'No reference content'}...

CHAPTER SPECIFIC DETAILS:
${chapter.details ? `
- Story Idea: ${chapter.details.storyIdea}
- Main Lesson: ${chapter.details.mainLesson}
- Practical Examples: ${chapter.details.practicalExamples}
- Action Steps: ${chapter.details.actionSteps}
- Key Takeaway: ${chapter.details.keyTakeaway}
` : ''}

WRITING REQUIREMENTS:
1. Write in a completely human style - avoid AI-like patterns
2. Use natural language that feels like a real author wrote it
3. Maintain ${basicInfo.toneStyle} tone throughout
4. Target approximately ${targetWordsPerChapter} words
5. Include personal insights, real-world examples, and practical advice
6. Write for ${basicInfo.targetAudience} specifically
7. Make content that achieves: "${basicInfo.endGoal}"
8. Use varied sentence structures and natural flow
9. Include engaging storytelling elements where appropriate
10. Avoid repetitive phrases or robotic language
11. Incorporate insights from the deep analysis provided above

CONTENT STRUCTURE:
- Start with an engaging hook or story
- Develop the main concepts naturally
- Include practical examples and actionable advice
- End with clear takeaways
- Use subheadings to organize content
- Include relevant examples for ${basicInfo.targetAudience}

Write this chapter as if you're an experienced author who deeply understands ${basicInfo.targetAudience} and wants to help them achieve "${basicInfo.endGoal}". Make it feel authentic, valuable, and genuinely helpful.`;

                const response = await axios.post(`${apiUrlA}/askai`, {
                    input: chapterPrompt
                }, {
                    timeout: 150000,
                    headers: { 'Content-Type': 'application/json' }
                });

                // Convert AI response to EditorJS blocks
                const editorData = converttoToEditor({ editorData: response.data });

                generatedChapters.push({
                    chapterNumber: i + 1,
                    title: chapter.title,
                    content: response.data,
                    editorBlocks: editorData.blocks,
                    wordCount: response.data.split(' ').length,
                    details: chapter.details
                });

                // Longer delay between chapters to prevent AI exhaustion
                setCurrentStep(`Chapter ${i + 1} completed. Taking a moment to prepare next chapter...`);
                await new Promise(resolve => setTimeout(resolve, 3000));
            }

            // Generate additional sections if requested
            if (chapterConfig.includeSummary || chapterConfig.includeDiscussionQuestions || chapterConfig.includeResources || chapterConfig.includeAuthorBio) {
                setCurrentStep('Generating additional sections...');
                await generateAdditionalSections(generatedChapters);
            }

            // Save to Redux state
            const totalWordCount = generatedChapters.reduce((sum, chapter) => sum + chapter.wordCount, 0);
            const ebookData = {
                title: `${basicInfo.topic} - Complete Guide`,
                outline: processingStates.ebookOutline,
                chapters: generatedChapters,
                metadata: {
                    wordCount: totalWordCount,
                    pageCount: Math.round(totalWordCount / 250),
                    ...basicInfo,
                    ...chapterConfig,
                    deepAnalysis,
                    analysisComplete: true
                }
            };

            dispatch(updateGeneratedContent({ 
                ebookChapters: generatedChapters,
                ebookData,
                totalWordCount,
                generationComplete: true
            }));
            
            dispatch(loadData(ebookData));
            setProgress(90);
            setCurrentStep('All chapters generated successfully');
            setIsGeneratingChapter(false);
            setChapterProgress(100);
            setProgress(100);
            setCurrentStep('Ebook creation completed successfully!');

            return true;
        } catch (error) {
            setError(`Chapter generation failed: ${error.message}`);
            setIsGeneratingChapter(false);
            return false;
        }
    };

    // Generate additional sections (summary, discussion questions, etc.)
    const generateAdditionalSections = async (chapters) => {
        try {
            const sectionsPrompt = `Create additional sections for the ebook:

DEEP ANALYSIS CONTEXT:
${deepAnalysis}

BOOK CONTEXT:
- Topic: ${basicInfo.topic}
- Target Audience: ${basicInfo.targetAudience}
- End Goal: ${basicInfo.endGoal}
- Tone: ${basicInfo.toneStyle}

CHAPTERS SUMMARY:
${chapters.map(chapter => `Chapter ${chapter.chapterNumber}: ${chapter.title}`).join('\n')}

GENERATE THE FOLLOWING SECTIONS:

${chapterConfig.includeSummary ? `
1. EXECUTIVE SUMMARY
- Summarize the entire ebook in 2-3 paragraphs
- Highlight key takeaways for ${basicInfo.targetAudience}
- Focus on the main value proposition
` : ''}

${chapterConfig.includeDiscussionQuestions ? `
2. DISCUSSION QUESTIONS
- Create 8-10 thought-provoking questions
- Questions should help ${basicInfo.targetAudience} reflect on the content
- Include both practical and conceptual questions
` : ''}

${chapterConfig.includeResources ? `
3. ADDITIONAL RESOURCES
- Suggest 5-7 relevant books, articles, or tools
- Focus on resources that complement the ebook content
- Include brief descriptions of why each resource is valuable
` : ''}

${chapterConfig.includeAuthorBio ? `
4. AUTHOR BIO
- Write a brief, engaging author bio
- Focus on credibility and expertise in ${basicInfo.topic}
- Keep it relevant to ${basicInfo.targetAudience}
` : ''}

Write in the same ${basicInfo.toneStyle} tone as the main content.`;

            const response = await axios.post(`${apiUrlA}/askai`, {
                input: sectionsPrompt
            }, {
                timeout: 120000,
                headers: { 'Content-Type': 'application/json' }
            });

            // Add additional sections as a special chapter
            const editorData = converttoToEditor({ editorData: response.data });
            chapters.push({
                chapterNumber: chapters.length + 1,
                title: 'Additional Resources',
                content: response.data,
                editorBlocks: editorData.blocks,
                wordCount: response.data.split(' ').length,
                isAdditionalSection: true
            });

        } catch (error) {
            console.error('Failed to generate additional sections:', error);
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
        // Validate required fields
        if (!basicInfo.topic.trim()) {
            setError('Please enter a topic for your ebook');
            return;
        }
        if (!basicInfo.targetAudience.trim()) {
            setError('Please specify your target audience');
            return;
        }
        if (!basicInfo.endGoal.trim()) {
            setError('Please define the end goal of your ebook');
            return;
        }
        if (!basicInfo.toneStyle.trim()) {
            setError('Please select a tone and style');
            return;
        }

        setLoading(true);
        setError('');
        setProgress(0);
        setCurrentStep('Starting ebook generation...');

        try {
            // Step 1: Scrape reference content
            if (basicInfo.referenceUrl.trim()) {
                const scraped = await scrapeReferenceContent();
                if (!scraped) return;
            }

            // Step 1.5: Perform deep analysis
            const analysisComplete = await performDeepAnalysis();
            if (!analysisComplete) return;

            // Step 2: Generate outline based on analysis
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

    // Memory management functions
    const clearMemoryData = () => {
        dispatch(clearMemory());
        setShowMemoryClearConfirm(false);
        setShowOutline(false);
        setShowChapters(false);
        setShowEbookView(false);
        setError('');
        setProgress(0);
        setCurrentStep('');
    };

    const handleMemoryClear = () => {
        setShowMemoryClearConfirm(true);
    };

    const confirmMemoryClear = () => {
        clearMemoryData();
    };

    const cancelMemoryClear = () => {
        setShowMemoryClearConfirm(false);
    };

    // Edit chapter content
    const startEditingChapter = (chapterIndex) => {
        setEditingChapter(chapterIndex);
        setEditedContent(generatedContent.ebookChapters[chapterIndex].content);
    };

    const saveEditedChapter = () => {
        if (editingChapter !== null) {
            const updatedChapters = [...generatedContent.ebookChapters];
            updatedChapters[editingChapter].content = editedContent;
            updatedChapters[editingChapter].wordCount = editedContent.split(' ').length;
            dispatch(updateGeneratedContent({ ebookChapters: updatedChapters }));
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
        if (!generatedContent.ebookData) return;
        
        let ebookText = `${generatedContent.ebookData.title}\n\n`;
        ebookText += `Table of Contents:\n${processingStates.ebookOutline}\n\n`;

        generatedContent.ebookChapters.forEach((chapter, index) => {
            const content = chapter.editorBlocks
                ? chapter.editorBlocks.map(block => {
                    if (block.type === 'paragraph') return block.data.text;
                    if (block.type === 'header') return `${'#'.repeat(block.data.level || 2)} ${block.data.text}`;
                    if (block.type === 'list') {
                        return block.data.items.map(item => `- ${item}`).join('\n');
                    }
                    if (block.type === 'quote') return `> ${block.data.text}`;
                    return '';
                }).filter(Boolean).join('\n\n')
                : chapter.content;

            ebookText += `\n${chapter.title}\n\n${content}\n\n`;
        });

        const blob = new Blob([ebookText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${basicInfo.topic.replace(/[^a-zA-Z0-9]/g, '_')}_ebook.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Export as Microsoft Word document
    const exportAsWord = () => {
        if (!generatedContent.ebookData) return;
        
        // Create HTML content with proper formatting
        let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${generatedContent.ebookData.title}</title>
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
            <h1>${generatedContent.ebookData.title}</h1>
            <div class="toc">
                <h2>Table of Contents</h2>
                <div>${renderMarkdown(processingStates.ebookOutline)}</div>
            </div>
        `;

        generatedContent.ebookChapters.forEach((chapter, index) => {
            const content = chapter.editorBlocks
                ? chapter.editorBlocks.map(block => {
                    switch (block.type) {
                        case 'paragraph':
                            return `<p>${block.data.text}</p>`;
                        case 'header':
                            const level = block.data.level || 2;
                            return `<h${level}>${block.data.text}</h${level}>`;
                        case 'list':
                            const listType = block.data.style === 'ordered' ? 'ol' : 'ul';
                            const listItems = block.data.items.map(item => `<li>${item}</li>`).join('');
                            return `<${listType}>${listItems}</${listType}>`;
                        case 'quote':
                            return `<blockquote>${block.data.text}</blockquote>`;
                        case 'delimiter':
                            return '<hr>';
                        default:
                            return '';
                    }
                }).join('')
                : renderMarkdown(chapter.content);

            htmlContent += `
                <div class="chapter">
                    <h1>${chapter.title}</h1>
                    <div>${content}</div>
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
        a.download = `${basicInfo.topic.replace(/[^a-zA-Z0-9]/g, '_')}_ebook.doc`;
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
                    
                    {/* Memory Management Buttons */}
                    <div className="flex items-center gap-3">
                        {/* Memory Clear Button */}
                        <button
                            onClick={handleMemoryClear}
                            className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm transition-colors duration-200 flex items-center"
                            title="Clear all saved data"
                        >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Clear Memory
                        </button>
                        
                        {generatedContent.ebookChapters.length > 0 && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setShowEbookView(true);
                                        setIsEditMode(false);
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${showEbookView && !isEditMode
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                        }`}
                                >
                                    Ebook View
                                </button>
                                <button
                                    onClick={() => {
                                        setShowEbookView(true);
                                        setIsEditMode(true);
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${showEbookView && isEditMode
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                        }`}
                                >
                                    Edit Mode
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
            </div>

            {/* Memory Clear Confirmation Modal */}
            {showMemoryClearConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                <Trash2 className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">Clear Memory</h3>
                                <p className="text-sm text-slate-600">This will permanently delete all saved data</p>
                            </div>
                        </div>
                        <p className="text-slate-700 mb-6">
                            Are you sure you want to clear all memory? This will delete:
                        </p>
                        <ul className="text-sm text-slate-600 mb-6 space-y-1">
                            <li>• All form inputs and configurations</li>
                            <li>• Generated content and chapters</li>
                            <li>• Deep analysis results</li>
                            <li>• All saved progress</li>
                        </ul>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={cancelMemoryClear}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmMemoryClear}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors duration-200"
                            >
                                Clear Memory
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex h-full">
                {/* Left Sidebar - Navigation */}
                {showEbookView && generatedContent.ebookChapters.length > 0 ? (
                    <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto">
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">Table of Contents</h3>
                            <div className="space-y-2">
                                <div
                                    className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${selectedChapter === -1 ? 'bg-slate-200 text-slate-800' : 'hover:bg-slate-100 text-slate-600'
                                        }`}
                                    onClick={() => setSelectedChapter(-1)}
                                >
                                    <div className="font-medium">Outline</div>
                                    <div className="text-sm text-slate-500">Ebook structure</div>
                                </div>
                                {generatedContent.ebookChapters.map((chapter, index) => (
                                    <div
                                        key={index}
                                        className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${selectedChapter === index ? 'bg-slate-200 text-slate-800' : 'hover:bg-slate-100 text-slate-600'
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
                    /* Comprehensive Form Section */
                    <div className="w-96 bg-white border-r border-slate-200 overflow-y-auto p-6">
                        <div className="space-y-6">
                            {/* Step Navigation */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex space-x-2">
                                    {['basic', 'chapters', 'details', 'review'].map((step, index) => (
                                        <div
                                            key={step}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${processingStates.currentFormStep === step
                                                    ? 'bg-slate-700 text-white'
                                                    : index < ['basic', 'chapters', 'details', 'review'].indexOf(processingStates.currentFormStep)
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-slate-100 text-slate-400'
                                                }`}
                                        >
                                            {index + 1}
                                        </div>
                                    ))}
                                </div>
                                <span className="text-xs text-slate-500 capitalize">{processingStates.currentFormStep}</span>
                            </div>

                            {/* Basic Information Step */}
                            {processingStates.currentFormStep === 'basic' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Main Topic / Subject *
                                        </label>
                                        <input
                                            type="text"
                                            value={basicInfo.topic}
                                            onChange={(e) => dispatch(updateBasicInfo({ topic: e.target.value }))}
                                            placeholder="e.g., Productivity for Students, Healthy Eating, Romance Story"
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all duration-200"
                                            disabled={loading}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Target Audience *
                                        </label>
                                        <input
                                            type="text"
                                            value={basicInfo.targetAudience}
                                            onChange={(e) => dispatch(updateBasicInfo({ targetAudience: e.target.value }))}
                                            placeholder="e.g., busy professionals, college students, parents, beginners"
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all duration-200"
                                            disabled={loading}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            End Goal / Transformation *
                                        </label>
                                        <input
                                            type="text"
                                            value={basicInfo.endGoal}
                                            onChange={(e) => dispatch(updateBasicInfo({ endGoal: e.target.value }))}
                                            placeholder="e.g., Teach time management, Entertain with romance, Help lose weight"
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all duration-200"
                                            disabled={loading}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Tone & Style *
                                        </label>
                                        <select
                                            value={basicInfo.toneStyle}
                                            onChange={(e) => dispatch(updateBasicInfo({ toneStyle: e.target.value }))}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all duration-200"
                                            disabled={loading}
                                        >
                                            <option value="">Select tone and style</option>
                                            {toneOptions.map(tone => (
                                                <option key={tone} value={tone}>
                                                    {tone.charAt(0).toUpperCase() + tone.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Web Scraping URL for Reference
                                        </label>
                                        <input
                                            type="url"
                                            value={basicInfo.referenceUrl}
                                            onChange={(e) => dispatch(updateBasicInfo({ referenceUrl: e.target.value }))}
                                            placeholder="https://example.com/article"
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all duration-200"
                                            disabled={loading}
                                        />
                                        <p className="text-xs text-slate-500 mt-1">AI will analyze this content for reference</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Number of Book Pages
                                        </label>
                                        <select
                                            value={basicInfo.wordCount}
                                            onChange={(e) => {
                                                const wordCount = parseInt(e.target.value);
                                                const pageCount = Math.round(wordCount / 250);
                                                dispatch(updateBasicInfo({ wordCount, pageCount }));
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

                                    <button
                                        onClick={() => dispatch(setFormStep('chapters'))}
                                        disabled={!basicInfo.topic.trim() || !basicInfo.targetAudience.trim() || !basicInfo.endGoal.trim() || !basicInfo.toneStyle.trim()}
                                        className="w-full px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-lg hover:from-slate-800 hover:to-slate-900 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200"
                                    >
                                        Next: Configure Chapters
                                    </button>
                                </>
                            )}

                            {/* Chapters Configuration Step */}
                            {currentFormStep === 'chapters' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            How many chapters in the book?
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="20"
                                            value={numChapters}
                                            onChange={(e) => setNumChapters(parseInt(e.target.value) || 5)}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all duration-200"
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="text-sm font-semibold text-slate-700">
                                                Let AI generate chapter titles
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setAiGenerateChapters(!aiGenerateChapters)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${aiGenerateChapters ? 'bg-slate-600' : 'bg-slate-200'
                                                    }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${aiGenerateChapters ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            {aiGenerateChapters
                                                ? 'AI will create chapter titles based on your inputs'
                                                : 'You will manually enter chapter titles'
                                            }
                                        </p>
                                    </div>

                                    {!aiGenerateChapters && numChapters > 0 && (
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Chapter Titles
                                            </label>
                                            <div className="space-y-3">
                                                {Array.from({ length: numChapters }, (_, index) => (
                                                    <input
                                                        key={index}
                                                        type="text"
                                                        value={chapterTitles[index] || ''}
                                                        onChange={(e) => {
                                                            const newTitles = [...chapterTitles];
                                                            newTitles[index] = e.target.value;
                                                            setChapterTitles(newTitles);
                                                        }}
                                                        placeholder={`Chapter ${index + 1} title`}
                                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all duration-200 text-sm"
                                                        disabled={loading}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                        <h4 className="font-semibold text-slate-700 mb-3">Additional Sections</h4>
                                        <div className="space-y-2">
                                            {[
                                                { key: 'includeSummary', label: 'Summary Chapter', description: 'Executive summary of key points' },
                                                { key: 'includeDiscussionQuestions', label: 'Discussion Questions', description: 'Reflection questions for readers' },
                                                { key: 'includeResources', label: 'Resources Section', description: 'Additional books, tools, and references' },
                                                { key: 'includeAuthorBio', label: 'Author Bio', description: 'Brief author introduction' }
                                            ].map(({ key, label, description }) => (
                                                <div key={key} className="flex items-center justify-between">
                                                    <div>
                                                        <div className="text-sm font-medium text-slate-700">{label}</div>
                                                        <div className="text-xs text-slate-500">{description}</div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (key === 'includeSummary') setIncludeSummary(!includeSummary);
                                                            if (key === 'includeDiscussionQuestions') setIncludeDiscussionQuestions(!includeDiscussionQuestions);
                                                            if (key === 'includeResources') setIncludeResources(!includeResources);
                                                            if (key === 'includeAuthorBio') setIncludeAuthorBio(!includeAuthorBio);
                                                        }}
                                                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${eval(key) ? 'bg-slate-600' : 'bg-slate-200'
                                                            }`}
                                                    >
                                                        <span
                                                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${eval(key) ? 'translate-x-5' : 'translate-x-1'
                                                                }`}
                                                        />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => setCurrentFormStep('basic')}
                                            className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-all duration-200"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={() => setCurrentFormStep('details')}
                                            className="flex-1 px-4 py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-lg hover:from-slate-800 hover:to-slate-900 font-semibold transition-all duration-200"
                                        >
                                            Next: Chapter Details
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Chapter Details Step */}
                            {currentFormStep === 'details' && (
                                <>
                                    <div className="space-y-6">
                                        {Array.from({ length: numChapters }, (_, chapterIndex) => (
                                            <div key={chapterIndex} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                                <h4 className="font-semibold text-slate-700 mb-4">
                                                    Chapter {chapterIndex + 1} Details
                                                </h4>
                                                <div className="space-y-4">
                                                    {!aiGenerateChapters && (
                                                        <div>
                                                            <label className="block text-sm font-medium text-slate-600 mb-1">
                                                                Chapter Title
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={chapterDetails[chapterIndex]?.title || ''}
                                                                onChange={(e) => {
                                                                    const newDetails = [...chapterDetails];
                                                                    newDetails[chapterIndex] = {
                                                                        ...newDetails[chapterIndex],
                                                                        title: e.target.value
                                                                    };
                                                                    setChapterDetails(newDetails);
                                                                }}
                                                                placeholder="e.g., Mastering Focus in a Distracted World"
                                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all duration-200 text-sm"
                                                                disabled={loading}
                                                            />
                                                        </div>
                                                    )}

                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-600 mb-1">
                                                            Opening Hook / Story Idea (Optional)
                                                        </label>
                                                        <textarea
                                                            value={chapterDetails[chapterIndex]?.storyIdea || ''}
                                                            onChange={(e) => {
                                                                const newDetails = [...chapterDetails];
                                                                newDetails[chapterIndex] = {
                                                                    ...newDetails[chapterIndex],
                                                                    storyIdea: e.target.value
                                                                };
                                                                setChapterDetails(newDetails);
                                                            }}
                                                            placeholder="e.g., Story of how Elon Musk manages focus"
                                                            rows={2}
                                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all duration-200 resize-none text-sm"
                                                            disabled={loading}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-600 mb-1">
                                                            Main Lesson / Concept *
                                                        </label>
                                                        <textarea
                                                            value={chapterDetails[chapterIndex]?.mainLesson || ''}
                                                            onChange={(e) => {
                                                                const newDetails = [...chapterDetails];
                                                                newDetails[chapterIndex] = {
                                                                    ...newDetails[chapterIndex],
                                                                    mainLesson: e.target.value
                                                                };
                                                                setChapterDetails(newDetails);
                                                            }}
                                                            placeholder="e.g., The importance of single-tasking over multitasking"
                                                            rows={2}
                                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all duration-200 resize-none text-sm"
                                                            disabled={loading}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-600 mb-1">
                                                            Practical Examples (Optional)
                                                        </label>
                                                        <textarea
                                                            value={chapterDetails[chapterIndex]?.practicalExamples || ''}
                                                            onChange={(e) => {
                                                                const newDetails = [...chapterDetails];
                                                                newDetails[chapterIndex] = {
                                                                    ...newDetails[chapterIndex],
                                                                    practicalExamples: e.target.value
                                                                };
                                                                setChapterDetails(newDetails);
                                                            }}
                                                            placeholder="e.g., Students using Pomodoro technique"
                                                            rows={2}
                                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all duration-200 resize-none text-sm"
                                                            disabled={loading}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-600 mb-1">
                                                            Action Steps / Takeaways (Optional)
                                                        </label>
                                                        <textarea
                                                            value={chapterDetails[chapterIndex]?.actionSteps || ''}
                                                            onChange={(e) => {
                                                                const newDetails = [...chapterDetails];
                                                                newDetails[chapterIndex] = {
                                                                    ...newDetails[chapterIndex],
                                                                    actionSteps: e.target.value
                                                                };
                                                                setChapterDetails(newDetails);
                                                            }}
                                                            placeholder="e.g., 3 steps to reduce distractions at home"
                                                            rows={2}
                                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all duration-200 resize-none text-sm"
                                                            disabled={loading}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-600 mb-1">
                                                            Key Takeaway Sentence
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={chapterDetails[chapterIndex]?.keyTakeaway || ''}
                                                            onChange={(e) => {
                                                                const newDetails = [...chapterDetails];
                                                                newDetails[chapterIndex] = {
                                                                    ...newDetails[chapterIndex],
                                                                    keyTakeaway: e.target.value
                                                                };
                                                                setChapterDetails(newDetails);
                                                            }}
                                                            placeholder="e.g., Focus grows when distractions shrink."
                                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all duration-200 text-sm"
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => setCurrentFormStep('chapters')}
                                            className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-all duration-200"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={() => setCurrentFormStep('review')}
                                            className="flex-1 px-4 py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-lg hover:from-slate-800 hover:to-slate-900 font-semibold transition-all duration-200"
                                        >
                                            Next: Review
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Review Step */}
                            {currentFormStep === 'review' && (
                                <>
                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                        <h4 className="font-semibold text-slate-700 mb-3">Ebook Configuration Summary</h4>
                                        <div className="text-sm text-slate-600 space-y-2">
                                            <p><strong>Topic:</strong> {topic}</p>
                                            <p><strong>Target Audience:</strong> {targetAudience}</p>
                                            <p><strong>End Goal:</strong> {endGoal}</p>
                                            <p><strong>Tone:</strong> {toneStyle}</p>
                                            <p><strong>Chapters:</strong> {numChapters}</p>
                                            <p><strong>Word Count:</strong> {wordCount.toLocaleString()} words</p>
                                            <p><strong>Pages:</strong> ~{pageCount} pages</p>
                                            {referenceUrl && <p><strong>Reference URL:</strong> {referenceUrl}</p>}
                                        </div>
                                    </div>

                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => setCurrentFormStep('details')}
                                            className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-all duration-200"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={generateEbook}
                                            disabled={loading}
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-lg hover:from-slate-800 hover:to-slate-900 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Generating...
                                                </>
                                            ) : (
                                                <>
                                                    <BookOpen className="w-4 h-4 mr-2" />
                                                    Generate Ebook
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}
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
                            /* Ebook Reading/Editing View */
                            <div className="max-w-4xl mx-auto p-8">
                                {selectedChapter === -1 ? (
                                    /* Outline View */
                                    <div>
                                        <h1 className="text-3xl font-bold text-slate-800 mb-6">Ebook Outline</h1>
                                        {isEditMode ? (
                                            <textarea
                                                value={ebookOutline}
                                                onChange={(e) => setEbookOutline(e.target.value)}
                                                className="w-full h-96 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all duration-200 resize-none font-mono text-sm"
                                                placeholder="Enter ebook outline..."
                                            />
                                        ) : (
                                            <div
                                                className="prose prose-slate max-w-none"
                                                dangerouslySetInnerHTML={{ __html: renderMarkdown(ebookOutline) }}
                                            />
                                        )}
                                    </div>
                                ) : (
                                    /* Chapter View */
                                    <div>
                                        <h1 className="text-3xl font-bold text-slate-800 mb-6">
                                            {ebookChapters[selectedChapter]?.title}
                                        </h1>
                                        {/* EditorJS for both edit and read modes */}
                                        <div className="relative">
                                            {/* Edit Mode Editor */}
                                            <div
                                                id="ebook-editor"
                                                className={`min-h-[600px] border border-slate-200 rounded-lg bg-white shadow-sm ${isEditMode ? 'block' : 'hidden'
                                                    }`}
                                            />

                                            {/* Read Mode Editor */}
                                            <div
                                                id="ebook-reader"
                                                className={`min-h-[600px] border border-slate-200 rounded-lg bg-white shadow-sm ebook-page-content ${isEditMode ? 'hidden' : 'block'
                                                    }`}
                                            />

                                            {isEditMode && (
                                                <div className="mt-4 flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            // Save is handled automatically by EditorJS onChange
                                                            console.log('Changes saved automatically');
                                                        }}
                                                        className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm transition-colors duration-200"
                                                    >
                                                        <Save className="w-4 h-4 mr-1 inline" />
                                                        Save Changes
                                                    </button>
                                                </div>
                                            )}
                                        </div>
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

        </div>
    );
};

export default CreateBooksAI;
