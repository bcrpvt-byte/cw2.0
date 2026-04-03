# Data Dictionary: Coaching Workspace

Dieses Dokument definiert die Datenstrukturen, Felder und Typen für die CoachApp und AthleteApp. Es dient als technische Referenz für die Entwicklung der Google Sheets Backend-Logik und der UI-Komponenten.

---

## 1. Produkte, Leistungen & Pakete (Products)
Zentrales Verzeichnis für das Verkaufsangebot (Sheet: `Products`).

| Feldname | Datentyp | Beschreibung | Beispiel |
| :--- | :--- | :--- | :--- |
| `product_id` | UUID | Eindeutige ID des Produkts | `p-12345` |
| `name` | String | Anzeigename der Leistung/des Pakets | `Pro-Coaching` |
| `description` | Text | Detaillierte Leistungsbeschreibung | `Inkl. 2 Trainingspläne...` |
| `type` | Enum | `Leistung` / `Paket (Bundle)` / `Individuell` | `Paket` |
| `category` | Enum | `Training` / `Ernährung` / `Gesundheit` / `Allgemein` | `Training` |
| `price_base` | Float | Basispreis ohne Steuern/Rabatte | `149.00` |
| `currency` | String | Währungskürzel | `EUR` |
| `frequency` | Enum | `Einmalig` / `Monatlich` / `Quartalsweise` | `Monatlich` |
| `is_active` | Boolean | Steuert die Sichtbarkeit in der CoachApp | `true` |

---

## 2. Verträge (Contracts / Vereinbarungen)
Verwaltung der aktiven und ausstehenden Coaching-Vereinbarungen (Sheet: `Contracts`).

| Feldname | Datentyp | Beschreibung | Beispiel |
| :--- | :--- | :--- | :--- |
| `contract_id` | UUID | Eindeutige ID der Vereinbarung | `c-67890` |
| `athlete_id` | UUID | Referenz zum Athleten | `a-abcde` |
| `product_refs` | List[UUID] | Liste der gebuchten Produkte (IDs) | `[p-1, p-2]` |
| `start_date` | Date | Datum des Coaching-Beginns | `2026-04-01` |
| `duration_months`| Integer | Vertragslaufzeit in Monaten | `6` |
| `discount_code` | String | Angewandter Rabatt- oder Promo-Code | `COACH10` |
| `status` | Enum | `Draft` / `Pending Signature` / `Active` / `Expired` / `Cancelled` | `Active` |
| `signature_type` | Enum | `Manual_Upload` / `In-App_Canvas` | `In-App_Canvas` |
| `signature_path` | String | Pfad zum Unterschriften-Image in Drive | `Drive://PathToImage` |
| `pdf_path` | String | Pfad zur finalen Vertrags-PDF | `Drive://PathToPDF` |

---

## 3. Rechnungen (Invoices)
Automatisches und manuelles Billing (Sheet: `Invoices`).

| Feldname | Datentyp | Beschreibung | Beispiel |
| :--- | :--- | :--- | :--- |
| `invoice_id` | String | Rechnungsnummer (fortlaufend) | `RE-2026-001` |
| `contract_ref` | UUID | Verknüpfung zum Vertrag | `c-67890` |
| `issue_date` | Date | Erstellungsdatum der Rechnung | `2026-03-25` |
| `due_date` | Date | Fälligkeitsdatum | `2026-04-01` |
| `net_amount` | Float | Netto-Gesamtbetrag | `125.21` |
| `tax_rate` | Float | Umsatzsteuersatz (z.B. 0.19) | `0.19` |
| `gross_amount` | Float | Brutto-Endbetrag | `149.00` |
| `payment_status` | Enum | `Draft` / `Open` / `Paid` / `Overdue` / `Cancelled` | `Paid` |
| `billing_cycle` | Enum | `One-Time` / `Recurring` | `Recurring` |

---

## 4. Hilfsdaten (Auxiliary) / Promo-Codes
(Sheet: `Offers`).

| Feldname | Datentyp | Beschreibung | Beispiel |
| :--- | :--- | :--- | :--- |
| `offer_id` | String | Name des Promo-Codes | `STARTUP20` |
| `discount_pc` | Float | Rabatt in Prozent (0.20 = 20%) | `0.20` |
| `valid_months`| Integer | Wie viele Monate der Rabatt gilt | `3` |
| `is_promo` | Boolean | True = Promo-Code, False = Ermäßigung (Status) | `true` |
