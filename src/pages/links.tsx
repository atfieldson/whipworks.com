import React from 'react';
import { Box, Flex, Icon, Link, VStack, Text } from '@chakra-ui/react';
import { StaticImage } from 'gatsby-plugin-image';
import { FaInstagram, FaYoutube, FaEtsy, FaPinterest, FaEnvelope } from 'react-icons/fa';
import SEO from '../components/templates/SEO';

const LINKS = [
  {
    label: 'Instagram',
    url: 'https://www.instagram.com/whipworks/',
    icon: FaInstagram,
  },
  {
    label: 'YouTube',
    url: 'https://www.youtube.com/channel/UCy1U3l1nwB3TwFbCV3Z5peQ',
    icon: FaYoutube,
  },
  {
    label: 'Etsy Shop',
    url: 'https://www.etsy.com/shop/WhipWorks',
    icon: FaEtsy,
  },
  {
    label: 'Pinterest',
    url: 'https://www.pinterest.com/atfieldson/',
    icon: FaPinterest,
  },
  {
    label: 'Contact',
    url: 'https://www.whipworks.com/contact',
    icon: FaEnvelope,
  },
];

const LinksPage = () => (
  <Flex
    direction="column"
    align="center"
    minH="100vh"
    bg="#1a140f"
    px={4}
    py={10}
  >
    <VStack spacing={6} w="100%" maxW="480px">
      {/* Logo */}
      <Box mb={2}>
        <StaticImage
          src="../images/marketplace_inverted.png"
          alt="WhipWorks"
          height={60}
          placeholder="none"
        />
      </Box>

      {/* Tagline */}
      <Text
        fontFamily="Josefin Sans Variable"
        fontSize="md"
        color="whiteAlpha.700"
        textAlign="center"
        letterSpacing="0.1em"
        textTransform="uppercase"
      >
        Custom Handmade Whips
      </Text>

      {/* Featured Shop Link */}
      <Link
        href="https://www.whipworks.com?utm_source=linkinbio&utm_medium=social"
        isExternal
        w="100%"
        _hover={{ textDecoration: 'none' }}
        pt={4}
      >
        <Box
          w="100%"
          bg="whiteAlpha.100"
          border="1px solid"
          borderColor="whiteAlpha.200"
          borderRadius="lg"
          overflow="hidden"
          transition="all 0.2s"
          _hover={{
            bg: 'whiteAlpha.200',
            borderColor: 'whiteAlpha.400',
            transform: 'translateY(-2px)',
          }}
        >
          <Box
            as="img"
            src="https://whipworks.s3.us-east-2.amazonaws.com/bannerImages/FB+Banner.jpg"
            alt="A collection of custom WhipWorks bullwhips"
            w="100%"
            h="140px"
            objectFit="cover"
          />
          <Flex
            direction="column"
            align="center"
            py={4}
            px={6}
            gap={1}
          >
            <Flex align="center" gap={3}>
              <StaticImage
                src="../images/marketplace_inverted.png"
                alt=""
                height={20}
                placeholder="none"
              />
              <Text
                color="white"
                fontFamily="Josefin Sans Variable"
                fontSize="lg"
                fontWeight={600}
                letterSpacing="0.05em"
                lineHeight="1"
                mt="4px"
              >
                WhipWorks.com
              </Text>
            </Flex>
            <Text
              color="whiteAlpha.600"
              fontFamily="Josefin Sans Variable"
              fontSize="sm"
              textAlign="center"
              mt={1}
            >
              Browse and design high quality custom whips
            </Text>
          </Flex>
        </Box>
      </Link>

      {/* Links */}
      <VStack spacing={4} w="100%" pt={2}>
        {LINKS.map(({ label, url, icon }) => (
          <Link
            key={label}
            href={url}
            isExternal
            w="100%"
            _hover={{ textDecoration: 'none' }}
          >
            <Flex
              align="center"
              justify="center"
              gap={3}
              w="100%"
              py={4}
              px={6}
              bg="whiteAlpha.100"
              border="1px solid"
              borderColor="whiteAlpha.200"
              borderRadius="lg"
              color="white"
              fontFamily="Josefin Sans Variable"
              fontSize="lg"
              fontWeight={600}
              letterSpacing="0.05em"
              transition="all 0.2s"
              _hover={{
                bg: 'whiteAlpha.200',
                borderColor: 'whiteAlpha.400',
                transform: 'translateY(-2px)',
              }}
            >
              <Icon as={icon} boxSize={5} />
              <Text lineHeight="1" mt="4px">{label}</Text>
            </Flex>
          </Link>
        ))}
      </VStack>

      {/* Footer */}
      <Text
        pt={8}
        fontFamily="Josefin Sans Variable"
        fontSize="sm"
        color="whiteAlpha.400"
      >
        &copy; {new Date().getFullYear()} WhipWorks
      </Text>
    </VStack>
  </Flex>
);

export default LinksPage;

export const Head = () => (
  <SEO
    title="Links"
    description="Find WhipWorks across the web — shop custom handmade whips, follow on Instagram, watch tutorials on YouTube, and more."
    pathname="/links"
  />
);
