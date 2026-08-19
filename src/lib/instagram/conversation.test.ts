import { describe, expect, it } from "vitest";
import { buildReply, classifyIntent, isMagnetComment } from "@/lib/instagram/conversation";

describe("classifyIntent", () => {
  it("detecta diagnóstico, cotizar y menú", () => {
    expect(classifyIntent("quiero el diagnóstico")).toBe("diagnostico");
    expect(classifyIntent("1")).toBe("diagnostico");
    expect(classifyIntent("hola, cotizar un sistema")).toBe("cotizar");
    expect(classifyIntent("hola")).toBe("menu");
    expect(classifyIntent("", "COTIZAR")).toBe("cotizar");
  });
});

describe("isMagnetComment", () => {
  it("acepta DIAGNOSTICO en cualquier casing", () => {
    expect(isMagnetComment("DIAGNOSTICO")).toBe(true);
    expect(isMagnetComment("quiero el Diagnóstico")).toBe(true);
    expect(isMagnetComment("bonito")).toBe(false);
  });
});

describe("buildReply", () => {
  it("incluye la URL de diagnóstico", () => {
    const reply = buildReply("diagnostico", {
      diagnostic: "https://example.com/diagnostico",
      quote: "https://example.com/cotizar",
      site: "https://example.com",
    });
    expect(reply.text).toContain("https://example.com/diagnostico");
    expect(reply.quickReplies.length).toBeGreaterThan(0);
  });
});
