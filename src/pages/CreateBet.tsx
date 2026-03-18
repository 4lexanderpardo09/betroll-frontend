import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useBetStore } from '../store/betStore';
import { useBankrollStore } from '../store/bankrollStore';
import { formatCOP } from '../utils/formatCOP';
import { generatePrompt } from '../utils/prompts';
import { Sport, BetType } from '../api/bets';

const betSchema = z.object({
  sport: z.enum(['FOOTBALL', 'TENNIS', 'BASKETBALL', 'OTHER']),
  tournament: z.string().min(1, 'El tournament es requerido'),
  homeTeam: z.string().min(1, 'El equipo local es requerido'),
  awayTeam: z.string().min(1, 'El equipo visitante es requerido'),
  betType: z.enum(['HOME_WIN', 'AWAY_WIN', 'DRAW', 'DOUBLE_CHANCE_HOME', 'DOUBLE_CHANCE_AWAY', 'BTTS_YES', 'BTTS_NO', 'OVER', 'UNDER', 'HANDICAP', 'OTHER']),
  selection: z.string().min(1, 'La selección es requerida'),
  odds: z.number().min(1.01, 'La cuota debe ser mayor a 1.0'),
  amount: z.number().min(1000, 'El monto mínimo es 1000 COP'),
  percentage: z.number().min(0).max(5).optional(),
  reasoning: z.string().optional(),
});

type BetFormData = z.infer<typeof betSchema>;

const SPORTS: { value: Sport; label: string }[] = [
  { value: 'FOOTBALL', label: 'Fútbol' },
  { value: 'TENNIS', label: 'Tenis' },
  { value: 'BASKETBALL', label: 'Baloncesto' },
  { value: 'OTHER', label: 'Otro' },
];

const BET_TYPES: { value: BetType; label: string }[] = [
  { value: 'HOME_WIN', label: 'Victoria Local' },
  { value: 'AWAY_WIN', label: 'Victoria Visitante' },
  { value: 'DRAW', label: 'Empate' },
  { value: 'DOUBLE_CHANCE_HOME', label: 'Doble Oportunidad Local' },
  { value: 'DOUBLE_CHANCE_AWAY', label: 'Doble Oportunidad Visitante' },
  { value: 'BTTS_YES', label: 'Ambos Marcan - Sí' },
  { value: 'BTTS_NO', label: 'Ambos Marcan - No' },
  { value: 'OVER', label: 'Over' },
  { value: 'UNDER', label: 'Under' },
  { value: 'HANDICAP', label: 'Handicap' },
  { value: 'OTHER', label: 'Otro' },
];

