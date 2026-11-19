import type { ReactNode } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { dataColors, type IconName } from "@my-design/tokens";
import { font, fs, r, sh, themed, useColors, type Colors } from "./theme";
import { Icon } from "./Icon";
import { PressableScale } from "./Motion";

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------
export function Card({ children, variant = "outlined", padding = 16, onPress, style }: { children: ReactNode; variant?: "outlined" | "elevated" | "muted"; padding?: number; onPress?: () => void; style?: StyleProp<ViewStyle> }) {
  const c = useColors();
  const styles = useStyles();
  const base = [styles.card, variant === "outlined" && sh.sm, variant === "elevated" && sh.md, variant === "muted" && { backgroundColor: c.surfaceMuted }, { padding }, style];
  if (!onPress) return <View style={base}>{children}</View>;
  return (
    <PressableScale onPress={onPress} to={0.98} style={base}>
      {children}
    </PressableScale>
  );
}

export function CardHeader({ title, subtitle, icon, action }: { title: string; subtitle?: string; icon?: IconName; action?: ReactNode }) {
  const c = useColors();
  const styles = useStyles();
  return (
    <View style={styles.cardHeader}>
      {icon && (
        <View style={styles.cardIcon}>
          <Icon name={icon} size={18} color={c.primaryText} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        {subtitle && <Text style={styles.muted}>{subtitle}</Text>}
      </View>
      {action}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Badge, Chip
// ---------------------------------------------------------------------------
export type Tone = "neutral" | "primary" | "success" | "warning" | "danger" | "info";
const tonesFor = (c: Colors): Record<Tone, [string, string]> => ({
  neutral: [c.surfaceSunken, c.textSecondary],
  primary: [c.primarySoft, c.primaryText],
  success: [c.successSoft, c.successText],
  warning: [c.warningSoft, c.warningText],
  danger: [c.dangerSoft, c.dangerText],
  info: [c.infoSoft, c.infoText],
});

export function Badge({ children, tone = "neutral", dot }: { children: ReactNode; tone?: Tone; dot?: boolean }) {
  const c = useColors();
  const styles = useStyles();
  const [bg, fg] = tonesFor(c)[tone];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      {dot && <View style={[styles.badgeDot, { backgroundColor: fg }]} />}
      <Text style={[styles.badgeText, { color: fg }]}>{children}</Text>
    </View>
  );
}

export function Chip({ label, selected, onPress, onRemove, icon }: { label: string; selected?: boolean; onPress?: () => void; onRemove?: () => void; icon?: IconName }) {
  const c = useColors();
  const styles = useStyles();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: !!selected }} style={[styles.chip, selected && styles.chipOn]}>
      {icon && <Icon name={icon} size={15} color={selected ? c.primaryText : c.textSecondary} />}
      <Text style={[styles.chipText, selected && { color: c.primaryText }]}>{label}</Text>
      {onRemove && (
        <Pressable onPress={onRemove} hitSlop={8} accessibilityLabel={`Remove ${label}`}>
          <Icon name="close" size={14} color={c.textMuted} />
        </Pressable>
      )}
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------
const avatarSizes = { xs: 24, sm: 32, md: 40, lg: 56, xl: 80 };
const colorFor = (name: string) => dataColors[[...name].reduce((a, ch) => a + ch.charCodeAt(0), 0) % dataColors.length];
const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join("");

export function Avatar({ name, uri, size = "md", status, ring }: { name: string; uri?: string; size?: keyof typeof avatarSizes; status?: "online" | "away" | "busy" | "offline"; ring?: boolean }) {
  const c = useColors();
  const styles = useStyles();
  const px = avatarSizes[size];
  const statusColor = { online: c.success, away: c.warning, busy: c.danger, offline: c.textDisabled };
  return (
    <View style={[{ width: px, height: px, borderRadius: px / 2, backgroundColor: colorFor(name), alignItems: "center", justifyContent: "center" }, ring && { borderWidth: 3, borderColor: c.surface }]} accessibilityLabel={name}>
      {uri ? <Image source={{ uri }} style={{ width: "100%", height: "100%", borderRadius: px / 2 }} /> : <Text style={{ color: "#fff", fontFamily: font.semibold, fontSize: px * 0.36 }}>{initials(name)}</Text>}
      {status && <View style={[styles.status, { width: px * 0.28, height: px * 0.28, borderRadius: px, backgroundColor: statusColor[status] }]} />}
    </View>
  );
}

export function AvatarGroup({ names, max = 4, size = "sm" }: { names: string[]; max?: number; size?: keyof typeof avatarSizes }) {
  const c = useColors();
  const styles = useStyles();
  const px = avatarSizes[size];
  const extra = names.length - max;
  return (
    <View style={{ flexDirection: "row" }}>
      {names.slice(0, max).map((n, i) => (
        <View key={n} style={{ marginLeft: i ? -px / 4 : 0, borderRadius: px, borderWidth: 2, borderColor: c.surface }}>
          <Avatar name={n} size={size} />
        </View>
      ))}
      {extra > 0 && (
        <View style={[{ width: px + 4, height: px + 4, borderRadius: px, marginLeft: -px / 4, backgroundColor: c.surfaceSunken, borderWidth: 2, borderColor: c.surface, alignItems: "center", justifyContent: "center" }]}>
          <Text style={{ fontSize: 11, fontFamily: font.semibold, color: c.textSecondary }}>+{extra}</Text>
        </View>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Divider, ListItem, ListSection
// ---------------------------------------------------------------------------
export function Divider({ inset = 0 }: { inset?: number }) {
  const c = useColors();
  return <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: c.borderStrong, marginLeft: inset }} />;
}

export function ListItem({ title, subtitle, icon, leading, trailing, value, chevron, onPress, danger }: { title: string; subtitle?: string; icon?: IconName; leading?: ReactNode; trailing?: ReactNode; value?: string; chevron?: boolean; onPress?: () => void; danger?: boolean }) {
  const c = useColors();
  const styles = useStyles();
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={({ pressed }) => [styles.li, pressed && { backgroundColor: c.surfaceMuted }]}>
      {icon && (
        <View style={[styles.liIcon, danger && { backgroundColor: c.dangerSoft }]}>
          <Icon name={icon} size={18} color={danger ? c.danger : c.textSecondary} />
        </View>
      )}
      {leading}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text numberOfLines={1} style={[styles.liTitle, danger && { color: c.dangerText }]}>{title}</Text>
        {subtitle && <Text numberOfLines={1} style={styles.muted}>{subtitle}</Text>}
      </View>
      {value && <Text style={styles.muted}>{value}</Text>}
      {trailing}
      {chevron && <Icon name="chevronRight" size={18} color={c.textDisabled} />}
    </Pressable>
  );
}

/** Grouped list in a rounded card, like iOS settings. */
export function ListSection({ title, children, footer }: { title?: string; children: ReactNode; footer?: string }) {
  const c = useColors();
  const styles = useStyles();
  const items = (Array.isArray(children) ? children : [children]).filter(Boolean);
  return (
    <View style={{ gap: 8 }}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      <View style={styles.section}>
        {items.map((child, i) => (
          <View key={i}>
            {i > 0 && <Divider inset={16} />}
            {child}
          </View>
        ))}
      </View>
      {footer && <Text style={[styles.muted, { paddingHorizontal: 4 }]}>{footer}</Text>}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Stat, EmptyState, Timeline
// ---------------------------------------------------------------------------
export function Stat({ label, value, delta, trend = "up", icon, style }: { label: string; value: string; delta?: string; trend?: "up" | "down"; icon?: IconName; style?: StyleProp<ViewStyle> }) {
  const c = useColors();
  const styles = useStyles();
  return (
    <Card style={[{ gap: 6, flex: 1 }, style]} padding={14}>
      <View style={styles.between}>
        <Text style={styles.muted}>{label}</Text>
        {icon && (
          <View style={styles.statIcon}>
            <Icon name={icon} size={16} color={c.primaryText} />
          </View>
        )}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      {delta && (
        <View style={[styles.delta, { backgroundColor: trend === "up" ? c.successSoft : c.dangerSoft }]}>
          <Icon name={trend === "up" ? "arrowUp" : "arrowDown"} size={11} strokeWidth={2.5} color={trend === "up" ? c.successText : c.dangerText} />
          <Text style={{ fontSize: 11, fontFamily: font.semibold, color: trend === "up" ? c.successText : c.dangerText }}>{delta}</Text>
        </View>
      )}
    </Card>
  );
}

export function EmptyState({ icon = "inbox", title, description, action }: { icon?: IconName; title: string; description?: string; action?: ReactNode }) {
  const c = useColors();
  const styles = useStyles();
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Icon name={icon} size={26} color={c.textMuted} />
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      {description && <Text style={[styles.muted, { textAlign: "center", maxWidth: 280 }]}>{description}</Text>}
      {action && <View style={{ marginTop: 12 }}>{action}</View>}
    </View>
  );
}

export function Timeline({ items }: { items: Array<{ title: string; time?: string; description?: string; tone?: Tone; icon?: IconName }> }) {
  const c = useColors();
  const styles = useStyles();
  return (
    <View>
      {items.map((it, i) => {
        const [bg, fg] = tonesFor(c)[it.tone ?? "neutral"];
        return (
          <View key={i} style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ alignItems: "center" }}>
              <View style={[styles.tlDot, { backgroundColor: bg }]}>{it.icon && <Icon name={it.icon} size={12} color={fg} strokeWidth={2.25} />}</View>
              {i < items.length - 1 && <View style={styles.tlLine} />}
            </View>
            <View style={{ flex: 1, paddingBottom: 18 }}>
              <View style={styles.between}>
                <Text style={styles.liTitle}>{it.title}</Text>
                {it.time && <Text style={[styles.muted, { fontSize: fs.xs }]}>{it.time}</Text>}
              </View>
              {it.description && <Text style={styles.muted}>{it.description}</Text>}
            </View>
          </View>
        );
      })}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------
export function ProfileHeader({ name, title, uri, status, stats, actions }: { name: string; title?: string; uri?: string; status?: "online" | "away" | "busy" | "offline"; stats?: Array<{ label: string; value: string }>; actions?: ReactNode }) {
  const c = useColors();
  const styles = useStyles();
  return (
    <View style={styles.profile}>
      <View style={styles.cover} />
      <View style={{ alignItems: "center", marginTop: -44, gap: 4, paddingHorizontal: 16 }}>
        <Avatar name={name} uri={uri} size="xl" status={status} ring />
        <Text style={[styles.cardTitle, { fontSize: fs["2xl"], marginTop: 6 }]}>{name}</Text>
        {title && <Text style={styles.muted}>{title}</Text>}
      </View>
      {actions && <View style={{ flexDirection: "row", gap: 8, justifyContent: "center", marginTop: 14 }}>{actions}</View>}
      {stats && (
        <View style={styles.pStats}>
          {stats.map((s, i) => (
            <View key={s.label} style={[styles.pStat, i > 0 && { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: c.borderStrong }]}>
              <Text style={[styles.cardTitle, { fontSize: fs.xl }]}>{s.value}</Text>
              <Text style={[styles.muted, { fontSize: fs.xs }]}>{s.label}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Carousel (horizontal paging slider)
// ---------------------------------------------------------------------------
export function Carousel({ children, itemWidth = 280, gap = 12 }: { children: ReactNode[]; itemWidth?: number; gap?: number }) {
  const c = useColors();
  const styles = useStyles();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={itemWidth + gap} decelerationRate="fast" contentContainerStyle={{ gap, paddingRight: gap }}>
      {children.map((ch, i) => (
        <View key={i} style={{ width: itemWidth }}>
          {ch}
        </View>
      ))}
    </ScrollView>
  );
}

const useStyles = themed((c) => StyleSheet.create({
  card: { backgroundColor: c.surface, borderRadius: r.lg, borderWidth: 1, borderColor: c.border },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  cardIcon: { width: 36, height: 36, borderRadius: r.md, backgroundColor: c.primarySoft, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: c.border, ...sh.sm },
  statIcon: { width: 30, height: 30, borderRadius: r.md, backgroundColor: c.primarySoft, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: c.border, ...sh.sm },
  cardTitle: { fontSize: fs.lg, fontFamily: font.semibold, color: c.text },
  muted: { fontSize: fs.sm + 1, color: c.textMuted, fontFamily: font.regular },
  between: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  badge: { flexDirection: "row", alignItems: "center", gap: 5, alignSelf: "flex-start", height: 22, paddingHorizontal: 8, borderRadius: 11 },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: fs.xs, fontFamily: font.medium },
  chip: { flexDirection: "row", alignItems: "center", gap: 6, height: 34, paddingHorizontal: 12, borderRadius: 17, borderWidth: 1, borderColor: c.borderStrong, backgroundColor: c.surface },
  chipOn: { backgroundColor: c.primarySoft, borderColor: c.primarySoftHover },
  chipText: { fontSize: fs.sm + 1, fontFamily: font.medium, color: c.textSecondary },
  status: { position: "absolute", right: 0, bottom: 0, borderWidth: 2, borderColor: c.surface },
  li: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 52, paddingHorizontal: 16, paddingVertical: 10 },
  liIcon: { width: 34, height: 34, borderRadius: r.md, backgroundColor: c.surfaceSunken, alignItems: "center", justifyContent: "center" },
  liTitle: { fontSize: fs.md + 1, color: c.text, fontFamily: font.medium },
  section: { backgroundColor: c.surface, borderRadius: r.lg, borderWidth: 1, borderColor: c.border, overflow: "hidden" },
  sectionTitle: { fontSize: 12, letterSpacing: 0.5, textTransform: "uppercase", color: c.textMuted, fontFamily: font.semibold, paddingHorizontal: 4 },
  statValue: { fontSize: fs["3xl"], fontFamily: font.semibold, color: c.text, letterSpacing: -0.4 },
  delta: { flexDirection: "row", alignItems: "center", gap: 2, alignSelf: "flex-start", paddingHorizontal: 6, paddingVertical: 2, borderRadius: r.xs },
  empty: { alignItems: "center", gap: 6, paddingVertical: 32, paddingHorizontal: 16 },
  emptyIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: c.surfaceSunken, alignItems: "center", justifyContent: "center", marginBottom: 6, borderWidth: 1, borderColor: c.border, ...sh.sm },
  tlDot: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  tlLine: { flex: 1, width: 2, backgroundColor: c.border, marginVertical: 2 },
  profile: { backgroundColor: c.surface, borderRadius: r.xl, borderWidth: 1, borderColor: c.border, overflow: "hidden", paddingBottom: 0 },
  cover: { height: 96, backgroundColor: c.primary },
  pStats: { flexDirection: "row", borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.borderStrong, marginTop: 16 },
  pStat: { flex: 1, alignItems: "center", paddingVertical: 12 },
}));
