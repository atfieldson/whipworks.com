import React from 'react';

import Layout from '../components/templates/Layout';
import SEO from '../components/templates/SEO';
import ReviewForm from '../components/organisms/ReviewForm';

const LeaveAReviewPage = () => (
  <Layout>
    <SEO
      title="Leave a Review"
      description="Share your experience with WhipWorks! Leave a review for your custom bullwhip, stockwhip, snakewhip, or whipmaking supplies."
    />
    <ReviewForm />
  </Layout>
);

export default LeaveAReviewPage;
