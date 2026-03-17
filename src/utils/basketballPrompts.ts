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

export const generateBasketballPrompt = (data: PromptData): string => {
  return `Actúa como un analista cuantitativo especializado en NBA con acceso a 
estadísticas avanzadas, modelos probabilísticos y análisis de mercado 
profesional. Tu objetivo es encontrar VALUE BETS reales con ventaja 
matemática sobre las casas.
Busca información actualizada en internet ANTES de responder.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATOS DEL PARTIDO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEPORTE:        Baloncesto NBA
TORNEO:         ${data.tournament}
EQUIPO LOCAL:   ${data.homeTeam}
EQUIPO VISITANTE: ${data.awayTeam}
FECHA/HORA:     ${data.formattedDate}
BANKROLL:       ${formatCOP(data.bankrollAmount)}
${data.odds ? `CUOTA QUE VEO: ${data.odds}` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

───────────────────────────────────────
1️⃣ FORMA RECIENTE
───────────────────────────────────────
Para CADA equipo:
- Últimos 5 partidos (rival, resultado, puntos)
- Últimos 10 partidos (record W/L + puntos promedio)
- Racha actual (victorias o derrotas consecutivas)
- ATS record últimos 10
- Over/Under record últimos 10
- Rendimiento como LOCAL vs VISITANTE
- Puntos en 1ra mitad vs 2da mitad promedio

───────────────────────────────────────
2️⃣ ESTADÍSTICAS AVANZADAS (Season Stats)
───────────────────────────────────────
RATINGS:
- Offensive Rating (OffRtg)
- Defensive Rating (DefRtg)
- Net Rating (NetRtg)
- Pace: posesiones por 48 minutos
- Ranking NBA (1-30)

EFICIENCIA:
- True Shooting % (TS%)
- Effective FG% (eFG%)
- Turnover % (TO%)
- Offensive Rebound % (ORB%)
- Free Throw Rate (FTr)

PROYECCIÓN DE PUNTOS:
((OffRtg local + OffRtg visitante) / 2) × (Pace / 100) × 2

───────────────────────────────────────
3️⃣ EFICIENCIA OFENSIVA DETALLADA
───────────────────────────────────────
- Puntos por partido (PPG)
- FG%, 3P%, FT%
- 3 Point Attempt Rate
- Puntos en la pintura
- Puntos de transición
- Asistencias + Ratio AST/TO

───────────────────────────────────────
4️⃣ ESTADÍSTICAS DEFENSIVAS
───────────────────────────────────────
- Puntos concedidos por partido
- Defensive Rating ranking
- Oponentes FG% / 3P%
- Rebotes defensivos, Robos, Tapones

───────────────────────────────────────
5️⃣ REBOTES Y POSESIONES EXTRA
───────────────────────────────────────
- Rebotes ofensivos/defensivos
- Puntos de segunda oportunidad
- ¿Quién domina el cristal?

───────────────────────────────────────
6️⃣ ENFRENTAMIENTOS DIRECTOS H2H
───────────────────────────────────────
- Últimos 5 encuentros
- ATS record en H2H
- Puntos promedio en H2H

───────────────────────────────────────
7️⃣ LOCALÍA Y VISITA
───────────────────────────────────────
EQUIPO LOCAL en casa:
- Record en casa (V/D)
- ATS record casa
- Puntos anotados/recibidos casa

EQUIPO VISITANTE fuera:
- Record fuera (V/D)
- ATS record fuera

───────────────────────────────────────
8️⃣ FATIGA Y CALENDARIO
───────────────────────────────────────
- ¿Es BACK-TO-BACK?
- Partidos últimos 7 días
- Minutos promedio jugadores clave

───────────────────────────────────────
9️⃣ LESIONES Y ROTACIONES
───────────────────────────────────────
- Injury report oficial HOY
- Jugadores Out/Doubtful/Questionable
- Impacto en el equipo

───────────────────────────────────────
🔟 ESTILO DE JUEGO Y MATCHUP
───────────────────────────────────────
- Pick and roll / isolations / motion
- ¿Equipo de triples o pintura?
- Pace: alto (>100) o lento (<97)
- Fortaleza del banco

───────────────────────────────────────
1️⃣1️⃣ ANÁLISIS DE CUOTAS DE MERCADO
───────────────────────────────────────
MONEYLINE:
- Local: [cuota] → prob implícita: %
- Visitante: [cuota] → prob implícita: %

SPREAD:
- Local -X.5: [cuota]
- Visitante +X.5: [cuota]

OVER/UNDER:
- Over 215.5, 220.5, 225.5
- Under [línea]

───────────────────────────────────────
1️⃣2️⃣ MOVIMIENTO DE MERCADO
───────────────────────────────────────
- ¿Línea del spread se movió?
- ¿Over/Under subió/bajó?
- ¿Hay sharp money?
- ¿El público apuesta masivo por el favorito?

───────────────────────────────────────
1️⃣3️⃣ MODELO DE PROBABILIDAD REAL
───────────────────────────────────────
MÉTODO 1 — Proyección de puntos:
Total = ((OffRtg_L + OffRtg_V) / 200) × Pace × 2
Diferencial = NetRtg_L - NetRtg_V + ventaja_local(3pts)

MÉTODO 2 — Ponderación:
- Forma reciente 10 partidos (25%)
- Net Rating diferencial (25%)
- H2H (15%)
- Lesiones (20%)
- Local/Visitante + Fatiga (15%)

RESULTADO:
Victoria Local:     X%
Victoria Visitante: X%
Total proyectado:  XXX puntos

───────────────────────────────────────
1️⃣4️⃣ DETECTAR VALUE BET
───────────────────────────────────────
EV = (prob_real × cuota) - 1

| Apuesta | Prob | Cuota | EV | ¿Valor? |
|---------|------|-------|-----|---------|
| Local ML | % | | | ✅/❌ |
| Visitante ML | % | | | ✅/❌ |
| Over total | % | | | ✅/❌ |
| Under total | % | | | ✅/❌ |

───────────────────────────────────────
1️⃣5️⃣ PREDICCIÓN FINAL
───────────────────────────────────────
- Ganador probable + argumentos
- Marcador estimado
- Total proyectado
- Apuesta principal
- El "PERO": factor que tumbaría

───────────────────────────────────────
1️⃣6️⃣ TOP 3 APUESTAS CON VALOR
───────────────────────────────────────
APUESTA 1 — [nombre]
→ Tipo, Cuota, Prob, EV, Argumento

APUESTA 2 — [nombre]
→ Tipo, Cuota, Prob, EV, Argumento

APUESTA 3 — (solo si EV > 0.05)

⛔ Si ninguna EV > 0.05: "NO APOSTAR"

───────────────────────────────────────
1️⃣7️⃣ GESTIÓN DE BANKROLL
───────────────────────────────────────
Bankroll: ${formatCOP(data.bankrollAmount)}

CATEGORÍA A — EV > 0.12 → 5% = ${formatCOP(data.bankrollAmount * 0.05)}
CATEGORÍA B — EV 0.07-0.12 → 3% = ${formatCOP(data.bankrollAmount * 0.03)}
CATEGORÍA C — EV 0.05-0.07 → 1.5% = ${formatCOP(data.bankrollAmount * 0.015)}

───────────────────────────────────────
1️⃣8️⃣ RESUMEN EJECUTIVO FINAL
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
