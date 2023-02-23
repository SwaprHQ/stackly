import { Token } from 'dca-sdk';
import { ExternalLink as LinkIconFeather } from 'react-feather';
import styled from 'styled-components/macro';
import { useAddUserToken } from '../../state/user/hooks';
import {
  checkWarning,
  getWarningCopy,
  Warning,
} from '../../token-list/tokenSafety';
import { useToken } from '../../tokens/Tokens';
import { Button } from '../../ui/components/Button/Button';
import { getExplorerLink } from '../../utils';
import { AutoColumn } from '../Column';
import TokenSafetyLabel from './TokenSafetyLabel';

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-flow: column;
  align-items: center;
`;

const Container = styled.div`
  width: 100%;
  padding: 32px 50px;
  display: flex;
  flex-flow: column;
  align-items: center;
`;

const LogoContainer = styled.div`
  display: flex;
  gap: 16px;
`;

const ShortColumn = styled(AutoColumn)`
  margin-top: 10px;
`;

const InfoText = styled.p`
  padding: 0 12px 0 12px;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
`;

const StyledCancelButton = styled.button`
  margin-top: 16px;
  color: ${({ theme }) => theme.textSecondary};
  font-weight: 600;
  font-size: 14px;
`;

const StyledCloseButton = styled(Button)`
  &:hover {
    transition: opacity 250ms ease;
  }
`;

const Buttons = ({
  warning,
  onContinue,
  onCancel,
  onBlocked,
  showCancel,
}: {
  warning: Warning;
  onContinue: () => void;
  onCancel: () => void;
  onBlocked?: () => void;
  showCancel?: boolean;
}) => {
  return warning.canProceed ? (
    <>
      <Button onClick={onContinue}>I understand</Button>
      {showCancel && (
        <StyledCancelButton onClick={onCancel}>Cancel</StyledCancelButton>
      )}
    </>
  ) : (
    <StyledCloseButton onClick={onBlocked ?? onCancel}>Close</StyledCloseButton>
  );
};

const SafetyLabel = ({ warning }: { warning: Warning }) => {
  return (
    <TokenSafetyLabel level={warning.level} canProceed={warning.canProceed}>
      {warning.message}
    </TokenSafetyLabel>
  );
};

// TODO: Replace color with stylesheet color
const LinkColumn = styled(AutoColumn)`
  width: 100%;
  margin-top: 16px;
  position: relative;
`;

const ExplorerContainer = styled.div`
  width: 100%;
  height: 32px;
  margin-top: 10px;
  font-size: 20px;
  background-color: ${({ theme }) => theme.accentActionSoft};
  color: ${({ theme }) => theme.accentAction};
  border-radius: 8px;
  padding: 2px 12px;
  display: flex;
  align-items: center;
  overflow: hidden;
`;

const ExplorerLinkWrapper = styled.div`
  display: flex;
  overflow: hidden;
  align-items: center;
  cursor: pointer;
`;

const ExplorerLink = styled.div`
  display: block;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const ExplorerLinkIcon = styled(LinkIconFeather)`
  height: 16px;
  width: 18px;
  margin-left: 8px;
`;

const LinkIconWrapper = styled.div`
  justify-content: center;
  display: flex;
`;

function ExternalLinkIcon() {
  return (
    <LinkIconWrapper>
      <ExplorerLinkIcon />
    </LinkIconWrapper>
  );
}

function ExplorerView({ token }: { token: Token }) {
  if (token) {
    const explorerLink = getExplorerLink(
      token?.chainId,
      token?.address,
      'token'
    );
    return (
      <ExplorerContainer>
        <ExplorerLinkWrapper
          onClick={() => window.open(explorerLink, '_blank')}
        >
          <ExplorerLink>{explorerLink}</ExplorerLink>
          <ExternalLinkIcon />
        </ExplorerLinkWrapper>
        {/* <CopyLinkIcon toCopy={explorerLink} /> */}
      </ExplorerContainer>
    );
  } else {
    return null;
  }
}

export interface TokenSafetyProps {
  tokenAddress: string | null;
  secondTokenAddress?: string;
  onContinue: () => void;
  onCancel: () => void;
  onBlocked?: () => void;
  showCancel?: boolean;
}

export function TokenSafety({
  tokenAddress,
  secondTokenAddress,
  onContinue,
  onCancel,
  onBlocked,
  showCancel,
}: TokenSafetyProps) {
  const logos: any[] = [];
  const urls = [];

  const token1Warning = tokenAddress ? checkWarning(tokenAddress) : null;
  const token1 = useToken(tokenAddress);
  const token2Warning = secondTokenAddress
    ? checkWarning(secondTokenAddress)
    : null;
  const token2 = useToken(secondTokenAddress);

  const token1Unsupported = !token1Warning?.canProceed;
  const token2Unsupported = !token2Warning?.canProceed;

  // Logic for only showing the 'unsupported' warning if one is supported and other isn't
  if (
    token1 &&
    token1Warning &&
    (token1Unsupported || !(token2Warning && token2Unsupported))
  ) {
    // logos.push(<CurrencyLogo currency={token1} size="48px" />);
    urls.push(<ExplorerView token={token1} />);
  }
  if (
    token2 &&
    token2Warning &&
    (token2Unsupported || !(token1Warning && token1Unsupported))
  ) {
    // logos.push(<CurrencyLogo currency={token2} size="48px" />);
    urls.push(<ExplorerView token={token2} />);
  }

  const plural = logos.length > 1;
  // Show higher level warning if two are present
  let displayWarning = token1Warning;
  if (
    !token1Warning ||
    (token2Warning && token2Unsupported && !token1Unsupported)
  ) {
    displayWarning = token2Warning;
  }

  // If a warning is acknowledged, import these tokens
  const addToken = useAddUserToken();
  const acknowledge = () => {
    if (token1) {
      addToken(token1);
    }
    if (token2) {
      addToken(token2);
    }
    onContinue();
  };

  const { heading, description } = getWarningCopy(displayWarning, plural);

  return (
    displayWarning && (
      <Wrapper>
        <Container>
          <AutoColumn>
            <LogoContainer>{logos}</LogoContainer>
          </AutoColumn>
          <ShortColumn>
            <SafetyLabel warning={displayWarning} />
          </ShortColumn>
          <ShortColumn>
            <InfoText>
              {heading} {description}
            </InfoText>
          </ShortColumn>
          <LinkColumn>{urls}</LinkColumn>
          <Buttons
            warning={displayWarning}
            onContinue={acknowledge}
            onCancel={onCancel}
            onBlocked={onBlocked}
            showCancel={showCancel}
          />
        </Container>
      </Wrapper>
    )
  );
}