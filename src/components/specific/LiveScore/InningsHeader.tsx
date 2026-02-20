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
        <Box className={isExpanded ? "mb-0" : "mb-0.5"}>
            <Stack
                direction="row"
                align="center"
                justify="between"
                className={`cursor-pointer transition-colors px-2 sm:px-3 py-1.5 ${isDark ? "bg-cyan-800 text-white hover:bg-cyan-700" : "bg-cyan-600 text-white hover:bg-cyan-700 shadow-sm"
                    } ${isExpanded ? "rounded-t-sm" : "rounded-sm"}`}
                onClick={() => setExpandedInning(isExpanded ? null : idx)}
            >
                <Text weight="bold" size="xs">{inn.battingTeam}</Text>
                <Stack direction="row" align="center" gap="xs">
                    <Text weight="bold" size="base" className="text-sm sm:text-base">
                        {inn.score.r}-{inn.score.w}
                    </Text>
                    <Text size="xs" className="opacity-80 text-[10px]">({inn.score.o} Ov)</Text>
                    <Text size="xs" className="transition-transform duration-300 text-[10px]" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</Text>
                </Stack>
            </Stack>
        </Box>
    );

};
