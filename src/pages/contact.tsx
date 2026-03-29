import React from 'react';

import Layout from '../components/templates/Layout';
import SEO from '../components/templates/SEO';
import ContactForm from '../components/organisms/ContactForm';

const ContactPage = () => (
  <Layout>
    <SEO title="Contact Us" description="Get in touch with WhipWorks. Questions about custom whips, orders, or whipmaking? We'd love to hear from you." />
    <ContactForm />
  </Layout>
);

export default ContactPage;
