import React from 'react';
import { Link } from 'gatsby';
import styled from '@emotion/styled';

/**
 * ContactCTA
 *
 * Full-bleed bookend at the bottom of the homepage — the last editorial
 * moment before the footer. Pairs with the Hero at the top for a
 * bookended composition: both are full-bleed image bands with centered
 * type, but where Hero opens the page with "here's the craft," this
 * one closes it with "here's how to reach out."
 *
 * Background photo: `batchesComp.jpg` — a composite of completed whip
 * batches on a white ground. The white background is atypical for our
 * otherwise dark aesthetic, so the overlay gradient is heavier than a
 * normal photo darkening: we're muting a bright image down to a dark
 * cinematic plate while still letting the whip shapes read through.
 * Stops (0.55 → 0.7 → 0.85) are tuned so cream-on-overlay text has
 * reliable contrast at the bottom (where the button + mailto live) and
 * the top half retains enough of the image content to feel like a
 * showcase of the finished work, not a flat color.
 *
 * Two CTAs by design — primary solid-gold button to `/contact` for
 * people who want a structured form, and a quieter mailto underneath
 * for people who prefer their own mail client. The solid gold is the
 * strongest visual CTA on the whole page (every other section uses
 * glass/outline buttons), since this is the final ask.
 *
 * Full-bleed breakout uses the same `margin-left: calc((100% - 100vw) / 2)`
 * pattern as Hero, CinematicBand, and ReviewsRotator.
 */

const SectionContainer = styled.section`
  display: block;
  box-sizing: border-box;
  align-self: stretch;
  flex-shrink: 0;
  position: relative;
  width: 100vw;
  max-width: 100vw;
  margin-left: calc((100% - 100vw) / 2);
  margin-right: calc((100% - 100vw) / 2);
  margin-top: 96px;
  /* No bottom margin — this band butts against the footer directly, so
     the final full-bleed moment reads as the end of the page. */
  margin-bottom: 0;

  height: 60vh;
  min-height: 480px;
  max-height: 680px;
  overflow: hidden;

  @media (max-width: 900px) {
    height: 55vh;
    min-height: 440px;
  }

  @media (max-width: 560px) {
    /* Auto-height on phones — the stacked content (eyebrow + heading +
       subhead + button + mailto) needs enough room to breathe, and a
       vh-based height risks either truncating or leaving awkward empty
       space depending on the specific device. */
    height: auto;
    min-height: 0;
    padding: 64px 24px 72px;
    /* Phone-width trim — matches the 48px vertical rhythm used across
       the constrained sections. Margin-bottom stays at 0 so the band
       still butts against the footer as the final page moment. */
    margin-top: 48px;
  }
`;

const Background = styled.div<{ src: string }>`
  position: absolute;
  inset: 0;
  background-image: url(${(p) => p.src});
  background-size: cover;
  background-position: center;
`;

/* Bottom-heavy gradient, tuned for a white-background source image.
   Because the underlying photo is bright (white seamless behind the
   whip batches), the overlay has to carry more weight than the typical
   dark-photo darkening: 0.55 at the top barely registers on the image
   but already gives cream text readable contrast; 0.85 at the bottom
   mutes the image to near-black where the button and mailto sit, so
   their contrast is rock-solid. Between those two stops the whip
   shapes still read through as a soft cinematic backdrop. */
const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.55) 0%,
    rgba(0, 0, 0, 0.7) 50%,
    rgba(0, 0, 0, 0.85) 100%
  );
`;

const Content = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  text-align: center;

  @media (max-width: 560px) {
    /* Position: static on mobile since the parent has auto height and
       padding — absolute positioning would collapse the container. */
    position: static;
    padding: 0;
  }
`;

const Eyebrow = styled.p`
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #d6a85f;
  margin: 0 0 16px;
`;

