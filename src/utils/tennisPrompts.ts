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
1️⃣ FORMA RECIENTE
───────────────────────────────────────
Para CADA jugador — buscar en Sofascore o Flashscore:

ÚLTIMOS 5 PARTIDOS:
- Fecha · Torneo · Superficie · Ronda · Rival · Resultado (sets) · Duración (min)
- Descanso entre partidos (horas desde el anterior)

ÚLTIMOS 10 PARTIDOS:
- Record W/L global
- Record W/L en esta superficie
- Record W/L en torneos de esta categoría
- Sets ganados vs perdidos (ratio)
- % partidos donde ganó el primer set
- % partidos que ganó habiendo perdido el primer set (remontadas)

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
- ¿Tuvo partidos largos (>2h) en rondas previas?
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

MERCADO GANADOR DEL PARTIDO (1X2):
- ${data.homeTeam}: [cuota] → prob implícita: %
- ${data.awayTeam}: [cuota] → prob implícita: %
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

MÉTODO 1 — Modelo matemático de saque/resto:
  p = prob de ganar un punto al saque de J1
  q = prob de ganar un punto al saque de J2
  → Prob de ganar un juego al saque = f(p)
  → Prob de ganar un set = f(prob juego, tie-break)
  → Prob de ganar el partido = f(prob set, formato)
  Usar Hold% y Break% reales de cada jugador en esta superficie.

MÉTODO 2 — Ponderación multi-factor (ajustar pesos si hay lesión):
  - Forma reciente en superficie        → 20%
  - H2H en esta superficie y ronda      → 15%
  - Estadísticas de servicio            → 15%
  - Estadísticas de resto               → 10%
  - Fatiga y carga acumulada            → 15%
  - Matchup de estilos                  → 10%
  - ELO específico de superficie        → 10%
  - Lesiones y estado físico            → 5%

MÉTODO 3 — ELO ajustado por superficie:
  - ELO J1 en [superficie] vs ELO J2 en [superficie]
  - Fórmula Elo: E(J1) = 1 / (1 + 10^((ELO_J2 - ELO_J1) / 400))

RESULTADO CONSOLIDADO:
  ${data.homeTeam} gana el partido:       X%
  ${data.awayTeam} gana el partido:       X%
  Partido va a sets máximos:              X%
  ${data.homeTeam} gana 2-0 (o 3-0):     X%
  ${data.homeTeam} gana 2-1 (o 3-1/3-2): X%
  ${data.awayTeam} gana 2-0 (o 3-0):     X%
  ${data.awayTeam} gana 2-1 (o 3-1/3-2): X%
  Total de juegos proyectado:             XX.X juegos
  Tie-break en al menos un set:           X%

───────────────────────────────────────
1️⃣3️⃣ DETECTAR VALUE BETS
───────────────────────────────────────
EV = (prob_real × cuota_decimal) - 1

MERCADO GANADOR:
| Apuesta         | Prob Real | Cuota | EV | ¿Valor? |
|-----------------|-----------|-------|----|---------|
| J1 gana partido |     %     |       |    | ✅/❌   |
| J2 gana partido |     %     |       |    | ✅/❌   |

MERCADO SETS:
| Apuesta     | Prob Real | Cuota | EV | ¿Valor? |
|-------------|-----------|-------|----|---------|
| J1 gana 2-0 |     %     |       |    | ✅/❌   |
| J1 gana 2-1 |     %     |       |    | ✅/❌   |
| J2 gana 2-0 |     %     |       |    | ✅/❌   |
| J2 gana 2-1 |     %     |       |    | ✅/❌   |

MERCADO JUEGOS TOTALES:
| Apuesta          | Prob Real | Cuota | EV | ¿Valor? |
|------------------|-----------|-------|----|---------|
| Over X.5 juegos  |     %     |       |    | ✅/❌   |
| Under X.5 juegos |     %     |       |    | ✅/❌   |

