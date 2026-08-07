import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { ReportViewModel } from "@/lib/report-view-model";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica" },
  title: { fontSize: 20, marginBottom: 8, fontWeight: "bold" },
  subtitle: { fontSize: 12, color: "#64748b", marginBottom: 20 },
  section: { marginTop: 16, marginBottom: 8, fontSize: 13, fontWeight: "bold" },
  body: { lineHeight: 1.5, marginBottom: 6 },
  finding: { marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid #e2e8f0" },
  label: { fontSize: 9, color: "#64748b", textTransform: "uppercase" },
});

export function ReportPdfDocument({ report }: { report: ReportViewModel }) {
  const { dashboard, narrative, meta, pillars } = report;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Diagnóstico — {dashboard.businessName}</Text>
        <Text style={styles.subtitle}>
          {meta.industry} · {meta.country} · {meta.createdAt} · Ref. {meta.slug}
        </Text>
        <Text style={styles.body}>
          Puntaje global: {dashboard.globalScore}/100 ({dashboard.scoreLabel})
        </Text>
        <Text style={styles.section}>Resumen</Text>
        <Text style={styles.body}>{narrative.headline}</Text>
        <Text style={styles.body}>{narrative.summary}</Text>
        <Text style={styles.section}>Pilares</Text>
        {pillars.map((p) => (
          <Text key={p.id} style={styles.body}>
            {p.label}: {p.score}/{p.max} ({p.pct}%)
          </Text>
        ))}
        <Text style={styles.section}>Hallazgos</Text>
        {narrative.findings.map((f, i) => (
          <View key={i} style={styles.finding}>
            <Text style={styles.body}>
              {i + 1}. {f.title} ({f.severity})
            </Text>
            <Text style={styles.body}>{f.whatWeFound}</Text>
            <Text style={styles.body}>{f.whyItMatters}</Text>
          </View>
        ))}
        <Text style={styles.section}>Quick win</Text>
        <Text style={styles.body}>{narrative.quickWin}</Text>
        <Text style={styles.section}>Software recomendado</Text>
        <Text style={styles.body}>{narrative.softwareRecommendations.summary}</Text>
        {narrative.softwareRecommendations.items.map((item) => (
          <View key={item.category} style={styles.finding}>
            <Text style={styles.body}>
              {item.category}: {item.recommendation}
            </Text>
            <Text style={styles.body}>{item.why}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}
