// app/page.tsx
import MusicPlayer from "./components/MusicPlayer";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function Home() {
  return (
    <div>
      <MusicPlayer />
      <SpeedInsights />
    </div>
  );
}
