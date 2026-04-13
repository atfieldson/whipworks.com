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
  useDisclosure,
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

const Stars = ({ count }: { count: number }) => (
  <Text fontSize="md" color="gold" letterSpacing="wider" aria-label={`${count} out of 5 stars`}>
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

const ReviewCard = ({ id, name, stars, date, product, text, hasPhoto, adamResponse }: ReviewProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const photoUrl = hasPhoto ? `${S3_REVIEWS_URL}/review${id}.jpg` : null;

  return (
    <Box
      bg="whiteAlpha.50"
      borderRadius="md"
      overflow="hidden"
      border="1px solid"
      borderColor="whiteAlpha.100"
      transition="border-color 0.2s"
      _hover={{ borderColor: 'whiteAlpha.300' }}
    >
      {photoUrl && (
        <Image
          src={photoUrl}
          alt={`Customer photo for ${product}`}
          width="100%"
          maxH="300px"
          objectFit="cover"
          cursor="pointer"
          onClick={onOpen}
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
            {text}
          </Text>
        )}

        {adamResponse && (
          <Box
            mt={3}
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
      </Box>

      {/* Photo lightbox */}
      {photoUrl && (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
          <ModalOverlay bg="blackAlpha.800" />
          <ModalContent bg="transparent" boxShadow="none" maxW="90vw">
            <ModalCloseButton color="white" size="lg" />
            <ModalBody p={0} display="flex" justifyContent="center">
              <Image
                src={photoUrl}
                alt={`Customer photo for ${product}`}
                maxH="85vh"
                maxW="100%"
                objectFit="contain"
                borderRadius="md"
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default ReviewCard;
