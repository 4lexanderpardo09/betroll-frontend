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
- Resultados últimos 15 partidos (con marcador exacto)
- Record W/E/D en esos 15 partidos
- Promedio de goles anotados (total, en casa, fuera)
- Promedio de goles recibidos (total, en casa, fuera)
- Racha actual (victorias / empates / derrotas consecutivas)
- % Over 2.5 últimas 15 jornadas
- % BTTS últimas 15 jornadas
- % Over 9.5 corners últimas 15 jornadas
- Diferencial de goles promedio (últimas 15)

───────────────────────────────────────
2️⃣ RENDIMIENTO LOCAL vs VISITANTE
───────────────────────────────────────
Equipo LOCAL en casa (últimas 15 en casa):
- Record exacto (V/E/D)
- Goles marcados/recibidos en casa
- xG en casa / xGA en casa
- % Over 2.5 en casa
- % BTTS en casa

Equipo VISITANTE fuera (últimas 15 fuera):
- Record exacto (V/E/D)
- Goles marcados/recibidos fuera
- xG fuera / xGA fuera
- % Over 2.5 fuera
- % BTTS fuera

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

CORNERS (últimas 15 jornadas):
- Promedio corners por partido (Local y Visitante por separado)
- Promedio corners a favor últimas 15 jornadas
- Promedio corners en contra últimas 15 jornadas
- % Over 8.5 corners últimas 15 jornadas
- % Over 9.5 corners últimas 15 jornadas
- % Over 10.5 corners últimas 15 jornadas
- Corners en casa (Local) vs corners fuera (Visitante)

TARJETAS (últimas 15 jornadas):
- Promedio tarjetas amarillas por partido (cada equipo)
- Árbitro designado: historial de tarjetas por partido (últimas 15 con este árbitro)
- % Over 3.5 tarjetas amarillas últimas 15 jornadas
- % Over 4.5 tarjetas amarillas últimas 15 jornadas
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
- Vulnerabilidades defensivas que puede explotar el rival

───────────────────────────────────────
6️⃣ LESIONES Y BAJAS
───────────────────────────────────────
- Jugadores baja confirmados + impacto (1-10)
- DOUBTFUL / QUESTIONABLE + impacto (1-10)
- Impacto total en el equipo: ALTO / MEDIO / BAJO
- ¿Quién lo reemplaza? ¿Cambia el sistema?
- PIPM o importancia estadística del lesionado

───────────────────────────────────────
7️⃣ MOTIVACIÓN Y CONTEXTO
───────────────────────────────────────
- Posición en la tabla
- ¿Partido de trámite o alta exigencia?
- Días de descanso (cada equipo)
- ¿Es back-to-back o partido entre semana?
- Presión del estadio / localía
- Incentivos: descenso, Champions, título, Copa

───────────────────────────────────────
8️⃣ ANÁLISIS DE CUOTAS (TODOS LOS MERCADOS)
───────────────────────────────────────

⚠️ REGLA DE CUOTAS OBLIGATORIA:
Antes de calcular cualquier EV, verificar que la cuota usada
sea el CONSENSO de mercado, no un outlier.

PROCESO OBLIGATORIO:
1. Buscar la cuota en MÍNIMO 3 casas distintas
2. Si una cuota difiere >30% del resto → es outlier, NO usarla
   para el cálculo base de EV
3. Usar siempre la cuota MÁS CONSERVADORA del rango para EV base
4. Si con cuota conservadora EV > 0.05 → apostar en la casa
   que ofrezca la mayor cuota (mayor EV final)
5. Si EV solo es positivo con la cuota outlier → NO APOSTAR
6. Reportar explícitamente:
   "Rango de mercado: X.XX a X.XX | Cuota usada (conservadora): X.XX
    | Casa recomendada: [nombre] | Outlier detectado: SÍ/NO"

MERCADO 1X2:
- Local:     [cuota] → prob implícita: % | Rango: X.XX — X.XX
- Empate:    [cuota] → prob implícita: % | Rango: X.XX — X.XX
- Visitante: [cuota] → prob implícita: % | Rango: X.XX — X.XX
- Margen de la casa (vig): %

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
- Línea de apertura vs línea actual (1X2 y handicap)
- Over/Under goles: apertura vs actual (¿subió o bajó?)
- ¿Cuotas del favorito bajaron significativamente?
- ¿Hay sharp money en algún mercado?
- ¿El público apuesta masivo por un lado?
- ¿Movimiento inusual en corners o tarjetas?
- ¿Hubo steam move o reverse line movement?

