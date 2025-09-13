import axios from 'axios';
import { errorHandler } from '../utils/error.js';

// Enhanced web scraper with multiple fallback strategies
export const scrapeUrl = async (req, res, next) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return next(errorHandler(400, 'URL is required'));
    }

    // Validate URL
    try {
      new URL(url);
    } catch (error) {
      return next(errorHandler(400, 'Invalid URL format'));
    }

    console.log(`Scraping URL: ${url}`);

    // Multiple scraping strategies with fallbacks
    const strategies = [
      // Strategy 1: Direct fetch with proper headers
      async () => {
        const response = await axios.get(url, {
          timeout: 30000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
          },
          maxRedirects: 5,
        });
        return response.data;
      },
      
      // Strategy 2: Using CORS proxy
      async () => {
        const corsProxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const response = await axios.get(corsProxyUrl, {
          timeout: 25000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          }
        });
        
        if (response.data?.contents) {
          return response.data.contents;
        }
        throw new Error('No content from CORS proxy');
      },

      // Strategy 3: Alternative proxy service
      async () => {
        const proxyUrl = `https://thingproxy.freeboard.io/fetch/${url}`;
        const response = await axios.get(proxyUrl, {
          timeout: 25000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          }
        });
        return response.data;
      }
    ];

    let htmlContent = '';
    let strategyUsed = '';

    // Try each strategy until one works
    for (let i = 0; i < strategies.length; i++) {
      try {
        console.log(`Trying strategy ${i + 1}...`);
        htmlContent = await strategies[i]();
        strategyUsed = `Strategy ${i + 1}`;
        console.log(`Strategy ${i + 1} successful`);
        break;
      } catch (error) {
        console.log(`Strategy ${i + 1} failed:`, error.message);
        if (i === strategies.length - 1) {
          throw new Error(`All scraping strategies failed. Last error: ${error.message}`);
        }
      }
    }

    if (!htmlContent || htmlContent.length < 100) {
      return next(errorHandler(400, 'Failed to retrieve content from the URL'));
    }

    // Extract text content from HTML
    const extractedText = extractTextFromHTML(htmlContent);
    
    if (!extractedText.trim() || extractedText.length < 50) {
      return next(errorHandler(400, 'No meaningful text content found on the page'));
    }

    // Extract metadata
    const metadata = extractMetadata(htmlContent, url);

    res.json({
      success: true,
      content: extractedText,
      metadata: metadata,
      strategy: strategyUsed,
      wordCount: extractedText.split(/\s+/).filter(word => word.length > 0).length,
      characterCount: extractedText.length
    });

  } catch (error) {
    console.error('Scraping error:', error);
    next(errorHandler(500, `Scraping failed: ${error.message}`));
  }
};

// Enhanced HTML text extraction
function extractTextFromHTML(html) {
  try {
    // Remove script and style elements
    let cleanHtml = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '')
      .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
      .replace(/<object[^>]*>[\s\S]*?<\/object>/gi, '')
      .replace(/<embed[^>]*>[\s\S]*?<\/embed>/gi, '');

    // Remove HTML tags but preserve line breaks
    let text = cleanHtml
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<\/h[1-6]>/gi, '\n\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'");

    // Clean up whitespace
    text = text
      .replace(/\s+/g, ' ')
      .replace(/\n\s+/g, '\n')
      .replace(/\s+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return text;
  } catch (error) {
    console.error('Text extraction error:', error);
    return '';
  }
}

// Extract metadata from HTML
function extractMetadata(html, url) {
  try {
    const metadata = {
      url: url,
      title: 'Unknown Title',
      description: '',
      keywords: '',
      author: '',
      publishedDate: '',
      domain: new URL(url).hostname
    };

    // Extract title
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    if (titleMatch) {
      metadata.title = titleMatch[1].replace(/\s+/g, ' ').trim();
    }

    // Extract meta description
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
    if (descMatch) {
      metadata.description = descMatch[1].trim();
    }

    // Extract meta keywords
    const keywordsMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']*)["']/i);
    if (keywordsMatch) {
      metadata.keywords = keywordsMatch[1].trim();
    }

    // Extract author
    const authorMatch = html.match(/<meta[^>]*name=["']author["'][^>]*content=["']([^"']*)["']/i);
    if (authorMatch) {
      metadata.author = authorMatch[1].trim();
    }

    // Extract published date
    const dateMatch = html.match(/<meta[^>]*property=["']article:published_time["'][^>]*content=["']([^"']*)["']/i) ||
                     html.match(/<meta[^>]*name=["']date["'][^>]*content=["']([^"']*)["']/i);
    if (dateMatch) {
      metadata.publishedDate = dateMatch[1].trim();
    }

    return metadata;
  } catch (error) {
    console.error('Metadata extraction error:', error);
    return {
      url: url,
      title: 'Unknown Title',
      description: '',
      keywords: '',
      author: '',
      publishedDate: '',
      domain: new URL(url).hostname
    };
  }
}
