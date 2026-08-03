"use client";

import { useEffect } from "react";

export function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(
      ".section-heading, .problem-grid article, .process-item, .feature-card, .promise-card, .custom-site-card, .price-card, .geo-card, .faq-intro, .faq-list article, .contact-copy, .contact-form",
    );

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("motion-visible"));
      return;
    }

    elements.forEach((element) => element.classList.add("motion-ready"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("motion-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}
