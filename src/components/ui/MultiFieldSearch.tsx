import React from 'react';
import Input from './Input';

export interface SearchField {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    className?: string;
    inputClassName?: string;
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
            <div className="grid grid-cols-12 gap-2 items-end mb-4">
                {fields.map((field, index) => (
                    <Input
                        key={index}
                        type={field.type || 'text'}
                        label={field.label}
                        placeholder={field.placeholder}
                        value={field.value}
                        onChange={field.onChange}
                        size="md"
                        containerClassName={field.className || "col-span-12 md:col-span-3"}
                        className={field.inputClassName}
                    />
                ))}
                {actions && (
                    <div className="col-span-12 md:col-span-auto flex items-end justify-end">
                        {actions}
                    </div>
                )}
            </div>

            {showDropdown && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-lg shadow-2xl mt-1 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 animate-in fade-in zoom-in-95 duration-200">
                    {suggestions.map((item, index) => (
                        <div
                            key={index}
                            className="px-4 py-2.5 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 cursor-pointer text-sm text-[var(--text)] border-b last:border-0 border-gray-100 dark:border-gray-800/50 transition-colors"
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
