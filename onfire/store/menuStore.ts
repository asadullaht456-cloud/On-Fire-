import { create } from 'zustand';
import { Dish, Category, DietTag } from '../types';
import menuData from '../data/menu.json';

interface MenuState {
  dishes: Dish[];
  categories: Category[];
  searchQuery: string;
  selectedCategory: Category | 'All';
  selectedTags: DietTag[];
  setSearch: (q: string) => void;
  setCategory: (c: Category | 'All') => void;
  toggleTag: (t: DietTag) => void;
  getDishById: (id: string) => Dish | undefined;
  getFilteredDishes: () => Dish[];
  getStockLeft: (dishId: string) => number | undefined;
  decrementStock: (dishId: string, qty: number) => void;
  restoreStock: (dishId: string, qty: number) => void;
}

export const useMenuStore = create<MenuState>((set, get) => ({
  dishes: menuData as Dish[],
  categories: ['Starters', 'Mains', 'Desserts', 'Drinks'],
  searchQuery: '',
  selectedCategory: 'All',
  selectedTags: [],

  setSearch: (q) => set({ searchQuery: q }),
  setCategory: (c) => set({ selectedCategory: c }),
  
  toggleTag: (t) => set((state) => {
    const isSelected = state.selectedTags.includes(t);
    return {
      selectedTags: isSelected 
        ? state.selectedTags.filter(tag => tag !== t)
        : [...state.selectedTags, t]
    };
  }),

  getDishById: (id) => get().dishes.find(d => d.id === id),

  getFilteredDishes: () => {
    const { dishes, searchQuery, selectedCategory, selectedTags } = get();
    return dishes.filter(dish => {
      const matchSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dish.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'All' || dish.category === selectedCategory;
      const matchTags = selectedTags.length === 0 || selectedTags.every(tag => dish.tags.includes(tag));
      return matchSearch && matchCat && matchTags;
    });
  },

  getStockLeft: (dishId) => {
    const dish = get().dishes.find(d => d.id === dishId);
    return dish?.stock;
  },

  decrementStock: (dishId, qty) => set((state) => ({
    dishes: state.dishes.map(dish => 
      dish.id === dishId && dish.stock !== undefined
        ? { ...dish, stock: Math.max(0, dish.stock - qty) }
        : dish
    )
  })),

  restoreStock: (dishId, qty) => set((state) => ({
    dishes: state.dishes.map(dish => 
      dish.id === dishId && dish.stock !== undefined
        ? { ...dish, stock: dish.stock + qty }
        : dish
    )
  })),
}));
