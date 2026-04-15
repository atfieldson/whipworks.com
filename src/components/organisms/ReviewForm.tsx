import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Stack,
  FormErrorMessage,
  Text,
  Button,
  Icon,
  HStack,
  Divider,
  Link as ChakraLink,
  Image,
  CloseButton,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { navigate } from 'gatsby';

type FormData = {
  name: string;
  email: string;
  product: string;
  rating: number;
  review: string;
};

type AsyncStatus = 'loading' | 'error' | 'success' | undefined;

const StarIcon = ({ filled, onClick, onMouseEnter, onMouseLeave }: {
  filled: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => (
  <Box
    as="button"
    type="button"
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    cursor="pointer"
    transition="transform 0.1s"
    _hover={{ transform: 'scale(1.2)' }}
    aria-label="Rate"
  >
    <Icon viewBox="0 0 24 24" boxSize={8} color={filled ? 'yellow.400' : 'whiteAlpha.300'}>
      <path
        fill="currentColor"
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      />
    </Icon>
  </Box>
);

const PRODUCT_OPTIONS = [
  { label: 'Custom Bullwhip', value: 'Custom Bullwhip' },
  { label: 'Custom Stockwhip', value: 'Custom Stockwhip' },
  { label: 'Custom Snakewhip', value: 'Custom Snakewhip' },
  { label: 'The Indy Bullwhip', value: 'The Indy Bullwhip' },
  { label: 'The Belmont', value: 'The Belmont' },
  { label: 'The Catwhip', value: 'The Catwhip' },
  { label: 'The Z Whip', value: 'The Z Whip' },
  { label: 'The Mando Bullwhip', value: 'The Mando Bullwhip' },
  { label: 'The One Winged Bullwhip', value: 'The One Winged Bullwhip' },
  { label: 'The Harlequin', value: 'The Harlequin' },
  { label: 'The Joking Bullwhip', value: 'The Joking Bullwhip' },
  { label: 'The Nightlord (40K Series)', value: 'The Nightlord' },
  { label: 'The Ultra Whip (40K Series)', value: 'The Ultra Whip' },
  { label: 'The Star Spangled Bullwhip', value: 'The Star Spangled Bullwhip' },
  { label: 'The Pride Whip', value: 'The Pride Whip' },
  { label: 'Whip Blueprints', value: 'Whip Blueprints' },
  { label: 'Whipmaking Materials', value: 'Whipmaking Materials' },
  { label: 'Poppers / Accessories', value: 'Poppers / Accessories' },
  { label: 'Other', value: 'Other' },
];

const MAX_IMAGE_SIZE = 800; // max width/height in pixels
const JPEG_QUALITY = 0.7;

const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Scale down if needed
        if (width > MAX_IMAGE_SIZE || height > MAX_IMAGE_SIZE) {
          if (width > height) {
            height = Math.round((height * MAX_IMAGE_SIZE) / width);
            width = MAX_IMAGE_SIZE;
          } else {
            width = Math.round((width * MAX_IMAGE_SIZE) / height);
            height = MAX_IMAGE_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Could not get canvas context'));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
      };
      img.onerror = () => reject(new Error('Could not load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
};

const PHOTO_UPLOAD_URL = 'https://kskpjto2y8.execute-api.us-east-2.amazonaws.com/dev/review-photo';

const ReviewForm = ({ ...props }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>();
  const [status, setStatus] = useState<AsyncStatus>(undefined);
  const [hoverRating, setHoverRating] = useState(0);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentRating = watch('rating') || 0;
  const displayRating = hoverRating || currentRating;

  const handlePhotoSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPhotoError(null);
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select an image file (JPG, PNG, etc.)');
      return;
    }

    // Validate file size (max 10MB before resize)
    if (file.size > 10 * 1024 * 1024) {
      setPhotoError('Image is too large. Please select a photo under 10MB.');
      return;
    }

    try {
      const resized = await resizeImage(file);
      setPhotoPreview(resized);
      setPhotoData(resized);
    } catch {
      setPhotoError('Could not process the image. Please try a different photo.');
    }
  }, []);

  const removePhoto = useCallback(() => {
    setPhotoPreview(null);
    setPhotoData(null);
    setPhotoError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const onSubmit = async (data: FormData) => {
    setStatus('loading');

    let photoUrl: string | null = null;

    // Upload photo to S3 first if one was selected
    if (photoData) {
      try {
        const uploadRes = await axios.post(PHOTO_UPLOAD_URL, {
          image: photoData,
          customerName: data.name,
          product: data.product,
        });
        photoUrl = uploadRes.data.url;
      } catch {
        // If photo upload fails, fall back to sending base64 in email
        console.warn('Photo upload to S3 failed, including base64 in email instead');
      }
    }

    // Format the review as a structured message for the contact endpoint
    const messageParts = [
      '--- NEW REVIEW SUBMISSION ---',
      '',
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Product: ${data.product}`,
      `Rating: ${'★'.repeat(data.rating)}${'☆'.repeat(5 - data.rating)} (${data.rating}/5)`,
      `Photo: ${photoUrl ? photoUrl : photoData ? 'Yes (base64 below)' : 'No'}`,
      '',
      'Review:',
      data.review,
      '',
      '---',
      'To add this review to the site, add an entry to src/data/reviews.json',
    ];

    // Only include base64 as fallback if S3 upload failed
    if (photoData && !photoUrl) {
      messageParts.push('');
      messageParts.push('--- CUSTOMER PHOTO (base64 fallback) ---');
      messageParts.push(photoData);
    }

    if (photoUrl) {
      messageParts.push('');
      messageParts.push(`Photo is ready in S3 (pending review): ${photoUrl}`);
      messageParts.push('Move from reviews/pending/ to reviews/ when adding to the site.');
    }

    const message = messageParts.join('\n');

    try {
      await axios.post('https://kskpjto2y8.execute-api.us-east-2.amazonaws.com/dev/contact', {
        email: data.email,
        message,
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <Box maxW="700px" {...props}>
        <Box bg="green.800" p="6" borderRadius="lg" textAlign="center">
          <Heading size="md" mb="3">Thank you for your review!</Heading>
          <Text fontSize="md" color="whiteAlpha.800">
            Your review has been submitted and will be added to the site after it is reviewed. I appreciate you taking the time to share your experience!
          </Text>
          <Button
            mt="4"
            onClick={() => navigate('/')}
            bg="blue.200"
            color="gray.900"
            _hover={{ bg: 'blue.300' }}
          >
            Return to Homepage
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box maxW="700px" {...props}>
      {/* Google Review Section */}
      <Box as="section" mb="12">
        <Heading letterSpacing="wide" mb="3">Leave a Review</Heading>
        <Text mt="2" mb="6">
          Your feedback means the world to me! If you have a moment, I would love to hear about your
          experience with your whip.
        </Text>

        <Box
          bg="whiteAlpha.50"
          p="6"
          borderRadius="lg"
          borderLeft="3px solid"
          borderColor="blue.300"
          mb="4"
        >
          <Heading size="sm" mb="2">Leave a Google Review</Heading>
          <Text fontSize="sm" color="whiteAlpha.800" mb="3">
            A Google review helps other whip enthusiasts find WhipWorks! If you have a Google account,
            please consider leaving a review there as well.
          </Text>
          <ChakraLink
            href="https://g.page/r/YOUR_GOOGLE_REVIEW_LINK/review"
            isExternal
            _hover={{ textDecoration: 'none' }}
          >
            <Button
              size="sm"
              bg="blue.200"
              color="gray.900"
              _hover={{ bg: 'blue.300' }}
              leftIcon={
                <Icon viewBox="0 0 24 24" boxSize={4}>
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </Icon>
              }
            >
              Review on Google
            </Button>
          </ChakraLink>
        </Box>
      </Box>

      {/* On-site Review Form */}
      <Divider borderColor="whiteAlpha.200" mb="8" />

      <Box as="section">
        <Heading size="lg" letterSpacing="wide" mb="2">
          Review on WhipWorks.com
        </Heading>
        <Text fontSize="sm" color="whiteAlpha.700" mb="6">
          Your review will be posted on the site after it is reviewed. Thank you for your feedback!
        </Text>

        <Stack as="form" onSubmit={handleSubmit(onSubmit)} spacing="6">
          {/* Name */}
          <FormControl isInvalid={!!errors.name}>
            <FormLabel>Your Name (or Initials)</FormLabel>
            <Input
              placeholder="First name or initials"
              {...register('name', { required: 'Please enter your name or initials' })}
            />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>

          {/* Email */}
          <FormControl isInvalid={!!errors.email}>
            <FormLabel>Email Address</FormLabel>
            <Input
              type="email"
              placeholder="you@youremail.com"
              {...register('email', {
                required: 'Please enter your email',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address',
                },
              })}
            />
            <Text fontSize="xs" color="whiteAlpha.500" mt="1">
              Your email will not be displayed publicly. It is only used to verify your purchase.
            </Text>
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>

          {/* Product */}
          <FormControl isInvalid={!!errors.product}>
            <FormLabel>Product Purchased</FormLabel>
            <Select
              placeholder="Select a product"
              {...register('product', { required: 'Please select the product you purchased' })}
            >
              {PRODUCT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ background: '#1a140f' }}>
                  {opt.label}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.product?.message}</FormErrorMessage>
          </FormControl>

          {/* Star Rating */}
          <FormControl isInvalid={!!errors.rating}>
            <FormLabel>Rating</FormLabel>
            <HStack spacing="1">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  filled={star <= displayRating}
                  onClick={() => setValue('rating', star, { shouldValidate: true })}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
              {currentRating > 0 && (
                <Text fontSize="sm" color="whiteAlpha.600" ml="2">
                  {currentRating} / 5
                </Text>
              )}
            </HStack>
            <input
              type="hidden"
              {...register('rating', {
                required: 'Please select a rating',
                min: { value: 1, message: 'Please select a rating' },
              })}
            />
            <FormErrorMessage>{errors.rating?.message}</FormErrorMessage>
          </FormControl>

          {/* Review Text */}
          <FormControl isInvalid={!!errors.review}>
            <FormLabel>Your Review</FormLabel>
            <Textarea
              placeholder="Tell me about your experience with your whip!"
              rows={6}
              {...register('review', {
                required: 'Please write your review',
                minLength: { value: 10, message: 'Please write at least a few words' },
              })}
            />
            <FormErrorMessage>{errors.review?.message}</FormErrorMessage>
          </FormControl>

          {/* Photo Upload */}
          <FormControl>
            <FormLabel>Add a Photo (Optional)</FormLabel>
            <Text fontSize="xs" color="whiteAlpha.500" mb="3">
              Share a photo of your whip! JPG or PNG, max 10MB.
            </Text>

            {photoPreview ? (
              <Box position="relative" display="inline-block">
                <Image
                  src={photoPreview}
                  alt="Your photo"
                  maxH="200px"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                />
                <CloseButton
                  position="absolute"
                  top="-2"
                  right="-2"
                  size="sm"
                  bg="red.600"
                  color="white"
                  borderRadius="full"
                  _hover={{ bg: 'red.500' }}
                  onClick={removePhoto}
                  aria-label="Remove photo"
                />
              </Box>
            ) : (
              <Button
                as="label"
                htmlFor="photo-upload"
                cursor="pointer"
                variant="outline"
                borderColor="whiteAlpha.300"
                _hover={{ bg: 'whiteAlpha.100' }}
                leftIcon={
                  <Icon viewBox="0 0 24 24" boxSize={5}>
                    <path
                      fill="currentColor"
                      d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
                    />
                  </Icon>
                }
              >
                Choose Photo
              </Button>
            )}
            <Input
              id="photo-upload"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              display="none"
            />
            {photoError && (
              <Text color="red.300" fontSize="sm" mt="2">{photoError}</Text>
            )}
          </FormControl>

          {status === 'error' && (
            <Text color="red.300" fontSize="sm">
              Something went wrong. Please try again or send your review to adam@whipworks.com.
            </Text>
          )}

          <Button
            type="submit"
            bg="blue.200"
            color="gray.900"
            size="lg"
            _hover={{ bg: 'blue.300' }}
            isLoading={status === 'loading'}
            loadingText={photoData ? 'Uploading photo & submitting...' : 'Submitting...'}
          >
            Submit Review
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default ReviewForm;
