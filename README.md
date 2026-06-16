# DeadSignal

DeadSignal es una experiencia narrativa e investigativa construida como un sistema operativo secreto. El usuario entra en un entorno abandonado y reconstruye un incidente analizando archivos, correos, chats, media y registros del sistema.

La primera version incluye una historia fija: **The Helix Incident**.

## Stack

- SvelteKit
- JavaScript
- Tailwind CSS
- Prisma
- SQLite

## Arranque

```bash
npm install
npm run db:migrate -- --name init
npm run db:seed
npm run dev
```

La app quedara disponible normalmente en `http://localhost:5173`.

## Scripts

```bash
npm run dev          # servidor de desarrollo
npm run build        # build de produccion con adapter-node
npm run preview      # preview del build
npm run check        # validacion Svelte
npm run db:generate  # genera Prisma Client
npm run db:migrate   # crea/aplica migraciones
npm run db:push      # sincroniza esquema sin migracion
npm run db:seed      # inserta datos de ejemplo
npm run db:reset     # reinicia la base de datos local
```

Los scripts de migracion usan `RUST_LOG=info` via `cross-env` para evitar un fallo silencioso conocido del schema engine de Prisma 7 con SQLite.

## Estructura

```text
prisma/
  schema.prisma       # modelos Case, Email, Chat, Document, Media, Log
  seed.js             # datos fijos de The Helix Incident
  migrations/         # historial de SQLite
src/
  lib/
    components/
      modules/        # visores y modulos de investigacion
      os/             # layout tipo sistema operativo
    config/           # definicion de carpetas
    game/             # definiciones de evidencias, deducciones y archivos virtuales
    i18n/             # traducciones y store de idioma
    server/           # cliente Prisma server-side
    stores/           # progreso, investigacion, recuperacion, notificaciones y logs
    utils/            # helpers de formato
  routes/
    +page.server.js   # carga del caso desde SQLite
    +page.svelte      # shell interactivo
static/
  media/              # imagenes placeholder locales
```

## Caso inicial

**The Helix Incident**: Helix Labs pierde toda comunicacion con sus empleados tras una ventana de mantenimiento. El archivo recuperado contiene pistas sobre credenciales duplicadas, una brecha en el east archive, conversaciones cifradas y sensores contradictorios en sublevel C.

El misterio no esta cerrado en esta version; la base esta preparada para ampliar casos, pistas y modulos.

## Idiomas

La UI soporta ingles y espanol. Ingles es el idioma por defecto y la seleccion se guarda en `localStorage`.

Las traducciones viven en:

```text
src/lib/i18n/en.json
src/lib/i18n/es.json
src/lib/i18n/index.js
```

Para anadir otro idioma, crea un nuevo JSON con la misma estructura, importalo en `src/lib/i18n/index.js` y sumalo a `SUPPORTED_LANGUAGES`.

## Progreso, evidencias y caso

El progreso se guarda en `localStorage` con `src/lib/stores/ProgressStore.js`. Cada elemento abierto se registra con `id`, `title`, `category`, `read`, `important` y `evidenceTags`.

La investigacion del jugador usa `src/lib/stores/InvestigationStore.js` y se guarda en `deadsignal.investigation.v1`. Ahi viven conexiones, notas, deducciones desbloqueadas y milestones del capitulo.

La recuperacion forense usa `src/lib/stores/RecoveryStore.js` y se guarda en `deadsignal.recovery.v1`. Ahi viven fragmentos recuperados, documentos reconstruidos, orden de ensamblaje y log de acciones del laboratorio.

Las evidencias desbloqueables se definen en `src/lib/game/evidence.js`. El modulo **Evidence Board** muestra solo las evidencias encontradas durante la investigacion e incluye contador de evidencias, porcentaje de caso completado e indicador de progreso del capitulo.

Al seleccionar una evidencia se abre una ficha profesional con titulo, descripcion larga, origen, estado, etiquetas, notas forenses y archivos relacionados.

Desbloqueos iniciales:

