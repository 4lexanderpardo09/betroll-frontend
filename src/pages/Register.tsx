import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../api/axios'

const registerSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type RegisterForm = z.infer<typeof registerSchema>

export default function Register() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    try {
      const response = await api.post('/auth/register', data)
      setAuth(response.data.user, response.data.access_token)
      navigate('/')
    } catch (error: any) {
      if (error.response?.status === 409) {
        setError('email', { message: 'Email ya registrado' })
      } else {
        setError('root', { message: 'Error al registrar usuario' })
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="w-full max-w-md p-8 bg-bg-card rounded-lg border border-border-dark">
        <h1 className="text-2xl font-bold text-center mb-6 text-gold">BetRoll</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Nombre</label>
            <input
              {...register('name')}
              type="text"
              className="w-full px-4 py-2 bg-bg-secondary border border-border-dark rounded focus:outline-none focus:border-gold"
              placeholder="Tu nombre"
            />
            {errors.name && <p className="text-loss text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-4 py-2 bg-bg-secondary border border-border-dark rounded focus:outline-none focus:border-gold"
              placeholder="tu@email.com"
            />
            {errors.email && <p className="text-loss text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              {...register('password')}
              type="password"
              className="w-full px-4 py-2 bg-bg-secondary border border-border-dark rounded focus:outline-none focus:border-gold"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-loss text-sm mt-1">{errors.password.message}</p>}
          </div>

          {errors.root && <p className="text-loss text-sm">{errors.root.message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 bg-gold text-bg-primary font-bold rounded hover:bg-yellow-400 disabled:opacity-50"
          >
            {isSubmitting ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-gold hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
