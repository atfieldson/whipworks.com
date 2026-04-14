import React, { useRef, useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Image,
  IconButton,
  Link as CLink,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { Link } from 'gatsby';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import reviewData from '../../data/reviews.json';

const S3_BASE = 'https://whipworks.s3.us-east-2.amazonaws.com/reviews';

type Review = typeof reviewData.reviews[0];

type Props = {
  productType: 'bullwhip' | 'stockwhip' | 'snakewhip';
  maxReviews?: number;
};

const Stars = ({ count, size = 'sm' }: { count: number; size?: string }) => (
  <Text fontSize={size} color="gold" letterSpacing="wider">
    {'★'.repeat(count)}
  </Text>
);

const TestimonialStrip = ({ productType, maxReviews = 10 }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  // Filter reviews: must have meaningful text, sorted by quality
  const reviews = reviewData.reviews
    .filter((r) => r.productType === productType && r.text.length >= 30)
    .sort((a, b) => {
      // Featured first, then by text length, then newest
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      if (a.hasPhoto !== b.hasPhoto) return a.hasPhoto ? -1 : 1;
      return b.id - a.id;
    })
    .slice(0, maxReviews);

  if (reviews.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  // Truncate long reviews to ~150 chars at a word boundary
  const truncate = (text: string, max = 150) => {
    if (text.length <= max) return text;
    const cut = text.slice(0, max);
    const lastSpace = cut.lastIndexOf(' ');
    return cut.slice(0, lastSpace) + '...';
  };

  return (
    <Box
      py={8}
      px={4}
      overflow="hidden"
      bg="whiteAlpha.50"
      borderRadius="lg"
      borderTop="1px solid"
      borderBottom="1px solid"
      borderColor="yellow.700"
      my={4}
    >
      {/* Gold accent line */}
      <Box h="1px" bg="linear-gradient(to right, transparent, var(--chakra-colors-yellow-600), transparent)" mb={4} />
      <Flex align="center" justify="space-between" mb={4} px={2}>
        <Text
          fontSize="lg"
          fontWeight="bold"
          letterSpacing="wide"
          color="whiteAlpha.900"
        >
          What Customers Are Saying
        </Text>
        <CLink
          as={Link}
          to={`/reviews/?filter=${productType}`}
          fontSize="sm"
          color="blue.200"
          _hover={{ color: 'blue.400' }}
        >
          Read all reviews →
        </CLink>
      </Flex>

      <Flex align="center" gap={2}>
        {/* Left arrow */}
        <IconButton
          icon={<FiChevronLeft />}
          aria-label="Scroll reviews left"
          onClick={() => scroll('left')}
          variant="ghost"
          color="whiteAlpha.600"
          _hover={{ color: 'white' }}
          size="sm"
          flexShrink={0}
          display={{ base: 'none', md: 'flex' }}
        />

        {/* Scrollable strip */}
        <Flex
          ref={scrollRef}
          overflowX="auto"
          gap={4}
          flex="1"
          css={{
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
          py={2}
        >
          {reviews.map((review) => (
            <Box
              key={review.id}
              minW={{ base: '280px', md: '300px' }}
              maxW="300px"
              bg="whiteAlpha.50"
              border="1px solid"
              borderColor="whiteAlpha.100"
              borderRadius="md"
              p={4}
              flexShrink={0}
              cursor="pointer"
              _hover={{ bg: 'whiteAlpha.100', borderColor: 'whiteAlpha.200' }}
              transition="all 0.2s"
              onClick={() => setSelectedReview(review)}
            >
              <Stars count={review.stars} />
              <Flex mt={2} gap={3}>
                {review.hasPhoto && (
                  <Image
                    src={`${S3_BASE}/review${review.id}.jpg`}
                    alt={`Photo from ${review.name}`}
                    boxSize="80px"
                    objectFit="cover"
                    borderRadius="md"
                    flexShrink={0}
                  />
                )}
                <Text
                  fontSize="sm"
                  color="whiteAlpha.800"
                  fontStyle="italic"
                  lineHeight="tall"
                >
                  "{truncate(review.text, review.hasPhoto ? 100 : 150)}"
                </Text>
              </Flex>
              <Text fontSize="xs" color="whiteAlpha.500" mt={3}>
                — {review.name}
              </Text>
            </Box>
          ))}

          {/* End card linking to all reviews */}
          <Flex
            minW="200px"
            align="center"
            justify="center"
            flexShrink={0}
          >
            <CLink
              as={Link}
              to="/reviews"
              fontSize="sm"
              color="blue.200"
              fontWeight="bold"
              _hover={{ color: 'blue.400', textDecoration: 'none' }}
              textAlign="center"
              px={4}
            >
              Read all {reviewData.meta.totalReviews} reviews →
            </CLink>
          </Flex>
        </Flex>

        {/* Right arrow */}
        <IconButton
          icon={<FiChevronRight />}
          aria-label="Scroll reviews right"
          onClick={() => scroll('right')}
          variant="ghost"
          color="whiteAlpha.600"
          _hover={{ color: 'white' }}
          size="sm"
          flexShrink={0}
          display={{ base: 'none', md: 'flex' }}
        />
      </Flex>

      {/* Gold accent line */}
      <Box h="1px" bg="linear-gradient(to right, transparent, var(--chakra-colors-yellow-600), transparent)" mt={4} />

      {/* Review detail modal */}
      <Modal
        isOpen={!!selectedReview}
        onClose={() => setSelectedReview(null)}
        isCentered
        size="lg"
      >
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg="#1a140f" border="1px solid" borderColor="whiteAlpha.200">
          <ModalCloseButton color="whiteAlpha.700" />
          <ModalBody py={8} px={6}>
            {selectedReview && (
              <Flex direction="column" gap={4}>
                <Stars count={selectedReview.stars} size="md" />

                {selectedReview.hasPhoto && (
                  <Image
                    src={`${S3_BASE}/review${selectedReview.id}.jpg`}
                    alt={`Photo from ${selectedReview.name}`}
                    maxH="300px"
                    objectFit="contain"
                    borderRadius="md"
                    alignSelf="center"
                  />
                )}

                <Text
                  fontSize="md"
                  color="whiteAlpha.900"
                  fontStyle="italic"
                  lineHeight="tall"
                >
                  "{selectedReview.text}"
                </Text>

                <Flex justify="space-between" align="center">
                  <Text fontSize="sm" color="whiteAlpha.800">
                    — {selectedReview.name}
                  </Text>
                  <Text fontSize="xs" color="whiteAlpha.600">
                    {selectedReview.date}
                  </Text>
                </Flex>

                {selectedReview.product && (
                  <Text fontSize="xs" color="whiteAlpha.600">
                    Purchased: {selectedReview.product}
                  </Text>
                )}
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TestimonialStrip;
