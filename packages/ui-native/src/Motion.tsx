import { useEffect, useRef, useState, type ReactNode } from "react";
import { AccessibilityInfo, Animated, Easing, Platform, Pressable, Text, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { motion } from "@my-design/tokens";

const native = Platform.OS !== "web";

/** Shared easing curves (same as the web's --md-ease-* tokens). */
export const ease = {
  standard: Easing.bezier(...motion.bezier.standard),
  out: Easing.bezier(...motion.bezier.out),
  spring: Easing.bezier(...motion.bezier.spring),
  emphasized: Easing.bezier(...motion.bezier.emphasized),
};
/** Shared durations in ms (same as the web's --md-duration-* tokens). */
export const duration = motion.duration;
/** Shared spring presets. */
export const springs = motion.spring;

/** True when the user turned on "Reduce motion" in system settings. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled?.().then((v) => alive && setReduced(v)).catch(() => {});
    const sub = AccessibilityInfo.addEventListener?.("reduceMotionChanged", setReduced);
    return () => {
      alive = false;
      sub?.remove?.();
    };
  }, []);
  return reduced;
}

/** Spring scale for press feedback: spread the handlers on a Pressable and `scale` on an Animated.View. */
export function usePressScale(to = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;
  const reduced = useReducedMotion();
  const spring = (v: number) => Animated.spring(scale, { toValue: v, useNativeDriver: native, ...(v === 1 ? springs.settle : springs.press) }).start();
  return {
    scale,
    onPressIn: () => !reduced && spring(to),
    onPressOut: () => spring(1),
  };
}

/** Pressable that shrinks slightly and springs back. */
export function PressableScale({ children, onPress, to = 0.97, style, disabled, accessibilityLabel }: { children: ReactNode; onPress?: () => void; to?: number; style?: StyleProp<ViewStyle>; disabled?: boolean; accessibilityLabel?: string }) {
  const { scale, onPressIn, onPressOut } = usePressScale(to);
  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} disabled={disabled} accessibilityRole={onPress ? "button" : undefined} accessibilityLabel={accessibilityLabel}>
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

/** Fades and slides its content in on mount. Use `delay` to stagger a list. */
export function FadeIn({ children, delay = 0, distance = 14, duration = motion.duration.slower, style }: { children: ReactNode; delay?: number; distance?: number; duration?: number; style?: StyleProp<ViewStyle> }) {
  const t = useRef(new Animated.Value(0)).current;
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return t.setValue(1);
    Animated.timing(t, { toValue: 1, duration, delay, easing: ease.emphasized, useNativeDriver: native }).start();
  }, [reduced]);
  return (
    <Animated.View style={[style, { opacity: t, transform: [{ translateY: t.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] }) }] }]}>
      {children}
    </Animated.View>
  );
}

/** Counts up to `value`. */
export function AnimatedNumber({ value, duration = 1000, prefix = "", suffix = "", decimals = 0, style }: { value: number; duration?: number; prefix?: string; suffix?: string; decimals?: number; style?: StyleProp<TextStyle> }) {
  const [shown, setShown] = useState(0);
  const reduced = useReducedMotion();
  const from = useRef(0);
  useEffect(() => {
    if (reduced) return setShown(value);
    const a = new Animated.Value(from.current);
    const id = a.addListener(({ value: v }) => {
      from.current = v;
      setShown(v);
    });
    Animated.timing(a, { toValue: value, duration, easing: ease.emphasized, useNativeDriver: false }).start();
    return () => a.removeListener(id);
  }, [value, reduced]);
  return (
    <Text style={style} accessibilityLabel={`${prefix}${value}${suffix}`}>
      {prefix}
      {shown.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </Text>
  );
}
