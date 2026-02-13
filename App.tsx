
import React, { useState, useEffect } from 'react';
import { MobileTheme, User } from './types';
import { DEFAULT_THEME } from './constants';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { 
  Github, 
  Settings, 
  User as UserIcon, 
  Layout as LayoutIcon,
  Library,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const App: React.FC = () => {
  const [theme, setTheme] = useState<MobileTheme>(DEFAULT_THEME);
  const [user, setUser] = useState<User>({ username: 'Creative Designer', isLoggedIn: true });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [history, setHistory] = useState<MobileTheme[]>([]);

  useEffect(() => {
    // Load local history
    const saved = localStorage.getItem('theme-maker-history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const handleThemeChange = (updates: Partial<MobileTheme>) => {
    setTheme(prev => ({ ...prev, ...updates }));
  };

  const saveThemeToHistory = () => {
    const newTheme = { ...theme, id: Date.now().toString(), createdAt: Date.now() };
    const newHistory = [newTheme, ...history].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('theme-maker-history', JSON.stringify(newHistory));
    alert("Theme saved to library!");
  };

  const exportTheme = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(theme, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${theme.name.replace(/\s+/g, '-').toLowerCase()}-theme.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Mobile Header Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-indigo-600 rounded-full shadow-lg"
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </button>

      {/* Navigation Rail (Desktop) */}
      <div className="hidden lg:flex flex-col items-center py-6 w-16 border-r border-zinc-900 bg-zinc-950">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center mb-10 shadow-lg shadow-indigo-600/20">
          <LayoutIcon size={22} className="text-white" />
        </div>
        <div className="flex flex-col gap-8 flex-1">
          <button className="text-indigo-400 p-2 rounded-lg bg-indigo-400/10"><LayoutIcon size={20} /></button>
          <button className="text-zinc-500 hover:text-zinc-300 transition-colors"><Library size={20} /></button>
          <button className="text-zinc-500 hover:text-zinc-300 transition-colors"><UserIcon size={20} /></button>
          <button className="text-zinc-500 hover:text-zinc-300 transition-colors"><Settings size={20} /></button>
        </div>
        <button className="text-zinc-600 hover:text-red-400 transition-colors mt-auto"><LogOut size={20} /></button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Editor Sidebar */}
        <div className={`
          absolute inset-y-0 left-0 z-40 lg:relative transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'}
          w-full sm:w-[400px] lg:w-96 shrink-0
        `}>
          <Editor 
            theme={theme} 
            onChange={handleThemeChange} 
            onSave={saveThemeToHistory} 
            onExport={exportTheme} 
          />
        </div>

        {/* Main Workspace */}
        <main className="flex-1 flex flex-col bg-zinc-950 relative overflow-hidden">
          {/* Top Bar */}
          <header className="flex items-center justify-between px-8 py-4 border-b border-zinc-900">
            <div className="flex items-center gap-4">
              <input 
                type="text" 
                value={theme.name}
                onChange={(e) => handleThemeChange({ name: e.target.value })}
                className="bg-transparent text-lg font-bold text-zinc-100 outline-none border-b border-transparent focus:border-indigo-500 transition-all w-48"
              />
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-bold text-zinc-400 uppercase">Draft</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex -space-x-2">
                <img src="https://picsum.photos/id/64/32/32" className="w-8 h-8 rounded-full border-2 border-zinc-950" />
                <img src="https://picsum.photos/id/65/32/32" className="w-8 h-8 rounded-full border-2 border-zinc-950" />
                <div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center text-[10px] font-bold">+2</div>
              </div>
              <a href="https://github.com" target="_blank" className="text-zinc-400 hover:text-white transition-colors">
                <Github size={20} />
              </a>
            </div>
          </header>

          {/* Canvas Area */}
          <div className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950">
            <Preview theme={theme} />
          </div>

          {/* Quick Stats/Info (Optional) */}
          <footer className="px-8 py-3 bg-zinc-950 border-t border-zinc-900 text-[10px] text-zinc-600 font-medium flex justify-between items-center">
            <div className="flex gap-4">
              <span>CONTRAST: <span className="text-green-500">PASS</span></span>
              <span>READABILITY: <span className="text-zinc-400">HIGH</span></span>
            </div>
            <div>
              LAST SYNC: {new Date().toLocaleTimeString()}
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;
