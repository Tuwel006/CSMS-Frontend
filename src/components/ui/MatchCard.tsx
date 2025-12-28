import { Calendar, Clock, MapPin } from 'lucide-react';
import Button from './Button';
import Card from './Card';

interface Team {
  name: string;
  short: string;
  logo: string;
}

interface MatchCardProps {
  id: string;
  team1: Team;
  team2: Team;
  venue: string;
  date: string;
  time: string;
  format: string;
  status: string;
  onAction: (id: string) => void;
  actionLabel?: string;
}

const MatchCard = ({
  id,
  team1,
  team2,
  venue,
  date,
  time,
  format,
  status,
  onAction,
  actionLabel = 'Start Match'
}: MatchCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-blue-500/50">
      {/* Match Header */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 px-6 py-4 border-b border-[var(--card-border)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-bold text-blue-600 dark:text-blue-400">
              {format}
            </div>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
              {status}
            </span>
          </div>
          <div className="text-xs text-[var(--text-secondary)] font-medium">
            Match #{id}
          </div>
        </div>
      </div>

      {/* Teams Section */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          {/* Team 1 */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-3xl mb-3 shadow-lg">
              {team1.logo}
            </div>
            <h3 className="font-bold text-[var(--text)] text-center">{team1.short}</h3>
            <p className="text-xs text-[var(--text-secondary)] text-center mt-1">{team1.name}</p>
          </div>

          {/* VS */}
          <div className="flex-shrink-0 mx-6">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <span className="text-lg font-black text-gray-400 dark:text-gray-600">VS</span>
            </div>
          </div>

          {/* Team 2 */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-3xl mb-3 shadow-lg">
              {team2.logo}
            </div>
            <h3 className="font-bold text-[var(--text)] text-center">{team2.short}</h3>
            <p className="text-xs text-[var(--text-secondary)] text-center mt-1">{team2.name}</p>
          </div>
        </div>

        {/* Match Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="text-[var(--text-secondary)] flex-shrink-0" size={16} />
            <span className="text-[var(--text-secondary)]">{venue}</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="text-[var(--text-secondary)] flex-shrink-0" size={16} />
              <span className="text-[var(--text-secondary)]">{new Date(date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="text-[var(--text-secondary)] flex-shrink-0" size={16} />
              <span className="text-[var(--text-secondary)]">{time}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => onAction(id)}
        >
          {actionLabel}
        </Button>
      </div>
    </Card>
  );
};

export default MatchCard;
