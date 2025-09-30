# Budget Tracker

Eine einfache Web-Anwendung zur Verwaltung von Kundenbudgets und Zeiterfassung.

## Features

- Kundenverwaltung (erstellen, bearbeiten, löschen)
- Budget-Management mit Kommentaren und Historie
- Stundensatz-Verwaltung pro Kunde
- Stopwatch-Funktionalität mit Pausierung und Echtzeit-Anzeige
- Zeitbuchungen mit Beschreibungen (manuell und automatisch)
- Vollständige CRUD-Operationen für Zeitbuchungen
- Budget-Übersicht mit verbleibendem Budget und Stunden
- Dashboard mit allen aktiven/pausierten Stopwatches
- Dark Mode
- Mobile-optimiert
- SQLite-Datenbank
- React Router für persistente Navigation

## Technologie-Stack

- **Frontend**: React mit React Router
- **Backend**: Node.js/Express
- **Datenbank**: SQLite
- **Container**: Docker & Docker Compose
- **CI/CD**: GitHub Actions mit GHCR

## Lokale Entwicklung

### Voraussetzungen

- Node.js (v14 oder höher)
- npm

### Installation

1. Repository klonen:
```bash
git clone <repository-url>
cd budget-tracker
```

2. Abhängigkeiten installieren:
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

3. Entwicklungsserver starten:
```bash
# Im Hauptverzeichnis
./start-dev.sh
```

Die Anwendung ist dann verfügbar unter:
- Frontend: http://localhost:3001
- Backend: http://localhost:3000

## Docker

### Docker Compose (Empfohlen)

Das Projekt kann mit Docker Compose ausgeführt werden:

```bash
docker-compose up
```

### Docker Container

#### Umgebungsvariablen

Der Docker Container benötigt folgende Umgebungsvariablen:

```bash
# Port für den Server (Standard: 3000)
PORT=3000

# Datenbankpfad (Standard: /app/data/budget_tracker.db)
DB_PATH=/app/data/budget_tracker.db
```

#### Volume Mapping

**Wichtig**: Das Datenbankverzeichnis muss gemappt werden, um Datenpersistenz zu gewährleisten:

```bash
# Datenbankverzeichnis mappen
-v /host/path/to/data:/app/data

# Beispiel:
-v ./data:/app/data
```

**Hinweis**: Das `/app/data` Verzeichnis wird automatisch erstellt, wenn es nicht existiert. Die Datenbankdatei `budget_tracker.db` wird beim ersten Start des Servers erstellt.

#### Vollständiges Docker Run Beispiel

```bash
docker run -d \
  --name budget-tracker \
  -p 3000:3000 \
  -e PORT=3000 \
  -e DB_PATH=/app/data/budget_tracker.db \
  -v ./data:/app/data \
  ghcr.io/your-username/budget-tracker:latest
```

#### Docker Compose Beispiel

```yaml
version: '3.8'
services:
  budget-tracker:
    image: ghcr.io/your-username/budget-tracker:latest
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - DB_PATH=/app/data/budget_tracker.db
    volumes:
      - ./data:/app/data
    restart: unless-stopped
```

### Datenbank

- **Typ**: SQLite
- **Speicherort**: `/app/data/budget_tracker.db` (im Container)
- **Persistenz**: Über Volume Mapping sicherstellen
- **Backup**: Regelmäßige Backups des `data`-Verzeichnisses empfohlen

## GitHub Container Registry (GHCR)

Das Projekt wird automatisch auf GHCR veröffentlicht:

### Container abrufen

```bash
# Container von GHCR pullen
docker pull ghcr.io/your-username/budget-tracker:latest

# Mit Docker Compose
docker-compose pull
```

### Tags

- `latest`: Neueste Version
- `v1.0.0`: Versionierte Releases
- `main`: Aktueller Main Branch

## API Endpunkte

### Kunden
- `GET /api/customers` - Alle Kunden abrufen
- `POST /api/customers` - Neuen Kunden erstellen
- `PUT /api/customers/:id` - Kunden aktualisieren
- `DELETE /api/customers/:id` - Kunden löschen

### Zeitbuchungen
- `GET /api/customers/:id/time-entries` - Zeitbuchungen eines Kunden
- `POST /api/customers/:id/time-entries` - Neue Zeitbuchung erstellen
- `PUT /api/time-entries/:id` - Zeitbuchung aktualisieren
- `DELETE /api/time-entries/:id` - Zeitbuchung löschen
- `PUT /api/time-entries/:id/pause` - Timer pausieren
- `PUT /api/time-entries/:id/resume` - Timer fortsetzen
- `PUT /api/time-entries/:id/finish` - Timer beenden

### Budget
- `GET /api/customers/:id/budget-changes` - Budget-Historie
- `POST /api/customers/:id/budget-changes` - Budget-Änderung

### Dashboard
- `GET /api/running-stopwatches` - Alle aktiven/pausierten Stopwatches

## Entwicklung

### Projektstruktur

```
budget-tracker/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # React Komponenten
│   │   ├── contexts/       # React Contexts
│   │   └── ...
│   └── package.json
├── server/                 # Node.js Backend
│   ├── index.js           # Express Server
│   └── package.json
├── docker-compose.yml     # Docker Compose Konfiguration
├── Dockerfile            # Docker Image Definition
└── README.md
```

### Code-Qualität

- ESLint für Code-Linting
- React Hooks Best Practices
- Responsive Design
- Dark Mode Support

## Troubleshooting

### Datenbank wird nicht erstellt

**Problem**: Die Datenbankdatei wird nicht im gemappten Volume erstellt.

**Lösung**:
1. Stelle sicher, dass das Volume korrekt gemappt ist: `-v ./data:/app/data`
2. Überprüfe die Container-Logs: `docker logs <container-name>`
3. Das `/app/data` Verzeichnis wird automatisch erstellt
4. Die Datenbankdatei wird beim ersten Server-Start erstellt

**Debugging**:
```bash
# Container-Logs anzeigen
docker logs budget-tracker

# In den Container einsteigen
docker exec -it budget-tracker sh

# Datenbankverzeichnis überprüfen
ls -la /app/data/
```

### Port-Konflikte

**Problem**: Port 3000 ist bereits belegt.

**Lösung**:
```bash
# Anderen Port verwenden
docker run -p 3001:3000 -e PORT=3000 ...
```

### Volume-Berechtigungen

**Problem**: Container kann nicht auf das Volume schreiben.

**Lösung**:
```bash
# Berechtigungen setzen
chmod 755 ./data

# Oder mit Docker Compose
volumes:
  - ./data:/app/data:Z  # SELinux Label
```

## Lizenz

MIT License