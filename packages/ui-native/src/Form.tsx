import { useRef, useState, type ReactNode } from "react";
import { PanResponder, Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";
import type { IconName } from "@my-design/tokens";
import { font, fs, r, sh, themed, useColors } from "./theme";
import { Icon } from "./Icon";

// ---------------------------------------------------------------------------
// TextField
// ---------------------------------------------------------------------------
export interface TextFieldProps extends TextInputProps {
  label?: string;
  hint?: string;
  error?: string;
  icon?: IconName;
  required?: boolean;
  /** Multi-line text area */
  multiline?: boolean;
}

export function TextField({ label, hint, error, icon, required, secureTextEntry, multiline, style, ...rest }: TextFieldProps) {
  const c = useColors();
  const styles = useStyles();
  const [focused, setFocused] = useState(false);
  const [reveal, setReveal] = useState(false);
  return (
    <View style={styles.field}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={{ color: c.danger }}> *</Text>}
        </Text>
      )}
      <View style={[styles.box, multiline && styles.boxMulti, focused && styles.boxFocus, !!error && styles.boxError]}>
        {icon && <Icon name={icon} size={18} color={c.textMuted} />}
        <TextInput
          placeholderTextColor={c.textDisabled}
          style={[styles.input, multiline && { height: 96, textAlignVertical: "top", paddingTop: 10 }, style]}
          secureTextEntry={secureTextEntry && !reveal}
          multiline={multiline}
          onFocus={(e) => (setFocused(true), rest.onFocus?.(e))}
          onBlur={(e) => (setFocused(false), rest.onBlur?.(e))}
          {...rest}
        />
        {secureTextEntry && (
          <Pressable accessibilityLabel={reveal ? "Hide password" : "Show password"} onPress={() => setReveal((v) => !v)} hitSlop={8}>
            <Icon name={reveal ? "eyeOff" : "eye"} size={18} color={c.textMuted} />
          </Pressable>
        )}
      </View>
      {error ? (
        <View style={styles.row4}>
          <Icon name="alert" size={14} color={c.dangerText} />
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : (
        hint && <Text style={styles.hint}>{hint}</Text>
      )}
    </View>
  );
}

