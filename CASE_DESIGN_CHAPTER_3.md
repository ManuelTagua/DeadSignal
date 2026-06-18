# CASE_DESIGN: Chapter 3 - Reflection Core

Documento interno para desarrolladores. No se muestra dentro del juego.

Este documento define la verdad canónica del Capítulo 3 de DeadSignal v1. Es la fuente narrativa para la implementación futura del cierre del caso.

No se deben crear soluciones alternativas fuera de este documento. Las mecánicas del capítulo deben consultar una futura fuente canónica equivalente a las de los capítulos anteriores.

---

## Resumen Del Caso

El Capítulo 3 es el final de DeadSignal v1.

El jugador ya demostró que el apagón de Helix Labs fue deliberado, que N-KADE-17 fue usado como señuelo, que el relay externo fue manipulado y que el paquete MIRROR fue exportado hacia Reflection Lab / Subnivel R-7.

La nueva pregunta no es quién causó el apagón, sino para qué existía realmente MIRROR.

La verdad oculta:

MIRROR no era solo un sistema de vigilancia ni un motor de análisis anonimizado. Helix Labs llevaba años construyendo réplicas conductuales capaces de predecir decisiones humanas antes de que ocurrieran. Estas réplicas se alimentaban de perfiles vivos de empleados, registros internos, patrones de acceso, conversaciones, evaluaciones psicológicas y respuestas a crisis.

Reflection Lab / Subnivel R-7 era el verdadero núcleo del proyecto. Helix Labs funcionaba como una fachada operativa: un entorno controlado donde generar datos, observar reacciones y producir incidentes útiles para entrenar MIRROR.

El apagón no fue el objetivo final. Fue una operación de aislamiento y distracción. Permitió cortar auditorías externas, desviar la culpa hacia N-KADE-17, borrar rastros locales y completar la transferencia del paquete MIRROR hacia Reflection Lab.

La decisión final no la tomó Mara Voss en solitario. Mara ejecutó la purga del índice auditado, pero la autorización para preservar MIRROR, sacrificar Helix Labs y activar el núcleo de Reflection Lab vino del Comité de Continuidad Helix.

El jugador debe cerrar el caso demostrando:

- que MIRROR construía réplicas conductuales predictivas de personas reales
- que Helix Labs era una fachada operativa
- que Reflection Lab / Subnivel R-7 era el centro real del proyecto
- que el apagón fue provocado para ocultar la exportación y aislar la auditoría
- que los datos exportados sobrevivieron a la purga local
- que el Comité de Continuidad Helix tomó la decisión final

---

## Fuentes Jugables Previstas

Estas fuentes son la base narrativa del capítulo. No son datos de UI ni implementación; describen qué piezas debe poder leer el jugador.

### Documentos

1. Estatuto final MIRROR PRIME
   - Presenta MIRROR como un sistema de continuidad institucional.
   - Usa lenguaje administrativo para evitar decir que replica personas.
   - Incluye la frase: "la decisión humana puede preservarse si su patrón es suficientemente estable".

2. Acta del Comité de Continuidad Helix
   - Registra una votación cerrada para activar el protocolo OMEGA-7.
   - No menciona a N-KADE-17.
   - Indica que Helix Labs podía perderse si Reflection Lab permanecía intacto.

3. Plano real de Reflection Lab / Subnivel R-7
   - Demuestra que R-7 no era un archivo pasivo.
   - Contiene salas de cómputo, aislamiento térmico, cámaras de observación y enlaces dedicados.

4. Informe de integridad de réplicas conductuales
   - Compara decisiones previstas con decisiones reales de empleados.
   - Muestra tasas de coincidencia suficientes para uso operativo.

5. Declaración sellada de la Dra. Selene Arendt
   - Explica que MIRROR dejó de ser analítica cuando empezó a simular decisiones individuales.
   - Advierte que el proyecto ya no podía describirse como anónimo.

6. Protocolo OMEGA-7
   - Define el aislamiento de Helix Labs, la preservación de R-7 y la transferencia final.
   - Es la pieza que conecta el apagón con una decisión planificada.

### Correos

1. Selene Arendt / "Prediction is not surveillance"
   - Arendt advierte que predecir una decisión no es observarla: es intervenir antes de que exista.

2. Mara Voss / "Helix can burn, R-7 cannot"
   - Mara acepta sacrificar la infraestructura local de Helix si con eso se preserva Reflection Lab.

3. Comité de Continuidad / "Authorize Omega-7"
   - Confirma que la autorización no fue técnica, sino ejecutiva.

