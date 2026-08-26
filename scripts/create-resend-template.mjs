#!/usr/bin/env node
/**
 * Create Resend order-confirmation template.
 * Usage: node scripts/create-resend-template.mjs
 * Requires RESEND_API_KEY in .env or environment.
 */
import { Resend } from "resend";
import { readFileSync } from "fs";
import { join } from "path";

const apiKey = process.env.RESEND_API_KEY || (() => {
  try {
    const env = readFileSync(join(process.cwd(), ".env"), "utf8");
    const match = env.match(/^RESEND_API_KEY=(.+)$/m);
    return match ? match[1].trim() : null;
  } catch {
    return null;
  }
})();

if (!apiKey) {
  console.error("RESEND_API_KEY not found. Set it in .env or environment.");
  process.exit(1);
}

const resend = new Resend(apiKey);

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
    <!-- Header -->
    <div style="background: #071726; padding: 32px; text-align: center;">
      <h1 style="margin: 0; color: #c5a55a; font-size: 28px; font-weight: 600; letter-spacing: 0.05em;">T & T COMPANY</h1>
      <p style="margin: 8px 0 0; color: #8a9aa9; font-size: 14px;">Faith. Purpose. Style.</p>
    </div>

    <!-- Body -->
    <div style="padding: 32px;">
      <h2 style="margin: 0 0 16px; color: #071726; font-size: 24px;">Order Confirmed</h2>
      <p style="margin: 0 0 24px; color: #555; line-height: 1.6;">Thank you, <strong>{{{customer_name}}}</strong>!</p>
      <p style="margin: 0 0 24px; color: #555; line-height: 1.6;">We are honoured to be part of your story. Your order has been received and is being processed.</p>

      <!-- Order reference -->
      <div style="background: #f9f7f3; border-left: 4px solid #c5a55a; padding: 20px; margin: 24px 0; border-radius: 0 8px 8px 0;">
        <p style="margin: 0 0 8px; color: #8a9aa9; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Order Reference</p>
        <p style="margin: 0; color: #071726; font-size: 22px; font-weight: 600;">#{{{order_ref}}}</p>
      </div>

      <!-- Items list (pre-formatted string passed as variable) -->
      <div style="margin: 24px 0; padding: 16px; background: #fafafa; border-radius: 8px; border: 1px solid #eee;">
        <p style="margin: 0 0 12px; color: #071726; font-weight: 600;">Items</p>
        <div style="color: #555; line-height: 1.8; white-space: pre-wrap;">{{{order_items}}}</div>
      </div>

      <!-- Totals -->
      <div style="margin: 24px 0; padding-top: 16px; border-top: 1px solid #eee;">
        <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #555;">
          <span>Subtotal</span>
          <span>R {{{subtotal}}}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #555;">
          <span>Shipping ({{{delivery_method}}})</span>
          <span>{{{shipping_cost}}}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #555;">
          <span>VAT</span>
          <span>R {{{tax}}}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 16px 0 0; margin-top: 16px; border-top: 2px solid #071726; font-size: 18px; font-weight: 600; color: #071726;">
          <span>Total</span>
          <span>R {{{order_total}}}</span>
        </div>
      </div>

      <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />

      <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">You will receive a dispatch notification once your order ships.</p>
      <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0 0 32px;">If you have any questions, reply to this email or reach out via <a href="mailto:stewardship@tandtcompany.com" style="color: #c5a55a; text-decoration: none;">stewardship@tandtcompany.com</a>.</p>

      <p style="color: #8a9aa9; font-size: 12px; margin-top: 32px;">T & T COMPANY (Pty) Ltd — A faith-led lifestyle brand.</p>
    </div>
  </div>
</body>
</html>
`;

async function main() {
  try {
    console.log("Creating Resend template 'order-confirmation'...");

    const { data, error } = await resend.templates.create({
      name: "order-confirmation",
      html: html,
      subject: "Order Confirmed — {{{order_ref}}}",
      variables: [
        { key: "customer_name", type: "string" },
        { key: "order_ref", type: "string" },
        { key: "order_total", type: "string" },
        { key: "subtotal", type: "string" },
        { key: "delivery_method", type: "string" },
        { key: "shipping_cost", type: "string" },
        { key: "tax", type: "string" },
        { key: "order_items", type: "string" },
      ],
    });

    if (error) {
      console.error("Error creating template:", error);
      process.exit(1);
    }

    console.log("✅ Template created:", data.id);

    // Publish it
    console.log("Publishing template...");
    const { data: publishData, error: publishError } = await resend.templates.publish(data.id);
    if (publishError) {
      console.error("Error publishing template:", publishError);
      process.exit(1);
    }

    console.log("✅ Template published!");
    console.log("\nTemplate ID:", data.id);
    console.log("\nAdd this to your environment variables:");
    console.log(`RESEND_TEMPLATE_ID=${data.id}`);

    // Show the variables the template expects
    console.log("\nTemplate variables (pass these when sending):");
    console.log("- customer_name: string");
    console.log("- order_ref: string");
    console.log("- order_total: string (formatted with R and 2 decimals)");
    console.log("- subtotal: string (formatted)");
    console.log("- delivery_method: string");
    console.log("- shipping_cost: string (formatted)");
    console.log("- tax: string (formatted)");
    console.log("- order_items: string (pre-formatted list like 'Product A x2\\nProduct B x1')");

  } catch (err) {
    console.error("Unexpected error:", err);
    process.exit(1);
  }
}

main();