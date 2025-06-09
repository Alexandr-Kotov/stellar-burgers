import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  closeOrderModal,
  placeOrder
} from '../../features/orderSlice/orderSlice';
import { fetchFeeds } from '../../features/feedSlice/feedSlice';
import { fetchUserOrders } from '../../features/userOrdersSlice/userOrdersSlice';
import { resetConstructor } from '../../features/constructor/constructorSlice';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector(
    (state) => state.constructorBurger.items
  );
  const orderRequest = useSelector((state) => state.order.orderRequest);
  const orderModalData = useSelector((state) => state.order.orderModalData);
  const user = useSelector((state) => state.profile.user);

  const onOrderClick = async () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    try {
      await dispatch(placeOrder(ingredientsIds)).unwrap();
      dispatch(fetchFeeds());
      dispatch(fetchUserOrders());
      dispatch(resetConstructor());
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
    }
  };

  const closeModal = () => {
    dispatch(closeOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeModal}
    />
  );
};
