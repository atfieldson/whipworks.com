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
      <Hero />
      <CategoryTileRow />
      <FeaturedPair />
      <FeaturedSpecialtyGrid />
      <CinematicBand />
      <MakeYourOwnCTA />
      <ReviewsRotator />
      <BullwhipAnatomy />
      <InstagramFeed />
      <ContactCTA />
    </Layout>
  );
};

export default Index;
