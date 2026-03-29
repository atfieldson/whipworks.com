import React from 'react';
import Layout from '../components/templates/Layout';
import SEO from '../components/templates/SEO';
import { StockwhipDesigner } from '../components/organisms/BullwhipDesigner/index';

const DesignStockwhipPage = ({ location }: { location: any }) => (
  <Layout>
    <SEO
      title="Design a Stockwhip"
      description="Design your own custom stockwhip. Choose your colors, handle pattern, concho, and more. Starting at $229."
      structuredData={{
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'Custom Stockwhip',
        description: 'Design your own custom stockwhip. Choose your colors, handle pattern, concho, and more.',
        brand: {
          '@type': 'Brand',
          name: 'WhipWorks',
        },
        offers: {
          '@type': 'Offer',
          url: 'https://www.whipworks.com/design-stockwhip',
          priceCurrency: 'USD',
          price: 229,
          availability: 'https://schema.org/InStock',
          priceSpecification: {
            '@type': 'PriceSpecification',
            price: 229,
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
    <StockwhipDesigner location={location} />
  </Layout>
);

export default DesignStockwhipPage;