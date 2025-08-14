import { useEffect, useRef, useState } from "react";
import styles from "./ScrollingGameHeader.module.css";

interface ScrollingHeaderProps {
  text: string;
  speed?: number; // pixels per second
  breakpoint?: number; // max width to enable animation
  categoryHeaderStyle: categoryHeaderStyle;
}

interface categoryHeaderStyle {
  backgroundColor: string;
  color: string;
  borderRadius: string;
}


const ScrollingGameHeader = ({
  text,
  speed = 26,
  breakpoint = 768,
  categoryHeaderStyle
}: ScrollingHeaderProps) => {
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    const checkScreen = () => {
      setIsSmallScreen(window.innerWidth < breakpoint);
    };

    console.log(window.innerWidth, breakpoint, window.innerWidth < breakpoint);

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, [breakpoint]);

  useEffect(() => {
    if (!isSmallScreen) {
      if (textRef.current){
        textRef.current.style.transition = "none";
        textRef.current.style.transform = "translateX(0)";
      }
      return;
    }

    const textEl = textRef.current;
    const containerEl = containerRef.current;
    if (!textEl || !containerEl) return;

    const containerWidth = containerEl.offsetWidth;
    const textWidth = textEl.offsetWidth;

    const distance = containerWidth + textWidth;
    const duration = distance / speed;

    const startScroll = () => {
      textEl.style.transition = "none";
      textEl.style.transform = `translateX(${containerWidth}px)`;

      requestAnimationFrame(() => {
        textEl.style.transition = `transform ${duration}s linear`;
        textEl.style.transform = `translateX(-${textWidth}px)`;
      });
    };

    startScroll();
    const interval = setInterval(startScroll, duration * 1000);

    return () => clearInterval(interval);
  }, [isSmallScreen, text, speed]);

  return (
    <div
      ref={containerRef}
      className={styles.categoryHeader}
      style={categoryHeaderStyle}
    >
      <div ref={textRef} className={styles.categoryHeaderText}>
        {text}
      </div>
    </div>
  );
};

export default ScrollingGameHeader;
