import { useState, type ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { IconName } from "@my-design/tokens";
import { font, fs, r, themed, useColors } from "./theme";
import { Icon } from "./Icon";

/** Screen header: back button, title, actions. */
export function AppBar({ title, subtitle, onBack, actions, large }: { title: string; subtitle?: string; onBack?: () => void; actions?: ReactNode; large?: boolean }) {
  const c = useColors();
  const styles = useStyles();
  return (
    <View style={styles.appbar}>
      <View style={styles.appbarRow}>
        {onBack && (
          <Pressable onPress={onBack} accessibilityLabel="Back" hitSlop={8} style={styles.back}>
            <Icon name="chevronLeft" size={24} color={c.text} />
          </Pressable>
        )}
        {!large && (
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        )}
        {large && <View style={{ flex: 1 }} />}
        <View style={{ flexDirection: "row", gap: 4 }}>{actions}</View>
      </View>
      {large && (
        <View style={{ paddingTop: 4 }}>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          <Text style={styles.largeTitle}>{title}</Text>
        </View>
      )}
    </View>
  );
}

export function TabBar<T extends string>({ items, value, onChange }: { items: Array<{ value: T; label: string; icon: IconName; badge?: number }>; value: T; onChange: (v: T) => void }) {
  const c = useColors();
  const styles = useStyles();
  return (
    <View style={styles.tabbar} accessibilityRole="tablist">
      {items.map((it) => {
        const on = it.value === value;
        return (
          <Pressable key={it.value} style={styles.tab} onPress={() => onChange(it.value)} accessibilityRole="tab" accessibilityState={{ selected: on }}>
            <View>
              <Icon name={it.icon} size={24} color={on ? c.primary : c.textMuted} strokeWidth={on ? 2 : 1.75} />
              {!!it.badge && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{it.badge}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.tabLabel, on && { color: c.primary, fontFamily: font.semibold }]}>{it.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Underlined tabs at the top of a screen section (scrolls if there are many). */
export function Tabs<T extends string>({ items, value, onChange }: { items: Array<{ value: T; label: string; count?: number }>; value: T; onChange: (v: T) => void }) {
  const c = useColors();
  const styles = useStyles();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
      {items.map((it) => {
        const on = it.value === value;
        return (
          <Pressable key={it.value} onPress={() => onChange(it.value)} style={[styles.tabsItem, on && styles.tabsItemOn]} accessibilityRole="tab" accessibilityState={{ selected: on }}>
            <Text style={[styles.tabsText, on && { color: c.primaryText }]}>{it.label}</Text>
            {it.count != null && (
              <View style={[styles.count, on && { backgroundColor: c.primarySoft }]}>
                <Text style={[styles.countText, on && { color: c.primaryText }]}>{it.count}</Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export function Accordion({ items }: { items: Array<{ title: string; content: ReactNode }> }) {
  const c = useColors();
  const styles = useStyles();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <View style={styles.acc}>
      {items.map((it, i) => (
        <View key={i} style={i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.borderStrong }}>
          <Pressable onPress={() => setOpen(open === i ? null : i)} style={styles.accHead} accessibilityState={{ expanded: open === i }}>
            <Text style={styles.accTitle}>{it.title}</Text>
            <Icon name={open === i ? "chevronUp" : "chevronDown"} size={18} color={c.textMuted} />
          </Pressable>
          {open === i && <View style={{ paddingHorizontal: 16, paddingBottom: 14 }}>{typeof it.content === "string" ? <Text style={styles.subtitle}>{it.content}</Text> : it.content}</View>}
        </View>
      ))}
    </View>
  );
}

export function Steps({ steps, current }: { steps: string[]; current: number }) {
  const c = useColors();
  const styles = useStyles();
  return (
    <View style={styles.steps}>
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <View key={s} style={{ flex: 1, alignItems: "center", gap: 6 }}>
            <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "stretch" }}>
              <View style={[styles.stepLine, { opacity: i === 0 ? 0 : 1 }, (done || active) && { backgroundColor: c.primary }]} />
              <View style={[styles.stepDot, done && styles.stepDone, active && styles.stepActive]}>
                {done ? <Icon name="check" size={14} color="#fff" strokeWidth={2.75} /> : <Text style={[styles.stepNum, active && { color: c.primaryText }]}>{i + 1}</Text>}
              </View>
              <View style={[styles.stepLine, { opacity: i === steps.length - 1 ? 0 : 1 }, done && { backgroundColor: c.primary }]} />
            </View>
            <Text numberOfLines={1} style={[styles.stepLabel, (done || active) && { color: c.text }]}>{s}</Text>
          </View>
        );
      })}
    </View>
  );
}

const useStyles = themed((c) => StyleSheet.create({
  appbar: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12, backgroundColor: c.background },
  appbarRow: { flexDirection: "row", alignItems: "center", gap: 8, minHeight: 44 },
  back: { marginLeft: -8, width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  title: { fontSize: fs.lg + 1, fontFamily: font.semibold, color: c.text },
  subtitle: { fontSize: fs.sm + 1, fontFamily: font.regular, color: c.textMuted },
  largeTitle: { fontSize: fs["4xl"], fontFamily: font.bold, color: c.text, letterSpacing: -0.5 },
  tabbar: { flexDirection: "row", backgroundColor: c.surface, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.borderStrong, paddingTop: 8, paddingBottom: 24 },
  tab: { flex: 1, alignItems: "center", gap: 3 },
  tabLabel: { fontSize: 11, fontFamily: font.medium, color: c.textMuted },
  tabBadge: { position: "absolute", top: -4, right: -10, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: c.danger, alignItems: "center", justifyContent: "center", paddingHorizontal: 4, borderWidth: 2, borderColor: c.surface },
  tabBadgeText: { color: "#fff", fontSize: 9, fontFamily: font.bold },
  tabs: { gap: 20, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.borderStrong, flexGrow: 1 },
  tabsItem: { flexDirection: "row", alignItems: "center", gap: 6, height: 42, borderBottomWidth: 2, borderBottomColor: "transparent", marginBottom: -StyleSheet.hairlineWidth },
  tabsItemOn: { borderBottomColor: c.primary },
  tabsText: { fontSize: fs.md + 1, fontFamily: font.medium, color: c.textSecondary },
  count: { minWidth: 20, height: 18, borderRadius: 9, backgroundColor: c.surfaceSunken, paddingHorizontal: 6, alignItems: "center", justifyContent: "center" },
  countText: { fontSize: 11, fontFamily: font.semibold, color: c.textSecondary },
  acc: { backgroundColor: c.surface, borderRadius: r.lg, borderWidth: 1, borderColor: c.border, overflow: "hidden" },
  accHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16 },
  accTitle: { fontSize: fs.md + 1, fontFamily: font.medium, color: c.text, flex: 1 },
  steps: { flexDirection: "row" },
  stepLine: { flex: 1, height: 2, backgroundColor: c.border },
  stepDot: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: c.borderStrong, backgroundColor: c.surface, alignItems: "center", justifyContent: "center" },
  stepDone: { backgroundColor: c.primary, borderColor: c.primary },
  stepActive: { borderColor: c.primary },
  stepNum: { fontSize: fs.sm, fontFamily: font.semibold, color: c.textMuted },
  stepLabel: { fontSize: fs.xs, fontFamily: font.medium, color: c.textMuted },
}));
