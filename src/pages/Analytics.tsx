import { useEffect, useState } from 'react'
import { Calendar } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getPnl, getBySport, getByCategory, getBankrollHistory, getDashboardSummary, PnlData, BySportData, ByCategoryData, BankrollHistoryData, DashboardSummary } from '../api/analytics'

export default function Analytics() {
  const [period, setPeriod] = useState<'daily' | 'weekly'>('daily')
  const [pnlData, setPnlData] = useState<PnlData[]>([])
  const [sportData, setSportData] = useState<BySportData[]>([])
  const [categoryData, setCategoryData] = useState<ByCategoryData[]>([])
  const [historyData, setHistoryData] = useState<BankrollHistoryData[]>([])
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getPnl(period),
      getBySport(),
      getByCategory(),
      getBankrollHistory(),
      getDashboardSummary(),
    ])
      .then(([pnl, sport, category, history, sum]) => {
        setPnlData(pnl.data)
        setSportData(sport.data)
        setCategoryData(category.data)
        setHistoryData(history.data)
        setSummary(sum.data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [period])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getSportColor = (sport: string) => {
    const colors: Record<string, string> = {
      FOOTBALL: '#4ade80',
      TENNIS: '#60a5fa',
      BASKETBALL: '#f472b6',
      OTHER: '#a78bfa',
    }
    return colors[sport] || '#9ca3af'
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      A: '#4ade80',
      B: '#fbbf24',
      C: '#f87171',
    }
    return colors[category] || '#9ca3af'
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Analytics</h2>
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-gray-400" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as 'daily' | 'weekly')}
              className="bg-bg-card border border-border-dark rounded-lg px-3 py-2 text-white"
            >
              <option value="daily">Diario</option>
              <option value="weekly">Semanal</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-bg-card p-4 rounded-lg border border-border-dark">
            <p className="text-gray-400 text-sm">Profit Total</p>
            <p className={`text-2xl font-bold ${(summary?.stats.totalProfit || 0) >= 0 ? 'text-win' : 'text-loss'}`}>
              {formatCurrency(summary?.stats.totalProfit || 0)}
            </p>
          </div>
          <div className="bg-bg-card p-4 rounded-lg border border-border-dark">
            <p className="text-gray-400 text-sm">ROI</p>
            <p className={`text-2xl font-bold ${(summary?.stats.roi || 0) >= 0 ? 'text-win' : 'text-loss'}`}>
              {(summary?.stats.roi || 0).toFixed(1)}%
            </p>
          </div>
          <div className="bg-bg-card p-4 rounded-lg border border-border-dark">
            <p className="text-gray-400 text-sm">Win Rate</p>
            <p className="text-2xl font-bold text-info">{(summary?.stats.winRate || 0).toFixed(1)}%</p>
          </div>
          <div className="bg-bg-card p-4 rounded-lg border border-border-dark">
            <p className="text-gray-400 text-sm">Total Apostado</p>
            <p className="text-2xl font-bold">{formatCurrency(summary?.stats.totalStaked || 0)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-bg-card p-6 rounded-lg border border-border-dark">
            <h3 className="text-lg font-bold mb-4">Profit & Loss</h3>
            {pnlData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={pnlData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    formatter={(value: number) => [formatCurrency(value), 'Profit']}
                  />
                  <Line type="monotone" dataKey="profit" stroke="#fbbf24" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-center py-8">No hay datos de P&L</p>
            )}
          </div>

          <div className="bg-bg-card p-6 rounded-lg border border-border-dark">
            <h3 className="text-lg font-bold mb-4">Evolución del Bankroll</h3>
            {historyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    formatter={(value: number) => [formatCurrency(value), '']}
                  />
                  <Line type="monotone" dataKey="closing" stroke="#fbbf24" strokeWidth={2} dot={false} name="Balance" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-center py-8">No hay historial de bankroll</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-bg-card p-6 rounded-lg border border-border-dark">
            <h3 className="text-lg font-bold mb-4">Por Deporte</h3>
            {sportData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={sportData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="sport" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    formatter={(value: number) => [formatCurrency(value), 'Profit']}
                  />
                  <Bar dataKey="profit" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-center py-8">No hay datos por deporte</p>
            )}
            <div className="mt-4 space-y-2">
              {sportData.map((sport) => (
                <div key={sport.sport} className="flex justify-between items-center p-2 bg-bg-secondary rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: getSportColor(sport.sport) }} />
                    <span>{sport.sport}</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-400">{sport.totalBets} bets</span>
                    <span className={sport.roi >= 0 ? 'text-win' : 'text-loss'}>{sport.roi.toFixed(1)}% ROI</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-bg-card p-6 rounded-lg border border-border-dark">
            <h3 className="text-lg font-bold mb-4">Por Categoría</h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="category" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    formatter={(value: number) => [formatCurrency(value), 'Profit']}
                  />
                  <Bar dataKey="profit" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-center py-8">No hay datos por categoría</p>
            )}
            <div className="mt-4 grid grid-cols-3 gap-4">
              {categoryData.map((cat) => (
                <div key={cat.category} className="p-3 bg-bg-secondary rounded text-center">
                  <div className="w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: getCategoryColor(cat.category) + '20', color: getCategoryColor(cat.category) }}>
                    {cat.category}
                  </div>
                  <p className="text-sm text-gray-400">{cat.totalBets} bets</p>
                  <p className={`font-bold ${cat.roi >= 0 ? 'text-win' : 'text-loss'}`}>{cat.roi.toFixed(1)}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-bg-card p-6 rounded-lg border border-border-dark">
          <h3 className="text-lg font-bold mb-4">Detalles por Deporte</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-border-dark">
                  <th className="text-left py-2">Deporte</th>
                  <th className="text-right py-2">Bets</th>
                  <th className="text-right py-2">Ganadas</th>
                  <th className="text-right py-2">Perdidas</th>
                  <th className="text-right py-2">Profit</th>
                  <th className="text-right py-2">ROI</th>
                  <th className="text-right py-2">Cuota Avg</th>
                </tr>
              </thead>
              <tbody>
                {sportData.map((sport) => (
                  <tr key={sport.sport} className="border-b border-border-dark">
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded" style={{ backgroundColor: getSportColor(sport.sport) }} />
                        {sport.sport}
                      </div>
                    </td>
                    <td className="text-right py-2">{sport.totalBets}</td>
                    <td className="text-right py-2 text-win">{sport.won}</td>
                    <td className="text-right py-2 text-loss">{sport.lost}</td>
                    <td className={`text-right py-2 ${sport.profit >= 0 ? 'text-win' : 'text-loss'}`}>
                      {formatCurrency(sport.profit)}
                    </td>
                    <td className={`text-right py-2 ${sport.roi >= 0 ? 'text-win' : 'text-loss'}`}>
                      {sport.roi.toFixed(1)}%
                    </td>
                    <td className="text-right py-2">{sport.avgOdds.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
