import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react';

const S3_REVIEWS_URL = 'https://whipworks.s3.us-east-2.amazonaws.com/reviews';

type ReviewProps = {
  id: number;
  name: string;
  stars: number;
  date: string;
  product: string;
  text: string;
  hasPhoto: boolean;
  featured?: boolean;
  adamResponse?: string;
};

const Stars = ({ count, size = 'md' }: { count: number; size?: string }) => (
  <Text fontSize={size} color="gold" letterSpacing="wider" aria-label={`${count} out of 5 stars`}>
    {'★'.repeat(count)}{'☆'.repeat(5 - count)}
  </Text>
);

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const truncate = (text: string, max = 200) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return cut.slice(0, lastSpace) + '...';
};

const ReviewCard = ({ id, name, stars, date, product, text, hasPhoto, adamResponse }: ReviewProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const photoUrl = hasPhoto ? `${S3_REVIEWS_URL}/review${id}.jpg` : null;
  const isTruncated = text.length > 200;

  return (
    <>
      <Box
        bg="whiteAlpha.50"
        borderRadius="md"
        overflow="hidden"
        border="1px solid"
        borderColor="whiteAlpha.100"
        transition="all 0.2s"
        _hover={{ borderColor: 'whiteAlpha.300', bg: 'whiteAlpha.100' }}
        cursor="pointer"
        onClick={() => setIsOpen(true)}
      >
        {photoUrl && (
          <Image
            src={photoUrl}
            alt={`Customer photo for ${product}`}
            width="100%"
            maxH="300px"
            objectFit="cover"
          />
        )}

        <Box p={{ base: 4, md: 5 }}>
          <Flex justify="space-between" align="center" mb={2}>
            <Stars count={stars} />
            <Text fontSize="xs" color="whiteAlpha.500">
              {formatDate(date)}
            </Text>
          </Flex>

          <Text fontSize="sm" fontWeight="bold" color="whiteAlpha.900" mb={1}>
            {name}
          </Text>

          <Text fontSize="xs" color="blue.200" mb={text ? 3 : 0}>
            {product}
          </Text>

          {text && (
            <Text fontSize="sm" color="whiteAlpha.800" lineHeight="tall">
              {truncate(text)}
            </Text>
          )}

          {isTruncated && (
            <Text fontSize="xs" color="blue.200" mt={1}>
              Read more
            </Text>
          )}
        </Box>
      </Box>

      {/* Full review modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="lg" isCentered>
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg="#1a140f" border="1px solid" borderColor="whiteAlpha.200">
          <ModalCloseButton color="whiteAlpha.700" />
          <ModalBody py={8} px={6}>
            <Flex direction="column" gap={4}>
              <Stars count={stars} size="lg" />

              {photoUrl && (
                <Image
                  src={photoUrl}
                  alt={`Customer photo for ${product}`}
                  maxH="400px"
                  objectFit="contain"
                  borderRadius="md"
                  alignSelf="center"
                />
              )}

              {text && (
                <Text fontSize="md" color="whiteAlpha.900" fontStyle="italic" lineHeight="tall">
                  "{text}"
                </Text>
              )}

              <Flex justify="space-between" align="center">
                <Text fontSize="sm" color="whiteAlpha.800">
                  — {name}
                </Text>
                <Text fontSize="xs" color="whiteAlpha.600">
                  {formatDate(date)}
                </Text>
              </Flex>

              <Text fontSize="xs" color="whiteAlpha.600">
                Purchased: {product}
              </Text>

              {adamResponse && (
                <Box
                  pl={3}
                  borderLeft="2px solid"
                  borderColor="blue.200"
                >
                  <Text fontSize="xs" fontWeight="bold" color="blue.200" mb={1}>
                    Adam responded:
                  </Text>
                  <Text fontSize="sm" color="whiteAlpha.700" fontStyle="italic">
                    {adamResponse}
                  </Text>
                </Box>
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ReviewCard;
