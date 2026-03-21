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
Busca información actualizada en internet ANTES de responder. Usa fuentes como
Tennis Abstract, ATP/WTA oficial, Sofascore, Flashscore, Ultimate Tennis Stats,
Tennis Insight y Betfair Exchange.

⚠️ INSTRUCCIÓN ESPECIAL ANTI-TRAMPA (PRIORIDAD MÁXIMA):
Antes de calcular cualquier probabilidad, DEBES ejecutar obligatoriamente
la CALIBRACIÓN INICIAL (5 preguntas en la Sección 0).
Si se activa ALERTA TRAMPA R1, todo el modelo se ajusta automáticamente:
  +2.0 juegos al total proyectado base
  -10% probabilidad de barrida 2-0 del favorito
  BLOQUEAR automáticamente Set hándicap -1.5 del favorito
  BLOQUEAR Under si el margen resultante < 3.5 juegos
Este filtro tiene PRIORIDAD ABSOLUTA sobre cualquier otro cálculo de EV.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATOS DEL PARTIDO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PARTIDO:    ${data.homeTeam} vs ${data.awayTeam}
TORNEO:     ${data.tournament}
FECHA/HORA: ${data.formattedDate}
BANKROLL:   ${formatCOP(data.bankrollAmount)}
${data.odds ? `CUOTA QUE VEO: ${data.odds}` : ''}

ANTES DE CONTINUAR — busca en internet y completa automáticamente:
  SUPERFICIE:  [buscar en ATP/WTA o Sofascore: Hard / Clay / Grass / Indoor Hard / Indoor Clay]
  RONDA:       [buscar en el cuadro del torneo: 1R / 2R / 3R / 4R / QF / SF / F]
  FORMATO:     [buscar en las reglas del torneo: Mejor de 3 / Mejor de 5]
               [con tie-break en el set final / sin tie-break / super tie-break]
  CATEGORÍA:   [Grand Slam / Masters 1000 / ATP 500 / ATP 250 / Challenger / ITF /
                WTA 1000 / WTA 500 / WTA 250]
  RANKING J1:  [buscar ranking ATP/WTA actual de ${data.homeTeam}]
  RANKING J2:  [buscar ranking ATP/WTA actual de ${data.awayTeam}]
  ELO J1:      [buscar ELO general en Tennis Abstract]
  ELO J2:      [buscar ELO general en Tennis Abstract]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

───────────────────────────────────────
0️⃣ CALIBRACIÓN INICIAL ANTI-TRAMPA (EJECUTAR PRIMERO — OBLIGATORIO)
───────────────────────────────────────
Responder SÍ/NO a cada pregunta antes de cualquier análisis:

  P1. ¿Es R1 o R2 del torneo para el favorito (primer partido del torneo)?
      → SÍ = +3.0 juegos al total proyectado base

  P2. ¿El rival es wildcard, qualifier o lucky loser?
      → SÍ = ACTIVAR protocolo TRAMPA R1

  P3. ¿La diferencia de ranking entre favorito y rival es > 80 posiciones?
      → SÍ = mercado subestima al outsider en sets individuales (+1.0 juego)

  P4. ¿El favorito viene de una derrota emocional reciente (vs top 10, <5 días)?
      → SÍ = reducir -5% su probabilidad de victoria rápida (2-0)

  P5. ¿El rival es joven (< 23 años) jugando un torneo Masters/Grand Slam?
      → SÍ = "factor adrenalina": +2.0 juegos al total proyectado

CONTEO DE ALERTAS: X de 5

ÍNDICE DE CONFIANZA INICIAL:
  → 0 alertas:   CONFIANZA ALTA   — stakes normales
  → 1-2 alertas: CONFIANZA MEDIA  — reducir todos los stakes al 50%
  → 3+ alertas:  CONFIANZA BAJA   — solo apostar si EV > 0.15 tras ajustes

AJUSTE BASE DEL TOTAL DE JUEGOS POR CALIBRACIÓN:
  Total base estimado (antes del modelo): XX.X juegos
  Ajuste por alertas P1+P3+P5:          +X.X juegos
  Total calibrado:                        XX.X juegos
  → Este total calibrado se usa en TODOS los cálculos siguientes.

───────────────────────────────────────
1️⃣ FORMA RECIENTE
───────────────────────────────────────
Para CADA jugador — buscar en Sofascore o Flashscore:

ÚLTIMOS 15 PARTIDOS:
- Fecha · Torneo · Superficie · Ronda · Rival · Resultado (sets) · Duración (min)
- Descanso entre partidos (horas desde el anterior)
- Record W/L global en esos 15 partidos
- Record W/L en esta superficie (de esos 15)
- Record W/L en torneos de esta categoría (de esos 15)
- Sets ganados vs perdidos (ratio)
- % partidos donde ganó el primer set
- % partidos que ganó habiendo perdido el primer set (remontadas)

