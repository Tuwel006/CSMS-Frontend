import React from "react";
import { Stack, Box, Text, Table, Card } from "../../ui/lib";
import { useTheme } from "../../../context/ThemeContext";
import { BallCircle } from "./BallCircle";
import { Innings, Batsman } from "@/types/scoreService";

interface InningsDetailsProps {
    inn: Innings;
    allBatsmen: Batsman[];
}

export const InningsDetails: React.FC<InningsDetailsProps> = ({ inn, allBatsmen }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const getDismissalText = (batsman: any) => {
        if (!batsman.w) return batsman.status || (batsman.isStriker !== undefined && batsman.b > 0 ? "batting" : "");

        const wicketType = batsman.w.wicket_type;
        const by = batsman.w.by;
        const bowler = batsman.w.bowler;

        let text = "";

        if (wicketType === "Caught") {
            text = "c";
            if (by) text += ` ${by}`;
            if (bowler) text += ` b ${bowler}`;
        } else if (wicketType === "Bowled") {
            text = bowler ? `b ${bowler}` : "bowled";
        } else if (wicketType === "Run Out") {
            text = "run out";
            if (by) text += ` (${by})`;
        } else if (wicketType === "Stumped") {
            text = "st";
            if (by) text += ` ${by}`;
            if (bowler) text += ` b ${bowler}`;
        } else if (wicketType === "LBW") {
            text = "lbw";
            if (bowler) text += ` b ${bowler}`;
        } else if (wicketType === "Hit Wicket") {
            text = "hit wicket";
            if (bowler) text += ` b ${bowler}`;
        } else {
            text = wicketType?.toLowerCase() || '';
        }

        return text;
    };

    const battingColumns = [
        {
            key: 'n',
            label: 'Batter',
            cellRender: (row: any) => (
                <Stack direction="col" gap="none">
                    <Stack direction="row" align="center" gap="xs">
                        <Text weight="medium" size="sm" className={isDark ? "text-cyan-400" : "text-cyan-600"}>
                            {row.n}
                        </Text>
                        {row.isStriker && <Text className="text-yellow-500 text-sm">★</Text>}
                    </Stack>
                    <Text size="xs" className={isDark ? "text-gray-400" : "text-gray-500"}>
                        {getDismissalText(row)}
                    </Text>
                </Stack>
            )
        },
        { key: 'r', label: 'R', align: 'center' as const, cellClassName: `font-bold ${isDark ? "text-gray-100" : "text-gray-900"}` },
        { key: 'b', label: 'B', align: 'center' as const, cellClassName: isDark ? "text-gray-300" : "text-gray-700" },
        { key: '4s', label: '4s', align: 'center' as const, render: (v: any) => v || 0, cellClassName: `${isDark ? "text-orange-400" : "text-orange-600"} font-medium` },
        { key: '6s', label: '6s', align: 'center' as const, render: (v: any) => v || 0, cellClassName: `${isDark ? "text-orange-400" : "text-orange-600"} font-medium` },
        { key: 'sr', label: 'SR', align: 'center' as const, render: (v: any) => v || "0.00", cellClassName: isDark ? "text-gray-300" : "text-gray-700" },
        { key: 'arrow', label: '', width: 'w-6', align: 'center' as const, cellRender: () => <Text className={isDark ? "text-gray-400" : "text-gray-500"}>›</Text> }
    ];

    const bowlingColumns = [
        {
            key: 'n',
            label: 'Bowler',
            cellRender: (row: any) => (
                <Text weight="medium" size="sm" className={isDark ? "text-cyan-400" : "text-cyan-600"}>
                    {row.n}
                </Text>
            )
        },
        { key: 'o', label: 'O', align: 'center' as const },
        { key: 'm', label: 'M', align: 'center' as const, render: (v: any) => v || 0 },
        { key: 'r', label: 'R', align: 'center' as const },
        { key: 'w', label: 'W', align: 'center' as const, cellClassName: `font-bold ${isDark ? "text-gray-100" : "text-gray-900"}` },
        { key: '4s', label: '4s', align: 'center' as const, render: (v: any) => v || 0 },
        { key: '6s', label: '6s', align: 'center' as const, render: (v: any) => v || 0 },
        { key: 'extras', label: 'Ex', align: 'center' as const, render: (v: any) => v || 0 },
        { key: 'eco', label: 'Eco', align: 'center' as const },
        { key: 'arrow', label: '', width: 'w-6', align: 'center' as const, cellRender: () => <Text className={isDark ? "text-gray-400" : "text-gray-500"}>›</Text> }
    ];

    return (
        <Card p="none" className="mt-2 sm:mt-3 border">
            <Box className="p-2 sm:p-3">
                {/* Batting Table */}
                <Box className="mb-3">
                    <Box className={`${isDark ? "bg-gray-750" : "bg-gray-100"} px-3 sm:px-4 py-1.5 sm:py-2 rounded-t-sm`}>
                        <Text weight="semibold" size="xs" className={isDark ? "text-gray-200" : "text-gray-700"}>Batter</Text>
                    </Box>
                    <Table columns={battingColumns} data={allBatsmen} />

                    {/* Extras & Total */}
                    <Box className={`border-t ${isDark ? "border-gray-700 bg-gray-750" : "border-gray-200 bg-gray-50"} px-4 py-2`}>
                        <Text size="xs" className={isDark ? "text-gray-300" : "text-gray-700"}>
                            <Text weight="semibold">Extras</Text>
                            <Text className="ml-2">{inn?.extras || "0 (b 0, lb 0, w 0, nb 0, p 0)"}</Text>
                        </Text>
                    </Box>

                    <Box className={`border-t ${isDark ? "border-gray-700 bg-cyan-900" : "border-gray-200 bg-cyan-50"} px-4 py-2`}>
                        <Text size="xs" weight="bold" className={isDark ? "text-cyan-200" : "text-cyan-900"}>
                            <Text>Total</Text>
                            <Text className="ml-4">{inn?.score.r}-{inn?.score.w} ({inn?.score.o} Overs, RR: {inn?.runRate || "0.00"})</Text>
                        </Text>
                    </Box>

                    {/* Did not Bat */}
                    {inn?.didNotBat && inn.didNotBat.length > 0 && (
                        <Box className={`border-t ${isDark ? "border-gray-700" : "border-gray-200"} px-4 py-2`}>
                            <Text size="xs" weight="semibold" className={isDark ? "text-gray-300" : "text-gray-700"}>Did not Bat</Text>
                            <Text size="xs" className={`ml-2 ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>
                                {inn.didNotBat.join(", ")}
                            </Text>
                        </Box>
                    )}
                </Box>

                {/* Bowling Table */}
                <Box className="mb-3">
                    <Box className={`${isDark ? "bg-gray-750" : "bg-gray-100"} px-3 sm:px-4 py-1.5 sm:py-2 rounded-t-sm`}>
                        <Text weight="semibold" size="xs" className={isDark ? "text-gray-200" : "text-gray-700"}>Bowler</Text>
                    </Box>
                    <Table columns={bowlingColumns} data={inn?.bowling || []} />
                </Box>

                {/* Current Over */}
                {inn?.currentOver && inn.currentOver.balls && inn.currentOver.balls.length > 0 && (
                    <Box className="mt-3">
                        <Box className={`${isDark ? "bg-gray-750" : "bg-gray-100"} px-3 sm:px-4 py-1.5 sm:py-2 rounded-t-sm`}>
                            <Text weight="semibold" size="xs" className={isDark ? "text-gray-200" : "text-gray-700"}>Current Over</Text>
                        </Box>
                        <Box p="md" className={isDark ? "bg-gray-800" : "bg-white"}>
                            <Stack direction="row" gap="sm" wrap>
                                {inn.currentOver.balls.map((ball: any, idx: number) => (
                                    <BallCircle key={idx} ball={ball} />
                                ))}
                            </Stack>
                        </Box>
                    </Box>
                )}
            </Box>
        </Card>
    );
};
