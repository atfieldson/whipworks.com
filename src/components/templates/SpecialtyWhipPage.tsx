import React, { useState, useEffect, useRef, useCallback, ChangeEvent } from 'react';
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
  List,
  ListItem,
  Collapse,
  useDisclosure,
} from '@chakra-ui/react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import ProductImages from '../molecules/ProductImages';
import BullwhipAddedModal from '../molecules/BullwhipAddedModal';

type ImageData = {
  url: string;
  caption?: string;
};

type Option = {
  name: string;
  priceDiff?: string;
  images?: ImageData[];
};

type Variant = {
  name: string;
  options: Option[];
  defaultValue: string;
};

type Spec = {
  label: string;
  value: string;
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
  const specsDisclosure = useDisclosure();

  const [style, setStyle] = useState('');
  const [price, setPrice] = useState(whip.price);
  const [weight, setWeight] = useState(whip.weight);
  const [options, setOptions] = useState({});
  const [selectedOptions, setSelectedOptions] = useState<any>({});
  const [images, setImages] = useState(whip.images);
  const [modalOpen, setModalOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const productInfoRef = useRef<HTMLDivElement>(null);

  // Show/hide back-to-top button based on product info visibility
  useEffect(() => {
    if (!productInfoRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show button when product info scrolls out of view
        setShowBackToTop(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(productInfoRef.current);
    return () => observer.disconnect();
  }, []);

  const handleBackToTop = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
    const index = whip.variants?.findIndex((v) => v.name === variant.name) || 0;
    if (variant.name === 'Whip Length') {
      setWeight(resolveWeights(e.target.value));
    }
    setOptions({
      ...options,
      [`data-item-custom${index + 1}-value`]: e.target.value,
    });

    const option = variant.options.find((v) => v.name == e.target.value);
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
    const snipcartEl = document.getElementById('snipcart');
    if (snipcartEl) {
      snipcartEl.style.visibility = 'hidden';
    }
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
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
        image={whip.images?.[0]?.url}
        pathname={location.pathname}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: whip.title,
          description: whip.description,
          image: whip.images?.[0]?.url || whip.images?.[0],
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

      {/* Mobile: hero image above product info */}
      <Box display={{ base: 'block', md: 'none' }} mb="6">
        {images && images[0] && (
          <Image
            src={images[0].url}
            alt={images[0]?.caption || `${whip.title} - wide`}
            w="100%"
            borderRadius="md"
            objectFit="contain"
            bg="black"
          />
        )}
      </Box>

      {/* Two-column layout (desktop) / product info (mobile) */}
      <Flex
        direction={{ base: 'column', md: 'row' }}
        gap={{ base: 0, md: 10 }}
        alignItems="flex-start"
      >
        {/* Left column — full image gallery (desktop only) */}
        <Box flex="3" minW="0" display={{ base: 'none', md: 'block' }}>
          <ProductImages images={images} alt={whip.title} />
        </Box>

        {/* Right column — sticky product info */}
        <Box
          ref={productInfoRef}
          flex="2"
          position={{ base: 'relative', md: 'sticky' }}
          top={{ base: 'auto', md: '100px' }}
          alignSelf="flex-start"
        >
          {/* Series logo */}
          {whip.seriesImage && (
            <Image
              src={whip.seriesImage}
              maxH="60px"
              maxW="100%"
              objectFit="contain"
              objectPosition="left"
              alt={`${whip.series} logo`}
              mb="2"
            />
          )}

          {/* Header logo */}
          {whip.headerImage && (
            <Image
              src={whip.headerImage}
              maxH="200px"
              maxW="100%"
              objectFit="contain"
              objectPosition="left"
              alt={`${whip.title} logo`}
              mb="3"
            />
          )}

          {/* Price */}
          <Heading fontSize="3xl" letterSpacing="wider" mb="4">
            ${price}
          </Heading>

          {/* Description */}
          <Text mb="6" lineHeight="tall" fontSize="md" opacity={0.9}>
            {whip.description}
          </Text>

          {/* Style selector */}
          {styles && (
            <Box mb="5">
              <Text fontWeight="bold" mb="2" fontSize="sm" textTransform="uppercase" letterSpacing="wider">
                Style
              </Text>
              <RadioGroup value={style} onChange={handleStyleChange}>
                <Stack spacing="2">
                  {styles.options.map((s: Option) => (
                    <Radio
                      value={s.name}
                      key={s.name}
                      size="lg"
                      colorScheme="blue"
                    >
                      <Text fontSize="md">{s.name}</Text>
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            </Box>
          )}

          {/* Other variant selectors */}
          {variants?.map((v) => (
            <Box key={v.name} mb="5">
              <Text fontWeight="bold" mb="2" fontSize="sm" textTransform="uppercase" letterSpacing="wider">
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
                size="lg"
              >
                {v.options.map((vo: Option) => (
                  <option value={vo.name} key={vo.name}>
                    {vo.name}
                  </option>
                ))}
              </Select>
              {v.note && (
                <Text mt="1" fontSize="xs" fontStyle="italic" opacity={0.7}>
                  {v.note}
                </Text>
              )}
            </Box>
          ))}

          {/* Add to Cart */}
          <Button
            w="100%"
            mt="2"
            mb="6"
            onClick={handleAdd}
            className="snipcart-add-item"
            data-item-name={whip.title}
            data-item-price={whip.price}
            data-item-id={whip.id}
            data-item-weight={900}
            data-item-url={location.pathname}
            data-item-description={whip.description}
            data-item-image={whip.images && (whip.images[0]?.url || whip.images[0])}
            data-item-width={46}
            data-item-height={8}
            data-item-length={30}
            {...snipcartOptions}
            {...options}
          >
            Add to Cart
          </Button>

          {/* Collapsible Specs */}
          {whip.specs && whip.specs.length > 0 && (
            <Box borderTopWidth="1px" borderColor="whiteAlpha.200" pt="3">
              <Flex
                as="button"
                onClick={specsDisclosure.onToggle}
                w="100%"
                justify="space-between"
                align="center"
                cursor="pointer"
                py="2"
                _hover={{ opacity: 0.8 }}
              >
                <Text fontWeight="bold" fontSize="sm" textTransform="uppercase" letterSpacing="wider">
                  Specs
                </Text>
                {specsDisclosure.isOpen ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                )}
              </Flex>
              <Collapse in={specsDisclosure.isOpen} animateOpacity>
                <List spacing="2" pb="4" pl="1">
                  {whip.specs.map((spec: Spec) => (
                    <ListItem key={spec.label} fontSize="sm">
                      <Text as="span" fontWeight="bold" opacity={0.7}>
                        {spec.label}:
                      </Text>{' '}
                      {spec.value}
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Box>
          )}
        </Box>
      </Flex>

      {/* Mobile: remaining images below product info */}
      {images && images.length > 1 && (
        <Box display={{ base: 'block', md: 'none' }} mt="8">
          <ProductImages images={images.slice(1)} alt={whip.title} />
        </Box>
      )}

      {/* Bottom CTAs */}
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

      {/* Mobile: sticky back-to-top button */}
      <Button
        onClick={handleBackToTop}
        position="fixed"
        bottom="24px"
        right="24px"
        size="md"
        borderRadius="full"
        opacity={showBackToTop ? 1 : 0}
        pointerEvents={showBackToTop ? 'auto' : 'none'}
        transition="opacity 0.3s ease"
        zIndex={10}
        display={{ base: 'inline-flex', md: 'none' }}
        boxShadow="lg"
        _hover={{ bg: 'blue.200' }}
        _active={{ bg: 'blue.200' }}
        _focus={{ bg: 'blue.200', boxShadow: 'lg' }}
        _focusVisible={{ bg: 'blue.200', boxShadow: 'lg' }}
      >
        ↑ Back to Top
      </Button>

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
        images?: ImageData[];
        weight?: number;
        specs?: Spec[];
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
        series
        seriesImage
        images {
          url
          caption
        }
        weight
        specs {
          label
          value
        }
        variants {
          name
          defaultValue
          note
          options {
            name
            priceDiff
            images {
              url
              caption
            }
          }
        }
      }
    }
  }
`;

export default SpecialtyWhipPage;