MERCADO PRIMER SET:
| Apuesta           | Prob Real | Cuota | EV | ¿Valor? |
|-------------------|-----------|-------|----|---------|
| J1 gana 1er set   |     %     |       |    | ✅/❌   |
| J2 gana 1er set   |     %     |       |    | ✅/❌   |
| Tie-break 1er set |     %     |       |    | ✅/❌   |

HÁNDICAP DE JUEGOS:
| Apuesta          | Prob Real | Cuota | EV | ¿Valor? |
|------------------|-----------|-------|----|---------|
| J1 -X.5 juegos   |     %     |       |    | ✅/❌   |
| J2 +X.5 juegos   |     %     |       |    | ✅/❌   |

PROPS:
| Apuesta               | Prob Real | Cuota | EV | ¿Valor? |
|-----------------------|-----------|-------|----|---------|
| Aces Over X.5 (J1)    |     %     |       |    | ✅/❌   |
| Aces Over X.5 (J2)    |     %     |       |    | ✅/❌   |
| DF Over X.5 (J1 / J2) |     %     |       |    | ✅/❌   |

───────────────────────────────────────
⚠️ FILTROS ANTI-ERROR OBLIGATORIOS (aplicar ANTES de confirmar cualquier apuesta)
───────────────────────────────────────

FILTRO 1 — PROXIMIDAD DE LÍNEA EN TOTALES DE JUEGOS
El modelo de tenis tiene un margen de incertidumbre de ±2 juegos. Si el
total proyectado está a menos de 1.5 juegos de la línea O/U, el EV real
es menor al calculado porque el rango de incertidumbre cruza la línea.

  → Calcular: |juegos_proyectados - linea_OU|
  → Si la diferencia es < 1.5 juegos → reducir stake al 50% o NO APOSTAR
  → Si la diferencia es < 0.5 juegos → NO APOSTAR bajo ninguna circunstancia
  → Reportar: "Proximidad: X.X juegos — [APTA / REDUCIR 50% / BLOQUEADA]"

FILTRO 2 — CORRELACIÓN ENTRE APUESTAS DEL MISMO PARTIDO
Antes de recomendar 2+ apuestas simultáneas, verificar que el escenario
que las hace ganar sea el mismo, no contradictorio.

  Correlaciones NEGATIVAS en tenis (incompatibles — nunca recomendar juntas):
  - Under juegos totales + J1 gana 2-1 o J2 gana 2-1
    (partido de 3 sets siempre produce más juegos que uno de 2)
  - Over juegos totales + J1 gana 2-0 o J2 gana 2-0
    (barrida en 2 sets reduce el total de juegos posibles)
  - Ganador del partido con cuota baja + Over total de juegos
    (favorito claro tiende a ganar rápido = menos juegos)

  Correlaciones POSITIVAS en tenis (compatibles):
  - Under juegos + barrida 2-0 de cualquier jugador
  - Over juegos + partido va a 3 sets
  - J1 gana + J1 gana primer set (mismo escenario)
  - Over aces J1 + Under juegos (si J1 es ace-machine puede ganar rápido)

  → Para cada par de apuestas declarar:
    "Correlación: POSITIVA / NEGATIVA / NEUTRA — [apta / incompatible]"
  → Si es NEGATIVA → conservar solo la de mayor EV ajustado

FILTRO 3 — MARGEN MÍNIMO EN PROPS DE ACES Y DOBLES FALTAS
  Props de aces o DF son muy volátiles. Solo recomendar si:
  - El promedio del jugador en esta superficie supera la línea en +1.5 aces
  - El rival tiene un % de retorno de primer servicio < 65% (favorece aces)
  → Reportar: "Promedio aces vs línea: +X.X — [APTA / RECHAZADA]"

───────────────────────────────────────
1️⃣4️⃣ PREDICCIÓN FINAL
───────────────────────────────────────
- Ganador probable + top 3 argumentos
- Marcador más probable (ej: 6-4, 7-5 o 6-3, 6-4)
- Total de juegos proyectado: XX juegos
- ¿Hay tie-break probable? ¿En qué set?
- Apuesta principal del partido
- Segunda apuesta si hay valor (con correlación validada)
- El "PERO": factor que tumbaría el análisis
- Nivel de certeza del modelo: ALTO / MEDIO / BAJO

