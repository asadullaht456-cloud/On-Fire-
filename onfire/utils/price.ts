import { Dish, Customization } from '../types';

export const calcUnitPrice = (dish: Dish, customization: Customization): number => {
  let total = dish.price;
  
  // Add-ons
  customization.addOnIds.forEach(addonId => {
    const addon = dish.addOns.find(a => a.id === addonId);
    if (addon) total += addon.price;
  });

  // Option Groups
  Object.keys(customization.options).forEach(groupId => {
    const group = dish.optionGroups.find(g => g.id === groupId);
    if (group) {
      const choiceId = customization.options[groupId];
      const choice = group.choices.find(c => c.id === choiceId);
      if (choice) total += choice.price;
    }
  });

  return total;
};

export const formatRs = (amount: number): string => {
  return `Rs. ${amount.toLocaleString('en-IN')}`;
};
