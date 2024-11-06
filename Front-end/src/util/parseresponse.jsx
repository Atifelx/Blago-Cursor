import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // GitHub flavored markdown for extra features like tables, task lists

// This function will parse the OpenAI response and render it as markdown
export const parseResponse = (text) => {
    return (
        <ReactMarkdown 
            children={text} 
            remarkPlugins={[remarkGfm]} 
            components={{
                // Custom styling for paragraphs to add space between them
                p: ({ node, children }) => <p style={{ marginBottom: '20px', color: '#1a202c' }}>{children}</p>,

                // Custom styling for headers with different font sizes
                h1: ({ node, children }) => (
                    <h1 style={{
                        color: '#1a202c', // Dark blue-gray
                        fontSize: '3rem', // Slightly reduced size, but still larger than headers
                        fontWeight: 'bold'  // Bold font weight for emphasis
                    }}>
                        {children}
                    </h1>
                ),
                h2: ({ node, children }) => (
                    <h2 style={{
                        color: '#1a202c', // Same as headers, uniform color
                        fontSize: '2.75rem',  // Slightly smaller than h1
                        fontWeight: 'bold'
                    }}>
                        {children}
                    </h2>
                ),
                h3: ({ node, children }) => (
                    <h3 style={{
                        color: '#1a202c', // Same as headers, uniform color
                        fontSize: '2.25rem', // Slightly smaller than h2
                        fontWeight: 'bold'
                    }}>
                        {children}
                    </h3>
                ),
                h4: ({ node, children }) => (
                    <h4 style={{
                        color: '#1a202c', // Same as headers, uniform color
                        fontSize: '2rem', // Slightly smaller than h3
                        fontWeight: 'bold'
                    }}>
                        {children}
                    </h4>
                ),
                h5: ({ node, children }) => (
                    <h5 style={{
                        color: '#1a202c', // Same as headers, uniform color
                        fontSize: '1.5rem', // Slightly smaller than h4
                        fontWeight: 'bold'
                    }}>
                        {children}
                    </h5>
                ),
                h6: ({ node, children }) => (
                    <h6 style={{
                        color: '#1a202c', // Same as headers, uniform color
                        fontSize: '1.25rem', // Slightly smaller than h5
                        fontWeight: 'bold'
                    }}>
                        {children}
                    </h6>
                ),

                // Styling for code blocks (inline and block-level)
                code: ({ node, inline, children }) => (
                    <code style={{
                        color: '#4a5568',             // Dark gray text color (text-700)
                        borderRadius: '5px',          // Rounded corners
                        padding: '0.2rem 0.4rem',     // Padding around the code
                        fontFamily: 'monospace',      // Monospace font for code
                        fontSize: '1rem'              // Font size for inline code
                    }}>
                        {children}
                    </code>
                ),

                // Custom styling for preformatted code blocks (```)
                pre: ({ node, children }) => (
                    <pre style={{
                        color: '#edf2f7',            // Light gray text
                        borderRadius: '8px',         // Rounded corners
                        padding: '20px',             // Padding for spacing inside the block
                        overflowX: 'auto',           // Enables horizontal scrolling if the content overflows
                        fontFamily: 'monospace',     // Monospace font for code blocks
                        fontSize: '1rem',            // Font size of the code
                    }}>
                        {children}
                    </pre>
                ),

                // Custom styling for tables to align cells from the top
                table: ({ node, children }) => (
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                        {children}
                    </table>
                ),
                tr: ({ node, children }) => (
                    <tr style={{ verticalAlign: 'top' }}>
                        {children}
                    </tr>
                ),
                td: ({ node, children }) => (
                    <td style={{ padding: '8px', border: '1px solid #ddd', verticalAlign: 'top' }}>
                        {children}
                    </td>
                ),
                th: ({ node, children }) => (
                    <th style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#edf2f7', verticalAlign: 'top' }}>
                        {children}
                    </th>
                ),

                // Custom styling for links
                a: ({ node, children, ...props }) => (
                    <a {...props} style={{ color: 'blue', textDecoration: 'underline' }}>
                        {children}
                    </a>
                ),

                // Styling for ordered and unordered lists to have the same font size and color
                ul: ({ node, children }) => (
                    <ul style={{ color: '#1a202c', fontSize: '1.125rem', marginBottom: '20px' }}>
                        {children}
                    </ul>
                ),
                ol: ({ node, children }) => (
                    <ol style={{ color: '#1a202c', fontSize: '1.125rem', marginBottom: '20px' }}>
                        {children}
                    </ol>
                ),

                // List item style
                li: ({ node, children }) => (
                    <li style={{ marginBottom: '10px' }}>
                        {children}
                    </li>
                ),
            }}
        />
    );
};
