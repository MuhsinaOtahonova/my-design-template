import { ScrollView, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts, Jost_300Light, Jost_400Regular, Jost_500Medium } from "@expo-google-fonts/jost";
import { Button, GlassPanel, Heading, Orb, Progress, Scene, Text } from "@my-design/ui-native";

export default function App() {
  const [fontsLoaded] = useFonts({ Jost_300Light, Jost_400Regular, Jost_500Medium });
  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1 }}>
      <Scene />
      <StatusBar style="dark" />
      <Orb size={90} style={[styles.deco, { top: 70, right: 20 }]} />
      <Orb size={40} style={[styles.deco, { top: 420, left: 14 }]} />
      <ScrollView contentContainerStyle={styles.content}>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingTop: 100, paddingBottom: 80 },
  row: { flexDirection: "row", gap: 12, marginTop: 48 },
  deco: { position: "absolute" },
});
