import React, { useState } from 'react';
import axios from 'axios';
import { parseResponse } from '../../../util/parseresponse';

const Scrap = ({ onContentGenerated }) => {
    const [url, setUrl] = useState('');
    const [scrapedContent, setScrapedContent] = useState('');
    const [rewrittenContent, setRewrittenContent] = useState('');
    const [scraping, setScraping] = useState(false);
    const [rewriting, setRewriting] = useState(false);
    const [error, setError] = useState('');
    const [currentStep, setCurrentStep] = useState('');
    const [autoRewrite, setAutoRewrite] = useState(true);

    // Get API base URL
    const getApiBaseUrl = () => {
        if (typeof import.meta !== 'undefined' && import.meta.env) {
            return import.meta.env.VITE_API_BASE_URL || '/api';
        }
        return '/api';
    };

    const apiBaseUrl = getApiBaseUrl();

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
            // You could add a toast notification here
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    // Main scraping function
    const handleScrapeUrl = async () => {
        if (!url.trim()) {
            setError('Please enter a URL');
            return;
        }

        const normalizedUrl = normalizeUrl(url.trim());

        if (!isValidUrl(normalizedUrl)) {
            setError('Please enter a valid URL (e.g., https://example.com)');
            return;
        }

        setScraping(true);
        setError('');
        setScrapedContent('');
        setRewrittenContent('');
        setCurrentStep('Initializing scraper...');

        try {
            setCurrentStep('Connecting to scraping service...');
            
            const response = await axios.post(`${apiBaseUrl}/scraper/scrape`, {
                url: normalizedUrl
            }, {
                timeout: 60000, // 60 second timeout
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                const { content, metadata, wordCount } = response.data;
                
            setCurrentStep(`Successfully scraped ${wordCount.toLocaleString()} words`);
                setScrapedContent(content);
                
                // Auto-rewrite if enabled
                if (autoRewrite && content.trim()) {
                    setTimeout(() => {
                        handleRewriteContent(content);
                    }, 1000);
                }
            } else {
                throw new Error('Failed to scrape content');
            }

        } catch (error) {
            console.error('Scraping error:', error);
            
            if (error.response?.data?.message) {
                setError(`Scraping failed: ${error.response.data.message}`);
            } else if (error.code === 'ECONNABORTED') {
                setError('Request timeout - The website might be slow or unreachable');
            } else if (error.message.includes('Network Error')) {
                setError('Network error - Please check your internet connection');
            } else {
                setError(`Scraping failed: ${error.message}`);
            }
            
            setCurrentStep('');
        } finally {
            setScraping(false);
        }
    };

    // Rewrite content function
    const handleRewriteContent = async (content = scrapedContent) => {
        if (!content?.trim()) {
            setError('No content to rewrite');
            return;
        }

        if (!apiBaseUrl) {
            setError('API base URL not configured');
            return;
        }

        setRewriting(true);
        setError('');

        try {
            setCurrentStep('Creating unique content with AI...');
            
            const rewritePrompt = `Transform the following scraped web content into 100% unique, humanized content that is completely undetectable by AI detection tools. 

Requirements:
- Make it sound natural and human-written
- Maintain all important information and key points
- Use varied sentence structures and natural language patterns
- Add personal insights and conversational elements where appropriate
- Ensure it's completely original and plagiarism-free
- Keep the content informative and well-organized
- Use proper formatting with headings and structure

Original content to rewrite:
${content}

Please rewrite this content to be completely unique while preserving all the essential information.`;

            const response = await axios.post(`${apiBaseUrl}/askai`, {
                input: rewritePrompt
            }, {
                timeout: 120000, // 2 minute timeout for AI processing
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // The API returns the content directly as a string
            const rewrittenText = response.data;
            setRewrittenContent(rewrittenText);
            setCurrentStep('Content successfully rewritten and humanized');
            
            // Call the callback if provided
            if (onContentGenerated && typeof onContentGenerated === 'function') {
                onContentGenerated(rewrittenText);
            }

        } catch (error) {
            console.error('Rewrite error:', error);
            
            if (error.response?.data?.error) {
                setError(`Rewriting failed: ${error.response.data.error}`);
            } else if (error.response?.data?.details) {
                setError(`Rewriting failed: ${error.response.data.details}`);
            } else if (error.code === 'ECONNABORTED') {
                setError('AI processing timeout - Please try again');
            } else {
                setError(`Rewriting failed: ${error.message}`);
            }
            
            setCurrentStep('');
        } finally {
            setRewriting(false);
        }
    };

    return (
        <div className="space-y-6 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Web Content Scraper</h2>
                <p className="text-gray-600">Extract and rewrite content from any website</p>
                        </div>

            {/* URL Input Section */}
            <div className="space-y-4">
                <div className="flex gap-3">
                        <input
                        type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter website URL (e.g., https://example.com)"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        disabled={scraping}
                            onKeyPress={(e) => e.key === 'Enter' && !scraping && handleScrapeUrl()}
                        />
                        <button
                            onClick={handleScrapeUrl}
                            disabled={scraping || !url.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
                        >
                            {scraping ? 'Scraping...' : 'Scrape'}
                        </button>
                </div>

                {/* Auto-rewrite toggle */}
                <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <input
                        type="checkbox"
                        id="auto-rewrite"
                        checked={autoRewrite}
                        onChange={(e) => setAutoRewrite(e.target.checked)}
                        className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="auto-rewrite" className="text-sm text-gray-700 font-medium">
                        Automatically rewrite content after scraping
                    </label>
                </div>
            </div>

            {/* Status Display */}
                    {currentStep && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
                        <span className="text-sm text-blue-700 font-medium">{currentStep}</span>
                    </div>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-start">
                        <span className="text-red-500 mr-3 text-lg">⚠️</span>
                        <span className="text-sm text-red-700">{error}</span>
                    </div>
                </div>
            )}

            {/* Scraped Content Display */}
            {scrapedContent && (
                <div className="space-y-4 border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <h3 className="text-lg font-bold text-gray-800">Scraped Content</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => copyToClipboard(scrapedContent)}
                                className="text-sm bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                                Copy
                            </button>
                            {!autoRewrite && (
                                <button
                                    onClick={() => handleRewriteContent()}
                                    disabled={rewriting}
                                    className="text-sm bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 disabled:opacity-50 transition-colors font-medium"
                                >
                                    {rewriting ? 'Rewriting...' : 'Rewrite'}
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto bg-white p-4 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {scrapedContent.length > 1000 
                                ? `${scrapedContent.substring(0, 1000)}...` 
                                : scrapedContent
                            }
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 bg-white p-2 rounded-lg border border-gray-200">
                        📊 {scrapedContent.split(' ').length.toLocaleString()} words • {scrapedContent.length.toLocaleString()} characters
                    </div>
                </div>
            )}

            {/* Rewritten Content Display */}
            {rewrittenContent && (
                <div className="space-y-4 border border-green-200 rounded-lg p-6 bg-gradient-to-br from-white to-green-50">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center">
                            AI Rewritten Content 
                            <span className="ml-3 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                                100% Unique & Humanized
                            </span>
                        </h3>
                        <button
                            onClick={() => copyToClipboard(rewrittenContent)}
                            className="text-sm bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors font-medium"
                        >
                            Copy Content
                        </button>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg border border-green-200">
                        <div className="prose prose-sm max-w-none">
                            {parseResponse(rewrittenContent)}
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-gray-600 bg-white p-3 rounded-lg border border-green-100">
                        <div className="flex items-center gap-4">
                            <span>📝 {rewrittenContent.split(' ').length.toLocaleString()} words</span>
                            <span>📄 {rewrittenContent.length.toLocaleString()} characters</span>
                        </div>
                        <div className="flex items-center text-green-600">
                            <span className="animate-pulse">✨</span>
                            <span className="ml-1 font-medium">AI Enhanced Content</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Scrap;
