/**
 * Lista los últimos informes generados (slug + negocio) para previsualizar.
 *
 * Uso: node scripts/list-report-slugs.mjs [slug]
 */
import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
const target = process.argv[2];

if (target) {
  const rows = await sql`
    SELECT l.slug, l."businessName", r.id AS report_id, r."analysisStatus", r."globalScore"
    FROM "Lead" l
    LEFT JOIN "Report" r ON r."leadId" = l.id
    WHERE l.slug = ${target}
  `;
  console.log(rows.length === 0 ? "Lead no encontrado" : rows);
} else {
  const rows = await sql`
    SELECT l.slug, l."businessName"
    FROM "Lead" l
    JOIN "Report" r ON r."leadId" = l.id
    ORDER BY l."createdAt" DESC
    LIMIT 5
  `;

  if (rows.length === 0) {
    console.log("Sin informes registrados todavía.");
  } else {
    for (const row of rows) {
      console.log(`/reporte/${row.slug}  —  ${row.businessName}`);
    }
  }
}
