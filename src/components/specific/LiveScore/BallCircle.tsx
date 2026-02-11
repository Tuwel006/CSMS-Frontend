import React from "react";
import { Box } from "../../ui/lib";
import { useTheme } from "../../../context/ThemeContext";

interface BallCircleProps {
    ball: {
        t: string;
        r: number | string;
    };
}

export const BallCircle: React.FC<BallCircleProps> = ({ ball }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const getBallStyle = () => {
        if (ball.t === "WIDE" || ball.t === "NO_BALL") return isDark ? "bg-red-600 text-white" : "bg-red-500 text-white";
        if (ball.r === 6) return isDark ? "bg-purple-600 text-white" : "bg-purple-500 text-white";
        if (ball.r === 4) return isDark ? "bg-green-600 text-white" : "bg-green-500 text-white";
        if (ball.r === 0) return isDark ? "bg-gray-700 text-gray-300" : "bg-gray-300 text-gray-700";
        return isDark ? "bg-cyan-700 text-white" : "bg-cyan-500 text-white";
    };

    return (
        <Box
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm ${getBallStyle()}`}
        >
            {ball.t === "WIDE" ? "WD" : ball.t === "NO_BALL" ? "NB" : ball.r}
        </Box>
    );
};
