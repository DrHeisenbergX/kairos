# Kairos – Signale für Yuh

Progressive Web App, die für Aktien, ETFs und Krypto **mit Beleg für Yuh** einschätzt, wann ein Einstieg sinnvoll sein könnte – mit Handelsplan (Einstiegszone, Ziel, ATR-Stopp, Chance/Risiko, Haltedauer) und Ergebnis **netto nach Yuh-Gebühren in CHF**.

**Live:** https://drheisenbergx.github.io/kairos/

- `index.html`, `sw.js`, `manifest.webmanifest`, Icons: die App (eine Datei, ohne Abhängigkeiten)
- `data/signals.json`: aktuelle Signale, Marktüberblick, Rückblick-Test
- `data/hist/*.json`: 1 Jahr Kursverlauf in CHF, Signal-Historie und Rückblick-Signale pro Titel
- `data/history/`: Signal-Verlauf, Live-Signal-Log mit Ergebnisverfolgung, Lauf-Protokoll

Die Daten werden von einem Analyse-Skript (Yahoo Finance via yfinance) erzeugt und automatisch hierher gepusht.

Persönliche Daten (Watchlist, Positionen, Einstellungen) bleiben ausschliesslich lokal im Browser.

> **Keine Anlageberatung.** Einschätzungen aus öffentlichen Daten, ohne Gewähr. Verfügbarkeit bei Yuh vor dem Kauf prüfen. Kurse verzögert.
