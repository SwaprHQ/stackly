import { getERC20Interface } from 'dca-sdk';
import { BigNumber, utils } from 'ethers';
import { useContractRead } from 'wagmi';
import { numberFormatter } from '../../utils';

import { SelectBalanceButton } from './styled';

const { formatUnits } = utils;

export function SelectBalanceButtonContainer({
  tokenAddress,
  tokenDecimals,
  userAddress,
  onBalanceSelect,
}: {
  tokenAddress: string;
  tokenDecimals: number;
  userAddress: string;
  onBalanceSelect: (balance: BigNumber) => void;
}) {
  const { data: userTokenBalance, isLoading: isUserSellTokenBalanceLoading } =
    useContractRead<readonly utils.Fragment[], 'balanceOf', BigNumber>({
      abi: getERC20Interface().fragments,
      address: tokenAddress,
      functionName: 'balanceOf',
      args: [userAddress],
    });

  if (isUserSellTokenBalanceLoading || userTokenBalance === undefined) {
    return (
      <SelectBalanceButton type="button" disabled alignRight>
        Loading ...
      </SelectBalanceButton>
    );
  }

  return (
    <SelectBalanceButton
      type="button"
      alignRight
      onClick={() => onBalanceSelect(userTokenBalance)}
    >
      Balance:{' '}
      {numberFormatter.format(
        parseFloat(formatUnits(userTokenBalance, tokenDecimals))
      )}
    </SelectBalanceButton>
  );
}
