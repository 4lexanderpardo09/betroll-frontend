import { formatCOP } from '../utils/formatCOP';

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

export const generateTennisPrompt = (data: PromptData): string => {
  return `Actúa como un analista cuantitativo especializado en tenis profesional
con acceso a estadísticas avanzadas de ATP/WTA, modelos probabilísticos
y análisis de mercado profesional.
Tu objetivo es encontrar VALUE BETS reales con ventaja matemática sobre las casas.
Busca información actualizada en internet ANTES de responder.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATOS DEL PARTIDO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PARTIDO:        ${data.homeTeam} vs ${data.awayTeam}
TORNEO:         ${data.tournament}
SUPERFICIE:     [Hard / Clay / Grass / Indoor Hard / Indoor Clay]
FECHA/HORA:     ${data.formattedDate}
BANKROLL:       ${formatCOP(data.bankrollAmount)}
${data.odds ? `CUOTA QUE VEO: ${data.odds}` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

───────────────────────────────────────
1️⃣ FORMA RECIENTE
───────────────────────────────────────
Para CADA jugador:
- Últimos 5 partidos (rival, marcador de sets, torneo, superficie)
- Últimos 10 partidos (record W/L)
- Racha actual
- Sets ganados vs perdidos (ratio)
- Rendimiento en esta superficie últimas 52 semanas

───────────────────────────────────────
2️⃣ ESTADÍSTICAS DE SERVICIO
───────────────────────────────────────
- % primer servicio dentro
- % puntos ganados con primer servicio
- % puntos ganados con segundo servicio
- Dobles faltas por partido
- Aces por partido
- Hold %

───────────────────────────────────────
3️⃣ ESTADÍSTICAS DE RESTO
───────────────────────────────────────
- Break points generados por set
- % conversión de break points
- Break % (juegos de saque ruptos)
- Return rating

───────────────────────────────────────
4️⃣ RENDIMIENTO EN LA SUPERFICIE
───────────────────────────────────────
- Win rate histórico en esta superficie
- Record de carrera en superficie
- ELO específico de superficie

───────────────────────────────────────
5️⃣ ENFRENTAMIENTOS DIRECTOS H2H
───────────────────────────────────────
- Historial completo
- Últimos 5 enfrentamientos
- H2H en esta superficie
- Tendencia últimos 3 enfrentamientos
- Promedio de juegos en H2H

───────────────────────────────────────
6️⃣ FATIGA Y CALENDARIO
───────────────────────────────────────
- Partidos jugados en torneo hasta hoy
- Duración acumulada en minutos
- Horas de descanso desde último partido
- Torneos últimas 4 semanas

───────────────────────────────────────
7️⃣ ESTILO DE JUEGO Y MATCHUP
───────────────────────────────────────
- Estilo: fondo de cancha / saque y volea / agresivo / defensivo
- Arma principal y punto débil
- Análisis del matchup entre ellos

───────────────────────────────────────
8️⃣ LESIONES Y ESTADO FÍSICO
───────────────────────────────────────
- Lesiones o molestias reportadas
- Historial de lesiones recurrentes
- Retiros recientes

───────────────────────────────────────
9️⃣ ANÁLISIS DE CUOTAS
───────────────────────────────────────
MERCADO GANADOR:
- Jugador 1: [cuota] → prob implícita: %
- Jugador 2: [cuota] → prob implícita: %

MERCADO JUEGOS:
- Over 19.5, 20.5, 21.5
- Under

MERCADO SETS:
- 2-0 / 2-1 para cada jugador

───────────────────────────────────────
🔟 MOVIMIENTO DE MERCADO
───────────────────────────────────────
- ¿Cuotas bajaron/subieron desde apertura?
- ¿Hay sharp money?
- ¿El público apuesta masivo?

───────────────────────────────────────
1️⃣1️⃣ MODELO DE PROBABILIDAD
───────────────────────────────────────
MÉTODO 1 — Modelo de servicio:
- Hold% y Break% de cada jugador
- Calcular probabilidad de ganar set y partido

MÉTODO 2 — Ponderación:
- Forma reciente superficie (25%)
- H2H superficie (20%)
- Estadísticas servicio (20%)
- Fatiga (15%)
- Matchup estilos (20%)

RESULTADO:
Jugador 1 gana:    X%
Jugador 2 gana:    X%
Va a 3 sets:       X%

───────────────────────────────────────
1️⃣2️⃣ DETECTAR VALUE BET
───────────────────────────────────────
EV = (prob_real × cuota) - 1

| Apuesta | Prob | Cuota | EV | ¿Valor? |
|---------|------|-------|-----|---------|
| J1 gana | % | | | ✅/❌ |
| J2 gana | % | | | ✅/❌ |
| Over | % | | | ✅/❌ |
| Under | % | | | ✅/❌ |

───────────────────────────────────────
1️⃣3️⃣ PREDICCIÓN FINAL
───────────────────────────────────────
- Ganador probable + argumentos
- Marcador más probable
- Apuesta principal
- El "PERO"

───────────────────────────────────────
1️⃣4️⃣ TOP 3 APUESTAS
───────────────────────────────────────
APUESTA 1 → Tipo, Cuota, Prob, EV
APUESTA 2 → Tipo, Cuota, Prob, EV
APUESTA 3 (solo si EV > 0.05)

⛔ Si ninguna EV > 0.05: "NO APOSTAR"

───────────────────────────────────────
1️⃣5️⃣ GESTIÓN DE BANKROLL
───────────────────────────────────────
Bankroll: ${formatCOP(data.bankrollAmount)}

- EV > 0.12 → 5% = ${formatCOP(data.bankrollAmount * 0.05)}
- EV 0.07-0.12 → 3% = ${formatCOP(data.bankrollAmount * 0.03)}
- EV 0.05-0.07 → 1.5% = ${formatCOP(data.bankrollAmount * 0.015)}

───────────────────────────────────────
1️⃣6️⃣ RESUMEN EJECUTIVO
───────────────────────────────────────
╔══════════════════════════════════════════╗
║       MEJOR APUESTA DEL PARTIDO          ║
╠══════════════════════════════════════════╣
║ APUESTA:                                 ║
║ TIPO:                                    ║
║ CUOTA:                                   ║
║ PROBABILIDAD REAL:                       ║
║ EV:                                      ║
║ CONFIANZA: baja / media / alta           ║
║ CATEGORÍA: A / B / C                     ║
║ MONTO:                                   ║
╚══════════════════════════════════════════╝`;
};
