import { AppData, ShoppingItem } from './types';

export const Shopping = {
  add(data: AppData, item: ShoppingItem) {
    data.shopping.push(item);
  },

  removeById(data: AppData, id: string) {
    const index = data.shopping.findIndex((i) => i.id === id);
    if (index !== -1) {
      data.shopping.splice(index, 1);
    }
  },

  updateById(data: AppData, id: string, newItem: Partial<ShoppingItem>) {
    const item = data.shopping.find((i) => i.id === id);
    if (!item) return;

    Object.assign(item, newItem);
  },
};
