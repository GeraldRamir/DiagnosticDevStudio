/**
 * Contratos de persistencia listos para reemplazar localStorage por API.
 * No implementar backend todavía: LocalToolStorage es la implementación activa.
 */

export interface ToolStorage<T> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
}

export class LocalToolStorage<T> implements ToolStorage<T> {
  constructor(private readonly prefix: string) {}

  private fullKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  async get(key: string): Promise<T | null> {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(this.fullKey(key));
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async set(key: string, value: T): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(this.fullKey(key), JSON.stringify(value));
  }

  async remove(key: string): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(this.fullKey(key));
  }
}

/**
 * Stub para cuando exista NestJS + Prisma.
 * Lanzar al usarlo evita implementaciones silenciosas a medias.
 */
export class ApiToolStorage<T> implements ToolStorage<T> {
  constructor(private readonly endpoint: string) {}

  async get(key: string): Promise<T | null> {
    void key;
    void this.endpoint;
    throw new Error("ApiToolStorage aún no está conectado.");
  }

  async set(key: string, value: T): Promise<void> {
    void key;
    void value;
    throw new Error("ApiToolStorage aún no está conectado.");
  }

  async remove(key: string): Promise<void> {
    void key;
    throw new Error("ApiToolStorage aún no está conectado.");
  }
}
