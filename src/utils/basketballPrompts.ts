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
Busca información actualizada en internet ANTES de responder. Usa fuentes como 
Basketball-Reference, NBA.com/stats, ESPN, Rotowire y The Athletic.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATOS DEL PARTIDO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEPORTE:          Baloncesto NBA
TORNEO:           ${data.tournament}
EQUIPO LOCAL:     ${data.homeTeam}
EQUIPO VISITANTE: ${data.awayTeam}
FECHA/HORA:       ${data.formattedDate}
BANKROLL:         ${formatCOP(data.bankrollAmount)}
${data.odds ? `CUOTA QUE VEO:    ${data.odds}` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

───────────────────────────────────────
1️⃣ FORMA RECIENTE
───────────────────────────────────────
Para CADA equipo:
- Últimos 15 partidos (rival, resultado W/L, puntos anotados y recibidos)
- Últimos 15 partidos: record W/L + puntos promedio anotados/recibidos
- Racha actual (victorias o derrotas consecutivas)
- ATS record últimos 15 (cuántos cubrieron el spread)
- Over/Under record últimos 15
- Rendimiento como LOCAL vs como VISITANTE (record + pts)
- Puntos en 1ra mitad vs 2da mitad promedio
- Diferencial de puntos promedio (point differential)

───────────────────────────────────────
2️⃣ ESTADÍSTICAS AVANZADAS DEL EQUIPO (Season Stats)
───────────────────────────────────────
RATINGS (por 100 posesiones):
- Offensive Rating (OffRtg) + ranking NBA
- Defensive Rating (DefRtg) + ranking NBA
- Net Rating (NetRtg) + ranking NBA
- Pace (posesiones por 48 min) + ranking NBA
- Play-In / Playoff positioning actual

EFICIENCIA:
- True Shooting % (TS%)
- Effective FG% (eFG%)
- Turnover % (TO%) — ofensivo y forzado
- Offensive Rebound % (ORB%)
- Defensive Rebound % (DRB%)
- Free Throw Rate (FTr)
- Assist Ratio
- Usage rate de los 5 titulares

PROYECCIÓN DE PUNTOS DEL EQUIPO:
((OffRtg local + OffRtg visitante) / 2) × (Pace / 100) × 2

───────────────────────────────────────
3️⃣ EFICIENCIA OFENSIVA DETALLADA DEL EQUIPO
───────────────────────────────────────
- Puntos por partido (PPG) + ranking
- FG%, 3P%, FT%
- 3 Point Attempt Rate (3PAr)
- Puntos en la pintura por partido
- Puntos en transición / fast break por partido
- Asistencias por partido + Ratio AST/TO
- Clutch offense rating (últimos 5 min, diferencia ≤5 pts)
- Half-court offense rating
- Pick & Roll points per possession
- Spot-up points per possession

───────────────────────────────────────
4️⃣ ESTADÍSTICAS DEFENSIVAS DEL EQUIPO
───────────────────────────────────────
- Puntos concedidos por partido + ranking
- Defensive Rating ranking (1-30)
- Oponentes FG% / 3P% concedidos
- Rebotes defensivos por partido
- Robos (STL) por partido
- Tapones (BLK) por partido
- Puntos concedidos en la pintura
- Puntos concedidos en 2da oportunidad
- Puntos concedidos en transición
- Clutch defense rating
- Ataja triples: % concedido desde 3 (arriba/abajo del promedio liga)

───────────────────────────────────────
5️⃣ ANÁLISIS DE JUGADORES CLAVE — ${data.homeTeam.toUpperCase()} (LOCAL)
───────────────────────────────────────
Para los TOP 8 jugadores de rotación, incluir:

🏀 TITULARES (5):
Por cada jugador:
- Nombre + posición
- Minutos por partido (MPG)
- Puntos por partido (PPG)
- Rebotes totales (RPG) = ofensivos + defensivos
- Asistencias (APG)
- Robos (SPG)
- Tapones (BPG)
- FG% / 3P% / FT%
- Usage Rate (USG%)
- Player Efficiency Rating (PER)
- True Shooting % (TS%)
- Plus/Minus (+/-)
- VORP (Value Over Replacement Player)
- Tendencia últimos 15 partidos: ¿caliente o frío?
- Puntos en casa vs fuera (splits local/visitante)
- Puntos vs defensa del rival (historial o matchup proyectado)

🔄 BANCO (3 más importantes):
- Nombre + posición
- MPG / PPG / RPG / APG
- Rol específico en rotación
- ¿Suplente que puede explotar hoy?

🎯 JUGADOR FRANQUICIA (STAR PLAYER):
- Estadísticas completas de la temporada
- Forma últimos 15 partidos (pts/reb/ast partido a partido)
- ¿Juega hoy? Estado de salud
- Matchup directo con el rival
- Over/Under de puntos del día (línea del mercado)
- Histórico vs este rival específico (H2H personal)
- Minutos esperados hoy

───────────────────────────────────────
6️⃣ ANÁLISIS DE JUGADORES CLAVE — ${data.awayTeam.toUpperCase()} (VISITANTE)
───────────────────────────────────────
(Misma estructura que sección 5)

🏀 TITULARES (5):
Por cada jugador:
- Nombre + posición
- MPG / PPG / RPG / APG / SPG / BPG
- FG% / 3P% / FT%
- USG% / PER / TS% / +/-
- Forma últimos 15 partidos
- Splits local vs visitante
- Matchup proyectado vs local

🔄 BANCO (3 más importantes):
- Nombre + posición + rol
- MPG / PPG / RPG / APG

🎯 JUGADOR FRANQUICIA (STAR PLAYER):
- Estadísticas completas
- Forma últimos 15 partidos
- Estado de salud
- Matchup directo
- Línea de puntos del mercado
- Histórico vs rival H2H personal

───────────────────────────────────────
7️⃣ MATCHUPS INDIVIDUALES CRÍTICOS
───────────────────────────────────────
Identificar los 3 duelos individuales más importantes del partido:

DUELO 1: [Jugador Local] vs [Jugador Visitante]
- Posición: [PG/SG/SF/PF/C]
- Stats ofensivos del atacante vs défense del oponente
- Historial H2H personal si existe
- ¿Quién tiene ventaja? ¿Por qué?
- Impacto proyectado en el resultado

DUELO 2: [Jugador Local] vs [Jugador Visitante]
(misma estructura)

DUELO 3: [Jugador Local] vs [Jugador Visitante]
(misma estructura)

MISMATCHES detectados:
- ¿Hay algún mismatch de talla/velocidad explotable?
- ¿Quién puede sacar ventaja en el post o desde el perímetro?

───────────────────────────────────────
8️⃣ REBOTES Y POSESIONES EXTRA
───────────────────────────────────────
EQUIPO LOCAL:
- Rebotes ofensivos/defensivos por partido
- Puntos de segunda oportunidad (2nd chance points)
- Líderes en rebotes del equipo (top 3)
- ORB% vs DRB% del rival

EQUIPO VISITANTE:
- Rebotes ofensivos/defensivos por partido
- Puntos de segunda oportunidad
- Líderes en rebotes del equipo (top 3)

BATALLA DEL CRISTAL:
- ¿Quién domina los rebotes totales?
- Diferencial total rebotes por partido
- Impacto en posesiones extra proyectadas

───────────────────────────────────────
9️⃣ PROPS DE JUGADORES — LÍNEAS DEL MERCADO
───────────────────────────────────────
Buscar las líneas de player props en Draftkings/FanDuel/BetMGM para HOY:

EQUIPO LOCAL — TOP 3 jugadores:
Jugador 1:
- Over/Under Puntos: línea / prob estimada
- Over/Under Rebotes: línea / prob estimada
- Over/Under Asistencias: línea / prob estimada
- Over/Under 3P anotados: línea / prob estimada
- Combo PRA (Pts+Reb+Ast): línea / prob estimada
- ¿Hay valor en alguna prop? EV estimado

Jugador 2: (misma estructura)
Jugador 3: (misma estructura)

EQUIPO VISITANTE — TOP 3 jugadores:
(misma estructura para 3 jugadores)

PROP BETS DESTACADAS CON MAYOR VALOR:
| Prop | Jugador | Línea | Cuota | Prob Real | EV |
|------|---------|-------|-------|-----------|-----|
|      |         |       |       |           |     |

───────────────────────────────────────
🔟 ENFRENTAMIENTOS DIRECTOS H2H
───────────────────────────────────────
- Últimos 5 encuentros (fecha, resultado, puntos)
- ATS record en H2H (últimos 5)
- Over/Under record en H2H (últimos 5)
- Puntos promedio en H2H
- ¿Cuál equipo ha ganado más en la pista del rival?
- Estadísticas de estrellas en partidos H2H previos

───────────────────────────────────────
1️⃣1️⃣ LOCALÍA Y VISITA
───────────────────────────────────────
EQUIPO LOCAL en casa:
- Record en casa (V/D) + ranking
- ATS record en casa (últimos 15)
- Puntos anotados en casa (PPG)
- Puntos recibidos en casa (PPG)
- OffRtg / DefRtg en casa

EQUIPO VISITANTE fuera:
- Record fuera (V/D) + ranking
- ATS record fuera (últimos 15)
- Puntos anotados fuera (PPG)
- Puntos recibidos fuera (PPG)
- OffRtg / DefRtg fuera

───────────────────────────────────────
1️⃣2️⃣ FATIGA Y CALENDARIO
───────────────────────────────────────
- ¿Es BACK-TO-BACK para algún equipo?
- Días de descanso desde el último partido (cada equipo)
- Partidos jugados en los últimos 7 días
- Partidos jugados en los últimos 14 días
- Minutos promedio de los 5 titulares (carga de trabajo)
- ¿Hubo partido ayer? ¿Quién jugó muchos minutos?
- Distancia viajada para el visitante (km)
- Zona horaria: ¿el visitante cruzó zonas horarias?

───────────────────────────────────────
1️⃣3️⃣ LESIONES Y ROTACIONES
───────────────────────────────────────
Buscar el injury report oficial de HOY en NBA.com:

EQUIPO LOCAL:
- OUT (confirmado): [nombre] — lesión — impacto (1-10)
- DOUBTFUL: [nombre] — lesión — impacto (1-10)
- QUESTIONABLE: [nombre] — lesión — impacto (1-10)
- GTD (Game Time Decision): [nombre]
- Impacto total en el equipo: ALTO / MEDIO / BAJO
- ¿Quién lo reemplaza? ¿Qué cambios en la rotación?

EQUIPO VISITANTE:
(misma estructura)

ANÁLISIS DE IMPACTO:
- PIPM (Player Impact Plus-Minus) de los lesionados
- Puntos por partido que se pierden
- ¿Cambia el game plan radicalmente?

───────────────────────────────────────
1️⃣4️⃣ ESTILO DE JUEGO Y MATCHUP TÁCTICO
───────────────────────────────────────
EQUIPO LOCAL:
- Sistema ofensivo principal (Pick & Roll / Motion / Iso / Post)
- ¿Equipo de triples o ataque a la pintura?
- Pace preferido: alto (>100) / medio (97-100) / lento (<97)
- Fortaleza del banco (bench points per game + ranking)
- Cuartos más fuertes/débiles históricamente (Q1/Q2/Q3/Q4)
- Rendimiento como favorito vs como underdog

EQUIPO VISITANTE:
(misma estructura)

MATCHUP TÁCTICO:
- ¿Quién controla el ritmo del juego?
- ¿El estilo del visitante es peligroso para el local?
- Vulnerabilidades defensivas que puede explotar el rival
- Claves tácticas del partido

───────────────────────────────────────
1️⃣5️⃣ ANÁLISIS DE CUOTAS DE MERCADO
───────────────────────────────────────
Buscar cuotas actuales en Bet365 / Draftkings / FanDuel / Pinnacle:

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
   "Rango de mercado: +XXX a +XXX | Cuota usada (conservadora): XXX
    | Casa recomendada: [nombre] | Outlier detectado: SÍ/NO"

MONEYLINE:
- Local: [cuota americana] → [cuota decimal] → prob implícita: %
- Visitante: [cuota americana] → [cuota decimal] → prob implícita: %
- Margen de la casa (vig): %
- Rango entre casas: mín X.XX — máx X.XX

SPREAD:
- Local -X.5: [cuota]
- Visitante +X.5: [cuota]
- ¿Qué spread abre el mercado vs. dónde está ahora?

OVER/UNDER (buscar múltiples líneas):
- Over/Under 210.5: cuota
- Over/Under 215.5: cuota
- Over/Under 220.5: cuota
- Over/Under 225.5: cuota
- Over/Under 230.5: cuota
- ¿Dónde está el consenso del mercado?

PRIMERA MITAD:
- Spread 1ra mitad
- Over/Under 1ra mitad

───────────────────────────────────────
1️⃣6️⃣ MOVIMIENTO DE MERCADO
───────────────────────────────────────
- Línea de apertura vs línea actual del spread
- Over/Under apertura vs actual (¿subió o bajó?)
- ¿Hay sharp money (dinero de apostadores profesionales)?
- % público apostando por cada equipo (si disponible)
- ¿Hubo steam move o reverse line movement?
- ¿Las cuotas ML se movieron significativamente?
- Consenso de picks de expertos (ESPN / The Athletic / Basketball-Reference)

───────────────────────────────────────
1️⃣7️⃣ MODELO DE PROBABILIDAD REAL
───────────────────────────────────────
⚠️ CHECKLIST DE CALIBRACIÓN DE PROBABILIDAD (OBLIGATORIO):
Antes de fijar la prob real de cualquier equipo, aplicar
estos 5 ajustes en orden:

AJUSTE 1 — Localía reforzada:
  Si equipo local tiene record en casa > .650
  → sumar +2% a su prob base

AJUSTE 2 — Lesión de estrella del FAVORITO:
  Si el mejor jugador del favorito está OUT
  → restar solo 5–8% (no más) si el equipo tiene
    historial ganador sin él (verificar record sin esa estrella)

AJUSTE 3 — Lesiones del VISITANTE:
  Si el visitante tiene 3+ jugadores OUT incluyendo
  su mejor jugador → restar 8–12% de su prob base

AJUSTE 4 — Momentum reciente (últimos 15 partidos):
  Si un equipo lleva 7+ derrotas en últimos 10 → restar 3%
  Si un equipo lleva 8+ victorias en últimos 10 → sumar 3%

AJUSTE 5 — Sanity check final OBLIGATORIO:
  Comparar prob calculada vs consenso de mercado
  (Dimers, spreads implícitos, línea ML).
  Si difiere >10 puntos porcentuales → revisar modelo.
  Reportar: "Prob modelo: X% | Prob mercado implícita: Y%
  | Diferencia: Z% | [ACEPTABLE / REVISAR]"

MÉTODO 1 — Proyección de puntos por ratings:
Total = ((OffRtg_L + OffRtg_V) / 200) × Pace × 2
Diferencial = NetRtg_L - NetRtg_V + ventaja_local(3pts)

MÉTODO 2 — Ponderación multi-factor:
- Forma reciente últimos 15 partidos  → 20%
- Net Rating diferencial de temporada  → 20%
- Análisis de matchups individuales     → 15%
- H2H histórico reciente               → 10%
- Lesiones y disponibilidad            → 20%
- Local/Visitante + Fatiga + Calendario → 15%

MÉTODO 3 — Proyección estadística de jugadores:
- Sumar proyección de puntos de top 8 jugadores de cada equipo
- Ajustar por ritmo del partido (Pace)
- Ajustar por fortaleza defensiva del rival (DefRtg)

RESULTADO CONSOLIDADO:
Victoria Local:      X%
Victoria Visitante:  X%
Total proyectado:   XXX.X puntos
Spread proyectado:  Local gana/pierde por X puntos

───────────────────────────────────────
1️⃣8️⃣ DETECTAR VALUE BETS
───────────────────────────────────────
EV = (prob_real × cuota_decimal) - 1

⚠️ FILTRO DOBLE OBLIGATORIO — EV + PROBABILIDAD:
Una apuesta solo es VÁLIDA si cumple AMBOS filtros simultáneamente.

FILTRO A — EV MÍNIMO POR TIPO:
  - Spread / Total:    EV > +0.05
  - ML favorito:       EV > +0.05
  - ML underdog:       EV > +0.07
  - Props estrella:    EV > +0.08
  - Props rotación:    EV > +0.10

FILTRO B — PROBABILIDAD MÍNIMA POR TIPO:
  - Spread favorito:   prob ≥ 55%
  - Total O/U:         prob ≥ 55%
  - ML favorito:       prob ≥ 60%
  - ML underdog:       prob ≥ 38%
  - Props estrella:    prob ≥ 60%
  - Props rotación:    prob ≥ 62%

RESULTADO POR APUESTA:
  ✅ Cumple A y B     → APOSTAR (categoría según EV)
  ⚠️ Cumple solo A   → ALTO RIESGO → reducir stake 50%
  ⚠️ Cumple solo B   → MAL PRECIO → NO APOSTAR
  ❌ No cumple ninguno → DESCARTAR

Reportar siempre:
"Filtro A (EV): PASA/FALLA | Filtro B (Prob): PASA/FALLA
→ Veredicto: APTA / ALTO RIESGO / MAL PRECIO / DESCARTADA"

MERCADOS DE EQUIPO:
| Apuesta          | Prob Real | Filtro B | Cuota | EV    | Filtro A | Veredicto |
|------------------|-----------|----------|-------|-------|----------|-----------|
| Local ML         |     %     | ✅/❌    |       |       | ✅/❌    | APTA/DESC |
| Visitante ML     |     %     | ✅/❌    |       |       | ✅/❌    | APTA/DESC |
| Local -spread    |     %     | ✅/❌    |       |       | ✅/❌    | APTA/DESC |
| Visitante +spread|     %     | ✅/❌    |       |       | ✅/❌    | APTA/DESC |
| Over total       |     %     | ✅/❌    |       |       | ✅/❌    | APTA/DESC |
| Under total      |     %     | ✅/❌    |       |       | ✅/❌    | APTA/DESC |
| Over 1ra mitad   |     %     | ✅/❌    |       |       | ✅/❌    | APTA/DESC |
| Under 1ra mitad  |     %     | ✅/❌    |       |       | ✅/❌    | APTA/DESC |

PROPS DE JUGADORES:
| Prop              | Jugador | Prob Real | Filtro B | Cuota | EV | Filtro A | Veredicto |
|-------------------|---------|-----------|----------|-------|----|----------|-----------|
| Over X puntos     |         |     %     | ✅/❌    |       |    | ✅/❌    | APTA/DESC |
| Over X rebotes    |         |     %     | ✅/❌    |       |    | ✅/❌    | APTA/DESC |
| Over X asistencias|         |     %     | ✅/❌    |       |    | ✅/❌    | APTA/DESC |
| Over X triples    |         |     %     | ✅/❌    |       |    | ✅/❌    | APTA/DESC |
| Over X PRA        |         |     %     | ✅/❌    |       |    | ✅/❌    | APTA/DESC |

───────────────────────────────────────
⚠️ FILTROS ANTI-ERROR OBLIGATORIOS (aplicar ANTES de confirmar cualquier apuesta)
───────────────────────────────────────

FILTRO 1 — PROXIMIDAD DE LÍNEA (EXCLUSIVO PARA TOTALES O/U)
⚠️ ESTE FILTRO APLICA ÚNICAMENTE A MERCADOS DE TOTAL (OVER/UNDER).
   NUNCA A SPREADS NI A MONEYLINE.

  Para totales O/U:
  → Calcular: |total_proyectado - linea_OU|
  → Si la diferencia es < 4 pts → reducir stake al 50%
  → Si la diferencia es < 2 pts → NO APOSTAR bajo ninguna circunstancia
  → Reportar: "Proximidad O/U: X.X pts — [APTA / REDUCIR 50% / BLOQUEADA]"

  Para SPREADS — usar filtro de EDGE:
  → Edge = |diferencial_proyectado - spread_linea|
  → Si edge < 1.5 pts → NO APOSTAR (insuficiente)
  → Si edge 1.5–3.0 pts → APTA con stake categoría C
  → Si edge > 3.0 pts → APTA con stake completo según categoría EV
  → Reportar: "Edge spread: X.X pts — [INSUFICIENTE / APTA-C / APTA]"

  Para ML:
  → No aplica filtro de proximidad.
    El control es exclusivamente vía EV y calibración de probabilidad.

FILTRO 2 — CORRELACIÓN ENTRE APUESTAS DEL MISMO PARTIDO
Antes de recomendar 2 o más apuestas simultáneas en el mismo partido,
mapear el escenario de juego que las hace ganar a ambas. Si ese escenario
es contradictorio, las apuestas se cancelan mutuamente.

  Ejemplos de correlaciones NEGATIVAS (incompatibles):
  - Under total + Over rebotes/puntos de jugador del equipo ganador proyectado
  - Under total + Over asistencias de un PG que necesita ritmo alto para asistir
  - Visitante cubre spread + Over puntos del jugador estrella del local

  Ejemplos de correlaciones POSITIVAS (compatibles):
  - Under total + Under puntos del jugador del equipo con menor proyección
  - Over total + Over puntos del jugador del equipo más ofensivo
  - Local gana ML + Over puntos de la estrella del local

  TABLA DE CORRELACIÓN SPREAD + PROPS (OBLIGATORIA):
  | Situación                              | Correlación    | Acción             |
  |----------------------------------------|----------------|--------------------|
  | Spread fav + Over pts estrella fav     | POSITIVA ✅    | Apta combinación   |
  | Spread fav + Over PRA estrella fav     | POSITIVA ✅    | Apta combinación   |
  | Spread fav + Over pts rival            | NEGATIVA ❌    | Eliminar una       |
  | Spread fav + Over PRA estrella rival   | Leve neg ⚠️    | Reducir prop 50%   |
  | Spread fav + Under pts rival           | POSITIVA ✅    | Apta combinación   |
  | ML underdog + Over PRA estrella rival  | POSITIVA ✅    | Apta combinación   |

  → Para correlación "Leve negativa ⚠️": reducir stake de la prop al 50%.
  → Para correlación NEGATIVA ❌: eliminar la apuesta de MENOR EV ajustado.

  → Para cada par de apuestas declarar:
    "Correlación: POSITIVA / NEGATIVA / LEVE NEG / NEUTRA
    → [apta / reducir prop 50% / incompatible]"

  CASO ESPECIAL — BLOWOUT RISK EN PROPS:
  Si spread ≥ 10 puntos:
  → Penalizar props pts/reb/PRA jugadores equipo PERDEDOR: -2.0 u.
  → Penalizar props jugadores rotación media FAVORITO: -1.5 u.
  → Solo recomendar si tras penalización el promedio ajustado
    sigue superando la línea en al menos +1.0 unidades.

  Si spread entre 6–9 puntos (blowout parcial posible):
  → Penalizar props jugadores equipo perdedor: -1.0 u.
  → Evaluar si la prop sigue siendo válida tras ajuste.

───────────────────────────────────────
1️⃣9️⃣ PREDICCIÓN FINAL
───────────────────────────────────────
- Ganador probable + argumentos clave (top 3 razones)
- Marcador estimado: ${data.homeTeam} XXX - XXX ${data.awayTeam}
- Total proyectado: XXX puntos
- Diferencial proyectado: X puntos
- Apuesta principal del partido
- Prop bet destacada del partido
- El "PERO": factor que tumbaría el análisis
- Nivel de certeza del modelo: ALTO / MEDIO / BAJO

───────────────────────────────────────
2️⃣0️⃣ TOP APUESTAS CON VALOR (EV > 0.05 + Prob mínima cumplida)
───────────────────────────────────────
APUESTA 1 — [nombre detallado]
→ Tipo: ML / Spread / Total / Prop
→ Mercado: [descripción exacta]
→ Cuota usada: [decimal] | Rango mercado: [mín — máx] | Outlier: SÍ/NO
→ Prob Real: % | Sanity check vs mercado: X% dif. — [ACEPTABLE / REVISAR]
→ EV: +X.XX
→ Categoría: A / B / C
→ Filtro A (EV):    PASA / FALLA
→ Filtro B (Prob):  PASA / FALLA
→ Proximidad/Edge:  X.X pts — [APTA / REDUCIR 50% / BLOQUEADA / INSUFICIENTE]
→ Correlación con otras apuestas: POSITIVA / NEGATIVA / LEVE NEG / NEUTRA
→ Argumento principal (2-3 líneas)

APUESTA 2 — [nombre detallado]
→ Tipo / Mercado / Cuota / Rango mercado / Outlier
→ Prob Real / Sanity check / EV / Categoría
→ Filtro A (EV): PASA/FALLA | Filtro B (Prob): PASA/FALLA
→ Proximidad/Edge: X.X pts — [estado]
→ Correlación con otras apuestas: POSITIVA / NEGATIVA / LEVE NEG / NEUTRA
→ Argumento

APUESTA 3 — [nombre detallado] (solo si cumple Filtro A Y Filtro B)
→ Tipo / Mercado / Cuota / Rango mercado / Outlier
→ Prob Real / Sanity check / EV / Categoría
→ Filtro A (EV): PASA/FALLA | Filtro B (Prob): PASA/FALLA
→ Proximidad/Edge: X.X pts — [estado]
→ Correlación con otras apuestas: POSITIVA / NEGATIVA / LEVE NEG / NEUTRA
→ Argumento

PROP BET DESTACADA — [jugador + mercado]
→ Tipo / Cuota / Rango mercado / Outlier: SÍ/NO
→ Prob Real / EV
→ Filtro A (EV): PASA/FALLA | Filtro B (Prob ≥60%): PASA/FALLA
→ Promedio jugador vs línea: +X.X unidades (mínimo requerido: +1.0)
→ Blowout risk: spread ≥10 → SÍ/NO | spread 6–9 → SÍ/NO
→ Penalización aplicada: -X.X u. | Proyección ajustada: X.X u.
→ Correlación con apuesta principal: POSITIVA / NEGATIVA / LEVE NEG / NEUTRA
→ Argumento

⛔ Si ninguna apuesta cumple Filtro A + Filtro B: "NO HAY VALUE HOY — NO APOSTAR"

───────────────────────────────────────
2️⃣1️⃣ GESTIÓN DE BANKROLL
───────────────────────────────────────
Bankroll total: ${formatCOP(data.bankrollAmount)}

CATEGORÍA A — EV > 0.12    → 5%   = ${formatCOP(data.bankrollAmount * 0.05)}
CATEGORÍA B — EV 0.07-0.12 → 3%   = ${formatCOP(data.bankrollAmount * 0.03)}
CATEGORÍA C — EV 0.05-0.07 → 1.5% = ${formatCOP(data.bankrollAmount * 0.015)}

PROPS (menor certeza)       → máx 1% = ${formatCOP(data.bankrollAmount * 0.01)}

REGLA: No superar 10% del bankroll en total por partido.
REGLA: Máximo 3 apuestas simultáneas en el mismo partido.
REGLA: ML underdog → máximo 2–3% del bankroll independientemente de la categoría.
REGLA: Si el filtro de proximidad activa "REDUCIR 50%", aplicar ese recorte
       al monto calculado por categoría antes de apostar.
REGLA: Si dos apuestas tienen correlación NEGATIVA, conservar solo la de
       mayor EV ajustado y descartar la otra.
REGLA: Si correlación es LEVE NEGATIVA, reducir stake de la prop al 50%
       del monto calculado por categoría.
REGLA: Si una apuesta cumple solo Filtro A (no Filtro B) → reducir stake 50%.
REGLA: Si una apuesta cumple solo Filtro B (no Filtro A) → NO APOSTAR.

───────────────────────────────────────
2️⃣2️⃣ RESUMEN EJECUTIVO FINAL
───────────────────────────────────────
╔══════════════════════════════════════════╗
║       MEJOR APUESTA DEL PARTIDO          ║
╠══════════════════════════════════════════╣
║ APUESTA:                                 ║
║ TIPO:                                    ║
║ MERCADO EXACTO:                          ║
║ CUOTA:                                   ║
║ RANGO MERCADO:  mín X.XX — máx X.XX      ║
║ OUTLIER:        SÍ / NO                  ║
║ PROBABILIDAD REAL:                       ║
║ SANITY CHECK:   X% dif. — ACEPT./REV.    ║
║ EV:                                      ║
║ FILTRO A (EV):  PASA / FALLA             ║
║ FILTRO B (Prob):PASA / FALLA             ║
║ EDGE/PROXIMIDAD:X.X pts — [estado]       ║
║ CONFIANZA:      baja / media / alta      ║
║ CATEGORÍA:      A / B / C                ║
║ MONTO:                                   ║
╠══════════════════════════════════════════╣
║       MEJOR PROP DEL PARTIDO             ║
╠══════════════════════════════════════════╣
║ JUGADOR:                                 ║
║ PROP:                                    ║
║ CUOTA:                                   ║
║ RANGO MERCADO:  mín X.XX — máx X.XX      ║
║ OUTLIER:        SÍ / NO                  ║
║ PROBABILIDAD REAL:                       ║
║ EV:                                      ║
║ FILTRO A (EV):  PASA / FALLA             ║
║ FILTRO B (Prob ≥60%): PASA / FALLA       ║
║ MARGEN VS LÍNEA:+X.X u. (mín. +1.0)     ║
║ BLOWOUT RISK:   SÍ / NO                  ║
║ PENALIZACIÓN:   -X.X u. aplicada         ║
║ PROY. AJUSTADA: X.X u. sobre/bajo línea  ║
║ CORRELACIÓN:    +/- / LEV NEG / NEU      ║
║ MONTO: máx 1% = ${formatCOP(data.bankrollAmount * 0.01).padEnd(20)} ║
╚══════════════════════════════════════════╝`;
};