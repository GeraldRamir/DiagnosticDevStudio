import { describe, expect, it } from "vitest";
import {
  buildWhatsAppUrl,
  displayWhatsAppUrl,
  generateWhatsAppLink,
  isValidWhatsAppNumber,
  normalizePhone,
  sanitizePhoneInput,
} from "@/lib/tools/whatsapp/generator";

describe("generateWhatsAppLink", () => {
  it("arma el enlace de República Dominicana con encoding correcto", () => {
    expect(
      generateWhatsAppLink({
        countryCode: "1",
        phoneNumber: "8095551234",
        message: "Hola, quiero información",
      }),
    ).toBe("https://wa.me/18095551234?text=Hola%2C%20quiero%20informaci%C3%B3n");
  });

  it("omite el query si el mensaje está vacío", () => {
    expect(
      generateWhatsAppLink({
        countryCode: "1",
        phoneNumber: "8095551234",
        message: "   ",
      }),
    ).toBe("https://wa.me/18095551234");
  });

  it("limpia espacios, guiones y paréntesis del número", () => {
    expect(
      generateWhatsAppLink({
        countryCode: "1",
        phoneNumber: "(809) 555-1234",
        message: "Hola",
      }),
    ).toBe("https://wa.me/18095551234?text=Hola");
  });

  it("codifica emojis y caracteres especiales", () => {
    const url = generateWhatsAppLink({
      countryCode: "52",
      phoneNumber: "5512345678",
      message: "Hola 👋 ¿tienen envío?",
    });
    expect(url.startsWith("https://wa.me/525512345678?text=")).toBe(true);
    expect(url).toBe(
      `https://wa.me/525512345678?text=${encodeURIComponent("Hola 👋 ¿tienen envío?")}`,
    );
    expect(url).not.toContain("+");
    expect(url).not.toContain(" ");
  });
});

describe("phone helpers", () => {
  it("bloquea letras en el input", () => {
    expect(sanitizePhoneInput("809abc555-1234")).toBe("809555-1234");
  });

  it("no deja + ni guiones en el número final", () => {
    expect(normalizePhone("+1", "+1-809-555-1234")).toBe("18095551234");
    expect(buildWhatsAppUrl("18095551234", "")).toBe("https://wa.me/18095551234");
  });

  it("exige 10 dígitos locales para +1", () => {
    expect(isValidWhatsAppNumber("1", "8095551234")).toBe(true);
    expect(isValidWhatsAppNumber("1", "809555123")).toBe(false);
    expect(isValidWhatsAppNumber("57", "3001234567")).toBe(true);
  });

  it("trunca visualmente el query", () => {
    expect(displayWhatsAppUrl("https://wa.me/18095551234?text=Hola")).toBe("wa.me/18095551234?…");
    expect(displayWhatsAppUrl("https://wa.me/18095551234")).toBe("wa.me/18095551234");
  });
});
