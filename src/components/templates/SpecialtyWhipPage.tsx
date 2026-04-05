import React, { useState, useEffect, ChangeEvent } from 'react';
import { graphql, Link } from 'gatsby';
import Layout from './Layout';
import SEO from './SEO';
import {
  Flex,
  Heading,
  RadioGroup,
  Text,
  Box,
  Radio,
  Select,
  Stack,
  Image,
  Button,
} from '@chakra-ui/react';
import ProductImages from '../molecules/ProductImages';
import SpecialtyWhipCard from '../atoms/SpecialtyWhipCard';
import BullwhipAddedModal from '../molecules/BullwhipAddedModal';

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

const resolveWeights = (length?: string) => {
  switch (length) {
    case '4 ft' || '4 Feet':
      return 750;
    case '5 ft' || '5 Feet':
      return 850;
    case '6 ft' || '6 Feet':
      return 880;
    case '7 ft' || '7 Feet':
      return 910;
    case '8 ft' || '8 Feet':
      return 965;
    case '10 ft' || '10 Feet':
      return 1030;
    case '12 ft' || '12 Feet':
      return 1360;
    default:
      return 900;
  }
};

const SpecialtyWhipPage = ({ data, pageContext, location }: Props) => {
  const whip = data.markdownRemark.frontmatter;
  const { previous, next, snipcartOptions } = pageContext;

  const [style, setStyle] = useState('');
  const [price, setPrice] = useState(whip.price);
  const [weight, setWeight] = useState(whip.weight);
  const [options, setOptions] = useState({});
  const [selectedOptions, setSelectedOptions] = useState<any>({});
  const [images, setImages] = useState(whip.images);
  const [modalOpen, setModalOpen] = useState(false);

  const styles = whip.hasStyles && whip.variants?.find((v) => v.name === 'Style');
  const variants = whip.hasStyles
    ? whip.variants?.filter((v) => v.name !== 'Style')
    : whip.variants;

  useEffect(() => {
    if (styles) {
      setStyle(styles.defaultValue);
      const defaultImages = styles.options.find(
        (s: Variant) => s.name === styles.defaultValue
      ).images;
      setImages(defaultImages);
    }
  }, [styles]);

  useEffect(() => {
    const prices = Object.values(selectedOptions);
    const summedPrices = prices.reduce((a, b) => Number(a) + Number(b), 0) as number;
    setPrice(whip.price + summedPrices);
  }, [selectedOptions]);

  const handleVariantChange = (e: ChangeEvent<HTMLSelectElement>, variant: Variant) => {
    /** assign snipcart values */
    const index = whip.variants?.findIndex((v) => v.name === variant.name) || 0;
    if (variant.name === 'Whip Length') {
      setWeight(resolveWeights(e.target.value));
    }
    setOptions({
      ...options,
      [`data-item-custom${index + 1}-value`]: e.target.value,
    });

    /** update the price if needed */
    const option = variant.options.find((v) => v.name == e.target.value);
    // needed in case priceDiff is 0
    if (option?.priceDiff !== undefined) {
      setSelectedOptions((selectedOptions: any) => ({
        ...selectedOptions,
        [variant.name]: option.priceDiff,
      }));
    }
  };

  const handleStyleChange = (style: string) => {
    setStyle(style);
    const index = whip.variants?.findIndex((v) => v.name === 'Style') || 0;
    setOptions({
      ...options,
      [`data-item-custom${index + 1}-value`]: style,
    });
    const defaultImages = styles.options.find((s: Variant) => s.name === style).images;
    setImages(defaultImages);
  };

  const handleAdd = () => {
    // Hide Snipcart so its cart open/close doesn't affect the page
    const snipcartEl = document.getElementById('snipcart');
    if (snipcartEl) {
      snipcartEl.style.visibility = 'hidden';
    }
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    // Close Snipcart's cart while still hidden, then restore visibility
    if (typeof window !== 'undefined' && (window as any).Snipcart) {
      (window as any).Snipcart.api.theme.cart.close();
    }
    setTimeout(() => {
      const snipcartEl = document.getElementById('snipcart');
      if (snipcartEl) {
        snipcartEl.style.visibility = 'visible';
      }
    }, 500);
  };

  const handleCheckout = () => {
    const snipcartEl = document.getElementById('snipcart');
    if (snipcartEl) {
      snipcartEl.style.visibility = 'visible';
    }
    setModalOpen(false);
  };

  return (
    <Layout>
      <SEO
        title={whip.title}
        description={whip.description}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: whip.title,
          description: whip.description,
          image: whip.images?.[0],
          brand: {
            '@type': 'Brand',
            name: 'WhipWorks',
          },
          offers: {
            '@type': 'Offer',
            url: `https://www.whipworks.com${location.pathname}`,
            priceCurrency: 'USD',
            price: whip.price,
            availability: 'https://schema.org/InStock',
            seller: {
              '@type': 'Organization',
              name: 'WhipWorks',
            },
          },
        }}
      />
      <Flex flexDirection={{ base: 'column', md: 'row' }}>
        <ProductImages images={images} alt={whip.title} />
        <Flex flex="1" direction="column" ml={{ base: 0, md: '6' }} mt={{ base: '6', md: 0 }}>
          <Flex>
            <Image src={whip.headerImage} maxH="50px" objectFit="contain" alt={`${whip.title} logo`} />
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
                  <Stack>
                    {styles.options.map((s: Option) => (
                      <Radio value={s.name} key={s.name}>
                        {s.name}
                      </Radio>
                    ))}
                  </Stack>
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
                  bg="rgba(255,255,255,0.9)"
                  borderColor="rgba(255,255,255,0.16)"
                  _hover={{ bg: 'rgba(255,255,255,1)' }}
                  _active={{ bg: 'rgba(255,255,255,1)' }}
                  color="#000000"
                  fontWeight="bold"
                >
                  {v.options.map((vo: Option) => (
                    <option value={vo.name} key={vo.name} color="000000">
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
              // Weight hardcoded to 900g — dynamic weight caused shipping issues
              data-item-weight={900}
              data-item-url={location.pathname}
              data-item-description={whip.description}
              data-item-image={whip.images && whip.images[0]}
              data-item-width={46}
              data-item-height={8}
              data-item-length={30}
              {...snipcartOptions}
              {...options}
            >
              Add to Cart
            </Button>
          </Stack>
        </Flex>
      </Flex>
      <Box mt="70px" mb="10" textAlign="center">
        <Box mb="5">
          <Button as={Link} to="/specialty-whips" size="lg">
            View all Specialty Whips
          </Button>
        </Box>
        <Text fontSize="lg">
          Want something unique? Design your own{' '}
          <Link to="/design-bullwhip" style={{ textDecoration: 'underline' }}>custom Bullwhip</Link>
          {' '}or{' '}
          <Link to="/design-stockwhip" style={{ textDecoration: 'underline' }}>custom Stockwhip</Link>
          {' '}from scratch!
        </Text>
      </Box>
      <BullwhipAddedModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onCheckout={handleCheckout}
        location={location}
      />
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
  query ($slug: String!) {
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
