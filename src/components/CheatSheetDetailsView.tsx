import React, { useState } from 'react';
import { Search, Copy, Check, Terminal } from 'lucide-react';
import { slides } from '../slidesData';

interface CheatSheetProps {
  initialCategory?: string;
}

export const CheatSheetDetailsView: React.FC<CheatSheetProps> = ({ initialCategory }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>(initialCategory || 'All');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [expandedCommand, setExpandedCommand] = useState<string | null>(null);

  // Extract all cheat sheet items from our 30-slide data catalog to enable cross-category searching
  const allCheatSheetSlides = slides.filter(s => s.type === 'cheatsheet');
  const categoriesList = ['All', ...allCheatSheetSlides.map(s => s.cheatSheetDetails?.categoryName).filter(Boolean) as string[]];

  // Flat list of all commands for global search
  const allCommandsFlat: { category: string; commandData: any }[] = [];
  allCheatSheetSlides.forEach(slide => {
    if (slide.cheatSheetDetails) {
      slide.cheatSheetDetails.commands.forEach(cmd => {
        allCommandsFlat.push({
          category: slide.cheatSheetDetails!.categoryName,
          commandData: cmd
        });
      });
    }
  });

  const handleCopyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
    setCopiedCmd(command);
    setTimeout(() => setCopiedCmd(null), 1500);
  };

  const filteredCommands = allCommandsFlat.filter(item => {
    const matchesSearch =
      item.commandData.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.commandData.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.commandData.syntax.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.commandData.example && item.commandData.example.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      activeCategoryFilter === 'All' || item.category === activeCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="liquid-glass corner-box p-6 space-y-6 shadow-2xl text-[#ffffff]">
      {/* Bottom corner edge elements */}
      <div className="corner-box-bottom" />
      {/* Search and Category Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="space-y-1">
          <h4 className="text-[#ffffff] font-medium text-lg flex items-center gap-2 uppercase tracking-tight">
            <Terminal className="w-5 h-5 text-[#00f0ff]" />
            COMMAND CHEAT SHEET 📑
          </h4>
          <p className="text-[#969696] text-xs leading-relaxed">
            Search, filter, copy, and explore essential Docker commands with fully documented parameters and options.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#8f8f8f] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH COMMANDS..."
            className="w-full bg-[#0c2336] border border-[#113a5d] rounded-none pl-9 pr-4 py-2 text-xs text-[#ffffff] placeholder:text-[#8f8f8f]/60 focus:border-[#00f0ff] focus:outline-none font-mono uppercase tracking-wider"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5 pb-3 border-b border-[#113a5d]/60">
        {categoriesList.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategoryFilter(cat)}
            className={`px-3.5 py-2 rounded-none text-[10px] font-mono transition-all uppercase tracking-[0.12em] border cursor-pointer ${
              activeCategoryFilter === cat
                ? 'bg-[#2496ed] text-[#ffffff] border-[#2496ed] shadow-[0_0_8px_rgba(36,150,237,0.4)]'
                : 'bg-[#010915] border-[#113a5d]/70 text-[#969696] hover:text-[#ffffff] hover:border-[#2496ed]'
            }`}
          >
            {cat === 'All' ? '📂 ALL COMMANDS' : `🐳 ${cat.toUpperCase()}`}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center text-[10px] font-mono text-[#8f8f8f] uppercase tracking-wider">
        <span>{filteredCommands.length} COMMANDS FOUND</span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-[#00f0ff] hover:underline font-bold"
          >
            CLEAR SEARCH
          </button>
        )}
      </div>

      {/* Commands Grid/List */}
      {filteredCommands.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCommands.map((item, idx) => {
            const isExpanded = expandedCommand === item.commandData.command;
            return (
              <div
                key={idx}
                className={`bg-[#010915]/60 border transition-all duration-300 rounded-none p-5 flex flex-col justify-between ${
                  isExpanded
                    ? 'border-2 border-[#2496ed] col-span-1 md:col-span-2 bg-[#0c2336] shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                    : 'border-[#113a5d]/75 hover:border-[#00f0ff]'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase font-mono px-2 py-0.5 bg-[#0c2336] border border-[#113a5d] rounded-none text-[#00f0ff] tracking-widest">
                        {item.category.toUpperCase()}
                      </span>
                      <h5 className="font-mono text-xs md:text-sm text-[#00f0ff] font-bold flex items-center gap-2">
                        {item.commandData.command}
                      </h5>
                    </div>
                    
                    <button
                      onClick={() => handleCopyCommand(item.commandData.example || item.commandData.command)}
                      className="p-2 bg-[#0c2336] hover:bg-[#113a5d] border border-[#113a5d] rounded-none text-[#969696] hover:text-[#ffffff] transition-colors cursor-pointer"
                      title="Copy example command"
                    >
                      {copiedCmd === (item.commandData.example || item.commandData.command) ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <p className="text-[#c2d6e8] text-xs leading-relaxed">
                    {item.commandData.description}
                  </p>

                  <div className="space-y-1 bg-[#010915] p-3 rounded-none border border-[#113a5d]/70">
                    <span className="text-[8px] font-mono uppercase text-[#8f8f8f] block">Syntax:</span>
                    <code className="text-[#2496ed] text-xs font-mono break-all font-bold">{item.commandData.syntax}</code>
                  </div>

                  {/* Expand button */}
                  {(item.commandData.flags || item.commandData.example) && (
                    <button
                      onClick={() => setExpandedCommand(isExpanded ? null : item.commandData.command)}
                      className="text-[10px] font-mono text-[#00f0ff] hover:text-[#ffffff] font-bold uppercase tracking-widest flex items-center gap-1 mt-1 cursor-pointer"
                    >
                      <span>{isExpanded ? '▲ COLLAPSE DETAILS' : '▼ VIEW EXAMPLE & FLAGS'}</span>
                    </button>
                  )}

                  {/* Expanded documentation */}
                  {isExpanded && (
                    <div className="space-y-3.5 pt-3 border-t border-[#113a5d]/30 mt-2 animate-fadeIn">
                      {item.commandData.example && (
                        <div className="space-y-1 bg-emerald-950/20 border border-emerald-800/60 p-3 rounded-none">
                          <span className="text-[9px] font-mono uppercase text-emerald-400 block font-bold">PRACTICAL EXAMPLE:</span>
                          <code className="text-emerald-300 text-xs font-mono break-all block font-bold">{item.commandData.example}</code>
                        </div>
                      )}

                      {item.commandData.flags && item.commandData.flags.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[9px] font-mono uppercase text-[#8f8f8f] block">AVAILABLE FLAGS & ARGUMENTS:</span>
                          <div className="grid grid-cols-1 gap-2">
                            {item.commandData.flags.map((flag: any, fIdx: number) => (
                              <div key={fIdx} className="bg-[#010915] p-2.5 border border-[#113a5d]/60 rounded-none flex items-start gap-2.5 text-xs">
                                <code className="text-[#00f0ff] font-bold font-mono px-1.5 py-0.5 bg-[#0c2336] border border-[#113a5d] rounded-none shrink-0">{flag.flag}</code>
                                <span className="text-[#c2d6e8] text-[11px] pt-0.5">{flag.desc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-[#113a5d] rounded-none bg-[#010915]">
          <p className="text-[#8f8f8f] text-sm font-mono">No matching commands found for "{searchQuery}".</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategoryFilter('All');
            }}
            className="text-xs text-[#00f0ff] font-bold hover:underline mt-2 uppercase tracking-wider font-mono cursor-pointer"
          >
            RESET SEARCH FILTERS
          </button>
        </div>
      )}
    </div>
  );
};
