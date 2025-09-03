import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 bg-[var(--card-bg)] border-b border-[var(--card-border)] flex items-center justify-between px-6 sticky top-0 z-40">
      <h1 className="text-xl font-bold text-[var(--text)]">Cricket Live Score</h1>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? <Sun className="text-[var(--text)]" /> : <Moon className="text-[var(--text)]" />}
        </button>
        <span className="text-sm text-[var(--text)]">Admin</span>
        <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Logout</button>
      </div>
    </header>
  );
};

export default Header;
