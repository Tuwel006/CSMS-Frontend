import { useTheme } from "../../context/ThemeContext";

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ message, onConfirm, onCancel }) => {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
      <div
        className={`rounded-lg p-6 w-11/12 max-w-sm transition-all shadow-lg ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-lg font-bold mb-4">Confirm Selection</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
