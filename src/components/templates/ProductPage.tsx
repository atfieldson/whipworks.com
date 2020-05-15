import React, { useState, useEffect, ChangeEvent } from 'react';
import { graphql } from 'gatsby';
import { Flex, Text, Heading, Box, Select } from '@chakra-ui/core';

import Layout from './Layout';
import SEO from './SEO';
import ProductImages from '../molecules/ProductImages';
import Button from '../atoms/Button';

type Option = {
  name: string;
  priceDiff?: string;
  images?: string[];
};

type Variant = {
  name: string;
  options: Option[];
  defaultValue: string;
};

interface Props {
  location: {
    pathname: string;
  };
  data: {
    markdownRemark: {
      html?: any;
      frontmatter: {
        id: string;
        title: string;
        description?: string;
        price: number;
        variants?: any[];
        images?: string[];
        weight?: number;
      };
    };
  };
}

const ProductPage = ({ data, location }: Props) => {
  const product = data.markdownRemark.frontmatter;
  const [price, setPrice] = useState(product.price);
  const [options, setOptions] = useState({});

  useEffect(() => {
    if (!product.variants) {
      return;
    }

    const props: any = {};
    for (let i = 0; i < product.variants?.length; i += 1) {
      const variant = product.variants[i];
      props[`data-item-custom${i}-name`] = variant.name;
      const stuff = variant.options
        .map((o: Option) => `${o.name}${o.priceDiff ? `[${o.priceDiff}]` : ''}`)
        .join('|');
      props[`data-item-custom${i}-options`] = stuff;
      if (variant.defaultValue) {
        props[`data-item-custom${i}-value`] = variant.defaultValue;
      }
    }

    setOptions(props);
  }, [product.variants]);

  const handleVariantChange = (e: ChangeEvent<HTMLSelectElement>, variant: Variant) => {
    /** assign snipcart values */
    const index = product.variants?.findIndex((v) => v.name === variant.name);
    setOptions({
      ...options,
      [`data-item-custom${index}-value`]: e.target.value,
    });

    /** update the price if needed */
    const option = variant.options.find((v) => v.name == e.target.value);
    // needed in case priceDiff is 0
    if (option?.priceDiff !== undefined) {
      setPrice(product.price + Number(option.priceDiff));
    }
  };

  return (
    <Layout>
      <SEO title={product.title} />
      <Flex flexDirection={{ base: 'column', md: 'row' }}>
        <ProductImages images={product.images} />
        <Flex flex="1" direction="column" ml={{ base: 0, md: '6' }} mt={{ base: '6', md: 0 }}>
          <Text fontSize="lg">{product.title}</Text>
          <Heading fontSize="3xl" letterSpacing="wider" mt="1">
            ${price}
          </Heading>
          <Text my="6">{product.description}</Text>
          {product.variants?.map((v) => (
            <Box key={v.name}>
              <Text fontWeight="bold" mb="1">
                {v.name}
              </Text>
              <Select defaultValue={v.defaultValue} onChange={(e) => handleVariantChange(e, v)}>
                {v.options.map((vo: Option) => (
                  <option value={vo.name} key={vo.name}>
                    {vo.name}
                  </option>
                ))}
              </Select>
            </Box>
          ))}
          {data.markdownRemark.html}
          <Button
            mt="4"
            className="snipcart-add-item snipcart-checkout"
            data-item-name={product.title}
            data-item-price={product.price}
            data-item-id={product.id}
            data-item-url={location.pathname}
            data-item-description={product.description}
            data-item-image={product.images && product.images[0]}
            data-item-weight={product.weight}
            {...options}
          >
            Add to Cart
          </Button>
        </Flex>
      </Flex>
    </Layout>
  );
};

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      frontmatter {
        title
        id
        price
        description
        images
        weight
        variants {
          name
          defaultValue
          options {
            name
            priceDiff
          }
        }
      }
    }
  }
`;

export default ProductPage;
