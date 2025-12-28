import { useState } from 'react';
import SearchableForm, { InputField, DropdownConfig } from './SearchableForm';

const SearchableFormExample = () => {
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  // Example 1: Player Search Form
  const playerInputs: InputField[] = [
    {
      key: 'playerName',
      type: 'text',
      label: 'Player Name',
      placeholder: 'Enter player name',
      validation: { required: true }
    },
    {
      key: 'team',
      type: 'text',
      label: 'Team',
      placeholder: 'Select team'
    },
    {
      key: 'age',
      type: 'number',
      label: 'Age',
      placeholder: 'Enter age',
      validation: { required: true }
    }
  ];

  const playerDropdowns: DropdownConfig[] = [
    {
      id: 'playerSearch',
      triggerFields: ['playerName', 'team'],
      searchFunction: async (_params) => {
        // Mock API call
        return {
          data: {
            data: [
              { id: 1, name: 'John Doe', team: 'Team A', age: 25 },
              { id: 2, name: 'Jane Smith', team: 'Team B', age: 28 }
            ]
          }
        };
      },
      displayFormat: (item) => `${item.name} - ${item.team} (Age: ${item.age})`,
      onSelect: (item) => {
        setFormValues(prev => ({
          ...prev,
          playerName: item.name,
          team: item.team,
          age: item.age.toString()
        }));
      },
      position: 'below',
      maxHeight: '200px'
    }
  ];

  // Example 2: Match Setup Form
  const matchInputs: InputField[] = [
    {
      key: 'matchTitle',
      type: 'text',
      label: 'Match Title',
      placeholder: 'Enter match title',
      validation: { required: true }
    },
    {
      key: 'venue',
      type: 'text',
      label: 'Venue',
      placeholder: 'Enter venue'
    },
    {
      key: 'overs',
      type: 'number',
      label: 'Overs',
      placeholder: 'Number of overs',
      validation: { required: true }
    },
    {
      key: 'matchType',
      type: 'text',
      label: 'Match Type',
      placeholder: 'Select type'
    }
  ];

  const matchDropdowns: DropdownConfig[] = [
    {
      id: 'venueSearch',
      triggerFields: ['venue'],
      searchFunction: async (_params) => {
        return {
          data: {
            data: [
              { id: 1, name: 'Stadium A', city: 'City 1' },
              { id: 2, name: 'Stadium B', city: 'City 2' }
            ]
          }
        };
      },
      displayFormat: (item) => `${item.name}, ${item.city}`,
      onSelect: (item) => {
        setFormValues(prev => ({ ...prev, venue: item.name }));
      }
    }
  ];

  const handleValueChange = (key: string, value: string) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8 p-6">
      <SearchableForm
        title="Player Search"
        inputs={playerInputs}
        values={formValues}
        onValueChange={handleValueChange}
        dropdowns={playerDropdowns}
        layout={{
          columns: 3,
          gap: '4',
          className: 'mb-6'
        }}
      />

      <SearchableForm
        title="Match Setup"
        inputs={matchInputs}
        values={formValues}
        onValueChange={handleValueChange}
        dropdowns={matchDropdowns}
        layout={{
          columns: 2,
          gap: '6'
        }}
      />
    </div>
  );
};

export default SearchableFormExample;