───────────────────────────────────────
🔟 MODELO DE PROBABILIDAD REAL
───────────────────────────────────────

⚠️ CHECKLIST DE CALIBRACIÓN DE PROBABILIDAD (OBLIGATORIO):
Antes de fijar la prob real de cada resultado, aplicar
estos 5 ajustes en orden:

AJUSTE 1 — Localía reforzada:
  Si el local tiene record en casa > .600 (más de 6 victorias
  cada 10 en casa) → sumar +3% a su prob base de victoria

AJUSTE 2 — Lesión clave del FAVORITO:
  Si el mejor jugador (o el portero titular) está OUT
  → restar 5–8% (no más) si el equipo tiene sustituto adecuado
  → restar hasta 10% si no hay reemplazo de nivel similar

AJUSTE 3 — Lesiones del VISITANTE:
  Si el visitante tiene 2+ jugadores clave OUT
  → restar 5–8% de su prob base

AJUSTE 4 — Momentum reciente (últimas 15 jornadas):
  Si un equipo lleva 5+ derrotas en últimas 8 → restar 3%
  Si un equipo lleva 6+ victorias en últimas 8 → sumar 3%

AJUSTE 5 — Sanity check final OBLIGATORIO:
  Comparar prob calculada vs consenso de mercado
  (cuota implícita Pinnacle / Betfair Exchange).
  Si difiere >10 puntos porcentuales → revisar modelo.
  Reportar: "Prob modelo: X% | Prob mercado implícita: Y%
  | Diferencia: Z% | [ACEPTABLE / REVISAR]"

MÉTODO 1 — Modelo de Poisson basado en xG:
- xG esperado Local
- xG esperado Visitante
- Distribución de goles esperados (0, 1, 2, 3+ goles)
- Probabilidades resultantes por marcador exacto

MÉTODO 2 — Ponderación de factores:
- Forma reciente últimas 15 jornadas   → 25%
- H2H histórico                        → 20%
- Rendimiento local/visitante          → 25%
- xG diferencial                       → 20%
- Lesiones y motivación                → 10%

PROBABILIDADES CALCULADAS COMPLETAS:
- Victoria Local:             X% | Sanity check: X% dif.
- Empate:                     X%
- Victoria Visitante:         X% | Sanity check: X% dif.
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
- Over 1.5 goles HT:          X%

───────────────────────────────────────
1️⃣1️⃣ DETECTAR VALUE BETS
───────────────────────────────────────
EV = (probabilidad_real × cuota) - 1

⚠️ FILTRO DOBLE OBLIGATORIO — EV + PROBABILIDAD:
Una apuesta solo es VÁLIDA si cumple AMBOS filtros simultáneamente.

FILTRO A — EV MÍNIMO POR TIPO:
  - 1X2 (resultado):         EV > +0.05
  - Handicap asiático:       EV > +0.05
  - Goles O/U (2.5 / 3.5):  EV > +0.05
  - BTTS:                    EV > +0.05
  - Corners O/U:             EV > +0.07
  - Tarjetas O/U:            EV > +0.07
  - Mercados HT (1er tiempo):EV > +0.07
  - Jugador anota / 1er gol: EV > +0.10

FILTRO B — PROBABILIDAD MÍNIMA POR TIPO:
  - Victoria favorito:       prob ≥ 55%
  - Victoria visitante:      prob ≥ 40%
  - Empate:                  prob ≥ 30%
  - Over/Under goles:        prob ≥ 55%
  - BTTS:                    prob ≥ 55%
  - Handicap asiático:       prob ≥ 55%
  - Corners O/U:             prob ≥ 58%
  - Tarjetas O/U:            prob ≥ 58%
  - Mercados HT:             prob ≥ 55%
  - Jugador anota:           prob ≥ 60%

RESULTADO POR APUESTA:
  ✅ Cumple A y B     → APOSTAR (categoría según EV)
  ⚠️ Cumple solo A   → ALTO RIESGO → reducir stake 50%
  ⚠️ Cumple solo B   → MAL PRECIO → NO APOSTAR
  ❌ No cumple ninguno → DESCARTAR

