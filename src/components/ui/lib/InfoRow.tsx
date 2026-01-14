import React from 'react';

interface InfoRowProps {
  label: string;
  value: string | React.ReactNode;
  className?: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, className = '' }) => (
  <div className={className}>
    <div className="text-gray-500 dark:text-gray-400 mb-1 text-xs">{label}</div>
    <div className="font-medium text-gray-900 dark:text-gray-200 text-xs">{value}</div>
  </div>
);

export default InfoRow;
