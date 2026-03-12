import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Calendar, CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import Layout from "@/components/layout";
import { useSEO } from "@/hooks/useSEO";

export default function SchedulePage() {
  useSEO({
    title: "Schedule a Meeting | TechSavvy Hawaii",
    description: "Book a free one-on-one meeting with TechSavvy. Meet in person in Hawai'i or virtually via Zoom, Discord, or AnyDesk. Discuss next steps, ask questions, or fill out the merchant application together.",
    keywords: "schedule meeting TechSavvy, book consultation payment processing, free merchant consultation, TechSavvy appointment",
    canonical: "https://techsavvyhawaii.com/schedule",
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  return (
    <Layout>
      <section className="pt-24 sm:pt-32 pb-10 sm:pb-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeUp}>
              <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5">
                <Calendar className="w-3 h-3 mr-1.5" />
                Pick a time that works for you
              </Badge>
            </motion.div>
            <motion.h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4" variants={fadeUp}>
              Let's Sit Down{" "}
              <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">Together</span>
            </motion.h1>
            <motion.p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-6" variants={fadeUp}>
              Book a free one-on-one — in person if you're in Hawai'i, or via Zoom, Discord, AnyDesk, or whatever platform works best for you. We can answer your questions, walk through the numbers, or fill out the merchant application together. No pressure, just a conversation.
            </motion.p>
            <motion.div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6" variants={fadeUp}>
              {[
                "Ask questions about zero-fee processing",
                "Walk through your current statement together",
                "Fill out the merchant app with our help",
                "In person (Hawai'i) or virtual — your choice",
              ].map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-sm">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Card className="overflow-hidden border-primary/15">
            <CardContent className="p-0">
              <div
                className="calendly-inline-widget"
                data-url="https://calendly.com/robertsn-techsavvyhawaii/30min?hide_gdpr_banner=1&background_color=0a0a0a&text_color=fafafa&primary_color=16a34a"
                style={{ minWidth: "320px", height: "700px" }}
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
