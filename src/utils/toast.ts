import { toast, ToastOptions, Id } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Default configuration for glass-morphism toasts
const defaultToastOptions: ToastOptions = {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
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

const getToastType = (status: number): 'success' | 'warning' | 'error' => {
    if (status >= 200 && status < 300) return 'success';
    if (status >= 400 && status < 500) return 'warning'; // Treat client errors as warnings/alerts
    return 'error'; // 500+ or others
};

const getToastIcon = (type: 'success' | 'warning' | 'error') => {
    switch (type) {
        case 'success': return "✅" as any;
        case 'warning': return "⚠️" as any;
        case 'error': return "❌" as any;
    }
};

const getBorderColor = (type: 'success' | 'warning' | 'error') => {
    switch (type) {
        case 'success': return "#10b981"; // Green
        case 'warning': return "#f59e0b"; // Amber/Orange
        case 'error': return "#ef4444";   // Red
    }
};

export const showToast = {
    loading: (message: string): Id => {
        return toast.loading(message, {
            ...defaultToastOptions,
            style: {
                ...defaultToastOptions.style,
                borderLeft: "2px solid #3b82f6" // Thinner accent line
            }
        });
    },

    // Main function to handle API responses based on status code
    handleResponse: (toastId: Id, response: ApiResponse | any) => {
        let status = 500;
        let message = "Unknown error occurred";

        // Priority 1: Check if it's our direct ApiResponse format (success case mostly) or a non-Axios error result
        if (response?.status && response?.message && !response.response) {
            status = response.status;
            message = response.message;
        }
        // Priority 2: Axios Error Object (has .response)
        else if (response?.response?.data) {
            const data = response.response.data;
            status = data.status || response.response.status || 500;

            // Extract message: Prefer data.message "Tenant access required"
            if (data.message) {
                message = data.message;
            } else if (typeof data === 'string') {
                message = data;
            } else {
                // Fallback to Axios message ONLY if server message is truly missing
                message = response.message || "An error occurred";
            }
        }
        // Priority 3: Generic Error/Axios Error without response (e.g. Network Error)
        else if (response instanceof Error) {
            message = response.message || "An error occurred";
        }
        // Priority 4: Fallback for unknown object
        else if (response?.message) {
            message = response.message;
        }

        const type = getToastType(status);
        const icon = getToastIcon(type);
        const borderColor = getBorderColor(type);

        toast.update(toastId, {
            render: message, // Will be "Tenant access required"
            type: type,
            isLoading: false,
            autoClose: 4000,
            icon: icon,
            style: {
                ...defaultToastOptions.style,
                borderLeft: `2px solid ${borderColor}` // Thinner accent line
            }
        });
    },

    // Direct helpers if needed
    success: (message: string) => {
        toast.success(message, {
            ...defaultToastOptions,
            icon: "✅" as any,
            style: { ...defaultToastOptions.style, borderLeft: "2px solid #10b981" }
        });
    },
    error: (message: string) => {
        toast.error(message, {
            ...defaultToastOptions,
            icon: "❌" as any,
            style: { ...defaultToastOptions.style, borderLeft: "2px solid #ef4444" }
        });
    }
};
