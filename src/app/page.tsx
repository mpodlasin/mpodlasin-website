import css from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={css.wrapper}>
      <Link href="/demos/orthographic-hero">Orthographic Hero</Link>
      <Link href="/demos/cave-hero">Cave Hero</Link>
    </div>
  );
}
