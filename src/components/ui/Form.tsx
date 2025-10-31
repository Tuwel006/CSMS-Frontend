import { ReactNode } from 'react';
import Input from './Input';
import { cn } from '../../lib/utils';

interface InputConfig {
  type?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  value?: any;
  onChange?: (value: any) => void;
  options?: { value: any; label: string }[];
  className?: string;
  render?: () => ReactNode;
  [key: string]: any;
}

interface FormProps {
  inputs: InputConfig[];
  title?: string;
  description?: string;
  className?: string;
  onSubmit?: (e: React.FormEvent) => void;
  children?: ReactNode;
  submitText?: string;
}

const Form = ({ inputs, title, description, className, onSubmit, children, submitText = 'Submit' }: FormProps) => {
  const renderInput = (input: InputConfig, index: number) => {
    if (input.render) {
      return <div key={index}>{input.render()}</div>;
    }

    const { render, ...inputProps } = input;
    
    return (
      <Input
        key={index}
        {...inputProps}
      />
    );
  };

  return (
    <div className={cn('space-y-4', className)}>
      {title && (
        <div>
          <h3 className="text-lg font-semibold text-[var(--text)]">{title}</h3>
          {description && (
            <p className="text-sm text-[var(--text-secondary)] mt-1">{description}</p>
          )}
        </div>
      )}
      
      <form onSubmit={onSubmit} className="space-y-4">
        {inputs?.map((input, index) => renderInput(input, index))}
        
        <div className="flex justify-end gap-2 pt-2">
          {children}
          <button
            type="submit"
            className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {submitText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;