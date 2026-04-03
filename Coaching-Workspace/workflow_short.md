# Coaching Workspace Workflow (Detaillierte Übersicht)

Dieser Workflow beschreibt die vollständige Prozesskette sowie die technischen Schnittstellen zwischen CoachApp, AthleteApp und Google Workspace.

---

## Phase 1: Lead-Generierung & Automatisierte Akquise
1.  **Datenerfassung:** Interessent füllt das Google Formular aus (Stammdaten, Ziele, Trainingsstatus).
2.  **Backend-Trigger (GAS Webhook):**
    *   Eintragung der Daten in das Sheet `Applications`.
    *   **Gmail-API:** Automatischer Versand einer "Dankes-E-Mail".
    *   **Calendar-API:** Beifügen eines Terminplan-Links für das Erstgespräch.
3.  **Terminbuchung:** 
    *   Interessent wählt Slot im Google Kalender.
    *   **Meet-API:** Automatische Erstellung eines Google Meet Links.
    *   **Drive-API:** Anlage eines individuellen Athleten-Ordners (`Name_Athlet/`).
    *   **PDF-Generierung:** Erstellung einer `Application_Name.pdf` (aus Formulardaten) und Speicherung im Drive-Unterordner `Application/`.

---

## Phase 2: Das Erstgespräch (CoachApp "Calls"-Modal)
Das Gespräch dient der persönlichen Bindung und dem Abschluss der Coaching-Vereinbarung.

### 2.1 UI & Datenvorbereitung
*   **Header:** Anzeige von Name, E-Mail und Sportart (Live-Daten aus `Applications`).
*   **Notes:** Automatische Erstellung eines Google Docs für Call-Notizen im Drive-Ordner `Notes/Call_Notes/`.
*   **Timer:** Start der Zeitmessung für die Dokumentation der Gesprächsdauer.

### 2.2 Masken-Navigation (Schritt-für-Schritt)
1.  **Ziele erfassen:**
    *   Anlage von Zielen mit Titel, Scope (Wochen/Monate/Jahre) und Startdatum.
    *   KPI-Verknüpfung (z.B. `PL_Total`, `1RM`, `Gewicht`).
2.  **Präsentation (Coaching):** Öffnen von PDF-Slides oder Bildern direkt aus `Media/Presentations/` zur visuellen Untermauerung des Konzepts.
3.  **Vereinbarung & Verkauf:** 
    *   Auswahl vordefinierter Leistungen/Pakete (Training, Ernährung, Gesundheit).
    *   Erstellung individueller "Bundles" (Individuelle Leistungen mit eigenem Preis und Tags).
    *   Eingabe des Startdatums (Logik: Coaching startet immer zum Monatsanfang).
    *   Anwendung von Rabatt-Codes oder Ermäßigungen (Schüler, Studenten, etc.).

### 2.3 Abschluss & Automatisierungstabelle (Zusammenfassung)
Nach Klick auf "Call Abschließen & Speichern" werden folgende Optionen (Checkbox-basiert) getriggert:
*   **Link-Versand:** Versand der Aktivierungsdaten für die AthleteApp.
*   **Onboarding-Trigger:** Aktivierung der Onboarding-Dialoge (Basic/Pro) in der AthleteApp.
*   **Kaufvertrag:** Generierung der Vereinbarungs-PDF und Versand per E-Mail zur digitalen Unterschrift.
*   **Protokoll:** Finalisierung und Speicherung des Gesprächsprotokolls mit Timestamp im Backend.

---

## Phase 3: Aktivierung & Pairing (AthleteApp)
1.  **Erst-Aktivierung:** 
    *   Athlet gibt E-Mail und empfangenen Aktivierungscode ein.
    *   Vergabe eines individuellen Benutzernamens und Passworts.
2.  **Dashboard-Initialisierung:** 
    *   Automatisches Laden der Kacheln (Ernährung, Training).
    *   Priorisierung der "System-Dialoge" über die Benachrichtigungsglocke.
3.  **Vertragsabschluss (Digital Signature):**
    *   **Option 1 (PDF):** Athlet signiert manuell und lädt PDF hoch (Coach muss in CoachApp bestätigen).
    *   **Option 2 (In-App):** Unterschrift auf weißem Canvas-Element. Automatische Speicherung der PDF im Drive-Ordner `Subscription/`.
4.  **Pairing:** Erst nach Bestätigung/Unterschrift wird der Pairing-Code validiert, damit der Athlet Pläne und Support empfangen kann.

---

## Phase 4: Aktives Onboarding & Steuerung
1.  **Profil-Vervollständigung:** Athlet erfasst Körpermetriken, PAL-Wert (Aktivität) und verknüpft ggf. Fitnesstracker (Health-Sync).
2.  **Check-In-Logik:** 
    *   Modularer Aufbau der Fragebögen je nach gebuchtem Paket.
    *   Benachrichtigung an den Coach bei Eingang neuer Check-In-Daten.
3.  **Planungs-Trigger:** Coach evaluiert die Daten und erstellt den ersten Trainingsblock/Ernährungsplan.

---
*Status: In Bearbeitung (Ziele: Integration Rechnungsstellung & Vertragsstatus)*

# Fokus: Invoices & Contracts (Nächste Schritte)

Basierend auf Phase 2.2.4 und 3.3 definieren wir nun die Detail-Workflows für die Verwaltung:

### A. Vertragsmanagement (Contracts)
*   **Status-Tracking:** `Pending Signature`, `Signed`, `Confirmed by Coach`, `Expired`.
*   **Automatische Warnungen:** Nachricht an Athleten bei fehlender Unterschrift (3 Tage & 1 Tag vor Startdatum).
*   **Rechteverwaltung:** Automatischer Entzug der App-Nutzungsrechte bei fehlendem unterschriebenem Vertrag zum Startdatum.

### B. Rechnungsstellung (Invoices)
*   **Trigger-Logik:** 
    *   Einmalzahlungen: Versand sofort nach Paketauswahl (Gmail API).
    *   Abonnements: Monatliche Generierung der Rechnung jeweils 5 Tage vor Monatsbeginn.
*   **Prüfmechanismus:** Dashboard-Kachel für den Coach: "Offene Rechnungen" mit Schnellfiltern nach Fälligkeit.
*   **Stornierung:** Möglichkeit für den Coach, Rechnungen/Verträge im Backend als `Cancelled` zu markieren.
