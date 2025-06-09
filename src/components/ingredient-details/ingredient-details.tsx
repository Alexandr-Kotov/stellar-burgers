import { FC } from 'react';
import { useParams } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();

  const { buns, mains, sauces, isLoading } = useSelector(
    (state) => state.ingredients
  );

  const allIngredients = [...buns, ...mains, ...sauces];
  const ingredientData = allIngredients.find((item) => item._id === id);

  if (isLoading || !ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
