import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getParlays, Parlay, deleteParlay } from '../api/parlays'

export default function Parlays() {
  const navigate = useNavigate()
  const [parlays, setParlays] = useState<Parlay[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getParlays()
      .then(res => {
        setParlays(res.data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este parlay?')) return
    try {
      await deleteParlay(id)
      setParlays(parlays.filter(p => p.id !== id))
    } catch (err) {
      alert('Error al eliminar parlay')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WON': return 'text-win'
      case 'LOST': return 'text-loss'
      case 'VOID': return 'text-gray-400'
      default: return 'text-pending'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'WON': return 'GANADO'
      case 'LOST': return 'PERDIDO'
      case 'VOID': return 'VOID'
      default: return 'PENDIENTE'
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Parlays</h2>
          <button
            onClick={() => navigate('/parlays/create')}
            className="flex items-center gap-2 bg-gold text-bg-primary px-4 py-2 rounded-lg font-medium hover:bg-gold/90"
          >
            <Plus size={20} />
            Nuevo Parlay
          </button>
        </div>

        {parlays.length === 0 ? (
          <div className="bg-bg-card p-8 rounded-lg border border-border-dark text-center">
            <p className="text-gray-400 mb-4">No hay parlays aún</p>
            <button
              onClick={() => navigate('/parlays/create')}
              className="text-gold hover:underline"
            >
              Crear tu primer parlay
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {parlays.map(parlay => (
              <div key={parlay.id} className="bg-bg-card p-4 rounded-lg border border-border-dark">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className={`font-bold ${getStatusColor(parlay.status)}`}>
                      {getStatusLabel(parlay.status)}
                    </span>
                    <span className="text-gray-400 text-sm ml-2">
                      {new Date(parlay.createdAt).toLocaleDateString('es-CO')}
                    </span>
                  </div>
                  {parlay.status === 'PENDING' && (
                    <button
                      onClick={() => handleDelete(parlay.id)}
                      className="text-gray-400 hover:text-loss"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Selecciones</p>
                    <p className="font-medium">{parlay.betIds.length}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Cuota Comb.</p>
                    <p className="font-medium">{Number(parlay.combinedOdds).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Monto</p>
                    <p className="font-medium">{formatCurrency(parlay.amount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Premio Pot.</p>
                    <p className="font-medium text-gold">{formatCurrency(parlay.potentialWin)}</p>
                  </div>
                </div>

                {parlay.status !== 'PENDING' && (
                  <div className="mt-3 pt-3 border-t border-border-dark">
                    <span className="text-gray-400">Profit: </span>
                    <span className={`font-bold ${parlay.profit >= 0 ? 'text-win' : 'text-loss'}`}>
                      {parlay.profit >= 0 ? '+' : ''}{formatCurrency(parlay.profit)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
