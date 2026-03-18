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

export const generateSoccerPrompt = (data: PromptData): string => {
  return `Actúa como un analista cuantitativo de apuestas deportivas con acceso a datos 
estadísticos avanzados, modelos probabilísticos y análisis de mercado profesional.
Tu objetivo es encontrar VALUE BETS reales con ventaja matemática sobre las casas.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATOS DEL PARTIDO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PARTIDO:     ${data.homeTeam} vs ${data.awayTeam}
LIGA:        ${data.tournament}
DEPORTE:     ${data.sportLabel}
FECHA/HORA:  ${data.formattedDate}
BANKROLL:    ${formatCOP(data.bankrollAmount)}
${data.odds ? `CUOTA QUE VEO: ${data.odds}` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Busca en internet información actualizada de HOY y realiza el análisis completo:

───────────────────────────────────────
1️⃣ FORMA RECIENTE
───────────────────────────────────────
Para CADA equipo:
- Resultados últimos 5 partidos (con marcador exacto)
- Resultados últimos 10 partidos
- Promedio de goles anotados (total, en casa, fuera)
- Promedio de goles recibidos (total, en casa, fuera)
- Racha actual (victorias / empates / derrotas consecutivas)
- % Over 2.5 últimas 10 jornadas
- % BTTS últimas 10 jornadas

───────────────────────────────────────
2️⃣ RENDIMIENTO LOCAL vs VISITANTE
───────────────────────────────────────
Equipo LOCAL en casa:
- Record exacto (V/E/D)
- Goles marcados/recibidos en casa
- xG en casa / xGA en casa

Equipo VISITANTE fuera:
- Record exacto (V/E/D)
- Goles marcados/recibidos fuera
- xG fuera / xGA fuera

───────────────────────────────────────
3️⃣ ESTADÍSTICAS AVANZADAS
───────────────────────────────────────
- xG por partido
- xGA por partido
- Diferencial xG (xG - xGA)
- Posesión promedio %
- Tiros por partido
- Corners por partido
- Eficiencia ofensiva: goles / xG
- Eficiencia defensiva: goles recibidos / xGA

───────────────────────────────────────
3️⃣B ESTADÍSTICAS DE CORNERS Y TARJETAS
───────────────────────────────────────

CORNERS:
- Promedio corners por partido (Local y Visitante por separado)
- Promedio corners a favor últimas 10 jornadas
- Promedio corners en contra últimas 10 jornadas
- % Over 8.5 corners últimas 10 jornadas
- % Over 9.5 corners últimas 10 jornadas
- % Over 10.5 corners últimas 10 jornadas
- Corners en casa (Local) vs corners fuera (Visitante)

TARJETAS:
- Promedio tarjetas amarillas por partido (cada equipo)
- Árbitro designado: historial de tarjetas por partido
- % Over 3.5 tarjetas amarillas últimas 10 jornadas
- % Over 4.5 tarjetas amarillas últimas 10 jornadas
- Equipos con más faltas por partido

TIROS Y REMATES:
- Tiros totales por partido
- Tiros al arco (on target) por partido
- % de conversión de corners en goles
- Goles de cabeza por partido

───────────────────────────────────────
4️⃣ ENFRENTAMIENTOS DIRECTOS H2H
───────────────────────────────────────
- Últimos 5 enfrentamientos (con marcador exacto)
- % victorias de cada equipo
- Promedio de goles en H2H
- % Over 2.5 en H2H
- % BTTS en H2H
- Promedio de corners en H2H
- % Over 9.5 corners en H2H
- Promedio de tarjetas en H2H

───────────────────────────────────────
5️⃣ ESTILO DE JUEGO Y TÁCTICA
───────────────────────────────────────
- Sistema táctico habitual
- ¿Equipo de posesión o contraataque?
- ¿Presión alta o bloque bajo?
- Velocidad de transición

───────────────────────────────────────
6️⃣ LESIONES Y BAJAS
───────────────────────────────────────
- Jugadores baja confirmados
- Impacto en el equipo

───────────────────────────────────────
7️⃣ MOTIVACIÓN Y CONTEXTO
───────────────────────────────────────
- Posición en la tabla
- ¿Partido de trámite o alta exigencia?
- Días de descanso
- Presión del estadio

───────────────────────────────────────
8️⃣ ANÁLISIS DE CUOTAS (TODOS LOS MERCADOS)
───────────────────────────────────────

MERCADO 1X2:
- Local: [cuota] → prob implícita: %
- Empate: [cuota] → prob implícita: %
- Visitante: [cuota] → prob implícita: %

MERCADO GOLES TOTALES:
- Over 1.5 / Under 1.5
- Over 2.5 / Under 2.5
- Over 3.5 / Under 3.5
- Over 4.5 / Under 4.5

MERCADO BTTS (AMBOS ANOTAN):
- BTTS Sí / No

MERCADO GOLES POR EQUIPO:
- Over/Under 0.5 goles Local
- Over/Under 1.5 goles Local
- Over/Under 0.5 goles Visitante
- Over/Under 1.5 goles Visitante

MERCADO CORNERS:
- Total corners Over/Under 8.5
- Total corners Over/Under 9.5
- Total corners Over/Under 10.5
- Corners Local Over/Under 4.5
- Corners Visitante Over/Under 4.5
- Equipo con más corners (1X2 corners)
- Primer corner del partido

MERCADO TARJETAS:
- Total tarjetas amarillas Over/Under 3.5
- Total tarjetas amarillas Over/Under 4.5
- Primer equipo en recibir tarjeta

MERCADO POR TIEMPOS:
- Ganador 1er tiempo (1X2 HT)
- Ganador 2do tiempo (1X2 ST)
- Over 0.5 goles en 1er tiempo
- Over 1.5 goles en 1er tiempo
- Ambos tiempos con goles

MERCADO ASIÁTICO:
- Handicap asiático -1 Local
- Handicap asiático -0.5 Local
- Handicap asiático +0.5 Visitante
- Handicap asiático +1 Visitante
- Goles asiáticos Over/Under (línea exacta del mercado)

MERCADO JUGADOR (si hay datos disponibles):
- Primer goleador
- Anytime scorer (jugador anota en cualquier momento)

───────────────────────────────────────
9️⃣ MOVIMIENTO DE MERCADO
───────────────────────────────────────
- ¿Cuotas del favorito bajaron?
- ¿Hay sharp money?
- ¿El público apuesta masivo por un lado?
- ¿Movimiento inusual en corners o tarjetas?

───────────────────────────────────────
🔟 MODELO DE PROBABILIDAD
───────────────────────────────────────
Método 1 — Modelo de Poisson basado en xG:
- xG esperado Local
- xG esperado Visitante
- Distribución de goles esperados

Método 2 — Ponderación de factores:
- Forma reciente (25%)
- H2H (20%)
- Rendimiento local/visitante (25%)
- xG diferencial (20%)
- Lesiones (10%)

PROBABILIDADES CALCULADAS COMPLETAS:
- Victoria Local:             X%
- Empate:                     X%
- Victoria Visitante:         X%
- Over 1.5 goles:             X%
- Over 2.5 goles:             X%
- Over 3.5 goles:             X%
- BTTS Sí:                    X%
- Over 8.5 corners:           X%
- Over 9.5 corners:           X%
- Over 10.5 corners:          X%
- Over 3.5 tarjetas:          X%
- Over 4.5 tarjetas:          X%
- Gana 1er tiempo Local:      X%
- Empate 1er tiempo:          X%
- Over 0.5 goles HT:          X%

───────────────────────────────────────
1️⃣1️⃣ DETECTAR VALUE BET
───────────────────────────────────────
EV = (probabilidad_real × cuota) - 1

Evalúa EV para TODOS los mercados disponibles:

| Apuesta                    | Prob. Real | Cuota | Prob. Implícita | EV | ¿Valor? |
|----------------------------|------------|-------|-----------------|----|---------|
| Victoria Local             |            |       |                 |    |         |
| Empate                     |            |       |                 |    |         |
| Victoria Visitante         |            |       |                 |    |         |
| Over 2.5 goles             |            |       |                 |    |         |
| Under 2.5 goles            |            |       |                 |    |         |
| Over 3.5 goles             |            |       |                 |    |         |
| BTTS Sí                    |            |       |                 |    |         |
| BTTS No                    |            |       |                 |    |         |
| Over 8.5 corners           |            |       |                 |    |         |
| Over 9.5 corners           |            |       |                 |    |         |
| Under 9.5 corners          |            |       |                 |    |         |
| Over 3.5 tarjetas          |            |       |                 |    |         |
| Over 4.5 tarjetas          |            |       |                 |    |         |
| Handicap -1 Local          |            |       |                 |    |         |
| Handicap +1 Visitante      |            |       |                 |    |         |
| Over 0.5 goles HT          |            |       |                 |    |         |
| Gana 1er tiempo Local      |            |       |                 |    |         |

EV > 0.05 → valor ✅
EV < 0 → NO apostar ❌

───────────────────────────────────────
1️⃣2️⃣ PREDICCIÓN FINAL
───────────────────────────────────────
- Ganador probable + argumentos
- Marcador más probable
- Total de goles esperado
- Total de corners esperado
- Apuesta principal
- Riesgo principal

───────────────────────────────────────
1️⃣3️⃣ TOP 3 APUESTAS
───────────────────────────────────────
Máximo 3 apuestas ordenadas por confianza (EV más alto primero).
Pueden ser de cualquier mercado: resultado, goles, corners, tarjetas, tiempos, handicap.

⛔ Si ninguna tiene EV > 0.05:
"NO SE RECOMIENDA APOSTAR"

───────────────────────────────────────
1️⃣4️⃣ GESTIÓN DE BANKROLL
───────────────────────────────────────
Bankroll: ${formatCOP(data.bankrollAmount)}

CATEGORÍA A — EV > 0.12 → 5% = ${formatCOP(data.bankrollAmount * 0.05)}
CATEGORÍA B — EV 0.07-0.12 → 3% = ${formatCOP(data.bankrollAmount * 0.03)}
CATEGORÍA C — EV 0.05-0.07 → 1.5% = ${formatCOP(data.bankrollAmount * 0.015)}

───────────────────────────────────────
1️⃣5️⃣ RESUMEN EJECUTIVO
───────────────────────────────────────
╔═══════════════════════════════════════╗
║        MEJOR APUESTA DEL PARTIDO      ║
╠═══════════════════════════════════════╣
║ APUESTA:                              ║
║ TIPO:                                 ║
║ CUOTA:                                ║
║ PROBABILIDAD REAL:                    ║
║ EV:                                   ║
║ CONFIANZA:                            ║
║ CATEGORÍA: A / B / C                  ║
║ MONTO:                                ║
╚═══════════════════════════════════════╝`;
};