import React from 'react';
import { Heading, Text } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * Hero
 *
 * Full-bleed hero that breaks out of the 1080px Content container and sits
 * behind the (translucent) header. Accepts a static image by default, or a
 * looping video via the `videoSrc` prop — this is how we'll swap in B-roll
 * footage later without a redesign.
 */

const DEFAULT_IMAGE =
  'https://whipworks.s3.us-east-2.amazonaws.com/bannerImages/FB+Banner.jpg';

/**
 * Plain <section> (not styled(Box)) to avoid any Chakra Box layer that could
 * interfere with width at narrow viewports. Flex-escape props (align-self,
 * flex-shrink) are set so the parent's flex-column layout can't shrink us
 * below 100vw on narrow screens.
 */
const HeroContainer = styled.section`
  display: block;
  box-sizing: border-box;
  align-self: stretch;
  flex-shrink: 0;
  position: relative;
  width: 100vw;
  max-width: 100vw;
  /* Break out of the centered 1080px Content container. calc((100% - 100vw) / 2)
     always equals (container-width - viewport-width) / 2, pulling us to the
     viewport edge regardless of parent padding/width. */
  margin-left: calc((100% - 100vw) / 2);
  margin-right: calc((100% - 100vw) / 2);
  margin-top: -100px; /* cancel Content's 100px top padding so hero sits behind the header */
  margin-bottom: 96px;
  height: 62vh; /* intentionally shorter than viewport so next section peeks below the fold */
  min-height: 420px;
  max-height: 760px;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 55vh;
    min-height: 320px;
  }
`;

/* Wrapped in motion.div so we can drive a subtle parallax (y translate) from scroll. */
const HeroMedia = styled(motion.div)<{ src: string }>`
  position: absolute;
  inset: 0;
  background-image: url(${(p) => p.src});
  background-size: cover;
  background-position: center;
  will-change: transform;
`;

const HeroVideo = styled(motion.video)`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  will-change: transform;
`;

const Gradient = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(26, 20, 15, 0.45) 0%,
    rgba(26, 20, 15, 0.15) 45%,
    rgba(26, 20, 15, 0.8) 100%
  );
`;

const TextOverlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 18%;
  padding: 0 30px;
  text-align: center;
  color: #f5ebe0;
  z-index: 1;
`;

type HeroProps = {
  imageSrc?: string;
  videoSrc?: string;
  tagline?: string;
  subhead?: string;
  imageAlt?: string;
};

const Hero = ({
  imageSrc = DEFAULT_IMAGE,
  videoSrc,
  tagline = 'The crack of a whip — faster than sound, slow to forget.',
  subhead = 'Handcrafted custom bullwhips, stockwhips, and snakewhips. Made in Minneapolis.',
  imageAlt = 'A handcrafted WhipWorks bullwhip',
}: HeroProps) => {
  /* Subtle parallax: as the user scrolls the first ~900px of the page,
     the hero background translates down ~180px — roughly a 0.2x factor.
     This makes the foreground content appear to "slide up over" the hero,
     giving a cinematic sense of depth without being gimmicky. */
  const { scrollY } = useScroll();
  const mediaY = useTransform(scrollY, [0, 900], [0, 180]);

  return (
    <HeroContainer aria-label="WhipWorks hero">
      {videoSrc ? (
        <HeroVideo
          autoPlay
          muted
          loop
          playsInline
          poster={imageSrc}
          style={{ y: mediaY }}
        >
          <source src={videoSrc} type="video/mp4" />
        </HeroVideo>
      ) : (
        <HeroMedia
          src={imageSrc}
          role="img"
          aria-label={imageAlt}
          style={{ y: mediaY }}
        />
      )}

      <Gradient />

      <TextOverlay>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          <Heading
            as="h1"
            fontFamily="'Domine Variable', Domine, serif"
            fontWeight="500"
            fontSize={{ base: '1.75rem', md: '2.75rem', lg: '3.5rem' }}
            lineHeight="1.2"
            textShadow="0 2px 16px rgba(0,0,0,0.6)"
            mb="4"
            maxW="1000px"
            mx="auto"
          >
            {tagline}
          </Heading>
          {subhead && (
            <Text
              fontFamily="'Josefin Sans Variable', 'Josefin Sans', sans-serif"
              fontSize={{ base: '0.95rem', md: '1.15rem' }}
              letterSpacing="0.05em"
              textShadow="0 2px 12px rgba(0,0,0,0.55)"
              opacity={0.92}
              maxW="720px"
              mx="auto"
            >
              {subhead}
            </Text>
          )}
        </motion.div>
      </TextOverlay>
    </HeroContainer>
  );
};

export default Hero;
