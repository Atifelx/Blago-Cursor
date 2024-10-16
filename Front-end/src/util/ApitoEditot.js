export const convertApiResponseToEditorBlocks = (data) => {
    if (!data || (!data.editorData && !data.blocks)) {
        console.error("Invalid data format:", data);
        return { time: Date.now(), blocks: [] }; // Return a default structure
    }

    const blocks = [];

    const addParagraph = (text) => {
        if (text.trim()) {
            blocks.push({ type: 'paragraph', data: { text: formatText(text.trim()) } });
        }
    };

    const formatText = (text) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Bold
            .replace(/\*(.*?)\*/g, '<i>$1</i>'); // Italics
    };

    const addHeader = (line) => {
        const level = line.match(/^#+/)[0].length;
        blocks.push({ type: 'header', data: { text: line.slice(level + 1).trim(), level } });
    };

    const addList = (line, style) => {
        const listItem = line.replace(/^\d+\.\s|- |\* /, '').trim();
        const lastBlock = blocks[blocks.length - 1];

        // Create or append to the list
        if (lastBlock && lastBlock.type === 'list' && lastBlock.data.style === style) {
            lastBlock.data.items.push(formatText(listItem)); // Format the item before adding
        } else {
            blocks.push({ type: 'list', data: { items: [formatText(listItem)], style } });
        }
    };

    const processLines = (lines) => {
        lines.forEach(line => {
            if (!line.trim()) return; // Skip empty lines

            if (line.startsWith('#')) {
                addHeader(line);
            } else if (/^\d+\.\s/.test(line)) {
                addList(line, 'ordered');
            } else if (line.startsWith('- ') || line.startsWith('* ')) {
                addList(line, 'unordered');
            } else {
                addParagraph(line); // Treat any other line as a paragraph
            }
        });
    };

    if (data.editorData) {
        // Split by new lines, not double new lines
        const lines = data.editorData.split('\n');
        processLines(lines);
    }

    if (typeof data.blocks === 'string') {
        const additionalBlocks = data.blocks.split('\n');
        processLines(additionalBlocks);
    }

    return { time: Date.now(), blocks };
};
