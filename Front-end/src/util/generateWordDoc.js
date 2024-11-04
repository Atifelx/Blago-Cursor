import { Document, Packer, Paragraph, TextRun, HeadingLevel, ShadingType, AlignmentType, Numbering } from "docx";
import { saveAs } from 'file-saver'; // For downloading the document

// Utility function to parse text for formatting
const parseText = (text) => {
    const runs = [];
    const segments = text.split(/(<b>.*?<\/b>|<i>.*?<\/i>|<br\s*\/?>)/g).filter(Boolean);

    segments.forEach(segment => {
        if (segment.startsWith("<b>")) {
            const boldText = segment.replace(/<b>|<\/b>/g, "");
            runs.push(new TextRun({ text: boldText, bold: true }));
        } else if (segment.startsWith("<i>")) {
            const italicText = segment.replace(/<i>|<\/i>/g, "");
            runs.push(new TextRun({ text: italicText, italics: true }));
        } else if (segment === "<br>" || segment === "<br/>" || segment === "<br />") {
            runs.push(new TextRun({ text: "\n" }));
        } else {
            runs.push(new TextRun(segment));
        }
    });

    return runs;
};

// Utility function to generate and download Word document in the browser
export const generateWordFromReduxData = (editerdata) => {
    if (!editerdata || !Array.isArray(editerdata.blocks)) {
        console.error("Invalid editerdata: Expected an object with a 'blocks' array.");
        return;
    }

    const documentElements = [];
    let orderedListIndex = 0; // Track the index for ordered lists

    editerdata.blocks.forEach(block => {
        if (block.data) {
            const text = block.data.text ? block.data.text.trim() : "";

            // Handle header blocks
            if (block.type === 'header') {
                documentElements.push(new Paragraph({
                    text: text,
                    heading: HeadingLevel[`HEADING_${block.data.level}`],
                    spacing: { after: 200 },
                }));
            }

            // Handle paragraph blocks
            else if (block.type === 'paragraph') {
                const runs = parseText(text);
                documentElements.push(new Paragraph({
                    children: runs,
                    spacing: { after: 200 },
                    alignment: AlignmentType.LEFT,
                }));
            }

            // Handle unordered list blocks
            else if (block.type === 'list' && block.data.style === 'unordered') {
                // Add an empty paragraph for spacing
                documentElements.push(new Paragraph({
                    children: [new TextRun("")], // Empty paragraph for spacing
                    spacing: { after: 200 },
                }));

                block.data.items.forEach(item => {
                    const runs = parseText(item);
                    documentElements.push(new Paragraph({
                        children: runs,
                        bullet: { level: 0 }, // Level for bullet points
                        spacing: { after: 200 },
                        alignment: AlignmentType.LEFT,
                    }));
                });

                // Add an empty paragraph after the list for spacing
                documentElements.push(new Paragraph({
                    children: [new TextRun("")], // Empty paragraph for spacing
                    spacing: { after: 200 },
                }));
            }

            // Handle ordered list blocks
            else if (block.type === 'list' && block.data.style === 'ordered') {
                // Add an empty paragraph for spacing
                documentElements.push(new Paragraph({
                    children: [new TextRun("")], // Empty paragraph for spacing
                    spacing: { after: 200 },
                }));

                block.data.items.forEach(item => {
                    const runs = parseText(item);
                    documentElements.push(new Paragraph({
                        children: runs,
                        numbering: {
                            reference: `num${orderedListIndex}`, // Correctly reference numbering
                            level: 0,
                        },
                        spacing: { after: 200 },
                        alignment: AlignmentType.LEFT,
                    }));
                    orderedListIndex++; // Increment the index for ordered lists
                });

                // Add an empty paragraph after the list for spacing
                documentElements.push(new Paragraph({
                    children: [new TextRun("")], // Empty paragraph for spacing
                    spacing: { after: 200 },
                }));
            }
        }
    });

    // Create a new Document
    const doc = new Document({
        sections: [
            {
                properties: {},
                children: documentElements,
            }
        ]
    });

    // Generate the Word document as a Blob in the browser
    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, "Blago.docx"); // File name "output.docx"
        console.log("Word document generated and downloaded successfully!");
    }).catch(error => {
        console.error("Error generating Word document:", error);
    });
};
