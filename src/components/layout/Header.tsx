import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-20 h-16 bg-[var(--card-bg)] border-b border-[var(--card-border)] flex items-center justify-between px-6">
      <h1 className="text-xl font-bold text-[var(--text)]">Cricket Live Score</h1>
      <button
        onClick={toggleTheme}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        aria-label="Toggle Theme"
      >
        {theme === "dark" ? <Sun className="text-[var(--text)]" /> : <Moon className="text-[var(--text)]" />}
      </button>
    </header>
  );
};

export default Header;
