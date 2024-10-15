export const convertApiResponseToEditorBlocks = (data) => {
    // Check if data is valid and contains relevant properties
    if (!data || (!data.editorData && !data.blocks)) {
        console.error("Invalid data format:", data);
        return {
            time: Date.now(),
            blocks: [],
        }; // Return a default structure
    }

    // Initialize an array to hold blocks
    const blocks = [];

    // Add editorData if present
    if (data.editorData) {
        blocks.push({
            type: 'paragraph',
            data: { text: data.editorData },
        });
    }

    // Add blocks if present
    if (data.blocks) {
        // Assuming `data.blocks` is a string. If it's an array or object, adjust accordingly.
        if (typeof data.blocks === 'string') {
            const additionalBlocks = data.blocks.split('\n').map(line => line.trim()).filter(line => line.length > 0);

            additionalBlocks.forEach(line => {
                // Determine the type of each line and create the appropriate block
                if (line.startsWith('# ')) {
                    blocks.push({
                        type: 'header',
                        data: { text: line.slice(2), level: 1 },
                    });
                } else if (line.startsWith('## ')) {
                    blocks.push({
                        type: 'header',
                        data: { text: line.slice(3), level: 2 },
                    });
                } else if (line.startsWith('### ')) {
                    blocks.push({
                        type: 'header',
                        data: { text: line.slice(4), level: 3 },
                    });
                } else if (line.startsWith('- ') || line.startsWith('* ')) {
                    const listItem = line.slice(2);
                    // Check for the last block to determine if it's a list
                    const lastBlock = blocks[blocks.length - 1];
                    if (lastBlock && lastBlock.type === 'list') {
                        lastBlock.data.items.push(listItem);
                    } else {
                        blocks.push({
                            type: 'list',
                            data: { items: [listItem] },
                        });
                    }
                } else if (line.startsWith('> ')) {
                    blocks.push({
                        type: 'quote',
                        data: { text: line.slice(2) },
                    });
                } else {
                    blocks.push({
                        type: 'paragraph',
                        data: { text: line },
                    });
                }
            });
        } else if (Array.isArray(data.blocks)) {
            // If data.blocks is already an array, map it directly
            data.blocks.forEach(block => {
                // Ensure block has the expected structure
                blocks.push(block);
            });
        }
    }

    // Log the generated blocks
    console.log("Generated blocks:", blocks);

    // Return the complete structure
    return {
        time: Date.now(),
        blocks: blocks,
    }; 
};
