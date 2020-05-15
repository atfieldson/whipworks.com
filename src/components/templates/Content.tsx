import styled from '@emotion/styled';
import { Box } from '@chakra-ui/core';

const Content = styled(Box)`
  margin: 0 auto;
  padding: 0 30px;
  max-width: 1080px;
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
  margin-top: 100px; /* height of header + 20px buffer */
`;

export default Content;
