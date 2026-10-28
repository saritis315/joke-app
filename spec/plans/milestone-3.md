# מיילסטון 3: התקנה בטלפון

## הכרעות מולה
- טלפון לבדיקה: אנדרואיד (Chrome). לכן בלי apple-touch-icon.
- `short_name`: "בדיחה בלחיצה" (זהה לשם המלא).

## מה כבר קיים
שלושת קבצי ה-PNG ב-`assets/` (192, 512, 512-maskable) וגם `icon.svg` / `icon-maskable.svg`. אין צורך ליצור אייקונים.

## תכנון
1. `manifest.webmanifest`: name, short_name, start_url `/`, display standalone, lang he, dir rtl, theme_color ו-background_color `#FFE15A`, שלושה אייקונים (האחרון `purpose: maskable`).
2. `sw.js`, network-first לפי ARCHITECTURE סעיף 7:
   - install: שמירה מראש של `/`, ה-manifest, כל ה-SVG והאייקונים. `skipWaiting`.
   - activate: מחיקת מטמונים ישנים ו-`clients.claim`.
   - fetch: רק GET, אותו origin, ולא `/api`. קודם רשת ושמירת עותק; אין רשת: מהמטמון. כל השאר לא נוגעים.
   - הגופנים מ-Google Fonts לא נשמרים (כתובת אחרת).
3. `index.html`: `theme-color`, קישור ל-manifest, אייקון, ורישום של `sw.js`.

## בדיקה (Definition of Done)
לפי חמשת התנאים ב-`spec/MILESTONES.md`, מיילסטון 3. בדיקה רק בכתובת של Vercel אחרי push (אין Node במחשב). אחרי push אין צורך ב-Redeploy.

## בנייה
נוצרו `manifest.webmanifest` ו-`sw.js`, ועודכן `index.html` (theme-color, manifest, אייקון, רישום sw). לא נבדק מקומית. לא נדחף עדיין: ממתין לאישור שלה.