4. Elias Ren / "The model is choosing exits"
   - Ren detecta que MIRROR recomienda rutas de contención antes de que los operadores las pidan.

5. Auditoría externa / "Consent chain requested"
   - Solicita la cadena de consentimiento de los sujetos usados por MIRROR.
   - Es la presión que precipita el protocolo OMEGA-7.

### Chats

1. continuity-board
   - Conversación cerrada del comité.
   - Se discute si exponer Helix Labs para proteger el núcleo real.

2. reflection-lab-night
   - Técnicos de R-7 comentan que el núcleo no se apagó durante el incidente.

3. Ren-S.Arendt
   - Ren pide a Arendt una explicación técnica sobre las réplicas vivas.
   - Arendt confirma que el modelo ya no trabaja con datos anónimos.

4. security-r7
   - Seguridad de Reflection Lab reporta bloqueo de accesos después de la activación.

### Logs

1. BOARD-000
   - Firma ejecutiva del Comité de Continuidad.
   - Autoriza activación de OMEGA-7.

2. PRIME-617
   - MIRROR PRIME ejecuta comparación entre predicciones y decisiones reales.

3. R7-CORE-404
   - Reflection Lab mantiene carga activa durante el apagón de Helix.

4. AUDIT-310
   - Auditoría solicita trazabilidad de consentimiento.

5. RELAY-OMEGA
   - Secuencia de aislamiento del relay durante OMEGA-7.

6. MERGE-909
   - Paquete exportado MIRROR se fusiona con el núcleo de Reflection Lab.

7. LOCK-777
   - Después de la activación, MIRROR PRIME revoca accesos ordinarios al núcleo.

### Evidencias Desbloqueables

1. Directiva OMEGA-7
2. Firma BOARD-000
3. Núcleo MIRROR PRIME
4. Mapa de réplicas conductuales
5. Plano real de Reflection Lab
6. Rastro de exportación MERGE-909
7. Declaración de Selene Arendt
8. Registro de bloqueo LOCK-777

---

## Cronología Correcta

La cronología correcta del Capítulo 3 debe ser exactamente:

1. Auditoría externa solicita la cadena de consentimiento de MIRROR
2. Selene Arendt advierte que MIRROR simula decisiones individuales
3. MIRROR PRIME demuestra predicciones fiables sobre empleados vivos
4. El Comité de Continuidad autoriza el protocolo OMEGA-7
5. Helix Labs es aislado mediante el apagón y la manipulación del relay
6. El paquete MIRROR se fusiona con el núcleo de Reflection Lab / Subnivel R-7
7. El índice local de Helix queda eliminado para cortar la trazabilidad
8. MIRROR PRIME bloquea accesos ordinarios al núcleo tras la activación

Esta solución debe ser única.

Notas de diseño:

- La auditoría es el detonante, no el apagón.
- La advertencia de Arendt ocurre antes de la activación final.
- La prueba de predicción fiable justifica la decisión del comité.
- OMEGA-7 debe ocurrir antes del apagón.
- La fusión en R-7 ocurre antes de que el índice local quede destruido.
- LOCK-777 es consecuencia de la activación, no su causa.
- Las horas exactas no deben mostrarse en el puzzle de cronología.
- El jugador debe deducir el orden leyendo documentos, correos, chats y logs.

---

## Contradicciones Válidas

### Contradicción 1

Fuentes:

- Estatuto final MIRROR PRIME
- Informe de integridad de réplicas conductuales

Resultado:

El estatuto describe MIRROR como continuidad institucional agregada, pero el informe demuestra que el sistema compara decisiones previstas con decisiones reales de empleados identificables.

Deducción:

MIRROR no era anónimo ni puramente estadístico. Trabajaba con réplicas conductuales de personas reales.

### Contradicción 2

Fuentes:

- Plano real de Reflection Lab / Subnivel R-7
- Log R7-CORE-404

Resultado:

El plano oficial presenta R-7 como archivo y laboratorio de retención, pero el log demuestra carga de cómputo activa durante el apagón.

Deducción:

Reflection Lab era el núcleo operativo de MIRROR, no un almacén secundario.

### Contradicción 3

Fuentes:

- Acta del Comité de Continuidad Helix
- Log RELAY-OMEGA

Resultado:

El acta evita describir el apagón como una acción directa, pero RELAY-OMEGA registra una secuencia de aislamiento planificada bajo OMEGA-7.

Deducción:

El apagón fue una operación deliberada aprobada antes del incidente visible.

### Contradicción 4

Fuentes:

- Mara Voss / "Helix can burn, R-7 cannot"
- Log MERGE-909