export function SearchBar(props: TextInputProps) {
  const c = useColors();
  const styles = useStyles();
  return (
    <View style={[styles.box, styles.search]}>
      <Icon name="search" size={18} color={c.textMuted} />
      <TextInput placeholder="Search" placeholderTextColor={c.textMuted} style={styles.input} returnKeyType="search" {...props} />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Select (tappable field; open your own picker / bottom sheet on press)
// ---------------------------------------------------------------------------
export function SelectField({ label, value, placeholder = "Select…", onPress, icon }: { label?: string; value?: string; placeholder?: string; onPress?: () => void; icon?: IconName }) {
  const c = useColors();
  const styles = useStyles();
  return (
    <View style={styles.field}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [styles.box, pressed && { backgroundColor: c.surfaceMuted }]}>
        {icon && <Icon name={icon} size={18} color={c.textMuted} />}
        <Text style={[styles.input, styles.selectText, !value && { color: c.textDisabled }]}>{value ?? placeholder}</Text>
        <Icon name="chevronDown" size={18} color={c.textMuted} />
      </Pressable>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Checkbox, Radio, Switch
// ---------------------------------------------------------------------------
interface ToggleProps {
  checked: boolean;
  onChange?: (v: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

function ToggleRow({ control, label, description, onPress, disabled, role, checked, reverse }: { control: ReactNode; label?: ReactNode; description?: ReactNode; onPress: () => void; disabled?: boolean; role: "checkbox" | "radio" | "switch"; checked: boolean; reverse?: boolean }) {
  const c = useColors();
  const styles = useStyles();
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole={role} accessibilityState={{ checked, disabled }} style={[styles.toggle, reverse && { justifyContent: "space-between" }, disabled && { opacity: 0.5 }]}>
      {!reverse && control}
      {(label || description) && (
        <View style={{ flex: reverse ? 1 : undefined, flexShrink: 1, gap: 2 }}>
          {label && <Text style={styles.toggleLabel}>{label}</Text>}
          {description && <Text style={styles.hint}>{description}</Text>}
        </View>
      )}
      {reverse && control}
    </Pressable>
  );
}

export function Checkbox({ checked, onChange, label, description, disabled }: ToggleProps) {
  const c = useColors();
  const styles = useStyles();
  return (
    <ToggleRow
      role="checkbox"
      checked={checked}
      disabled={disabled}
      onPress={() => onChange?.(!checked)}
      label={label}
      description={description}
      control={<View style={[styles.check, checked && styles.checkOn]}>{checked && <Icon name="check" size={14} color="#fff" strokeWidth={3} />}</View>}
    />
  );
}

export function Radio({ checked, onChange, label, description, disabled }: ToggleProps) {
  const c = useColors();
  const styles = useStyles();
  return (
    <ToggleRow
      role="radio"
      checked={checked}
      disabled={disabled}
      onPress={() => onChange?.(true)}
      label={label}
      description={description}
      control={<View style={[styles.check, styles.radio, checked && styles.radioOn]} />}
    />
  );
}

export function RadioGroup<T extends string>({ options, value, onChange }: { options: Array<{ value: T; label: string; description?: string }>; value: T; onChange: (v: T) => void }) {
  const c = useColors();
  const styles = useStyles();
  return (
    <View style={{ gap: 14 }}>
      {options.map((o) => (
        <Radio key={o.value} checked={value === o.value} onChange={() => onChange(o.value)} label={o.label} description={o.description} />
      ))}
    </View>
  );
}

/** iOS-style switch drawn with tokens, so it looks the same on every platform. */
export function Switch({ checked, onChange, label, description, disabled }: ToggleProps) {
  const c = useColors();
  const styles = useStyles();
  return (
    <ToggleRow
      role="switch"
      reverse={!!label}
      checked={checked}
      disabled={disabled}
      onPress={() => onChange?.(!checked)}
      label={label}
      description={description}
      control={
        <View style={[styles.track, checked && { backgroundColor: c.primary }]}>
          <View style={[styles.thumb, checked && { transform: [{ translateX: 18 }] }]} />
        </View>
      }
    />
  );
}

// ---------------------------------------------------------------------------
// Slider
// ---------------------------------------------------------------------------
export function Slider({ value, onChange, min = 0, max = 100, step = 1, label, format = String }: { value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; label?: string; format?: (v: number) => string }) {
  const c = useColors();
  const styles = useStyles();
  const width = useRef(1);
  const start = useRef(0);
  const latest = useRef({ value, onChange });
  latest.current = { value, onChange };
  const toValue = (x: number) => {
    const ratio = Math.max(0, Math.min(1, x / width.current));
    return Math.round((min + ratio * (max - min)) / step) * step;
  };
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e) => {
        start.current = e.nativeEvent.locationX;
        latest.current.onChange(toValue(start.current));
      },
      onPanResponderMove: (_, g) => latest.current.onChange(toValue(start.current + g.dx)),
    }),
  ).current;
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <View style={{ gap: 8 }}>
      {label && (
        <View style={styles.between}>
          <Text style={styles.label}>{label}</Text>
          <Text style={[styles.label, { fontFamily: font.semibold }]}>{format(value)}</Text>
        </View>
      )}
      <View
        style={styles.sliderHit}
        onLayout={(e) => (width.current = e.nativeEvent.layout.width)}
        accessibilityRole="adjustable"
        accessibilityValue={{ min, max, now: value }}
        {...pan.panHandlers}
      >
        <View pointerEvents="none" style={styles.sliderTrack}>
          <View style={[styles.sliderFill, { width: `${pct}%` }]} />
        </View>
        <View pointerEvents="none" style={[styles.sliderThumb, { left: `${pct}%` }]} />
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// SegmentedControl
// ---------------------------------------------------------------------------
export function SegmentedControl<T extends string>({ options, value, onChange }: { options: Array<{ value: T; label: string }>; value: T; onChange: (v: T) => void }) {
  const c = useColors();
  const styles = useStyles();
  return (
    <View style={styles.segmented} accessibilityRole="tablist">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable key={o.value} onPress={() => onChange(o.value)} accessibilityRole="tab" accessibilityState={{ selected: on }} style={[styles.segment, on && styles.segmentOn]}>
            <Text style={[styles.segmentText, on && { color: c.text }]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Stepper (number +/-)
// ---------------------------------------------------------------------------
export function NumberStepper({ value, onChange, min = 0, max = 99, label }: { value: number; onChange: (v: number) => void; min?: number; max?: number; label?: string }) {
  const c = useColors();
  const styles = useStyles();
  return (
    <View style={[styles.between, { minHeight: 44 }]}>
      {label && <Text style={styles.toggleLabel}>{label}</Text>}
      <View style={styles.stepper}>
        <Pressable accessibilityLabel="Decrease" disabled={value <= min} onPress={() => onChange(value - 1)} style={[styles.stepBtn, value <= min && { opacity: 0.4 }]}>
          <Icon name="minus" size={16} color={c.text} />
        </Pressable>
        <Text style={styles.stepValue}>{value}</Text>
        <Pressable accessibilityLabel="Increase" disabled={value >= max} onPress={() => onChange(value + 1)} style={[styles.stepBtn, value >= max && { opacity: 0.4 }]}>
          <Icon name="plus" size={16} color={c.text} />
        </Pressable>
      </View>
    </View>
  );
}

const useStyles = themed((c) => StyleSheet.create({
  field: { gap: 6 },
  label: { fontSize: fs.sm + 1, color: c.text, fontFamily: font.medium },
  hint: { fontSize: fs.xs + 1, color: c.textMuted, fontFamily: font.regular },
  error: { fontSize: fs.xs + 1, color: c.dangerText, fontFamily: font.regular },
  row4: { flexDirection: "row", alignItems: "center", gap: 4 },
  between: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  box: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 46, paddingHorizontal: 12, borderRadius: r.md, borderWidth: 1, borderColor: c.borderStrong, backgroundColor: c.surface },
  boxMulti: { alignItems: "flex-start", paddingTop: 0 },
  boxFocus: { borderColor: c.primary, borderWidth: 1.5 },
  boxError: { borderColor: c.danger },
  input: { flex: 1, minHeight: 44, fontSize: fs.md + 1, color: c.text, fontFamily: font.regular, outlineStyle: "none" } as never,
  selectText: { minHeight: 0, lineHeight: 44 },
  search: { backgroundColor: c.surfaceSunken, borderColor: "transparent", minHeight: 40, borderRadius: r.lg },
  toggle: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  toggleLabel: { fontSize: fs.md + 1, color: c.text, fontFamily: font.regular, lineHeight: 22 },
  check: { width: 22, height: 22, borderRadius: r.xs + 1, borderWidth: 1.5, borderColor: c.borderStrong, backgroundColor: c.surface, alignItems: "center", justifyContent: "center" },
  checkOn: { backgroundColor: c.primary, borderColor: c.primary },
  radio: { borderRadius: 11 },
  radioOn: { borderColor: c.primary, borderWidth: 6.5 },
  track: { width: 44, height: 26, borderRadius: 13, backgroundColor: c.borderStrong, padding: 3 },
  thumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: "#fff", ...sh.sm },
  sliderHit: { height: 32, justifyContent: "center" },
  sliderTrack: { height: 4, borderRadius: 2, backgroundColor: c.border, overflow: "hidden" },
  sliderFill: { height: 4, backgroundColor: c.primary },
  sliderThumb: { position: "absolute", width: 24, height: 24, marginLeft: -12, borderRadius: 12, backgroundColor: "#fff", borderWidth: 2, borderColor: c.primary, ...sh.md },
  segmented: { flexDirection: "row", padding: 3, borderRadius: r.md + 1, backgroundColor: c.surfaceSunken },
  segment: { flex: 1, height: 34, alignItems: "center", justifyContent: "center", borderRadius: r.sm + 1 },
  segmentOn: { backgroundColor: c.surface, ...sh.sm },
  segmentText: { fontSize: fs.sm + 1, color: c.textSecondary, fontFamily: font.medium },
  stepper: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: c.borderStrong, borderRadius: r.md, overflow: "hidden" },
  stepBtn: { width: 38, height: 36, alignItems: "center", justifyContent: "center", backgroundColor: c.surfaceMuted },
  stepValue: { minWidth: 40, textAlign: "center", fontSize: fs.md + 1, fontFamily: font.semibold, color: c.text },
}));
