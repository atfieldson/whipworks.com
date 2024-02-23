import { Button, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import Layout from '../components/templates/Layout';
import SEO from '../components/templates/SEO';
import { Link } from 'gatsby';

const NotFoundPage = () => {
  return (
    <Layout>
      <SEO title="404: Not found" />
      <Heading letterSpacing="wide">Not found</Heading>
      <Text mt="2">Whoops! It looks like this page doesn't exist.</Text>
      <Button mt="6" as={Link} to="/">
        Take me back
      </Button>
    </Layout>
  );
};

export default NotFoundPage;
