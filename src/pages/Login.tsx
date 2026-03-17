import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../api/axios'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Password requerido'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await api.post('/auth/login', data)
      setAuth(response.data.user, response.data.access_token)
      navigate('/')
    } catch (error: any) {
      if (error.response?.status === 401) {
        setError('password', { message: 'Credenciales inválidas' })
      } else {
        setError('password', { message: 'Error al iniciar sesión' })
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="w-full max-w-md p-8 bg-bg-card rounded-lg border border-border-dark">
        <h1 className="text-2xl font-bold text-center mb-6 text-gold">BetRoll</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm mb-1">Email</label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="w-full px-4 py-2 bg-bg-secondary border border-border-dark rounded focus:outline-none focus:border-gold"
              placeholder="tu@email.com"
            />
            {errors.email && <p className="text-loss text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-1">Password</label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className="w-full px-4 py-2 bg-bg-secondary border border-border-dark rounded focus:outline-none focus:border-gold"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-loss text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 bg-gold text-bg-primary font-bold rounded hover:bg-yellow-400 disabled:opacity-50"
          >
            {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-gold hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}
