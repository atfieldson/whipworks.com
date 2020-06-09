import React from 'react';
import Layout from '../components/templates/Layout';
import SEO from '../components/templates/SEO';
import { BullwhipDesigner } from '../components/organisms/BullwhipDesigner/index';

const DesignBullwhipPage = ({ location }: { location: any }) => (
  <Layout>
    <SEO title="Design a Bullwhip" />
    <BullwhipDesigner location={location} />
  </Layout>
);

export default DesignBullwhipPage;
