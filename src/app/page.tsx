import CaveHero from "@/components/CaveHero";
import OrthogonalHero from "@/components/OrthogonalHero";
import css from './page.module.css';

export default function Home() {
  return (
    <div className={css.wrapper}>
      <div className={css.orthogonalContainer}>
        <OrthogonalHero />
      </div>
      <div className={css.caveContainer}>
        <CaveHero />
        <div className={css.caveHeroHint}>
            <div>Click on the page to turn flashlight on.</div>
        </div>
      </div>
    </div>
  );
}
