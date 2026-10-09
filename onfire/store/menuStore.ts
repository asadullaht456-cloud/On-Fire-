import { create } from 'zustand';
import { Dish, Category, DietTag } from '../types';
import menuData from '../data/menu.json';

interface MenuState {
  dishes: Dish[];
  categories: Category[];
  selectedTags: DietTag[];
  showAvailableOnly: boolean;
  sortBy: 'none' | 'price_asc' | 'price_desc' | 'prep_time';
  priceRange: { min: number, max: number };
  setSearch: (q: string) => void;
  setCategory: (c: Category | 'All') => void;
  toggleTag: (t: DietTag) => void;
  setShowAvailableOnly: (val: boolean) => void;
  setSortBy: (val: 'none' | 'price_asc' | 'price_desc' | 'prep_time') => void;
  setPriceRange: (min: number, max: number) => void;
  clearFilters: () => void;
  getDishById: (id: string) => Dish | undefined;
  getFilteredDishes: () => Dish[];
  getStockLeft: (dishId: string) => number | undefined;
  decrementStock: (dishId: string, qty: number) => void;
  restoreStock: (dishId: string, qty: number) => void;
}

export const useMenuStore = create<MenuState>()((set, get) => ({
  dishes: menuData as Dish[],
  categories: ['Starters', 'Mains', 'Desserts', 'Drinks'],
  searchQuery: '',
  selectedTags: [],
  showAvailableOnly: false,
  sortBy: 'none',
  priceRange: { min: 0, max: 5000 },

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

  setShowAvailableOnly: (val) => set({ showAvailableOnly: val }),
  setSortBy: (val) => set({ sortBy: val }),
  setPriceRange: (min, max) => set({ priceRange: { min, max } }),
  
  clearFilters: () => set({ 
    selectedTags: [], 
    showAvailableOnly: false, 
    sortBy: 'none',
    priceRange: { min: 0, max: 5000 }
  }),

  getDishById: (id) => get().dishes.find(d => d.id === id),

  getFilteredDishes: () => {
    const { dishes, searchQuery, selectedCategory, selectedTags, showAvailableOnly, sortBy, priceRange } = get();
    
    let filtered = dishes.filter(dish => {
      const matchSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dish.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'All' || dish.category === selectedCategory;
      const matchTags = selectedTags.length === 0 || selectedTags.every(tag => dish.tags.includes(tag));
      const matchAvail = !showAvailableOnly || dish.available;
      const matchPrice = dish.price >= priceRange.min && dish.price <= priceRange.max;
      
      return matchSearch && matchCat && matchTags && matchAvail && matchPrice;
    });
    
    if (sortBy === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'prep_time') {
      filtered.sort((a, b) => a.prepTimeMin - b.prepTimeMin);
    }
    
    return filtered;
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
