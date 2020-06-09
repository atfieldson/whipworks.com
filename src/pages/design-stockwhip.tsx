import React from 'react';
import Layout from '../components/templates/Layout';
import SEO from '../components/templates/SEO';
import { StockwhipDesigner } from '../components/organisms/BullwhipDesigner/index';

const DesignStockwhipPage = ({ location }: { location: any }) => (
  <Layout>
    <SEO title="Design a Bullwhip" />
    <StockwhipDesigner location={location} />
  </Layout>
);

export default DesignStockwhipPage;