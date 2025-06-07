import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../services/store';
import {
  closeOrderModal,
  placeOrder
} from '../../features/orderSlice/orderSlice';
import { fetchFeeds } from '../../features/feedSlice/feedSlice';
import { fetchUserOrders } from '../../features/userOrdersSlice/userOrdersSlice';
import { resetConstructor } from '../../features/constructor/constructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const constructorItems = useSelector(
    (state: RootState) => state.constructorBurger.items
  );
  const orderRequest = useSelector(
    (state: RootState) => state.order.orderRequest
  );
  const orderModalData = useSelector(
    (state: RootState) => state.order.orderModalData
  );

  const onOrderClick = async () => {
    if (!constructorItems.bun || orderRequest) return;

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
