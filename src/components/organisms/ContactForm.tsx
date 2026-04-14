import React, { useState } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Stack,
  FormErrorMessage,
  Text,
  Button,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { navigate, Link } from 'gatsby';

type FormData = {
  email: string;
  message: string;
};

type AsyncStatus = 'loading' | 'error' | 'success' | undefined;

const ContactForm = ({ ...props }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [status, setStatus] = useState<AsyncStatus>(undefined);

  const onSubmit = (data: FormData) => {
    setStatus('loading');
    axios
      .post('https://kskpjto2y8.execute-api.us-east-2.amazonaws.com/dev/contact', data)
      .then(() => {
        setStatus('success');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      })
      .catch(() => {
        setStatus('error');
      });
  };

  return (
    <Box maxW="700px" {...props}>
      <Box as="section" id="contact">
      <Heading letterSpacing="wide">Contact Me!</Heading>
      <Text mt="2">
        Have a question about an order or want something custom? Drop me a message below!
        You can also browse our{' '}
        <Link to="/design-bullwhip" style={{ textDecoration: 'underline' }}>custom Bullwhip options</Link>
        {' '}or{' '}
        <Link to="/specialty-whips" style={{ textDecoration: 'underline' }}>Specialty Whips</Link>.
      </Text>
      {status && status !== 'loading' && (
        <Text fontWeight="bold" color={status === 'error' ? 'red.500' : 'green.200'} mt="4">
          {status === 'error'
            ? 'Something went wrong while submitting the form, please try again.'
            : 'Message sent! Thank you!'}
        </Text>
      )}
      <Stack spacing="5" mt="4">
        <FormControl isInvalid={!!errors.email}>
          <FormLabel>Your Email Address</FormLabel>
          <Input placeholder="you@youremail.com" {...register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })} color="white" />
          <FormErrorMessage>Please enter a valid email address.</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.message}>
          <FormLabel>Message</FormLabel>
          <Textarea
            placeholder="Type your message here!"
            {...register('message', { required: true })}
            color="white"
            fontWeight="bold"
          />
          <FormErrorMessage>Please add a message.</FormErrorMessage>
        </FormControl>
        <Button mt="4" onClick={handleSubmit(onSubmit)} isLoading={status === 'loading'}>
          Send Message
        </Button>
      </Stack>
      </Box>

      {/* Policies Section */}
      <Box as="section" id="policies" mt="16">
        <Divider borderColor="whiteAlpha.200" mb="8" />
        <Heading size="lg" letterSpacing="wide" mb="6">
          Policies
        </Heading>

        <Accordion allowMultiple>
          {/* Return Policy */}
          <AccordionItem border="none" mb="2">
            <AccordionButton
              bg="whiteAlpha.50"
              borderRadius="md"
              _hover={{ bg: 'whiteAlpha.100' }}
              _expanded={{ bg: 'whiteAlpha.100', borderBottomRadius: 0 }}
              py="4"
            >
              <Box flex="1" textAlign="left">
                <Text fontWeight="bold" fontSize="md">Return Policy</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel bg="whiteAlpha.50" borderBottomRadius="md" pb="6">
              <Text fontSize="sm" lineHeight="tall" mb="3">
                Because every custom whip is handcrafted to your exact specifications, I am unable to accept returns on custom products. Each whip is a one-of-a-kind piece made just for you.
              </Text>
              <Text fontSize="sm" lineHeight="tall" mb="3">
                I also cannot accept cancellations on orders once construction of the whip has begun. Please note that I may begin work on your whip the same day I receive the order, or it may be 3-5 weeks before I start depending on my current queue.
              </Text>
              <Text fontSize="sm" lineHeight="tall">
                If you have any concerns about your order, please reach out to me as soon as possible using the contact form above and I will do my best to work with you.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          {/* Shipping Policy */}
          <AccordionItem border="none" mb="2">
            <AccordionButton
              bg="whiteAlpha.50"
              borderRadius="md"
              _hover={{ bg: 'whiteAlpha.100' }}
              _expanded={{ bg: 'whiteAlpha.100', borderBottomRadius: 0 }}
              py="4"
            >
              <Box flex="1" textAlign="left">
                <Text fontWeight="bold" fontSize="md">Shipping Policy</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel bg="whiteAlpha.50" borderBottomRadius="md" pb="6">
              <Text fontSize="sm" fontWeight="bold" mb="2">Custom Whips</Text>
              <Text fontSize="sm" lineHeight="tall" mb="3">
                Please allow up to 6 weeks for construction of your custom whip and shipment. I do my best to get whips out sooner, but each one is handcrafted and quality takes time. If you need a whip by a specific date, feel free to reach out about expedited services!
              </Text>
              <Text fontSize="sm" fontWeight="bold" mb="2">All Other Products</Text>
              <Text fontSize="sm" lineHeight="tall" mb="3">
                Accessories, whipmaking materials, and other non-custom products ship within 5 business days.
              </Text>
              <Text fontSize="sm" lineHeight="tall">
                Whip Blueprints are emailed to the customer on purchase. If you order a Blueprint and do not receive an email with your product, please send an email to adam@whipworks.com with a copy of your receipt and I will manually email it to you.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          {/* Privacy Policy */}
          <AccordionItem border="none" mb="2">
            <AccordionButton
              bg="whiteAlpha.50"
              borderRadius="md"
              _hover={{ bg: 'whiteAlpha.100' }}
              _expanded={{ bg: 'whiteAlpha.100', borderBottomRadius: 0 }}
              py="4"
            >
              <Box flex="1" textAlign="left">
                <Text fontWeight="bold" fontSize="md">Privacy Policy</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel bg="whiteAlpha.50" borderBottomRadius="md" pb="6">
              <Text fontSize="sm" lineHeight="tall" mb="3">
                WhipWorks respects your privacy. This policy explains how your information is collected and used when you visit whipworks.com or place an order.
              </Text>

              <Text fontSize="sm" fontWeight="bold" mb="2">Information We Collect</Text>
              <Text fontSize="sm" lineHeight="tall" mb="3">
                When you place an order, your name, email address, shipping address, and payment information are collected through our checkout provider, Snipcart. WhipWorks does not directly store your credit card or payment details — all payment processing is handled securely by Snipcart and their payment processors.
              </Text>
              <Text fontSize="sm" lineHeight="tall" mb="3">
                When you use the contact form, your email address and message are sent to us via Amazon Web Services (SES) so we can respond to your inquiry.
              </Text>

              <Text fontSize="sm" fontWeight="bold" mb="2">How We Use Your Information</Text>
              <UnorderedList fontSize="sm" spacing="1" mb="3" pl="4">
                <ListItem>To fulfill and ship your orders</ListItem>
                <ListItem>To communicate with you about your order or inquiry</ListItem>
                <ListItem>To send order confirmation and shipping notification emails via SendGrid</ListItem>
              </UnorderedList>
              <Text fontSize="sm" lineHeight="tall" mb="3">
                We do not sell, trade, or share your personal information with third parties for marketing purposes.
              </Text>

              <Text fontSize="sm" fontWeight="bold" mb="2">Analytics</Text>
              <Text fontSize="sm" lineHeight="tall" mb="3">
                This site uses Google Analytics to understand how visitors use the website (pages visited, time on site, etc.). This data is aggregated and anonymous. You can opt out of Google Analytics by using a browser extension or adjusting your browser settings.
              </Text>

              <Text fontSize="sm" fontWeight="bold" mb="2">Third-Party Services</Text>
              <UnorderedList fontSize="sm" spacing="1" mb="3" pl="4">
                <ListItem>Snipcart — shopping cart and checkout</ListItem>
                <ListItem>Stripe — payment processing (via Snipcart)</ListItem>
                <ListItem>SendGrid — order confirmation emails</ListItem>
                <ListItem>Amazon Web Services — website hosting and contact form</ListItem>
                <ListItem>Google Analytics — website analytics</ListItem>
              </UnorderedList>
              <Text fontSize="sm" lineHeight="tall" mb="3">
                Each of these services has their own privacy policies governing how they handle your data.
              </Text>

              <Text fontSize="sm" fontWeight="bold" mb="2">Questions</Text>
              <Text fontSize="sm" lineHeight="tall">
                If you have any questions about this privacy policy, please reach out using the contact form above or email adam@whipworks.com.
              </Text>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </Box>
  );
};

export default ContactForm;
