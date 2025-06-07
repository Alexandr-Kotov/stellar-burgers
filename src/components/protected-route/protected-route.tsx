import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AppDispatch, RootState } from '../../services/store';
import { fetchUser } from '../../features/profileSlice/profileSlice';

interface ProtectedRouteProps {
  children: React.ReactElement;
  authOnly?: boolean;
  guestOnly?: boolean;
}

export const ProtectedRoute = ({
  children,
  authOnly,
  guestOnly
}: ProtectedRouteProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, status } = useSelector((state: RootState) => state.profile);
  const location = useLocation();

  useEffect(() => {
    if (
      !user &&
      document.cookie.includes('accessToken=') &&
      status === 'idle'
    ) {
      dispatch(fetchUser());
    }
  }, [user, status, dispatch]);

  if (authOnly && !user && status !== 'loading') {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (guestOnly && user) {
    return <Navigate to='/' replace />;
  }

  return children;
};
