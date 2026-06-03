import { useNavigate } from 'react-router-dom';
import { Terminal, Server, Network, FileText, Package, Code2, ArrowRight, Sparkles, Shell } from 'lucide-react';
import { commandGroups } from '@/data/commands';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Terminal,
  Server,
  Network,
  FileText,
  Package,
  Code2,
  Shell,
};

const colorMap: Record<string, { bg: string; border: string; icon: string; hover: string }> = {
  green: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    icon: 'text-green-400',
    hover: 'hover:border-green-500/50 hover:bg-green-500/20',
  },
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: 'text-blue-400',
    hover: 'hover:border-blue-500/50 hover:bg-blue-500/20',
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    icon: 'text-purple-400',
    hover: 'hover:border-purple-500/50 hover:bg-purple-500/20',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    icon: 'text-amber-400',
    hover: 'hover:border-amber-500/50 hover:bg-amber-500/20',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    icon: 'text-cyan-400',
    hover: 'hover:border-cyan-500/50 hover:bg-cyan-500/20',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    icon: 'text-emerald-400',
    hover: 'hover:border-emerald-500/50 hover:bg-emerald-500/20',
  },
  orange: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    icon: 'text-orange-400',
    hover: 'hover:border-orange-500/50 hover:bg-orange-500/20',
  },
};

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Terminal className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Linux 命令学习站</h1>
              <p className="text-xs text-slate-400 hidden sm:block">掌握最常用的命令行工具</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            选择要学习的命令分类
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            系统化学习 Linux 命令，从基础到进阶，逐步掌握命令行技能
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {commandGroups.map(group => {
            const Icon = iconMap[group.icon] || Terminal;
            const colors = colorMap[group.color] || colorMap.green;
            const isVim = group.id === 'vim';

            return (
              <Card
                key={group.id}
                className={`bg-slate-900/50 ${colors.border} ${colors.hover} transition-all duration-200 cursor-pointer group`}
                onClick={() => navigate(isVim ? '/vim' : `/category/${group.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-7 h-7 ${colors.icon}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-white transition-colors">
                        {group.name}
                      </h3>
                      <p className="text-sm text-slate-400 mb-4">
                        {group.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {group.categories.slice(0, 3).map(cat => (
                          <span
                            key={cat}
                            className={`text-xs px-2 py-0.5 rounded ${colors.bg} ${colors.icon}`}
                          >
                            {cat}
                          </span>
                        ))}
                        {group.categories.length > 3 && (
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                            +{group.categories.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-slate-500 group-hover:text-slate-300 transition-colors">
                        <span>开始学习</span>
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Popular Commands */}
        <div className="mt-16">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-green-400" />
            <h3 className="text-xl font-semibold">热门命令速查</h3>
          </div>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {[
                  { name: 'ls', desc: '列出目录' },
                  { name: 'cd', desc: '切换目录' },
                  { name: 'grep', desc: '搜索文本' },
                  { name: 'chmod', desc: '修改权限' },
                  { name: 'tar', desc: '打包压缩' },
                  { name: 'vim', desc: '文本编辑' },
                  { name: 'ssh', desc: '远程登录' },
                  { name: 'curl', desc: '数据传输' },
                  { name: 'ps', desc: '进程状态' },
                  { name: 'awk', desc: '文本分析' },
                  { name: 'sed', desc: '流编辑器' },
                  { name: 'find', desc: '搜索文件' },
                ].map(cmd => (
                  <Button
                    key={cmd.name}
                    variant="outline"
                    className="h-auto py-3 flex-col gap-1 border-slate-700 hover:bg-slate-800 hover:border-slate-600"
                    onClick={() => navigate(`/command/${cmd.name}`)}
                  >
                    <span className="font-mono font-bold text-green-400">{cmd.name}</span>
                    <span className="text-xs text-slate-500">{cmd.desc}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-slate-500 text-sm">
            Linux 命令学习站 - 帮助你掌握最常用的命令行工具
          </p>
        </div>
      </footer>
    </div>
  );
}
