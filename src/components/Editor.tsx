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
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Undo,
  Link as LinkIcon,
  Highlighter,
  Wand2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  Table as TableIcon,
  Image as ImageIcon,
  Youtube as YoutubeIcon,
  FileDown,
  Palette,
  Type,
  Eraser,
  Eye,
  MinusSquare,
  Underline as UnderlineIcon,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Code,
  CodeSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import AIMenu from './AIMenu';
import { convertToMarkdown, downloadFile } from '../lib/export';

const FONT_SIZES = [
  '8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px', '20px', 
  '22px', '24px', '26px', '28px', '36px', '48px', '72px'
];

const FONT_FAMILIES = [
  'Arial',
  'Times New Roman',
  'Courier New',
  'Georgia',
  'Verdana',
  'Helvetica',
  'Tahoma',
  'Trebuchet MS',
  'Impact',
  'Comic Sans MS',
];

const MenuBar = ({ editor }: { editor: any }) => {
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);
  const [showFontFamily, setShowFontFamily] = useState(false);
  const [isFullWidth, setIsFullWidth] = useState(true);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL', previousUrl);
    
    if (url === null) {
      return; // Cancelled
    }

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

  return (
    <div className="border-b border-gray-200">
      {/* Main Toolbar */}
      <div className="p-2 flex flex-wrap gap-2 border-b border-gray-200">
        {/* Text Style */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('bold') ? 'bg-gray-100' : ''
            }`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('italic') ? 'bg-gray-100' : ''
            }`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('underline') ? 'bg-gray-100' : ''
            }`}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('strike') ? 'bg-gray-100' : ''
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
        </div>

        {/* Font Controls */}
        <div className="flex items-center gap-2 pr-2 border-r border-gray-200">
          {/* Font Family */}
          <div className="relative">
            <button
              onClick={() => setShowFontFamily(!showFontFamily)}
              className="p-2 rounded hover:bg-gray-100 flex items-center gap-1 min-w-[120px]"
            >
              <Type className="w-4 h-4" />
              <span className="text-sm">Font Family</span>
            </button>
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

          {/* Font Size */}
          <div className="relative">
            <button
              onClick={() => setShowFontSize(!showFontSize)}
              className="p-2 rounded hover:bg-gray-100 flex items-center gap-1 min-w-[100px]"
            >
              <span className="text-sm">Font Size</span>
            </button>
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

          {/* Color Picker */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-2 rounded hover:bg-gray-100 flex items-center gap-1"
              title="Text Color"
            >
              <Palette className="w-4 h-4" />
            </button>
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

        {/* Headings */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('heading', { level: 1 }) ? 'bg-gray-100' : ''
            }`}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('heading', { level: 2 }) ? 'bg-gray-100' : ''
            }`}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('heading', { level: 3 }) ? 'bg-gray-100' : ''
            }`}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-gray-100' : ''
            }`}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-gray-100' : ''
            }`}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-gray-100' : ''
            }`}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-100' : ''
            }`}
            title="Justify"
          >
            <AlignJustify className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Secondary Toolbar */}
      <div className="p-2 flex flex-wrap gap-2">
        {/* Lists and Quotes */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('bulletList') ? 'bg-gray-100' : ''
            }`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('orderedList') ? 'bg-gray-100' : ''
            }`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('blockquote') ? 'bg-gray-100' : ''
            }`}
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>
        </div>

        {/* Script Controls */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <button
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('subscript') ? 'bg-gray-100' : ''
            }`}
            title="Subscript"
          >
            <SubscriptIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('superscript') ? 'bg-gray-100' : ''
            }`}
            title="Superscript"
          >
            <SuperscriptIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Code */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('code') ? 'bg-gray-100' : ''
            }`}
            title="Inline Code"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('codeBlock') ? 'bg-gray-100' : ''
            }`}
            title="Code Block"
          >
            <CodeSquare className="w-4 h-4" />
          </button>
        </div>

        {/* Insert Tools */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <button
            onClick={addLink}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('link') ? 'bg-gray-100' : ''
            }`}
            title="Insert Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            onClick={insertTable}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('table') ? 'bg-gray-100' : ''
            }`}
            title="Insert Table"
          >
            <TableIcon className="w-4 h-4" />
          </button>
          <button
            onClick={addImage}
            className="p-2 rounded hover:bg-gray-100"
            title="Insert Image"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button
            onClick={addYoutubeVideo}
            className="p-2 rounded hover:bg-gray-100"
            title="Insert YouTube Video"
          >
            <YoutubeIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-2 rounded hover:bg-gray-100"
            title="Insert Horizontal Rule"
          >
            <MinusSquare className="w-4 h-4" />
          </button>
        </div>

        {/* Formatting Tools */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('highlight') ? 'bg-gray-100' : ''
            }`}
            title="Highlight"
          >
            <Highlighter className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            className="p-2 rounded hover:bg-gray-100"
            title="Clear Formatting"
          >
            <Eraser className="w-4 h-4" />
          </button>
        </div>

        {/* History */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className={`p-2 rounded hover:bg-gray-100 ${
              !editor.can().undo() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className={`p-2 rounded hover:bg-gray-100 ${
              !editor.can().redo() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* Right-aligned tools */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setIsFullWidth(!isFullWidth)}
            className="p-2 rounded hover:bg-gray-100"
            title={isFullWidth ? "Narrow Width" : "Full Width"}
          >
            {isFullWidth ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <PanelLeftOpen className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`p-2 rounded hover:bg-gray-100 ${
              showPreview ? 'bg-gray-100' : ''
            }`}
            title="Preview"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setShowAIMenu(!showAIMenu)}
            className={`p-2 rounded hover:bg-purple-100 ${
              showAIMenu ? 'bg-purple-100' : ''
            }`}
            title="AI Writing Assistant"
          >
            <Wand2 className="w-4 h-4 text-purple-600" />
          </button>

          <button
            onClick={clearContent}
            className="p-2 rounded hover:bg-red-100"
            title="Clear All Content"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>

          <div className="relative group">
            <button
              className="p-2 rounded hover:bg-gray-100"
              title="Export"
            >
              <FileDown className="w-4 h-4" />
            </button>
            <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block z-50">
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