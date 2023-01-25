import styled from 'styled-components';

type FormGroupProps = {
  children: React.ReactNode;
};

export function FormGroup({ children, ...props }: FormGroupProps) {
  return <StyledFromGroup {...props}>{children}</StyledFromGroup>;
}

const StyledFromGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
`;
