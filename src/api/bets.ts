import api from './axios'

export type Sport = 'FOOTBALL' | 'TENNIS' | 'BASKETBALL' | 'OTHER'
export type BetType = 'HOME_WIN' | 'AWAY_WIN' | 'DRAW' | 'DOUBLE_CHANCE_HOME' | 'DOUBLE_CHANCE_AWAY' | 'BTTS_YES' | 'BTTS_NO' | 'OVER' | 'UNDER' | 'HANDICAP' | 'OTHER'
export type BetStatus = 'PENDING' | 'WON' | 'LOST' | 'VOID' | 'CASHOUT'
export type BetCategory = 'A' | 'B' | 'C'

export interface Bet {
  id: string
  userId: string
  sport: Sport
  tournament: string
  homeTeam: string
  awayTeam: string
  eventDate: string
  betType: BetType
  selection: string
  odds: number
  amount: number
  category: BetCategory
  confidence: number
  reasoning: string | null
  status: BetStatus
  potentialWin: number
  profit: number
  cashoutAmount: number | null
  resolvedAt: string | null
  postNotes: string | null
  parlayId: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateBetDto {
  sport: Sport
  tournament: string
  homeTeam: string
  awayTeam: string
  eventDate: string
  betType: BetType
  selection: string
  odds: number
  amount: number
  confidence?: number
  reasoning?: string
}

export interface ResolveBetDto {
  status: BetStatus
  cashoutAmount?: number
  postNotes?: string
}

export interface BetFilters {
  sport?: Sport
  status?: BetStatus
  category?: BetCategory
  dateFrom?: string
  dateTo?: string
}

export interface BetsResponse {
  data: Bet[]
  total: number
  page: number
  limit: number
}

export interface BetStats {
  total: number
  won: number
  lost: number
  pending: number
  void: number
  cashout: number
  winRate: number
  totalProfit: number
  totalStaked: number
}

export const getBets = async (
  page = 1,
  limit = 20,
  filters?: BetFilters
): Promise<BetsResponse> => {
  const params = new URLSearchParams()
  params.append('page', String(page))
  params.append('limit', String(limit))
  
  if (filters?.sport) params.append('sport', filters.sport)
  if (filters?.status) params.append('status', filters.status)
  if (filters?.category) params.append('category', filters.category)
  if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom)
  if (filters?.dateTo) params.append('dateTo', filters.dateTo)
  
  const { data } = await api.get(`/bets?${params.toString()}`)
  return data
}

export const getBet = async (id: string): Promise<Bet> => {
  const { data } = await api.get(`/bets/${id}`)
  return data.data
}

export const createBet = async (dto: CreateBetDto): Promise<Bet> => {
  const { data } = await api.post('/bets', dto)
  return data.data
}

export const resolveBet = async (id: string, dto: ResolveBetDto): Promise<Bet> => {
  const { data } = await api.patch(`/bets/${id}/resolve`, dto)
  return data.data
}

export const deleteBet = async (id: string): Promise<void> => {
  await api.delete(`/bets/${id}`)
}

export const getPendingBets = async (): Promise<Bet[]> => {
  const { data } = await api.get('/bets/pending')
  return data
}

export const getBetStats = async (): Promise<BetStats> => {
  const { data } = await api.get('/bets/stats')
  return data
}
