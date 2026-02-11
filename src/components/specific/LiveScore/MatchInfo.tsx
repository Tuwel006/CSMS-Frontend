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
        <Card p="md" title="Match Information" className="mt-2 sm:mt-3">
            <Grid cols={{ default: 2, sm: 2, lg: 2 }} gap={3} className="text-xs">
                <InfoRow label="Format" value={data.meta.format} />
                <InfoRow label="Status" value={data.meta.status} className="capitalize" />
                <InfoRow label="Match ID" value={data.meta.matchId} className="truncate" />
                <InfoRow label="Last Updated" value={new Date(data.meta.lastUpdated)?.toLocaleTimeString()} />
            </Grid>

            <Box className={`mt-3 pt-3 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                <Text size="xs" weight="medium" className={`${isDark ? "text-gray-400" : "text-gray-500"} mb-2 block`}>Teams</Text>
                <Stack direction="row" gap="sm" className="flex-col sm:flex-row">
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
        <Stack direction="row" align="center" gap="sm" className={`flex-1 ${isDark ? "bg-gray-750" : "bg-gray-50"} rounded p-2`}>
            <Box className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white font-bold text-xs rounded">
                {short}
            </Box>
            <Text size="xs" weight="medium" className={isDark ? "text-gray-200" : "text-gray-900"}>{name}</Text>
        </Stack>
    );
};
