import React, { useState } from 'react';

import Layout from '../components/templates/Layout';
import SEO from '../components/templates/SEO';
import Hero from '../components/organisms/Hero';
import CategoryTileRow from '../components/organisms/CategoryTileRow';
import FeaturedPair from '../components/organisms/FeaturedPair';
import FeaturedSpecialtyGrid from '../components/organisms/FeaturedSpecialtyGrid';
import CinematicBand from '../components/organisms/CinematicBand';
import MakeYourOwnCTA from '../components/organisms/MakeYourOwnCTA';
import ReviewsRotator from '../components/organisms/ReviewsRotator';
import BullwhipAnatomy from '../components/organisms/BullwhipAnatomy';
import ContactCTA from '../components/organisms/ContactCTA';
import InstagramFeed from '../components/organisms/InstagramFeed';
import FadeInOnScroll from '../components/atoms/FadeInOnScroll';
import useDocumentScrollThrottled, { ScrollData } from '../../useDocumentScroll';

const MINIMUM_SCROLL = 350;

const Index = () => {
  const [showHeader, setShowHeader] = useState(false);

  useDocumentScrollThrottled((callbackData: ScrollData) => {
    const { currentScrollTop } = callbackData;
    const isMinimumScrolled = currentScrollTop > MINIMUM_SCROLL;

    setTimeout(() => {
      setShowHeader(isMinimumScrolled);
    }, 200);
  });

  return (
    <Layout headerBackground={showHeader ? undefined : 'rgba(26, 20, 15, 0.6)'}>
      <SEO
        title="Handcrafted Custom Whips"
        description="Handcrafted custom bullwhips and stockwhips. Design your own or choose from our specialty collection. Made in Minneapolis."
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'WhipWorks',
          url: 'https://www.whipworks.com',
          logo: 'https://www.whipworks.com/favicon_large.png',
          description:
            'Handcrafted custom bullwhips and stockwhips. Design your own or choose from our specialty collection.',
          sameAs: [
            'https://www.etsy.com/shop/WhipWorks',
            'https://www.youtube.com/@whipworks4468',
            'https://www.instagram.com/whipworks/',
          ],
        }}
      />
      {/* Hero and CategoryTileRow are NOT wrapped in FadeInOnScroll:
          Hero has its own parallax and needs to be fully visible on
          initial paint; CategoryTileRow sits directly below the hero
          and is typically already partially visible at page load, so
          an initial opacity:0 would cause a noticeable pop-in on
          taller viewports. CinematicBand also skips the wrapper
          because it has its own scroll-driven parallax on the tagline
          — layering an outer fade on top would feel like too much
          motion for what's meant to be an atmospheric pause. */}
      <Hero />
      <CategoryTileRow />
      <FadeInOnScroll>
        <FeaturedPair />
      </FadeInOnScroll>
      {/* FeaturedSpecialtyGrid manages its own scroll-triggered
          animation internally — tiles slide in from alternating
          left/right directions in a row-by-row cascade, which can't
          be expressed by the generic FadeInOnScroll wrapper. */}
      <FeaturedSpecialtyGrid />
      <CinematicBand />
      {/* MakeYourOwnCTA also manages its own scroll-triggered
          animation internally — Blueprints + Materials slide in from
          alternating sides (matching the specialty tiles' treatment)
          while the Heading/Subhead block and the wide YouTube card
          fade up. That mix of directions only works with per-element
          viewport triggers inside the component. */}
      <MakeYourOwnCTA />
      <FadeInOnScroll>
        <ReviewsRotator />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <BullwhipAnatomy />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <InstagramFeed />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <ContactCTA />
      </FadeInOnScroll>
    </Layout>
  );
};

export default Index;
