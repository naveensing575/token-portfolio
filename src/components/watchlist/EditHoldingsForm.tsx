import React, { useRef, useEffect } from "react";

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
}) => {
  const formRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the form
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        onCancel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onCancel]);

  // Handle Enter key to save
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSave();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div ref={formRef} className="flex items-center gap-2">
      <input
        type="number"
        min="0"
        step="0.01"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-20 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-center text-white focus:outline-none focus:border-[#A9E851]"
        autoFocus
      />
      <button
        onClick={onSave}
        className="bg-[#A9E851] hover:bg-[#98d147] text-black text-xs px-3 py-1 font-medium min-w-[45px] rounded border border-[#8bc840]"
      >
        Save
      </button>
    </div>
  );
};

export default EditHoldingsForm;