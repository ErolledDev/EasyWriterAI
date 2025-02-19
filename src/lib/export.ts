import TurndownService from 'turndown';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '_',
});

export function convertToMarkdown(html: string): string {
  return turndownService.turndown(html);
}

export function convertToPlainText(html: string): string {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
}

export async function convertToPDF(editorElement: HTMLElement): Promise<Blob> {
  // Create a clone of the editor element to modify for PDF export
  const clone = editorElement.cloneNode(true) as HTMLElement;
  const tempContainer = document.createElement('div');
  tempContainer.appendChild(clone);
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.background = 'white';
  document.body.appendChild(tempContainer);

  // Add margins to the clone
  clone.style.padding = '40px';
  clone.style.background = 'white';
  clone.style.color = '#1a1a1a';

  // Fix heading colors
  const headings = clone.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach(heading => {
    heading.style.color = '#1a1a1a';
    heading.style.background = 'none';
    heading.style.backgroundClip = 'initial';
    heading.style.webkitBackgroundClip = 'initial';
    heading.style.webkitTextFillColor = 'initial';
  });

  // Ensure links are visible and blue
  const links = clone.querySelectorAll('a');
  links.forEach(link => {
    link.style.color = '#2563eb';
    link.style.textDecoration = 'underline';
  });

  // Ensure all text is visible
  const allText = clone.querySelectorAll('p, span, li, td, th, blockquote');
  allText.forEach(element => {
    (element as HTMLElement).style.color = '#1a1a1a';
  });

  try {
    // Capture the modified clone
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: 'white',
    });

    // Remove the temporary container
    document.body.removeChild(tempContainer);

    // Calculate PDF dimensions with margins
    const imgWidth = 595.28; // A4 width in points
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF({
      orientation: imgHeight > imgWidth ? 'p' : 'l',
      unit: 'pt',
      format: [imgWidth, imgHeight],
    });

    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    return pdf.output('blob');
  } catch (error) {
    // Clean up on error
    if (document.body.contains(tempContainer)) {
      document.body.removeChild(tempContainer);
    }
    throw error;
  }
}

export type ExportFormat = 'markdown' | 'html' | 'txt' | 'pdf';

export async function downloadFile(
  content: string | HTMLElement,
  filename: string,
  format: ExportFormat
) {
  let blob: Blob;
  let finalFilename = filename;

  switch (format) {
    case 'markdown':
      if (typeof content === 'string') {
        const markdown = convertToMarkdown(content);
        blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
        finalFilename = filename.endsWith('.md') ? filename : `${filename}.md`;
      } else {
        throw new Error('HTML element provided for markdown conversion');
      }
      break;

    case 'html':
      if (typeof content === 'string') {
        blob = new Blob([content], { type: 'text/html;charset=utf-8' });
        finalFilename = filename.endsWith('.html') ? filename : `${filename}.html`;
      } else {
        throw new Error('HTML element provided for HTML conversion');
      }
      break;

    case 'txt':
      if (typeof content === 'string') {
        const plainText = convertToPlainText(content);
        blob = new Blob([plainText], { type: 'text/plain;charset=utf-8' });
        finalFilename = filename.endsWith('.txt') ? filename : `${filename}.txt`;
      } else {
        throw new Error('HTML element provided for text conversion');
      }
      break;

    case 'pdf':
      if (content instanceof HTMLElement) {
        blob = await convertToPDF(content);
        finalFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
      } else {
        throw new Error('String content provided for PDF conversion');
      }
      break;

    default:
      throw new Error('Unsupported export format');
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = finalFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}