const Heading = styled.h2`
  font-family: 'Domine Variable', Domine, serif;
  font-weight: 500;
  font-size: 3rem;
  line-height: 1.2;
  letter-spacing: 0.01em;
  color: #f5ebe0;
  margin: 0 0 20px;
  max-width: 22ch;
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.6);

  @media (max-width: 900px) {
    font-size: 2.2rem;
  }

  @media (max-width: 560px) {
    font-size: 1.75rem;
  }
`;

const Subhead = styled.p`
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 1.05rem;
  line-height: 1.55;
  letter-spacing: 0.03em;
  color: #f5ebe0;
  opacity: 0.92;
  margin: 0 0 36px;
  max-width: 56ch;
  text-shadow: 0 1px 12px rgba(0, 0, 0, 0.55);

  @media (max-width: 900px) {
    font-size: 0.98rem;
    margin-bottom: 28px;
  }

  @media (max-width: 560px) {
    font-size: 0.95rem;
  }
`;

/**
 * Primary CTA — solid gold on dark. This is the strongest visual button
 * on the whole homepage (every other section uses glass/outline styles),
 * which is deliberate: this is the last call to action before the user
 * leaves the page.
 *
 * Gatsby <Link> for route prefetching — the /contact page form is worth
 * preloading since anyone who gets this far is a qualified lead.
 */
const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-decoration: none;
  color: #1a140f;
  background-color: #d6a85f;
  border: 1px solid #d6a85f;
  transition: background-color 0.3s ease, border-color 0.3s ease,
    color 0.3s ease, transform 0.3s ease;

  &:hover,
  &:focus-visible {
    background-color: #e8b970;
    border-color: #e8b970;
    color: #1a140f;
  }

  &:hover .button-arrow,
  &:focus-visible .button-arrow {
    transform: translateX(4px);
  }

  &:focus-visible {
    outline: 2px solid #f5ebe0;
    outline-offset: 3px;
  }
`;

const ButtonArrow = styled.span`
  display: inline-block;
  transition: transform 0.3s ease;
`;

/**
 * Secondary mailto — quieter alternative for people who prefer their
 * own mail client over a form. Treated as a single unified link (the
 * "or email" prefix + the address) so the whole line is a single click
 * target with a consistent hover state.
 */
const MailtoWrap = styled.div`
  margin-top: 20px;
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  color: #f5ebe0;
  opacity: 0.8;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.55);
`;

const MailtoLink = styled.a`
  color: #d6a85f;
  text-decoration: none;
  border-bottom: 1px solid rgba(214, 168, 95, 0.4);
  padding-bottom: 1px;
  transition: color 0.3s ease, border-color 0.3s ease;

  &:hover,
  &:focus-visible {
    color: #f5ebe0;
    border-bottom-color: #f5ebe0;
  }

  &:focus-visible {
    outline: 2px solid #d6a85f;
    outline-offset: 3px;
  }
`;

const BG_IMAGE =
  'https://whipworks.s3.us-east-2.amazonaws.com/bannerImages/heroImages/batchesComp.jpg';

const ContactCTA = () => {
  return (
    <SectionContainer aria-label="Get in touch">
      <Background aria-hidden src={BG_IMAGE} />
      <Overlay aria-hidden />
      <Content>
        <Eyebrow>Get in touch</Eyebrow>
        <Heading>Dreaming up something custom?</Heading>
        <Subhead>
          Have a question? Let&rsquo;s talk. I answer every message personally
          — from custom whip inquiries to questions about your order.
        </Subhead>
        <PrimaryButton to="/contact">
          Contact Adam
          <ButtonArrow className="button-arrow" aria-hidden>
            →
          </ButtonArrow>
        </PrimaryButton>
        <MailtoWrap>
          or email{' '}
          <MailtoLink href="mailto:inquiries@whipworks.com">
            inquiries@whipworks.com
          </MailtoLink>
        </MailtoWrap>
      </Content>
    </SectionContainer>
  );
};

export default ContactCTA;
