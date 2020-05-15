import React from 'react';
import { Heading, Text } from '@chakra-ui/core';
import { navigate } from 'gatsby';

import Layout from '../components/templates/Layout';
import SEO from '../components/templates/SEO';
import Button from '../components/atoms/Button';

const NotFoundPage = () => {
  const goBack = () => {
    navigate('/');
  };

  return (
    <Layout>
      <SEO title="404: Not found" />
      <Heading letterSpacing="wide">Not found</Heading>
      <Text mt="2">Whoops! It looks like this page doesn&apos;t exist yet.</Text>
      <Button mt="6" onClick={goBack}>
        Take me back
      </Button>
    </Layout>
  );
};

export default NotFoundPage;
