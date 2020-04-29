import React from 'react';
import Layout from '../../components/templates/Layout';
import SEO from '../../components/atoms/Seo';
import { Text, Flex, Box, Heading, Button } from '@chakra-ui/core';
import HeaderOffset from '../../components/templates/HeaderOffset';
import Content from '../../components/templates/Content';
import ProductImages from '../../components/atoms/ProductImages';

const indy = () => (
  <Layout>
    <SEO title="Indy Bullwhip" />
    <HeaderOffset />
    <Content>
      <Flex mt="5">
        <ProductImages />
        <Flex flex="1" ml="6" direction="column">
          <Heading>The Indy Bullwhip</Heading>
          <Text my="3">Some clever description here.</Text>
          <Text mt="6">Style:</Text>
          <Text mt="6">Length:</Text>
          <Text mt="6">Waxed?</Text>
          <Box>
            <Heading fontSize="2xl" mt="10" mb="4">
              $436
            </Heading>
            <Button variantColor="blue" size="lg">
              Add to Cart
            </Button>
          </Box>
        </Flex>
      </Flex>
    </Content>
  </Layout>
);

indy.propTypes = {};

indy.defaultProps = {};

export default indy;
