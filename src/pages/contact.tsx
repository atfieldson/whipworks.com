import React from 'react';

import Layout from '../components/templates/Layout';
import SEO from '../components/templates/SEO';
import ContactForm from '../components/organisms/ContactForm';

const ContactPage = () => (
  <Layout>
    <SEO title="Contact" />
    <ContactForm />
  </Layout>
);

export default ContactPage;
