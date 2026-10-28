const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });

const INSTRUCTIONS =
  "אתה כותב בדיחות קצרות בעברית. כתוב בדיחה אחת בלבד, עד ארבעה משפטים, נקייה ומתאימה לכל גיל. בלי הקדמה, בלי הסבר ובלי אימוג׳י. רק הבדיחה.";

const GENERIC_ERROR = "משהו השתבש. אפשר לנסות שוב.";

function openaiErrorMessage(status, code) {
  if (status === 401) return "יש בעיה במפתח של OpenAI.";
  if (code === "insufficient_quota") return "נגמר הקרדיט בחשבון OpenAI.";
  if (code === "billing_hard_limit_reached") return "הגענו למגבלת ההוצאה החודשית.";
  if (status === 429) return "יותר מדי בקשות. אפשר לנסות שוב עוד רגע.";
  if (status === 404) return "המודל שהוגדר לא נמצא.";
  return GENERIC_ERROR;
}

function extractText(data) {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }
  const parts = [];
  for (const item of data.output ?? []) {
    if (item.type !== "message") continue;
    for (const part of item.content ?? []) {
      if (part.type === "output_text" && typeof part.text === "string") parts.push(part.text);
    }
  }
  return parts.join("").trim();
}

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return json({ error: "אפשר לשלוח רק בקשת POST." }, 405);
    }

    let topic = "";
    let previous = "";
    try {
      const body = await request.json();
      if (typeof body?.topic === "string") topic = body.topic.trim().slice(0, 100);
      if (typeof body?.improve === "string") previous = body.improve.trim().slice(0, 600);
    } catch {
      topic = "";
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OPENAI_API_KEY is missing");
      return json({ error: GENERIC_ERROR }, 500);
    }

    const model = process.env.OPENAI_MODEL || "gpt-5";
    console.log(`joke request: topic="${topic}" improve=${previous !== ""} model=${model}`);
    const subject = topic ? `נושא הבדיחה: ${topic}` : "אין נושא. ספר בדיחה כללית על החיים.";
    const input = previous
      ? `${subject}\nהבדיחה הנוכחית:\n${previous}\nשפר אותה: הפוך אותה למצחיקה יותר, עם פאנץ' חד יותר. החזר רק את הבדיחה המשופרת.`
      : subject;

    try {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          instructions: INSTRUCTIONS,
          input,
          reasoning: { effort: "low" },
          max_output_tokens: 2000,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const code = data?.error?.code ?? null;
        console.error(`OpenAI error: status=${response.status} code=${code} message=${data?.error?.message}`);
        return json({ error: openaiErrorMessage(response.status, code) }, 502);
      }

      const joke = extractText(data);
      if (!joke) {
        console.error(`OpenAI returned no text: status=${data.status} incomplete=${JSON.stringify(data.incomplete_details)}`);
        return json({ error: GENERIC_ERROR }, 502);
      }

      return json({ joke });
    } catch (err) {
      console.error("joke request failed:", err);
      return json({ error: GENERIC_ERROR }, 502);
    }
  },
};
