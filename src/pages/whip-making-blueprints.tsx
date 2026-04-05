import React, { useRef } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Image,
  Button,
  Flex,
  Divider,
  useDisclosure,
} from '@chakra-ui/react';
import { graphql } from 'gatsby';

import Layout from '../components/templates/Layout';
import SEO from '../components/templates/SEO';
import AddedToCartModal from '../components/molecules/AddedToCartModal';

interface Blueprint {
  node: {
    frontmatter: {
      title: string;
      id: string;
      price: number;
      category: string;
      sortOrder: number;
      isBundle: boolean;
      image: string;
      sampleImage: string;
      description: string;
      fileGuid: string;
    };
  };
}

const BlueprintCard = ({
  blueprint,
  onAdd,
}: {
  blueprint: Blueprint['node']['frontmatter'];
  onAdd: () => void;
}) => (
  <Box
    borderWidth="1px"
    borderColor="rgba(255,255,255,0.15)"
    borderRadius="md"
    overflow="hidden"
    bg="rgba(255,255,255,0.05)"
    transition="transform 0.2s"
    _hover={{ transform: 'translateY(-2px)' }}
  >
    <Image
      src={blueprint.image}
      alt={blueprint.title}
      width="100%"
      height="200px"
      objectFit="cover"
    />
    <Box p="4">
      <Text fontWeight="bold" fontSize="md">
        {blueprint.title}
      </Text>
      {blueprint.description && (
        <Text fontSize="sm" mt="1" opacity={0.8}>
          {blueprint.description}
        </Text>
      )}
      <Flex justify="space-between" align="center" mt="3">
        <Text fontFamily="heading" fontSize="xl">
          ${blueprint.price.toFixed(2)}
        </Text>
        <Button
          size="sm"
          className="snipcart-add-item"
          data-item-id={blueprint.id}
          data-item-price={blueprint.price}
          data-item-name={blueprint.title}
          data-item-url="https://www.whipworks.com/whip-making-blueprints"
          data-item-image={blueprint.image}
          data-item-description={blueprint.description || blueprint.title}
          data-item-file-guid={blueprint.fileGuid}
          data-item-shippable="false"
          onClick={onAdd}
        >
          Add to Cart
        </Button>
      </Flex>
    </Box>
  </Box>
);

