import React from 'react';
import Input from './Input';

export interface SearchField {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    className?: string;
}

interface MultiFieldSearchProps<T> {
    fields: SearchField[];
    suggestions: T[];
    showDropdown: boolean;
    onSelect: (item: T) => void;
    renderSuggestion: (item: T) => React.ReactNode;
    className?: string;
    actions?: React.ReactNode;
}

const MultiFieldSearch = <T,>({
    fields,
    suggestions,
    showDropdown,
    onSelect,
    renderSuggestion,
    className = '',
    actions,
}: MultiFieldSearchProps<T>) => {
    return (
        <div className={`relative ${className}`}>
            <div className="flex flex-col md:flex-row gap-2 mb-4 items-end">
                {fields.slice(0, -1).map((field, index) => (
                    <Input
                        key={index}
                        type={field.type || 'text'}
                        label={field.label}
                        placeholder={field.placeholder}
                        value={field.value}
                        onChange={field.onChange}
                        size="md"
                        containerClassName={field.className || "flex-1"}
                    />
                ))}
                <div className="flex flex-row gap-2 items-end w-full md:w-auto">
                    {fields.slice(-1).map((field) => (
                        <Input
                            key={fields.length - 1}
                            type={field.type || 'text'}
                            label={field.label}
                            placeholder={field.placeholder}
                            value={field.value}
                            onChange={field.onChange}
                            size="md"
                            containerClassName={field.className || "flex-1"}
                        />
                    ))}
                    {actions && <div className="flex gap-2 mb-[2px]">{actions}</div>}
                </div>
            </div>
            {showDropdown && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {suggestions.map((item, index) => (
                        <div
                            key={index}
                            className="px-3 py-2 hover:bg-[var(--hover-bg)] cursor-pointer text-sm text-[var(--text)]"
                            onClick={() => onSelect(item)}
                        >
                            {renderSuggestion(item)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MultiFieldSearch;
