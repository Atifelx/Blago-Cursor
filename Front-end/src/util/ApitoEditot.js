export const convertApiResponseToEditorBlocks = (data) => {
    // Check if data is valid and contains relevant properties
    if (!data || (!data.editorData && !data.blocks)) {
        console.error("Invalid data format:", data);
        return { time: new Date().getTime(), blocks: [] };
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
        // Assuming `blocks` is a string. If it's an array or object, adjust accordingly.
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
                blocks.push({
                    type: 'list',
                    data: { items: [line.slice(2)] },
                });
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
    }

    // Log the generated blocks
    console.log("Generated blocks:", blocks);

    return {
        time: new Date().getTime(),
        blocks,
    };
};
