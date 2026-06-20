# Dead Signal

## Demo

https://deadsignal.manueltagua.com

---

# Dead Signal

**Dead Signal** es una experiencia narrativa de investigación desarrollada como proyecto de portfolio.

El jugador accede a un sistema informático abandonado y debe reconstruir un incidente conocido como **The Helix Incident**, analizando documentos, correos electrónicos, conversaciones, registros del sistema y evidencias ocultas.

La aplicación combina mecánicas de investigación, deducción lógica, recuperación forense de datos y exploración narrativa dentro de una interfaz inspirada en sistemas operativos y terminales de seguridad.

---

# Vista general

<img width="1911" height="912" alt="image" src="https://github.com/user-attachments/assets/23e260a9-0501-4ab3-8183-0e3ef8b9b89e" />

El objetivo del jugador es descubrir qué ocurrió en Helix Labs tras una misteriosa pérdida de comunicación con todos sus empleados.

Para ello deberá:

* Analizar documentos y registros.
* Descubrir nuevas evidencias.
* Relacionar pistas.
* Desbloquear deducciones.
* Recuperar archivos dañados.
* Resolver objetivos de investigación.
* Reconstruir la secuencia completa de los acontecimientos.

---

# Características principales

## Sistema de investigación

El jugador explora diferentes fuentes de información:

* Documentos internos.
* Correos electrónicos.
* Conversaciones.
* Registros del sistema.
* Archivos multimedia.
* Evidencias ocultas.

Cada descubrimiento aporta nuevas pistas y desbloquea contenido adicional.

---

## Evidence Board

El sistema de evidencias permite registrar todos los hallazgos importantes de la investigación.

Características:

* Evidencias desbloqueables.
* Clasificación automática.
* Progreso del caso.
* Estado de cada evidencia.
* Relación con otros elementos del caso.

<img width="1908" height="908" alt="image" src="https://github.com/user-attachments/assets/a6a134b6-db96-4085-a9bf-6f0dfa179db3" />

---

## Connection Board

El jugador puede conectar evidencias para construir teorías sobre lo sucedido.

Características:

* Creación manual de conexiones.
* Persistencia entre sesiones.
* Validación de relaciones correctas.
* Desbloqueo de nuevas deducciones.

Ejemplos:

* Credenciales duplicadas.
* Brecha en el East Archive.
* Patrones de acceso sospechosos.
* Manipulación de sistemas internos.

---

## Sistema de deducciones

Las conexiones correctas generan deducciones automáticas.

Estas deducciones permiten:

* Completar objetivos.
* Desbloquear nuevas pistas.
* Avanzar en la investigación.
* Comprender mejor los acontecimientos.

Cada deducción representa una conclusión lógica obtenida por el jugador.

---

## Recovery Lab

El laboratorio forense permite recuperar archivos dañados y reconstruir información perdida.

Funciones disponibles:

* Escaneo de fragmentos.
* Reparación de archivos.
* Recuperación profunda.
* Reconstrucción de documentos.

El progreso se almacena automáticamente entre sesiones.

---

## Archivos protegidos y contraseñas

Algunos documentos requieren descubrir claves de acceso ocultas durante la investigación.

Características:

* Archivos bloqueados.
* Sistemas de autenticación.
* Fragmentos cifrados.
* Persistencia de desbloqueos.

Esto obliga al jugador a prestar atención a los detalles encontrados durante la partida.

---

## Terminal interactiva

La aplicación incorpora una terminal funcional integrada en el sistema.

Comandos disponibles:

```text
help
status
scan
evidence
unlock
recover
repair
fragments
clear
```

La terminal interactúa directamente con el progreso de la investigación.

---

## Objetivos dinámicos

El sistema de objetivos evoluciona según las acciones del jugador.

Los objetivos pueden:

* Desbloquearse.
* Activarse.
* Completarse.
* Generar nuevos objetivos.

Esto permite crear una progresión guiada sin perder libertad de exploración.

---

## Persistencia de progreso

Toda la investigación se almacena automáticamente.

Se conserva:

* Progreso del caso.
* Evidencias encontradas.
* Conexiones realizadas.
* Deducciones desbloqueadas.
* Archivos recuperados.
* Notas del investigador.

El jugador puede continuar la investigación en cualquier momento.

---

# Historia: The Helix Incident

Helix Labs pierde toda comunicación con sus empleados tras una operación de mantenimiento rutinaria.

Los sistemas muestran:

* Credenciales duplicadas.
* Actividad anómala.
* Archivos ocultos.
* Sensores contradictorios.
* Accesos no autorizados.

El jugador deberá descubrir qué ocurrió realmente y quién estuvo involucrado.

La historia está diseñada para ampliarse mediante futuros capítulos y nuevos casos.

---

# Tecnologías utilizadas

## Frontend

* SvelteKit
* JavaScript
* Tailwind CSS

## Backend y persistencia

* Prisma ORM
* SQLite

## Infraestructura

* Docker
* Render
* Vercel

---

# Arquitectura

```text
DeadSignal
│
├── SvelteKit Frontend
├── Sistema de investigación
├── Evidence Board
├── Connection Board
├── Recovery Lab
├── Terminal interactiva
├── Prisma ORM
└── SQLite
```

---

# Instalación

## Clonar repositorio

```bash
git clone https://github.com/ManuelTagua/DeadSignal.git
cd DeadSignal
```

## Instalar dependencias

```bash
npm install
```

## Crear base de datos

```bash
npm run db:migrate -- --name init
npm run db:seed
```

## Ejecutar aplicación

```bash
npm run dev
```

La aplicación estará disponible en:

```text
http://localhost:5173
```

---

# Futuras mejoras

* Nuevos capítulos.
* Casos adicionales.
* Sistema de perfiles.
* Guardado en la nube.
* Nuevas mecánicas forenses.
* Sistema de logros.
* Generación procedural de casos.
* Investigación cooperativa.

---

# Objetivo del proyecto

Este proyecto fue desarrollado para demostrar conocimientos en:

* Desarrollo Frontend moderno.
* Arquitectura de aplicaciones web.
* Gestión avanzada de estado.
* Diseño de interfaces complejas.
* Narrativa interactiva.
* Persistencia de datos.
* Sistemas de juego e investigación.

---

# Autor

**Manuel Tagua Pérez**

Técnico Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)

Proyecto desarrollado como parte de mi portfolio profesional.
