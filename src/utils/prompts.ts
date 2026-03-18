import { formatCOP } from '../utils/formatCOP';
import { generateTennisPrompt } from './tennisPrompts';
import { generateBasketballPrompt } from './basketballPrompts';
import { generateSoccerPrompt } from './soccerPrompts';

interface PromptData {
  sport: string;
  sportLabel: string;
  tournament: string;
  homeTeam: string;
  awayTeam: string;
  formattedDate: string;
  bankrollAmount: number;
  odds?: number;
}

export const generateGenericPrompt = (data: PromptData): string => {
  return `Actúa como un analista cuantitativo de apuestas deportivas.
Tu objetivo es encontrar VALUE BETS con ventaja matemática.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATOS DEL PARTIDO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEPORTE:     ${data.sportLabel}
PARTIDO:     ${data.homeTeam} vs ${data.awayTeam}
TORNEO:      ${data.tournament}
FECHA/HORA:  ${data.formattedDate}
BANKROLL:    ${formatCOP(data.bankrollAmount)}
${data.odds ? `CUOTA: ${data.odds}` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Analiza el partido y busca value bets:

1. FORMA RECIENTE
- Últimos 5-10 partidos de cada equipo
- Racha actual
- Local vs Visitante

2. ESTADÍSTICAS
- Goles/puntos anotados y recibidos
- xG / estadísticas relevantes del deporte

3. H2H
- Últimos enfrentamientos directos

4. LESIONES
- Jugadores baja confirmados

5. ANÁLISIS DE CUOTAS
- Compara tu probabilidad vs probabilidad implícita

6. VALUE BET
EV = (prob_real × cuota) - 1
Si EV > 0.05 → hay valor

7. GESTIÓN BANKROLL
Bankroll: ${formatCOP(data.bankrollAmount)}
- EV > 0.12 → 5%
- EV 0.07-0.12 → 3%
- EV 0.05-0.07 → 1.5%

8. RESUMEN FINAL
╔═══════════════════════════════╗
║ MEJOR APUESTA               ║
╠═══════════════════════════════╣
║ Tipo:                       ║
║ Cuota:                      ║
║ Probabilidad real:          ║
║ EV:                         ║
║ Monto:                      ║
╚═══════════════════════════════╝`;
};

export const generatePrompt = (data: PromptData): string => {
  switch (data.sport) {
    case 'BASKETBALL':
      return generateBasketballPrompt(data);
    case 'FOOTBALL':
      return generateSoccerPrompt(data);
    case 'TENNIS':
      return generateTennisPrompt(data);
    default:
      return generateGenericPrompt(data);
  }
};