Reportar siempre:
"Filtro A (EV): PASA/FALLA | Filtro B (Prob): PASA/FALLA
→ Veredicto: APTA / ALTO RIESGO / MAL PRECIO / DESCARTADA"

| Apuesta                    | Prob. Real | Filtro B | Cuota | EV | Filtro A | Veredicto |
|----------------------------|------------|----------|-------|----|----------|-----------|
| Victoria Local             |            | ✅/❌    |       |    | ✅/❌    | APTA/DESC |
| Empate                     |            | ✅/❌    |       |    | ✅/❌    | APTA/DESC |
| Victoria Visitante         |            | ✅/❌    |       |    | ✅/❌    | APTA/DESC |
| Over 2.5 goles             |            | ✅/❌    |       |    | ✅/❌    | APTA/DESC |
| Under 2.5 goles            |            | ✅/❌    |       |    | ✅/❌    | APTA/DESC |
| Over 3.5 goles             |            | ✅/❌    |       |    | ✅/❌    | APTA/DESC |
| BTTS Sí                    |            | ✅/❌    |       |    | ✅/❌    | APTA/DESC |
| BTTS No                    |            | ✅/❌    |       |    | ✅/❌    | APTA/DESC |
| Over 8.5 corners           |            | ✅/❌    |       |    | ✅/❌    | APTA/DESC |
| Over 9.5 corners           |            | ✅/❌    |       |    | ✅/❌    | APTA/DESC |
| Under 9.5 corners          |            | ✅/❌    |       |    | ✅/❌    | APTA/DESC |
| Over 3.5 tarjetas          |            | ✅/❌    |       |    | ✅/❌    | APTA/DESC |
| Over 4.5 tarjetas          |            | ✅/❌    |       |    | ✅/❌    | APTA/DESC |
| Handicap -1 Local          |            | ✅/❌    |       |    | ✅/❌    | APTA/DESC |
| Handicap +1 Visitante      |            | ✅/❌    |       |    | ✅/❌    | APTA/DESC |
| Over 0.5 goles HT          |            | ✅/❌    |       |    | ✅/❌    | APTA/DESC |
| Gana 1er tiempo Local      |            | ✅/❌    |       |    | ✅/❌    | APTA/DESC |

───────────────────────────────────────
⚠️ FILTROS ANTI-ERROR OBLIGATORIOS (aplicar ANTES de confirmar cualquier apuesta)
───────────────────────────────────────

FILTRO 1 — PROXIMIDAD DE LÍNEA EN TOTALES DE GOLES (SOLO PARA O/U GOLES)
⚠️ ESTE FILTRO APLICA ÚNICAMENTE A MERCADOS DE TOTAL DE GOLES (OVER/UNDER).
   NUNCA A RESULTADO 1X2, HANDICAP ASIÁTICO NI BTTS.

  → Calcular: |goles_proyectados - linea_OU|
  → Si la diferencia es < 0.4 goles → NO APOSTAR bajo ninguna circunstancia
  → Si la diferencia es < 0.6 goles → REDUCIR stake al 50%
  → Si la diferencia es ≥ 0.6 goles → APTA
  → Reportar: "Proximidad O/U: X.XX goles — [APTA / REDUCIR 50% / BLOQUEADA]"

  Para HANDICAP ASIÁTICO — usar filtro de EDGE:
  → Edge = |diferencial_goles_proyectado - linea_handicap|
  → Si edge < 0.3 goles → NO APOSTAR (insuficiente)
  → Si edge 0.3–0.6 goles → APTA con stake categoría C
  → Si edge > 0.6 goles → APTA con stake completo según categoría EV
  → Reportar: "Edge handicap: X.XX goles — [INSUFICIENTE / APTA-C / APTA]"

  Para CORNERS y TARJETAS O/U:
  → Calcular: |corners_proyectados - linea_OU_corners|
  → Si la diferencia es < 0.8 corners → NO APOSTAR
  → Si la diferencia es < 1.5 corners → REDUCIR stake al 50%
  → Si la diferencia es ≥ 1.5 corners → APTA
  → Reportar: "Proximidad corners: X.X — [APTA / REDUCIR 50% / BLOQUEADA]"

  Para RESULTADO 1X2 y BTTS:
  → No aplica filtro de proximidad.
    El control es exclusivamente vía EV y Filtro Doble A+B.

