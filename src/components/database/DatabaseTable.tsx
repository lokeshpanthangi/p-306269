
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, MoreHorizontal } from 'lucide-react';

interface DatabaseProperty {
  id: string;
  name: string;
  type: 'text' | 'number' | 'select' | 'multi-select' | 'date' | 'checkbox' | 'url' | 'email' | 'phone' | 'formula' | 'relation' | 'rollup' | 'created-time' | 'created-by' | 'last-edited-time' | 'last-edited-by';
  options?: string[];
}

interface DatabaseRow {
  id: string;
  properties: Record<string, any>;
}

interface DatabaseTableProps {
  properties: DatabaseProperty[];
  rows: DatabaseRow[];
  onAddRow: () => void;
  onUpdateRow: (rowId: string, propertyId: string, value: any) => void;
  onAddProperty: () => void;
}

const DatabaseTable: React.FC<DatabaseTableProps> = ({ 
  properties, 
  rows, 
  onAddRow, 
  onUpdateRow, 
  onAddProperty 
}) => {
  const [editingCell, setEditingCell] = useState<string | null>(null);

  const renderCell = (row: DatabaseRow, property: DatabaseProperty) => {
    const value = row.properties[property.id] || '';
    const cellKey = `${row.id}-${property.id}`;
    const isEditing = editingCell === cellKey;

    if (isEditing) {
      return (
        <Input
          value={value}
          onChange={(e) => onUpdateRow(row.id, property.id, e.target.value)}
          onBlur={() => setEditingCell(null)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setEditingCell(null);
            }
          }}
          autoFocus
          className="h-8 border-0 focus:ring-1 focus:ring-blue-500"
        />
      );
    }

    return (
      <div
        className="cursor-pointer hover:bg-gray-50 px-2 py-1 rounded min-h-[32px] flex items-center"
        onClick={() => setEditingCell(cellKey)}
      >
        {value || (
          <span className="text-gray-400 italic">Empty</span>
        )}
      </div>
    );
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {properties.map((property) => (
              <TableHead key={property.id} className="bg-gray-50">
                <div className="flex items-center gap-2">
                  <span>{property.name}</span>
                  <span className="text-xs text-gray-400 uppercase">
                    {property.type}
                  </span>
                </div>
              </TableHead>
            ))}
            <TableHead className="w-12 bg-gray-50">
              <Button
                variant="ghost"
                size="sm"
                onClick={onAddProperty}
                className="h-6 w-6 p-0"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              {properties.map((property) => (
                <TableCell key={property.id} className="p-0">
                  {renderCell(row, property)}
                </TableCell>
              ))}
              <TableCell className="w-12">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                >
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={properties.length + 1} className="p-2">
              <Button
                variant="ghost"
                onClick={onAddRow}
                className="w-full justify-start text-gray-500 hover:text-gray-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New row
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default DatabaseTable;
