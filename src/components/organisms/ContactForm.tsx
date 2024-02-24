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
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { navigate } from 'gatsby';

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
      .catch((e: any) => {
        console.log(e);
        setStatus('error');
      });
  };

  return (
    <Box maxW="700px" {...props}>
      <Heading letterSpacing="wide">Contact Me!</Heading>
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
          <Input placeholder="you@youremail.com" {...register('email', { required: true })} />
          <FormErrorMessage>Please enter your email address.</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.message}>
          <FormLabel>Message</FormLabel>
          <Textarea
            placeholder="Type your message here!"
            {...register('message', { required: true })}
            color="#000000"
            fontWeight="bold"
          />
          <FormErrorMessage>Please add a message.</FormErrorMessage>
        </FormControl>
        <Button mt="4" onClick={handleSubmit(onSubmit)} isLoading={status === 'loading'}>
          Send Message
        </Button>
      </Stack>
    </Box>
  );
};

export default ContactForm;
