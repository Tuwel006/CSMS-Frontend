import { useState } from "react";
import { Input } from "../ui";

interface Team {
  id: string;
  name: string;
  location: string;
}

interface InputsProps {
    className?: string;
    inputs: {
        type: string;
        label: string;
        placeholder: string;
        value: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        size: "sm" | "md" | "lg";
        className?: string;
    }[];
    suggestions?: Team[];
    onSelect?: (team: Team) => void;
}

const SearchSelectInput = ({ inputs, suggestions = [], onSelect }: InputsProps) => {
  const [showTeam1Dropdown, setShowTeam1Dropdown] = useState(false);
  const [team1Suggestions] = useState<Team[]>(suggestions);

  const handleTeam1Select = (team: Team) => {
    onSelect?.(team);
    setShowTeam1Dropdown(false);
  };
  return (
    <div>
      <div className="relative">
            <div className="flex gap-2 mb-4">
              {
                inputs.map((input, index) => (
                  <Input
                    key={index}
                    type={input.type}
                    label={input.label}
                    placeholder={input.placeholder}
                    value={input.value}
                    onChange={input.onChange}
                    size={input.size}
                    className={input.className}
                  />
                ))  
              }
              
            </div>
            {showTeam1Dropdown && team1Suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md shadow-lg max-h-48 overflow-y-auto">
                {team1Suggestions.map((team, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 hover:bg-[var(--hover-bg)] cursor-pointer text-sm text-[var(--text)]"
                    onClick={() => handleTeam1Select(team)}
                  >
                    {team.name} - {team.location} - ({team.id})
                  </div>
                ))}
              </div>
            )}
          </div>
    </div>
  )
}

export default SearchSelectInput
