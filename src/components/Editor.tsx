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
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import HardBreak from '@tiptap/extension-hard-break';
import History from '@tiptap/extension-history';
import Strike from '@tiptap/extension-strike';
import ListItem from '@tiptap/extension-list-item';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Mention from '@tiptap/extension-mention';
import CharacterCount from '@tiptap/extension-character-count';
import { FontSize } from '../lib/extensions/fontSize';
import { useState, useCallback } from 'react';
import AIMenu from './AIMenu';
import MenuBar from './MenuBar';
import { calculateReadingTime, calculateReadingLevel } from '../lib/metrics';

// Custom Image extension with resizing
const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: 'auto',
        renderHTML: attributes => ({
          width: attributes.width,
        }),
      },
      height: {
        default: 'auto',
        renderHTML: attributes => ({
          height: attributes.height,
        }),
      },
    };
  },
});

// Custom YouTube extension with improved configuration
const CustomYoutube = Youtube.configure({
  HTMLAttributes: {
    class: 'w-full aspect-video rounded-lg shadow-md',
  },
  inline: false,
  allowFullscreen: true,
  autoplay: false,
  ccLanguage: undefined,
  ccLoadPolicy: undefined,
  controls: true,
  disableKBcontrols: false,
  enableIFrameApi: false,
  endTime: 0,
  height: 480,
  interfaceLanguage: undefined,
  ivLoadPolicy: 0,
  loop: false,
  modestBranding: true,
  nocookie: true, // Enable privacy-enhanced mode
  origin: window.location.origin,
  playlist: '',
  progressBarColor: undefined,
  startAt: 0,
  width: 640,
  transformUrl: (url: string) => {
    // Transform YouTube URLs to use privacy-enhanced domain
    return url.replace('youtube.com/embed/', 'youtube-nocookie.com/embed/');
  },
});

const Editor = () => {
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState('');
  const [readingLevel, setReadingLevel] = useState('');
  
  const updateMetrics = useCallback((editor: any) => {
    try {
      const chars = editor.storage.characterCount.characters() || 0;
      const words = editor.storage.characterCount.words() || 0;
      setCharacterCount(chars);
      setWordCount(words);
      setReadingTime(calculateReadingTime(words));
      setReadingLevel(calculateReadingLevel(editor.getText() || ''));
    } catch (error) {
      console.error('Error updating metrics:', error);
      setCharacterCount(0);
      setWordCount(0);
      setReadingTime('< 1 min');
      setReadingLevel('Beginner');
    }
  }, []);

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      HardBreak,
      History,
      StarterKit.configure({
        document: false,
        paragraph: false,
        text: false,
        hardBreak: false,
        history: false,
      }),
      Highlight,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-400 hover:text-blue-300',
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
      ResizableImage.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-lg shadow-md cursor-pointer',
        },
      }),
      CustomYoutube,
      TextStyle,
      Color,
      Typography,
      Underline,
      Subscript,
      Superscript,
      FontFamily,
      FontSize,
      Strike,
      ListItem,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion: {
          items: query => {
            return [
              'Sarah Johnson',
              'Michael Brown',
              'Emily Davis',
              'David Wilson',
              'Lisa Anderson',
            ].filter(item => item.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5);
          },
        },
      }),
      CharacterCount.configure({
        limit: 10000,
      }),
      Placeholder.configure({
        placeholder: 'Write something amazing...',
      }),
    ],
    editorProps: {
      attributes: {
        class:
          'prose prose-invert prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none p-8 min-h-[calc(100vh-13rem)] bg-white dark:bg-[#0D1117] text-gray-900 dark:text-gray-100 transition-colors duration-200 will-change-transform',
      },
      handleDOMEvents: {
        input: (view, event) => {
          if (view.composing) return false;
          return false;
        },
      },
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        const imageItem = items.find(item => item.type.startsWith('image/'));
        
        if (imageItem) {
          event.preventDefault();
          const file = imageItem.getAsFile();
          if (!file) return false;

          if (file.size > 10 * 1024 * 1024) {
            window.alert('Image size must be less than 10MB');
            return true;
          }

          const reader = new FileReader();
          reader.onload = (readerEvent) => {
            const img = new Image();
            img.onload = () => {
              let width = img.width;
              let height = img.height;
              const maxWidth = 1200;
              const maxHeight = 1200;
              
              if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
              }
              if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
              }

              const { tr } = view.state;
              view.dispatch(tr.replaceSelectionWith(view.state.schema.nodes.image.create({
                src: readerEvent.target?.result,
                width,
                height,
                alt: file.name.replace(/\.[^/.]+$/, ""),
              })));
            };
            img.src = readerEvent.target?.result as string;
          };
          reader.readAsDataURL(file);
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const timeoutId = setTimeout(() => {
        updateMetrics(editor);
      }, 250);
      return () => clearTimeout(timeoutId);
    },
  });

  return (
    <div className="w-full bg-white dark:bg-[#1D1D1D] shadow-xl border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <MenuBar editor={editor} onToggleAI={() => setShowAIMenu(!showAIMenu)} />
      <EditorContent editor={editor} />
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 items-center text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#2D2D2D] sticky bottom-0 transition-colors duration-200">
        <div className="flex items-center gap-2">
          <span className="font-medium">Characters:</span> {characterCount}
          {editor?.storage.characterCount.limit && (
            <span>/ {editor.storage.characterCount.limit()}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Words:</span> {wordCount}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Reading Time:</span> {readingTime}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Reading Level:</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            readingLevel === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
            readingLevel === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
            'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
          }`}>
            {readingLevel}
          </span>
        </div>
      </div>
      <AIMenu
        editor={editor}
        isOpen={showAIMenu}
        onClose={() => setShowAIMenu(false)}
      />
    </div>
  );
};

export default Editor;