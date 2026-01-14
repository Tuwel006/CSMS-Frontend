import React from 'react';
import { Box } from './Box';
import { useTheme } from '../../../context/ThemeContext';

interface Column {
  key: string;
  label: string;
  headerRender: () => React.ReactNode;
  cellRender: (row: any) => React.ReactNode;
  cellClassName?: string;
  headerClassName?: string;
}

interface TableProps {
  columns: Column[];
  data: any[];
}

const Table: React.FC<TableProps> = ({ columns, data }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Box className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className={`${isDark ? "bg-gray-750 text-gray-300" : "bg-gray-50 text-gray-600"} border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
            {columns.map((col) => (
              <th key={col.key} className={`px-2 sm:px-4 py-1.5 sm:py-2 font-semibold ${col.cellClassName?.includes('text-center') ? 'text-center' : 'text-left'} ${col.headerClassName || ''}`}>
                {col.headerRender()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className={`border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
              {columns.map((col) => (
                <td key={col.key} className={col.cellClassName || ''}>
                  {col.cellRender(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};

export default Table;
