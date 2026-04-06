import React from 'react';
import Layout from '../components/templates/Layout';
import SEO from '../components/templates/SEO';
import { SnakewhipDesigner } from '../components/organisms/BullwhipDesigner/index';

const DesignSnakewhipPage = ({ location }: { location: any }) => (
  <Layout>
    <SEO
      title="Design a Snakewhip"
      description="Design your own custom snakewhip. Choose your colors, handle pattern, concho, and more. Starting at $149."
      structuredData={{
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'Custom Snakewhip',
        description: 'Design your own custom snakewhip. Choose your colors, handle pattern, concho, and more.',
        brand: {
          '@type': 'Brand',
          name: 'WhipWorks',
        },
        offers: {
          '@type': 'Offer',
          url: 'https://www.whipworks.com/design-snakewhip',
          priceCurrency: 'USD',
          price: 149,
          availability: 'https://schema.org/InStock',
          priceSpecification: {
            '@type': 'PriceSpecification',
            price: 149,
            priceCurrency: 'USD',
            valueAddedTaxIncluded: false,
          },
          seller: {
            '@type': 'Organization',
            name: 'WhipWorks',
          },
        },
      }}
    />
    <SnakewhipDesigner location={location} />
  </Layout>
);

export default DesignSnakewhipPage;
