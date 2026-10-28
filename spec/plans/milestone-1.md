# מיילסטון 1: Walking Skeleton

## החלטות
- הרצה: רק בכתובת של Vercel (בלי `vercel dev` ובלי `.env.local`).
- אין עדיין חשבון Vercel: נוצר בכניסה עם GitHub (`saritis315`).

## תכנון
1. בדיקת קבצי ההקמה: `.gitignore` ו-`.claude/settings.json` קיימים. `.env.example` חסר. ההגדרה ב-`.claude/settings.json` חוסמת ל-Claude גם כתיבה אליו, ולכן היא יוצרת אותו בעצמה עם השורה `OPENAI_API_KEY=` בלבד.
2. `package.json` עם `"type": "module"`, בלי dependencies.
3. `api/joke.js`: `export default { fetch }`, POST בלבד, מחזירה בדיחה זמנית עם הנושא ו"המפתח: נמצא/חסר". בלי CORS ובלי OPTIONS. `console.log` אחד לכל בקשה.
4. `index.html`: לוגו, הסבר, תווית, תיבה, כפתור, בועה עם הדמות ושורה תחתית, לפי DESIGN.md. שליחת POST ל-`/api/joke` והצגה עם `textContent`.

## בנייה
נבנו: `package.json`, `api/joke.js`, `index.html`. `.env.example` ממתין ליצירה ידנית.

## ידני (שלה)
1. דחיפה ל-`main` ב-GitHub.
2. Vercel: Sign up עם GitHub, New Project, Import ל-`joke-app`, Framework Preset: Other, Deploy.
3. OpenAI, API keys: מפתח production בשם `joke-in-a-click`.
4. Vercel, Environment Variables: `OPENAI_API_KEY`, סוג Secret, בסביבות Production ו-Preview, ואז Redeploy.

## בדיקה (Definition of Done)
פתיחה בטלפון, לחיצה מציגה "בדיחה זמנית מהשרת" ו"המפתח: נמצא", בקשת POST אחת ל-`/api/joke`, שורה ב-Logs לכל לחיצה, אין `.env` בריפו.
