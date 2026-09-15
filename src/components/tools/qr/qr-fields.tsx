"use client";

import { QrField, QrSegmented, qrInputClass } from "@/components/tools/qr/qr-ui";
import { SectionSwitch } from "@/components/ui/section-switch";
import { COUNTRY_CODES } from "@/lib/tools/whatsapp/generator";
import type { QrFormValues, QrType, QrWifiSecurity } from "@/lib/tools/qr/types";
import { cn } from "@/lib/utils";

/** Campos del formulario según el tipo de QR seleccionado. */
export function QrFields({
  type,
  form,
  errors,
  onChange,
}: {
  type: QrType;
  form: QrFormValues;
  errors: Record<string, string>;
  onChange: (patch: Partial<QrFormValues>) => void;
}) {
  const phoneBlock = (
    <div className="grid gap-3 sm:grid-cols-[minmax(0,11rem)_1fr]">
      <QrField label="País" htmlFor="qr-country" error={errors.countryCode}>
        <select
          id="qr-country"
          value={form.countryCode}
          onChange={(event) => onChange({ countryCode: event.target.value })}
          className={cn(qrInputClass, "cursor-pointer")}
        >
          {COUNTRY_CODES.map((country) => (
            <option key={country.code} value={country.code}>
              {country.label}
            </option>
          ))}
        </select>
      </QrField>
      <QrField
        label="Número"
        htmlFor="qr-phone"
        error={errors.phone}
        hint="Solo dígitos, sin el código de país."
      >
        <input
          id="qr-phone"
          value={form.phone}
          onChange={(event) => onChange({ phone: event.target.value })}
          className={qrInputClass}
          placeholder="8095551234"
          inputMode="tel"
          autoComplete="tel-national"
        />
      </QrField>
    </div>
  );

  const fields = (() => {
  switch (type) {
    case "whatsapp":
      return (
        <div className="space-y-4">
          {phoneBlock}
          <QrField
            label="Mensaje automático (opcional)"
            htmlFor="qr-message"
            error={errors.message}
            hint="Es el texto que aparece escrito cuando se abre el chat."
          >
            <textarea
              id="qr-message"
              value={form.message}
              onChange={(event) => onChange({ message: event.target.value })}
              rows={3}
              className={cn(qrInputClass, "h-auto py-2 leading-relaxed")}
              placeholder="Hola, quiero información sobre sus productos."
            />
          </QrField>
        </div>
      );

    case "phone":
      return <div className="space-y-4">{phoneBlock}</div>;

    case "sms":
      return (
        <div className="space-y-4">
          {phoneBlock}
          <QrField label="Mensaje (opcional)" htmlFor="qr-sms" error={errors.message}>
            <textarea
              id="qr-sms"
              value={form.message}
              onChange={(event) => onChange({ message: event.target.value })}
              rows={2}
              className={cn(qrInputClass, "h-auto py-2 leading-relaxed")}
              placeholder="Quiero reservar una mesa"
            />
          </QrField>
        </div>
      );

    case "url":
    case "menu":
      return (
        <QrField
          label={type === "menu" ? "Enlace del menú" : "URL"}
          htmlFor="qr-url"
          error={errors.url}
          hint={
            type === "menu"
              ? "Pega el enlace de tu menú o catálogo online."
              : "Si escribes solo el dominio, le agregamos https://"
          }
        >
          <input
            id="qr-url"
            value={form.url}
            onChange={(event) => onChange({ url: event.target.value })}
            className={qrInputClass}
            placeholder={
              type === "menu" ? "https://midominio.com/menu" : "https://devstudioo.com"
            }
            inputMode="url"
            autoComplete="url"
          />
        </QrField>
      );

    case "instagram":
      return (
        <QrField
          label="Usuario de Instagram"
          htmlFor="qr-instagram"
          error={errors.instagram}
          hint="Con o sin @. También puedes pegar la URL del perfil."
        >
          <input
            id="qr-instagram"
            value={form.instagram}
            onChange={(event) => onChange({ instagram: event.target.value })}
            className={qrInputClass}
            placeholder="@dev_studioo"
          />
        </QrField>
      );

    case "maps":
      return (
        <div className="space-y-4">
          <QrSegmented
            label="Cómo quieres indicar la ubicación"
            value={form.mapsMode}
            onChange={(mapsMode) => onChange({ mapsMode })}
            options={[
              { id: "url", label: "Pegar enlace" },
              { id: "address", label: "Nombre y dirección" },
            ]}
          />
          {form.mapsMode === "url" ? (
            <QrField
              label="Enlace de Google Maps"
              htmlFor="qr-maps-url"
              error={errors.url}
              hint="En Maps: Compartir → Copiar vínculo."
            >
              <input
                id="qr-maps-url"
                value={form.url}
                onChange={(event) => onChange({ url: event.target.value })}
                className={qrInputClass}
                placeholder="https://maps.app.goo.gl/…"
                inputMode="url"
              />
            </QrField>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <QrField label="Nombre del negocio" htmlFor="qr-place">
                <input
                  id="qr-place"
                  value={form.placeName}
                  onChange={(event) => onChange({ placeName: event.target.value })}
                  className={qrInputClass}
                  placeholder="Cafetería La Esquina"
                />
              </QrField>
              <QrField label="Dirección" htmlFor="qr-address" error={errors.address}>
                <input
                  id="qr-address"
                  value={form.address}
                  onChange={(event) => onChange({ address: event.target.value })}
                  className={qrInputClass}
                  placeholder="Av. Principal 12, Santiago"
                />
              </QrField>
            </div>
          )}
        </div>
      );

    case "text":
      return (
        <QrField
          label="Texto"
          htmlFor="qr-text"
          error={errors.text}
          hint="Cuanto más corto, más fácil de escanear."
        >
          <textarea
            id="qr-text"
            value={form.text}
            onChange={(event) => onChange({ text: event.target.value })}
            rows={4}
            className={cn(qrInputClass, "h-auto py-2 leading-relaxed")}
            placeholder="Promoción válida hasta el domingo"
          />
        </QrField>
      );

    case "email":
      return (
        <div className="space-y-4">
          <QrField label="Correo de destino" htmlFor="qr-email" error={errors.email}>
            <input
              id="qr-email"
              type="email"
              value={form.email}
              onChange={(event) => onChange({ email: event.target.value })}
              className={qrInputClass}
              placeholder="hola@tunegocio.com"
              autoComplete="email"
            />
          </QrField>
          <div className="grid gap-3 sm:grid-cols-2">
            <QrField label="Asunto (opcional)" htmlFor="qr-subject">
              <input
                id="qr-subject"
                value={form.subject}
                onChange={(event) => onChange({ subject: event.target.value })}
                className={qrInputClass}
                placeholder="Consulta de pedido"
              />
            </QrField>
            <QrField label="Mensaje (opcional)" htmlFor="qr-body">
              <input
                id="qr-body"
                value={form.body}
                onChange={(event) => onChange({ body: event.target.value })}
                className={qrInputClass}
                placeholder="Hola, quisiera cotizar…"
              />
            </QrField>
          </div>
        </div>
      );

    case "wifi":
      return (
        <div className="space-y-4">
          <QrField
            label="Nombre de la red (SSID)"
            htmlFor="qr-ssid"
            error={errors.ssid}
            hint="Debe escribirse exactamente igual, respetando mayúsculas."
          >
            <input
              id="qr-ssid"
              value={form.ssid}
              onChange={(event) => onChange({ ssid: event.target.value })}
              className={qrInputClass}
              placeholder="MiNegocio_WiFi"
            />
          </QrField>

          <QrSegmented<QrWifiSecurity>
            label="Seguridad"
            value={form.security}
            onChange={(security) => onChange({ security })}
            options={[
              { id: "WPA", label: "WPA / WPA2" },
              { id: "WEP", label: "WEP" },
              { id: "nopass", label: "Sin contraseña" },
            ]}
          />

          {form.security !== "nopass" ? (
            <QrField label="Contraseña" htmlFor="qr-password" error={errors.password}>
              <input
                id="qr-password"
                type="text"
                value={form.password}
                onChange={(event) => onChange({ password: event.target.value })}
                className={qrInputClass}
                placeholder="clave-del-wifi"
                autoComplete="off"
              />
            </QrField>
          ) : null}

          <label className="flex cursor-pointer items-center gap-2.5 text-[0.82rem] text-[#171311]">
            <input
              type="checkbox"
              checked={form.hidden}
              onChange={(event) => onChange({ hidden: event.target.checked })}
              className="size-4 accent-[#A61E22]"
            />
            Red oculta (no aparece en la lista de redes)
          </label>
        </div>
      );
  }

  return null;
  })();

  return <SectionSwitch sectionKey={type}>{fields}</SectionSwitch>;
}
