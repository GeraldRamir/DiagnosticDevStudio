"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Insights = {
  ok: true;
  username: string;
  followers: number | null;
  mediaCount: number | null;
  account: Array<{ name: string; value: number | null }>;
  posts: Array<{
    id: string;
    caption: string;
    permalink: string;
    likeCount: number | null;
    commentsCount: number | null;
    insights: Array<{ name: string; value: number | null }>;
  }>;
};

export default function InstagramAdminPage() {
  const [password, setPassword] = useState("");
  const [data, setData] = useState<Insights | null>(null);
  const [error, setError] = useState("");
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [publishing, setPublishing] = useState(false);

  async function load() {
    const res = await fetch("/api/instagram/insights");
    const json = (await res.json()) as Insights & { message?: string; ok?: boolean };
    if (!res.ok || !json.ok) {
      setData(null);
      return false;
    }
    setData(json as Insights);
    return true;
  }

  useEffect(() => {
    void load();
  }, []);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setError("Contraseña incorrecta");
      return;
    }
    await load();
  }

  async function publish(event: React.FormEvent) {
    event.preventDefault();
    setPublishing(true);
    setError("");
    try {
      const res = await fetch("/api/instagram/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, caption }),
      });
      const json = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok || !json.ok) throw new Error(json.message || "No se pudo publicar");
      setCaption("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo publicar");
    } finally {
      setPublishing(false);
    }
  }

  if (!data) {
    return (
      <main className="mx-auto max-w-md px-6 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">Instagram · Dev Studio</h1>
        <p className="mt-2 text-sm text-[#64748b]">Insights y publicación de @dev_studioo.</p>
        <form className="mt-8 space-y-4" onSubmit={(event) => void login(event)}>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Contraseña admin"
            className="h-10 w-full rounded-md border border-[#cbd5e1] px-3 text-sm"
          />
          <button type="submit" className="h-10 rounded-full bg-[#111] px-5 text-sm font-semibold text-white">
            Entrar
          </button>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8b8b96]">Panel interno</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">@{data.username}</h1>
          <p className="mt-2 text-sm text-[#64748b]">
            {data.followers?.toLocaleString("es") ?? "—"} seguidores · {data.mediaCount ?? "—"} publicaciones
          </p>
        </div>
        <Link href="/" className="text-sm text-[#64748b] hover:text-[#111]">
          Volver al diagnóstico
        </Link>
      </div>

      <ul className="mt-8 flex flex-wrap gap-2">
        {data.account.map((item) => (
          <li key={item.name} className="rounded-full bg-[#f1f5f9] px-3 py-1 text-sm">
            {item.name}: {item.value ?? "—"}
          </li>
        ))}
      </ul>

      <form className="mt-10 grid gap-3 rounded-2xl border border-[#e2e8f0] p-5 md:grid-cols-[1fr_2fr_auto]" onSubmit={(event) => void publish(event)}>
        <input
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          placeholder="URL pública de imagen"
          className="h-10 rounded-md border border-[#cbd5e1] px-3 text-sm"
        />
        <input
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          placeholder="Caption · incluye “Comenta DIAGNOSTICO”"
          className="h-10 rounded-md border border-[#cbd5e1] px-3 text-sm"
        />
        <button
          type="submit"
          disabled={publishing}
          className="h-10 rounded-full bg-[#111] px-5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {publishing ? "Publicando…" : "Publicar"}
        </button>
      </form>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.posts.map((post) => (
          <article key={post.id} className="rounded-2xl border border-[#e2e8f0] p-4">
            <p className="line-clamp-3 text-sm text-[#334155]">{post.caption || post.id}</p>
            <p className="mt-2 text-xs text-[#64748b]">
              {post.likeCount ?? 0} likes · {post.commentsCount ?? 0} comentarios
            </p>
            <ul className="mt-3 space-y-1 text-xs text-[#64748b]">
              {post.insights.map((item) => (
                <li key={item.name}>
                  {item.name}: {item.value ?? "—"}
                </li>
              ))}
            </ul>
            {post.permalink ? (
              <a href={post.permalink} className="mt-3 inline-block text-xs font-semibold" target="_blank" rel="noopener noreferrer">
                Ver post
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </main>
  );
}
