import { describe, expect, it } from "vitest";
import { buildQrValue, normalizeInstagramHandle, openableHref } from "@/lib/tools/qr/build";
import { evaluateScannability } from "@/lib/tools/qr/scannability";
import { toFileName } from "@/lib/tools/qr/download";
import { DEFAULT_QR_FORM, DEFAULT_QR_STYLE, type QrFormValues } from "@/lib/tools/qr/types";
import { validateQrForm } from "@/lib/tools/qr/validators";

function form(patch: Partial<QrFormValues>): QrFormValues {
  return { ...DEFAULT_QR_FORM, ...patch };
}

describe("buildQrValue", () => {
  it("arma WhatsApp con mensaje codificado", () => {
    const value = buildQrValue(
      "whatsapp",
      form({ countryCode: "1", phone: "809 555 1234", message: "Hola, ¿tienen envíos?" }),
    );
    expect(value).toBe(
      "https://wa.me/18095551234?text=Hola%2C%20%C2%BFtienen%20env%C3%ADos%3F",
    );
  });

  it("arma WhatsApp sin mensaje", () => {
    expect(buildQrValue("whatsapp", form({ countryCode: "1", phone: "8095551234" }))).toBe(
      "https://wa.me/18095551234",
    );
  });

  it("completa el protocolo de una URL", () => {
    expect(buildQrValue("url", form({ url: "devstudioo.com" }))).toBe("https://devstudioo.com");
    expect(buildQrValue("menu", form({ url: "https://midominio.com/menu" }))).toBe(
      "https://midominio.com/menu",
    );
  });

  it("normaliza el usuario de Instagram", () => {
    expect(normalizeInstagramHandle("@dev_studioo")).toBe("dev_studioo");
    expect(normalizeInstagramHandle("https://www.instagram.com/dev_studioo/")).toBe(
      "dev_studioo",
    );
    expect(buildQrValue("instagram", form({ instagram: "@dev_studioo" }))).toBe(
      "https://instagram.com/dev_studioo",
    );
  });

  it("arma Google Maps por enlace y por dirección", () => {
    expect(
      buildQrValue("maps", form({ mapsMode: "url", url: "https://maps.app.goo.gl/abc" })),
    ).toBe("https://maps.app.goo.gl/abc");
    expect(
      buildQrValue(
        "maps",
        form({ mapsMode: "address", placeName: "Dev Studio", address: "Santiago, RD" }),
      ),
    ).toBe(
      "https://www.google.com/maps/search/?api=1&query=Dev%20Studio%2C%20Santiago%2C%20RD",
    );
  });

  it("arma mailto, tel y sms", () => {
    expect(
      buildQrValue(
        "email",
        form({ email: "hola@negocio.com", subject: "Consulta de pedido", body: "Hola" }),
      ),
    ).toBe("mailto:hola@negocio.com?subject=Consulta%20de%20pedido&body=Hola");
    expect(buildQrValue("email", form({ email: "hola@negocio.com" }))).toBe(
      "mailto:hola@negocio.com",
    );
    expect(buildQrValue("phone", form({ countryCode: "1", phone: "8095551234" }))).toBe(
      "tel:+18095551234",
    );
    expect(
      buildQrValue("sms", form({ countryCode: "1", phone: "8095551234", message: "Reservar" })),
    ).toBe("sms:+18095551234?body=Reservar");
  });

  it("arma WiFi con y sin contraseña, y escapa caracteres reservados", () => {
    expect(
      buildQrValue("wifi", form({ ssid: "MiRed", password: "clave;123", security: "WPA" })),
    ).toBe("WIFI:T:WPA;S:MiRed;P:clave\\;123;;");
    expect(buildQrValue("wifi", form({ ssid: "Invitados", security: "nopass" }))).toBe(
      "WIFI:T:nopass;S:Invitados;;",
    );
    expect(
      buildQrValue("wifi", form({ ssid: "Oculta", password: "x", security: "WPA", hidden: true })),
    ).toBe("WIFI:T:WPA;S:Oculta;P:x;H:true;;");
  });

  it("devuelve vacío cuando faltan datos", () => {
    expect(buildQrValue("whatsapp", form({ phone: "" }))).toBe("");
    expect(buildQrValue("text", form({ text: "   " }))).toBe("");
  });

  it("solo permite abrir los tipos con destino navegable", () => {
    expect(openableHref("url", "https://devstudioo.com")).toBe("https://devstudioo.com");
    expect(openableHref("wifi", "WIFI:T:WPA;S:x;P:y;;")).toBeNull();
    expect(openableHref("text", "hola")).toBeNull();
  });
});

describe("validateQrForm", () => {
  it("exige número en WhatsApp", () => {
    expect(validateQrForm("whatsapp", form({ phone: "" })).phone).toBeTruthy();
    expect(validateQrForm("whatsapp", form({ phone: "8095551234" })).phone).toBeUndefined();
  });

  it("valida URLs", () => {
    expect(validateQrForm("url", form({ url: "no-es-una-url" })).url).toBeTruthy();
    expect(validateQrForm("url", form({ url: "midominio.com" })).url).toBeUndefined();
  });

  it("valida email", () => {
    expect(validateQrForm("email", form({ email: "hola@" })).email).toBeTruthy();
    expect(validateQrForm("email", form({ email: "hola@negocio.com" })).email).toBeUndefined();
  });

  it("exige SSID y contraseña según la seguridad", () => {
    expect(validateQrForm("wifi", form({ ssid: "" })).ssid).toBeTruthy();
    expect(validateQrForm("wifi", form({ ssid: "Red", security: "WPA" })).password).toBeTruthy();
    expect(
      validateQrForm("wifi", form({ ssid: "Red", security: "nopass" })).password,
    ).toBeUndefined();
  });

  it("exige texto en el tipo texto", () => {
    expect(validateQrForm("text", form({ text: "" })).text).toBeTruthy();
  });
});

describe("evaluateScannability", () => {
  it("aprueba la configuración por defecto", () => {
    const report = evaluateScannability({ style: DEFAULT_QR_STYLE, valueLength: 40 });
    expect(report.status).toBe("ok");
    expect(report.warnings).toHaveLength(0);
  });

  it("avisa cuando el contraste es bajo", () => {
    const report = evaluateScannability({
      style: { ...DEFAULT_QR_STYLE, foreground: "#cccccc" },
      valueLength: 40,
    });
    expect(report.status).toBe("warn");
  });

  it("avisa cuando el logo es demasiado grande para el nivel de corrección", () => {
    const report = evaluateScannability({
      style: {
        ...DEFAULT_QR_STYLE,
        errorCorrection: "Q",
        logoEnabled: true,
        logoDataUrl: "data:image/png;base64,AAA",
        logoScale: 0.3,
      },
      valueLength: 40,
    });
    expect(report.status).toBe("warn");
    expect(report.warnings.join(" ")).toContain("demasiado grande");
  });
});

describe("toFileName", () => {
  it("convierte el nombre en un archivo seguro", () => {
    expect(toFileName("QR Menú Principal", "png")).toBe("qr-menu-principal.png");
    expect(toFileName("   ", "svg")).toBe("codigo-qr.svg");
  });
});