───────────────────────────────────────
1️⃣5️⃣ TOP APUESTAS CON VALOR (EV > 0.05)
───────────────────────────────────────
APUESTA 1 — [nombre detallado]
→ Tipo: Ganador / Sets / Juegos / Hándicap / Prop
→ Mercado: [descripción exacta]
→ Cuota: [decimal]
→ Prob Real: %
→ EV: +X.XX
→ Categoría: A / B / C
→ Proximidad línea: X.X juegos — [APTA / REDUCIR 50% / BLOQUEADA]
→ Correlación con otras apuestas: POSITIVA / NEGATIVA / NEUTRA
→ Argumento principal (2-3 líneas)

APUESTA 2 — [nombre detallado]
→ Tipo / Mercado / Cuota / Prob / EV / Categoría
→ Proximidad línea: X.X juegos — [APTA / REDUCIR 50% / BLOQUEADA]
→ Correlación con Apuesta 1: POSITIVA / NEGATIVA / NEUTRA
→ Argumento

APUESTA 3 — [nombre detallado] (solo si EV > 0.05)
→ Tipo / Mercado / Cuota / Prob / EV / Categoría
→ Proximidad línea: X.X juegos — [APTA / REDUCIR 50% / BLOQUEADA]
→ Correlación con Apuestas 1 y 2: POSITIVA / NEGATIVA / NEUTRA
→ Argumento

⛔ Si ninguna EV > 0.05: "NO HAY VALUE HOY — NO APOSTAR"

───────────────────────────────────────
1️⃣6️⃣ GESTIÓN DE BANKROLL
───────────────────────────────────────
Bankroll total: ${formatCOP(data.bankrollAmount)}

CATEGORÍA A — EV > 0.12    → 5%   = ${formatCOP(data.bankrollAmount * 0.05)}
CATEGORÍA B — EV 0.07-0.12 → 3%   = ${formatCOP(data.bankrollAmount * 0.03)}
CATEGORÍA C — EV 0.05-0.07 → 1.5% = ${formatCOP(data.bankrollAmount * 0.015)}

REGLA: No superar 10% del bankroll en total por partido.
REGLA: Máximo 2 apuestas simultáneas en el mismo partido de tenis
       (mayor varianza que el baloncesto por naturaleza de sets).
REGLA: Si el filtro de proximidad activa "REDUCIR 50%", aplicar ese
       recorte al monto calculado por categoría antes de apostar.
REGLA: Si dos apuestas tienen correlación NEGATIVA, conservar solo
       la de mayor EV ajustado y descartar la otra.

───────────────────────────────────────
1️⃣7️⃣ RESUMEN EJECUTIVO FINAL
───────────────────────────────────────
╔══════════════════════════════════════════╗
║       MEJOR APUESTA DEL PARTIDO          ║
╠══════════════════════════════════════════╣
║ APUESTA:                                 ║
║ TIPO:                                    ║
║ MERCADO EXACTO:                          ║
║ CUOTA:                                   ║
║ PROBABILIDAD REAL:                       ║
║ EV:                                      ║
║ PROXIMIDAD LÍNEA:   X.X j — [estado]    ║
║ CORRELACIÓN:        POSITIVA/NEG/NEUTRA  ║
║ CONFIANZA: baja / media / alta           ║
║ CATEGORÍA: A / B / C                     ║
║ MONTO:                                   ║
╠══════════════════════════════════════════╣
║       SEGUNDA APUESTA (si hay valor)     ║
╠══════════════════════════════════════════╣
║ APUESTA:                                 ║
║ TIPO:                                    ║
║ CUOTA:                                   ║
║ PROBABILIDAD REAL:                       ║
║ EV:                                      ║
║ PROXIMIDAD LÍNEA:   X.X j — [estado]    ║
║ CORRELACIÓN CON AP1: POSITIVA/NEG/NEUTRA ║
║ MONTO:                                   ║
╚══════════════════════════════════════════╝`;
};