FILTRO 2 — CORRELACIÓN ENTRE APUESTAS DEL MISMO PARTIDO
  Correlaciones NEGATIVAS (incompatibles — nunca recomendar juntas):
  - Under goles + BTTS Sí
  - Over goles + ambos equipos sin anotar (BTTS No)
  - Victoria favorito por amplio margen (HC -1.5) + Over goles totales
  - Primer tiempo sin goles (Under 0.5 HT) + Over 2.5 goles totales
  - Under corners + equipo de posesión alta (>55%) con mucho ataque

  Correlaciones POSITIVAS (compatibles):
  - Over goles + BTTS Sí
  - Under goles + BTTS No
  - Victoria local amplia + Over corners (el perdedor busca el gol)
  - Over tarjetas + partido de alta tensión / rivalidad / motivación alta
  - Handicap asiático local -1 + Over 2.5 goles
  - Over 1er tiempo + equipo con buen inicio histórico (>60% Over HT)

  TABLA DE CORRELACIÓN RESULTADO + PROPS (OBLIGATORIA):
  | Situación                              | Correlación    | Acción             |
  |----------------------------------------|----------------|--------------------|
  | Victoria fav amplia + Over goles       | POSITIVA ✅    | Apta combinación   |
  | Victoria fav amplia + Under goles      | NEGATIVA ❌    | Eliminar una       |
  | Over goles + BTTS Sí                   | POSITIVA ✅    | Apta combinación   |
  | Under goles + BTTS No                  | POSITIVA ✅    | Apta combinación   |
  | Under goles + BTTS Sí                  | NEGATIVA ❌    | Eliminar una       |
  | Over goles + BTTS No                   | NEGATIVA ❌    | Eliminar una       |
  | Over corners + Over goles              | Leve pos ✅    | Apta combinación   |
  | Under goles + Over corners             | Leve neg ⚠️    | Reducir stake 50%  |
  | Over tarjetas + partido tenso/derbi    | POSITIVA ✅    | Apta combinación   |
  | HC local -1 + Over 2.5 goles           | POSITIVA ✅    | Apta combinación   |

  → Para correlación "Leve negativa ⚠️": reducir stake de una apuesta al 50%.
  → Para correlación NEGATIVA ❌: eliminar la apuesta de MENOR EV ajustado.

  → Para cada par de apuestas a recomendar, declarar:
    "Correlación: POSITIVA / NEGATIVA / LEVE NEG / NEUTRA
    → [apta / reducir stake 50% / incompatible]"

───────────────────────────────────────
1️⃣2️⃣ PREDICCIÓN FINAL
───────────────────────────────────────
- Ganador probable + top 3 argumentos
- Marcador más probable
- Total de goles esperado
- Total de corners esperado
- Apuesta principal del partido
- Segunda apuesta si hay valor (con correlación validada)
- El "PERO": factor que tumbaría el análisis
- Nivel de certeza del modelo: ALTO / MEDIO / BAJO

───────────────────────────────────────
1️⃣3️⃣ TOP APUESTAS CON VALOR (EV > 0.05 + Prob mínima cumplida)
───────────────────────────────────────
Máximo 3 apuestas ordenadas por EV. Pueden ser de cualquier mercado.

APUESTA 1 — [nombre detallado]
→ Tipo: 1X2 / Goles / BTTS / Corners / Tarjetas / HT / Handicap / Jugador
→ Mercado: [descripción exacta]
→ Cuota usada: [decimal] | Rango mercado: [mín — máx] | Outlier: SÍ/NO
→ Prob Real: % | Sanity check vs mercado: X% dif. — [ACEPTABLE / REVISAR]
→ EV: +X.XX
→ Categoría: A / B / C
→ Filtro A (EV):    PASA / FALLA
→ Filtro B (Prob):  PASA / FALLA
→ Proximidad/Edge:  X.XX — [APTA / REDUCIR 50% / BLOQUEADA / INSUFICIENTE]
→ Correlación con otras apuestas: POSITIVA / NEGATIVA / LEVE NEG / NEUTRA
→ Argumento principal (2-3 líneas)

