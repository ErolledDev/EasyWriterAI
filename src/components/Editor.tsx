import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import FontFamily from '@tiptap/extension-font-family';
import {
  Bold, Italic, List, ListOrdered, Quote, Redo, Strikethrough, Undo,
  Link as LinkIcon, Highlighter, Wand2, AlignLeft, AlignCenter, AlignRight,
  AlignJustify, Heading1, Heading2, Heading3, Table as TableIcon,
  Image as ImageIcon, Youtube as YoutubeIcon, FileDown, Palette, Type,
  Eraser, Eye, MinusSquare, Underline as UnderlineIcon,
  Subscript as SubscriptIcon, Superscript as SuperscriptIcon,
  Code, CodeSquare, PanelLeftClose, PanelLeftOpen, Trash2,
  Copy, Scissors, Search, ZoomIn, ZoomOut, RotateCcw, Download,
  FileUp, Printer, Share2, Lock, Unlock, Settings, HelpCircle
} from 'lucide-react';
import { useState, useCallback, useRef } from 'react';
import AIMenu from './AIMenu';
import { convertToMarkdown, downloadFile } from '../lib/export';

const FONT_SIZES = [
  '8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px', '20px', 
  '22px', '24px', '26px', '28px', '36px', '48px', '72px'
];

const FONT_FAMILIES = [
  'Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana',
  'Helvetica', 'Tahoma', 'Trebuchet MS', 'Impact', 'Comic Sans MS'
];

const Tooltip = ({ children, text }: { children: React.ReactNode; text: string }) => {
  return (
    <div className="group relative">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
        {text}
      </div>
    </div>
  );
};