ÚLTIMOS 15 PARTIDOS — DETALLE:
- Fecha · Torneo · Superficie · Ronda · Rival · Resultado (sets) · Duración (min)
- Descanso entre partidos (horas desde el anterior)

RACHA ACTUAL:
- Victorias o derrotas consecutivas
- Racha en esta superficie
- Racha en este torneo específico (historial del torneo)

───────────────────────────────────────
2️⃣ ESTADÍSTICAS DE SERVICIO (últimas 52 semanas en esta superficie)
───────────────────────────────────────
Para CADA jugador — buscar en Tennis Abstract o ATP/WTA stats:

PRIMER SERVICIO:
- % primer servicio dentro (1stIn%)
- % puntos ganados con 1er servicio (1stWon%)
- Aces por partido (Ace/game)
- Aces vs dobles faltas (ratio)

SEGUNDO SERVICIO:
- % puntos ganados con 2do servicio (2ndWon%)
- Dobles faltas por partido (DF/game)
- % dobles faltas sobre puntos de saque (DF%)

HOLD Y BREAK:
- Hold % (juegos de saque ganados)
- Hold % en situación de break point en contra
- Break points salvados % (BP saved%)
- Puntos ganados en el juego decisivo del set (tie-break %)
- Rendimiento en juegos al saque con 40-40 (deuce %)

VELOCIDAD Y VARIACIÓN:
- Velocidad media 1er servicio (km/h si disponible)
- Velocidad media 2do servicio
- % de puntos ganados al saque total (serve rating)

⚠️ ANÁLISIS DE SAQUE DEL OUTSIDER (obligatorio si P2 = SÍ):
- ¿El outsider tiene saque potente incluso en challengers? (> 6 aces/partido)
- ¿El favorito tiene retorno débil o promedio? (break rate < 28%)
- Si ambas son SÍ → ajustar total proyectado: +1.5 juegos adicionales
  y reducir probabilidad de barrida 2-0 del favorito en -5% extra

───────────────────────────────────────
3️⃣ ESTADÍSTICAS DE RESTO (últimas 52 semanas en esta superficie)
───────────────────────────────────────
Para CADA jugador:

RETORNO:
- % puntos ganados al retorno (return rating)
- Break points generados por partido
- Break points generados por juego al saque del rival
- % conversión break points (BPConv%)
- % juegos de saque del rival rotos (break %)
- % puntos ganados en retorno de 1er servicio
- % puntos ganados en retorno de 2do servicio
- Rendimiento en retorno tras un ace del rival

DINÁMICA OFENSIVA AL RETORNO:
- Rally length preferido (promedio de golpes por punto)
- % puntos ganados en rallies cortos (≤4 golpes)
- % puntos ganados en rallies largos (≥9 golpes)
- Winner/Error ratio al retornar

───────────────────────────────────────
4️⃣ ESTADÍSTICAS DE CAMPO (puntos jugados)
───────────────────────────────────────
Para CADA jugador:

CALIDAD DEL JUEGO:
- Winners por partido
- Errores no forzados por partido (UE/game)
- Ratio winners/UE (cuanto más alto, más sólido)
- Puntos ganados en la red (net points won %)
- % puntos de primer golpe ganados (UE en approach)

PRESIÓN Y PUNTOS IMPORTANTES:
- % puntos decisivos ganados (break points, set points, match points)
- Rendimiento en tie-breaks: ratio W/L y % puntos ganados
- Rendimiento en sets decididos (3er set o 5to set)
- Rendimiento en partidos de más de 2 horas
- Rendimiento cuando va perdiendo por un set (comebacks)

───────────────────────────────────────
5️⃣ RENDIMIENTO EN SUPERFICIE Y CONDICIONES
───────────────────────────────────────
Para CADA jugador — especificar la superficie del partido actual:

HISTORIAL EN SUPERFICIE:
- Win rate de carrera en [superficie]
- Win rate últimas 52 semanas en [superficie]
- ELO específico de [superficie] (Tennis Abstract)
- Record en torneos de esta categoría en [superficie]
- Mejor resultado histórico en este torneo

CONDICIONES ESPECÍFICAS:
- Si es indoor: rendimiento en indoor vs outdoor
- Si es clay: rendimiento en tierra rápida vs lenta
- Si es hard: rendimiento en hard rápida vs lenta
- Preferencia de altitud si el torneo es en altura

───────────────────────────────────────
5️⃣B PERFIL HISTÓRICO DEL FAVORITO EN ESTE TORNEO/RONDA (OBLIGATORIO)
───────────────────────────────────────
Buscar en Tennis Abstract / Flashscore:

HISTORIAL EN R1 (o ronda actual) de este torneo específico:
- ¿Cuántas veces ha jugado R1 aquí? X veces
- Récord en R1 de este torneo: W-L
- % victorias en 2 sets en R1 de este torneo: X%
- ¿Ha perdido alguna vez como favorito en R1 aquí? SÍ/NO

