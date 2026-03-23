import { AppData, InventoryItem } from './types';

export const Inventory = {
  add(data: AppData, item: InventoryItem) {
    data.inventory.push(item);
  },

  removeById(data: AppData, id: string) {
    const index = data.inventory.findIndex((i) => i.id === id);
    if (index !== -1) {
      return data.inventory.splice(index, 1)[0];
    }
  },

  updateById(data: AppData, id: string, newItem: Partial<InventoryItem>) {
    const item = data.inventory.find((i) => i.id === id);
    if (!item) return;

    Object.assign(item, newItem);
  },
};
