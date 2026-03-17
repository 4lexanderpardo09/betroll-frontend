import { useEffect, useState } from 'react'
import { TrendingUp, Wallet, Target, Dice6, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getDashboardSummary, DashboardSummary } from '../api/analytics'

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardSummary()
      .then(res => {
        setSummary(res.data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WON':
        return 'text-win'
      case 'LOST':
        return 'text-loss'
      case 'VOID':
        return 'text-gray-400'
      case 'PENDING':
        return 'text-pending'
      default:
        return 'text-gray-400'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-gold">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <main className="max-w-6xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

        {summary?.stopLoss.hit && (
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertTriangle className="text-red-500" size={24} />
            <div>
              <p className="font-bold text-red-400">Stop-Loss Activado</p>
              <p className="text-sm text-gray-400">
                Has perdido el 30% de tu bankroll del día.{(summary.stopLoss.dailyLoss / summary.stopLoss.openingBalance * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link to="/bankroll" className="bg-bg-card p-6 rounded-lg border border-border-dark hover:border-gold transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="text-gold" size={24} />
              <span className="text-gray-400">Bankroll</span>
            </div>
            {summary?.bankroll ? (
              <>
                <p className="text-2xl font-bold">{formatCurrency(summary.bankroll.currentAmount)}</p>
                <p className="text-sm text-gray-500">Inicial: {formatCurrency(summary.bankroll.initialAmount)}</p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold">$0</p>
                <p className="text-sm text-gray-500">Sin bankroll configurado</p>
              </>
            )}
          </Link>

          <Link to="/bets" className="bg-bg-card p-6 rounded-lg border border-border-dark hover:border-gold transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <Dice6 className="text-blue-400" size={24} />
              <span className="text-gray-400">Apuestas</span>
            </div>
            <p className="text-2xl font-bold">{summary?.stats.totalBets || 0}</p>
            <p className="text-sm text-gray-500">{summary?.stats.pendingBets || 0} pendientes</p>
          </Link>

          <div className="bg-bg-card p-6 rounded-lg border border-border-dark">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className={summary?.stats.roi && summary.stats.roi >= 0 ? 'text-win' : 'text-loss'} size={24} />
              <span className="text-gray-400">ROI</span>
            </div>
            <p className={`text-2xl font-bold ${summary?.stats.roi && summary.stats.roi >= 0 ? 'text-win' : 'text-loss'}`}>
              {summary?.stats.roi?.toFixed(1) || 0}%
            </p>
            <p className="text-sm text-gray-500">Ganancia: {formatCurrency(summary?.stats.totalProfit || 0)}</p>
          </div>

          <div className="bg-bg-card p-6 rounded-lg border border-border-dark">
            <div className="flex items-center gap-3 mb-2">
              <Target className="text-info" size={24} />
              <span className="text-gray-400">Racha</span>
            </div>
            <p className="text-2xl font-bold">{summary?.streak.current || 0}</p>
            <p className={`text-sm ${summary?.streak.type === 'WIN' ? 'text-win' : summary?.streak.type === 'LOSS' ? 'text-loss' : 'text-gray-500'}`}>
              {summary?.streak.type === 'WIN' ? 'Victorias' : summary?.streak.type === 'LOSS' ? 'Derrotas' : 'Sin datos'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-bg-card p-6 rounded-lg border border-border-dark">
            <h3 className="text-lg font-bold mb-4">Estadísticas</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Total apostado</span>
                <span className="font-medium">{formatCurrency(summary?.stats.totalStaked || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ganadas</span>
                <span className="font-medium text-win">{summary?.stats.wonBets || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Perdidas</span>
                <span className="font-medium text-loss">{summary?.stats.lostBets || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Void</span>
                <span className="font-medium text-gray-400">{summary?.stats.voidBets || 0}</span>
              </div>
              <div className="flex justify-between border-t border-border-dark pt-3">
                <span className="text-gray-400">Win Rate</span>
                <span className="font-medium">{summary?.stats.winRate?.toFixed(1) || 0}%</span>
              </div>
            </div>
          </div>

          <div className="bg-bg-card p-6 rounded-lg border border-border-dark">
            <h3 className="text-lg font-bold mb-4">Estado Stop-Loss</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Balance apertura</span>
                <span className="font-medium">{formatCurrency(summary?.stopLoss.openingBalance || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Balance actual</span>
                <span className="font-medium">{formatCurrency(summary?.stopLoss.currentBalance || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Pérdida diaria</span>
                <span className={`font-medium ${summary?.stopLoss.dailyLoss && summary.stopLoss.dailyLoss < 0 ? 'text-loss' : 'text-win'}`}>
                  {formatCurrency(summary?.stopLoss.dailyLoss || 0)}
                </span>
              </div>
              <div className="flex justify-between border-t border-border-dark pt-3">
                <span className="text-gray-400">Status</span>
                <span className={`font-medium ${summary?.stopLoss.hit ? 'text-loss' : 'text-win'}`}>
                  {summary?.stopLoss.hit ? 'ACTIVADO' : 'OK'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-bg-card p-6 rounded-lg border border-border-dark">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Últimas Apuestas</h3>
            <Link to="/bets" className="text-gold text-sm hover:underline">
              Ver todas
            </Link>
          </div>
          
          {summary?.recentBets && summary.recentBets.length > 0 ? (
            <div className="space-y-3">
              {summary.recentBets.map((bet) => (
                <div key={bet.id} className="flex justify-between items-center p-3 bg-bg-secondary rounded-lg">
                  <div>
                    <p className="font-medium">{bet.selection}</p>
                    <p className="text-sm text-gray-400">
                      {bet.sport} • {bet.odds} • {formatCurrency(bet.amount)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${getStatusColor(bet.status)}`}>
                      {bet.status === 'WON' ? 'GANADA' : bet.status === 'LOST' ? 'PERDIDA' : bet.status === 'VOID' ? 'VOID' : 'PENDIENTE'}
                    </p>
                    {bet.profit !== 0 && (
                      <p className={`text-sm ${bet.profit > 0 ? 'text-win' : 'text-loss'}`}>
                        {bet.profit > 0 ? '+' : ''}{formatCurrency(bet.profit)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">
              No hay apuestas aún.{' '}
              <Link to="/bets/create" className="text-gold hover:underline">
                Crear tu primera apuesta
              </Link>
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