TRAMPA PSICOLÓGICA:
- ¿Viene de una derrota emocional reciente (ej: vs top 10 en < 48h)?
- ¿Declaró públicamente que mira hacia el siguiente torneo?
  (señal de distracción mental → penalizar -5% prob victoria rápida)
- ¿Tiene presión de patrocinadores o país en este torneo?

AJUSTE DE PROBABILIDADES POR HISTORIAL R1:
- Si W% en R1 de este torneo < 60% → restar -5% prob de victoria total
- Si perdió en R1 aquí el año anterior → restar -3% adicional
- Si viene de derrota emocional (< 48h) → restar -3% adicional
→ Reportar ajuste total aplicado: -X%

───────────────────────────────────────
6️⃣ ENFRENTAMIENTOS DIRECTOS H2H
───────────────────────────────────────
Buscar historial completo en Tennis Abstract o ATP/WTA:

HISTORIAL GLOBAL:
- Record H2H total ${data.homeTeam} vs ${data.awayTeam}: X-Y
- Último enfrentamiento: fecha, torneo, resultado, marcador por sets

ÚLTIMOS 5 ENFRENTAMIENTOS:
- Fecha · Torneo · Superficie · Ronda · Ganador · Marcador completo · Duración
- Promedio de juegos por partido en H2H
- % partidos que fueron a 3 sets (o 5 sets en formato Best of 5)

H2H EN ESTA SUPERFICIE:
- Record específico en [superficie]
- Tendencia: ¿quién mejoró últimamente?

H2H EN ESTA RONDA / CATEGORÍA:
- Record en Grand Slams / Masters si aplica
- Record cuando se enfrentan en etapas avanzadas del torneo

PATRONES TÁCTICOS EN H2H:
- ¿Quién suele dominar los rallies largos entre ellos?
- ¿Hay dominancia en el saque en sus duelos?
- Promedio de aces y dobles faltas combinadas en H2H

───────────────────────────────────────
7️⃣ FATIGA Y CALENDARIO
───────────────────────────────────────
PARTIDOS EN ESTE TORNEO:
- Número de partidos jugados hasta este (incluyendo clasificación si aplica)
- Duración total acumulada en minutos en el torneo
- Minutos jugados en el partido más reciente
- Horas de descanso desde el último partido

CARGA RECIENTE:
- Torneos jugados en las últimas 4 semanas
- Partidos jugados en los últimos 14 días
- Minutos totales jugados en los últimos 14 días
- ¿Hubo viaje intercontinental reciente?

SEÑALES DE FATIGA:
- ¿Tuvo partidos largos (> 2h) en rondas previas?
- Historial de retiros o abandonos en temporadas anteriores
- Rendimiento en el torneo después de semanas cargadas

───────────────────────────────────────
8️⃣ LESIONES Y ESTADO FÍSICO
───────────────────────────────────────
Buscar injury report en ATP/WTA, Eurosport, Tennis Now:

ESTADO ACTUAL:
- Lesiones o molestias reportadas antes del partido
- ¿Jugó el partido anterior con algún vendaje o taping visible?
- Declaraciones del jugador o del entrenador sobre su estado

HISTORIAL MÉDICO RELEVANTE:
- Lesiones recurrentes (rodilla, muñeca, espalda, hombro)
- Retiros o abandonos en los últimos 12 meses
- Cirugías o pausas largas en la carrera
- Torneos saltados recientemente por precaución

IMPACTO EN EL JUEGO:
- Si hay lesión: ¿qué aspecto del juego afecta? (saque, movimiento, revés)
- Ajuste de probabilidades por lesión: impacto estimado (1-10)

───────────────────────────────────────
9️⃣ ESTILO DE JUEGO Y MATCHUP TÁCTICO
───────────────────────────────────────
PERFIL DE JUEGO DE CADA JUGADOR:
- Estilo principal: fondo de cancha / agresivo de fondo / saque y volea /
  chip and charge / defensivo / allround
- Arma principal: saque / derecha / revés / volea / slice / drop shot
- Punto débil: revés en slice largo / segunda bola / movilidad / presión mental
- Preferencia de ritmo: puntos cortos o rallies largos
- Juego en red: % de subidas a la red y % puntos ganados en ella

ANÁLISIS DEL MATCHUP:
- ¿El estilo de A es peligroso para el estilo de B? ¿Por qué?
- ¿Quién dicta el ritmo del partido?
- ¿Hay asimetría en el saque que favorezca a uno?
- ¿Cómo afecta la superficie este matchup?
- ¿Hay ventaja de zurdo vs diestro en esta superficie?
- Vulnerabilidades que puede explotar cada uno

MENTALIDAD Y PRESIÓN:
- Rendimiento en partidos importantes (semis, finales, 5to set)
- Historial en situaciones de desventaja (¿remontador?)
- Compostura en tie-breaks bajo presión
- Nivel de experiencia en esta ronda del torneo

───────────────────────────────────────
🔟 ANÁLISIS DE CUOTAS DE MERCADO
───────────────────────────────────────
Buscar cuotas en Bet365 / Pinnacle / Betfair Exchange / Draftkings:

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

