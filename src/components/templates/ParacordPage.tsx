import React, { useState, useRef, useCallback } from 'react';
import { graphql, Link } from 'gatsby';
import { Flex, Text, Heading, Box, Select, Button, Image, useDisclosure } from '@chakra-ui/react';

import Layout from './Layout';
import SEO from './SEO';
import AddedToCartModal from '../molecules/AddedToCartModal';
import StockIndicator from '../atoms/StockIndicator';
import QuantitySelector from '../atoms/QuantitySelector';
import useStockLevel from '../../hooks/useStockLevel';

interface Props {
  location: {
    pathname: string;
  };
  data: {
    markdownRemark: {
      frontmatter: {
        id: string;
        title: string;
        description: string;
        price: number;
        thumbnail: string;
        colorChart: string;
        weight: number;
        colors: string[];
        lengths: {
          name: string;
          price: number;
          priceDiff: number;
        }[];
      };
    };
  };
}

const ParacordPage = ({ data, location }: Props) => {
  const product = data.markdownRemark.frontmatter;

  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedLength, setSelectedLength] = useState(product.lengths[0]);
  const [price, setPrice] = useState(product.price);
  const [isZooming, setIsZooming] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [zoomBgStyle, setZoomBgStyle] = useState({ size: '300%', posX: '0px', posY: '0px' });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const modalCancelRef = useRef(null);
  const { isLoading: stockLoading, getStockForVariant } = useStockLevel(product.id);

  // Only track stock for 1000 Feet option
  const is1000ft = selectedLength.name === '1000 Feet';
  const currentStock = is1000ft
    ? getStockForVariant({ Color: selectedColor, Length: '1000 Feet' })
    : null;

  const [quantity, setQuantity] = useState(1);
  const maxQuantity = is1000ft && currentStock !== null && currentStock > 0 ? currentStock : undefined;

  const handleAdd = () => {
    const snipcartEl = document.getElementById('snipcart');
    if (snipcartEl) {
      snipcartEl.style.visibility = 'hidden';
    }
    onOpen();
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
  const imgRef = useRef<HTMLDivElement>(null);

  const LENS_SIZE = 150;
  const ZOOM_LEVEL = 3;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Center the lens on the mouse, clamped so it stays within the image
    const halfLens = LENS_SIZE / 2;
    const lensX = Math.max(0, Math.min(x - halfLens, rect.width - LENS_SIZE));
    const lensY = Math.max(0, Math.min(y - halfLens, rect.height - LENS_SIZE));

    setLensPos({ x: lensX, y: lensY });

    // Calculate zoom preview position
    // The lens can travel from 0 to (imgWidth - LENS_SIZE) horizontally
    // Map that range to 0% - 100% for background-position
    const maxLensX = rect.width - LENS_SIZE;
    const maxLensY = rect.height - LENS_SIZE;
    const bgPosX = maxLensX > 0 ? (lensX / maxLensX) * 100 : 0;
    const bgPosY = maxLensY > 0 ? (lensY / maxLensY) * 100 : 0;

    setZoomBgStyle({
      size: `${(rect.width / LENS_SIZE) * 100}%`,
      posX: `${bgPosX}%`,
      posY: `${bgPosY}%`,
    });
  }, []);

  const handleLengthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const length = product.lengths.find((l) => l.name === e.target.value);
    if (length) {
      setSelectedLength(length);
      setPrice(length.price);
      setQuantity(1);
    }
  };

  // Build Snipcart options string for color
  const colorOptions = product.colors.map((c) => `${c}[+0]`).join('|');
  // Build Snipcart options string for length with price diffs
  const lengthOptions = product.lengths
    .map((l) => `${l.name}${l.priceDiff ? `[+${l.priceDiff}]` : ''}`)
    .join('|');

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
          image: product.thumbnail,
          brand: {
            '@type': 'Brand',
            name: 'WhipWorks',
          },
          offers: {
            '@type': 'Offer',
            url: `https://www.whipworks.com${location.pathname}`,
            priceCurrency: 'USD',
            price: product.price,
            availability: 'https://schema.org/InStock',
          },
        }}
      />
      {/* Banner Image */}
      <Box
        w="100%"
        maxW="1100px"
        mx="auto"
        mb="6"
        borderRadius="md"
        overflow="hidden"
        sx={{ aspectRatio: '4 / 1' }}
      >
        <Image
          src={product.thumbnail}
          alt={product.title}
          w="100%"
          h="100%"
          objectFit="cover"
          objectPosition="center calc(50% - 40px)"
        />
      </Box>

      {/* Desktop: Image left, controls right. Mobile: stacked */}
      <Flex
        direction={{ base: 'column', md: 'row' }}
        gap="6"
        maxW="1100px"
        mx="auto"
        align="flex-start"
        position="relative"
      >
        {/* Left: Color Chart Image with Lens */}
        <Box
          ref={imgRef}
          position="relative"
          w={{ base: '100%', md: '55%' }}
          flexShrink={0}
          cursor="crosshair"
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
          onMouseMove={handleMouseMove}
          borderRadius="md"
          overflow="hidden"
        >
          <Image
            src={product.colorChart}
            alt={`${product.title} color chart`}
            w="100%"
            display="block"
          />
          {/* Lens overlay */}
          {isZooming && (
            <Box
              position="absolute"
              top={`${lensPos.y}px`}
              left={`${lensPos.x}px`}
              w={`${LENS_SIZE}px`}
              h={`${LENS_SIZE}px`}
              border="2px solid rgba(90, 140, 175, 0.8)"
              bg="rgba(90, 140, 175, 0.15)"
              pointerEvents="none"
            />
          )}
        </Box>

        {/* Right: Controls + Zoom Preview overlay */}
        <Flex
          direction="column"
          flex="1"
          position="relative"
        >
          {/* Zoom Preview Panel — overlays the controls */}
          {isZooming && (
            <Box
              display={{ base: 'none', md: 'block' }}
              position="absolute"
              top="0"
              left="0"
              w="100%"
              h="100%"
              zIndex="10"
              backgroundImage={`url(${product.colorChart})`}
              backgroundSize={zoomBgStyle.size}
              backgroundPosition={`${zoomBgStyle.posX} ${zoomBgStyle.posY}`}
              backgroundRepeat="no-repeat"
              borderRadius="md"
              border="1px solid"
              borderColor="whiteAlpha.300"
            />
          )}

          {/* Product Info & Controls */}
          <Text fontSize="lg">{product.title}</Text>
          <Heading fontSize="3xl" letterSpacing="wider" mt="1">
            ${price.toFixed(2)}
          </Heading>
          <Text my="4" fontSize="sm">
            {product.description}
          </Text>

          <Box mb="3">
            <Text fontWeight="bold" mb="1">
              Color
            </Text>
            <Select
              value={selectedColor}
              onChange={(e) => { setSelectedColor(e.target.value); setQuantity(1); }}
              bg="rgba(255,255,255,0.9)"
              borderColor="rgba(255,255,255,0.16)"
              _hover={{ bg: 'rgba(255,255,255,1)' }}
              _active={{ bg: 'rgba(255,255,255,1)' }}
              color="#000000"
              fontWeight="bold"
            >
              {product.colors.map((color) => (
                <option value={color} key={color}>
                  {color}
                </option>
              ))}
            </Select>
          </Box>
          <Box mb="3">
            <Text fontWeight="bold" mb="1">
              Length
            </Text>
            <Select
              value={selectedLength.name}
              onChange={handleLengthChange}
              bg="rgba(255,255,255,0.9)"
              borderColor="rgba(255,255,255,0.16)"
              _hover={{ bg: 'rgba(255,255,255,1)' }}
              _active={{ bg: 'rgba(255,255,255,1)' }}
              color="#000000"
              fontWeight="bold"
            >
              {product.lengths.map((length) => (
                <option value={length.name} key={length.name}>
                  {length.name} — ${length.price.toFixed(2)}
                </option>
              ))}
            </Select>
          </Box>

          <QuantitySelector quantity={quantity} onChange={setQuantity} max={maxQuantity} isOutOfStock={is1000ft && currentStock === 0} />
          <StockIndicator stock={currentStock} isLoading={stockLoading} />

          <Button
            mt="2"
            className="snipcart-add-item"
            data-item-name={product.title}
            data-item-price={product.price}
            data-item-id={product.id}
            data-item-url={location.pathname}
            data-item-description={product.description}
            data-item-image={product.thumbnail}
            data-item-weight={product.weight}
            data-item-quantity={quantity}
            data-item-custom1-name="Color"
            data-item-custom1-options={colorOptions}
            data-item-custom1-value={selectedColor}
            data-item-custom2-name="Length"
            data-item-custom2-options={lengthOptions}
            data-item-custom2-value={selectedLength.name}
            onClick={handleAdd}
            isDisabled={is1000ft && currentStock === 0}
          >
            {is1000ft && currentStock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </Flex>
      </Flex>

      {/* View All Materials Button */}
      <Box mt="70px" mb="10" textAlign="center">
        <Box mb="5">
          <Button as={Link} to="/whipmaking-materials" size="lg">
            View All Whipmaking Materials
          </Button>
        </Box>
      </Box>
      <AddedToCartModal
        isOpen={isOpen}
        onClose={onClose}
        cancelRef={modalCancelRef}
      />
    </Layout>
  );
};

export const pageQuery = graphql`
  query ($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      frontmatter {
        title
        id
        price
        description
        thumbnail
        colorChart
        weight
        colors
        lengths {
          name
          price
          priceDiff
        }
      }
    }
  }
`;

export default ParacordPage;
