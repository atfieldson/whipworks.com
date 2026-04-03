import React, { useState, useRef, ChangeEvent } from 'react';
import { graphql, Link } from 'gatsby';
import { Flex, Text, Heading, Box, Select, Button, useDisclosure } from '@chakra-ui/react';

import Layout from './Layout';
import SEO from './SEO';
import ProductImages from '../molecules/ProductImages';
import AddedToCartModal from '../molecules/AddedToCartModal';
import StockIndicator from '../atoms/StockIndicator';
import QuantitySelector from '../atoms/QuantitySelector';
import useStockLevel from '../../hooks/useStockLevel';

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
    collection?: string;
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
  const { snipcartOptions, collection } = pageContext;

  const [price, setPrice] = useState(product.price);
  const [options, setOptions] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const { isLoading: stockLoading, getStockForVariant } = useStockLevel(product.id);

  // Track selected variant values for stock lookup
  const initialSelections: Record<string, string> = {};
  product.variants?.forEach((v) => {
    initialSelections[v.name] = v.defaultValue || v.options?.[0]?.name || '';
  });
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(initialSelections);

  // Get stock for the current variant selection
  const currentStock = product.variants?.length
    ? getStockForVariant(selectedVariants)
    : getStockForVariant({});

  const [quantity, setQuantity] = useState(1);

  // Cap quantity to stock when stock is tracked and variant changes
  const maxQuantity = currentStock !== null && currentStock > 0 ? currentStock : undefined;

  // Determine where "Continue Shopping" should go
  const continuePath = collection === 'materials' ? '/whipmaking-materials' : collection === 'accessories' ? '/accessories' : '/';

  const handleAdd = () => {
    // Hide Snipcart's cart container before it can flash on screen
    const snipcartEl = document.getElementById('snipcart');
    if (snipcartEl) {
      snipcartEl.style.visibility = 'hidden';
    }
    // Show our modal immediately
    onOpen();
    // Close Snipcart's cart and restore visibility
    setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).Snipcart) {
        (window as any).Snipcart.api.theme.cart.close();
      }
      setTimeout(() => {
        if (snipcartEl) {
          snipcartEl.style.visibility = 'visible';
        }
      }, 300);
    }, 50);
  };

  const handleVariantChange = (e: ChangeEvent<HTMLSelectElement>, variant: Variant) => {
    /** assign snipcart values */
    const index = product.variants?.findIndex((v) => v.name === variant.name) || 0;
    setOptions({
      ...options,
      [`data-item-custom${index + 1}-value`]: e.target.value,
    });

    /** update selected variants for stock lookup */
    setSelectedVariants((prev) => ({ ...prev, [variant.name]: e.target.value }));

    /** reset quantity when variant changes */
    setQuantity(1);

    /** update the price if needed */
    const option = variant.options.find((v) => v.name == e.target.value);
    // needed in case priceDiff is 0
    if (option?.priceDiff !== undefined) {
      setPrice(product.price + Number(option.priceDiff));
    }
  };

  return (
    <Layout>
      <SEO
        title={product.title}
        description={product.description}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.title,
          description: product.description,
          image: product.images?.[0],
          brand: {
            '@type': 'Brand',
            name: 'WhipWorks',
          },
          offers: {
            '@type': 'Offer',
            url: `https://www.whipworks.com${location.pathname}`,
            priceCurrency: 'USD',
            price: product.price,
            availability: currentStock === 0 ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
          },
        }}
      />
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
          {(collection === 'materials' || collection === 'accessories') && (
            <QuantitySelector quantity={quantity} onChange={setQuantity} max={maxQuantity} isOutOfStock={currentStock === 0} />
          )}
          <StockIndicator stock={currentStock} isLoading={stockLoading} />
          <Button
            mt="4"
            className="snipcart-add-item"
            data-item-name={product.title}
            data-item-price={product.price}
            data-item-id={product.id}
            data-item-url={location.pathname}
            data-item-description={product.description}
            data-item-image={product.images && product.images[0]}
            data-item-weight={product.weight}
            data-item-quantity={collection === 'materials' || collection === 'accessories' ? quantity : undefined}
            {...snipcartOptions}
            {...options}
            onClick={handleAdd}
            isDisabled={currentStock === 0}
          >
            {currentStock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </Flex>
      </Flex>
      {collection === 'materials' && (
        <Box mt="70px" mb="10" textAlign="center">
          <Box mb="5">
            <Button as={Link} to="/whipmaking-materials" size="lg">
              View All Whipmaking Materials
            </Button>
          </Box>
        </Box>
      )}
      {collection === 'accessories' && (
        <Box mt="70px" mb="10" textAlign="center">
          <Box mb="5">
            <Button as={Link} to="/accessories" size="lg">
              View All Accessories
            </Button>
          </Box>
        </Box>
      )}
      <AddedToCartModal
        isOpen={isOpen}
        onClose={onClose}
        cancelRef={cancelRef}
        continuePath={continuePath}
      />
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