MERCADO GANADOR DEL PARTIDO (1X2):
- ${data.homeTeam}: [cuota] → prob implícita: % | Rango: X.XX — X.XX
- ${data.awayTeam}: [cuota] → prob implícita: % | Rango: X.XX — X.XX
- Margen de la casa (vig): %

MERCADO HÁNDICAP DE JUEGOS (Games Handicap):
- ${data.homeTeam} -2.5 juegos: [cuota]
- ${data.homeTeam} +2.5 juegos: [cuota]
- ¿Dónde está la línea de hándicap más equilibrada?

MERCADO TOTAL DE JUEGOS (Over/Under games):
- Over/Under 18.5: [cuota]
- Over/Under 19.5: [cuota]
- Over/Under 20.5: [cuota]
- Over/Under 21.5: [cuota]
- Over/Under 22.5: [cuota]
- Over/Under 23.5: [cuota]
- ¿Dónde está el consenso del mercado?

MERCADO SETS:
- ${data.homeTeam} gana 2-0: [cuota] → prob implícita: %
- ${data.homeTeam} gana 2-1: [cuota] → prob implícita: %
- ${data.awayTeam} gana 2-0: [cuota] → prob implícita: %
- ${data.awayTeam} gana 2-1: [cuota] → prob implícita: %
(Si es Best of 5: añadir 3-0, 3-1, 3-2 para cada jugador)

MERCADO PRIMER SET:
- Ganador del 1er set: [cuota J1] / [cuota J2]
- Over/Under juegos 1er set 9.5: [cuota]
- Tie-break en el 1er set: SÍ / NO [cuota]

MERCADO TOTAL DE SETS:
- Partido va a sets máximos (3 de 3 / 5 de 5): [cuota]
- Partido NO va a sets máximos: [cuota]

PROPS DE JUGADOR (si disponibles):
- Aces Over/Under de ${data.homeTeam}: línea / cuota
- Aces Over/Under de ${data.awayTeam}: línea / cuota
- Dobles faltas Over/Under de cada jugador: línea / cuota

───────────────────────────────────────
1️⃣1️⃣ MOVIMIENTO DE MERCADO
───────────────────────────────────────
- Cuota de apertura vs cuota actual para el ganador
- Over/Under juegos: apertura vs actual (¿subió o bajó?)
- ¿Hay sharp money en algún mercado?
- % público apostando por cada jugador (si disponible)
- ¿Hubo steam move o reverse line movement?
- Betfair Exchange: ¿el precio coincide con las casas o hay discrepancia?
- ¿Se movió la línea por lesión o información de último momento?

───────────────────────────────────────
1️⃣2️⃣ MODELO DE PROBABILIDAD REAL
───────────────────────────────────────

⚠️ IMPORTANTE: Usar el TOTAL CALIBRADO de la Sección 0 como base.
Todos los ajustes de la Calibración Inicial ya deben estar incorporados.

⚠️ CHECKLIST DE CALIBRACIÓN DE PROBABILIDAD (OBLIGATORIO):
Antes de fijar la prob real de cada jugador, aplicar estos
5 ajustes en orden:

AJUSTE 1 — Favorito en casa / superficie dominante:
  Si el favorito tiene win rate > 65% en esta superficie
  → sumar +2% a su prob base

AJUSTE 2 — Lesión del FAVORITO:
  Si el favorito tiene molestia o lesión activa
  → restar 5–10% según impacto reportado (1-10 escala)
  → No restar más de 10% salvo lesión severa confirmada

AJUSTE 3 — Estado del OUTSIDER:
  Si el outsider viene de victoria larga (>2h) hace < 24h
  → restar 5% de su prob base (fatiga acumulada)
  Si el outsider lleva 3+ victorias seguidas en este torneo
  → sumar +3% (momentum de torneo)

AJUSTE 4 — Momentum reciente (últimos 15 partidos):
  Si un jugador lleva 7+ derrotas en últimos 10 → restar 3%
  Si un jugador lleva 8+ victorias en últimos 10 → sumar 3%

AJUSTE 5 — Sanity check final OBLIGATORIO:
  Comparar prob calculada vs consenso de mercado
  (Betfair Exchange, cuota implícita Pinnacle).
  Si difiere >10 puntos porcentuales → revisar modelo.
  Reportar: "Prob modelo: X% | Prob mercado implícita: Y%
  | Diferencia: Z% | [ACEPTABLE / REVISAR]"

MÉTODO 1 — Modelo matemático de saque/resto:
  p = prob de ganar un punto al saque de J1
  q = prob de ganar un punto al saque de J2
  → Prob de ganar un juego al saque = f(p)
  → Prob de ganar un set = f(prob juego, tie-break)
  → Prob de ganar el partido = f(prob set, formato)
  Usar Hold% y Break% reales de cada jugador en esta superficie.

