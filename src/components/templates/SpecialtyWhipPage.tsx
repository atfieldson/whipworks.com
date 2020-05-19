import React, { useState, useEffect, ChangeEvent } from 'react';
import { graphql } from 'gatsby';

import Layout from './Layout';
import SEO from './SEO';
import { Flex, Heading, RadioGroup, Text, Box, Radio, Select, Stack, Image } from '@chakra-ui/core';
import ProductImages from '../molecules/ProductImages';
import Button from '../atoms/Button';
import SpecialtyWhipCard from '../atoms/SpecialtyWhipCard';
import AddPoppersModal from '../molecules/AddPoppersModal';

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

const SpecialtyWhipPage = ({ data, pageContext, location }: Props) => {
  const whip = data.markdownRemark.frontmatter;
  const { previous, next, snipcartOptions } = pageContext;

  const [style, setStyle] = useState('');
  const [price, setPrice] = useState(whip.price);
  const [options, setOptions] = useState({});
  const [images, setImages] = useState(whip.images);
  const [modalOpen, setModalOpen] = useState(false);

  const styles = whip.hasStyles && whip.variants?.find((v) => v.name === 'Style');
  const variants = whip.hasStyles
    ? whip.variants?.filter((v) => v.name !== 'Style')
    : whip.variants;

  useEffect(() => {
    if (styles) {
      setStyle(styles.defaultValue);
      const defaultImages = styles.options.find((s: Variant) => s.name === styles.defaultValue)
        .images;
      setImages(defaultImages);
    }
  }, [styles]);

  const handleVariantChange = (e: ChangeEvent<HTMLSelectElement>, variant: Variant) => {
    /** assign snipcart values */
    const index = whip.variants?.findIndex((v) => v.name === variant.name);
    setOptions({
      ...options,
      [`data-item-custom${index}-value`]: e.target.value,
    });

    /** update the price if needed */
    const option = variant.options.find((v) => v.name == e.target.value);
    // needed in case priceDiff is 0
    if (option?.priceDiff !== undefined) {
      setPrice(whip.price + Number(option.priceDiff));
    }
  };

  const handleStyleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStyle(e.target.value);
    const index = whip.variants?.findIndex((v) => v.name === 'Style');
    setOptions({
      ...options,
      [`data-item-custom${index}-value`]: e.target.value,
    });
    const defaultImages = styles.options.find((s: Variant) => s.name === e.target.value).images;
    setImages(defaultImages);
  };

  const handleAdd = () => {
    setModalOpen(true);
  };

  return (
    <Layout>
      <SEO title={whip.title} />
      <Flex flexDirection={{ base: 'column', md: 'row' }}>
        <ProductImages images={images} />
        <Flex flex="1" direction="column" ml={{ base: 0, md: '6' }} mt={{ base: '6', md: 0 }}>
          <Flex>
            <Image src={whip.headerImage} maxH="50px" objectFit="contain" />
          </Flex>
          <Heading fontSize="3xl" letterSpacing="wider" mt="1">
            ${price}
          </Heading>
          <Text my="6">{whip.description}</Text>
          <Stack spacing="6" mt="4">
            {styles && (
              <Box>
                <Text fontWeight="bold">Style</Text>
                <RadioGroup value={style} onChange={handleStyleChange}>
                  {styles.options.map((s: Option) => (
                    <Radio value={s.name} key={s.name}>
                      {s.name}
                    </Radio>
                  ))}
                </RadioGroup>
              </Box>
            )}
            {variants?.map((v) => (
              <Box key={v.name}>
                <Text fontWeight="bold" mb="1">
                  {v.name}
                </Text>
                <Select
                  defaultValue={v.defaultValue}
                  onChange={(e) => handleVariantChange(e, v)}
                  bg="rgba(255,255,255,0.08)"
                  borderColor="rgba(255,255,255,0.16)"
                  _hover={{ bg: 'rgba(255,255,255,0.16)' }}
                  _active={{ bg: 'rgba(255,255,255,0.16)' }}
                >
                  {v.options.map((vo: Option) => (
                    <option value={vo.name} key={vo.name}>
                      {vo.name}
                    </option>
                  ))}
                </Select>
              </Box>
            ))}
            <Button
              mt="4"
              onClick={handleAdd}
              className="snipcart-add-item"
              data-item-name={whip.title}
              data-item-price={whip.price}
              data-item-id={whip.id}
              data-item-weight={whip.weight}
              data-item-url={location.pathname}
              data-item-description={whip.description}
              data-item-image={whip.images && whip.images[0]}
              {...snipcartOptions}
              {...options}
            >
              Add to Cart
            </Button>
          </Stack>
        </Flex>
      </Flex>
      <Box mt="140px" mb="10">
        <Text mb="5">Checkout these other specialty whips</Text>
        <Flex flexDirection={{ base: 'column', lg: 'row' }}>
          {previous && (
            <SpecialtyWhipCard
              headerImage={previous.frontmatter.headerImage}
              image={previous.frontmatter.images[0]}
              description={previous.frontmatter.description}
              slug={previous.fields.slug}
            />
          )}
          <Box mt={{ base: '6', lg: 0 }} mx={{ base: 0, lg: '6' }} />
          {next && (
            <SpecialtyWhipCard
              headerImage={next.frontmatter.headerImage}
              image={next.frontmatter.images[0]}
              description={next.frontmatter.description}
              slug={next.fields.slug}
            />
          )}
        </Flex>
      </Box>
      <AddPoppersModal isOpen={modalOpen} onClose={() => setModalOpen(false)} location={location} />
    </Layout>
  );
};

interface Props {
  location: {
    pathname: string;
  };
  pageContext: {
    previous?: any;
    next?: any;
    snipcartOptions: object;
  };
  data: {
    markdownRemark: {
      frontmatter: {
        id: string;
        title: string;
        hasStyles?: boolean;
        description?: string;
        price: number;
        variants?: any[];
        headerImage: string;
        images?: string[];
        weight?: number;
      };
    };
  };
}

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      frontmatter {
        title
        id
        price
        description
        hasStyles
        headerImage
        images
        weight
        variants {
          name
          defaultValue
          options {
            name
            priceDiff
            images
          }
        }
      }
    }
  }
`;

export default SpecialtyWhipPage;
