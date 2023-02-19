import { ReactNode } from 'react';
import { AlertTriangle, Slash } from 'react-feather';
import styled from 'styled-components/macro';
import { WARNING_LEVEL } from '../../token-list/tokenSafety';

const Label = styled.div<{ color?: string; backgroundColor?: string }>`
  padding: 4px 4px;
  font-size: 12px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: 8px;
  color: ${({ color }) => color};
  display: inline-flex;
  align-items: center;
`;

const Title = styled.span`
  margin-right: 5px;
  font-weight: 700;
  font-size: 12px;
`;

type TokenWarningLabelProps = {
  level: WARNING_LEVEL;
  canProceed: boolean;
  children: ReactNode;
};
export default function TokenSafetyLabel({
  level,
  canProceed,
  children,
}: TokenWarningLabelProps) {
  return (
    <Label>
      <Title>{children}</Title>
      {canProceed ? (
        <AlertTriangle strokeWidth={2.5} size="14px" />
      ) : (
        <Slash strokeWidth={2.5} size="14px" />
      )}
    </Label>
  );
}
