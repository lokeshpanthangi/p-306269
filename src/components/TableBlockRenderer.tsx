
import React, { useState } from 'react';
import { BaseBlock } from '@/types/blocks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Minus, MoreHorizontal } from 'lucide-react';

interface TableBlockRendererProps {
  block: BaseBlock;
  onUpdate: (content: any) => void;
  onFocus: () => void;
}

const TableBlockRenderer: React.FC<TableBlockRendererProps> = ({
  block,
  onUpdate,
  onFocus
}) => {
  const content = block.content || {
    headers: ['Column 1', 'Column 2'],
    rows: [['', '']],
    hasHeader: true
  };

  const addColumn = () => {
    const newHeaders = [...content.headers, `Column ${content.headers.length + 1}`];
    const newRows = content.rows.map((row: string[]) => [...row, '']);
    
    onUpdate({
      ...content,
      headers: newHeaders,
      rows: newRows
    });
  };

  const addRow = () => {
    const newRow = new Array(content.headers.length).fill('');
    onUpdate({
      ...content,
      rows: [...content.rows, newRow]
    });
  };

  const removeColumn = (columnIndex: number) => {
    if (content.headers.length <= 1) return;
    
    const newHeaders = content.headers.filter((_: string, i: number) => i !== columnIndex);
    const newRows = content.rows.map((row: string[]) => 
      row.filter((_: string, i: number) => i !== columnIndex)
    );
    
    onUpdate({
      ...content,
      headers: newHeaders,
      rows: newRows
    });
  };

  const removeRow = (rowIndex: number) => {
    if (content.rows.length <= 1) return;
    
    const newRows = content.rows.filter((_: string[], i: number) => i !== rowIndex);
    onUpdate({
      ...content,
      rows: newRows
    });
  };

  const updateHeader = (columnIndex: number, value: string) => {
    const newHeaders = [...content.headers];
    newHeaders[columnIndex] = value;
    onUpdate({
      ...content,
      headers: newHeaders
    });
  };

  const updateCell = (rowIndex: number, columnIndex: number, value: string) => {
    const newRows = [...content.rows];
    newRows[rowIndex] = [...newRows[rowIndex]];
    newRows[rowIndex][columnIndex] = value;
    onUpdate({
      ...content,
      rows: newRows
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200">
        {content.hasHeader && (
          <thead>
            <tr>
              {content.headers.map((header: string, columnIndex: number) => (
                <th
                  key={columnIndex}
                  className="border border-gray-200 bg-gray-50 p-2 text-left group relative"
                >
                  <Input
                    value={header}
                    onChange={(e) => updateHeader(columnIndex, e.target.value)}
                    onFocus={onFocus}
                    className="border-none p-0 bg-transparent font-medium"
                  />
                  <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-6 h-6 p-0 bg-white border"
                      onClick={() => removeColumn(columnIndex)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                  </div>
                </th>
              ))}
              <th className="w-8 border border-gray-200 bg-gray-50">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-6 h-6 p-0"
                  onClick={addColumn}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </th>
            </tr>
          </thead>
        )}
        <tbody>
          {content.rows.map((row: string[], rowIndex: number) => (
            <tr key={rowIndex} className="group">
              {row.map((cell: string, columnIndex: number) => (
                <td key={columnIndex} className="border border-gray-200 p-2">
                  <Input
                    value={cell}
                    onChange={(e) => updateCell(rowIndex, columnIndex, e.target.value)}
                    onFocus={onFocus}
                    className="border-none p-0 bg-transparent"
                    placeholder="Type something..."
                  />
                </td>
              ))}
              <td className="w-8 border border-gray-200 text-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-6 h-6 p-0"
                    onClick={() => removeRow(rowIndex)}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={content.headers.length} className="border border-gray-200 p-2 text-center">
              <Button
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0"
                onClick={addRow}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </td>
            <td className="w-8 border border-gray-200"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TableBlockRenderer;
