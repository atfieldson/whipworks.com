import React, { useState, ChangeEvent } from 'react';
import { graphql } from 'gatsby';
import { Flex, Text, Heading, Box, Select, Button } from '@chakra-ui/react';

import Layout from './Layout';
import SEO from './SEO';
import ProductImages from '../molecules/ProductImages';

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
  pageContext: {
    snipcartOptions: object;
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

const ProductPage = ({ data, location, pageContext }: Props) => {
  const product = data.markdownRemark.frontmatter;
  const { snipcartOptions } = pageContext;

  const [price, setPrice] = useState(product.price);
  const [options, setOptions] = useState({});

  const handleVariantChange = (e: ChangeEvent<HTMLSelectElement>, variant: Variant) => {
    /** assign snipcart values */
    const index = product.variants?.findIndex((v) => v.name === variant.name) || 0;
    setOptions({
      ...options,
      [`data-item-custom${index + 1}-value`]: e.target.value,
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
              <Select
                defaultValue={v.defaultValue}
                onChange={(e) => handleVariantChange(e, v)}
                bg="rgba(255,255,255,0.9)"
                borderColor="rgba(255,255,255,0.16)"
                _hover={{ bg: 'rgba(255,255,255,1)' }}
                _active={{ bg: 'rgba(255,255,255,1)' }}
                color="#000000"
                fontWeight="bold"
              >
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
            {...snipcartOptions}
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
  query ($slug: String!) {
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
