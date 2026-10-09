import { calcUnitPrice, formatRs } from './price';
import { Dish, Customization } from '../types';

describe('Price Utils', () => {
  const mockDish: Dish = {
    id: 'D1',
    name: 'Burger',
    category: 'Mains',
    description: '',
    price: 650,
    image: '',
    prepTimeMin: 15,
    available: true,
    tags: [],
    addOns: [
      { id: 'A1', name: 'Cheese', price: 80 }
    ],
    optionGroups: [
      {
        id: 'G1',
        name: 'Spice',
        choices: [
          { id: 'C1', name: 'Mild', price: 0 },
          { id: 'C2', name: 'Extra', price: 50 }
        ]
      }
    ]
  };

  it('calculates base price correctly', () => {
    const custom: Customization = { addOnIds: [], options: {} };
    expect(calcUnitPrice(mockDish, custom)).toBe(650);
  });

  it('calculates price with addons', () => {
    const custom: Customization = { addOnIds: ['A1'], options: {} };
    expect(calcUnitPrice(mockDish, custom)).toBe(730);
  });

  it('calculates price with options', () => {
    const custom: Customization = { addOnIds: [], options: { 'G1': 'C2' } };
    expect(calcUnitPrice(mockDish, custom)).toBe(700);
  });

  it('calculates price with both addons and options', () => {
    const custom: Customization = { addOnIds: ['A1'], options: { 'G1': 'C2' } };
    expect(calcUnitPrice(mockDish, custom)).toBe(780);
  });

  it('formats Rs correctly', () => {
    expect(formatRs(1460)).toBe('Rs. 1,460');
  });
});
