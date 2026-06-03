import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  BookOpen,
  Copy,
  Check,
  Search,
  ChevronDown,
  ChevronRight,
  Terminal,
  GraduationCap,
  Layers,
  Layout,
  FolderOpen,
  Box,
  AlignLeft,
  Bookmark,
  Play,
  FolderTree,
  ListOrdered,
  Database,
  Move,
  Trash2,
  Undo2,
  Square,
  FileText,
} from 'lucide-react';
import { vimCommandGroups } from '@/data/commands';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { Separator } from '@/components/ui/separator';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Terminal,
  GraduationCap,
  Layers,
  Layout,
  FolderOpen,
  Box,
  AlignLeft,
  Bookmark,
  Play,
  FolderTree,
  ListOrdered,
  Database,
  Move,
  Trash2,
  Undo2,
  Square,
  FileText,
  Search: Search,
};

// HTML转义函数
const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, m => map[m]);
};

export default function VimPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredGroups = searchQuery
    ? vimCommandGroups.map(group => ({
        ...group,
        commands: group.commands.filter(
          cmd =>
            cmd.keys.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cmd.description.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter(group => group.commands.length > 0)
    : vimCommandGroups;

  const generateMarkdown = () => {
    let md = `# Vim 命令速查表\n\n`;
    md += `> 生成时间: ${new Date().toLocaleString('zh-CN')}\n\n`;
    md += `> Vim 是 Linux 最强大的文本编辑器，本速查表包含完整的命令参考\n\n`;
    md += `---\n\n`;

    vimCommandGroups.forEach(group => {
      md += `## ${group.title}\n\n`;
      md += `${group.description}\n\n`;
      md += `| 按键 | 说明 | 模式 |\n`;
      md += `|------|------|------|\n`;
      group.commands.forEach(cmd => {
        md += `| \`${cmd.keys}\` | ${cmd.description} | ${cmd.mode} |\n`;
      });
      md += `\n---\n\n`;
    });

    md += `\n---\n\n`;
    md += `*本速查表由 Linux 命令学习站生成*\n`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vim-commands-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const totalCommands = vimCommandGroups.reduce((acc, g) => acc + g.commands.length, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          {/* Left Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="w-9 h-9"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                <Terminal className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              </div>
              <div className="min-w-0">
                <h1 className="font-bold text-base sm:text-lg truncate">Vim 命令详解</h1>
                <p className="text-xs text-slate-400 hidden md:block">完整的 Vim 操作命令参考</p>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Badge variant="outline" className="border-slate-700 text-slate-400 text-xs sm:text-sm">
              {totalCommands} 条
            </Badge>
            <Button
              variant="default"
              size="sm"
              className="bg-green-600 hover:bg-green-500 text-white gap-1 sm:gap-2 px-2 sm:px-3"
              onClick={generateMarkdown}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">导出</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="搜索按键或说明..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
          />
        </div>

        {/* Quick Navigation */}
        <div className="mb-6 flex flex-wrap gap-2">
          {vimCommandGroups.map(group => {
            const Icon = iconMap[group.icon] || BookOpen;
            const count = searchQuery
              ? filteredGroups.find(g => g.id === group.id)?.commands.length || 0
              : group.commands.length;
            return (
              <Button
                key={group.id}
                variant="outline"
                size="sm"
                onClick={() => {
                  document.getElementById(`group-${group.id}`)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-100 gap-1"
              >
                <Icon className="w-3 h-3" />
                {group.title}
                <Badge variant="secondary" className="ml-1 bg-slate-700 text-slate-300">
                  {count}
                </Badge>
              </Button>
            );
          })}
        </div>

        {/* Info Card */}
        <Card className="bg-blue-500/5 border-blue-500/20 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-300 mb-1">Vim 模式说明</h3>
                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">普通模式 </span>
                    <Badge variant="outline" className="ml-1 border-slate-600 text-slate-300">Normal</Badge>
                    <p className="text-slate-500 text-xs mt-1">启动后的默认模式，用于移动和操作</p>
                  </div>
                  <div>
                    <span className="text-slate-400">插入模式 </span>
                    <Badge variant="outline" className="ml-1 border-slate-600 text-slate-300">Insert</Badge>
                    <p className="text-slate-500 text-xs mt-1">按 i 进入，用于输入文本</p>
                  </div>
                  <div>
                    <span className="text-slate-400">命令行模式 </span>
                    <Badge variant="outline" className="ml-1 border-slate-600 text-slate-300">Command</Badge>
                    <p className="text-slate-500 text-xs mt-1">按 : 进入，执行命令</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Command Groups */}
        <div className="space-y-4">
          {filteredGroups.map(group => {
            const Icon = iconMap[group.icon] || BookOpen;
            const isExpanded = expandedGroups.has(group.id);

            return (
              <Card key={group.id} id={`group-${group.id}`} className="bg-slate-900/50 border-slate-800 scroll-mt-20">
                <CardHeader className="pb-2">
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="flex items-center justify-between w-full text-left cursor-pointer hover:bg-slate-800/50 -m-2 p-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-slate-100">{group.title}</CardTitle>
                        <p className="text-sm text-slate-400">{group.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                        {group.commands.length}
                      </Badge>
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </button>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-0">
                    <div className="space-y-1">
                      {group.commands.map((cmd, idx) => (
                        <div key={idx}>
                          <div className="group flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-800/50 transition-colors gap-2">
                            <div className="flex items-center gap-4 flex-[1_1_auto] min-w-0">
                              <code
                                className="font-mono text-blue-400 bg-slate-800 px-3 py-1.5 rounded text-sm shrink-0"
                                style={{ fontFamily: "'SF Mono', 'Fira Code', monospace" }}
                                dangerouslySetInnerHTML={{ __html: escapeHtml(cmd.keys) }}
                              ></code>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-slate-300">{cmd.description}</p>
                              </div>
                              <Badge
                                variant="outline"
                                className={`text-xs shrink-0 ${
                                  cmd.mode === '普通模式' ? 'border-green-500/50 text-green-400' :
                                  cmd.mode === '命令行模式' ? 'border-yellow-500/50 text-yellow-400' :
                                  cmd.mode === '可视化模式' ? 'border-purple-500/50 text-purple-400' :
                                  'border-slate-600 text-slate-400'
                                }`}
                              >
                                {cmd.mode}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                              onClick={() => copyToClipboard(cmd.keys, `cmd-${idx}`)}
                              title="复制按键"
                            >
                              {copiedKey === `cmd-${idx}` ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4 text-slate-400" />
                              )}
                            </Button>
                          </div>
                          {idx < group.commands.length - 1 && (
                            <Separator className="bg-slate-800/50" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Tips */}
        <Card className="bg-slate-900/50 border-slate-800 mt-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-green-400" />
              学习建议
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-400 space-y-2">
            <p>1. <strong className="text-slate-300">入门</strong>：先掌握基本操作（i, x, dd, yy, p）和光标移动（h, j, k, l, w, b）</p>
            <p>2. <strong className="text-slate-300">进阶</strong>：学习文本对象（diw, ci(）、宏录制（qa...q）和搜索替换</p>
            <p>3. <strong className="text-slate-300">高级</strong>：掌握分屏窗口、标签页、折叠和自定义配置</p>
            <p>4. <strong className="text-slate-300">练习</strong>：运行 <code className="bg-slate-800 px-1 rounded">vimtutor</code> 启动交互式教程</p>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-slate-500 text-sm">
            Linux 命令学习站 - Vim 命令详解页面
          </p>
        </div>
      </footer>
    </div>
  );
}
