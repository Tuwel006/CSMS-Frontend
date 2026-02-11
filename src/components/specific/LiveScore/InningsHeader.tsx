import React from "react";
import { Stack, Box, Text } from "../../ui/lib";
import { useTheme } from "../../../context/ThemeContext";

interface InningsHeaderProps {
    inn: any;
    idx: number;
    expandedInning: number | null;
    setExpandedInning: (idx: number | null) => void;
}

export const InningsHeader: React.FC<InningsHeaderProps> = ({
    inn,
    idx,
    expandedInning,
    setExpandedInning
}) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const isExpanded = expandedInning === idx;

    return (
        <Box className="mb-1">
            <Stack
                direction="row"
                align="center"
                justify="between"
                className={`cursor-pointer transition-colors rounded-sm px-3 sm:px-4 py-2 ${isExpanded
                    ? (isDark ? "bg-cyan-700" : "bg-cyan-600") + " text-white"
                    : (isDark ? "bg-gray-800 text-gray-200 hover:bg-gray-750" : "bg-white text-gray-900 hover:bg-gray-50 shadow-sm")
                    }`}
                onClick={() => setExpandedInning(isExpanded ? null : idx)}
            >
                <Text weight="bold" size="sm">{inn.battingTeam}</Text>
                <Stack direction="row" align="center" gap="sm">
                    <Text weight="bold" size="lg" className="text-base sm:text-lg">
                        {inn.score.r}-{inn.score.w}
                    </Text>
                    <Text size="xs" className="opacity-80">({inn.score.o} Ov)</Text>
                    <Text size="xs">{isExpanded ? '▲' : '▼'}</Text>
                </Stack>
            </Stack>
        </Box>
    );
};
