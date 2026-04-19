import React from 'react';
import styled from '@emotion/styled';

/**
 * BullwhipAnatomy
 *
 * Reference diagram + descriptive caption explaining the named parts
 * of a bullwhip (heel, handle, mid knot, thong, hitch knot, fall,
 * popper). Sits between ReviewsRotator and InstagramFeed as the one
 * educational moment left on the homepage — everything else in the
 * revamp is editorial/aspirational, this is the "how the thing is
 * built" anchor.
 *
 * Restyled from the original Chakra Box+Heading+Image+Text inline to
 * match the typographic language used across the rest of the revamp
 * (Domine serif heading, gold eyebrow in Josefin Sans small-caps,
 * centered layout, 96px vertical section margins). The underlying
 * content — diagram image + body paragraph — is unchanged; only the
 * presentation is aligned with the new design system.
 *
 * Not full-bleed by design: this section is informational, not
 * atmospheric. Full-bleed is reserved for the "event" sections
 * (Hero, CategoryTileRow, CinematicBand, ReviewsRotator, ContactCTA).
 */

const DIAGRAM_SRC =
  'https://d3ruufruf2uqog.cloudfront.net/bannerImages/AnatomyOfABullwhip.jpg';

const SectionContainer = styled.section`
  display: block;
  box-sizing: border-box;
  width: 100%;
  margin-top: 96px;
  margin-bottom: 96px;
`;

const Eyebrow = styled.p`
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #d6a85f;
  margin: 0 0 10px;
  text-align: center;
`;

const Heading = styled.h2`
  font-family: 'Domine Variable', Domine, serif;
  font-weight: 500;
  font-size: 2.25rem;
  line-height: 1.2;
  letter-spacing: 0.01em;
  color: #f5ebe0;
  margin: 0 0 32px;
  text-align: center;

  @media (max-width: 900px) {
    font-size: 1.75rem;
  }
`;

/**
 * Thin gold hairline frame around the diagram gives it the feel of a
 * reference plate pinned to a workshop wall — signals "this is a
 * technical drawing, pay attention" without anything heavier than a
 * 1px border. Padding inside the frame matches the border thickness
 * visual, keeping the diagram breathing room from the frame edge.
 *
 * Background matches the darker band color used by ReviewsRotator
 * (#0f0b08) rather than the page base (#1a140f) so if the diagram's
 * own background is light/cream the contrast reads cleanly, and if
 * it's dark the frame still provides a subtle edge cue.
 */
const DiagramFrame = styled.div`
  width: 100%;
  max-width: 1080px;
  margin: 0 auto 32px;
  border: 1px solid rgba(214, 168, 95, 0.18);
  background-color: #0f0b08;
  padding: 12px;

  @media (max-width: 560px) {
    padding: 8px;
  }
`;

const Diagram = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const Caption = styled.p`
  font-family: 'Josefin Sans Variable', 'Josefin Sans', sans-serif;
  font-size: 1rem;
  line-height: 1.7;
  letter-spacing: 0.03em;
  color: #f5ebe0;
  opacity: 0.88;
  margin: 0 auto;
  max-width: 70ch;
  text-align: center;

  @media (max-width: 900px) {
    font-size: 0.95rem;
    text-align: left;
  }
`;

const BullwhipAnatomy = () => {
  return (
    <SectionContainer aria-label="Anatomy of a bullwhip">
      <Eyebrow>A closer look</Eyebrow>
      <Heading>The Anatomy of a Bullwhip</Heading>
      <DiagramFrame>
        <Diagram
          src={DIAGRAM_SRC}
          alt="Diagram showing the parts of a bullwhip: heel, handle, mid knot, thong, hitch knot, fall, and popper"
          loading="lazy"
          decoding="async"
        />
      </DiagramFrame>
      <Caption>
        Here&rsquo;s a break-down of a bullwhip. The handle is the stiff
        portion containing the 1/4&Prime; steel rod. The mid knot marks the
        end of the handle and the beginning of the transition — the start
        of the thong. The thong tapers down from 16 strands all the way to
        the 4-plait hitch knot, where the fall is attached. The fall
        extends another two feet, and the popper is attached at the end.
      </Caption>
    </SectionContainer>
  );
};

export default BullwhipAnatomy;
