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
<head><meta charset="utf-8"></head>
<body style="font-family:system-ui,sans-serif;background:#f8fafc;padding:24px;color:#0f172a;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:32px;">
    <p style="font-size:12px;text-transform:uppercase;letter-spacing:.1em;color:#64748b;margin:0;">Diagnóstico DevStudio</p>
    <h1 style="font-size:22px;margin:12px 0 8px;">Hola ${input.fullName}, tu reporte está listo</h1>
    <p style="color:#475569;line-height:1.6;margin:0 0 20px;">
      Completamos el análisis de <strong>${input.businessName}</strong>.
      Puntaje global: <strong>${input.globalScore}/100 (${input.scoreLabel})</strong>.
    </p>
    <a href="${reportUrl}" style="display:inline-block;background:#0f172a;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;">
      Ver reporte completo
    </a>
    <p style="margin-top:24px;font-size:12px;color:#94a3b8;word-break:break-all;">${reportUrl}</p>
    <p style="margin-top:16px;font-size:11px;color:#94a3b8;">Ref. ${input.slug}</p>
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