- `Recovered Sticky Note` desbloquea `Server Room Knock Pattern`.
- `Security Note: East Archive` desbloquea `East Archive Breach`.
- `AUTH-102` / `Login anomaly N-KADE-17` desbloquea `Duplicate Credential`.
- Desbloquear `Encrypted Fragment 01` anade esa evidencia al tablero.
- Leer `East Archive Access Map` y `Relay Failure Report` anade evidencias conectables.
- Recuperar fragmentos en **Recovery Lab** desbloquea `Recovered Fragment`.
- Reconstruir `Power Relay Maintenance Report` desbloquea una nueva evidencia conectable.

## Recovery Lab

**Recovery Lab** / **Laboratorio de Recuperacion** es una nueva carpeta del sistema. Simula trabajo sobre una copia danada del archivo original de Helix.

Incluye tres metodos deterministas:

- `Scan`: recupera `Recovery Fragment 12` desde el sector sombra del relay.
- `Repair`: usa `file_12` para recuperar `Recovery Fragment 18`.
- `Deep Recovery`: usa la salida reparada para recuperar `Recovery Fragment 21`.

Cada accion genera un resultado visible, una entrada de log y persistencia local. El laboratorio muestra porcentaje de integridad, nivel de corrupcion, fecha de recuperacion y origen de recuperacion.

## Archivos corruptos y fragmentos

El visor de documentos soporta archivos corruptos con contenido incompleto, lineas faltantes, palabras ocultas y caracteres sustituidos. Los documentos danados muestran badges `Corrupted`, `Damaged` y `Partial`, traducidos en EN/ES, ademas de metadatos forenses.

La cadena nueva parte de `Relay Cache Index`, un archivo danado con referencias a:

- `Recovery Fragment 12`
- `Recovery Fragment 18`
- `Recovery Fragment 21`

Cuando los tres fragmentos existen, el laboratorio activa un mini juego sencillo de ensamblaje. El usuario ordena los bloques por marcador de linea y reconstruye automaticamente:

```text
Power Relay Maintenance Report
```

El informe revela que el relay externo fue redirigido por una ruta interna de mantenimiento antes del apagon.

## Connection Board

**Connection Board** / **Tablero de Conexiones** es una vista interna del **Evidence Board**. Muestra las evidencias descubiertas como nodos tipo tarjeta y dibuja conexiones con SVG simple.

El jugador puede seleccionar dos nodos y guardar una conexion. Las conexiones se persisten en `localStorage`, se listan en el panel lateral y se marcan como verificadas si coinciden con una relacion correcta definida en `src/lib/game/deductions.js`.

Ejemplos de conexiones:

- `Server Room Knock Pattern` + `Encrypted Fragment 01`
- `Duplicate Credential` + `Relay Failure Report`
- `East Archive Breach` + `East Archive Access Map`

## Investigator Notes

**Investigator Notes** / **Notas del Investigador** es otra vista del **Evidence Board**. Permite crear, editar y borrar notas personales del jugador.

Cada nota guarda cuerpo, fecha/hora simulada, fecha de edicion y etiquetas opcionales. No forma parte de la historia fija; es una capa privada del jugador y se persiste en `deadsignal.investigation.v1`.

## Deducciones

Las deducciones se definen en `src/lib/game/deductions.js` y se desbloquean al crear conexiones correctas entre evidencias.

Deducciones actuales:

- `Server Room Knock Pattern` + `Encrypted Fragment 01`: `The knock pattern was used as an access phrase`.
- `East Archive Breach` + `Duplicate Credential`: `The breach required internal access`.
- `Power Relay Maintenance Report` + `Relay Failure Report`: `The blackout followed a maintenance reroute`.

Cuando una deduccion se desbloquea, la app muestra una notificacion, genera un log interno y actualiza objetivos relacionados.

## Resumen del Capitulo 1

El objetivo final `Reconstruct the blackout sequence` / `Reconstruir la secuencia del apagon` se completa cuando el jugador:

- desbloquea `Encrypted Fragment 01`;
- descubre `East Archive Breach`;
- crea al menos 2 conexiones correctas;
- desbloquea al menos 1 deduccion.

