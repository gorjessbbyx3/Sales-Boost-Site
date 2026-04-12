import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Image, FileText, Share2, Megaphone, Palette, Sparkles,
  ExternalLink, Loader2, AlertCircle, LayoutTemplate, Video,
} from "lucide-react";

declare global {
  interface Window {
    CCEverywhere: any;
  }
}

const CLIENT_ID = import.meta.env.VITE_ADOBE_EXPRESS_CLIENT_ID as string;
const APP_NAME = "TechSavvy Marketing Studio";
const SDK_URL = "https://cc-embed.adobe.com/sdk/v4/CCEverywhere.js";

const TEMPLATES = [
  {
    id: "flyer",
    label: "Business Flyer",
    description: "Zero-fee processing promo flyer for local businesses",
    icon: Megaphone,
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
    templateId: undefined,
  },
  {
    id: "social",
    label: "Social Post",
    description: "Instagram/Facebook post for your merchant offers",
    icon: Share2,
    color: "text-pink-400",
    bg: "bg-pink-400/10 border-pink-400/20",
    templateId: undefined,
  },
  {
    id: "card",
    label: "Business Card",
    description: "Professional card for networking events",
    icon: FileText,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
    templateId: undefined,
  },
  {
    id: "banner",
    label: "Web Banner",
    description: "Promotional banner for your website or emails",
    icon: LayoutTemplate,
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
    templateId: undefined,
  },
  {
    id: "video",
    label: "Promo Video",
    description: "Short video to pitch zero-fee savings",
    icon: Video,
    color: "text-purple-400",
    bg: "bg-purple-400/10 border-purple-400/20",
    templateId: undefined,
  },
  {
    id: "custom",
    label: "Custom Design",
    description: "Start from scratch with full Adobe Express tools",
    icon: Palette,
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
    templateId: undefined,
  },
];

export default function MarketingStudioTab() {
  const [sdkReady, setSdkReady] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [launching, setLaunching] = useState<string | null>(null);
  const ccRef = useRef<any>(null);

  useEffect(() => {
    if (!CLIENT_ID) {
      setSdkError("Adobe Express client ID not configured.");
      setLoading(false);
      return;
    }

    if (window.CCEverywhere) {
      initSDK();
      return;
    }

    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    script.onload = initSDK;
    script.onerror = () => {
      setSdkError("Failed to load Adobe Express SDK. Check your network connection.");
      setLoading(false);
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  async function initSDK() {
    try {
      const sdk = await window.CCEverywhere.initialize({
        clientId: CLIENT_ID,
        appName: APP_NAME,
      });
      ccRef.current = sdk;
      setSdkReady(true);
      setLoading(false);
    } catch (err: any) {
      setSdkError(err?.message || "Failed to initialize Adobe Express.");
      setLoading(false);
    }
  }

  function openEditor(templateId: string) {
    if (!ccRef.current) return;
    setLaunching(templateId);

    const callbacks = {
      onPublish: (publishParams: any) => {
        setLaunching(null);
      },
      onClose: () => {
        setLaunching(null);
      },
      onError: (err: any) => {
        setLaunching(null);
        console.error("Adobe Express error:", err);
      },
    };

    try {
      if (templateId === "custom") {
        ccRef.current.createDesign({
          callbacks,
          outputParams: { outputType: "base64" },
          appConfig: { selectedCategory: "flyer" },
        });
      } else if (templateId === "video") {
        ccRef.current.createDesign({
          callbacks,
          outputParams: { outputType: "base64" },
          appConfig: { selectedCategory: "video" },
        });
      } else if (templateId === "social") {
        ccRef.current.createDesign({
          callbacks,
          outputParams: { outputType: "base64" },
          appConfig: { selectedCategory: "social_media" },
        });
      } else if (templateId === "card") {
        ccRef.current.createDesign({
          callbacks,
          outputParams: { outputType: "base64" },
          appConfig: { selectedCategory: "business_card" },
        });
      } else if (templateId === "banner") {
        ccRef.current.createDesign({
          callbacks,
          outputParams: { outputType: "base64" },
          appConfig: { selectedCategory: "banner" },
        });
      } else {
        ccRef.current.createDesign({
          callbacks,
          outputParams: { outputType: "base64" },
          appConfig: { selectedCategory: "flyer" },
        });
      }
    } catch (err: any) {
      setLaunching(null);
      console.error("Failed to open editor:", err);
    }
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Marketing Studio
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Create professional marketing materials with Adobe Express — no design experience needed.
          </p>
        </div>
        <Badge variant="outline" className="text-[10px] gap-1 border-primary/30 text-primary">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block" />
          Powered by Adobe Express
        </Badge>
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-sm text-muted-foreground py-12 justify-center">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading Adobe Express...
        </div>
      )}

      {sdkError && (
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-400">Could not load Adobe Express</p>
              <p className="text-xs text-muted-foreground mt-1">{sdkError}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Make sure your domain is whitelisted in the{" "}
                <a
                  href="https://developer.adobe.com/console"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary"
                >
                  Adobe Developer Console
                </a>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && !sdkError && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TEMPLATES.map((tpl) => {
              const Icon = tpl.icon;
              const isLaunching = launching === tpl.id;
              return (
                <Card
                  key={tpl.id}
                  className={`border transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 cursor-pointer ${tpl.bg}`}
                  data-testid={`card-template-${tpl.id}`}
                  onClick={() => !launching && openEditor(tpl.id)}
                >
                  <CardContent className="p-4 flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div className={`p-2 rounded-lg bg-background/60 border border-border/30`}>
                        <Icon className={`w-4 h-4 ${tpl.color}`} />
                      </div>
                      {isLaunching && (
                        <Loader2 className="w-3.5 h-3.5 text-muted-foreground animate-spin" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tpl.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {tpl.description}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full justify-between text-xs mt-auto border border-border/30 hover:border-primary/30 hover:bg-primary/5"
                      disabled={!!launching}
                      data-testid={`button-open-${tpl.id}`}
                      onClick={(e) => { e.stopPropagation(); openEditor(tpl.id); }}
                    >
                      {isLaunching ? "Opening..." : "Open in Adobe Express"}
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="border-border/30 bg-muted/10">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Image className="w-4 h-4 text-muted-foreground" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside">
                <li>Pick a template above — Adobe Express opens in a popup editor.</li>
                <li>Customize text, colors, images, and branding to match your merchant.</li>
                <li>Click <strong className="text-foreground">Publish</strong> inside the editor to save your design.</li>
                <li>Download or share the finished asset directly from Adobe Express.</li>
              </ol>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
