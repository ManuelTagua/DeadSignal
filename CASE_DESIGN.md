# CASE_DESIGN: The Helix Incident

Documento interno para desarrolladores. No se muestra dentro del juego.

## Resumen Del Caso

El Capítulo 1 reconstruye el apagón de Helix Labs a partir de documentos, correos, logs del sistema y evidencias desbloqueadas. La verdad canónica vive en `src/lib/cases/helixIncidentSolution.js`; las mecánicas de cronología, contradicciones, conexiones, sospechosos e informe final deben consultar esa fuente.

## Cronología Correcta

1. Ventana de mantenimiento preparada
2. Ocupación del subnivel C cambia de 0 a 44
3. Acceso al Archivo Este con vectores contradictorios
4. Login de N-KADE-17 desde terminal C-17
5. Fallo de integridad en cámaras
6. Pérdida de conexión con el relay externo

## Contradicciones Válidas

1. Delta de plantilla de empleados + Anomalía de login N-KADE-17
   Resultado: La credencial aparece activa cuando el empleado estaba fuera de turno.

2. Informe inicial del incidente + Log crítico NET-900
   Resultado: El relay cae después de la ventana oficial de mantenimiento.

## Conexiones Válidas

1. Patrón de golpes en la sala de servidores + Fragmento cifrado 01
   Resultado: KNOCK-3 era una frase de acceso.

2. Brecha del Archivo Este + Mapa de acceso del Archivo Este
   Resultado: Existía una ruta física alternativa hacia el Archivo Este.

3. Credencial duplicada + Anomalía de login N-KADE-17
   Resultado: La misma credencial aparece vinculada a una sesión imposible.

4. Informe de fallo del relay + Informe de mantenimiento del relay
   Resultado: El fallo coincide con una manipulación durante mantenimiento.

## Sospechoso Correcto

Sospechoso: N-KADE-17

Motivo: La credencial aparece activa fuera de turno desde una terminal relevante.

## Respuestas Finales

- ¿Qué provocó el apagón?
  Manipulación del relay externo durante mantenimiento.

- ¿Qué zona fue clave?
  Archivo Este y sala de servidores.

- ¿Qué credencial es sospechosa?
  N-KADE-17.

- ¿Qué prueba demuestra acceso interno?
  Credencial duplicada + anomalía de login.

- ¿Incidente accidental o deliberado?
  Deliberado.

Las respuestas ejecutables del informe final se definen en `HELIX_INCIDENT_SOLUTION.finalReportAnswers`. No duplicar respuestas correctas en componentes o módulos de UI.
