import React from "react";
import { Edit, Trash2 } from "lucide-react";

interface TokenActionMenuProps {
  isOpen: boolean;
  position: 'top' | 'bottom';
  onEditHoldings: () => void;
  onRemove: () => void;
}

const TokenActionMenu: React.FC<TokenActionMenuProps> = ({
  isOpen,
  position,
  onEditHoldings,
  onRemove
}) => {
  if (!isOpen) return null;

  return (
    <div className={`absolute right-0 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-50 min-w-[140px] ${position === 'top' ? 'bottom-8' : 'top-8'
      }`}>
      <button
        onClick={onEditHoldings}
        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white hover:bg-gray-600 rounded-t-lg transition-colors"
      >
        <Edit size={14} />
        Edit Holdings
      </button>
      <button
        onClick={onRemove}
        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-gray-600 rounded-b-lg transition-colors"
      >
        <Trash2 size={14} />
        Remove
      </button>
    </div>
  );
};

export default TokenActionMenu;