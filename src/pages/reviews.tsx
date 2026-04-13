import React, { useState, useMemo } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Grid,
  Button,
  Select,
} from '@chakra-ui/react';

import Layout from '../components/templates/Layout';
import SEO from '../components/templates/SEO';
import ReviewCard from '../components/organisms/ReviewCard';
import reviewData from '../data/reviews.json';

const REVIEWS_PER_PAGE = 24;

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  all: 'All Reviews',
  bullwhip: 'Bullwhips',
  stockwhip: 'Stockwhips',
  snakewhip: 'Snakewhips',
  specialty: 'Specialty Whips',
  flogger: 'Floggers',
  blueprint: 'Blueprints',
  material: 'Materials & Tools',
  accessory: 'Accessories',
  other: 'Other',
};

const ReviewsPage = () => {
  const [filter, setFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(REVIEWS_PER_PAGE);

  const { meta, reviews } = reviewData;

  // Show newest first
  const sortedReviews = useMemo(
    () => [...reviews].sort((a, b) => b.id - a.id),
    [reviews]
  );

  const filteredReviews = useMemo(() => {
    if (filter === 'all') return sortedReviews;
    return sortedReviews.filter((r) => r.productType === filter);
  }, [sortedReviews, filter]);

  const visibleReviews = filteredReviews.slice(0, visibleCount);
  const hasMore = visibleCount < filteredReviews.length;

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
    setVisibleCount(REVIEWS_PER_PAGE);
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'WhipWorks',
    url: 'https://www.whipworks.com',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: meta.averageRating.toString(),
      reviewCount: meta.totalReviews.toString(),
      bestRating: '5',
      worstRating: '1',
    },
  };

  return (
    <Layout>
      <SEO
        title="Customer Reviews"
        description={`Read ${meta.totalReviews} reviews from WhipWorks customers. ${meta.averageRating} out of 5 stars. 1,200+ whips crafted with care.`}
        pathname="/reviews"
        structuredData={structuredData}
      />

      {/* Hero Stats */}
      <Box textAlign="center" pt={{ base: 6, md: 10 }} pb={{ base: 6, md: 8 }}>
        <Text fontSize={{ base: '4xl', md: '5xl' }} color="gold" mb={2}>
          {'★'.repeat(5)}
        </Text>
        <Heading
          as="h1"
          fontSize={{ base: '2xl', md: '4xl' }}
          letterSpacing="wide"
          mb={3}
        >
          Customer Reviews
        </Heading>
        <Flex
          justify="center"
          gap={{ base: 4, md: 8 }}
          flexWrap="wrap"
          fontSize={{ base: 'sm', md: 'md' }}
          color="whiteAlpha.800"
        >
          <Text>
            <Text as="span" fontWeight="bold" color="white" fontSize={{ base: 'lg', md: 'xl' }}>
              {meta.averageRating}
            </Text>{' '}
            average rating
          </Text>
          <Text>
            <Text as="span" fontWeight="bold" color="white" fontSize={{ base: 'lg', md: 'xl' }}>
              {meta.totalReviews}
            </Text>{' '}
            reviews
          </Text>
          <Text>
            <Text as="span" fontWeight="bold" color="white" fontSize={{ base: 'lg', md: 'xl' }}>
              1,200+
            </Text>{' '}
            whips crafted
          </Text>
        </Flex>
      </Box>

      {/* Filter Bar */}
      <Flex justify="center" mb={8} px={4}>
        <Select
          value={filter}
          onChange={handleFilterChange}
          maxW="300px"
          bg="whiteAlpha.100"
          borderColor="whiteAlpha.200"
          _hover={{ borderColor: 'whiteAlpha.400' }}
        >
          {Object.entries(PRODUCT_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value} style={{ background: '#1a140f' }}>
              {label}
              {value !== 'all'
                ? ` (${reviews.filter((r) => r.productType === value).length})`
                : ` (${reviews.length})`}
            </option>
          ))}
        </Select>
      </Flex>

      {/* Review Grid */}
      <Box px={{ base: 4, md: 8 }} maxW="1080px" mx="auto" pb={12}>
        <Grid
          templateColumns={{
            base: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          }}
          gap={6}
        >
          {visibleReviews.map((review) => (
            <ReviewCard
              key={review.id}
              id={review.id}
              name={review.name}
              stars={review.stars}
              date={review.date}
              product={review.product}
              text={review.text}
              hasPhoto={review.hasPhoto}
              featured={review.featured}
              adamResponse={(review as any).adamResponse}
            />
          ))}
        </Grid>

        {/* Load More */}
        {hasMore && (
          <Flex justify="center" mt={10}>
            <Button
              onClick={() => setVisibleCount((prev) => prev + REVIEWS_PER_PAGE)}
              variant="solid"
            >
              Load More Reviews ({filteredReviews.length - visibleCount} remaining)
            </Button>
          </Flex>
        )}
      </Box>
    </Layout>
  );
};

export default ReviewsPage;
