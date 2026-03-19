import { useState } from 'react';
import { Bet } from '../api/bets';
import { formatCOP } from '../utils/formatCOP';

interface BetCardProps {
  bet: Bet;
  onResolve?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

const sportIcons: Record<string, string> = {
  FOOTBALL: '⚽',
  TENNIS: '🎾',
  BASKETBALL: '🏀',
  OTHER: '🎯',
};

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-500',
  WON: 'bg-green-500',
  LOST: 'bg-red-500',
  VOID: 'bg-gray-500',
  CASHOUT: 'bg-blue-500',
};

const categoryColors: Record<string, string> = {
  A: 'bg-green-600',
  B: 'bg-yellow-600',
  C: 'bg-red-600',
};

export function BetCard({ bet, onResolve, onDelete, onEdit }: BetCardProps) {
  const [showResolve, setShowResolve] = useState(false);

  const statusLabel: Record<string, string> = {
    PENDING: 'Pendiente',
    WON: 'Ganada',
    LOST: 'Perdida',
    VOID: 'Anulada',
    CASHOUT: 'Cashout',
  };

  const handleResolve = () => {
    if (onResolve) {
      onResolve(bet.id);
    }
    setShowResolve(false);
  };

  return (
    <div className="bg-bg-card border border-border-dark rounded-lg p-4 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{sportIcons[bet.sport] || '🎯'}</span>
          <span className="text-sm text-gray-400">{bet.tournament}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-xs font-bold ${categoryColors[bet.category]}`}>
            {bet.category}
          </span>
          <span className={`px-2 py-0.5 rounded text-xs font-bold ${statusColors[bet.status]} text-white`}>
            {statusLabel[bet.status]}
          </span>
        </div>
      </div>

      {/* Teams */}
      <div className="mb-3">
        <div className="text-lg font-semibold text-white">
          {bet.homeTeam} <span className="text-gray-500">vs</span> {bet.awayTeam}
        </div>
      </div>

      {/* Bet Details */}
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <span className="text-gray-500">Tipo:</span>
          <span className="text-white ml-1">{bet.betType.replace(/_/g, ' ')}</span>
        </div>
        <div>
          <span className="text-gray-500">Selección:</span>
          <span className="text-gold ml-1 font-medium">{bet.selection}</span>
        </div>
        <div>
          <span className="text-gray-500">Cuota:</span>
          <span className="text-white ml-1 font-bold">{bet.odds}</span>
        </div>
        <div>
          <span className="text-gray-500">Monto:</span>
          <span className="text-white ml-1">{formatCOP(bet.amount)}</span>
        </div>
        <div>
          <span className="text-gray-500">Ganancia:</span>
          <span className="text-green-400 ml-1">{formatCOP(bet.potentialWin)}</span>
        </div>
        <div>
          <span className="text-gray-500">Confianza:</span>
          <span className="text-white ml-1">{'★'.repeat(bet.confidence)}{'☆'.repeat(5 - bet.confidence)}</span>
        </div>
      </div>

      {/* Profit (if resolved) */}
      {bet.status !== 'PENDING' && (
        <div className="border-t border-border-dark pt-3 mt-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Resultado:</span>
            <span className={`text-lg font-bold ${bet.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {bet.profit >= 0 ? '+' : ''}{formatCOP(bet.profit)}
            </span>
          </div>
        </div>
      )}

      {/* Reasoning */}
      {bet.reasoning && (
        <div className="mt-2 text-sm text-gray-400 italic">
          "{bet.reasoning}"
        </div>
      )}

      {/* Actions */}
      {bet.status === 'PENDING' && (
        <div className="flex gap-2 mt-4 pt-3 border-t border-border-dark">
          <button
            onClick={() => setShowResolve(!showResolve)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
          >
            Resolver
          </button>
          {onEdit && (
            <button
              onClick={() => onEdit(bet.id)}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
            >
              Editar
            </button>
          )}
          <button
            onClick={() => onDelete && onDelete(bet.id)}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
          >
            Eliminar
          </button>
        </div>
      )}

      {/* Resolve Modal */}
      {showResolve && (
        <div className="mt-3 p-3 bg-bg-secondary rounded-lg">
          <p className="text-sm text-gray-400 mb-2">Selecciona el resultado:</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleResolve}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-2 rounded text-sm"
            >
              ✓ Ganada
            </button>
            <button
              onClick={handleResolve}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-2 rounded text-sm"
            >
              ✗ Perdida
            </button>
            <button
              onClick={handleResolve}
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-2 rounded text-sm"
            >
              ↺ Anulada
            </button>
            <button
              onClick={handleResolve}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-2 rounded text-sm"
            >
              💰 Cashout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
