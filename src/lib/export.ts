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
  const canvas = await html2canvas(editorElement, {
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const pdf = new jsPDF({
    orientation: 'p',
    unit: 'px',
    format: [canvas.width, canvas.height],
  });

  const imgData = canvas.toDataURL('image/png');
  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

  return pdf.output('blob');
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