APUESTA 2 — [nombre detallado]
→ Tipo / Mercado / Cuota / Rango mercado / Outlier
→ Prob Real / Sanity check / EV / Categoría
→ Filtro A (EV): PASA/FALLA | Filtro B (Prob): PASA/FALLA
→ Proximidad/Edge: X.XX — [estado]
→ Correlación con Apuesta 1: POSITIVA / NEGATIVA / LEVE NEG / NEUTRA
→ Argumento

APUESTA 3 — [nombre detallado] (solo si cumple Filtro A Y Filtro B)
→ Tipo / Mercado / Cuota / Rango mercado / Outlier
→ Prob Real / Sanity check / EV / Categoría
→ Filtro A (EV): PASA/FALLA | Filtro B (Prob): PASA/FALLA
→ Proximidad/Edge: X.XX — [estado]
→ Correlación con Apuestas 1 y 2: POSITIVA / NEGATIVA / LEVE NEG / NEUTRA
→ Argumento

⛔ Si ninguna apuesta cumple Filtro A + Filtro B: "NO HAY VALUE HOY — NO APOSTAR"

───────────────────────────────────────
1️⃣4️⃣ GESTIÓN DE BANKROLL
───────────────────────────────────────
Bankroll: ${formatCOP(data.bankrollAmount)}

CATEGORÍA A — EV > 0.12    → 5%   = ${formatCOP(data.bankrollAmount * 0.05)}
CATEGORÍA B — EV 0.07-0.12 → 3%   = ${formatCOP(data.bankrollAmount * 0.03)}
CATEGORÍA C — EV 0.05-0.07 → 1.5% = ${formatCOP(data.bankrollAmount * 0.015)}

REGLA: No superar 10% del bankroll en total por partido.
REGLA: Máximo 3 apuestas simultáneas en el mismo partido.
REGLA: Visitante underdog → máximo 2–3% del bankroll independientemente de la categoría.
REGLA: Si el filtro de proximidad activa "REDUCIR 50%", aplicar ese recorte
       al monto calculado por categoría antes de apostar.
REGLA: Si dos apuestas tienen correlación NEGATIVA, conservar solo la de
       mayor EV ajustado y descartar la otra.
REGLA: Si correlación es LEVE NEGATIVA, reducir stake de una apuesta al 50%
       del monto calculado por categoría.
REGLA: Si una apuesta cumple solo Filtro A (no Filtro B) → reducir stake 50%.
REGLA: Si una apuesta cumple solo Filtro B (no Filtro A) → NO APOSTAR.

───────────────────────────────────────
1️⃣5️⃣ RESUMEN EJECUTIVO
───────────────────────────────────────
╔═══════════════════════════════════════════╗
║        MEJOR APUESTA DEL PARTIDO          ║
╠═══════════════════════════════════════════╣
║ APUESTA:                                  ║
║ TIPO:                                     ║
║ MERCADO EXACTO:                           ║
║ CUOTA:                                    ║
║ RANGO MERCADO:  mín X.XX — máx X.XX       ║
║ OUTLIER:        SÍ / NO                   ║
║ PROBABILIDAD REAL:                        ║
║ SANITY CHECK:   X% dif. — ACEPT./REV.     ║
║ EV:                                       ║
║ FILTRO A (EV):  PASA / FALLA              ║
║ FILTRO B (Prob):PASA / FALLA              ║
║ PROXIMIDAD:     X.XX — [estado]           ║
║ CONFIANZA:      baja / media / alta       ║
║ CATEGORÍA:      A / B / C                 ║
║ MONTO:                                    ║
╠═══════════════════════════════════════════╣
║        SEGUNDA APUESTA (si hay valor)     ║
╠═══════════════════════════════════════════╣
║ APUESTA:                                  ║
║ TIPO:                                     ║
║ CUOTA:                                    ║
║ RANGO MERCADO:  mín X.XX — máx X.XX       ║
║ OUTLIER:        SÍ / NO                   ║
║ PROBABILIDAD REAL:                        ║
║ SANITY CHECK:   X% dif. — ACEPT./REV.     ║
║ EV:                                       ║
║ FILTRO A (EV):  PASA / FALLA              ║
║ FILTRO B (Prob):PASA / FALLA              ║
║ PROXIMIDAD:     X.XX — [estado]           ║
║ CORRELACIÓN AP1:POSITIVA/NEG/LEVE/NEU     ║
║ CATEGORÍA:      A / B / C                 ║
║ MONTO:                                    ║
╚═══════════════════════════════════════════╝`;
};