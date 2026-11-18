import { Button, GlassPanel, Heading, Input, Orb, Progress, Scene, Text } from "@my-design/ui-web";
import { HeartIcon, PinIcon, StarIcon } from "./icons";

const products = [
  { name: "Rose Glow", price: "$89", hue: "rose" as const },
  { name: "Amethyst", price: "$54", hue: "pearl" as const },
  { name: "Crystal", price: "$112", hue: "bubble" as const },
];

export function App() {
  return (
    <Scene className="page">
      <Orb size={120} className="deco deco--a" />
      <Orb size={46} variant="pearl" className="deco deco--b" />
      <Orb size={70} variant="rose" className="deco deco--c" />

      <div className="layout">
        <GlassPanel tone="dark" elevation="lg" padding="lg" drip={{ intensity: 0.9, drops: [70, 82] }} className="hero">
          <nav className="nav">
            <span className="brand"><Orb size={18} variant="pearl" float={false} /> Your Brand</span>
            <div className="links">
              <a href="#">Home</a><a href="#">About</a><a href="#">Shop</a><a href="#">Contact</a>
            </div>
          </nav>
          <Heading level={1}>Your Brand<br />Starts Here</Heading>
          <Text muted>Soft glass, warm light and a little magic. Replace this with your own story.</Text>
          <div className="hero__cta">
            <Button drip>Discover</Button>
            <Button variant="ghost">Learn more</Button>
          </div>
        </GlassPanel>

        <div className="chips">
          <Button icon={<PinIcon />} drip>Destinations</Button>
          <Button icon={<StarIcon />}>Favorites</Button>
          <Button icon={<HeartIcon />} variant="solid">Saved</Button>
        </div>

        <div className="products">
          {products.map((p) => (
            <GlassPanel key={p.name} tone="dark" tilt drip={{ intensity: 0.5, drops: [40, 75] }} className="product">
              <div className="product__art"><Orb size={84} variant={p.hue} /></div>
              <Heading level={4}>{p.name}</Heading>
              <Text muted>{p.price}</Text>
            </GlassPanel>
          ))}
        </div>

        <GlassPanel tone="dark" className="routine">
          <Heading level={3}>My Routine</Heading>
          <Progress label="Hydration" value={72} />
          <Progress label="Progress" value={48} />
          <Progress label="Balance" value={86} />
        </GlassPanel>

        <GlassPanel className="signup">
          <Heading level={3}>Stay in the glow</Heading>
          <Input label="Email" placeholder="you@example.com" type="email" />
          <Button variant="solid" fullWidth>Subscribe</Button>
        </GlassPanel>
      </div>
    </Scene>
  );
}
