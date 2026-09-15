"use client";

import { Clock, Eye, Phone, Store } from "lucide-react";
import { ImagePicker } from "@/components/tools/menu/editor/image-picker";
import {
  EditorSection,
  Field,
  Toggle,
  inputClass,
} from "@/components/tools/menu/editor/menu-form-ui";
import { CURRENCIES } from "@/lib/tools/menu/defaults";
import { WEEK_DAYS, type DigitalMenu } from "@/lib/tools/menu/types";
import { validateBusiness } from "@/lib/tools/menu/validators";
import type { MenuEditorState } from "@/components/tools/menu/use-menu-editor";
import { cn } from "@/lib/utils";

/** Paso 01: datos del negocio, horario y qué información se muestra. */
export function BusinessStep({
  menu,
  editor,
}: {
  menu: DigitalMenu;
  editor: MenuEditorState;
}) {
  const errors = validateBusiness(menu);

  return (
    <div className="space-y-4">
      <EditorSection
        title="Tu negocio"
        description="Esto es lo primero que ve el cliente al abrir el menú."
        icon={<Store className="size-4" strokeWidth={1.8} aria-hidden />}
      >
        <div className="space-y-4">
          <Field label="Nombre del negocio" htmlFor="biz-name" error={errors.name}>
            <input
              id="biz-name"
              value={menu.business.name}
              onChange={(event) => editor.updateBusiness({ name: event.target.value.slice(0, 60) })}
              className={inputClass}
              placeholder="Burger House"
              maxLength={60}
            />
          </Field>

          <Field
            label="Descripción"
            htmlFor="biz-description"
            hint="Una línea que explique qué vendes."
          >
            <input
              id="biz-description"
              value={menu.business.description}
              onChange={(event) =>
                editor.updateBusiness({ description: event.target.value.slice(0, 140) })
              }
              className={inputClass}
              placeholder="Hamburguesas artesanales y comida rápida."
              maxLength={140}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <ImagePicker
              label="Logo"
              hint="Cuadrado se ve mejor. JPG, PNG o WEBP."
              value={menu.business.logo}
              slot="logo"
              aspect="square"
              onChange={(logo) => editor.updateBusiness({ logo })}
            />
            <ImagePicker
              label="Foto de portada"
              hint="Tu local, tu plato estrella o el ambiente."
              value={menu.business.cover}
              slot="cover"
              aspect="wide"
              onChange={(cover) => editor.updateBusiness({ cover })}
            />
          </div>

          <Field
            label="Aviso del menú (opcional)"
            htmlFor="biz-announcement"
            hint="Aparece en una franja arriba: “Delivery hasta las 11 PM”."
          >
            <input
              id="biz-announcement"
              value={menu.business.announcement}
              onChange={(event) =>
                editor.updateBusiness({ announcement: event.target.value.slice(0, 90) })
              }
              className={inputClass}
              placeholder="Delivery gratis en pedidos mayores a RD$800"
              maxLength={90}
            />
          </Field>

          <Field label="Moneda" htmlFor="biz-currency">
            <select
              id="biz-currency"
              value={menu.business.currency}
              onChange={(event) => editor.updateBusiness({ currency: event.target.value })}
              className={cn(inputClass, "cursor-pointer")}
            >
              {CURRENCIES.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </EditorSection>

      <EditorSection
        title="Contacto"
        description="Los botones que aparecerán en el menú para que te escriban o te encuentren."
        icon={<Phone className="size-4" strokeWidth={1.8} aria-hidden />}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="WhatsApp"
            htmlFor="biz-whatsapp"
            error={errors.whatsapp}
            hint="Con código de país, sin espacios: 18095551234"
          >
            <input
              id="biz-whatsapp"
              value={menu.business.whatsapp}
              onChange={(event) => editor.updateBusiness({ whatsapp: event.target.value })}
              className={inputClass}
              placeholder="18095551234"
              inputMode="tel"
            />
          </Field>

          <Field label="Instagram" htmlFor="biz-instagram" error={errors.instagram}>
            <input
              id="biz-instagram"
              value={menu.business.instagram}
              onChange={(event) => editor.updateBusiness({ instagram: event.target.value })}
              className={inputClass}
              placeholder="@tunegocio"
            />
          </Field>

          <Field label="Teléfono" htmlFor="biz-phone" error={errors.phone}>
            <input
              id="biz-phone"
              value={menu.business.phone}
              onChange={(event) => editor.updateBusiness({ phone: event.target.value })}
              className={inputClass}
              placeholder="8095551234"
              inputMode="tel"
            />
          </Field>

          <Field label="Dirección" htmlFor="biz-address">
            <input
              id="biz-address"
              value={menu.business.address}
              onChange={(event) => editor.updateBusiness({ address: event.target.value })}
              className={inputClass}
              placeholder="Av. Principal 12, Santiago"
            />
          </Field>

          <Field
            label="Enlace de Google Maps (opcional)"
            htmlFor="biz-maps"
            error={errors.mapsUrl}
            hint="Si lo dejas vacío, el botón busca tu dirección en Maps."
            className="sm:col-span-2"
          >
            <input
              id="biz-maps"
              value={menu.business.mapsUrl}
              onChange={(event) => editor.updateBusiness({ mapsUrl: event.target.value })}
              className={inputClass}
              placeholder="https://maps.app.goo.gl/…"
              inputMode="url"
            />
          </Field>
        </div>
      </EditorSection>

      <EditorSection
        title="Horario"
        description="Marca los días que abres y a qué hora."
        icon={<Clock className="size-4" strokeWidth={1.8} aria-hidden />}
      >
        <div className="space-y-2">
          {menu.business.schedule.map((day, index) => {
            const label = WEEK_DAYS[index]?.label ?? day.day;
            return (
              <div
                key={day.day}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-[#16161c]/10 bg-white px-3 py-2.5"
              >
                <label className="flex w-32 cursor-pointer items-center gap-2 text-[0.82rem] font-medium text-[#16161c]">
                  <input
                    type="checkbox"
                    checked={day.open}
                    onChange={(event) => {
                      const schedule = menu.business.schedule.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, open: event.target.checked } : item,
                      );
                      editor.updateBusiness({ schedule });
                    }}
                    className="size-4 accent-[#90BF53]"
                    aria-label={`${label}: abierto`}
                  />
                  {label}
                </label>

                {day.open ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={day.from}
                      onChange={(event) => {
                        const schedule = menu.business.schedule.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, from: event.target.value } : item,
                        );
                        editor.updateBusiness({ schedule });
                      }}
                      className={cn(inputClass, "w-[7.5rem]")}
                      aria-label={`${label}: hora de apertura`}
                    />
                    <span className="text-[0.8rem] text-[#16161c]/50">a</span>
                    <input
                      type="time"
                      value={day.to}
                      onChange={(event) => {
                        const schedule = menu.business.schedule.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, to: event.target.value } : item,
                        );
                        editor.updateBusiness({ schedule });
                      }}
                      className={cn(inputClass, "w-[7.5rem]")}
                      aria-label={`${label}: hora de cierre`}
                    />
                  </div>
                ) : (
                  <span className="text-[0.8rem] text-[#16161c]/50">Cerrado</span>
                )}
              </div>
            );
          })}
        </div>
      </EditorSection>

      <EditorSection
        title="Qué se muestra en el menú"
        description="Decide qué información verá el cliente."
        icon={<Eye className="size-4" strokeWidth={1.8} aria-hidden />}
      >
        <div className="grid gap-2 sm:grid-cols-2">
          <Toggle
            label="Botón de WhatsApp"
            description="Abre un chat con un mensaje de pedido."
            checked={menu.settings.whatsapp}
            onChange={(whatsapp) => editor.updateSettings({ whatsapp })}
          />
          <Toggle
            label="Instagram"
            checked={menu.settings.instagram}
            onChange={(instagram) => editor.updateSettings({ instagram })}
          />
          <Toggle
            label="Teléfono"
            checked={menu.settings.phone}
            onChange={(phone) => editor.updateSettings({ phone })}
          />
          <Toggle
            label="Dirección y “Cómo llegar”"
            checked={menu.settings.address}
            onChange={(address) => editor.updateSettings({ address })}
          />
          <Toggle
            label="Horario"
            checked={menu.settings.schedule}
            onChange={(schedule) => editor.updateSettings({ schedule })}
          />
          <Toggle
            label="Buscador"
            description="Permite buscar productos dentro del menú."
            checked={menu.settings.search}
            onChange={(search) => editor.updateSettings({ search })}
          />
        </div>
      </EditorSection>
    </div>
  );
}
