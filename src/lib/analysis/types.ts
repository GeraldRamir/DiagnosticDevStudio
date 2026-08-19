export type SignalStatus = "ok" | "warn" | "fail";

export type Signal = {
  id: string;
  label: string;
  status: SignalStatus;
  weight: number;
  evidence: string;
  pillar: PillarId;
};

export type PillarId =
  | "presencia"
  | "rendimiento"
  | "captacion"
  | "operacion"
  | "datos";

export type PillarScore = {
  score: number;
  max: number;
  signals: Signal[];
  /** true when Rendimiento points were redistributed (no website) */
  redistributed?: boolean;
};

export type PillarScores = Record<PillarId, PillarScore>;

export type ScoreLabel = "Crítico" | "Frágil" | "Funcional" | "Sólido";

export type ScoringResult = {
  globalScore: number;
  scoreLabel: ScoreLabel;
  pillars: PillarScores;
  signals: Signal[];
  rendimientoRedistributed: boolean;
};

export type HoursBreakdown = {
  baseWeekly: number;
  multiplicador: number;
  factores: Array<{ id: string; label: string; value: number }>;
  semanasMes: number;
};

export type HoursResult = {
  horasMes: number;
  automatizable: number;
  desglose: HoursBreakdown;
};

export type TechnicalMetrics = {
  reachable: boolean;
  httpStatus: number | null;
  performanceScore: number | null;
  seoScore: number | null;
  accessibilityScore: number | null;
  bestPracticesScore: number | null;
  lcpSeconds: number | null;
  cls: number | null;
  tbtMs: number | null;
  hasViewport: boolean | null;
  isHttps: boolean | null;
  isOwnDomain: boolean | null;
  hasTitle: boolean | null;
  hasMetaDescription: boolean | null;
  hasOgTitle: boolean | null;
  hasOgImage: boolean | null;
  hasWhatsAppLink: boolean | null;
  hasContactForm: boolean | null;
  hasAnalytics: boolean | null;
  freeHostSubdomain: boolean | null;
  error?: string;
  pagespeedFailed?: boolean;
};

export type InstagramMetrics = {
  username: string;
  found: boolean;
  isPrivate: boolean | null;
  isBusiness: boolean | null;
  followers: number | null;
  following: number | null;
  posts: number | null;
  biography: string | null;
  externalUrl: string | null;
  profilePicUrl: string | null;
  lastPostAt: string | null;
  postsLast30Days: number | null;
  avgLikes: number | null;
  avgComments: number | null;
  hasReels: boolean | null;
  recentSampleSize: number | null;
  reach7d?: number | null;
  impressions7d?: number | null;
  profileViews7d?: number | null;
  oauthConnected?: boolean;
  source?: "graph" | "web_profile" | "html" | "oauth" | null;
  error?: string;
  fetchedAt: string;
};

export type NarrativeFinding = {
  title: string;
  severity: "alta" | "media" | "baja";
  whatWeFound: string;
  whyItMatters: string;
  pillar: string;
};

export type SoftwareRecommendation = {
  category: string;
  recommendation: string;
  why: string;
};

export type SoftwareRecommendations = {
  summary: string;
  items: SoftwareRecommendation[];
};

export type NarrativeResult = {
  headline: string;
  summary: string;
  findings: NarrativeFinding[];
  quickWin: string;
  softwareRecommendations: SoftwareRecommendations;
};

export type AnalysisStatus = "completo" | "parcial" | "fallback";

export type HasWebsite = "yes" | "no" | "social_only";

export type RecordKeeping = "papel" | "excel" | "software" | "ninguno";

export type WeeklyHours = "menos_5" | "5_10" | "10_20" | "mas_20";

export type TeamSize = "solo" | "2_5" | "6_15" | "mas_15";

export type OrderChannel =
  | "whatsapp"
  | "llamada"
  | "persona"
  | "redes"
  | "sistema"
  | "correo";

export type DiagnosticInput = {
  businessName: string;
  industry: string;
  country: string;
  hasWebsite: HasWebsite;
  websiteUrl?: string | null;
  instagramHandle?: string | null;
  orderChannel: OrderChannel[];
  recordKeeping: RecordKeeping;
  biggestTimeWaster: string;
  weeklyHoursOnAdmin: WeeklyHours;
  teamSize: TeamSize;
  fullName: string;
  email: string;
  whatsapp: string;
  consent: boolean;
  source?: string | null;
  campaign?: string | null;
};
