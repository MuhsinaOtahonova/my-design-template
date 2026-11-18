import { useEffect, useRef, type ReactNode } from "react";
import { ActivityIndicator, Animated, Modal, Pressable, StyleSheet, Text, View, type DimensionValue } from "react-native";
import type { IconName } from "@my-design/tokens";
import { font, fs, r, sh, themed, useColors, type Colors } from "./theme";
import { Icon } from "./Icon";

export type FeedbackTone = "info" | "success" | "warning" | "danger";
const toneFor = (c: Colors): Record<FeedbackTone, { bg: string; fg: string; accent: string; icon: IconName }> => ({
  info: { bg: c.infoSoft, fg: c.infoText, accent: c.info, icon: "info" },
  success: { bg: c.successSoft, fg: c.successText, accent: c.success, icon: "checkCircle" },
  warning: { bg: c.warningSoft, fg: c.warningText, accent: c.warning, icon: "alert" },
  danger: { bg: c.dangerSoft, fg: c.dangerText, accent: c.danger, icon: "xCircle" },
});

export function Alert({ tone: t = "info", title, children, onClose }: { tone?: FeedbackTone; title?: string; children?: ReactNode; onClose?: () => void }) {
  const c = useColors();
  const styles = useStyles();
  const l = toneFor(c)[t];
  return (
    <View style={[styles.alert, { backgroundColor: l.bg }]} accessibilityRole="alert">
      <Icon name={l.icon} size={20} color={l.accent} />
      <View style={{ flex: 1, gap: 2 }}>
        {title && <Text style={[styles.alertTitle, { color: l.fg }]}>{title}</Text>}
        {children && <Text style={styles.alertText}>{children}</Text>}
      </View>
      {onClose && (
        <Pressable onPress={onClose} hitSlop={8} accessibilityLabel="Dismiss">
          <Icon name="close" size={16} color={c.textMuted} />
        </Pressable>
      )}
    </View>
  );
}

/** Snackbar-style message. Render it at the bottom of the screen while `visible`. */
export function Toast({ tone: t = "success", title, description, visible = true, onClose }: { tone?: FeedbackTone; title: string; description?: string; visible?: boolean; onClose?: () => void }) {
  const c = useColors();
  const styles = useStyles();
  const y = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(y, { toValue: visible ? 1 : 0, duration: 220, useNativeDriver: true }).start();
  }, [visible, y]);
  const l = toneFor(c)[t];
  return (
    <Animated.View pointerEvents={visible ? "auto" : "none"} style={[styles.toast, { opacity: y, transform: [{ translateY: y.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }] }]}>
      <Icon name={l.icon} size={20} color={l.accent} />
      <View style={{ flex: 1 }}>
        <Text style={styles.toastTitle}>{title}</Text>
        {description && <Text style={styles.toastDesc}>{description}</Text>}
      </View>
      {onClose && (
        <Pressable onPress={onClose} hitSlop={8} accessibilityLabel="Dismiss">
          <Icon name="close" size={16} color={c.textMuted} />
        </Pressable>
      )}
    </Animated.View>
  );
}

export function Progress({ value, max = 100, label, showValue = true, tone: t, height = 8 }: { value: number; max?: number; label?: string; showValue?: boolean; tone?: FeedbackTone; height?: number }) {
  const c = useColors();
  const styles = useStyles();
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <View style={{ gap: 6 }} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max, now: value }}>
      {(label || showValue) && (
        <View style={styles.between}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showValue && <Text style={[styles.label, { fontFamily: font.semibold, color: c.text }]}>{Math.round(pct)}%</Text>}
        </View>
      )}
      <View style={[styles.track, { height, borderRadius: height }]}>
        <View style={{ width: `${pct}%`, height, borderRadius: height, backgroundColor: t ? toneFor(c)[t].accent : c.primary }} />
      </View>
    </View>
  );
}

export function Spinner({ size = "small", color }: { size?: "small" | "large"; color?: string }) {
  const c = useColors();
  color ??= c.primary;
  const styles = useStyles();
  return <ActivityIndicator size={size} color={color} />;
}

export function Skeleton({ width = "100%", height = 14, radius = r.xs as number, circle }: { width?: DimensionValue; height?: number; radius?: number; circle?: boolean }) {
  const c = useColors();
  const styles = useStyles();
  const o = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(o, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(o, { toValue: 0.5, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [o]);
  return <Animated.View style={{ width: circle ? height : width, height, borderRadius: circle ? height : radius, backgroundColor: c.border, opacity: o }} />;
}

// ---------------------------------------------------------------------------
// Dialog & BottomSheet
// ---------------------------------------------------------------------------
export function Dialog({ visible, onClose, title, description, children, actions, tone: t }: { visible: boolean; onClose: () => void; title: string; description?: string; children?: ReactNode; actions?: ReactNode; tone?: "danger" | "success" }) {
  const c = useColors();
  const styles = useStyles();
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.dialog} onPress={() => {}}>
          {t && (
            <View style={[styles.dialogIcon, { backgroundColor: t === "danger" ? c.dangerSoft : c.successSoft }]}>
              <Icon name={t === "danger" ? "alert" : "checkCircle"} size={22} color={t === "danger" ? c.danger : c.success} />
            </View>
          )}
          <Text style={styles.dialogTitle}>{title}</Text>
          {description && <Text style={[styles.alertText, { textAlign: "center" }]}>{description}</Text>}
          {children}
          {actions && <View style={{ gap: 8, marginTop: 8, alignSelf: "stretch" }}>{actions}</View>}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function BottomSheet({ visible, onClose, title, children }: { visible: boolean; onClose: () => void; title?: string; children: ReactNode }) {
  const c = useColors();
  const styles = useStyles();
  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <Pressable style={[styles.backdrop, { justifyContent: "flex-end", padding: 0 }]} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.grabber} />
          {title && <Text style={[styles.dialogTitle, { textAlign: "left", marginBottom: 8 }]}>{title}</Text>}
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const useStyles = themed((c) => StyleSheet.create({
  between: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { fontSize: fs.sm + 1, color: c.textSecondary, fontFamily: font.medium },
  alert: { flexDirection: "row", gap: 12, padding: 14, borderRadius: r.md },
  alertTitle: { fontSize: fs.md + 1, fontFamily: font.semibold },
  alertText: { fontSize: fs.sm + 1, color: c.textSecondary, fontFamily: font.regular, lineHeight: 20 },
  toast: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: r.lg, backgroundColor: c.surfaceInverse, ...sh.lg },
  toastTitle: { color: c.textInverse, fontSize: fs.md + 1, fontFamily: font.semibold },
  toastDesc: { color: c.textMuted, fontSize: fs.sm, fontFamily: font.regular },
  track: { backgroundColor: c.surfaceSunken, overflow: "hidden" },
  backdrop: { flex: 1, backgroundColor: c.overlay, justifyContent: "center", padding: 24 },
  dialog: { backgroundColor: c.surface, borderRadius: r.xl, padding: 24, alignItems: "center", gap: 8, ...sh.lg },
  dialogIcon: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  dialogTitle: { fontSize: fs.xl, fontFamily: font.semibold, color: c.text, textAlign: "center" },
  sheet: { backgroundColor: c.surface, borderTopLeftRadius: r.xl + 4, borderTopRightRadius: r.xl + 4, padding: 20, paddingBottom: 36, gap: 8 },
  grabber: { alignSelf: "center", width: 40, height: 5, borderRadius: 3, backgroundColor: c.borderStrong, marginBottom: 8 },
}));
