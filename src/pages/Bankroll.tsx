import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wallet, ArrowUpCircle, ArrowDownCircle, RefreshCw, History, DollarSign } from 'lucide-react';
import { useBankrollStore } from '../store/bankrollStore';

// Utility to format COP
function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Validation schemas
const createSchema = z.object({
  initialAmount: z.coerce.number().min(1000, 'Monto mínimo 1000 COP'),
});

const operationSchema = z.object({
  amount: z.coerce.number().min(1000, 'Monto mínimo 1000 COP'),
  description: z.string().optional(),
});

type CreateForm = z.infer<typeof createSchema>;
type OperationForm = z.infer<typeof operationSchema>;

export default function BankrollPage() {
  const { 
    bankroll, 
    movements, 
    loading, 
    error,
    fetchBankroll, 
    createBankroll, 
    updateBankroll, 
    deposit, 
    withdraw, 
    fetchMovements 
  } = useBankrollStore();

  const [activeTab, setActiveTab] = useState<'info' | 'deposit' | 'withdraw'>('info');

  const createForm = useForm<CreateForm>({
    resolver: zodResolver(createSchema),
    defaultValues: { initialAmount: 100000 },
  });

  const operationForm = useForm<OperationForm>({
    resolver: zodResolver(operationSchema),
    defaultValues: { amount: 10000, description: '' },
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showInitialUpdate, setShowInitialUpdate] = useState(false);

  useEffect(() => {
    fetchBankroll();
    fetchMovements();
  }, []);

  useEffect(() => {
    if (error) {
      setSuccessMessage(null);
    }
  }, [error]);

  const handleCreate = async (data: CreateForm) => {
    const success = await createBankroll(data.initialAmount);
    if (success) {
      setSuccessMessage('Bankroll creado exitosamente');
    }
  };

  const handleDeposit = async (data: OperationForm) => {
    const success = await deposit(data.amount, data.description);
    if (success) {
      setSuccessMessage('Depósito realizado exitosamente');
      operationForm.reset();
    }
  };

  const handleWithdraw = async (data: OperationForm) => {
    const success = await withdraw(data.amount, data.description);
    if (success) {
      setSuccessMessage('Retiro realizado exitosamente');
      operationForm.reset();
    }
  };

  const handleUpdateInitial = async (data: CreateForm) => {
    const success = await updateBankroll(data.initialAmount);
    if (success) {
      setSuccessMessage('Monto inicial actualizado');
      setShowInitialUpdate(false);
    }
  };

  const getMovementColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
      case 'WIN':
      case 'CASHOUT':
        return 'text-win';
      case 'WITHDRAWAL':
      case 'LOSS':
        return 'text-loss';
      default:
        return 'text-pending';
    }
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return <ArrowUpCircle className="w-4 h-4" />;
      case 'WITHDRAWAL':
        return <ArrowDownCircle className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  // No bankroll yet - show creation form
  if (!bankroll) {
    return (
      <div className="min-h-screen bg-bg-primary p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Wallet className="w-8 h-8 text-gold" />
            <h1 className="text-2xl font-bold text-white">Bankroll</h1>
          </div>

          <div className="bg-bg-card rounded-xl p-6 border border-border-dark">
            <h2 className="text-xl font-semibold text-white mb-4">Crear Bankroll</h2>
            <p className="text-gray-400 mb-6 text-sm">
              Define tu bankroll inicial para comenzar a gestionar tus apuestas.
            </p>

            <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Monto inicial (COP)
                </label>
                <input
                  {...createForm.register('initialAmount')}
                  type="number"
                  className="w-full bg-bg-secondary border border-border-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold"
                  placeholder="100000"
                />
                {createForm.formState.errors.initialAmount && (
                  <p className="text-loss text-sm mt-1">
                    {createForm.formState.errors.initialAmount.message}
                  </p>
                )}
              </div>

              {error && <p className="text-loss text-sm">{error}</p>}
              {successMessage && <p className="text-win text-sm">{successMessage}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold text-bg-primary font-semibold py-3 rounded-lg hover:bg-gold/90 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Creando...' : 'Crear Bankroll'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Has bankroll - show dashboard
  return (
    <div className="min-h-screen bg-bg-primary p-4">
      <div className="max-w-md mx-auto lg:max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Wallet className="w-8 h-8 text-gold" />
            <h1 className="text-2xl font-bold text-white">Bankroll</h1>
          </div>
        </div>

        {error && (
          <div className="bg-loss/20 border border-loss text-loss px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-win/20 border border-win text-win px-4 py-3 rounded-lg mb-4">
            {successMessage}
          </div>
        )}

        {/* Bankroll Info Card */}
        <div className="bg-bg-card rounded-xl p-6 border border-border-dark mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-bg-secondary rounded-lg p-4">
              <p className="text-gray-400 text-sm">Saldo Actual</p>
              <p className="text-2xl font-bold text-white">{formatCOP(bankroll.currentAmount)}</p>
            </div>
            <div className="bg-bg-secondary rounded-lg p-4">
              <p className="text-gray-400 text-sm">Inicial</p>
              <p className="text-2xl font-bold text-white">{formatCOP(bankroll.initialAmount)}</p>
            </div>
            <div className="bg-bg-secondary rounded-lg p-4">
              <p className="text-gray-400 text-sm">Fecha Inicio</p>
              <p className="text-xl font-semibold text-white">
                {new Date(bankroll.startDate).toLocaleDateString('es-CO')}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowInitialUpdate(!showInitialUpdate)}
            className="mt-4 flex items-center gap-2 text-gold hover:text-gold/80 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar monto inicial
          </button>

          {showInitialUpdate && (
            <form onSubmit={createForm.handleSubmit(handleUpdateInitial)} className="mt-4 flex gap-2">
              <input
                {...createForm.register('initialAmount')}
                type="number"
                defaultValue={bankroll.initialAmount}
                className="flex-1 bg-bg-secondary border border-border-dark rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-gold text-bg-primary px-4 py-2 rounded-lg font-medium hover:bg-gold/90 disabled:opacity-50"
              >
                Actualizar
              </button>
            </form>
          )}
        </div>

        {/* Operations */}
        <div className="bg-bg-card rounded-xl border border-border-dark overflow-hidden mb-6">
          {/* Tabs */}
          <div className="flex border-b border-border-dark">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                activeTab === 'info' 
                  ? 'text-gold border-b-2 border-gold bg-bg-secondary' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Información
            </button>
            <button
              onClick={() => setActiveTab('deposit')}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                activeTab === 'deposit' 
                  ? 'text-gold border-b-2 border-gold bg-bg-secondary' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Depositar
            </button>
            <button
              onClick={() => setActiveTab('withdraw')}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                activeTab === 'withdraw' 
                  ? 'text-gold border-b-2 border-gold bg-bg-secondary' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Retirar
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'info' && (
              <div className="text-center text-gray-400">
                <p className="mb-2">Monto disponible para apuestas:</p>
                <p className="text-3xl font-bold text-white">{formatCOP(bankroll.currentAmount)}</p>
              </div>
            )}

            {activeTab === 'deposit' && (
              <form onSubmit={operationForm.handleSubmit(handleDeposit)} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Monto a depositar</label>
                  <input
                    {...operationForm.register('amount')}
                    type="number"
                    className="w-full bg-bg-secondary border border-border-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold"
                  />
                  {operationForm.formState.errors.amount && (
                    <p className="text-loss text-sm mt-1">{operationForm.formState.errors.amount.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Descripción (opcional)</label>
                  <input
                    {...operationForm.register('description')}
                    type="text"
                    className="w-full bg-bg-secondary border border-border-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold"
                    placeholder="Depósito adicional"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-win text-white font-semibold py-3 rounded-lg hover:bg-win/90 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Procesando...' : 'Depositar'}
                </button>
              </form>
            )}

            {activeTab === 'withdraw' && (
              <form onSubmit={operationForm.handleSubmit(handleWithdraw)} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Monto a retirar</label>
                  <input
                    {...operationForm.register('amount')}
                    type="number"
                    className="w-full bg-bg-secondary border border-border-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold"
                  />
                  {operationForm.formState.errors.amount && (
                    <p className="text-loss text-sm mt-1">{operationForm.formState.errors.amount.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Descripción (opcional)</label>
                  <input
                    {...operationForm.register('description')}
                    type="text"
                    className="w-full bg-bg-secondary border border-border-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold"
                    placeholder="Retiro"
                  />
                </div>
                <p className="text-gray-400 text-sm">
                  Disponible: {formatCOP(bankroll.currentAmount)}
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-loss text-white font-semibold py-3 rounded-lg hover:bg-loss/90 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Procesando...' : 'Retirar'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Movements History */}
        <div className="bg-bg-card rounded-xl border border-border-dark p-6">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-gold" />
            <h2 className="text-lg font-semibold text-white">Movimientos Recientes</h2>
          </div>

          {movements.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No hay movimientos aún</p>
          ) : (
            <div className="space-y-3">
              {movements.map((movement) => (
                <div
                  key={movement.id}
                  className="flex items-center justify-between bg-bg-secondary rounded-lg p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`${getMovementColor(movement.type)}`}>
                      {getMovementIcon(movement.type)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{movement.type}</p>
                      <p className="text-gray-400 text-sm">
                        {movement.description || new Date(movement.createdAt).toLocaleDateString('es-CO')}
                      </p>
                    </div>
                  </div>
                  <div className={`text-right font-semibold ${getMovementColor(movement.type)}`}>
                    {movement.type === 'WITHDRAWAL' || movement.type === 'LOSS' ? '-' : '+'}
                    {formatCOP(movement.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
