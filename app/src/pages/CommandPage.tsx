import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, FileText, Download } from 'lucide-react';
import { getCommandById, generateMarkdown } from '@/data/commands';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function CommandPage() {
  const { commandId } = useParams<{ commandId: string }>();
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const command = getCommandById(commandId!);

  if (!command) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">命令不存在</p>
          <Button variant="outline" onClick={() => navigate('/')}>
            返回首页
          </Button>
        </div>
      </div>
    );
  }

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportMarkdown = () => {
    const markdown = generateMarkdown([command]);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${command.name}-command-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回
            </Button>
            <div>
              <h1 className="font-bold text-lg">{command.name} 命令</h1>
              <p className="text-xs text-slate-400 hidden sm:block">{command.category}</p>
            </div>
          </div>
          <Button
            variant="default"
            size="sm"
            className="bg-green-600 hover:bg-green-500 gap-2"
            onClick={exportMarkdown}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">导出</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Command Header */}
        <Card className="bg-slate-900/50 border-slate-800 mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-mono text-green-400">{command.name}</CardTitle>
                <p className="text-slate-400 mt-1">{command.description}</p>
              </div>
              <Badge className="bg-slate-800 text-slate-300">{command.category}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-800 rounded-lg p-4 font-mono">
              <code className="text-green-400 text-lg">{command.syntax}</code>
            </div>
          </CardContent>
        </Card>

        {/* Arguments */}
        {command.args.length > 0 && (
          <Card className="bg-slate-900/50 border-slate-800 mb-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                参数说明
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {command.args.map((arg, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-lg"
                >
                  <code className="font-mono text-green-400 bg-slate-900 px-3 py-1.5 rounded text-sm shrink-0 min-w-[120px]">
                    {arg.name}
                  </code>
                  <div className="flex-1">
                    <p className="text-slate-300">{arg.description}</p>
                    {arg.example && (
                      <p className="text-xs text-slate-500 mt-1">例如: {arg.example}</p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Examples */}
        {command.examples.length > 0 && (
          <Card className="bg-slate-900/50 border-slate-800 mb-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                使用示例
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {command.examples.map((ex, idx) => (
                <div key={idx} className="space-y-2">
                  <p className="text-slate-400">{ex.description}</p>
                  <div className="relative group">
                    <pre className="bg-slate-800 rounded-lg p-4 pr-14 overflow-x-auto">
                      <code className="text-green-400 font-mono text-sm">{ex.command}</code>
                    </pre>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(ex.command, `ex-${idx}`)}
                        >
                          {copiedId === `ex-${idx}` ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-slate-400" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{copiedId === `ex-${idx}` ? '已复制!' : '复制命令'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Back Links */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/')} className="border-slate-700">
                返回首页
              </Button>
              {command.category && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/')}
                  className="border-slate-700"
                >
                  查看同类命令
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