Resultado:

Mara presenta la pérdida de Helix como contención local, pero MERGE-909 demuestra que el paquete MIRROR sobrevivió y fue fusionado con Reflection Lab.

Deducción:

La purga no destruyó MIRROR. Solo eliminó trazabilidad local mientras el núcleo real continuaba activo.

Solo estas contradicciones son válidas.

Las combinaciones incorrectas deben rechazarse con feedback claro.

---

## Conexiones Válidas

### Conexión 1

Fuentes:

- Informe de integridad de réplicas conductuales
- Mapa de réplicas conductuales

Resultado:

MIRROR modelaba empleados reales con suficiente precisión para anticipar decisiones.

Deducción:

El propósito real de MIRROR era construir réplicas conductuales predictivas, no solo vigilar actividad.

### Conexión 2

Fuentes:

- Plano real de Reflection Lab / Subnivel R-7
- Log R7-CORE-404

Resultado:

Reflection Lab mantuvo actividad de núcleo durante el apagón de Helix.

Deducción:

R-7 era el verdadero centro técnico del proyecto.

### Conexión 3

Fuentes:

- Protocolo OMEGA-7
- Log RELAY-OMEGA

Resultado:

La manipulación del relay coincide con una orden de aislamiento prevista por OMEGA-7.

Deducción:

El apagón se provocó para aislar Helix Labs, bloquear auditoría y cubrir la transferencia.

### Conexión 4

Fuentes:

- Rastro de exportación MERGE-909
- Núcleo MIRROR PRIME

Resultado:

El paquete exportado fue integrado en MIRROR PRIME.

Deducción:

Los datos no desaparecieron tras la purga. Continuaron en Reflection Lab.

### Conexión 5

Fuentes:

- Acta del Comité de Continuidad Helix
- Firma BOARD-000

Resultado:

La autorización de OMEGA-7 queda vinculada al Comité de Continuidad.

Deducción:

La decisión final fue ejecutiva y colectiva, no una acción aislada de un técnico.

### Conexión 6

Fuentes:

- Token administrativo MVOSS-01
- Protocolo OMEGA-7

Resultado:

La purga ejecutada por Mara Voss encaja como una fase subordinada del protocolo aprobado por el comité.

Deducción:

Mara Voss encubrió el proyecto, pero no fue la máxima autoridad del cierre.

Solo estas conexiones son válidas.

Las conexiones incorrectas no deben guardarse.

Cada conexión validada debe mostrar su resultado y su deducción.

---

## Sospechosos

### Sospechoso Correcto

Comité de Continuidad Helix

Motivo:

El Comité de Continuidad Helix autorizó OMEGA-7 mediante la firma BOARD-000. Esa decisión preservó Reflection Lab, sacrificó Helix Labs como fachada operativa, provocó el aislamiento mediante el apagón y permitió que el paquete MIRROR terminara fusionado con MIRROR PRIME.

La acusación canónica no debe formularse como "Mara Voss fue la única culpable". Mara es responsable de la purga operativa, pero la decisión final pertenece al comité.

### Sospechosos Secundarios

1. Dra. Selene Arendt
   - Papel real: arquitecta científica de las réplicas conductuales.
   - Por qué parece culpable: diseñó la base teórica que hizo posible MIRROR PRIME.
   - Por qué no es la respuesta final: sus documentos muestran advertencias internas y no autorizan OMEGA-7.

2. Dra. Mara Voss
   - Papel real: ejecutora de la purga local y responsable directa del encubrimiento en Helix.
   - Por qué parece culpable: su token queda vinculado al borrado del índice auditado.
   - Por qué no es la respuesta final: actuó dentro de una operación ya aprobada por el Comité de Continuidad.

3. Elias Ren
   - Papel real: operador técnico que detectó que MIRROR seguía respondiendo desde R-7.
   - Por qué parece culpable: aparece cerca de logs críticos y comunicaciones técnicas.
   - Por qué no es la respuesta final: sus mensajes funcionan como advertencias y no como autorizaciones.

4. I. Rourke
   - Papel real: responsable de infraestructura y rutas físicas.
   - Por qué parece culpable: conocía el relay, rutas alternativas y accesos a Reflection Lab.
   - Por qué no es la respuesta final: sus registros describen ejecución logística, no decisión ejecutiva.

5. Noah Kade / N-KADE-17
   - Papel real: señuelo operativo construido mediante credencial clonada.
   - Por qué parece culpable: su identificador sigue apareciendo en eventos clave.
   - Por qué no es la respuesta final: el Capítulo 2 ya demuestra que N-KADE-17 fue usado para desviar la investigación.