const MenuBar = ({ editor }: { editor: any }) => {
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);
  const [showFontFamily, setShowFontFamily] = useState(false);
  const [isFullWidth, setIsFullWidth] = useState(true);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [zoom, setZoom] = useState(100);
  const searchInputRef = useRef<HTMLInputElement>(null);

  if (!editor) return null;

  const handleCopy = () => {
    const text = editor.state.selection.empty
      ? editor.getText()
      : editor.state.doc.textBetween(
          editor.state.selection.from,
          editor.state.selection.to
        );
    navigator.clipboard.writeText(text);
  };

  const handleCut = () => {
    handleCopy();
    if (!editor.state.selection.empty) {
      editor.commands.deleteSelection();
    }
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
              body { font-family: Arial, sans-serif; padding: 20px; }
              img { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>${content}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleSearch = () => {
    const searchTerm = searchInputRef.current?.value;
    if (!searchTerm) return;

    const text = editor.getText();
    const regex = new RegExp(searchTerm, 'gi');
    let match;
    const positions: number[] = [];

    while ((match = regex.exec(text)) !== null) {
      positions.push(match.index);
    }

    // Highlight matches (you would need to implement this based on your needs)
    // This is a simple example that could be enhanced
    editor.commands.unsetHighlight();
    positions.forEach(pos => {
      editor.commands.setTextSelection({ from: pos, to: pos + searchTerm.length });
      editor.commands.setHighlight();
    });
  };

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL', previousUrl);
    
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addYoutubeVideo = () => {
    const url = window.prompt('Enter YouTube video URL');
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  const insertTable = () => {
    const rows = window.prompt('Number of rows:', '3');
    const cols = window.prompt('Number of columns:', '3');
    
    if (rows && cols) {
      editor.chain().focus().insertTable({ 
        rows: parseInt(rows), 
        cols: parseInt(cols), 
        withHeaderRow: true 
      }).run();
    }
  };

  const handleExport = (format: 'markdown' | 'html' | 'text') => {
    const content = format === 'html' 
      ? editor.getHTML()
      : format === 'markdown'
        ? convertToMarkdown(editor.getHTML())
        : editor.getText();
    
    downloadFile(content, `document.${format === 'text' ? 'txt' : format}`);
  };

  const clearContent = () => {
    if (window.confirm('Are you sure you want to clear all content?')) {
      editor.chain().focus().clearContent().run();
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const newZoom = direction === 'in' ? zoom + 10 : zoom - 10;
    setZoom(Math.max(50, Math.min(200, newZoom)));
    const editorElement = document.querySelector('.ProseMirror');
    if (editorElement) {
      (editorElement as HTMLElement).style.transform = `scale(${newZoom / 100})`;
      (editorElement as HTMLElement).style.transformOrigin = 'top left';
    }
  };

  return (
    <div className="border-b border-gray-200">
      {/* Main Toolbar */}
      <div className="p-2 flex flex-wrap gap-2 border-b border-gray-200">
        {/* File Operations */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <Tooltip text="New Document">
            <button
              onClick={clearContent}
              className="p-2 rounded hover:bg-gray-100"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Import File">
            <button className="p-2 rounded hover:bg-gray-100">
              <FileUp className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Export">
            <div className="relative group">
              <button className="p-2 rounded hover:bg-gray-100">
                <FileDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block z-50">
                <button
                  onClick={() => handleExport('markdown')}
                  className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                >
                  Export as Markdown
                </button>
                <button
                  onClick={() => handleExport('html')}
                  className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                >
                  Export as HTML
                </button>
                <button
                  onClick={() => handleExport('text')}
                  className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                >
                  Export as Text
                </button>
              </div>
            </div>
          </Tooltip>
        </div>

        {/* Edit Operations */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <Tooltip text="Copy">
            <button
              onClick={handleCopy}
              className="p-2 rounded hover:bg-gray-100"
            >
              <Copy className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Cut">
            <button
              onClick={handleCut}
              className="p-2 rounded hover:bg-gray-100"
            >
              <Scissors className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>

        {/* Text Style */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <Tooltip text="Bold">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor.isActive('bold') ? 'bg-gray-100' : ''
              }`}
            >
              <Bold className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Italic">
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor.isActive('italic') ? 'bg-gray-100' : ''
              }`}
            >
              <Italic className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Underline">
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor.isActive('underline') ? 'bg-gray-100' : ''
              }`}
            >
              <UnderlineIcon className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Strikethrough">
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor.isActive('strike') ? 'bg-gray-100' : ''
              }`}
            >
              <Strikethrough className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>

        {/* Font Controls */}
        <div className="flex items-center gap-2 pr-2 border-r border-gray-200">
          <div className="relative">
            <Tooltip text="Font Family">
              <button
                onClick={() => setShowFontFamily(!showFontFamily)}
                className="p-2 rounded hover:bg-gray-100 flex items-center gap-1 min-w-[120px]"
              >
                <Type className="w-4 h-4" />
                <span className="text-sm">Font Family</span>
              </button>
            </Tooltip>
            {showFontFamily && (
              <div className="absolute top-full left-0 mt-1 p-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 w-48 max-h-60 overflow-y-auto">
                {FONT_FAMILIES.map(font => (
                  <button
                    key={font}
                    onClick={() => {
                      editor.chain().focus().setFontFamily(font).run();
                      setShowFontFamily(false);
                    }}
                    className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <Tooltip text="Font Size">
              <button
                onClick={() => setShowFontSize(!showFontSize)}
                className="p-2 rounded hover:bg-gray-100 flex items-center gap-1 min-w-[100px]"
              >
                <span className="text-sm">Font Size</span>
              </button>
            </Tooltip>
            {showFontSize && (
              <div className="absolute top-full left-0 mt-1 p-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 w-32 max-h-60 overflow-y-auto">
                {FONT_SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => {
                      editor.chain().focus().setFontSize(size).run();
                      setShowFontSize(false);
                    }}
                    className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                    style={{ fontSize: size }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <Tooltip text="Text Color">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-2 rounded hover:bg-gray-100"
              >
                <Palette className="w-4 h-4" />
              </button>
            </Tooltip>
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1 p-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 w-56">
                <div className="grid grid-cols-8 gap-1">
                  {[
                    '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#FFFFFF',
                    '#FF0000', '#FF9C00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#9C00FF', '#FF00FF',
                    '#F44E3B', '#FE9200', '#FCDC00', '#DBDF00', '#A4DD00', '#68CCCA', '#73D8FF', '#AEA1FF',
                    '#FDA1FF', '#333333', '#808080', '#cccccc', '#D33115', '#E27300', '#FCC400', '#B0BC00'
                  ].map(color => (
                    <button
                      key={color}
                      onClick={() => {
                        editor.chain().focus().setColor(color).run();
                        setShowColorPicker(false);
                      }}
                      className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <Tooltip text="Zoom In">
            <button
              onClick={() => handleZoom('in')}
              className="p-2 rounded hover:bg-gray-100"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Zoom Out">
            <button
              onClick={() => handleZoom('out')}
              className="p-2 rounded hover:bg-gray-100"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </Tooltip>
          <span className="text-sm text-gray-500">{zoom}%</span>
        </div>

        {/* Search */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search..."
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          />
          <Tooltip text="Search">
            <button
              onClick={handleSearch}
              className="p-2 rounded hover:bg-gray-100"
            >
              <Search className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>

        {/* Right-aligned tools */}
        <div className="flex items-center gap-2 ml-auto">
          <Tooltip text="Print">
            <button
              onClick={handlePrint}
              className="p-2 rounded hover:bg-gray-100"
            >
              <Printer className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip text="Share">
            <button className="p-2 rounded hover:bg-gray-100">
              <Share2 className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip text={isReadOnly ? "Unlock Editing" : "Lock Editing"}>
            <button
              onClick={() => {
                setIsReadOnly(!isReadOnly);
                editor.setEditable(!isReadOnly);
              }}
              className="p-2 rounded hover:bg-gray-100"
            >
              {isReadOnly ? (
                <Lock className="w-4 h-4" />
              ) : (
                <Unlock className="w-4 h-4" />
              )}
            </button>
          </Tooltip>

          <Tooltip text="Settings">
            <button className="p-2 rounded hover:bg-gray-100">
              <Settings className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip text="Help">
            <button className="p-2 rounded hover:bg-gray-100">
              <HelpCircle className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip text="AI Assistant">
            <button
              onClick={() => setShowAIMenu(!showAIMenu)}
              className={`p-2 rounded hover:bg-purple-100 ${
                showAIMenu ? 'bg-purple-100' : ''
              }`}
            >
              <Wand2 className="w-4 h-4 text-purple-600" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Secondary Toolbar */}
      <div className="p-2 flex flex-wrap gap-2">
        {/* Lists and Quotes */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <Tooltip text="Bullet List">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor.isActive('bulletList') ? 'bg-gray-100' : ''
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Numbered List">
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor.isActive('orderedList') ? 'bg-gray-100' : ''
              }`}
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Quote">
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor.isActive('blockquote') ? 'bg-gray-100' : ''
              }`}
            >
              <Quote className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>

        {/* Script Controls */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <Tooltip text="Subscript">
            <button
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor.isActive('subscript') ? 'bg-gray-100' : ''
              }`}
            >
              <SubscriptIcon className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Superscript">
            <button
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor.isActive('superscript') ? 'bg-gray-100' : ''
              }`}
            >
              <SuperscriptIcon className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>

        {/* Code */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <Tooltip text="Inline Code">
            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor.isActive('code') ? 'bg-gray-100' : ''
              }`}
            >
              <Code className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Code Block">
            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor.isActive('codeBlock') ? 'bg-gray-100' : ''
              }`}
            >
              <CodeSquare className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>

        {/* Insert Tools */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <Tooltip text="Insert Link">
            <button
              onClick={addLink}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor.isActive('link') ? 'bg-gray-100' : ''
              }`}
            >
              <LinkIcon className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Insert Table">
            <button
              onClick={insertTable}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor.isActive('table') ? 'bg-gray-100' : ''
              }`}
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Insert Image">
            <button
              onClick={addImage}
              className="p-2 rounded hover:bg-gray-100"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Insert YouTube Video">
            <button
              onClick={addYoutubeVideo}
              className="p-2 rounded hover:bg-gray-100"
            >
              <YoutubeIcon className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Insert Horizontal Rule">
            <button
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="p-2 rounded hover:bg-gray-100"
            >
              <MinusSquare className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>

        {/* Formatting Tools */}
        <div className="flex items-center gap-1">
          <Tooltip text="Highlight">
            <button
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor.isActive('highlight') ? 'bg-gray-100' : ''
              }`}
            >
              <Highlighter className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Clear Formatting">
            <button
              onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
              className="p-2 rounded hover:bg-gray-100"
            >
              <Eraser className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default function Editor() {
  const [showAIMenu, setShowAIMenu] = useState(false);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 hover:text-blue-600 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-lg shadow-md',
        },
      }),
      Youtube.configure({
        width: 640,
        height: 480,
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-lg shadow-md',
        },
      }),
      TextStyle,
      Color,
      Typography,
      Underline,
      Subscript,
      Superscript,
      FontFamily,
      Placeholder.configure({
        placeholder: 'Write something amazing...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none p-4 min-h-[200px]',
      },
    },
    onFocus: () => {
      setShowAIMenu(true);
    },
  });

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <AIMenu
        editor={editor}
        isOpen={showAIMenu}
        onClose={() => setShowAIMenu(false)}
      />
    </div>
  );
}