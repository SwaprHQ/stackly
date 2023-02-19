import { AlertTriangle, Slash } from 'react-feather';
import styled from 'styled-components/macro';
import { getWarningCopy, Warning } from '../../token-list/tokenSafety';
import {
  useTokenWarningColor,
  useTokenWarningTextColor,
} from '../../tokens/useTokenWarningColor';

const Label = styled.div<{ color: string; backgroundColor: string }>`
  width: 100%;
  padding: 12px 20px 16px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: 16px;
  color: ${({ color }) => color};
`;

const TitleRow = styled.div`
  align-items: center;
  font-weight: 700;
  display: inline-flex;
`;

const Title = styled.div<{ marginLeft: string }>`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  margin-left: 7px;
`;

const DetailsRow = styled.div`
  margin-top: 8px;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.textSecondary};
`;

type TokenSafetyMessageProps = {
  warning: Warning;
  tokenAddress: string;
};

export default function TokenSafetyMessage({
  warning,
  tokenAddress,
}: TokenSafetyMessageProps) {
  const backgroundColor = useTokenWarningColor(warning.level);
  const textColor = useTokenWarningTextColor(warning.level);
  const { heading, description } = getWarningCopy(warning);

  return (
    <Label
      data-cy="token-safety-message"
      color={textColor}
      backgroundColor={backgroundColor}
    >
      <TitleRow>
        {warning.canProceed ? (
          <AlertTriangle size="16px" />
        ) : (
          <Slash size="16px" />
        )}
        <Title marginLeft="7px">{warning.message}</Title>
      </TitleRow>

      <DetailsRow>
        {heading}
        {Boolean(heading) && ' '}
        {description}
        {Boolean(description) && ' '}
      </DetailsRow>
    </Label>
  );
}
