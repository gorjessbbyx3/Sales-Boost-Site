import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Bot, Save, Zap, Settings, MessageSquare } from "lucide-react";
import type { AiConfig } from "@shared/schema";
import { useState, useEffect } from "react";

const MODELS = [
  { value: "claude-sonnet-4-20250514", label: "Claude Sonnet 4 (Latest)" },
  { value: "claude-3-7-sonnet-20250219", label: "Claude 3.7 Sonnet" },
  { value: "claude-3-5-haiku-20241022", label: "Claude 3.5 Haiku (Fast)" },
];

export default function AiConfigPage() {
  const { toast } = useToast();

  const { data: config, isLoading } = useQuery<AiConfig>({
    queryKey: ["/api/ai-config"],
  });

  const [enabled, setEnabled] = useState(false);
  const [model, setModel] = useState("claude-sonnet-4-20250514");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [maxTokens, setMaxTokens] = useState(1024);

  useEffect(() => {
    if (config) {
      setEnabled(config.enabled);
      setModel(config.model);
      setSystemPrompt(config.systemPrompt);
      setWelcomeMessage(config.welcomeMessage);
      setMaxTokens(config.maxTokens);
    }
  }, [config]);

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<AiConfig>) => {
      const res = await apiRequest("PATCH", "/api/ai-config", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai-config"] });
      toast({ title: "Settings saved", description: "AI agent configuration updated." });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (newEnabled: boolean) => {
      const res = await apiRequest("PATCH", "/api/ai-config", { enabled: newEnabled });
      return res.json();
    },
    onSuccess: (data: AiConfig) => {
      setEnabled(data.enabled);
      queryClient.invalidateQueries({ queryKey: ["/api/ai-config"] });
      toast({
        title: data.enabled ? "AI Agent Enabled" : "AI Agent Disabled",
        description: data.enabled ? "The chatbot is now live on your landing page." : "The chatbot has been turned off.",
      });
    },
  });

  const handleSave = () => {
    saveMutation.mutate({ model, systemPrompt, welcomeMessage, maxTokens });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading configuration...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 flex-wrap mb-8">
          <Button variant="ghost" size="icon" asChild>
            <a href="/" data-testid="link-back-home">
              <ArrowLeft />
            </a>
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold flex items-center gap-2.5 flex-wrap" data-testid="text-config-title">
              <Bot className="w-6 h-6 text-primary" />
              AI Agent Settings
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Configure your AI chatbot powered by Anthropic Claude</p>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="overflow-visible border-primary/10">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/5 to-transparent" />
            <CardHeader className="relative">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-primary/15 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg" data-testid="text-toggle-title">Agent Status</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">Turn the AI chatbot on or off for site visitors</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={enabled ? "default" : "outline"} data-testid="badge-status">
                    {enabled ? "Active" : "Inactive"}
                  </Badge>
                  <Switch
                    checked={enabled}
                    onCheckedChange={(checked) => {
                      setEnabled(checked);
                      toggleMutation.mutate(checked);
                    }}
                    data-testid="switch-enabled"
                  />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="overflow-visible border-primary/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-chart-2/15 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-chart-2" />
                </div>
                <div>
                  <CardTitle className="text-lg">Model Settings</CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">Choose the AI model and response limits</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="model" className="text-sm font-medium">AI Model</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger data-testid="select-model">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {MODELS.map((m) => (
                      <SelectItem key={m.value} value={m.value} data-testid={`option-model-${m.value}`}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxTokens" className="text-sm font-medium">Max Response Length</Label>
                <Select value={String(maxTokens)} onValueChange={(v) => setMaxTokens(Number(v))}>
                  <SelectTrigger data-testid="select-max-tokens">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="512">Short (512 tokens)</SelectItem>
                    <SelectItem value="1024">Medium (1024 tokens)</SelectItem>
                    <SelectItem value="2048">Long (2048 tokens)</SelectItem>
                    <SelectItem value="4096">Very Long (4096 tokens)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-visible border-primary/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-chart-4/15 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-chart-4" />
                </div>
                <div>
                  <CardTitle className="text-lg">Chat Configuration</CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">Customize the agent's personality and greeting</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="systemPrompt" className="text-sm font-medium">System Prompt</Label>
                <p className="text-xs text-muted-foreground">Instructions that tell the AI how to behave and what it knows about your business</p>
                <Textarea
                  id="systemPrompt"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={6}
                  className="resize-none text-sm"
                  data-testid="input-system-prompt"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="welcomeMessage" className="text-sm font-medium">Welcome Message</Label>
                <p className="text-xs text-muted-foreground">The first message visitors see when they open the chat</p>
                <Textarea
                  id="welcomeMessage"
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  rows={3}
                  className="resize-none text-sm"
                  data-testid="input-welcome-message"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3">
            <Button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              data-testid="button-save-config"
            >
              <Save className="w-4 h-4" />
              {saveMutation.isPending ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
