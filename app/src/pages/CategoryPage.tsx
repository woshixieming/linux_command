import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ChevronRight, Terminal, Server, Network, FileText, Package, Code2 } from 'lucide-react';
import { commandGroups, getCommandsByGroup } from '@/data/commands';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Terminal,
  Server,
  Network,
  FileText,
  Package,
  Code2,
};

const colorMap: Record<string, { bg: string; border: string; icon: string }> = {
  green: { bg: 'bg-green-500/10', border: 'border-green-500/30', icon: 'text-green-400' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: 'text-blue-400' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: 'text-purple-400' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: 'text-amber-400' },
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', icon: 'text-cyan-400' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: 'text-emerald-400' },
};

export default function CategoryPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const group = commandGroups.find(g => g.id === groupId);
  if (!group) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-slate-400">分类不存在</p>
      </div>
    );
  }

  const Icon = iconMap[group.icon] || Terminal;
  const colors = colorMap[group.color] || colorMap.green;
  const commands = getCommandsByGroup(groupId!);
  const filteredCommands = searchQuery
    ? commands.filter(
        cmd =>
          cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cmd.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : commands;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回
            </Button>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${colors.icon}`} />
              </div>
              <div>
                <h1 className="font-bold text-lg">{group.name}</h1>
                <p className="text-xs text-slate-400 hidden sm:block">{group.description}</p>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="bg-slate-800 text-slate-300">
            {commands.length} 条命令
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="搜索命令..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-green-500 focus:ring-green-500/20"
            />
          </div>
        </div>

        {/* Command List */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-0">
            <div className="divide-y divide-slate-800">
              {filteredCommands.map((cmd) => (
                <div
                  key={cmd.id}
                  className="flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/command/${cmd.id}`)}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                      <span className="font-mono font-bold text-green-400">#{cmd.popularity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-mono font-bold text-green-400">{cmd.name}</h3>
                        <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                          {cmd.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400 truncate">{cmd.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 shrink-0 ml-4" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {filteredCommands.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p>没有找到匹配的命令</p>
          </div>
        )}
      </main>
    </div>
  );
}
