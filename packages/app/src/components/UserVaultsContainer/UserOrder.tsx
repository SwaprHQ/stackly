import { useEffect, useMemo, useState } from 'react';
import { formatUnits } from '@ethersproject/units';
import { ChainId } from 'dca-sdk';
import styled from 'styled-components';
import { useNetwork } from 'wagmi';
import { ChevronDown } from 'react-feather';
import dayjs from 'dayjs';
import dayjsRelativeTimePlugin from 'dayjs/plugin/relativeTime';
import { SubgraphOrder } from './types';
import { getExplorerLink } from '../../utils';
import { calculateAveragePrice, getCOWOrders } from './AveragePrice';
import { formatHours } from './utils';

dayjs.extend(dayjsRelativeTimePlugin);

export function UserOrder({ order }: { order: SubgraphOrder }) {
  const { chain } = useNetwork();
  const [fundsUsed, setFundsUsed] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [averagePrice, setAveragePrice] = useState(0);
  const [totalBuyAmount, setTotalBuyAmount] = useState(0);
  const [cowOrders, setCOWOrders] = useState<Awaited<ReturnType<typeof getCOWOrders>>>([]);

  const handleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  useEffect(() => {
    getCOWOrders(
      order.id, // order.id is the contract address
      chain?.id as ChainId
    ).then((cowOrders) => {
      // Funds used
      const nextFundsUsed = cowOrders.reduce((acc, cowOrder) => {
        return acc + parseFloat(formatUnits(cowOrder.executedSellAmount, order.sellToken.decimals));
      }, 0);
      const nextAveragePrice = calculateAveragePrice(order, cowOrders);
      const nextTotalBuyAmount = cowOrders.reduce((acc, cowOrder) => {
        return acc + parseFloat(formatUnits(cowOrder.executedBuyAmount, order.buyToken.decimals));
      }, 0);
      setCOWOrders(cowOrders);
      setFundsUsed(nextFundsUsed);
      setAveragePrice(nextAveragePrice);
      setTotalBuyAmount(nextTotalBuyAmount);
    });
  }, [chain, order]);

  // Use dayjs to format the date in relative time
  // If the start date is in the future, show the relative time
  const [startAtLabel, startAtFormatted] = useMemo(() => {
    const startAt = dayjs.utc(order.startTime * 1000);

    return startAt.isAfter(dayjs.utc())
      ? ['Starts in', startAt.fromNow()]
      : ['Started', startAt.format('MMM D, YYYY HH:mm')];
  }, [order]);

  const [endAtLabel, endAtFormatted] = useMemo(() => {
    const endAt = dayjs.utc(order.endTime * 1000);

    return endAt.isAfter(dayjs.utc()) ? ['Ends in', endAt.fromNow(true)] : ['Ended', endAt.format('MMM D, YYYY HH:mm')];
  }, [order]);

  return (
    <OrderContainerWrapper>
      <div>
        <OrderHighlights>
          <OrderTitle href={getExplorerLink(chain?.id || 1, order.id, 'address')} target="_blank" rel="noreferrer">
            <h2>{order.id.slice(2, 8)}</h2>
          </OrderTitle>
          <div>
            {fundsUsed.toFixed(2)} / {parseFloat(formatUnits(order.principal, order.sellToken.decimals)).toFixed(2)}{' '}
            {order.sellToken.symbol}
          </div>
          <div>
            {averagePrice.toFixed(2)} {order.buyToken.symbol} / {order.sellToken.symbol}
          </div>
          <TotalBuyAmount>
            {totalBuyAmount.toFixed(2)} {order.buyToken.symbol}
          </TotalBuyAmount>
        </OrderHighlights>
        {showDetails && (
          <OrderDetails>
            <OrderInfo>
              <span>{startAtLabel}</span>
              <span>{startAtFormatted}</span>
            </OrderInfo>
            <OrderInfo>
              <span>{endAtLabel}</span>
              <span>{endAtFormatted}</span>
            </OrderInfo>
            <OrderInfo>
              <span>Progress</span>
              <span>
                {cowOrders.length}/{order.orderSlots.length} Orders
              </span>
            </OrderInfo>
            <OrderInfo>
              <span>Period</span>
              <span>Every {formatHours(order.interval)}</span>
            </OrderInfo>
          </OrderDetails>
        )}
      </div>
      <ToggleShowDetailsButton onClick={handleShowDetails} />
    </OrderContainerWrapper>
  );
}

const ToggleShowDetailsButton = styled(ChevronDown)`
  position: absolute;
  right: 32px;
  top: 32px;
  cursor: pointer;
  margin: auto;
`;

const OrderContainerWrapper = styled.div`
  margin-bottom: 16px;
  background: #ece4d5;
  border-radius: 22px;
  padding: 32px;
  position: relative;
  > div {
    margin-right: 44px;
  }
`;

const OrderDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0px;
  @media (min-width: 768px) {
    flex-direction: row;
  }
  margin-top: 24px;
`;

const OrderHighlights = styled(OrderDetails)`
  flex-direction: column;
  align-items: center;
  margin-top: 0px;
  @media (min-width: 768px) {
    flex-direction: row;
  }
  font-size: 14px;
  font-weight: 700;
`;

const OrderTitle = styled.a`
  font-weight: 700;
  text-transform: uppercase;
  text-decoration: none;
  color: #000;
  &:hover {
    text-decoration: underline;
  }
  &,
  & > * {
    font-size: 24px;
  }
`;

const TotalBuyAmount = styled.div`
  font-size: 24px;
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 4px;
  > span {
    font-size: 14px;
    color: #31322de5;
  }
  > span:last-child {
    font-weight: 700;
  }
`;
