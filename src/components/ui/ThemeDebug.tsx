import { useTheme } from "../../context/ThemeContext";

const ThemeDebug = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="fixed top-20 right-4 z-50 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
      <p className="text-sm text-gray-900 dark:text-gray-100">Current theme: {theme}</p>
      <button 
        onClick={toggleTheme}
        className="mt-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
      >
        Toggle Theme
      </button>
    </div>
  );
};

export default ThemeDebug;