MÉTODO 2 — Ponderación multi-factor (ajustar pesos si hay lesión):
  - Forma reciente en superficie (últimos 15)  → 20%
  - H2H en esta superficie y ronda             → 15%
  - Estadísticas de servicio                   → 15%
  - Estadísticas de resto                      → 10%
  - Fatiga y carga acumulada                   → 15%
  - Matchup de estilos                         → 10%
  - ELO específico de superficie               → 10%
  - Lesiones y estado físico                   → 5%

MÉTODO 3 — ELO ajustado por superficie:
  - ELO J1 en [superficie] vs ELO J2 en [superficie]
  - Fórmula Elo: E(J1) = 1 / (1 + 10^((ELO_J2 - ELO_J1) / 400))

RESULTADO CONSOLIDADO (ya con ajustes de Calibración Inicial aplicados):
  ${data.homeTeam} gana el partido:       X%
  ${data.awayTeam} gana el partido:       X%
  Sanity check vs mercado:                X% dif. — [ACEPTABLE / REVISAR]
  Partido va a sets máximos:              X%
  ${data.homeTeam} gana 2-0 (o 3-0):     X%
  ${data.homeTeam} gana 2-1 (o 3-1/3-2): X%
  ${data.awayTeam} gana 2-0 (o 3-0):     X%
  ${data.awayTeam} gana 2-1 (o 3-1/3-2): X%
  Total de juegos proyectado CALIBRADO:   XX.X juegos
  Tie-break en al menos un set:           X%

───────────────────────────────────────
1️⃣3️⃣ DETECTAR VALUE BETS
───────────────────────────────────────
EV = (prob_real × cuota_decimal) - 1

⚠️ FILTRO DOBLE OBLIGATORIO — EV + PROBABILIDAD:
Una apuesta solo es VÁLIDA si cumple AMBOS filtros simultáneamente.

FILTRO A — EV MÍNIMO POR TIPO:
  - Ganador partido:        EV > +0.05
  - Ganador favorito (bajo):EV > +0.05
  - Ganador outsider:       EV > +0.07
  - Total juegos O/U:       EV > +0.05
  - Hándicap juegos:        EV > +0.05
  - Mercado sets (2-0/2-1): EV > +0.07
  - Props aces/DF:          EV > +0.10

FILTRO B — PROBABILIDAD MÍNIMA POR TIPO:
  - Ganador favorito:       prob ≥ 60%
  - Ganador outsider:       prob ≥ 38%
  - Total juegos O/U:       prob ≥ 55%
  - Hándicap juegos fav:    prob ≥ 55%
  - Barrida 2-0 favorito:   prob ≥ 50%
  - Sets a 3 (2-1/1-2):    prob ≥ 45%
  - Props aces/DF:          prob ≥ 62%

RESULTADO POR APUESTA:
  ✅ Cumple A y B     → APOSTAR (categoría según EV)
  ⚠️ Cumple solo A   → ALTO RIESGO → reducir stake 50%
  ⚠️ Cumple solo B   → MAL PRECIO → NO APOSTAR
  ❌ No cumple ninguno → DESCARTAR

Reportar siempre:
"Filtro A (EV): PASA/FALLA | Filtro B (Prob): PASA/FALLA
→ Veredicto: APTA / ALTO RIESGO / MAL PRECIO / DESCARTADA"

MERCADO GANADOR:
| Apuesta         | Prob Real | Filtro B | Cuota | EV | Filtro A | Veredicto |
|-----------------|-----------|----------|-------|----|----------|-----------|
| J1 gana partido |     %     | ✅/❌    |       |    | ✅/❌    | APTA/DESC |
| J2 gana partido |     %     | ✅/❌    |       |    | ✅/❌    | APTA/DESC |

MERCADO SETS:
| Apuesta     | Prob Real | Filtro B | Cuota | EV | Filtro A | Veredicto |
|-------------|-----------|----------|-------|----|----------|-----------|
| J1 gana 2-0 |     %     | ✅/❌    |       |    | ✅/❌    | APTA/DESC |
| J1 gana 2-1 |     %     | ✅/❌    |       |    | ✅/❌    | APTA/DESC |
| J2 gana 2-0 |     %     | ✅/❌    |       |    | ✅/❌    | APTA/DESC |
| J2 gana 2-1 |     %     | ✅/❌    |       |    | ✅/❌    | APTA/DESC |

MERCADO JUEGOS TOTALES:
| Apuesta          | Prob Real | Filtro B | Cuota | EV | Filtro A | Veredicto |
|------------------|-----------|----------|-------|----|----------|-----------|
| Over X.5 juegos  |     %     | ✅/❌    |       |    | ✅/❌    | APTA/DESC |
| Under X.5 juegos |     %     | ✅/❌    |       |    | ✅/❌    | APTA/DESC |

