import Blob from "@/components/Blob";
import HoverLink from "./HoverLink";
import css from "./page.module.css";

export default function Home() {
  return (
    <div className={css.wrapper}>
      <div className={css.blobWrapper}><Blob /></div>
      <div className={css.contentWrapper}>
        <h2>Demos:</h2>
        <HoverLink href="/demos/orthographic-hero" title="Cube Rain" />
        <HoverLink href="/demos/cave-hero" title="Cave Hero" />
      
        <p className={css.github}>This website&apos;s source code is avilable at <a className={css.githubLink} target="_blank" href="https://github.com/mpodlasin/mpodlasin-website">GitHub</a></p>
      </div>
    </div>
  );
}
