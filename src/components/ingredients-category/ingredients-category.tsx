import { forwardRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { TIngredientsCategoryProps } from './type';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { RootState } from 'src/services/store';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const bun = useSelector(
    (state: RootState) => state.constructorBurger.items.bun
  );
  const selectedIngredients = useSelector(
    (state: RootState) => state.constructorBurger.items.ingredients
  );

  const ingredientsCounters = useMemo(() => {
    const counters: { [key: string]: number } = {};

    selectedIngredients.forEach((ingredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });

    if (bun) counters[bun._id] = 2;

    return counters;
  }, [bun, selectedIngredients]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
