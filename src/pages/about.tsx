import React from 'react';

import Layout from '../components/templates/Layout';
import SEO from '../components/templates/SEO';
import AboutContent from '../components/organisms/AboutContent';

const AboutPage = () => (
  <Layout>
    <SEO
      title="About the Whipmaker"
      description="Meet Adam Fieldson, the craftsman behind WhipWorks. Handmade paracord bullwhips, stockwhips, and snakewhips built one plait at a time in Minneapolis."
    />
    <AboutContent />
  </Layout>
);

export default AboutPage;
