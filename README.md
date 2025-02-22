# EasyWriterAI 📝✨

![EasyWriterAI Banner](https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=1200&h=300&q=80)

EasyWriterAI is a modern, AI-powered WYSIWYG editor that transforms the way you create content. Built with React and powered by Google's Gemini AI, it offers an intuitive interface with advanced editing capabilities and intelligent writing assistance.

## ✨ Features

### 🎨 Rich Text Editing
- Full formatting controls (bold, italic, underline, etc.)
- Multiple heading levels
- Lists (bullet, numbered, and tasks)
- Tables with resizing
- Code blocks with syntax highlighting
- Image and YouTube video embedding
- Custom fonts and colors

### 🤖 AI Assistance
- Smart content rewriting
- Tone adjustment
- Grammar and spelling fixes
- Text expansion and summarization
- Multiple writing styles
- Real-time suggestions

### 📱 Modern UI/UX
- Clean, intuitive interface
- Dark/light mode
- Responsive design
- Drag-and-drop support
- Real-time word count
- Reading time estimation
- Reading level analysis

### 💾 Export Options
- Markdown
- HTML
- Plain Text
- PDF
- Print-ready format

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Gemini API key (for AI features)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/easywriterai.git
   cd easywriterai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Editor Core**: Tiptap
- **AI Integration**: Google Gemini
- **Icons**: Lucide React
- **Type Safety**: TypeScript

## 📖 Documentation

### Editor Configuration

The editor supports extensive customization through the `Editor.tsx` component:

```typescript
const editor = useEditor({
  extensions: [
    // ... extension list
  ],
  editorProps: {
    // ... editor properties
  }
});
```

### AI Integration

AI features are configured in `lib/gemini.ts`:

```typescript
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
```

### Custom Extensions

Add new extensions in the `lib/extensions` directory:

```typescript
export const CustomExtension = Extension.create({
  // ... extension configuration
});
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Tiptap](https://tiptap.dev/) for the core editor functionality
- [Google Gemini](https://ai.google.dev/) for AI capabilities
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for beautiful icons

## 🔗 Links

- [Website](https://easywriterai.com)
- [Documentation](https://docs.easywriterai.com)
- [GitHub Repository](https://github.com/yourusername/easywriterai)

## 📞 Support

For support, please:
- Open an issue on GitHub
- Join our [Discord community](https://discord.gg/easywriterai)
- Email us at support@easywriterai.com

---

Made with ❤️ by the EasyWriterAI team