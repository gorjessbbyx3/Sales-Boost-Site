import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  jsonLd?: Record<string, unknown>;
}

function setMetaTag(attr: string, key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function useSEO({
  title,
  description,
  keywords,
  canonical,
  ogTitle,
  ogDescription,
  twitterTitle,
  twitterDescription,
  jsonLd,
}: SEOProps) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    setMetaTag("name", "description", description);
    if (keywords) setMetaTag("name", "keywords", keywords);
    if (ogTitle) setMetaTag("property", "og:title", ogTitle);
    if (ogDescription) setMetaTag("property", "og:description", ogDescription);
    if (twitterTitle) setMetaTag("name", "twitter:title", twitterTitle);
    if (twitterDescription) setMetaTag("name", "twitter:description", twitterDescription);

    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) {
      if (!canonicalEl) {
        canonicalEl = document.createElement("link");
        canonicalEl.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalEl);
      }
      canonicalEl.setAttribute("href", canonical);
    }

    let scriptEl: HTMLScriptElement | null = null;
    if (jsonLd) {
      scriptEl = document.createElement("script");
      scriptEl.type = "application/ld+json";
      scriptEl.setAttribute("data-page-seo", "true");
      scriptEl.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(scriptEl);
    }

    return () => {
      document.title = prevTitle;
      if (scriptEl) scriptEl.remove();
    };
  }, [title, description, keywords, canonical, ogTitle, ogDescription, twitterTitle, twitterDescription, jsonLd]);
}
