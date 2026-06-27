import CaveHero from "@/components/CaveHero";
import css from './page.module.css';

export default function Home() {
  return (
      <div className={css.caveContainer}>
        <CaveHero />
        <div className={css.caveHeroHint}>
            <div>Click on the page to turn flashlight on.</div>
        </div>
      </div>
  );
}
