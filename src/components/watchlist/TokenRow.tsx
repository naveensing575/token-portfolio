import React, { memo, useState, useEffect, useRef, useMemo, useCallback } from "react";
import { MoreHorizontal } from "lucide-react";
import TokenImage from "./TokenImage";
import TokenActionMenu from "./TokenActionMenu";
import EditHoldingsForm from "./EditHoldingsForm";
import TableSparkline from "./TableSparkline";

interface Token {
  id: string;
  name: string;
  symbol: string;
  image: string;
  price: number;
  change24h: number;
  sparkline: number[];
  holdings: number;
}

interface TokenRowProps {
  token: Token;
  isEditing: boolean;
  editValue: string;
  openMenuId: string | null;
  onEditHoldings: (id: string, holdings: number) => void;
  onSaveEdit: (id: string) => void;
  onCancelEdit: () => void;
  onRemoveToken: (id: string) => void;
  onToggleMenu: (id: string) => void;
  onEditValueChange: (value: string) => void;
}

const TokenRow: React.FC<TokenRowProps> = memo(({
  token,
  isEditing,
  editValue,
  openMenuId,
  onEditHoldings,
  onSaveEdit,
  onCancelEdit,
  onRemoveToken,
  onToggleMenu,
  onEditValueChange,
}) => {
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [menuPosition, setMenuPosition] = useState<'bottom' | 'top'>('bottom');

  // Memoized calculations
  const tokenValue = useMemo(() => token.holdings * token.price, [token.holdings, token.price]);

  const formatPrice = useCallback((price: number): string => {
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }, []);

  const formattedPrice = useMemo(() => formatPrice(token.price), [token.price, formatPrice]);
  const formattedValue = useMemo(() =>
    `$${tokenValue.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`,
    [tokenValue]
  );
  const formattedChange = useMemo(() =>
    `${token.change24h >= 0 ? "+" : ""}${token.change24h.toFixed(2)}%`,
    [token.change24h]
  );

  // Menu position detection
  useEffect(() => {
    if (openMenuId === token.id && menuButtonRef.current) {
      const buttonRect = menuButtonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - buttonRect.bottom;

      setMenuPosition(spaceBelow < 120 ? 'top' : 'bottom');
    }
  }, [openMenuId, token.id]);

  // Memoized handlers
  const handleEditClick = useCallback(() => {
    onEditHoldings(token.id, token.holdings);
  }, [onEditHoldings, token.id, token.holdings]);

  const handleSaveClick = useCallback(() => {
    onSaveEdit(token.id);
  }, [onSaveEdit, token.id]);

  const handleRemoveClick = useCallback(() => {
    onRemoveToken(token.id);
  }, [onRemoveToken, token.id]);

  const handleMenuToggle = useCallback(() => {
    onToggleMenu(token.id);
  }, [onToggleMenu, token.id]);

  const isMenuOpen = openMenuId === token.id;
  const changeColorClass = token.change24h >= 0 ? "text-green-400" : "text-red-400";

  return (
    <tr className="border-b border-gray-700 hover:bg-gray-750 text-white">
      {/* Token Info */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <TokenImage
            src={token.image}
            alt={token.name}
            symbol={token.symbol}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <div className="font-medium text-white">{token.name}</div>
            <div className="text-gray-400 text-xs">{token.symbol.toUpperCase()}</div>
          </div>
        </div>
      </td>

      {/* Price */}
      <td className="px-4 py-3 text-white font-medium">
        {formattedPrice}
      </td>

      {/* 24h Change */}
      <td className={`px-4 py-3 font-semibold ${changeColorClass}`}>
        {formattedChange}
      </td>

      {/* Sparkline */}
      <td className="px-4 py-3 w-32">
        <TableSparkline data={token.sparkline} change24h={token.change24h} />
      </td>

      {/* Holdings */}
      <td className="px-4 py-3">
        {isEditing ? (
          <EditHoldingsForm
            value={editValue}
            onChange={onEditValueChange}
            onSave={handleSaveClick}
            onCancel={onCancelEdit}
          />
        ) : (
          <span className="text-white">{token.holdings}</span>
        )}
      </td>

      {/* Value */}
      <td className="px-4 py-3 font-medium text-white">
        {formattedValue}
      </td>

      {/* Actions */}
      <td className="px-4 py-3 relative">
        <button
          ref={menuButtonRef}
          onClick={handleMenuToggle}
          className="p-1 text-gray-400 hover:text-white rounded transition-colors"
        >
          <MoreHorizontal size={16} />
        </button>
        <TokenActionMenu
          isOpen={isMenuOpen}
          position={menuPosition}
          onEditHoldings={handleEditClick}
          onRemove={handleRemoveClick}
        />
      </td>
    </tr>
  );
});

TokenRow.displayName = 'TokenRow';

export default TokenRow;