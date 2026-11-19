import { useRef, useState } from "react";
import { Animated, Platform, Pressable, StyleSheet, Text, View, type GestureResponderEvent, type LayoutChangeEvent } from "react-native";
import { iconPaths, type IconName } from "@my-design/tokens";
import { font, r, sh, themed, useColors } from "./theme";
import { Icon } from "./Icon";
import { springs, useReducedMotion } from "./Motion";

const native = Platform.OS !== "web";
/** Max tilt in degrees. Small on purpose: you feel the depth, the motion stays out of the way. */
const TILT = 10;

export const nativeIconNames = Object.keys(iconPaths) as IconName[];

/** A 3D icon tile: soft depth, and on press it tips toward your finger and springs back. */
export function IconTile({ name, label = name, size = 20, onPress, width }: { name: IconName; label?: string; size?: number; onPress?: () => void; width?: number | `${number}%` }) {
  const c = useColors();
  const styles = useStyles();
  const reduced = useReducedMotion();
  const box = useRef({ w: 1, h: 1 });
  const rx = useRef(new Animated.Value(0)).current;
  const ry = useRef(new Animated.Value(0)).current;
  const press = useRef(new Animated.Value(0)).current;

  const spring = (v: Animated.Value, to: number) => Animated.spring(v, { toValue: to, useNativeDriver: native, ...springs.settle });
  const onLayout = (e: LayoutChangeEvent) => (box.current = { w: e.nativeEvent.layout.width || 1, h: e.nativeEvent.layout.height || 1 });
  const onPressIn = (e: GestureResponderEvent) => {
    if (reduced) return;
    const px = e.nativeEvent.locationX / box.current.w;
    const py = e.nativeEvent.locationY / box.current.h;
    Animated.parallel([spring(rx, (0.5 - py) * TILT * 2), spring(ry, (px - 0.5) * TILT * 2), spring(press, 1)]).start();
  };
  const onPressOut = () => Animated.parallel([spring(rx, 0), spring(ry, 0), spring(press, 0)]).start();

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} onLayout={onLayout} accessibilityRole={onPress ? "button" : undefined} accessibilityLabel={label} style={{ width }}>
      <Animated.View
        style={[
          styles.tile,
          {
            transform: [
              { perspective: 600 },
              { rotateX: rx.interpolate({ inputRange: [-90, 90], outputRange: ["-90deg", "90deg"] }) },
              { rotateY: ry.interpolate({ inputRange: [-90, 90], outputRange: ["-90deg", "90deg"] }) },
              { scale: press.interpolate({ inputRange: [0, 1], outputRange: [1, 0.95] }) },
            ],
          },
        ]}
      >
        <Animated.View style={{ transform: [{ translateY: press.interpolate({ inputRange: [0, 1], outputRange: [0, -3] }) }] }}>
          <Icon name={name} size={size} color={c.primaryText} />
        </Animated.View>
        <Text style={styles.label} numberOfLines={1}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

/** Wrapping grid of IconTiles. `columns` sets how many fit per row. */
export function IconGrid({ names = nativeIconNames, columns = 4, size = 20, onSelect }: { names?: IconName[]; columns?: number; size?: number; onSelect?: (name: IconName) => void }) {
  const [w, setW] = useState(0);
  const gap = 8;
  const tileW = w ? (w - gap * (columns - 1)) / columns : undefined;
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap }} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
      {tileW !== undefined && names.map((n) => <IconTile key={n} name={n} size={size} width={tileW} onPress={onSelect ? () => onSelect(n) : undefined} />)}
    </View>
  );
}

const useStyles = themed((c) =>
  StyleSheet.create({
    tile: {
      alignItems: "center", gap: 8, paddingTop: 14, paddingBottom: 10, paddingHorizontal: 4,
      borderRadius: r.md, backgroundColor: c.surface,
      borderWidth: 1, borderColor: c.border,
      ...sh.sm,
    },
    label: { fontSize: 11, fontFamily: font.regular, color: c.textMuted, maxWidth: "100%" },
  }),
);