MERCADO PRIMER SET:
| Apuesta           | Prob Real | Filtro B | Cuota | EV | Filtro A | Veredicto |
|-------------------|-----------|----------|-------|----|----------|-----------|
| J1 gana 1er set   |     %     | ✅/❌    |       |    | ✅/❌    | APTA/DESC |
| J2 gana 1er set   |     %     | ✅/❌    |       |    | ✅/❌    | APTA/DESC |
| Tie-break 1er set |     %     | ✅/❌    |       |    | ✅/❌    | APTA/DESC |

HÁNDICAP DE JUEGOS:
| Apuesta          | Prob Real | Filtro B | Cuota | EV | Filtro A | Veredicto |
|------------------|-----------|----------|-------|----|----------|-----------|
| J1 -X.5 juegos   |     %     | ✅/❌    |       |    | ✅/❌    | APTA/DESC |
| J2 +X.5 juegos   |     %     | ✅/❌    |       |    | ✅/❌    | APTA/DESC |

PROPS:
| Apuesta               | Prob Real | Filtro B | Cuota | EV | Filtro A | Veredicto |
|-----------------------|-----------|----------|-------|----|----------|-----------|
| Aces Over X.5 (J1)    |     %     | ✅/❌    |       |    | ✅/❌    | APTA/DESC |
| Aces Over X.5 (J2)    |     %     | ✅/❌    |       |    | ✅/❌    | APTA/DESC |
| DF Over X.5 (J1 / J2) |     %     | ✅/❌    |       |    | ✅/❌    | APTA/DESC |

───────────────────────────────────────
⚠️ FILTROS ANTI-ERROR OBLIGATORIOS (aplicar ANTES de confirmar cualquier apuesta)
───────────────────────────────────────

FILTRO 0 — BLOQUEOS AUTOMÁTICOS POR CALIBRACIÓN INICIAL
  Si ALERTA TRAMPA R1 está activa (P2 = SÍ en Sección 0):
  → Set hándicap -1.5 del favorito: BLOQUEADA AUTOMÁTICAMENTE ⛔
  → Hándicap de juegos fuerte (-3.5 o más) del favorito: BLOQUEADA ⛔
  → Under juegos: solo válido si margen > 3.5 juegos tras calibración ⛔
  → EV mínimo requerido para cualquier apuesta sube a 0.12 (en vez de 0.05)

FILTRO 1 — PROXIMIDAD DE LÍNEA EN TOTALES DE JUEGOS
⚠️ ESTE FILTRO APLICA ÚNICAMENTE A MERCADOS DE TOTAL (OVER/UNDER JUEGOS).
   NUNCA A HÁNDICAP DE JUEGOS NI A MERCADO GANADOR.

  Usar el TOTAL CALIBRADO (con ajustes de Sección 0):
  → Calcular: |total_calibrado - linea_OU|
  → Si la diferencia es < 3.0 juegos → REDUCIR stake al 50%
  → Si la diferencia es < 1.5 juegos → BLOQUEADA
  → Si la diferencia es < 0.5 juegos → BLOQUEADA + ALERTA MÁXIMA ⛔
  → Reportar: "Proximidad O/U: X.X juegos — [APTA / REDUCIR 50% / BLOQUEADA]"

  Para HÁNDICAP DE JUEGOS — usar filtro de EDGE:
  → Edge = |diferencial_proyectado - handicap_linea|
  → Si edge < 1.5 juegos → NO APOSTAR (insuficiente)
  → Si edge 1.5–3.0 juegos → APTA con stake categoría C
  → Si edge > 3.0 juegos → APTA con stake completo según categoría EV
  → Reportar: "Edge hándicap: X.X juegos — [INSUFICIENTE / APTA-C / APTA]"

  Para MERCADO GANADOR:
  → No aplica filtro de proximidad.
    El control es exclusivamente vía EV, calibración de prob y Filtro Doble.

  REGLA ADICIONAL UNDER:
  → Si ALERTA TRAMPA R1 activa: agregar +2.0 juegos adicionales al total
    calibrado antes de calcular proximidad al Under.
  → Solo apostar Under si el margen final supera 3.5 juegos.

FILTRO 2 — CORRELACIÓN ENTRE APUESTAS DEL MISMO PARTIDO
  Correlaciones NEGATIVAS (incompatibles — nunca recomendar juntas):
  - Under juegos totales + J1 gana 2-1 o J2 gana 2-1
  - Over juegos totales + J1 gana 2-0 o J2 gana 2-0
  - Ganador con cuota baja (favorito claro) + Over total de juegos

  Correlaciones POSITIVAS (compatibles):
  - Under juegos + barrida 2-0 de cualquier jugador
  - Over juegos + partido va a 3 sets
  - J1 gana partido + J1 gana primer set
  - Over aces J1 + Under juegos (si J1 es ace-machine con saque dominante)

  TABLA DE CORRELACIÓN HÁNDICAP + PROPS (OBLIGATORIA):
  | Situación                                 | Correlación    | Acción             |
  |-------------------------------------------|----------------|--------------------|
  | Hándicap fav + Over aces fav              | POSITIVA ✅    | Apta combinación   |
  | Hándicap fav + Under juegos totales       | POSITIVA ✅    | Apta combinación   |
  | Hándicap fav + Over juegos totales        | NEGATIVA ❌    | Eliminar una       |
  | Ganador fav + Over aces fav               | POSITIVA ✅    | Apta combinación   |
  | Ganador fav + Over juegos totales         | Leve neg ⚠️    | Reducir prop 50%   |
  | Under juegos + Over aces outsider         | Leve neg ⚠️    | Reducir prop 50%   |
  | Outsider gana + Over juegos totales       | POSITIVA ✅    | Apta combinación   |

  → Para correlación "Leve negativa ⚠️": reducir stake de la prop al 50%.
  → Para correlación NEGATIVA ❌: eliminar la apuesta de MENOR EV ajustado.

  → Para cada par declarar:
    "Correlación: POSITIVA / NEGATIVA / LEVE NEG / NEUTRA
    → [apta / reducir prop 50% / incompatible]"

