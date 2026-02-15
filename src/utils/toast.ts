import { toast, ToastOptions, Id } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Default configuration for glass-morphism toasts
const defaultToastOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    pauseOnFocusLoss: false,
    draggable: true,
    closeButton: false,
    style: {
        background: "rgba(255, 255, 255, 0.55)", // Slightly less transparent for 'classic' readability
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        borderRadius: "6px", // Classic small radius
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)", // Subtler shadow
        color: "#1f2937",
        fontWeight: "500",
        fontSize: "13px",
        padding: "8px 12px", // Compact padding
        minHeight: "40px",
        marginRight: "16px"
    }
};

export interface ApiResponse {
    status: number;
    code?: string;
    message: string;
    data?: any;
}

// Unused icons/colors removed for brevity and warnings cleanup

export const showToast = {
    loading: (message: string): Id => {
        return toast.loading(message, {
            ...defaultToastOptions,
            style: {
                ...defaultToastOptions.style,
                borderLeft: "2px solid #3b82f6"
            }
        });
    },

    // Main function to handle API responses based on status code
    handleResponse: (toastId: Id, response: ApiResponse | any) => {
        const status = response?.status || 500;
        const message = response?.message || (response?.response?.data?.message) || (response instanceof Error ? response.message : "An error occurred");

        // Dismiss the loading toast regardless of outcome
        toast.dismiss(toastId);

        if (status >= 200 && status < 300) {
            showToast.success(message);
        } else {
            showToast.error(message);
        }
    },

    // Direct helpers if needed
    success: (message: string) => {
        toast.success(message || 'Success', {
            ...defaultToastOptions,
            autoClose: false,
            icon: "✅" as any,
            style: { ...defaultToastOptions.style, borderLeft: "2px solid #10b981" }
        });
    },
    error: (msg: string | any) => {
        const message = typeof msg === 'string' ? msg : (msg?.message || 'Error occurred');
        toast.error(message, {
            ...defaultToastOptions,
            autoClose: false,
            icon: "❌" as any,
            style: { ...defaultToastOptions.style, borderLeft: "2px solid #ef4444" }
        });
    }
};
