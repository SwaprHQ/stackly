import styled from 'styled-components';

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  width: 100%;
  gap: 8px;

  @media (min-width: 320px) {
    flex-direction: row;
  }

  & > input {
    flex: 1;
  }
`;
