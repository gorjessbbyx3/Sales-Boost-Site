import { useEffect } from "react";
import { useLocation } from "wouter";

export default function FaqPage() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation("/how-it-works#faq");
  }, []);
  return null;
}