export function CreateBet() {
  const navigate = useNavigate();
  const { createBet, loading, error, clearError } = useBetStore();
  const { bankroll, fetchBankroll } = useBankrollStore();

  const [potentialWin, setPotentialWin] = useState(0);
  const [category, setCategory] = useState<'A' | 'B' | 'C'>('B');
  const [stopLossWarning, setStopLossWarning] = useState<string | null>(null);
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingData, setPendingData] = useState<BetFormData | null>(null);
  const [showAIPromptModal, setShowAIPromptModal] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  // Percentage options for bankroll
  const percentageOptions = [
    { value: 0, label: '0%' },
    { value: 0.5, label: '0.5%' },
    { value: 1, label: '1%' },
    { value: 1.5, label: '1.5%' },
    { value: 2, label: '2%' },
    { value: 2.5, label: '2.5%' },
    { value: 3, label: '3%' },
    { value: 3.5, label: '3.5%' },
    { value: 4, label: '4%' },
    { value: 4.5, label: '4.5%' },
    { value: 5, label: '5%' },
  ];

  const getRecommendedAmount = (percentage: number) => {
    if (!bankroll) return 0;
    return Math.round(bankroll.currentAmount * (percentage / 100));
  };

  const getCategoryFromPercentage = (percentage: number): 'A' | 'B' | 'C' | null => {
    if (percentage >= 3) return 'A';
    if (percentage >= 1.5) return 'B';
    if (percentage >= 0.5) return 'C';
    return null;
  };

  useEffect(() => {
    fetchBankroll();
  }, [fetchBankroll]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BetFormData>({
    resolver: zodResolver(betSchema),
    defaultValues: {
      sport: 'FOOTBALL',
      betType: 'HOME_WIN',
      percentage: 1,
      amount: 10000,
    },
  });

  const watchOdds = watch('odds');
  const watchAmount = watch('amount');
  const watchPercentage = watch('percentage') || 1;

  useEffect(() => {
    const odds = Number(watchOdds) || 0;
    const amount = Number(watchAmount) || 0;

    // Calculate potential win
    const potential = Math.round((amount * odds) - amount);
    setPotentialWin(potential);

    // Calculate category based on percentage
    const calculatedCategory = getCategoryFromPercentage(watchPercentage);
    setCategory(calculatedCategory || 'B');

    // Check stop-loss (simple warning based on bankroll)
    if (bankroll && amount > bankroll.currentAmount * 0.3) {
      setStopLossWarning('Advertencia: Estás apostando más del 30% de tu bankroll');
    } else {
      setStopLossWarning(null);
    }
  }, [watchOdds, watchAmount, bankroll]);

  const onSubmit = async (data: BetFormData) => {
    if (!eventDate) {
      alert('Por favor selecciona una fecha');
      return;
    }
    
    // Check if amount is recommended based on percentage
    const recommendedAmount = getRecommendedAmount(data.percentage || 1);
    const tolerance = recommendedAmount * 0.2; // 20% tolerance
    const isRecommended = Math.abs(data.amount - recommendedAmount) <= tolerance;
    
    if (!isRecommended && (data.percentage || 1) > 0) {
      setPendingData(data);
      setShowConfirmModal(true);
      return;
    }
    
    const success = await createBet({
      ...data,
      eventDate: eventDate.toISOString(),
    });
    if (success) {
      navigate('/bets');
    }
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    if (pendingData && eventDate) {
      const success = await createBet({
        ...pendingData,
        eventDate: eventDate.toISOString(),
      });
      if (success) {
        navigate('/bets');
      }
      setPendingData(null);
    }
  };

  const categoryColors: Record<string, string> = {
    A: 'bg-green-600',
    B: 'bg-yellow-600',
    C: 'bg-red-600',
  };

  const generateAIPrompt = () => {
    const formData = watch();
    const bankrollAmount = bankroll?.currentAmount || 0;
    
    const sportLabel = SPORTS.find(s => s.value === formData.sport)?.label || formData.sport || 'Otro';
    const formattedDate = eventDate ? eventDate.toLocaleString('es-CO', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : 'Por definir';

    const prompt = generatePrompt({
      sport: formData.sport,
      sportLabel,
      tournament: formData.tournament,
      homeTeam: formData.homeTeam,
      awayTeam: formData.awayTeam,
      formattedDate,
      bankrollAmount,
      odds: formData.odds,
    });

    setGeneratedPrompt(prompt);
    setShowAIPromptModal(true);
  };

  const copyPromptToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      alert('¡Prompt copiado al portapapeles! Pégalo en tu chat de IA.');
    } catch {
      alert('Error al copiar. Por favor selecciona y copia el texto manualmente.');
    }
  };

  const canGeneratePrompt = eventDate && watch('homeTeam') && watch('awayTeam') && watch('tournament');

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Nueva Apuesta</h1>
        {bankroll && (
          <div className="text-sm text-gray-400">
            Bankroll: <span className="text-gold font-bold">{formatCOP(bankroll.currentAmount)}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-600 text-red-200 px-4 py-3 rounded-lg mb-4">
          {error}
          <button onClick={clearError} className="ml-2 text-red-400 hover:text-red-200">
            ✕
          </button>
        </div>
      )}

      {stopLossWarning && (
        <div className="bg-yellow-900/50 border border-yellow-600 text-yellow-200 px-4 py-3 rounded-lg mb-4">
          ⚠️ {stopLossWarning}
        </div>
      )}

      {!bankroll && (
        <div className="bg-yellow-900/50 border border-yellow-600 text-yellow-200 px-4 py-3 rounded-lg mb-4">
          Necesitas tener un bankroll creado para poder hacer apuestas.
          <a href="/bankroll" className="underline ml-1">Crear bankroll</a>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Sport */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Deporte</label>
          <select
            {...register('sport')}
            className="w-full bg-bg-secondary border border-border-dark rounded-lg px-4 py-2 text-white"
          >
            {SPORTS.map((sport) => (
              <option key={sport.value} value={sport.value}>
                {sport.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tournament */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Torneo</label>
          <input
            {...register('tournament')}
            placeholder="Ej: La Liga, Champions League"
            className="w-full bg-bg-secondary border border-border-dark rounded-lg px-4 py-2 text-white"
          />
          {errors.tournament && <p className="text-red-400 text-sm mt-1">{errors.tournament.message}</p>}
        </div>

        {/* Teams */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Equipo Local</label>
            <input
              {...register('homeTeam')}
              placeholder="Ej: Real Madrid"
              className="w-full bg-bg-secondary border border-border-dark rounded-lg px-4 py-2 text-white"
            />
            {errors.homeTeam && <p className="text-red-400 text-sm mt-1">{errors.homeTeam.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Equipo Visitante</label>
            <input
              {...register('awayTeam')}
              placeholder="Ej: Barcelona"
              className="w-full bg-bg-secondary border border-border-dark rounded-lg px-4 py-2 text-white"
            />
            {errors.awayTeam && <p className="text-red-400 text-sm mt-1">{errors.awayTeam.message}</p>}
          </div>
        </div>

        {/* Event Date */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Fecha del Evento</label>
          <DatePicker
            selected={eventDate}
            onChange={(date: Date | null) => setEventDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            minDate={new Date()}
            dateFormat="dd/MM/yyyy HH:mm"
            placeholderText="Selecciona fecha y hora"
            className="w-full bg-bg-secondary border border-border-dark rounded-lg px-4 py-2 text-white"
            popperPlacement="bottom-start"
          />
        </div>

        {/* AI Prompt Builder Button */}
        {canGeneratePrompt && (
          <button
            type="button"
            onClick={generateAIPrompt}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            🤖 Generar Análisis IA
          </button>
        )}

        {/* Bet Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Tipo de Apuesta</label>
          <select
            {...register('betType')}
            className="w-full bg-bg-secondary border border-border-dark rounded-lg px-4 py-2 text-white"
          >
            {BET_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Selección</label>
          <input
            {...register('selection')}
            placeholder="Ej: Real Madrid, Over 2.5"
            className="w-full bg-bg-secondary border border-border-dark rounded-lg px-4 py-2 text-white"
          />
          {errors.selection && <p className="text-red-400 text-sm mt-1">{errors.selection.message}</p>}
        </div>

        {/* Odds and Amount */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Cuota</label>
            <input
              type="number"
              step="0.01"
              {...register('odds', { valueAsNumber: true })}
              placeholder="1.85"
              className="w-full bg-bg-secondary border border-border-dark rounded-lg px-4 py-2 text-white"
            />
            {errors.odds && <p className="text-red-400 text-sm mt-1">{errors.odds.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Monto (COP)</label>
            <input
              type="number"
              {...register('amount', { valueAsNumber: true })}
              placeholder="10000"
              className="w-full bg-bg-secondary border border-border-dark rounded-lg px-4 py-2 text-white"
            />
            {errors.amount && <p className="text-red-400 text-sm mt-1">{errors.amount.message}</p>}
          </div>
        </div>

        {/* Percentage of Bankroll */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Porcentaje del Bankroll
            <span className="text-gold ml-2">{watchPercentage}%</span>
          </label>
          <select
            {...register('percentage', { valueAsNumber: true })}
            className="w-full bg-bg-secondary border border-border-dark rounded-lg px-4 py-2 text-white"
          >
            {percentageOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          
          {/* Category indicator */}
          {watchPercentage > 0 && (
            <div className="mt-2 flex items-center justify-center">
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                watchPercentage >= 3 ? 'bg-green-900/50 text-green-400' :
                watchPercentage >= 1.5 ? 'bg-yellow-900/50 text-yellow-400' :
                'bg-blue-900/50 text-blue-400'
              }`}>
                Categoría {getCategoryFromPercentage(watchPercentage) || '-'}
              </span>
            </div>
          )}
          
          {bankroll && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => {
                  const recommended = getRecommendedAmount(watchPercentage);
                  setValue('amount', recommended);
                }}
                className="w-full bg-gold/10 hover:bg-gold/20 border border-gold/30 text-gold py-2 px-4 rounded-lg text-sm font-medium transition-colors"
              >
                🎯 Aplicar monto recomendado: {formatCOP(getRecommendedAmount(watchPercentage))}
              </button>
            </div>
          )}
        </div>

        {/* Reasoning */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Razonamiento (opcional)</label>
          <textarea
            {...register('reasoning')}
            rows={3}
            placeholder="¿Por qué crees que esta apuesta es rentable?"
            className="w-full bg-bg-secondary border border-border-dark rounded-lg px-4 py-2 text-white"
          />
        </div>

        {/* Preview */}
        <div className="bg-bg-secondary border border-border-dark rounded-lg p-4 mt-6">
          <h3 className="text-lg font-semibold text-white mb-3">Vista Previa</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-500 text-sm">Categoría:</span>
              <span className={`ml-2 px-2 py-0.5 rounded text-sm font-bold ${categoryColors[category]}`}>
                {category}
              </span>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Ganancia Potencial:</span>
              <span className="ml-2 text-green-400 font-bold">{formatCOP(potentialWin)}</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/bets')}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || !bankroll || watchPercentage === 0}
            className="flex-1 bg-gold hover:bg-yellow-500 text-black py-3 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creando...' : watchPercentage === 0 ? 'Selecciona un %' : 'Crear Apuesta'}
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-bg-card border border-border-dark rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-xl font-bold text-white mb-4">⚠️ Monto no recomendado</h3>
            <p className="text-gray-300 mb-4">
              Estás apostando un monto que no coincide con el porcentaje seleccionado ({watchPercentage}%).
              El monto recomendado para este porcentaje es <span className="text-gold font-bold">{formatCOP(getRecommendedAmount(watchPercentage))}</span>.
            </p>
            <p className="text-gray-400 text-sm mb-6">
              Esto puede afectar tu gestión del bankroll a largo plazo. ¿Estás seguro de continuar?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="flex-1 bg-loss hover:bg-red-600 text-white py-3 rounded-lg font-bold transition-colors"
              >
                Sí, continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Prompt Modal */}
      {showAIPromptModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-card border border-border-dark rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                🤖 Prompt de Análisis IA
              </h3>
              <button
                onClick={() => setShowAIPromptModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Copia el siguiente prompt y pégalo en tu chat de IA favorito (ChatGPT, Claude, Gemini, etc.)
            </p>
            <div className="flex-1 overflow-y-auto bg-bg-secondary border border-border-dark rounded-lg p-4 mb-4">
              <pre className="text-gray-300 text-xs whitespace-pre-wrap font-mono">
                {generatedPrompt}
              </pre>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAIPromptModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={copyPromptToClipboard}
                className="flex-1 bg-gold hover:bg-yellow-500 text-black py-3 rounded-lg font-bold transition-colors"
              >
                📋 Copiar Prompt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
