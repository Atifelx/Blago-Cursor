export const converttoToEditor = (data) => {
  if (!data || (!data.editorData && !data.blocks)) {
      console.error("Invalid data format:", data);
      return { time: Date.now(), blocks: [] }; // Return a default structure
  }

  const blocks = [];

  // Helper function to format bold and italic text
  const formatText = (text) => {
      // Ensure only supported inline HTML tags are used
      return text
          .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Bold (**text**)
          .replace(/\*(.*?)\*/g, '<i>$1</i>');    // Italics (*text*)
  };

  // Function to add a paragraph block
  const addParagraph = (text) => {
      const formattedText = formatText(text.trim());

      // Ensure no block-level HTML like <p> is included in the text
      if (formattedText && formattedText.indexOf('<p>') === -1) {
          blocks.push({
              type: 'paragraph',
              data: { text: formattedText } // Plain text or inline HTML
          });
      } else {
          console.error("Invalid paragraph content:", formattedText);
      }
  };

  // Function to add a header block (H1, H2, H3, etc.)
  const addHeader = (line) => {
      const level = line.match(/^#+/)[0].length; // Count the number of '#' for the header level
      blocks.push({
          type: 'header',
          data: {
              text: formatText(line.slice(level).trim()), // Remove the '#' and trim the text
              level: level
          }
      });
  };

  // Function to add a list (ordered or unordered)
  const addList = (line, style) => {
      const listItem = line.replace(/^\d+\.\s|- |\* /, '').trim(); // Remove list markers
      const lastBlock = blocks[blocks.length - 1];

      // If the last block is a list of the same style, append the new item to it
      if (lastBlock && lastBlock.type === 'list' && lastBlock.data.style === style) {
          lastBlock.data.items.push(formatText(listItem));
      } else {
          // Otherwise, create a new list block
          blocks.push({
              type: 'list',
              data: {
                  items: [formatText(listItem)],
                  style: style // "ordered" or "unordered"
              }
          });
      }
  };

  // Function to process each line of the text
  const processLines = (lines) => {
      lines.forEach(line => {
          if (!line.trim()) return; // Skip empty lines

          if (line.startsWith('#')) {
              addHeader(line); // Headers starting with '#'
          } else if (/^\d+\.\s/.test(line)) {
              addList(line, 'ordered'); // Ordered list (e.g., 1., 2., 3.)
          } else if (line.startsWith('- ') || line.startsWith('* ')) {
              addList(line, 'unordered'); // Unordered list (e.g., - or *)
          } else {
              addParagraph(line); // Default to paragraph if no other format matches
          }
      });
  };

  // If editorData exists, process it line by line
  if (data.editorData) {
      const lines = data.editorData.split('\n'); // Split by newlines
      processLines(lines); // Process each line
  }

  // If data.blocks is provided as a string, process it as well
  if (typeof data.blocks === 'string') {
      const additionalBlocks = data.blocks.split('\n'); // Split by newlines
      processLines(additionalBlocks);
  }

  // Return the final block structure for Editor.js
  return { time: Date.now(), blocks };
};
