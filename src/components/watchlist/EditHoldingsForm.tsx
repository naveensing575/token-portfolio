import React from "react";

interface EditHoldingsFormProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditHoldingsForm: React.FC<EditHoldingsFormProps> = ({
  value,
  onChange,
  onSave,
  onCancel
}) => (
  <div className="flex items-center gap-2">
    <input
      type="number"
      min="0"
      step="0.01"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-20 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-center text-white focus:outline-none focus:border-[#A9E851]"
      autoFocus
    />
    <button
      onClick={onSave}
      className="text-[#A9E851] hover:text-[#98d147] text-xs px-2 py-1 font-medium min-w-[45px]"
    >
      Save
    </button>
    <button
      onClick={onCancel}
      className="text-gray-400 hover:text-gray-300 text-xs px-2 py-1 min-w-[45px]"
    >
      Cancel
    </button>
  </div>
);

export default EditHoldingsForm;