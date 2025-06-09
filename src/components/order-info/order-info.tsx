import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { selectAllIngredients } from '../../features/ingredients/ingredientsSelectors';
import { useSelector } from '../../services/store';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();

  const ingredients = useSelector((state) => selectAllIngredients(state));
  const userOrders = useSelector((state) => state.userOrders.orders);
  const feedOrders = useSelector((state) => state.feed.orders);

  const orderData = useMemo(() => {
    if (!number) return null;
    let order = userOrders.find(
      (order: TOrder) => order.number.toString() === number
    );

    if (!order) {
      order = feedOrders.find(
        (order: TOrder) => order.number.toString() === number
      );
    }

    return order || null;
  }, [userOrders, feedOrders, number]);

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