const WhipMakingBlueprintsPage = ({ data }: any) => {
  const blueprints: Blueprint[] = data.allMarkdownRemark.edges;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const handleAdd = () => {
    // Hide Snipcart's cart container so it doesn't flash behind our modal
    const snipcartEl = document.getElementById('snipcart');
    if (snipcartEl) {
      snipcartEl.style.visibility = 'hidden';
    }
    onOpen();
    // Close Snipcart's cart (it stays hidden until our modal closes)
    setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).Snipcart) {
        (window as any).Snipcart.api.theme.cart.close();
      }
    }, 50);
  };

  const handleModalClose = () => {
    onClose();
    // Restore Snipcart visibility now that our modal is gone
    setTimeout(() => {
      const snipcartEl = document.getElementById('snipcart');
      if (snipcartEl) {
        snipcartEl.style.visibility = 'visible';
      }
    }, 100);
  };

  const bullwhipBlueprints = blueprints
    .filter((b) => b.node.frontmatter.category === 'bullwhip' && !b.node.frontmatter.isBundle)
    .sort((a, b) => a.node.frontmatter.sortOrder - b.node.frontmatter.sortOrder);

  const bullwhipBundle = blueprints.find(
    (b) => b.node.frontmatter.category === 'bullwhip' && b.node.frontmatter.isBundle
  );

  const patternBlueprints = blueprints
    .filter((b) => b.node.frontmatter.category === 'pattern' && !b.node.frontmatter.isBundle)
    .sort((a, b) => a.node.frontmatter.sortOrder - b.node.frontmatter.sortOrder);

  const patternBundle = blueprints.find(
    (b) => b.node.frontmatter.category === 'pattern' && b.node.frontmatter.isBundle
  );

  const completeBundle = blueprints.find(
    (b) => b.node.frontmatter.category === 'complete'
  );

  const bullwhipSample = bullwhipBlueprints[0]?.node.frontmatter.sampleImage;
  const patternSample = patternBlueprints[0]?.node.frontmatter.sampleImage;

  const videos = [
    { id: '1vbdQ3zavmI', title: 'Introducing the WhipWorks Bullwhip Blueprint!' },
    { id: 'h1yhl7ab5pk', title: 'Part 1: The Core' },
    { id: 'JZH5F_Z4Evg', title: 'Part 2: 6 Plait Layer' },
    { id: '6sd4k9iGlKw', title: 'Part 3: 10 Plait Layer' },
    { id: 'v-1CU_Hs1kk', title: 'Part 4: The Overlay' },
    { id: 'OpzVtU0govI', title: 'Part 5: Accent Knots' },
  ];

  return (
    <Layout>
      <SEO
        title="Whip Making Blueprints"
        description="Detailed whipmaking blueprints and 16 plait handle pattern guides. PDF downloads for bullwhip construction from 4ft to 12ft. Paired with a free step-by-step YouTube video series."
      />

      <Heading as="h1" fontSize="2xl" mb="4">
        Whip Making Blueprints
      </Heading>

      {/* Hero Section - Video + Pitch */}
      <Flex direction={{ base: 'column', md: 'row' }} gap="6" mb="10">
        <Box flex="1">
          <Box
            position="relative"
            paddingBottom="56.25%"
            height="0"
            overflow="hidden"
            borderRadius="md"
          >
            <iframe
              src="https://www.youtube.com/embed/1vbdQ3zavmI"
              title="How to Make a Bullwhip - Introduction"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            />
          </Box>
        </Box>
        <Box flex="1">
          <Heading as="h2" fontSize="xl" mb="3">
            Learn to Make Your Own Bullwhip
          </Heading>
          <Text mb="3">
            Ever wanted to make your own whip? These blueprints are the exact guides I use to build
            every WhipWorks Bullwhip — and now they're yours.
          </Text>
          <Text mb="3">
            Pair them with my free 6-part YouTube video series where I walk you through the entire
            build process step by step, from loading the core to tying accent knots. The blueprints
            give you precise measurements and strand counts for each layer, while the videos show you
            exactly how it all comes together.
          </Text>
          <Text fontWeight="bold">
            No prior experience needed. Just grab a blueprint, follow along with the videos, and start
            plaiting!
          </Text>
        </Box>
      </Flex>

      {/* Complete Bundle - Featured */}
      {completeBundle && (
        <Box
          mb="10"
          p="6"
          borderWidth="2px"
          borderColor="#5A9BBD"
          borderRadius="lg"
          bg="rgba(90,155,189,0.08)"
        >
          <Flex
            direction={{ base: 'column', md: 'row' }}
            align="center"
            gap="6"
          >
            <Image
              src={completeBundle.node.frontmatter.image}
              alt={completeBundle.node.frontmatter.title}
              maxW={{ base: '100%', md: '250px' }}
              borderRadius="md"
              objectFit="cover"
            />
            <Box flex="1">
              <Heading as="h2" fontSize="xl" mb="2">
                {completeBundle.node.frontmatter.title}
              </Heading>
              <Text mb="2" opacity={0.8}>
                {completeBundle.node.frontmatter.description}
              </Text>
              <Flex align="center" gap="4" mt="4">
                <Text fontFamily="heading" fontSize="2xl">
                  ${completeBundle.node.frontmatter.price.toFixed(2)}
                </Text>
                <Button
                  className="snipcart-add-item"
                  data-item-id={completeBundle.node.frontmatter.id}
                  data-item-price={completeBundle.node.frontmatter.price}
                  data-item-name={completeBundle.node.frontmatter.title}
                  data-item-url="https://www.whipworks.com/whip-making-blueprints"
                  data-item-image={completeBundle.node.frontmatter.image}
                  data-item-description={completeBundle.node.frontmatter.description}
                  data-item-file-guid={completeBundle.node.frontmatter.fileGuid}
                  data-item-shippable="false"
                  onClick={handleAdd}
                >
                  Add to Cart
                </Button>
              </Flex>
            </Box>
          </Flex>
        </Box>
      )}

      {/* Bullwhip Blueprints Section */}
      <Heading as="h2" fontSize="xl" mb="2">
        Bullwhip Blueprints
      </Heading>
      <Text mb="4" opacity={0.8}>
        Step-by-step construction blueprints for bullwhips from 4 feet to 12 feet.
      </Text>

      {bullwhipSample && (
        <Box mb="6">
          <Image
            src={bullwhipSample}
            alt="Bullwhip blueprint sample"
            maxW={{ base: '100%', md: '500px' }}
            borderRadius="md"
          />
          <Text fontSize="sm" mt="2" opacity={0.6}>
            Sample page from the Bullwhip Blueprints
          </Text>
        </Box>
      )}

      <SimpleGrid spacing="4" minChildWidth="200px" mb="4">
        {bullwhipBlueprints.map((b) => (
          <BlueprintCard key={b.node.frontmatter.id} blueprint={b.node.frontmatter} onAdd={handleAdd} />
        ))}
      </SimpleGrid>

      {bullwhipBundle && (
        <Box mb="10" p="4" borderWidth="1px" borderColor="rgba(255,255,255,0.2)" borderRadius="md" bg="rgba(255,255,255,0.05)">
          <Flex
            direction={{ base: 'column', sm: 'row' }}
            justify="space-between"
            align={{ base: 'flex-start', sm: 'center' }}
            gap="3"
          >
            <Box>
              <Text fontWeight="bold" fontSize="lg">
                {bullwhipBundle.node.frontmatter.title}
              </Text>
              <Text fontSize="sm" opacity={0.8}>
                {bullwhipBundle.node.frontmatter.description}
              </Text>
            </Box>
            <Flex align="center" gap="3" flexShrink={0}>
              <Text fontFamily="heading" fontSize="xl">
                ${bullwhipBundle.node.frontmatter.price.toFixed(2)}
              </Text>
              <Button
                size="sm"
                className="snipcart-add-item"
                data-item-id={bullwhipBundle.node.frontmatter.id}
                data-item-price={bullwhipBundle.node.frontmatter.price}
                data-item-name={bullwhipBundle.node.frontmatter.title}
                data-item-url="https://www.whipworks.com/whip-making-blueprints"
                data-item-image={bullwhipBundle.node.frontmatter.image}
                data-item-description={bullwhipBundle.node.frontmatter.description}
                data-item-file-guid={bullwhipBundle.node.frontmatter.fileGuid}
                data-item-shippable="false"
                onClick={handleAdd}
              >
                Add to Cart
              </Button>
            </Flex>
          </Flex>
        </Box>
      )}

      <Divider my="8" borderColor="rgba(255,255,255,0.2)" />

      {/* Video Series Section */}
      <Box mb="10">
        <Heading as="h2" fontSize="xl" mb="2">
          Free Video Series: How to Make a Bullwhip
        </Heading>
        <Text mb="4" opacity={0.8}>
          Follow along with the complete build process. Each video covers a stage of the whip — use
          the blueprints as your reference while you watch.
        </Text>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing="4">
          {videos.map((video) => (
            <Box
              key={video.id}
              as="a"
              href={`https://www.youtube.com/watch?v=${video.id}&list=PL7ZnesQ3s0wCIm1eQ2B1IIx3ESAhjYlDx`}
              target="_blank"
              rel="noopener noreferrer"
              borderWidth="1px"
              borderColor="rgba(255,255,255,0.15)"
              borderRadius="md"
              overflow="hidden"
              bg="rgba(255,255,255,0.05)"
              transition="transform 0.2s"
              _hover={{ transform: 'translateY(-2px)' }}
            >
              <Image
                src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                alt={video.title}
                width="100%"
                objectFit="cover"
              />
              <Box p="3">
                <Text fontWeight="bold" fontSize="sm">
                  {video.title}
                </Text>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      <Divider my="8" borderColor="rgba(255,255,255,0.2)" />

      {/* 16 Plait Handle Patterns Section */}
      <Heading as="h2" fontSize="xl" mb="2">
        16 Plait Handle Patterns
      </Heading>
      <Text mb="4" opacity={0.8}>
        Color-coded pattern guides for creating beautiful 16 plait handle designs.
      </Text>

      {patternSample && (
        <Flex gap="6" mb="6" direction={{ base: 'column', md: 'row' }} align="flex-start">
          <Box>
            <Image
              src={patternSample}
              alt="Handle pattern sample"
              maxW={{ base: '100%', md: '500px' }}
              borderRadius="md"
            />
            <Text fontSize="sm" mt="2" opacity={0.6}>
              Sample page from the Handle Patterns
            </Text>
          </Box>
          <SimpleGrid columns={2} spacing="4" flex="1">
            {[
              { src: 'box.jpg', name: 'Box' },
              { src: 'celtic.jpg', name: 'Celtic' },
              { src: 'egyptianEye.jpg', name: 'Egyptian Eye' },
              { src: 'emerald.jpg', name: 'Emerald' },
              { src: 'new.jpg', name: 'Neo Celtic' },
              { src: 'valknut.jpg', name: 'Valknut' },
              { src: 'verticalStrip.jpg', name: 'Vertical Strip' },
            ].map((design) => (
              <Box key={design.src} textAlign="center">
                <Image
                  src={`https://d3ruufruf2uqog.cloudfront.net/handleDesigns/${design.src}`}
                  alt={design.name}
                  borderRadius="md"
                  objectFit="cover"
                  width="100%"
                />
                <Text fontSize="sm" mt="1" fontWeight="bold">
                  {design.name}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Flex>
      )}

      <SimpleGrid spacing="4" minChildWidth="200px" mb="4">
        {patternBlueprints.map((b) => (
          <BlueprintCard key={b.node.frontmatter.id} blueprint={b.node.frontmatter} onAdd={handleAdd} />
        ))}
      </SimpleGrid>

      {patternBundle && (
        <Box mb="10" p="4" borderWidth="1px" borderColor="rgba(255,255,255,0.2)" borderRadius="md" bg="rgba(255,255,255,0.05)">
          <Flex
            direction={{ base: 'column', sm: 'row' }}
            justify="space-between"
            align={{ base: 'flex-start', sm: 'center' }}
            gap="3"
          >
            <Box>
              <Text fontWeight="bold" fontSize="lg">
                {patternBundle.node.frontmatter.title}
              </Text>
              <Text fontSize="sm" opacity={0.8}>
                {patternBundle.node.frontmatter.description}
              </Text>
            </Box>
            <Flex align="center" gap="3" flexShrink={0}>
              <Text fontFamily="heading" fontSize="xl">
                ${patternBundle.node.frontmatter.price.toFixed(2)}
              </Text>
              <Button
                size="sm"
                className="snipcart-add-item"
                data-item-id={patternBundle.node.frontmatter.id}
                data-item-price={patternBundle.node.frontmatter.price}
                data-item-name={patternBundle.node.frontmatter.title}
                data-item-url="https://www.whipworks.com/whip-making-blueprints"
                data-item-image={patternBundle.node.frontmatter.image}
                data-item-description={patternBundle.node.frontmatter.description}
                data-item-file-guid={patternBundle.node.frontmatter.fileGuid}
                data-item-shippable="false"
                onClick={handleAdd}
              >
                Add to Cart
              </Button>
            </Flex>
          </Flex>
        </Box>
      )}

      {/* Complete Bundle - Bottom */}
      {completeBundle && (
        <>
          <Divider my="8" borderColor="rgba(255,255,255,0.2)" />
          <Box
            mb="10"
            p="6"
            borderWidth="2px"
            borderColor="#5A9BBD"
            borderRadius="lg"
            bg="rgba(90,155,189,0.08)"
          >
            <Flex
              direction={{ base: 'column', md: 'row' }}
              align="center"
              gap="6"
            >
              <Image
                src={completeBundle.node.frontmatter.image}
                alt={completeBundle.node.frontmatter.title}
                maxW={{ base: '100%', md: '250px' }}
                borderRadius="md"
                objectFit="cover"
              />
              <Box flex="1">
                <Heading as="h2" fontSize="xl" mb="2">
                  {completeBundle.node.frontmatter.title}
                </Heading>
                <Text mb="2" opacity={0.8}>
                  {completeBundle.node.frontmatter.description}
                </Text>
                <Flex align="center" gap="4" mt="4">
                  <Text fontFamily="heading" fontSize="2xl">
                    ${completeBundle.node.frontmatter.price.toFixed(2)}
                  </Text>
                  <Button
                    className="snipcart-add-item"
                    data-item-id={completeBundle.node.frontmatter.id}
                    data-item-price={completeBundle.node.frontmatter.price}
                    data-item-name={completeBundle.node.frontmatter.title}
                    data-item-url="https://www.whipworks.com/whip-making-blueprints"
                    data-item-image={completeBundle.node.frontmatter.image}
                    data-item-description={completeBundle.node.frontmatter.description}
                    data-item-file-guid={completeBundle.node.frontmatter.fileGuid}
                    data-item-shippable="false"
                    onClick={handleAdd}
                  >
                    Add to Cart
                  </Button>
                </Flex>
              </Box>
            </Flex>
          </Box>
        </>
      )}

      <AddedToCartModal
        isOpen={isOpen}
        onClose={handleModalClose}
        cancelRef={cancelRef}
      />
    </Layout>
  );
};

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      filter: { fields: { collection: { eq: "blueprints" } } }
      sort: { frontmatter: { sortOrder: ASC } }
    ) {
      edges {
        node {
          frontmatter {
            title
            id
            price
            category
            sortOrder
            isBundle
            image
            sampleImage
            description
            fileGuid
          }
        }
      }
    }
  }
`;

export default WhipMakingBlueprintsPage;
