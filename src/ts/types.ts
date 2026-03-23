export type InventoryItem = {
  id: string;
  name: string;
  group?: string;
  expiry?: string;
};

export type ShoppingItem = {
  id: string;
  name: string;
};

export type AppData = {
  inventory: InventoryItem[];
  shopping: ShoppingItem[];
};
