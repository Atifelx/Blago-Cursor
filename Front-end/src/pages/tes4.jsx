import React from 'react';

const EmailContent = ({ content }) => {
    const paragraphs = content.split(/\n{2,}/).map((para, index) => para.trim()).filter(Boolean);

    return (
        <div>
            {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
        </div>
    );
};

// // Example usage
// const App = () => {
//     const content = `Email is a digital communication tool that revolutionized the way people connect, allowing the instant exchange of messages and files across the globe. It provides users with a reliable platform for both personal and professional interactions, enabling efficient information sharing and collaboration, while also supporting businesses in streamlining their operations and customer engagement.

// Over the years, email has evolved to include advanced features like filters, encryption, and integration with other applications. Its versatility makes it indispensable in daily life, serving as a record of correspondence and an essential`;

//     return (
//         <div>
//             <h1>Email Content</h1>
//             <EmailContent content={content} />
//         </div>
//     );
// };

// export default App;
