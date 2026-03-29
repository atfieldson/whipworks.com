import React from 'react';
import Layout from '../components/templates/Layout';
import SEO from '../components/templates/SEO';
import { BullwhipDesigner } from '../components/organisms/BullwhipDesigner/index';

const DesignBullwhipPage = ({ location }: { location: any }) => (
  <Layout>
    <SEO
      title="Design a Bullwhip"
      description="Design your own custom bullwhip. Choose your colors, handle pattern, concho, and more. Starting at $234."
      structuredData={{
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'Custom Bullwhip',
        description: 'Design your own custom bullwhip. Choose your colors, handle pattern, concho, and more.',
        brand: {
          '@type': 'Brand',
          name: 'WhipWorks',
        },
        offers: {
          '@type': 'Offer',
          url: 'https://www.whipworks.com/design-bullwhip',
          priceCurrency: 'USD',
          price: 234,
          availability: 'https://schema.org/InStock',
          priceSpecification: {
            '@type': 'PriceSpecification',
            price: 234,
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
    <BullwhipDesigner location={location} />
  </Layout>
);

export default DesignBullwhipPage;
