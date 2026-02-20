import React from "react";
import { Card, Grid, InfoRow, Stack, Box, Text } from "../../ui/lib";
import { useTheme } from "../../../context/ThemeContext";

interface MatchInfoProps {
    data: any;
}

export const MatchInfo: React.FC<MatchInfoProps> = ({ data }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <Card p="sm" title="Match Information" className="mt-1.5 sm:mt-2">
            <Grid cols={{ default: 2, sm: 2, lg: 2 }} gap={2} className="text-[10px]">
                <InfoRow label="Format" value={data.meta.format} />
                <InfoRow label="Status" value={data.meta.status} className="capitalize" />
                <InfoRow label="Match ID" value={data.meta.matchId} className="truncate" />
                <InfoRow label="Last Updated" value={new Date(data.meta.lastUpdated)?.toLocaleTimeString()} />
            </Grid>

            <Box className={`mt-2 pt-2 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                <Text size="xs" weight="medium" className={`${isDark ? "text-gray-400" : "text-gray-500"} mb-1.5 block text-[10px]`}>Teams</Text>
                <Stack direction="row" gap="xs" className="flex-col sm:flex-row">
                    <TeamCard short={data.teams.A.short} name={data.teams.A.name} />
                    <TeamCard short={data.teams.B.short} name={data.teams.B.name} />
                </Stack>
            </Box>
        </Card>
    );
};

const TeamCard = ({ short, name }: { short: string, name: string }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <Stack direction="row" align="center" gap="xs" className={`flex-1 ${isDark ? "bg-gray-750" : "bg-gray-50"} rounded p-1.5`}>
            <Box className="w-5 h-5 bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white font-bold text-[10px] rounded">
                {short}
            </Box>
            <Text size="xs" weight="medium" className={`${isDark ? "text-gray-200" : "text-gray-900"} text-[11px]`}>{name}</Text>
        </Stack>
    );
};
