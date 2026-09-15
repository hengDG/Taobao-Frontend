import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 350);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleScrollToTop}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#194891] text-white shadow-lg shadow-slate-300/60 transition hover:scale-105 hover:bg-[#143d78]"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
