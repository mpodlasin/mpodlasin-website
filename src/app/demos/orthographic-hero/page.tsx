import OrthogonalHero from "@/components/OrthogonalHero";
import css from './page.module.css';

export default function Home() {
  return (
      <div className={css.orthogonalContainer}>
        <OrthogonalHero />
      </div>
  );
}
