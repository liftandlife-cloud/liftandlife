# Lift & Life — Personaltraining Berlin Köpenick

One-Page-Website für Personal Trainer **Alexander Holfeld** (Marke: *Lift & Life*).
Aufbau angelehnt an [goeerki.de](https://www.goeerki.de/), Theme aus dem Logo abgeleitet
(Ink-Grün-Schwarz `#17231e` + Natur-Grün `#6aa544`).

## Struktur
Reine statische Seite – kein Build-Schritt nötig.

```
index.html            # komplette Seite (alle Sektionen)
assets/css/styles.css # Design-System + Layout
assets/js/main.js     # Nav, Slider, FAQ, Formular, Scroll-Reveal
assets/img/           # Logo + web-optimierte Fotos (pt-1 … pt-13)
```

### Sektionen
Hero · Ziele (Muskelaufbau/Fettverlust/Gesundheit) · Coaching · Erfolgssystem (6 Schritte) ·
Über Alex · Testimonials · Studio (Slider + OpenStreetMap Köpenick) · Lifestyle-Galerie ·
Preise (3 Modelle) · FAQ · Kontakt (Formular + WhatsApp/E-Mail/LinkedIn) · Footer

## Lokal ansehen
```bash
cd lift-and-life
python3 -m http.server 4321
# http://localhost:4321
```

## Deployment
Ordner 1:1 zu **Netlify / Vercel / Cloudflare Pages / GitHub Pages** hochladen — fertig.

## Noch anzupassen (Platzhalter)
- **WhatsApp-Nummer**: in `index.html` bei `wa.me/49…` echte Nummer eintragen.
- **LinkedIn-URL**: `https://www.linkedin.com/` → echtes Profil.
- **Preise**: 79 € / Richtwerte sind Beispiele – finale Zahlen einsetzen.
- **Testimonials**: bewusst als Platzhalter erstellt (laut Briefing „faken", 3×5 + 1×4 Sterne). Bei echten Namen/Angaben ersetzen.
- **Rechtstexte**: Impressum / Datenschutz / AGB verlinken auf `#` – noch anlegen (Pflicht in DE!).
- **Adresse**: Karte zeigt Köpenick grob; genaue Adresse bewusst nicht öffentlich ("nach Terminvereinbarung").
- **Kontaktformular**: sendet aktuell nur clientseitig (Demo). Für echten Versand einen Dienst wie Formspree/Netlify Forms oder ein Backend anbinden.

## Video
- Der Promo-Clip ist als **Video-Modul in der „Über Alex"-Sektion** eingebunden (Klick-zum-Abspielen, Poster + grüner Play-Button).
- Quelle: `assets/video/alex-intro.mp4` (1920×1080, ~55 s). Ist H.264/AAC; wurde ohne Neukodierung „faststart"-optimiert (moov-Atom nach vorne verschoben), damit es progressiv lädt statt komplett vorab.
- Spielt in Chrome/Edge/Safari. Der Container ist noch QuickTime-Brand (`qt`); **Firefox** könnte zicken. Für 100 % Kompatibilität später einmal sauber remuxen: `ffmpeg -i original.mov -c copy -movflags +faststart alex-intro.mp4` (oder zusätzlich `.webm` als zweite `<source>`).
- Der zweite, hochauflösende Clip (`…HQ-V1.2.mov`, 78 MB) liegt weiter in Downloads, falls eine bessere Qualität gewünscht ist.
