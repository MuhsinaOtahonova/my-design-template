import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts, Jost_300Light, Jost_400Regular, Jost_500Medium } from "@expo-google-fonts/jost";
import { Button, Drip, GlassPanel, Heading, Orb, Progress, Scene, Text } from "@my-design/ui-native";

type Screen = "home" | "components";

export default function App() {
  const [fontsLoaded] = useFonts({ Jost_300Light, Jost_400Regular, Jost_500Medium });
  const [screen, setScreen] = useState<Screen>("home");
  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1 }}>
      <Scene />
      <StatusBar style="dark" />
      <Orb size={90} style={[styles.deco, { top: 70, right: 20 }]} />
      <Orb size={40} style={[styles.deco, { top: 420, left: 14 }]} />
      <ScrollView contentContainerStyle={styles.content}>
        {screen === "home" ? <Home /> : <Components />}
      </ScrollView>
      <View style={styles.tabbar}>
        <Button size="sm" variant={screen === "home" ? "solid" : "glass"} onPress={() => setScreen("home")}>Home</Button>
        <Button size="sm" variant={screen === "components" ? "solid" : "glass"} onPress={() => setScreen("components")}>Components</Button>
      </View>
    </View>
  );
}

function Home() {
  return (
    <>
      <GlassPanel tone="dark" elevation="lg" drip>
        <Heading level={1}>Your Brand</Heading>
        <Text muted style={{ marginTop: 12, marginBottom: 20 }}>
          Soft glass, warm light and a little magic.
        </Text>
        <Button drip>Discover</Button>
      </GlassPanel>

      <View style={styles.row}>
        <Button variant="solid">Saved</Button>
        <Button variant="ghost">Explore</Button>
      </View>

      <GlassPanel tone="dark" style={{ marginTop: 32 }}>
        <Heading level={3} style={{ marginBottom: 16 }}>My Routine</Heading>
        <View style={{ gap: 14 }}>
          <Progress label="Hydration" value={72} />
          <Progress label="Progress" value={48} />
          <Progress label="Balance" value={86} />
        </View>
      </GlassPanel>
    </>
  );
}

/** Every native component in every variant. */
function Components() {
  return (
    <View style={{ gap: 36 }}>
      <GlassPanel tone="dark">
        <Heading level={3} style={{ marginBottom: 12 }}>Typography</Heading>
        <Heading level={1}>Heading 1</Heading>
        <Heading level={2}>Heading 2</Heading>
        <Heading level={3}>Heading 3</Heading>
        <Text style={{ marginTop: 8 }}>Body text, Jost Light.</Text>
        <Text muted>Muted text.</Text>
      </GlassPanel>

      <GlassPanel tone="dark">
        <Heading level={3} style={{ marginBottom: 16 }}>Buttons</Heading>
        {(["glass", "solid", "ghost"] as const).map((v) => (
          <View key={v} style={styles.wrap}>
            <Button variant={v} size="sm">{v} sm</Button>
            <Button variant={v}>{v} md</Button>
            <Button variant={v} size="lg">lg</Button>
          </View>
        ))}
        <View style={styles.wrap}>
          <Button drip>Melting</Button>
          <Button disabled>Disabled</Button>
        </View>
      </GlassPanel>

      <View style={{ gap: 28 }}>
        <Heading level={3}>Glass panels</Heading>
        {(["light", "dark"] as const).map((tone) => (
          <View key={tone} style={styles.wrap}>
            {(["sm", "md", "lg"] as const).map((el) => (
              <GlassPanel key={el} tone={tone} elevation={el} padding={4} style={{ flexBasis: "30%", flexGrow: 1 }}>
                <Text>{tone}</Text>
                <Text muted>{el}</Text>
              </GlassPanel>
            ))}
          </View>
        ))}
        <GlassPanel tone="dark" drip>
          <Text>drip: melting edge</Text>
        </GlassPanel>
      </View>

      <GlassPanel tone="dark" style={{ marginTop: 8 }}>
        <Heading level={3} style={{ marginBottom: 16 }}>Drip tones</Heading>
        <View style={{ gap: 52, paddingBottom: 40 }}>
          {(["light", "dark", "rose"] as const).map((tone) => (
            <View key={tone}>
              <View style={[styles.dripBar, tone === "light" ? styles.light : tone === "dark" ? styles.dark : styles.rose]}>
                <Text style={{ paddingHorizontal: 12 }}>{tone}</Text>
              </View>
              <Drip tone={tone} intensity={1} />
            </View>
          ))}
        </View>
      </GlassPanel>

      <GlassPanel tone="dark">
        <Heading level={3} style={{ marginBottom: 16 }}>Orbs & progress</Heading>
        <View style={[styles.wrap, { alignItems: "center", justifyContent: "space-around" }]}>
          <Orb size={80} /><Orb size={56} /><Orb size={32} />
        </View>
        <View style={{ gap: 14, marginTop: 16 }}>
          <Progress label="25%" value={25} />
          <Progress label="60%" value={60} />
          <Progress label="3 / 5" value={3} max={5} />
        </View>
      </GlassPanel>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingTop: 100, paddingBottom: 140 },
  row: { flexDirection: "row", gap: 12, marginTop: 48 },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 14 },
  deco: { position: "absolute" },
  tabbar: { position: "absolute", left: 0, right: 0, bottom: 28, flexDirection: "row", justifyContent: "center", gap: 12 },
  dripBar: { height: 36, borderRadius: 12, justifyContent: "center" },
  light: { backgroundColor: "rgba(255,255,255,0.32)" },
  dark: { backgroundColor: "rgba(87,78,83,0.6)" },
  rose: { backgroundColor: "rgba(221,160,180,0.7)" },
});