Al completarse aparece **Chapter 1 Summary** / **Resumen del Capitulo 1** dentro del **Evidence Board**. Resume que Helix Labs perdio comunicacion, hubo acceso no autorizado, la sala de servidores esta relacionada, el apagon parece deliberado y pudo existir implicacion interna. La historia queda abierta para el capitulo 2.

## Archivos bloqueados y contrasenas

La iteracion actual incluye archivos con propiedad `locked`. Los registros bloqueados aparecen atenuados y con candado en el explorador.

Desbloqueos jugables:

- Leer `Recovered Sticky Note` recupera `Server Room Audio Transcript`.
- Leer `Security Note: East Archive` recupera `East Archive Access Map`.
- Revisar suficientes logs importantes recupera `Relay Failure Report`.

`Encrypted Fragment 01` esta protegido por contrasena. Al abrirlo aparece una puerta de acceso; la clave `KNOCK-3` tambien puede introducirse desde la terminal con `unlock KNOCK-3`. Si la contrasena es correcta, el archivo se descifra, se abre y el desbloqueo queda persistido en `localStorage`. Si falla, se genera una notificacion y un log interno de intento rechazado.

## Objetivos dinamicos

El panel derecho usa `ObjectiveList` para reflejar estados `locked`, `open`, `active` y `completed`.

- `Establish blackout timeline` se completa al revisar varios logs importantes.
- `Verify duplicate credential` se activa al descubrir la evidencia de credencial duplicada.
- `Inspect east archive breach` se completa al revisar la nota del archivo este.
- `Recover encrypted fragment` pasa de bloqueado a activo cuando aparece la pista de la nota recuperada y se completa al descifrar `Encrypted Fragment 01`.
- `Connect related evidence` se completa al crear una conexion correcta.
- `Prove the access phrase` se completa al desbloquear la deduccion de KNOCK-3.
- `Identify internal involvement` se completa al relacionar brecha y credencial duplicada.
- `Reconstruct the blackout sequence` completa el resumen parcial del capitulo 1.
- `Recover maintenance records` se completa al reconstruir `Power Relay Maintenance Report`.
- `Trace the source of the blackout` aparece despues de recuperar el fragmento cifrado.

## Terminal interactiva

El modulo **Terminal** simula una consola del sistema recuperado. Comandos disponibles:

```text
help
clear
status
scan
evidence
unlock KNOCK-3
recover relay
fragments
repair file_12
```

`scan` puede recuperar un log oculto del relay y `evidence` lista las evidencias descubiertas en el tablero. `recover relay`, `repair file_12` y `fragments` se integran con **Recovery Lab** y comparten el mismo estado persistente.

## Flujo jugable inicial

1. Leer `Recovered Sticky Note`.
2. Desbloquear la evidencia `Server Room Knock Pattern`.
3. Deducir o probar `KNOCK-3`.
4. Descifrar `Encrypted Fragment 01` desde el modal o con la terminal.
5. Completar `Recover encrypted fragment`.
6. Abrir **Evidence Board** y crear conexiones entre evidencias.
7. Desbloquear una deduccion correcta.
8. Abrir **Recovery Lab**, recuperar los tres fragmentos y reconstruir `Power Relay Maintenance Report`.
9. Reconstruir la secuencia del apagon y abrir el resumen del Capitulo 1.

## Notificaciones y efectos

El centro de notificaciones vive en `src/lib/stores/NotificationStore.js` y `src/lib/components/os/NotificationCenter.svelte`.

Tipos soportados:

- `info`
- `warning`
- `evidence`
- `objective`
- `error`

Las notificaciones aparecen arriba a la derecha y desaparecen automaticamente. Los desbloqueos de evidencia, objetivos completados y pistas nuevas tienen animaciones suaves sin romper la estetica del sistema.

El panel inferior simula actividad interna del sistema con mensajes localizados y discretos para reforzar la inmersion.

Las acciones importantes tambien generan logs dinamicos de sesion: archivos recuperados, comandos ejecutados, intentos fallidos de contrasena, descifrados correctos, conexiones guardadas, deducciones desbloqueadas, fragmentos forenses recuperados, documentos reconstruidos, resumen del capitulo y diagnosticos recuperados por `scan`.
