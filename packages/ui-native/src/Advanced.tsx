import { useState, type ReactNode } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { font, fs, r, themed, useColors, type Colors } from "./theme";
import { Icon } from "./Icon";
import { Avatar, Chip } from "./Display";

// ---------------------------------------------------------------------------
// StatusDot: small colored dot with an optional label
// ---------------------------------------------------------------------------
export type DotTone = "success" | "warning" | "danger" | "neutral" | "primary";
const dotColor = (c: Colors, t: DotTone) => ({ success: c.success, warning: c.warning, danger: c.danger, neutral: c.textMuted, primary: c.primary })[t];

export function StatusDot({ tone = "success", label }: { tone?: DotTone; label?: string }) {
  const c = useColors();
  const styles = useStyles();
  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: dotColor(c, tone) }]} />
      {label && <Text style={styles.dotLabel}>{label}</Text>}
    </View>
  );
}

// ---------------------------------------------------------------------------
// TagInput: type and press return to add a chip
// ---------------------------------------------------------------------------
export function TagInput({ label, value, defaultValue = [], onChange, placeholder = "Add a tag" }: { label?: string; value?: string[]; defaultValue?: string[]; onChange?: (v: string[]) => void; placeholder?: string }) {
  const c = useColors();
  const styles = useStyles();
  const [inner, setInner] = useState(defaultValue);
  const [text, setText] = useState("");
  const tags = value ?? inner;
  const set = (v: string[]) => (value === undefined && setInner(v), onChange?.(v));
  const add = () => {
    const t = text.trim();
    if (t && !tags.includes(t)) set([...tags, t]);
    setText("");
  };
  return (
    <View style={{ gap: 6 }}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.tagBox}>
        {tags.map((t) => (
          <Chip key={t} label={t} selected onRemove={() => set(tags.filter((x) => x !== t))} />
        ))}
        <TextInput
          value={text}
          onChangeText={(v) => (v.endsWith(",") ? (setText(v.slice(0, -1)), setTimeout(add)) : setText(v))}
          onSubmitEditing={add}
          blurOnSubmit={false}
          placeholder={placeholder}
          placeholderTextColor={c.textMuted}
          style={styles.tagInput}
        />
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Chat
// ---------------------------------------------------------------------------
export function ChatMessage({ author, time, children, own, status }: { author: string; time?: string; children: ReactNode; own?: boolean; status?: "sent" | "read" }) {
  const c = useColors();
  const styles = useStyles();
  return (
    <View style={[styles.msg, own && { justifyContent: "flex-end" }]}>
      {!own && <Avatar name={author} size="sm" />}
      <View style={[styles.msgBody, own && { alignItems: "flex-end" }]}>
        {!own && (
          <Text style={styles.meta}>
            <Text style={{ color: c.text, fontFamily: font.semibold }}>{author}</Text>
            {time ? `  ${time}` : ""}
          </Text>
        )}
        <View style={[styles.bubble, own ? styles.bubbleOwn : styles.bubbleOther]}>
          <Text style={[styles.bubbleText, own && { color: c.onPrimary }]}>{children}</Text>
        </View>
        {own && (time || status) && (
          <View style={styles.row}>
            {time && <Text style={styles.meta}>{time}</Text>}
            {status && <Icon name="check" size={13} color={status === "read" ? c.primaryText : c.textMuted} />}
          </View>
        )}
      </View>
    </View>
  );
}

export function ChatComposer({ onSend, placeholder = "Write a message…" }: { onSend?: (text: string) => void; placeholder?: string }) {
  const c = useColors();
  const styles = useStyles();
  const [text, setText] = useState("");
  const send = () => {
    if (!text.trim()) return;
    onSend?.(text.trim());
    setText("");
  };
  return (
    <View style={styles.composer}>
      <TextInput value={text} onChangeText={setText} onSubmitEditing={send} placeholder={placeholder} placeholderTextColor={c.textMuted} style={styles.composerInput} />
      <Pressable onPress={send} accessibilityLabel="Send" style={[styles.send, !text.trim() && { opacity: 0.5 }]}>
        <Icon name="send" size={17} color={c.onPrimary} />
      </Pressable>
    </View>
  );
}

const useStyles = themed((c) =>
  StyleSheet.create({
    row: { flexDirection: "row", alignItems: "center", gap: 6 },
    dot: { width: 8, height: 8, borderRadius: 4 },
    dotLabel: { fontSize: fs.sm + 1, fontFamily: font.regular, color: c.textSecondary },
    label: { fontSize: fs.sm + 1, fontFamily: font.medium, color: c.text },
    tagBox: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 6, minHeight: 44, padding: 6, borderRadius: r.md, borderWidth: 1, borderColor: c.borderStrong, backgroundColor: c.surface },
    tagInput: { flexGrow: 1, minWidth: 100, height: 34, paddingHorizontal: 6, fontSize: fs.md, fontFamily: font.regular, color: c.text },
    msg: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
    msgBody: { maxWidth: "78%", gap: 3 },
    meta: { fontSize: fs.xs, fontFamily: font.regular, color: c.textMuted },
    bubble: { paddingVertical: 9, paddingHorizontal: 12, borderRadius: r.lg },
    bubbleOther: { backgroundColor: c.surfaceSunken, borderBottomLeftRadius: r.xs },
    bubbleOwn: { backgroundColor: c.primary, borderBottomRightRadius: r.xs },
    bubbleText: { fontSize: fs.md, lineHeight: 20, fontFamily: font.regular, color: c.text },
    composer: { flexDirection: "row", alignItems: "center", gap: 8, padding: 6, paddingLeft: 12, borderRadius: r.lg, borderWidth: 1, borderColor: c.borderStrong, backgroundColor: c.surface },
    composerInput: { flex: 1, height: 36, fontSize: fs.md, fontFamily: font.regular, color: c.text },
    send: { width: 36, height: 36, borderRadius: r.md, backgroundColor: c.primary, alignItems: "center", justifyContent: "center" },
  }),
);
