import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold, Italic, List, ListOrdered, Quote, Redo, Strikethrough, Undo,
  Link as LinkIcon, Highlighter, Wand2, AlignLeft, AlignCenter, AlignRight,
  AlignJustify, Heading1, Heading2, Heading3, Table as TableIcon,
  Image as ImageIcon, Youtube as YoutubeIcon, FileDown, Palette, Type,
  Eraser, Eye, MinusSquare, Underline as UnderlineIcon,
  Subscript as SubscriptIcon, Superscript as SuperscriptIcon,
  Code, CodeSquare, PanelLeftClose, PanelLeftOpen, Trash2,
  Copy, Scissors, Search, ZoomIn, ZoomOut, RotateCcw, Download,
  FileUp, Printer, Share2, Lock, Unlock, Settings, HelpCircle,
  ListChecks, Hash, AtSign
} from 'lucide-react';
import { convertToMarkdown, downloadFile } from '../lib/export';

interface MenuBarProps {
  editor: Editor | null;
}

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  const [fontSize, setFontSize] = useState('16px');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoom, setZoom] = useState(100);

  if (!editor) {
    return null;
  }

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    editor.chain().focus().setFontSize(size).run();
  };

  const handleCopy = () => {
    const content = editor.getHTML();
    navigator.clipboard.writeText(content);
  };

  const handleCut = () => {
    const content = editor.getHTML();
    navigator.clipboard.writeText(content);
    editor.commands.deleteSelection();
  };

  const handleDownload = () => {
    const content = editor.getHTML();
    const markdown = convertToMarkdown(content);
    downloadFile(markdown, 'document.md');
  };

  const handlePrint = () => {
    const content = editor.getHTML();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Document</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
              img { max-width: 100%; height: auto; }
              pre { background: #f5f5f5; padding: 15px; border-radius: 5px; }
              blockquote { border-left: 3px solid #ccc; margin: 0; padding-left: 15px; }
            </style>
          </head>
          <body>${content}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
    document.querySelector('.ProseMirror')?.style.setProperty('zoom', `${zoom + 10}%`);
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
    document.querySelector('.ProseMirror')?.style.setProperty('zoom', `${zoom - 10}%`);
  };

  const handleResetZoom = () => {
    setZoom(100);
    document.querySelector('.ProseMirror')?.style.setProperty('zoom', '100%');
  };

  return (
    <div className="sticky top-0 z-50 bg-[#0D1117] border-b border-gray-800 p-2 flex flex-wrap gap-1 items-center backdrop-blur-sm bg-opacity-95">
      {/* Text Formatting */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`toolbar-button ${editor.isActive('bold') ? 'active' : ''}`}
        title="Bold"
      >
        <Bold className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`toolbar-button ${editor.isActive('italic') ? 'active' : ''}`}
        title="Italic"
      >
        <Italic className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`toolbar-button ${editor.isActive('strike') ? 'active' : ''}`}
        title="Strikethrough"
      >
        <Strikethrough className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`toolbar-button ${editor.isActive('underline') ? 'active' : ''}`}
        title="Underline"
      >
        <UnderlineIcon className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        className={`toolbar-button ${editor.isActive('subscript') ? 'active' : ''}`}
        title="Subscript"
      >
        <SubscriptIcon className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        className={`toolbar-button ${editor.isActive('superscript') ? 'active' : ''}`}
        title="Superscript"
      >
        <SuperscriptIcon className="w-5 h-5" />
      </button>
      
      <div className="w-px h-6 bg-gray-700 mx-1" />
      
      {/* Font Controls */}
      <select
        value={fontSize}
        onChange={(e) => handleFontSizeChange(e.target.value)}
        className="toolbar-button bg-transparent text-gray-300"
        title="Font Size"
      >
        <option value="12px">12px</option>
        <option value="14px">14px</option>
        <option value="16px">16px</option>
        <option value="18px">18px</option>
        <option value="20px">20px</option>
        <option value="24px">24px</option>
        <option value="28px">28px</option>
        <option value="32px">32px</option>
      </select>
      
      <button
        onClick={() => editor.chain().focus().unsetFontSize().run()}
        className="toolbar-button"
        title="Reset Font Size"
      >
        <Type className="w-5 h-5" />
      </button>
      
      <div className="w-px h-6 bg-gray-700 mx-1" />
      
      {/* Headings */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`toolbar-button ${editor.isActive('heading', { level: 1 }) ? 'active' : ''}`}
        title="Heading 1"
      >
        <Heading1 className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`toolbar-button ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}
        title="Heading 2"
      >
        <Heading2 className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`toolbar-button ${editor.isActive('heading', { level: 3 }) ? 'active' : ''}`}
        title="Heading 3"
      >
        <Heading3 className="w-5 h-5" />
      </button>
      
      <div className="w-px h-6 bg-gray-700 mx-1" />
      
      {/* Lists */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`toolbar-button ${editor.isActive('bulletList') ? 'active' : ''}`}
        title="Bullet List"
      >
        <List className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`toolbar-button ${editor.isActive('orderedList') ? 'active' : ''}`}
        title="Ordered List"
      >
        <ListOrdered className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={`toolbar-button ${editor.isActive('taskList') ? 'active' : ''}`}
        title="Task List"
      >
        <ListChecks className="w-5 h-5" />
      </button>
      
      <div className="w-px h-6 bg-gray-700 mx-1" />
      
      {/* Alignment */}
      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`toolbar-button ${editor.isActive({ textAlign: 'left' }) ? 'active' : ''}`}
        title="Align Left"
      >
        <AlignLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`toolbar-button ${editor.isActive({ textAlign: 'center' }) ? 'active' : ''}`}
        title="Align Center"
      >
        <AlignCenter className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`toolbar-button ${editor.isActive({ textAlign: 'right' }) ? 'active' : ''}`}
        title="Align Right"
      >
        <AlignRight className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={`toolbar-button ${editor.isActive({ textAlign: 'justify' }) ? 'active' : ''}`}
        title="Justify"
      >
        <AlignJustify className="w-5 h-5" />
      </button>
      
      <div className="w-px h-6 bg-gray-700 mx-1" />
      
      {/* Code */}
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`toolbar-button ${editor.isActive('code') ? 'active' : ''}`}
        title="Inline Code"
      >
        <Code className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`toolbar-button ${editor.isActive('codeBlock') ? 'active' : ''}`}
        title="Code Block"
      >
        <CodeSquare className="w-5 h-5" />
      </button>
      
      <div className="w-px h-6 bg-gray-700 mx-1" />
      
      {/* Insert */}
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`toolbar-button ${editor.isActive('blockquote') ? 'active' : ''}`}
        title="Quote"
      >
        <Quote className="w-5 h-5" />
      </button>
      <button
        onClick={() => {
          const url = window.prompt('Enter the link URL:');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`toolbar-button ${editor.isActive('link') ? 'active' : ''}`}
        title="Add Link"
      >
        <LinkIcon className="w-5 h-5" />
      </button>
      <button
        onClick={() => {
          const url = window.prompt('Enter the image URL:');
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
        className="toolbar-button"
        title="Add Image"
      >
        <ImageIcon className="w-5 h-5" />
      </button>
      <button
        onClick={() => {
          const url = window.prompt('Enter the YouTube video URL:');
          if (url) {
            editor.chain().focus().setYoutubeVideo({ src: url }).run();
          }
        }}
        className="toolbar-button"
        title="Add YouTube Video"
      >
        <YoutubeIcon className="w-5 h-5" />
      </button>
      <button
        onClick={() => {
          const rows = parseInt(window.prompt('Number of rows:', '3') || '3');
          const cols = parseInt(window.prompt('Number of columns:', '3') || '3');
          
          editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
        }}
        className="toolbar-button"
        title="Insert Table"
      >
        <TableIcon className="w-5 h-5" />
      </button>
      <button
        onClick={() => {
          const tag = window.prompt('Enter mention name:');
          if (tag) {
            editor.chain().focus().insertContent(`@${tag}`).run();
          }
        }}
        className="toolbar-button"
        title="Add Mention"
      >
        <AtSign className="w-5 h-5" />
      </button>
      <button
        onClick={() => {
          const tag = window.prompt('Enter hashtag:');
          if (tag) {
            editor.chain().focus().insertContent(`#${tag}`).run();
          }
        }}
        className="toolbar-button"
        title="Add Hashtag"
      >
        <Hash className="w-5 h-5" />
      </button>
      
      <div className="w-px h-6 bg-gray-700 mx-1" />
      
      {/* Formatting */}
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={`toolbar-button ${editor.isActive('highlight') ? 'active' : ''}`}
        title="Highlight"
      >
        <Highlighter className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        className="toolbar-button"
        title="Clear Formatting"
      >
        <Eraser className="w-5 h-5" />
      </button>
      
      <div className="w-px h-6 bg-gray-700 mx-1" />
      
      {/* Clipboard */}
      <button onClick={handleCopy} className="toolbar-button" title="Copy">
        <Copy className="w-5 h-5" />
      </button>
      <button onClick={handleCut} className="toolbar-button" title="Cut">
        <Scissors className="w-5 h-5" />
      </button>
      
      <div className="w-px h-6 bg-gray-700 mx-1" />
      
      {/* View Controls */}
      <button
        onClick={() => setShowSearch(!showSearch)}
        className={`toolbar-button ${showSearch ? 'active' : ''}`}
        title="Search"
      >
        <Search className="w-5 h-5" />
      </button>
      {showSearch && (
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="search-input"
        />
      )}
      <button onClick={handleZoomIn} className="toolbar-button" title="Zoom In">
        <ZoomIn className="w-5 h-5" />
      </button>
      <button onClick={handleZoomOut} className="toolbar-button" title="Zoom Out">
        <ZoomOut className="w-5 h-5" />
      </button>
      <button onClick={handleResetZoom} className="toolbar-button" title="Reset Zoom">
        <RotateCcw className="w-5 h-5" />
      </button>
      
      <div className="w-px h-6 bg-gray-700 mx-1" />
      
      {/* File Operations */}
      <button onClick={handleDownload} className="toolbar-button" title="Download">
        <Download className="w-5 h-5" />
      </button>
      <button onClick={handlePrint} className="toolbar-button" title="Print">
        <Printer className="w-5 h-5" />
      </button>
      
      <div className="w-px h-6 bg-gray-700 mx-1" />
      
      {/* History */}
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="toolbar-button"
        title="Undo"
      >
        <Undo className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="toolbar-button"
        title="Redo"
      >
        <Redo className="w-5 h-5" />
      </button>
    </div>
  );
};

export default MenuBar;