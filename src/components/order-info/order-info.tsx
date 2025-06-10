import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { selectAllIngredients } from '../../features/ingredients/ingredientsSelectors';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrderByNumber } from '../../features/userOrdersSlice/userOrdersSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();

  const ingredients = useSelector((state) => selectAllIngredients(state));
  const userOrders = useSelector((state) => state.userOrders.orders);
  const feedOrders = useSelector((state) => state.feed.orders);
  const currentOrder = useSelector((state) => state.userOrders.currentOrder);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!number) return;

    const isOrderExists =
      userOrders.some((order) => order.number.toString() === number) ||
      feedOrders.some((order) => order.number.toString() === number);

    if (!isOrderExists) {
      dispatch(fetchUserOrderByNumber(Number(number)));
    }
  }, [dispatch, number, userOrders, feedOrders]);

  const orderData = useMemo(() => {
    if (!number) return null;

    return (
      userOrders.find((order) => order.number.toString() === number) ||
      feedOrders.find((order) => order.number.toString() === number) ||
      currentOrder ||
      null
    );
  }, [userOrders, feedOrders, currentOrder, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || ingredients.length === 0) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, id) => {
        if (!acc[id]) {
          const ingredient = ingredients.find((ing) => ing._id === id);
          if (ingredient) {
            acc[id] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[id].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
