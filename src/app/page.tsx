import css from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={css.wrapper}>
      <h2>Demos:</h2>
      <Link href="/demos/orthographic-hero">Cube Rain</Link>
      <Link href="/demos/cave-hero">Cave Hero</Link>
    
      <p className={css.github}>This website&apos;s source code is avilable at <a className={css.githubLink} target="_blank" href="https://github.com/mpodlasin/mpodlasin-website">GitHub</a></p>
    </div>
  );
}
