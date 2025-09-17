import { useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../store/store";
import {
  updateHoldings,
  removeToken,
  selectWatchlistTokens,
  selectLoading,
} from "../features/watchlist/watchlistSlice";

const ITEMS_PER_PAGE = 10;

export const useWatchlistTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tokens = useSelector(selectWatchlistTokens);
  const loading = useSelector(selectLoading);

  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  // Memoized calculations
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(tokens.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return { totalPages, startIndex, endIndex };
  }, [tokens.length, currentPage]);

  const currentTokens = useMemo(() => {
    const { startIndex, endIndex } = paginationData;
    return tokens.slice(startIndex, endIndex);
  }, [tokens, paginationData]);

  const closeAllModals = useCallback(() => {
    setOpenMenuId(null);
    setEditingId(null);
    setEditValue("");
  }, []);

  const handleEditHoldings = useCallback((id: string, currentHoldings: number) => {
    setEditingId(id);
    setEditValue(currentHoldings.toString());
    setOpenMenuId(null);
  }, []);

  const handleSaveEdit = useCallback((id: string) => {
    const num = parseFloat(editValue) || 0;
    dispatch(updateHoldings({ id, holdings: num }));
    closeAllModals();
  }, [editValue, dispatch, closeAllModals]);

  const handleRemoveToken = useCallback((id: string) => {
    dispatch(removeToken(id));
    setOpenMenuId(null);
  }, [dispatch]);

  const toggleMenu = useCallback((id: string) => {
    setOpenMenuId(prev => prev === id ? null : id);
  }, []);

  const handlePrevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, paginationData.totalPages));
  }, [paginationData.totalPages]);

  const handleEditValueChange = useCallback((value: string) => {
    setEditValue(value);
  }, []);

  return {
    // State
    tokens,
    loading,
    currentTokens,
    currentPage,
    openMenuId,
    editingId,
    editValue,

    // Computed
    paginationData,

    // Handlers
    closeAllModals,
    handleEditHoldings,
    handleSaveEdit,
    handleCancelEdit: closeAllModals,
    handleRemoveToken,
    toggleMenu,
    handlePrevPage,
    handleNextPage,
    handleEditValueChange,
  };
};