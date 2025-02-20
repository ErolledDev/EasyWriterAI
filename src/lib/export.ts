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

// Convert external image to base64
async function convertImageToBase64(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(imageUrl, {
      mode: 'cors',
      credentials: 'omit'
    });
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image:', error);
    return imageUrl; // Return original URL if conversion fails
  }
}

// Add image compression function with improved quality
async function compressImage(imageElement: HTMLImageElement): Promise<string> {
  const maxWidth = 800; // Optimal width for PDF documents
  const quality = 0.85; // Increased quality for better resolution

  // Create a new image to handle cross-origin images
  const img = new Image();
  img.crossOrigin = 'anonymous';
  
  try {
    // Convert external images to base64
    if (!imageElement.src.startsWith('data:')) {
      const base64Url = await convertImageToBase64(imageElement.src);
      img.src = base64Url;
    } else {
      img.src = imageElement.src;
    }

    // Wait for image to load
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    const canvas = document.createElement('canvas');
    let width = img.naturalWidth;
    let height = img.naturalHeight;

    // Calculate new dimensions while maintaining aspect ratio
    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Apply image smoothing for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw and compress image
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', quality);
  } catch (error) {
    console.error('Error compressing image:', error);
    return imageElement.src; // Return original source if compression fails
  }
}

// Optimize PDF generation
export async function convertToPDF(editorElement: HTMLElement): Promise<Blob> {
  const clone = editorElement.cloneNode(true) as HTMLElement;
  const tempContainer = document.createElement('div');
  tempContainer.appendChild(clone);
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.background = 'white';
  document.body.appendChild(tempContainer);

  try {
    // Process images in parallel
    const images = Array.from(clone.getElementsByTagName('img'));
    await Promise.all(images.map(async (img) => {
      if (img.src.startsWith('data:image')) return;
      
      img.crossOrigin = 'anonymous';
      try {
        const compressedDataUrl = await compressImage(img);
        img.src = compressedDataUrl;
        
        // Optimize image styles
        Object.assign(img.style, {
          display: 'block',
          margin: '2rem auto',
          height: 'auto',
          maxWidth: '500px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          borderRadius: '6px',
        });
      } catch (error) {
        console.warn('Image processing failed:', error);
      }
    }));

    // Enhanced canvas settings
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: 'white',
      imageTimeout: 15000,
      onclone: (clonedDoc) => {
        const style = clonedDoc.createElement('style');
        style.innerHTML = `
          * { -webkit-print-color-adjust: exact !important; }
          @page { margin: 1cm; }
          @media print {
            body { margin: 0; }
            img { max-width: 100% !important; }
          }
        `;
        clonedDoc.head.appendChild(style);
      }
    });

    // Optimize PDF generation
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'a4',
      compress: true,
      hotfixes: ['px_scaling'],
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgData, 'JPEG', 0, 0, 595.28, 841.89, undefined, 'FAST');

    return pdf.output('blob');
  } finally {
    if (document.body.contains(tempContainer)) {
      document.body.removeChild(tempContainer);
    }
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