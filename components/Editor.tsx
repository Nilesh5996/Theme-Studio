
import React, { useState } from 'react';
import { MobileTheme, IconStyle } from '../types';
import { FONT_OPTIONS, ICON_STYLES } from '../constants';
import { themeAIService } from '../services/geminiService';
import { 
  Palette, 
  Type as FontIcon, 
  Box, 
  Image as ImageIcon, 
  Sparkles,
  Download,
  Save,
  Loader2,
  Wand2
} from 'lucide-react';

interface EditorProps {
  theme: MobileTheme;
  onChange: (updates: Partial<MobileTheme>) => void;
  onSave: () => void;
  onExport: () => void;
}

const Editor: React.FC<EditorProps> = ({ theme, onChange, onSave, onExport }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingWallpaper, setIsGeneratingWallpaper] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [wallpaperPrompt, setWallpaperPrompt] = useState('');
  const [activeTab, setActiveTab] = useState<'colors' | 'typo' | 'icons' | 'ai'>('colors');

  const handleAI = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const generated = await themeAIService.generateThemeFromPrompt(aiPrompt);
      onChange(generated);
      setAiPrompt('');
    } catch (e) {
      alert("AI failed to generate theme. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateWallpaper = async () => {
    if (!wallpaperPrompt.trim()) return;
    setIsGeneratingWallpaper(true);
    try {
      const imageUrl = await themeAIService.generateWallpaper(wallpaperPrompt);
      onChange({ wallpaperUrl: imageUrl });
      setWallpaperPrompt('');
    } catch (e) {
      alert("AI failed to generate wallpaper. Please try again.");
    } finally {
      setIsGeneratingWallpaper(false);
    }
  };

  const updateColor = (key: keyof typeof theme.colors, value: string) => {
    onChange({ colors: { ...theme.colors, [key]: value } });
  };

  const updateTypo = (key: keyof typeof theme.typography, value: any) => {
    onChange({ typography: { ...theme.typography, [key]: value } });
  };

  return (
    <div className="h-full flex flex-col bg-zinc-900 border-r border-zinc-800 w-full max-w-md">
      {/* Header */}
      <div className="p-6 border-b border-zinc-800">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Palette className="text-indigo-500" /> Theme Studio
        </h1>
        <p className="text-zinc-400 text-xs mt-1">Design your mobile experience</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800">
        {[
          { id: 'colors', icon: Palette, label: 'Colors' },
          { id: 'typo', icon: FontIcon, label: 'Typo' },
          { id: 'icons', icon: Box, label: 'Style' },
          { id: 'ai', icon: Sparkles, label: 'Magic' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-colors ${
              activeTab === tab.id ? 'text-indigo-400 border-b-2 border-indigo-400 bg-indigo-400/5' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <tab.icon size={18} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Control Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {activeTab === 'colors' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest">Color Palette</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(theme.colors).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">{key}</label>
                  <div className="flex items-center gap-2 bg-zinc-800 p-2 rounded-lg border border-zinc-700">
                    <input 
                      type="color" 
                      value={value as string} 
                      onChange={(e) => updateColor(key as any, e.target.value)}
                      className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                    />
                    <span className="text-xs font-mono text-zinc-400">{(value as string).toUpperCase()}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-zinc-800">
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-2">Wallpaper URL</label>
              <div className="flex items-center gap-2 bg-zinc-800 p-2 rounded-lg border border-zinc-700">
                <ImageIcon size={16} className="text-zinc-500" />
                <input 
                  type="text" 
                  value={theme.wallpaperUrl}
                  onChange={(e) => onChange({ wallpaperUrl: e.target.value })}
                  placeholder="https://images..."
                  className="bg-transparent text-xs text-zinc-300 w-full outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'typo' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest">Typography</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-2">Font Family</label>
                <div className="grid grid-cols-1 gap-2">
                  {FONT_OPTIONS.map(font => (
                    <button
                      key={font}
                      onClick={() => updateTypo('fontFamily', font)}
                      style={{ fontFamily: font }}
                      className={`text-left px-4 py-3 rounded-lg border transition-all ${
                        theme.typography.fontFamily === font 
                          ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' 
                          : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'
                      }`}
                    >
                      {font}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-2">Border Radius: {theme.typography.borderRadius}px</label>
                <input 
                  type="range" 
                  min="0" 
                  max="32" 
                  value={theme.typography.borderRadius}
                  onChange={(e) => updateTypo('borderRadius', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'icons' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest">Icon Styling</h2>
            <div className="grid grid-cols-1 gap-3">
              {ICON_STYLES.map(style => (
                <button
                  key={style.id}
                  onClick={() => onChange({ iconStyle: style.id as IconStyle })}
                  className={`flex items-center gap-4 px-4 py-4 rounded-xl border transition-all ${
                    theme.iconStyle === style.id 
                      ? 'bg-indigo-600/10 border-indigo-500 ring-1 ring-indigo-500' 
                      : 'bg-zinc-800 border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  <div 
                    className={`w-10 h-10 flex items-center justify-center`}
                    style={{ 
                      borderRadius: style.id === 'minimal' ? '0' : style.id === 'rounded' ? '12px' : '8px',
                      border: style.id === 'outline' ? `2px solid ${theme.colors.primary}` : 'none',
                      backgroundColor: style.id === 'outline' ? 'transparent' : theme.colors.primary,
                      color: style.id === 'outline' ? theme.colors.primary : theme.colors.background
                    }}
                  >
                    <Box size={20} />
                  </div>
                  <div className="text-left">
                    <p className={`font-bold text-sm ${theme.iconStyle === style.id ? 'text-indigo-400' : 'text-zinc-200'}`}>{style.name}</p>
                    <p className="text-[10px] text-zinc-500 uppercase font-medium">Visual pack active</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Theme Generator */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-400" />
                AI Theme Designer
              </h2>
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-4">
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Describe the full vibe (colors, fonts, style). Our AI will build the entire theme configuration for you.
                </p>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g., A futuristic cyberpunk city theme with neon pink and cyan accents..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 h-24 focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                />
                <button
                  disabled={isGenerating || !aiPrompt.trim()}
                  onClick={handleAI}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-indigo-600/10"
                >
                  {isGenerating ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Sparkles size={18} />
                  )}
                  {isGenerating ? 'Generating Design...' : 'Generate Full Theme'}
                </button>
              </div>
            </div>

            {/* Wallpaper Generator */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                <ImageIcon size={16} className="text-teal-400" />
                AI Wallpaper Generator
              </h2>
              <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-xl space-y-4">
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Generate a custom image for your home screen.
                </p>
                <textarea
                  value={wallpaperPrompt}
                  onChange={(e) => setWallpaperPrompt(e.target.value)}
                  placeholder="e.g., Abstract 3D geometric shapes with soft purple lighting..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 h-20 focus:ring-1 focus:ring-teal-500 outline-none resize-none"
                />
                <button
                  disabled={isGeneratingWallpaper || !wallpaperPrompt.trim()}
                  onClick={handleGenerateWallpaper}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-teal-600/10"
                >
                  {isGeneratingWallpaper ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Wand2 size={18} />
                  )}
                  {isGeneratingWallpaper ? 'Creating Artwork...' : 'Generate Wallpaper'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-6 bg-zinc-950 border-t border-zinc-800 grid grid-cols-2 gap-3">
        <button 
          onClick={onSave}
          className="flex items-center justify-center gap-2 py-3 border border-zinc-700 hover:border-zinc-500 text-zinc-300 rounded-lg font-bold text-xs transition-all"
        >
          <Save size={16} /> Save Theme
        </button>
        <button 
          onClick={onExport}
          className="flex items-center justify-center gap-2 py-3 bg-zinc-100 hover:bg-white text-zinc-950 rounded-lg font-bold text-xs transition-all"
        >
          <Download size={16} /> Export JSON
        </button>
      </div>
    </div>
  );
};

export default Editor;
