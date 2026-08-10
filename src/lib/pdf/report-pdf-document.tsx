import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { RP, RP_SCALE } from "@/lib/report-theme";
import type { ReportViewModel } from "@/lib/report-view-model";

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 44,
    paddingHorizontal: 36,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: RP.ink,
    backgroundColor: "#ffffff",
  },

  header: {
    backgroundColor: RP.black,
    borderRadius: 14,
    padding: 20,
    color: "#ffffff",
  },
  eyebrow: {
    fontSize: 7,
    letterSpacing: 1.6,
    color: "#9a9a9a",
    fontFamily: "Helvetica-Bold",
  },
  headerTitle: {
    fontSize: 19,
    marginTop: 7,
    fontFamily: "Helvetica-Bold",
  },
  headerMeta: { fontSize: 8.5, color: "#b0b0b0", marginTop: 6 },

  scoreRow: { flexDirection: "row", marginTop: 14, gap: 8 },
  scoreCard: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "#f7f7f7",
    padding: 12,
  },
  scoreCardAccent: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: RP.accent,
    padding: 12,
  },
  scoreLabel: { fontSize: 7, letterSpacing: 1.2, color: "#9a9a9a", fontFamily: "Helvetica-Bold" },
  scoreLabelOnAccent: { fontSize: 7, letterSpacing: 1.2, color: "#ffe6e0", fontFamily: "Helvetica-Bold" },
  scoreValue: { fontSize: 18, marginTop: 6, fontFamily: "Helvetica-Bold" },
  scoreValueOnAccent: { fontSize: 18, marginTop: 6, color: "#ffffff", fontFamily: "Helvetica-Bold" },
  scoreNote: { fontSize: 7.5, color: "#9a9a9a", marginTop: 3 },
  scoreNoteOnAccent: { fontSize: 7.5, color: "#ffe6e0", marginTop: 3 },

  sectionTitle: {
    fontSize: 12,
    marginTop: 22,
    marginBottom: 9,
    fontFamily: "Helvetica-Bold",
  },
  body: { fontSize: 9.5, lineHeight: 1.55, color: "#4a4a4a" },

  card: {
    borderRadius: 12,
    backgroundColor: "#f7f7f7",
    padding: 12,
    marginBottom: 8,
  },
  cardTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTitle: { fontSize: 10.5, fontFamily: "Helvetica-Bold", maxWidth: "78%" },
  badge: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    backgroundColor: RP.accent,
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 7,
  },
  fieldLabel: {
    fontSize: 6.5,
    letterSpacing: 1.1,
    color: "#a3a3a3",
    fontFamily: "Helvetica-Bold",
    marginTop: 6,
  },

  pillarRow: { marginBottom: 9 },
  pillarHead: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  pillarName: { fontSize: 9.5, fontFamily: "Helvetica-Bold" },
  pillarValue: { fontSize: 8.5, color: "#9a9a9a" },
  track: { height: 6, backgroundColor: "#ededed", borderRadius: 3 },
  fill: { height: 6, borderRadius: 3 },

  footer: {
    position: "absolute",
    bottom: 22,
    left: 36,
    right: 36,
    fontSize: 7.5,
    color: "#b0b0b0",
    textAlign: "center",
  },
});

const SEVERITY_LABEL = { alta: "Severidad alta", media: "Severidad media", baja: "Severidad baja" };

export function ReportPdfDocument({ report }: { report: ReportViewModel }) {
  const { dashboard, narrative, meta, pillars, hours } = report;

  return (
    <Document
      title={`Diagnóstico ${dashboard.businessName}`}
      author="DevStudio"
      subject="Diagnóstico de madurez digital"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>DIAGNOSTICO DE MADUREZ DIGITAL</Text>
          <Text style={styles.headerTitle}>{dashboard.businessName}</Text>
          <Text style={styles.headerMeta}>
            {meta.industry} · {meta.country} · {meta.createdAt} · Ref. {meta.slug}
          </Text>
        </View>

        <View style={styles.scoreRow}>
          <View style={styles.scoreCardAccent}>
            <Text style={styles.scoreLabelOnAccent}>PUNTAJE GLOBAL</Text>
            <Text style={styles.scoreValueOnAccent}>{dashboard.globalScore}/100</Text>
            <Text style={styles.scoreNoteOnAccent}>{dashboard.scoreLabel}</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>SENALES</Text>
            <Text style={styles.scoreValue}>{dashboard.signalsTotal}</Text>
            <Text style={styles.scoreNote}>{dashboard.statusCounts.fail} criticas</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>CARGA ADMIN</Text>
            <Text style={styles.scoreValue}>{Math.round(hours.horasMes)} h</Text>
            <Text style={styles.scoreNote}>por mes</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>RECUPERABLES</Text>
            <Text style={styles.scoreValue}>{Math.round(hours.automatizable)} h</Text>
            <Text style={styles.scoreNote}>automatizables</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Lectura ejecutiva</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{narrative.headline}</Text>
          <Text style={styles.body}>{narrative.summary}</Text>
        </View>

        <Text style={styles.sectionTitle}>Pilares</Text>
        {pillars.map((p, i) => (
          <View key={p.id} style={styles.pillarRow}>
            <View style={styles.pillarHead}>
              <Text style={styles.pillarName}>{p.label}</Text>
              <Text style={styles.pillarValue}>
                {p.score} / {p.max} pt · {p.pct}%
              </Text>
            </View>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${Math.min(100, Math.max(2, p.pct))}%`,
                    backgroundColor: RP_SCALE[i % RP_SCALE.length],
                  },
                ]}
              />
            </View>
          </View>
        ))}

        <Text style={styles.footer}>
          DevStudio · Documento confidencial · {meta.slug}
        </Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Hallazgos priorizados</Text>
        {narrative.findings.map((f, i) => (
          <View key={`${f.title}-${i}`} style={styles.card} wrap={false}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.cardTitle}>
                {String(i + 1).padStart(2, "0")}. {f.title}
              </Text>
              <Text style={styles.badge}>{SEVERITY_LABEL[f.severity]}</Text>
            </View>
            <Text style={styles.fieldLabel}>QUE ENCONTRAMOS</Text>
            <Text style={styles.body}>{f.whatWeFound}</Text>
            <Text style={styles.fieldLabel}>POR QUE IMPORTA</Text>
            <Text style={styles.body}>{f.whyItMatters}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Accion inmediata</Text>
        <View style={styles.card}>
          <Text style={styles.body}>{narrative.quickWin}</Text>
        </View>

        <Text style={styles.sectionTitle}>Sistemas recomendados</Text>
        <View style={styles.card}>
          <Text style={styles.body}>{narrative.softwareRecommendations.summary}</Text>
        </View>
        {narrative.softwareRecommendations.items.map((item, i) => (
          <View key={item.category} style={styles.card} wrap={false}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.cardTitle}>{item.recommendation}</Text>
              <Text style={styles.badge}>Prioridad {i + 1}</Text>
            </View>
            <Text style={styles.fieldLabel}>{item.category.toUpperCase()}</Text>
            <Text style={styles.body}>{item.why}</Text>
          </View>
        ))}

        <Text style={styles.footer}>
          DevStudio · Documento confidencial · {meta.slug}
        </Text>
      </Page>
    </Document>
  );
}
