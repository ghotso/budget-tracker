# GitHub Actions Setup

## Voraussetzungen

### 1. GHCR_TOKEN Secret

Das Repository benötigt ein Secret namens `GHCR_TOKEN`:

1. Gehe zu **Settings** → **Secrets and variables** → **Actions**
2. Klicke auf **New repository secret**
3. Name: `GHCR_TOKEN`
4. Value: Dein GitHub Personal Access Token mit `write:packages` Berechtigung

### 2. Personal Access Token erstellen

1. Gehe zu **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Klicke auf **Generate new token (classic)**
3. Wähle folgende Berechtigungen:
   - `write:packages` - Container-Pakete veröffentlichen
   - `read:packages` - Container-Pakete lesen
   - `delete:packages` - Container-Pakete löschen (optional)
4. Kopiere den Token und füge ihn als `GHCR_TOKEN` Secret hinzu

## Workflows

### 1. docker.yml
- **Trigger**: Push zu `main`, Pull Requests, Releases
- **Funktionen**:
  - Baut Docker Image für mehrere Plattformen (amd64, arm64)
  - Pusht zu GHCR mit automatischen Tags
  - Multi-Architecture Support
  - Build Cache für bessere Performance
  - Container Signing (optional)

### 2. release.yml
- **Trigger**: Nur bei veröffentlichten Releases
- **Funktionen**:
  - Erstellt spezielle Release-Tags
  - Versionierte Container Images
  - Latest Tag für neueste Version

## Tags

Die Workflows erstellen automatisch folgende Tags:

### Bei Push zu main:
- `main` - Aktueller Main Branch
- `latest` - Neueste Version

### Bei Release v1.2.3:
- `v1.2.3` - Spezifische Version
- `v1.2` - Minor Version
- `v1` - Major Version
- `latest` - Neueste Version

## Container verwenden

### Von GHCR pullen:
```bash
docker pull ghcr.io/your-username/budget-tracker:latest
```

### Mit Docker Compose:
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
```

## Troubleshooting

### Permission denied
- Stelle sicher, dass `GHCR_TOKEN` korrekt gesetzt ist
- Überprüfe, dass der Token `write:packages` Berechtigung hat

### Build failures
- Überprüfe Dockerfile auf Syntax-Fehler
- Stelle sicher, dass alle Dependencies verfügbar sind

### Multi-architecture builds
- Die Workflows unterstützen automatisch amd64 und arm64
- Für andere Architekturen, erweitere die `platforms` Liste
