"use client";

import { triggerAnimationAtom } from "@/components/Blob";
import { useAtomValue } from "jotai";
import Link from "next/link";
import css from './page.module.css'

type HoverLinkProps = {
    href: string;
    title: string;
}

const HoverLink = ({ href, title }: HoverLinkProps) => {
    const { triggerAnimation } = useAtomValue(triggerAnimationAtom);

    const handleHover = () => {
        triggerAnimation?.();
    }

    return <Link className={css.link} onMouseEnter={handleHover} href={href}>{title}</Link>
}

export default HoverLink;