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
            <div className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-12 md:col-span-10 grid grid-cols-10 gap-2 relative">
                    {fields.map((field, index) => {
                        // Dynamically calculate grid columns based on original intent (4+4+2 = 10)
                        const gridClass = field.className?.includes('md:col-span-4')
                            ? 'md:col-span-4'
                            : field.className?.includes('md:col-span-2')
                                ? 'md:col-span-2'
                                : 'md:col-span-3';

                        return (
                            <Input
                                key={index}
                                type={field.type || 'text'}
                                label={field.label}
                                placeholder={field.placeholder}
                                value={field.value}
                                onChange={field.onChange}
                                size="md"
                                containerClassName={`${field.className?.split(' ')[0] || "col-span-12"} ${gridClass}`}
                                className={field.inputClassName}
                            />
                        );
                    })}

                    {/* Dropdown - Anchored only to the input fields grid */}
                    {showDropdown && suggestions.length > 0 && (
                        <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-[60] bg-[var(--card-bg)]/95 backdrop-blur-xl border border-[var(--card-border)] rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.3)] max-h-60 overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-top-2 duration-300">
                            {suggestions.map((item, index) => (
                                <div
                                    key={index}
                                    className="px-4 py-3 hover:bg-cyan-500/10 cursor-pointer text-[12px] font-bold uppercase tracking-wider text-[var(--text)] border-b last:border-0 border-[var(--card-border)] transition-all flex items-center justify-between group"
                                    onClick={() => onSelect(item)}
                                >
                                    <span>{renderSuggestion(item)}</span>
                                    <div className="w-4 h-4 rounded-full bg-cyan-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {actions && (
                    <div className="col-span-12 md:col-span-2 flex items-end justify-end pb-0.5">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MultiFieldSearch;
