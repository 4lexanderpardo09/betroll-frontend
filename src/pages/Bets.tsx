import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBetStore } from '../store/betStore';
import { useBankrollStore } from '../store/bankrollStore';
import { BetCard } from '../components/BetCard';
import { formatCOP } from '../utils/formatCOP';
import { BetStatus } from '../api/bets';

export function Bets() {
  const {
    bets,
    stats,
    pagination,
    filters,
    loading,
    error,
    fetchBets,
    fetchStats,
    resolveBet,
    removeBet,
    setFilters,
    clearError,
  } = useBetStore();
  const { fetchBankroll, bankroll } = useBankrollStore();

  const [selectedBet, setSelectedBet] = useState<string | null>(null);
  const [resolveStatus, setResolveStatus] = useState<BetStatus>('WON');

  useEffect(() => {
    fetchBets();
    fetchStats();
    fetchBankroll();
  }, [fetchBets, fetchStats, fetchBankroll]);

  const handlePageChange = (newPage: number) => {
    fetchBets(newPage);
  };

  const handleResolve = (betId: string) => {
    setSelectedBet(betId);
    setResolveStatus('WON');
  };

  const handleConfirmResolve = async () => {
    if (selectedBet) {
      await resolveBet(selectedBet, { status: resolveStatus });
      setSelectedBet(null);
      fetchBankroll(); // Refresh bankroll
    }
  };

  const handleDelete = async (betId: string) => {
    if (confirm('¿Estás seguro de eliminar esta apuesta? Se reembolsará el monto.')) {
      await removeBet(betId);
      fetchBankroll();
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
  };

  const sportOptions: { value: string; label: string }[] = [
    { value: '', label: 'Todos' },
    { value: 'FOOTBALL', label: 'Fútbol' },
    { value: 'TENNIS', label: 'Tenis' },
    { value: 'BASKETBALL', label: 'Baloncesto' },
    { value: 'OTHER', label: 'Otro' },
  ];

  const statusOptions: { value: string; label: string }[] = [
    { value: '', label: 'Todos' },
    { value: 'PENDING', label: 'Pendiente' },
    { value: 'WON', label: 'Ganada' },
    { value: 'LOST', label: 'Perdida' },
    { value: 'VOID', label: 'Anulada' },
    { value: 'CASHOUT', label: 'Cashout' },
  ];

  const categoryOptions: { value: string; label: string }[] = [
    { value: '', label: 'Todos' },
    { value: 'A', label: 'A (≤1.50)' },
    { value: 'B', label: 'B (≤2.20)' },
    { value: 'C', label: 'C (>2.20)' },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Mis Apuestas</h1>
          {bankroll && (
            <p className="text-gray-400">
              Bankroll: <span className="text-gold font-bold">{formatCOP(bankroll.currentAmount)}</span>
            </p>
          )}
        </div>
        <Link
          to="/bets/create"
          className="bg-gold hover:bg-yellow-500 text-black py-2 px-4 rounded-lg font-bold transition-colors"
        >
          + Nueva Apuesta
        </Link>
      </div>

      {/* Stats Summary */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-bg-card border border-border-dark rounded-lg p-3">
            <div className="text-gray-500 text-xs">Total</div>
            <div className="text-xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="bg-bg-card border border-border-dark rounded-lg p-3">
            <div className="text-gray-500 text-xs">Ganadas</div>
            <div className="text-xl font-bold text-green-400">{stats.won}</div>
          </div>
          <div className="bg-bg-card border border-border-dark rounded-lg p-3">
            <div className="text-gray-500 text-xs">Perdidas</div>
            <div className="text-xl font-bold text-red-400">{stats.lost}</div>
          </div>
          <div className="bg-bg-card border border-border-dark rounded-lg p-3">
            <div className="text-gray-500 text-xs">Pendientes</div>
            <div className="text-xl font-bold text-yellow-400">{stats.pending}</div>
          </div>
          <div className="bg-bg-card border border-border-dark rounded-lg p-3">
            <div className="text-gray-500 text-xs">Win Rate</div>
            <div className="text-xl font-bold text-blue-400">{stats.winRate}%</div>
          </div>
          <div className="bg-bg-card border border-border-dark rounded-lg p-3">
            <div className="text-gray-500 text-xs">Total Apostado</div>
            <div className="text-xl font-bold text-white">{formatCOP(stats.totalStaked)}</div>
          </div>
          <div className="bg-bg-card border border-border-dark rounded-lg p-3 col-span-2">
            <div className="text-gray-500 text-xs">Beneficio Total</div>
            <div className={`text-xl font-bold ${stats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.totalProfit >= 0 ? '+' : ''}{formatCOP(stats.totalProfit)}
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-900/50 border border-red-600 text-red-200 px-4 py-3 rounded-lg mb-4">
          {error}
          <button onClick={clearError} className="ml-2 text-red-400 hover:text-red-200">
            ✕
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-bg-card border border-border-dark rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <select
            value={filters.sport || ''}
            onChange={(e) => handleFilterChange('sport', e.target.value)}
            className="bg-bg-secondary border border-border-dark rounded-lg px-3 py-2 text-white text-sm"
          >
            {sportOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="bg-bg-secondary border border-border-dark rounded-lg px-3 py-2 text-white text-sm"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            value={filters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="bg-bg-secondary border border-border-dark rounded-lg px-3 py-2 text-white text-sm"
          >
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <input
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            className="bg-bg-secondary border border-border-dark rounded-lg px-3 py-2 text-white text-sm"
            placeholder="Desde"
          />
          <input
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            className="bg-bg-secondary border border-border-dark rounded-lg px-3 py-2 text-white text-sm"
            placeholder="Hasta"
          />
          <button
            onClick={clearFilters}
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && bets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🎲</div>
          <h3 className="text-xl font-semibold text-white mb-2">No hay apuestas</h3>
          <p className="text-gray-400 mb-4">Crea tu primera apuesta para empezar</p>
          <Link
            to="/bets/create"
            className="bg-gold hover:bg-yellow-500 text-black py-2 px-4 rounded-lg font-bold"
          >
            Crear Apuesta
          </Link>
        </div>
      )}

      {/* Bet Cards Grid */}
      {!loading && bets.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bets.map((bet) => (
              <BetCard
                key={bet.id}
                bet={bet}
                onResolve={handleResolve}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.total > pagination.limit && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="bg-bg-card border border-border-dark text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-gray-400">
                Página {pagination.page} de {Math.ceil(pagination.total / pagination.limit)}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                className="bg-bg-card border border-border-dark text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}

      {/* Resolve Modal */}
      {selectedBet && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-bg-card border border-border-dark rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Resolver Apuesta</h3>
            <p className="text-gray-400 mb-4">Selecciona el resultado de la apuesta:</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => setResolveStatus('WON')}
                className={`py-3 px-4 rounded-lg font-bold ${
                  resolveStatus === 'WON'
                    ? 'bg-green-600 text-white'
                    : 'bg-bg-secondary text-gray-400 border border-border-dark'
                }`}
              >
                ✓ Ganada
              </button>
              <button
                onClick={() => setResolveStatus('LOST')}
                className={`py-3 px-4 rounded-lg font-bold ${
                  resolveStatus === 'LOST'
                    ? 'bg-red-600 text-white'
                    : 'bg-bg-secondary text-gray-400 border border-border-dark'
                }`}
              >
                ✗ Perdida
              </button>
              <button
                onClick={() => setResolveStatus('VOID')}
                className={`py-3 px-4 rounded-lg font-bold ${
                  resolveStatus === 'VOID'
                    ? 'bg-gray-600 text-white'
                    : 'bg-bg-secondary text-gray-400 border border-border-dark'
                }`}
              >
                ↺ Anulada
              </button>
              <button
                onClick={() => setResolveStatus('CASHOUT')}
                className={`py-3 px-4 rounded-lg font-bold ${
                  resolveStatus === 'CASHOUT'
                    ? 'bg-blue-600 text-white'
                    : 'bg-bg-secondary text-gray-400 border border-border-dark'
                }`}
              >
                💰 Cashout
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedBet(null)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmResolve}
                className="flex-1 bg-gold hover:bg-yellow-500 text-black py-3 rounded-lg font-bold"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
