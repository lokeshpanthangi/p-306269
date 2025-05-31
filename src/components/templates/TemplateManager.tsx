
import React, { useState } from 'react';
import { Plus, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BaseBlock } from '@/types/blocks';
import { templateService } from '@/services/templateService';

interface TemplateManagerProps {
  blocks: BaseBlock[];
  onSaveTemplate: (templateId: string) => void;
  onClose: () => void;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({ blocks, onSaveTemplate, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('personal');
  const [icon, setIcon] = useState('📄');
  const [isSaving, setIsSaving] = useState(false);

  const categories = [
    { id: 'personal', name: 'Personal', icon: '👤' },
    { id: 'productivity', name: 'Productivity', icon: '⚡' },
    { id: 'project-management', name: 'Project Management', icon: '📊' },
    { id: 'education', name: 'Education', icon: '📚' },
    { id: 'business', name: 'Business', icon: '💼' }
  ];

  const handleSave = async () => {
    if (!title.trim()) return;
    
    setIsSaving(true);
    try {
      const template = await templateService.savePageAsTemplate(
        title.trim(),
        description.trim(),
        category,
        blocks,
        icon
      );
      onSaveTemplate(template.id);
    } catch (error) {
      console.error('Failed to save template:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Save as Template</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter template title..."
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this template is for..."
              rows={3}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <div className="flex gap-2 flex-wrap">
              {['📄', '📝', '📊', '📋', '🎯', '💡', '⚡', '🔥', '✨', '🚀'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setIcon(emoji)}
                  className={`w-10 h-10 text-lg border rounded-lg hover:bg-gray-50 ${
                    icon === emoji ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
            This template will include {blocks.length} block{blocks.length !== 1 ? 's' : ''} from your current page.
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!title.trim() || isSaving}
            className="flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Template'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplateManager;
