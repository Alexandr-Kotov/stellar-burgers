import { FC } from 'react';
import { useSelector } from 'react-redux';
import { AppHeaderUI } from '@ui';
import { RootState } from '../../services/store';

export const AppHeader: FC = () => {
  const user = useSelector((state: RootState) => state.profile.user);
  const userName = user?.name || '';

  return <AppHeaderUI userName={userName} />;
};
