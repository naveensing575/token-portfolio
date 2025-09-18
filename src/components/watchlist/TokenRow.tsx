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
  onToggleMenu: (id: string | null) => void;
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
    onToggleMenu(openMenuId === token.id ? null : token.id);
  }, [onToggleMenu, openMenuId, token.id]);

  const handleMenuClose = useCallback(() => {
    if (openMenuId === token.id) {
      onToggleMenu(null);
    }
  }, [onToggleMenu, openMenuId, token.id]);

  const isMenuOpen = openMenuId === token.id;
  const changeColorClass = token.change24h >= 0 ? "text-green-400" : "text-red-400";

  return (
    <tr className="hover:bg-[#27272A]">
      {/* Token Info */}
      <td className="px-6 py-3 w-64">
        <div className="flex items-center gap-3">
          <TokenImage
            src={token.image}
            alt={token.name}
            symbol={token.symbol}
            className="w-7 h-7 rounded-full flex-shrink-0"
          />
          <div className="min-w-0">
            <div className="text-sm font-medium text-white truncate">{token.name}</div>
            <div className="text-xs text-gray-400 truncate">{token.symbol.toUpperCase()}</div>
          </div>
        </div>
      </td>

      {/* Price */}
      <td className="px-6 py-3 text-sm text-white w-32">
        {formattedPrice}
      </td>

      {/* 24h Change */}
      <td className={`px-6 py-3 text-sm font-medium w-24 ${changeColorClass}`}>
        {formattedChange}
      </td>

      {/* Sparkline */}
      <td className="px-6 py-3 w-40">
        <TableSparkline data={token.sparkline} change24h={token.change24h} />
      </td>

      {/* Holdings */}
      <td className="px-6 py-3 w-28">
        {isEditing ? (
          <EditHoldingsForm
            value={editValue}
            onChange={onEditValueChange}
            onSave={handleSaveClick}
            onCancel={onCancelEdit}
          />
        ) : (
          <span className="text-sm text-white">{token.holdings}</span>
        )}
      </td>

      {/* Value */}
      <td className="px-6 py-3 text-sm text-white w-32">
        {formattedValue}
      </td>

      {/* Actions */}
      <td className="px-6 py-3 relative w-10">
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
          onClose={handleMenuClose}
        />
      </td>
    </tr>
  );
});

TokenRow.displayName = 'TokenRow';

export default TokenRow;