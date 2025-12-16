import { useState } from 'react';
import { Edit2, Trash2, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { Player } from '../types/player';

interface TeamCardProps {
    teamNumber: number;
    name: string;
    short_name?: string;
    teamId: number | null | string;
    players: Player[];
    onEdit: () => void;
    onDelete: () => void;
}

const TeamCard = ({
    teamNumber,
    name,
    short_name,
    teamId,
    players,
    onEdit,
    onDelete,
}: TeamCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="rounded-md border border-[var(--card-border)] bg-[var(--card-bg)] shadow-sm hover:shadow-md transition-shadow">
            {/* Team Header */}
            <div className="flex items-center justify-between p-3.5 border-b border-[var(--card-border)]">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold text-sm">
                        T{teamNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base text-[var(--text)] truncate">{name}</h4>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-600 dark:text-gray-400">
                            <span className="truncate">{short_name}</span>
                            {teamId && (
                                <>
                                    <span className="text-gray-400">•</span>
                                    <span>ID: {teamId}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex gap-1 ml-2">
                    <button
                        onClick={onEdit}
                        className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        title="Edit team"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        title="Delete team"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Players Section */}
            <div className="p-3">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <Users size={16} />
                        <span>Players ({players.length})</span>
                    </div>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {/* Collapsed View - Show first player */}
                {!isExpanded && players.length > 0 && (
                    <div className="mt-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400">
                        <span className="font-medium text-gray-700 dark:text-gray-300">{players[0].name}</span>
                        {players[0].id && <span className="ml-2">#{players[0].id}</span>}
                        <span className="ml-2 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded capitalize">
                            {players[0].role}
                        </span>
                        {players.length > 1 && (
                            <span className="ml-2 text-gray-500">+{players.length - 1} more</span>
                        )}
                    </div>
                )}

                {/* Expanded View - Show all players */}
                {isExpanded && (
                    <div className="mt-2 space-y-1.5">
                        {players.length === 0 ? (
                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
                                No players added yet
                            </p>
                        ) : (
                            players.map((player, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded text-xs"
                                >
                                    <span className="font-medium text-gray-700 dark:text-gray-300 truncate flex-1">
                                        {player.name}
                                    </span>
                                    {player.id && (
                                        <span className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                                            #{player.id}
                                        </span>
                                    )}
                                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full capitalize">
                                        {player.role}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamCard;
