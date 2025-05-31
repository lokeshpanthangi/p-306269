
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, MoreHorizontal, Filter, SortAsc } from 'lucide-react';
import { DatabaseProperty, DatabaseRow } from '@/hooks/useDatabase';

interface DatabaseTableProps {
  properties: DatabaseProperty[];
  rows: DatabaseRow[];
  onAddRow: () => void;
  onUpdateRow: (id: string, properties: Record<string, any>) => void;
  onDeleteRow: (id: string) => void;
  onAddProperty: () => void;
}

const DatabaseTable = ({ 
  properties, 
  rows, 
  onAddRow, 
  onUpdateRow, 
  onDeleteRow,
  onAddProperty 
}: DatabaseTableProps) => {
  const [editingCell, setEditingCell] = useState<{ rowId: string; propertyId: string } | null>(null);

  const handleCellEdit = (rowId: string, propertyId: string, value: any) => {
    const row = rows.find(r => r.id === rowId);
    if (row) {
      const updatedProperties = {
        ...row.properties,
        [propertyId]: value
      };
      onUpdateRow(rowId, updatedProperties);
    }
    setEditingCell(null);
  };

  const renderCell = (row: DatabaseRow, property: DatabaseProperty) => {
    const value = row.properties?.[property.id] || '';
    const isEditing = editingCell?.rowId === row.id && editingCell?.propertyId === property.id;

    if (isEditing) {
      return (
        <CellEditor
          property={property}
          value={value}
          onSave={(newValue) => handleCellEdit(row.id, property.id, newValue)}
          onCancel={() => setEditingCell(null)}
        />
      );
    }

    return (
      <div 
        className="min-h-[32px] p-1 cursor-pointer hover:bg-gray-50 rounded"
        onClick={() => setEditingCell({ rowId: row.id, propertyId: property.id })}
      >
        <CellDisplay property={property} value={value} />
      </div>
    );
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="border-b p-2 flex items-center gap-2 bg-gray-50">
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-1" />
          Filter
        </Button>
        <Button variant="outline" size="sm">
          <SortAsc className="w-4 h-4 mr-1" />
          Sort
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            {properties.map((property) => (
              <TableHead key={property.id} className="relative group">
                <div className="flex items-center gap-2">
                  <PropertyIcon type={property.type} />
                  <span>{property.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                  >
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </div>
              </TableHead>
            ))}
            <TableHead className="w-12">
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
            <TableRow key={row.id} className="group">
              {properties.map((property) => (
                <TableCell key={property.id} className="p-0">
                  {renderCell(row, property)}
                </TableCell>
              ))}
              <TableCell className="w-12">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteRow(row.id)}
                  className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
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
                className="w-full justify-start text-gray-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                New
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

const PropertyIcon = ({ type }: { type: string }) => {
  const icons = {
    title: '📝',
    text: '📄',
    number: '🔢',
    select: '🏷️',
    'multi-select': '🏷️',
    date: '📅',
    checkbox: '☑️',
    url: '🔗',
    email: '📧',
    relation: '🔗',
    formula: '🧮'
  };

  return <span className="text-sm">{icons[type as keyof typeof icons] || '📄'}</span>;
};

const CellDisplay = ({ property, value }: { property: DatabaseProperty; value: any }) => {
  switch (property.type) {
    case 'checkbox':
      return <Checkbox checked={!!value} disabled />;
    case 'select':
      return value ? <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">{value}</span> : null;
    case 'date':
      return value ? new Date(value).toLocaleDateString() : null;
    default:
      return <span className="text-sm">{value || ''}</span>;
  }
};

const CellEditor = ({ 
  property, 
  value, 
  onSave, 
  onCancel 
}: { 
  property: DatabaseProperty; 
  value: any; 
  onSave: (value: any) => void; 
  onCancel: () => void; 
}) => {
  const [editValue, setEditValue] = useState(value);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSave(editValue);
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  switch (property.type) {
    case 'checkbox':
      return (
        <Checkbox
          checked={!!editValue}
          onCheckedChange={(checked) => onSave(checked)}
          autoFocus
        />
      );
    case 'select':
      const options = property.options as { options?: string[] } | undefined;
      return (
        <Select value={editValue} onValueChange={onSave}>
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options?.options?.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case 'number':
      return (
        <Input
          type="number"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => onSave(editValue)}
          onKeyDown={handleKeyDown}
          className="h-8"
          autoFocus
        />
      );
    case 'date':
      return (
        <Input
          type="date"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => onSave(editValue)}
          onKeyDown={handleKeyDown}
          className="h-8"
          autoFocus
        />
      );
    default:
      return (
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => onSave(editValue)}
          onKeyDown={handleKeyDown}
          className="h-8"
          autoFocus
        />
      );
  }
};

export default DatabaseTable;
