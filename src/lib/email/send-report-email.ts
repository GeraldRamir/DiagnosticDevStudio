import { Resend } from "resend";

type SendReportEmailInput = {
  to: string;
  fullName: string;
  businessName: string;
  slug: string;
  globalScore: number;
  scoreLabel: string;
};

function appUrl(slug: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
  return `${base}/reporte/${slug}`;
}

export async function sendDiagnosticReportEmail(
  input: SendReportEmailInput,
): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.warn("[email] RESEND_API_KEY o RESEND_FROM_EMAIL no configurados");
    return { ok: false, error: "Email no configurado" };
  }

  const reportUrl = appUrl(input.slug);
  const resend = new Resend(apiKey);

  const html = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;font-family:'Plus Jakarta Sans',system-ui,-apple-system,sans-serif;background:#e8e8e8;padding:28px 16px;color:#131313;">
  <div style="max-width:560px;margin:0 auto;background:#f5f5f5;border-radius:28px;padding:14px;">
    <div style="background:#101010;border-radius:20px;padding:26px 24px;">
      <p style="font-size:10px;text-transform:uppercase;letter-spacing:.16em;color:#9a9a9a;margin:0;font-weight:700;">Diagnóstico de madurez digital</p>
      <h1 style="font-size:24px;line-height:1.25;margin:10px 0 0;color:#ffffff;font-weight:700;">Hola ${input.fullName},<br><span style="color:#b0b0b0;font-weight:300;">tu informe está listo</span></h1>
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:12px;border-collapse:separate;border-spacing:12px 0;">
      <tr>
        <td style="background:#ee5b45;border-radius:18px;padding:18px;width:50%;">
          <p style="margin:0;font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:#ffe6e0;font-weight:700;">Puntaje global</p>
          <p style="margin:8px 0 0;font-size:26px;font-weight:700;color:#ffffff;line-height:1;">${input.globalScore}<span style="font-size:15px;opacity:.75;">/100</span></p>
          <p style="margin:6px 0 0;font-size:11px;color:#ffe6e0;">${input.scoreLabel}</p>
        </td>
        <td style="background:#ffffff;border-radius:18px;padding:18px;width:50%;">
          <p style="margin:0;font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:#a3a3a3;font-weight:700;">Negocio</p>
          <p style="margin:8px 0 0;font-size:15px;font-weight:700;color:#131313;line-height:1.3;">${input.businessName}</p>
          <p style="margin:6px 0 0;font-size:11px;color:#a3a3a3;">Ref. ${input.slug}</p>
        </td>
      </tr>
    </table>

    <div style="background:#ffffff;border-radius:20px;padding:24px;margin-top:12px;">
      <p style="margin:0;color:#5c5c5c;line-height:1.65;font-size:14px;">
        Analizamos presencia, rendimiento, captación, operación y datos para identificar
        dónde se pierde tiempo y qué se puede recuperar primero.
      </p>
      <a href="${reportUrl}" style="display:inline-block;margin-top:18px;background:#ee5b45;color:#fff;text-decoration:none;padding:14px 28px;border-radius:999px;font-weight:700;font-size:14px;">
        Ver informe completo
      </a>
      <p style="margin:18px 0 0;font-size:11px;color:#b0b0b0;word-break:break-all;">${reportUrl}</p>
    </div>

    <p style="margin:16px 4px 4px;font-size:11px;color:#9a9a9a;text-align:center;">
      DevStudio · Documento confidencial
    </p>
  </div>
</body>
</html>`;

  try {
    const { error } = await resend.emails.send({
      from,
      to: input.to,
      subject: `Tu diagnóstico DevStudio — ${input.businessName} (${input.globalScore}/100)`,
      html,
    });

    if (error) {
      console.error("[email] Resend error:", error);
      return { ok: false, error: error.message };
    }

    const notify = process.env.NOTIFICATION_EMAIL;
    if (notify && notify !== input.to) {
      await resend.emails.send({
        from,
        to: notify,
        subject: `[DevStudio] Nuevo diagnóstico — ${input.businessName}`,
        html: `<p>Nuevo lead: ${input.fullName} (${input.to}) · ${input.businessName} · <a href="${reportUrl}">Ver reporte</a></p>`,
      });
    }

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al enviar correo";
    console.error("[email]", message);
    return { ok: false, error: message };
  }
}
