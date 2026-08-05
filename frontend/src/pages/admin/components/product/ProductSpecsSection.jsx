import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

/* ==========================================================================
   COLOR_MAP — maps common color names (case-insensitive) to real hex values.
   Unknown colors default to #808080 (neutral grey).
   ========================================================================== */
const COLOR_MAP = {
  black: '#000000',
  'midnight black': '#000000',
  'black titanium': '#2B2B2B',
  white: '#FFFFFF',
  'white titanium': '#F5F5F5',
  silver: '#C0C0C0',
  grey: '#808080',
  gray: '#808080',
  'space gray': '#717378',
  'space grey': '#717378',
  gold: '#C5A028',
  'rose gold': '#B76E79',
  'starlight': '#F2E6C9',
  blue: '#3B5BDB',
  'blue titanium': '#4A6FA5',
  'sierra blue': '#9EC0D0',
  'alpine green': '#7AAB8B',
  green: '#2F9E44',
  red: '#E03131',
  'product red': '#CC0000',
  pink: '#F783AC',
  'deep purple': '#6741D9',
  purple: '#862E9C',
  yellow: '#FAB005',
  orange: '#F76707',
  midnight: '#1A1A2E',
  titanium: '#878681',
  'natural titanium': '#D6CEC1',
  'desert titanium': '#C2996B',
  'graphite': '#4B4B4B',
  'pacific blue': '#4A9EB5',
  teal: '#0CA678',
  lavender: '#C2A4E8',
  'cream': '#FFFDD0',
  'coral': '#FF6B6B',
  'mint': '#69DB7C',
};

const colorNameToHex = (name) => {
  if (!name) return '#808080';
  return COLOR_MAP[name.toLowerCase().trim()] || '#808080';
};

/* ==========================================================================
   TagInput — generic reusable pill-based multi-value input for strings
   ========================================================================== */
const TagInput = ({ label, placeholder, values = [], onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (values.includes(trimmed)) {
      setInputValue('');
      return;
    }
    onChange([...values, trimmed]);
    setInputValue('');
  };

  const removeTag = (index) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
    if (e.key === 'Backspace' && inputValue === '' && values.length > 0) {
      removeTag(values.length - 1);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {values.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-lg"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(idx)}
                className="text-amber-500 hover:text-amber-800 transition-colors cursor-pointer"
                aria-label={`Remove ${tag}`}
              >
                <X size={12} strokeWidth={3} />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm placeholder:text-gray-400 text-sm"
        />
        <button
          type="button"
          onClick={addTag}
          className="flex items-center gap-1 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={14} />
          Add
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-1.5">Press Enter or comma to add. Click × to remove.</p>
    </div>
  );
};

/* ==========================================================================
   ColorTagInput — pill input that internally stores { name, hexValue } objects.
   The admin types plain color names; conversion to the object shape happens
   transparently so colorOptions remains the single source of truth.
   ========================================================================== */
const ColorTagInput = ({ label, colorOptions = [], onChange }) => {
  const [inputValue, setInputValue] = useState('');

  // Display-only names for the tag pills
  const colorNames = colorOptions.map((c) => c.name);

  const addColor = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    // Prevent duplicates (case-insensitive)
    if (colorNames.some((n) => n.toLowerCase() === trimmed.toLowerCase())) {
      setInputValue('');
      return;
    }
    const newObj = { name: trimmed, hexValue: colorNameToHex(trimmed) };
    onChange([...colorOptions, newObj]);
    setInputValue('');
  };

  const removeColor = (index) => {
    onChange(colorOptions.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addColor();
    }
    if (e.key === 'Backspace' && inputValue === '' && colorOptions.length > 0) {
      removeColor(colorOptions.length - 1);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {colorOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {colorOptions.map((colorObj, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-lg"
            >
              {/* Colored swatch dot */}
              <span
                className="w-3 h-3 rounded-full border border-gray-300 shrink-0"
                style={{ backgroundColor: colorObj.hexValue || '#808080' }}
              />
              {colorObj.name}
              <button
                type="button"
                onClick={() => removeColor(idx)}
                className="text-amber-500 hover:text-amber-800 transition-colors cursor-pointer"
                aria-label={`Remove ${colorObj.name}`}
              >
                <X size={12} strokeWidth={3} />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Black, Midnight, Titanium..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm placeholder:text-gray-400 text-sm"
        />
        <button
          type="button"
          onClick={addColor}
          className="flex items-center gap-1 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={14} />
          Add
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-1.5">
        Common colors are auto-mapped to hex. Press Enter or comma to add.
      </p>
    </div>
  );
};

/* ==========================================================================
   ProductSpecsSection — surfaces storageOptions, colorOptions, and ram
   in the admin Add / Edit Product form.
   Single source of truth: colorOptions and storageOptions (canonical).
   ========================================================================== */
const ProductSpecsSection = ({ data, updateField }) => {
  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-lg font-semibold text-gray-900">Product Specifications</h2>
        <p className="text-sm text-gray-500 mt-1">Optional. All fields can be left empty.</p>
      </div>
      <div className="p-6 space-y-6">
        <ColorTagInput
          label="Colors"
          colorOptions={data.colorOptions || []}
          onChange={(val) => updateField('colorOptions', val)}
        />
        <TagInput
          label="Storage Options"
          placeholder="e.g. 128GB, 256GB, 512GB..."
          values={data.storageOptions || []}
          onChange={(val) => updateField('storageOptions', val)}
        />
        <TagInput
          label="RAM Options"
          placeholder="e.g. 6GB, 8GB, 12GB..."
          values={data.ram || []}
          onChange={(val) => updateField('ram', val)}
        />
      </div>
    </div>
  );
};

export default ProductSpecsSection;
