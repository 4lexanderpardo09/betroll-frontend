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
4️⃣ ENFRENTAMIENTOS DIRECTOS H2H
───────────────────────────────────────
- Últimos 5 enfrentamientos
- % victorias de cada equipo
- Promedio de goles en H2H
- % Over 2.5 en H2H
- % BTTS en H2H

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
8️⃣ ANÁLISIS DE CUOTAS
───────────────────────────────────────
MERCADO 1X2:
- Local: [cuota] → prob implícita: %
- Empate: [cuota] → prob implícita: %
- Visitante: [cuota] → prob implícita: %

MERCADO GOLES:
- Over 1.5, 2.5, 3.5
- Under 2.5

MERCADO BTTS:
- BTTS Sí / No

───────────────────────────────────────
9️⃣ MOVIMIENTO DE MERCADO
───────────────────────────────────────
- ¿Cuotas del favorito bajaron?
- ¿Hay sharp money?
- ¿El público apuesta masivo por un lado?

───────────────────────────────────────
🔟 MODELO DE PROBABILIDAD
───────────────────────────────────────
Método 1 — Modelo de Poisson basado en xG:
- xG esperado Local
- xG esperado Visitante

Método 2 — Ponderación de factores:
- Forma reciente (25%)
- H2H (20%)
- Rendimiento local/visitante (25%)
- xG diferencial (20%)
- Lesiones (10%)

RESULTADO:
Victoria Local:    X%
Empate:           X%
Victoria Visitante:X%
Over 2.5:         X%
BTTS Sí:          X%

───────────────────────────────────────
1️⃣1️⃣ DETECTAR VALUE BET
───────────────────────────────────────
EV = (probabilidad_real × cuota) - 1

| Apuesta | Prob. Real | Cuota | Prob. Implícita | EV | ¿Valor? |
|---------|-----------|-------|----------------|-----|---------|

EV > 0.05 → valor
EV < 0 → NO apostar

───────────────────────────────────────
1️⃣2️⃣ PREDICCIÓN FINAL
───────────────────────────────────────
- Ganador probable + argumentos
- Marcador más probable
- Apuesta principal
- Riesgo principal

───────────────────────────────────────
1️⃣3️⃣ TOP 3 APUESTAS
───────────────────────────────────────
Máximo 3 apuestas por confianza.

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
