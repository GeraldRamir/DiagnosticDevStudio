"use client";

import { Check, Palette, Sparkles, Type as TypeIcon } from "lucide-react";
import {
  ColorField,
  EditorSection,
  OptionCards,
  Segmented,
  Toggle,
} from "@/components/tools/menu/editor/menu-form-ui";
import {
  CardStyleImage,
  CardStyleMinimal,
  CardStyleRounded,
  FontPreview,
  HeroCentered,
  HeroCover,
  HeroSimple,
  LayoutClassic,
  LayoutElegant,
  LayoutModern,
} from "@/components/tools/menu/editor/style-previews";
import { FONT_STACKS, THEME_PRESETS } from "@/lib/tools/menu/defaults";
import type {
  DigitalMenu,
  MenuBackground,
  MenuCardStyle,
  MenuFont,
  MenuHeroStyle,
  MenuLayoutStyle,
} from "@/lib/tools/menu/types";
import type { MenuEditorState } from "@/components/tools/menu/use-menu-editor";
import { cn } from "@/lib/utils";

/** Paso 03: apariencia del menú público, con vistas previas de cada opción. */
export function ThemeStep({
  menu,
  editor,
}: {
  menu: DigitalMenu;
  editor: MenuEditorState;
}) {
  const activePreset = THEME_PRESETS.find(
    (preset) =>
      preset.theme.primaryColor === menu.theme.primaryColor &&
      preset.theme.menuStyle === menu.theme.menuStyle &&
      preset.theme.cardStyle === menu.theme.cardStyle &&
      preset.theme.background === menu.theme.background,
  );

  return (
    <div className="space-y-4">
      <EditorSection
        title="Estilos listos"
        description="Elige un punto de partida y ajústalo si quieres."
        icon={<Sparkles className="size-4" strokeWidth={1.8} aria-hidden />}
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {THEME_PRESETS.map((preset) => {
            const active = activePreset?.id === preset.id;
            const dark = preset.theme.background === "dark";
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => editor.updateTheme(preset.theme)}
                aria-pressed={active}
                className={cn(
                  "group relative cursor-pointer overflow-hidden rounded-xl border p-3 text-left transition-colors focus-visible:ring-2 focus-visible:ring-[#90BF53]/40 focus-visible:outline-none",
                  active
                    ? "border-[#16161c] ring-1 ring-[#16161c]"
                    : "border-[#16161c]/12 hover:border-[#16161c]/35",
                )}
                style={{ backgroundColor: dark ? "#141416" : "#FFFFFF" }}
              >
                {active ? (
                  <span className="absolute top-2 right-2 inline-flex size-5 items-center justify-center rounded-full bg-[#16161c] text-white">
                    <Check className="size-3" strokeWidth={2.4} aria-hidden />
                  </span>
                ) : null}

                {/* Mini menú de muestra */}
                <span
                  className="block rounded-lg p-2.5"
                  style={{ backgroundColor: dark ? "#1B1B1F" : "#F7F4F1" }}
                >
                  <span
                    className="block h-1.5 w-10 rounded-full"
                    style={{ backgroundColor: preset.theme.primaryColor }}
                  />
                  <span
                    className="mt-2 block text-[0.72rem] font-semibold"
                    style={{
                      color: dark ? "#F7F5F2" : "#16130F",
                      fontFamily: FONT_STACKS[preset.theme.font],
                    }}
                  >
                    Tu negocio
                  </span>
                  <span className="mt-2 flex items-center gap-1.5">
                    <span
                      className="h-5 w-5 rounded-md"
                      style={{ backgroundColor: dark ? "#2A2A2E" : "#E8E2DC" }}
                    />
                    <span className="flex-1">
                      <span
                        className="block h-1.5 w-12 rounded-full"
                        style={{ backgroundColor: dark ? "#3A3A40" : "#DCD5CE" }}
                      />
                      <span
                        className="mt-1 block h-1.5 w-8 rounded-full"
                        style={{ backgroundColor: preset.theme.primaryColor, opacity: 0.85 }}
                      />
                    </span>
                  </span>
                </span>

                <span
                  className="mt-2.5 block text-[0.82rem] font-semibold"
                  style={{ color: dark ? "#F7F5F2" : "#16161c" }}
                >
                  {preset.label}
                </span>
                <span
                  className="mt-0.5 block text-[0.7rem] leading-snug"
                  style={{ color: dark ? "#A9A5A0" : "#16161c8c" }}
                >
                  {preset.description}
                </span>
              </button>
            );
          })}
        </div>
      </EditorSection>

      <EditorSection
        title="Colores"
        description="El color principal se usa en botones, precios y detalles."
        icon={<Palette className="size-4" strokeWidth={1.8} aria-hidden />}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <ColorField
            id="theme-primary"
            label="Color principal"
            value={menu.theme.primaryColor}
            onChange={(primaryColor) => editor.updateTheme({ primaryColor })}
          />
          <ColorField
            id="theme-secondary"
            label="Color secundario"
            value={menu.theme.secondaryColor}
            onChange={(secondaryColor) => editor.updateTheme({ secondaryColor })}
          />
        </div>

        <div className="mt-4">
          <Segmented<MenuBackground>
            label="Fondo"
            value={menu.theme.background}
            onChange={(background) => editor.updateTheme({ background })}
            options={[
              { id: "light", label: "Claro" },
              { id: "dark", label: "Oscuro" },
            ]}
          />
        </div>
      </EditorSection>

      <EditorSection
        title="Encabezado"
        description="Cómo se presenta tu negocio al abrir el menú."
        icon={<Sparkles className="size-4" strokeWidth={1.8} aria-hidden />}
      >
        <OptionCards<MenuHeroStyle>
          label="Estilo del encabezado"
          value={menu.theme.heroStyle}
          onChange={(heroStyle) => editor.updateTheme({ heroStyle })}
          options={[
            {
              id: "cover",
              label: "Con portada",
              description: "Foto arriba y logo encima",
              preview: <HeroCover />,
            },
            {
              id: "simple",
              label: "Simple",
              description: "Directo al grano",
              preview: <HeroSimple />,
            },
            {
              id: "centered",
              label: "Centrado",
              description: "Logo y nombre al centro",
              preview: <HeroCentered />,
            },
          ]}
          hint={
            menu.business.cover
              ? undefined
              : "Sube una foto de portada en el paso 01 para aprovechar este estilo."
          }
        />
      </EditorSection>

      <EditorSection
        title="Productos"
        description="La forma en que se listan los platos."
        icon={<TypeIcon className="size-4" strokeWidth={1.8} aria-hidden />}
      >
        <div className="space-y-5">
          <OptionCards<MenuCardStyle>
            label="Tarjetas de producto"
            value={menu.theme.cardStyle}
            onChange={(cardStyle) => editor.updateTheme({ cardStyle })}
            options={[
              {
                id: "minimal",
                label: "Lista simple",
                description: "Carta tradicional",
                preview: <CardStyleMinimal />,
              },
              {
                id: "rounded",
                label: "Tarjetas",
                description: "Foto pequeña al lado",
                preview: <CardStyleRounded />,
              },
              {
                id: "image",
                label: "Con foto grande",
                description: "Ideal si tienes fotos",
                preview: <CardStyleImage />,
              },
            ]}
          />

          <OptionCards<MenuLayoutStyle>
            label="Estilo del menú"
            value={menu.theme.menuStyle}
            onChange={(menuStyle) => editor.updateTheme({ menuStyle })}
            options={[
              { id: "modern", label: "Moderno", preview: <LayoutModern /> },
              { id: "classic", label: "Clásico", preview: <LayoutClassic /> },
              { id: "elegant", label: "Elegante", preview: <LayoutElegant /> },
            ]}
          />

          <OptionCards<MenuFont>
            label="Tipografía"
            value={menu.theme.font}
            onChange={(font) => editor.updateTheme({ font })}
            options={[
              {
                id: "sans",
                label: "Moderna",
                preview: <FontPreview family={FONT_STACKS.sans} label="Aa" />,
              },
              {
                id: "serif",
                label: "Clásica",
                preview: <FontPreview family={FONT_STACKS.serif} label="Aa" />,
              },
              {
                id: "rounded",
                label: "Redondeada",
                preview: <FontPreview family={FONT_STACKS.rounded} label="Aa" />,
              },
            ]}
            hint="Usamos tipografías que ya están en el dispositivo: el menú carga al instante."
          />

          <Toggle
            label="Mostrar sección de recomendados"
            description="Aparece arriba con los productos que marcaste como destacados."
            checked={menu.settings.featured}
            onChange={(featured) => editor.updateSettings({ featured })}
          />
        </div>
      </EditorSection>
    </div>
  );
}