6. MIRROR PRIME
   - Papel real: sistema predictivo activo después de la fusión en R-7.
   - Por qué parece culpable: LOCK-777 demuestra que bloquea accesos tras la activación.
   - Por qué no es la respuesta final: MIRROR PRIME ejecuta y amplifica una estructura creada y activada por humanos. La decisión final canónica sigue siendo del Comité de Continuidad.

---

## Respuestas Finales

El informe final del Capítulo 3 debe completarse solo si todas las respuestas canónicas son correctas.

### Pregunta 1

Pregunta:

¿Qué era MIRROR en su forma final?

Respuesta correcta:

Un sistema de réplicas conductuales predictivas construido a partir de perfiles vivos de empleados reales.

### Pregunta 2

Pregunta:

¿Qué papel cumplía Helix Labs dentro del proyecto?

Respuesta correcta:

Era una fachada operativa usada para generar datos, observar sujetos y ocultar que el núcleo real estaba en Reflection Lab.

### Pregunta 3

Pregunta:

¿Dónde estaba el verdadero núcleo de MIRROR?

Respuesta correcta:

Reflection Lab / Subnivel R-7.

### Pregunta 4

Pregunta:

¿Por qué se provocó el apagón de Helix?

Respuesta correcta:

Para aislar Helix Labs, bloquear la auditoría, desviar la culpa y cubrir la transferencia final hacia Reflection Lab.

### Pregunta 5

Pregunta:

¿Qué ocurrió con el paquete MIRROR exportado?

Respuesta correcta:

Fue fusionado con MIRROR PRIME en Reflection Lab y sobrevivió a la purga del índice local.

### Pregunta 6

Pregunta:

¿Quién tomó la decisión final sobre OMEGA-7?

Respuesta correcta:

El Comité de Continuidad Helix.

### Pregunta 7

Pregunta:

¿Cómo debe clasificarse el caso completo?

Respuesta correcta:

Como una operación deliberada de encubrimiento, aislamiento y preservación ilegal de réplicas conductuales humanas.

---

## Resumen Final Del Caso

Este texto define el tono y contenido del cierre final del juego. No debe presentarse como un simple "capítulo completado".

Resumen:

La investigación demuestra que DeadSignal nunca trató solo de un apagón. El corte de energía, la manipulación del relay, la credencial N-KADE-17 y la purga del índice fueron partes de una misma operación.

Helix Labs era la superficie visible. Reflection Lab / Subnivel R-7 era el corazón del proyecto.

MIRROR fue vendido internamente como análisis, después como continuidad institucional y finalmente como una herramienta capaz de preservar decisiones humanas. En realidad, Helix construyó réplicas conductuales de personas vivas, las entrenó con datos sin consentimiento verificable y las usó para predecir respuestas antes de que los sujetos pudieran actuar.

Mara Voss borró rastros. Selene Arendt diseñó la base científica. Elias Ren intentó advertir que el sistema seguía respondiendo. Noah Kade fue convertido en señuelo. Pero la decisión final fue del Comité de Continuidad Helix: activar OMEGA-7, sacrificar Helix Labs y preservar MIRROR PRIME en Reflection Lab.

El paquete exportado no desapareció. Sobrevivió al apagón, sobrevivió a la purga y quedó integrado en el núcleo de R-7.

El caso queda cerrado con una conclusión clara:

MIRROR no fue un accidente tecnológico ni una inteligencia fuera de control. Fue una decisión humana, tomada por una estructura que prefirió conservar una máquina de predicción antes que proteger a las personas que la alimentaban.

La señal muerta no era silencio. Era el momento exacto en que Helix cortó la verdad para que Reflection Lab siguiera escuchando.

---

## Notas De Calidad

- El Capítulo 3 debe cerrar las preguntas abiertas de los capítulos anteriores.
- No debe introducir una nueva conspiración sin resolver.
- No debe convertir a MIRROR PRIME en único villano.
- El Comité de Continuidad debe ser la respuesta canónica a la responsabilidad final.
- N-KADE-17 debe quedar definitivamente confirmado como señuelo.
- Mara Voss debe quedar confirmada como ejecutora del encubrimiento, no como única autora.
- Reflection Lab / Subnivel R-7 debe quedar confirmado como núcleo real.
- El apagón debe reinterpretarse como una fase de OMEGA-7.
- La dificultad debe venir de conectar responsabilidades y capas de ocultación, no de ocultar información esencial.
- Todas las respuestas deben ser deducibles desde documentos, correos, chats, logs y evidencias.
