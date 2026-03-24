import { Storage } from './storage';
import { Inventory } from './inventory';
import { Shopping } from './shopping';
import { ModalUI, UI } from './ui';
import { NotificationService } from './notification';
import { getNotifyItems } from './expiry';

export const App = {
  data: Storage.load(),

  init() {
    this.bindEvents();
    // this.checkAllExpiry();
    this.render();
  },

  bindEvents() {
    const addInventoryBtn = document.getElementById('addInventoryBtn')!;
    const inventoryNameInput = document.getElementById('inventoryName') as HTMLInputElement;
    const inventoryGroupInput = document.getElementById('inventoryGroup') as HTMLInputElement;
    const inventoryExpiryInput = document.getElementById('inventoryExpiry') as HTMLInputElement;
    const inventoryQuantityInput = document.getElementById('inventoryQuantity') as HTMLInputElement;

    const addShoppingBtn = document.getElementById('addShoppingBtn')!;
    const shoppingNameInput = document.getElementById('shoppingName') as HTMLInputElement;
    const shoppingQuantityInput = document.getElementById('shoppingQuantity') as HTMLInputElement;

    const inventoryTab = document.getElementById('inventoryTab')!;
    const shoppingTab = document.getElementById('shoppingTab')!;
    const inventoryView = document.getElementById('inventoryView')!;
    const shoppingView = document.getElementById('shoppingView')!;

    // 在庫追加
    addInventoryBtn.onclick = () => {
      if (!inventoryNameInput.value.trim()) return;

      Inventory.add(this.data, {
        id: createId(),
        name: inventoryNameInput.value.trim(),
        group: inventoryGroupInput.value.trim(),
        expiry: inventoryExpiryInput.value,
        quantity: inventoryQuantityInput.value.trim(),
      });

      this.save();

      inventoryNameInput.value = '';
      inventoryExpiryInput.value = '';
      inventoryQuantityInput.value = '';
      inventoryNameInput.focus();
    };

    // 買い物追加
    addShoppingBtn.onclick = () => {
      if (!shoppingNameInput.value.trim()) return;

      Shopping.add(this.data, {
        id: createId(),
        name: shoppingNameInput.value.trim(),
        quantity: shoppingQuantityInput.value.trim(),
      });

      this.save();

      shoppingNameInput.value = '';
      shoppingQuantityInput.value = '';
      shoppingNameInput.focus();
    };

    // タブ切り替え
    const toggleTab = (isInventory: boolean) => {
      inventoryView.classList.toggle('d-none', !isInventory);
      shoppingView.classList.toggle('d-none', isInventory);

      inventoryTab.classList.toggle('active', isInventory);
      shoppingTab.classList.toggle('active', !isInventory);
    };

    inventoryTab.onclick = () => toggleTab(true);
    shoppingTab.onclick = () => toggleTab(false);
  },

  // 使用処理
  async useItem(id: string) {
    const item = Inventory.removeById(this.data, id);
    if (!item) return;

    const addToShopping = await ModalUI.confirmAddToShopping(item.name);

    if (addToShopping) {
      Shopping.add(this.data, {
        id: createId(),
        name: item.name,
        quantity: '1',
      });
    }

    this.save();
  },

  // 買い物削除
  removeShopping(id: string) {
    Shopping.removeById(this.data, id);
    this.save();
  },

  // 在庫編集
  async editInventory(id: string) {
    const item = this.data.inventory.find((i) => i.id === id);
    if (!item) return;

    const result = await ModalUI.openInventoryEdit(item);
    if (!result) return;

    Inventory.updateById(this.data, id, {
      name: result.name.trim(),
      group: result.group.trim(),
      expiry: result.expiry || undefined,
      quantity: result.quantity.trim(),
    });

    this.save();
  },

  // 買い物編集
  async editShopping(id: string) {
    const item = this.data.shopping.find((i) => i.id === id);
    if (!item) return;

    const result = await ModalUI.openShoppingEdit(item);
    if (!result) return;

    Shopping.updateById(this.data, id, {
      name: result.name.trim(),
      quantity: result.quantity.trim(),
    });

    this.save();
  },

  // 期限チェック
  checkAllExpiry() {
    const notifyItems = getNotifyItems(this.data.inventory);

    notifyItems.forEach((item) => {
      NotificationService.notify(item.title, item.body);
    });
  },

  save() {
    Storage.save(this.data);
    this.render();
  },

  render() {
    UI.renderInventory(this.data);
    UI.renderShopping(this.data);
  },
};

function createId(): string {
  return crypto.randomUUID();
}
