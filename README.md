# Budget Tracker

Eine Webapp für Kundenverwaltung und Budget-Tracking mit Zeitbuchungen.

## Features

- Kundenverwaltung (CRUD)
- Budget-Management mit Kommentaren
- Stopwatch-Funktionalität pro Kunde
- Automatische Kostenberechnung (Zeit × Stundensatz)
- Budget-Übersicht mit verbleibendem Budget
- Mobile-optimiertes Design
- SQLite Datenbank

## Installation

### Mit Docker (empfohlen)

```bash
# Container bauen
npm run docker:build

# Container starten
npm run docker:run
```

### Lokale Entwicklung

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die App ist dann unter `http://localhost:3000` erreichbar.

## Technologie-Stack

- **Frontend**: React, CSS3
- **Backend**: Node.js, Express
- **Datenbank**: SQLite
- **Container**: Docker
