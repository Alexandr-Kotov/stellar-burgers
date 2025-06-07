import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'src/services/store';

import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();

  const { buns, mains, sauces, isLoading } = useSelector(
    (state: RootState) => state.ingredients
  );

  const allIngredients = [...buns, ...mains, ...sauces];
  const ingredientData = allIngredients.find((item) => item._id === id);

  if (isLoading || !ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