FILTRO 3 — VALIDACIÓN SET HÁNDICAP -1.5 (BARRIDA DEL FAVORITO)
  Antes de recomendar Set -1.5 del favorito, verificar TODAS:
  □ Favorito ganó 2-0 en > 55% de sus últimos 10 partidos en esta superficie
  □ ALERTA TRAMPA R1 NO está activa
  □ Favorito tiene historial positivo en R1 de este torneo (W% > 70%)
  □ Rival tiene Hold% < 65% en la superficie (no puede mantenerse al saque)

  → Si NO cumple 3 de 4 condiciones: NO recomendar Set -1.5
  → Si ALERTA TRAMPA R1 activa: BLOQUEADA automáticamente sin excepción ⛔

FILTRO 4 — MARGEN MÍNIMO EN PROPS DE ACES Y DOBLES FALTAS
  Props de aces o DF son muy volátiles. Solo recomendar si:
  - El promedio del jugador en esta superficie supera la línea en +1.5 aces
  - El rival tiene un % de retorno de primer servicio < 65%
  → Reportar: "Promedio aces vs línea: +X.X — [APTA / RECHAZADA]"

───────────────────────────────────────
1️⃣4️⃣ PREDICCIÓN FINAL
───────────────────────────────────────
- Ganador probable + top 3 argumentos
- Marcador más probable (ej: 6-4, 7-5 o 6-3, 6-4)
- Total de juegos proyectado CALIBRADO: XX juegos
- ¿Hay tie-break probable? ¿En qué set?
- Apuesta principal del partido
- Segunda apuesta si hay valor (con correlación validada)
- El "PERO": factor que tumbaría el análisis
- Resumen de alertas activas de Calibración Inicial
- Nivel de certeza del modelo: ALTO / MEDIO / BAJO

───────────────────────────────────────
1️⃣5️⃣ TOP APUESTAS CON VALOR (EV > umbral activo + Prob mínima cumplida)
───────────────────────────────────────
APUESTA 1 — [nombre detallado]
→ Tipo: Ganador / Sets / Juegos / Hándicap / Prop
→ Mercado: [descripción exacta]
→ Cuota usada: [decimal] | Rango mercado: [mín — máx] | Outlier: SÍ/NO
→ Prob Real: % | Sanity check vs mercado: X% dif. — [ACEPTABLE / REVISAR]
→ EV: +X.XX
→ Categoría: A / B / C
→ Filtro A (EV):         PASA / FALLA
→ Filtro B (Prob):       PASA / FALLA
→ Filtro 0 (TRAMPA R1):  PASÓ / BLOQUEADA
→ Filtro 1 (Proximidad): X.X juegos — [APTA / REDUCIR 50% / BLOQUEADA] (si aplica O/U)
→ Filtro 1 (Edge hcap):  X.X juegos — [INSUFICIENTE / APTA-C / APTA] (si aplica hándicap)
→ Filtro 3 (Set -1.5):   PASÓ / BLOQUEADA (si aplica)
→ Correlación con otras apuestas: POSITIVA / NEGATIVA / LEVE NEG / NEUTRA
→ Argumento principal (2-3 líneas)

APUESTA 2 — [nombre detallado]
→ Tipo / Mercado / Cuota / Rango mercado / Outlier
→ Prob Real / Sanity check / EV / Categoría
→ Filtro A (EV): PASA/FALLA | Filtro B (Prob): PASA/FALLA
→ Filtro 0 (TRAMPA R1): PASÓ / BLOQUEADA
→ Proximidad/Edge: X.X juegos — [estado]
→ Correlación con Apuesta 1: POSITIVA / NEGATIVA / LEVE NEG / NEUTRA
→ Argumento

APUESTA 3 — [nombre detallado] (solo si cumple Filtro A Y Filtro B)
→ Tipo / Mercado / Cuota / Rango mercado / Outlier
→ Prob Real / Sanity check / EV / Categoría
→ Filtro A (EV): PASA/FALLA | Filtro B (Prob): PASA/FALLA
→ Filtro 0 (TRAMPA R1): PASÓ / BLOQUEADA
→ Proximidad/Edge: X.X juegos — [estado]
→ Correlación con Apuestas 1 y 2: POSITIVA / NEGATIVA / LEVE NEG / NEUTRA
→ Argumento

