# מיילסטון 2: בדיחה מ-GPT-5

## ממצאי התיעוד (נבדק היום)
- **Vercel:** `export default { async fetch(request) }` בתיקיית `api/` נתמך. עם `"type": "module"` ב-`package.json` אפשר ESM ב-`.js`. המבנה הקיים ב-`api/joke.js` תקין.
- **OpenAI Responses API:** `POST https://api.openai.com/v1/responses`. השדות `model`, `instructions`, `input`, `reasoning.effort`, `max_output_tokens`.
- `max_output_tokens` כולל גם את טוקני החשיבה, לא רק את הטקסט הנראה. ערך נמוך מדי מחזיר `status: "incomplete"` בלי טקסט. לכן בקוד נקבע ערך נדיב (בערך 2000) ונטפל במצב הזה כשגיאה.
- `output_text` הוא קיצור של ה-SDK. בקריאת REST רגילה עלול לא להופיע, ולכן הקוד שולף גם מ-`output` (פריטי `message`, חלקי `output_text`), כמו ב-ARCHITECTURE.md סעיף 4.
- `reasoning.effort: "low"` נתמך ב-gpt-5. אם המודל שנבחר דוחה את השדה: מורידים אותו.
- (דף ה-API reference של OpenAI חסם גישה אוטומטית; הנתונים נלקחו ממדריך ה-reasoning העדכני.)

## מה כבר קיים מ-Milestone 1
`index.html` כבר כולל את ארבעת המצבים והציורים, ו"עוד בדיחה!" / "לנסות שוב". נשאר רק לחבר הודעת שגיאה מהשרת (כרגע הדף מציג הודעה קבועה) ולוודא ש-`maxlength=100`.

## תכנון
1. `api/joke.js`:
   - POST בלבד. גוף שבור או נושא ריק: "אין נושא". נושא נחתך ל-100 תווים.
   - פנייה ל-Responses API עם `fetch`, מפתח מ-`process.env.OPENAI_API_KEY`, מודל מ-`process.env.OPENAI_MODEL` או `gpt-5`, הפרומפט המרכזי וה-input לפי סעיף 4.
   - שליפת טקסט: `output_text`, ואחרת מ-`output`. אין טקסט: שגיאה 502.
   - שגיאות OpenAI (401, קרדיט, מגבלת הוצאה, 429, 404): הודעה קצרה בעברית לדף, והסטטוס והקוד ב-`console.error`. מפתח חסר: 500.
   - `console.log` קצר לכל בדיחה (נושא ומודל). המפתח לעולם לא נרשם.
2. `index.html`: הצגת `data.error` שמגיעה מהשרת במקום הודעה קבועה.

## ידני (שלה), לפני הקוד
ב-OpenAI: קרדיט מראש, Auto recharge כבוי, ומגבלת הוצאה חודשית. המפתח כבר ב-Vercel.

## בדיקה (Definition of Done)
לפי שמונת התנאים ב-`spec/MILESTONES.md`, מיילסטון 2.

## בנייה
נכתבו: api/joke.js (קריאה ל-Responses API, חיתוך נושא, שליפת טקסט, הודעות שגיאה בעברית, console.error), ועדכון קטן ב-index.html שמציג את הודעת השגיאה מהשרת. לא נבדק מקומית (אין Node במחשב); הבדיקה האמיתית אחרי הדחיפה, ב-Vercel.
