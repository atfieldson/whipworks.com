import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * FadeInOnScroll
 *
 * Wrapper that fades and slides its children up into view on first
 * scroll-into-viewport. Used across the homepage to give each editorial
 * section a subtle "arrival" as the user scrolls — small cinematic
 * polish that makes a static page feel alive without being distracting.
 *
 * Uses framer-motion's `whileInView` + `viewport` API so the animation
 * is entirely declarative. `once: true` is critical: we don't want the
 * sections fading out when the user scrolls back up, which looks
 * twitchy and undermines the "these are stable editorial blocks"
 * feeling. `amount: 0.2` means the animation fires when 20% of the
 * element crosses into the viewport — early enough that the reveal
 * feels natural (users see it happening as they scroll toward it
 * rather than after it's already on-screen).
 *
 * Uses a plain `<div>` wrapper, which fills 100% of its parent and
 * doesn't affect the full-bleed breakout math (child sections that
 * use `width: 100vw; margin-left: calc((100% - 100vw) / 2)` still
 * resolve correctly because 100% on the wrapper == 100% of the
 * Layout's content container, same as if the section were a direct
 * child).
 *
 * `delay` prop is available for future stagger scenarios but unused
 * by default — on the homepage each section fades independently when
 * its own viewport trigger fires, which reads more naturally than a
 * scripted cascade.
 */

type Props = {
  children: React.ReactNode;
  /** Optional delay in seconds before the fade begins (defaults to 0). */
  delay?: number;
  /** Optional override for how much of the element must be in-view
      before firing. Defaults to 0.2 (20%). */
  amount?: number;
};

const FadeInOnScroll = ({ children, delay = 0, amount = 0.2 }: Props) => {
  /* Respect the user's OS-level reduced-motion preference. When set,
     skip the animation entirely and render children with no wrapper —
     no opacity fade, no y-slide, nothing. Accessibility hygiene:
     vestibular disorders and cognitive sensitivities can be aggravated
     by scroll-triggered motion, and the page content is fully
     functional without it. */
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.8, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
};

export default FadeInOnScroll;
