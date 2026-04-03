# Coaching Workspace Workflow (Kurzübersicht)

Diese Übersicht fasst den vollständigen Workflow von der Kundenakquise bis zum aktiven Coaching zusammen.

## Phase 1: Kundenakquise & Leads (Webhook)
*   **Google Form:** Interessent gibt Stammdaten, Ziele und Trainings-Metadaten ein.
*   **Automatisierung:** 
    *   Datenübertragung in CoachApp Backend (Sheet: *Applications*).
    *   Versand einer Bestätigungs-E-Mail inkl. Kalender-Link für Erstgespräch.
    *   Nach Buchung: Zustellung des Google Meet Links und automatische Ordnererstellung in Google Drive.
    *   Speicherung der Bewerberdaten als PDF im Athletenordner.

## Phase 2: Erstgespräch (Initial Consultation)
Ein zentrales Element in der **CoachApp** (Calls-Modal).
*   **Vorbereitung:** Erstellung von Leistungen, Paketen und Rabattaktionen/Promo-Codes (View: *Products*).
*   **Durchführung im Calls-Modal:**
    1.  **Check-In:** Stammdaten prüfen/ergänzen.
    2.  **Zieldefinition:** Festlegen von Scopes und KPIs (z.B. Gewichtsabnahme, Kraftwerte).
    3.  **Coaching-Präsentation:** Zugriff auf Vorlagen (Slides) direkt im Call.
    4.  **Vereinbarung:** Auswahl der Pakete, Startdatum und Ermäßigungen.
*   **Abschluss:** 
    *   Senden der Aktivierungsdaten für die AthleteApp.
    *   Anstoßen von System-Dialogen (Onboarding, Kaufvertrag/Vereinbarung).
    *   Speichern des Gesprächsprotokolls.

## Phase 3: Aktivierung AthleteApp
*   **Registrierung:** Athlet nutzt Aktivierungscode aus der E-Mail.
*   **Initialer Login:** Festlegen von Benutzername und Passwort.
*   **Dashboard:** Anzeige erforderlicher Aktionen (Onboarding-Fragebogen, digitale Unterschrift der Vereinbarung).
*   **Pairing:** Nach Unterschrift erhält der Athlet den Pairing-Code zur Verknüpfung mit dem Coach.

## Phase 4: Onboarding & Aktives Coaching
*   **Datenvervollständigung:** Athlet füllt Profil (Körperdaten, PAL, Health-Sync) in der AthleteApp aus.
*   **Check-Ins:** Nutzung modularer, dynamisch generierter Fragebögen basierend auf dem gebuchten Paket.
*   **Intervention:** Coach evaluiert die Onboarding-Daten und plant den ersten Trainings-/Ernährungsblock.

---
*Status: In Bearbeitung (Nächste Schritte: Detaillierung Invoices & Contracts)*
