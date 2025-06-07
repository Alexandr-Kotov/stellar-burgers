import { FC } from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/services/store';
import { FeedInfoUI } from '../ui/feed-info';

const selectOrders = (state: RootState) => state.feed.orders;
const selectTotal = (state: RootState) => state.feed.total;
const selectTotalToday = (state: RootState) => state.feed.totalToday;

const selectReadyOrders = createSelector([selectOrders], (orders) =>
  orders
    .filter((item) => item.status === 'done')
    .map((item) => item.number)
    .slice(0, 20)
);

const selectPendingOrders = createSelector([selectOrders], (orders) =>
  orders
    .filter((item) => item.status === 'pending')
    .map((item) => item.number)
    .slice(0, 20)
);

const selectFeedInfo = createSelector(
  [selectTotal, selectTotalToday],
  (total, totalToday) => ({ total, totalToday })
);

export const FeedInfo: FC = () => {
  const readyOrders = useSelector(selectReadyOrders);
  const pendingOrders = useSelector(selectPendingOrders);
  const feed = useSelector(selectFeedInfo);

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
