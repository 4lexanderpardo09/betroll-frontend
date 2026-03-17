import { useEffect, useState } from 'react'
import { ArrowLeft, Calculator } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { getPendingBets, createParlay, PendingBet } from '../api/parlays'

export default function CreateParlay() {
  const navigate = useNavigate()
  const [bets, setBets] = useState<PendingBet[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [amount, setAmount] = useState(10000)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getPendingBets()
      .then(res => {
        setBets(res.data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  const toggleBet = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id))
    } else {
      setSelected([...selected, id])
    }
  }

  const combinedOdds = selected.reduce((product, id) => {
    const bet = bets.find(b => b.id === id)
    return product * (bet ? Number(bet.odds) : 1)
  }, 1)

  const potentialWin = Math.round(amount * combinedOdds - amount)

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(num)
  }

  const handleSubmit = async () => {
    if (selected.length < 2) {
      alert('Selecciona al menos 2 apuestas')
      return
    }
    if (amount < 1000) {
      alert('El monto mínimo es $1,000')
      return
    }

    setSubmitting(true)
    try {
      await createParlay(selected, amount)
      navigate('/parlays')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al crear parlay')
    } finally {
      setSubmitting(false)
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
      <main className="max-w-4xl mx-auto p-4">
        <button
          onClick={() => navigate('/parlays')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
        >
          <ArrowLeft size={20} />
          Volver a Parlays
        </button>

        <h2 className="text-2xl font-bold mb-6">Crear Parlay</h2>

        {bets.length < 2 ? (
          <div className="bg-bg-card p-8 rounded-lg border border-border-dark text-center">
            <p className="text-gray-400">
              Necesitas al menos 2 apuestas pendientes para crear un parlay.
            </p>
            <Link to="/bets/create" className="inline-block mt-4 text-gold hover:underline">
              Crear apuestas
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-bg-card p-4 rounded-lg border border-border-dark mb-4">
              <h3 className="font-bold mb-3">Selecciona las apuestas</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {bets.map(bet => (
                  <label
                    key={bet.id}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      selected.includes(bet.id)
                        ? 'bg-gold/20 border border-gold'
                        : 'bg-bg-secondary hover:bg-bg-secondary/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(bet.id)}
                        onChange={() => toggleBet(bet.id)}
                        className="w-4 h-4"
                      />
                      <div>
                        <p className="font-medium">{bet.selection}</p>
                        <p className="text-sm text-gray-400">
                          {bet.sport} • {bet.tournament}
                        </p>
                      </div>
                    </div>
                    <span className="text-gold font-bold">{Number(bet.odds).toFixed(2)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-bg-card p-4 rounded-lg border border-border-dark mb-4">
              <h3 className="font-bold mb-3">Monto</h3>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                min={1000}
                step={1000}
                className="w-full bg-bg-secondary border border-border-dark rounded-lg px-4 py-2 text-white"
              />
            </div>

            <div className="bg-bg-card p-4 rounded-lg border border-border-dark mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="text-gold" size={20} />
                <h3 className="font-bold">Resumen</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Selecciones</span>
                  <span className="font-medium">{selected.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Cuota Combinada</span>
                  <span className="font-medium text-gold">{combinedOdds.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Monto</span>
                  <span className="font-medium">{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border-dark">
                  <span className="text-gray-400">Ganancia Potencial</span>
                  <span className="font-bold text-win">+{formatCurrency(potentialWin)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={selected.length < 2 || submitting}
              className={`w-full py-3 rounded-lg font-bold ${
                selected.length >= 2 && !submitting
                  ? 'bg-gold text-bg-primary hover:bg-gold/90'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {submitting ? 'Creando...' : 'Crear Parlay'}
            </button>
          </>
        )}
      </main>
    </div>
  )
}