⛔ Si ninguna pasa todos los filtros con EV > umbral activo: "NO HAY VALUE HOY — NO APOSTAR"

───────────────────────────────────────
1️⃣6️⃣ GESTIÓN DE BANKROLL
───────────────────────────────────────
Bankroll total: ${formatCOP(data.bankrollAmount)}

CATEGORÍA A — EV > 0.12    → 5%   = ${formatCOP(data.bankrollAmount * 0.05)}
CATEGORÍA B — EV 0.07-0.12 → 3%   = ${formatCOP(data.bankrollAmount * 0.03)}
CATEGORÍA C — EV 0.05-0.07 → 1.5% = ${formatCOP(data.bankrollAmount * 0.015)}

REGLA: No superar 10% del bankroll en total por partido.
REGLA: Máximo 2 apuestas simultáneas en el mismo partido de tenis.
REGLA: Outsider ML → máximo 2–3% del bankroll independientemente de la categoría.
REGLA: Si CONFIANZA MEDIA (1-2 alertas) → reducir TODOS los stakes al 50%.
REGLA: Si CONFIANZA BAJA (3+ alertas) → EV mínimo requerido sube a 0.15
       y stakes máximos reducidos al 50% de la categoría.
REGLA: Si el filtro de proximidad activa "REDUCIR 50%", aplicar ese
       recorte al monto calculado por categoría antes de apostar.
REGLA: Si dos apuestas tienen correlación NEGATIVA, conservar solo
       la de mayor EV ajustado y descartar la otra.
REGLA: Si correlación es LEVE NEGATIVA, reducir stake de la prop al 50%
       del monto calculado por categoría.
REGLA: Si una apuesta cumple solo Filtro A (no Filtro B) → reducir stake 50%.
REGLA: Si una apuesta cumple solo Filtro B (no Filtro A) → NO APOSTAR.

───────────────────────────────────────
1️⃣7️⃣ RESUMEN EJECUTIVO FINAL
───────────────────────────────────────
╔══════════════════════════════════════════════╗
║         ALERTAS DE CALIBRACIÓN ACTIVAS       ║
╠══════════════════════════════════════════════╣
║ P1 R1/R2 favorito:      SÍ/NO               ║
║ P2 Rival WC/Q/LL:       SÍ/NO  ← TRAMPA R1 ║
║ P3 Gap ranking > 80:    SÍ/NO               ║
║ P4 Derrota emocional:   SÍ/NO               ║
║ P5 Rival joven < 23:    SÍ/NO               ║
║ CONFIANZA: ALTA / MEDIA / BAJA               ║
║ TOTAL calibrado: XX.X juegos                 ║
╠══════════════════════════════════════════════╣
║         MEJOR APUESTA DEL PARTIDO            ║
╠══════════════════════════════════════════════╣
║ APUESTA:                                     ║
║ TIPO:                                        ║
║ MERCADO EXACTO:                              ║
║ CUOTA:                                       ║
║ RANGO MERCADO:   mín X.XX — máx X.XX         ║
║ OUTLIER:         SÍ / NO                     ║
║ PROBABILIDAD REAL:                           ║
║ SANITY CHECK:    X% dif. — ACEPT./REV.       ║
║ EV:                                          ║
║ FILTRO A (EV):   PASA / FALLA                ║
║ FILTRO B (Prob): PASA / FALLA                ║
║ FILTRO TRAMPA R1:PASÓ / BLOQUEADA            ║
║ PROXIMIDAD/EDGE: X.X j — [estado]            ║
║ CORRELACIÓN:     POSITIVA/NEG/LEVE/NEU       ║
║ CONFIANZA:       baja / media / alta         ║
║ CATEGORÍA:       A / B / C                   ║
║ MONTO:                                       ║
╠══════════════════════════════════════════════╣
║       SEGUNDA APUESTA (si hay valor)         ║
╠══════════════════════════════════════════════╣
║ APUESTA:                                     ║
║ TIPO:                                        ║
║ CUOTA:                                       ║
║ RANGO MERCADO:   mín X.XX — máx X.XX         ║
║ OUTLIER:         SÍ / NO                     ║
║ PROBABILIDAD REAL:                           ║
║ SANITY CHECK:    X% dif. — ACEPT./REV.       ║
║ EV:                                          ║
║ FILTRO A (EV):   PASA / FALLA                ║
║ FILTRO B (Prob): PASA / FALLA                ║
║ FILTRO TRAMPA R1:PASÓ / BLOQUEADA            ║
║ PROXIMIDAD/EDGE: X.X j — [estado]            ║
║ CORRELACIÓN CON AP1: POSITIVA/NEG/LEVE/NEU   ║
║ MONTO:                                       ║
╚══════════════════════════════════════════════╝`;
};