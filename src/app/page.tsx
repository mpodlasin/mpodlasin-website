import CaveHero from "@/components/CaveHero";
import OrthogonalHero from "@/components/OrthogonalHero";

export default function Home() {
  return (
    <div>
      <div style={{height: '300vh', position: 'relative', overflow: 'hidden'}}>
        <OrthogonalHero />
      </div>
      <div style={{position: 'relative'}}>
        <CaveHero />
        <div style={{
          color: 'gray', 
          position: 'absolute', 
          bottom: 100, 
          textAlign: 'center',
          left: 0,
          right: 0,
          fontSize: 30,
          }}>
            <div>Click on the page to turn flashlight on.</div></div>
      </div>
    </div>
  );
}
