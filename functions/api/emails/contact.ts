import { Resend } from "resend";

type Env = {
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
};

type ContactRequestBody = {
  name: string;
  email: string;
  message: string;
};

type FunctionContext = {
  request: Request;
  env: Env;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export async function onRequestPost({ request, env }: FunctionContext) {
  try {
    const { name, email, message } = (await request.json()) as ContactRequestBody;

    if (!name || !email || !message) {
      return json({ error: "Name, email, and message are required" }, 400);
    }

    const resend = new Resend(env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to: "stewardship@tandtcompany.com",
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #071726;">New Contact Form Submission</h2>
          <p style="color: #555;"><strong>Name:</strong> ${name}</p>
          <p style="color: #555;"><strong>Email:</strong> ${email}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #333; white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    if (error) {
      return json({ error: error.message }, 500);
    }

    return json({ success: true });
  } catch (error) {
    return json(
      {
        error: error instanceof Error ? error.message : "Failed to send email",
      },
      500
    );
  }
}

export function onRequest() {
  return json({ error: "Method not allowed" }, 405);
}
