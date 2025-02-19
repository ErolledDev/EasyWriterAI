import React, { useState } from 'react';
import { Wand2, Sparkles, ChevronDown, ChevronRight, Pencil, Palette, Zap, Layout } from 'lucide-react';
import { generateAIResponse, aiActions } from '../lib/gemini';
import { Editor } from '@tiptap/react';

interface AIMenuProps {
  editor: Editor;
  isOpen: boolean;
  onClose: () => void;
}

export default function AIMenu({ editor, isOpen, onClose }: AIMenuProps) {
  const [loading, setLoading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  if (!isOpen) return null;

  const selectedText = editor.state.selection.empty
    ? editor.getText()
    : editor.state.doc.textBetween(
        editor.state.selection.from,
        editor.state.selection.to
      );

  const handleAIAction = async (actionKey: string) => {
    if (!selectedText.trim()) return;

    try {
      setLoading(true);
      const result = await generateAIResponse(selectedText, actionKey as any);
      
      if (editor.state.selection.empty) {
        editor.commands.setContent(result);
      } else {
        editor.commands.deleteSelection();
        editor.commands.insertContent(result);
      }
      
      onClose();
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (type: string) => {
    setExpandedCategories(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const getCategoryIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'rewrite':
        return <Pencil className="w-4 h-4 text-emerald-300" />;
      case 'modify':
        return <Zap className="w-4 h-4 text-amber-300" />;
      case 'tone':
        return <Palette className="w-4 h-4 text-purple-300" />;
      case 'transform':
        return <Layout className="w-4 h-4 text-blue-300" />;
      default:
        return <Wand2 className="w-4 h-4 text-purple-300" />;
    }
  };

  return (
    <div className="fixed right-8 top-32 w-80 bg-[#121212] rounded-xl shadow-2xl border border-purple-400/30 z-50 max-h-[80vh] overflow-hidden flex flex-col backdrop-blur-sm">
      <div className="p-4 border-b border-purple-400/30 flex items-center justify-between bg-gradient-to-r from-purple-500/15 to-blue-500/15">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Wand2 className="w-5 h-5 text-purple-300" />
            <Sparkles className="w-3 h-3 text-blue-300 absolute -top-1 -right-1" />
          </div>
          <span className="font-medium bg-gradient-to-r from-purple-200 to-blue-200 text-transparent bg-clip-text">AI Assistant</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-300 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
        >
          ×
        </button>
      </div>
      
      <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-purple-400/30 scrollbar-track-transparent">
        {loading ? (
          <div className="p-6 text-center">
            <div className="relative mx-auto w-12 h-12">
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-purple-400/30 border-t-purple-300 animate-spin" />
              <Sparkles className="w-4 h-4 text-purple-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="mt-4 text-sm text-gray-300">Generating content with AI...</p>
          </div>
        ) : (
          <div className="p-2">
            {aiActions.map(category => (
              <div key={category.type} className="mb-2">
                <button
                  onClick={() => toggleCategory(category.type)}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category.type)}
                    <span className="text-sm font-medium text-gray-100">
                      {category.type.charAt(0).toUpperCase() + category.type.slice(1)}
                    </span>
                  </div>
                  {expandedCategories.includes(category.type) ? (
                    <ChevronDown className="w-4 h-4 text-gray-300 group-hover:text-white" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-white" />
                  )}
                </button>
                
                {expandedCategories.includes(category.type) && (
                  <div className="mt-1 ml-4 space-y-1 animate-slideDown">
                    {category.actions.map(action => (
                      <button
                        key={action.key}
                        onClick={() => handleAIAction(action.key)}
                        className="w-full text-left px-3 py-2 text-sm rounded-lg transition-all flex items-center gap-2 text-gray-200 hover:text-white hover:bg-purple-500/20 group relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-300" />
                        <span className="w-1 h-1 rounded-full bg-purple-300/40 group-hover:bg-purple-300 transition-colors" />
                        <span className="relative">{action.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {selectedText && (
        <div className="px-4 py-3 border-t border-purple-400/30 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
          <p className="text-xs text-gray-300">
            Selected text: {selectedText.length > 50 ? `${selectedText.substring(0, 50)}...` : selectedText}
          </p>
        </div>
      )}
    </div>
  );
}