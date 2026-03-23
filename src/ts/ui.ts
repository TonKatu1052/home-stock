import { AppData } from './types';
import { App } from './app';
import { getExpiryClass } from './expiry';

declare const bootstrap: any;

// 汎用モーダル
function openModal(
  title: string,
  fields: {
    label: string;
    value: string;
    id: string;
  }[]
): Promise<Record<string, string> | null> {
  return new Promise((resolve) => {
    const modalEl = document.getElementById('editModal')!;
    const titleEl = document.getElementById('modalTitle')!;
    const bodyEl = document.getElementById('modalBody')!;
    const saveBtn = document.getElementById('modalSave')!;

    titleEl.textContent = title;
    bodyEl.innerHTML = '';

    fields.forEach((f) => {
      const div = document.createElement('div');
      div.className = 'mb-3';

      div.innerHTML = `
        <label class="form-label">${f.label}</label>
        <input class="form-control" id="${f.id}" value="${f.value}">
      `;
      bodyEl.appendChild(div);
    });

    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    const handler = () => {
      const result: Record<string, string> = {};

      fields.forEach((f) => {
        const input = document.getElementById(f.id) as HTMLInputElement;
        result[f.id] = input.value;
      });

      cleanup();
      modal.hide();
      resolve(result);
    };

    const cancelHandler = () => {
      cleanup();
      resolve(null);
    };

    function cleanup() {
      saveBtn.removeEventListener('click', handler);
      modalEl.removeEventListener('hidden.bs.modal', cancelHandler);
    }

    saveBtn.addEventListener('click', handler);
    modalEl.addEventListener('hidden.bs.modal', cancelHandler);
  });
}

// 汎用確認モーダル
function confirmModal(title: string, message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const modalEl = document.getElementById('editModal')!;
    const titleEl = document.getElementById('modalTitle')!;
    const bodyEl = document.getElementById('modalBody')!;
    const saveBtn = document.getElementById('modalSave')!;

    titleEl.textContent = title;
    bodyEl.innerHTML = `<p>${message}</p>`;

    saveBtn.textContent = 'はい';
    const cancelBtn = modalEl.querySelector('.btn-secondary') as HTMLButtonElement;

    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    const handler = () => {
      cleanup();
      modal.hide();
      resolve(true);
    };

    const cancelHandler = () => {
      cleanup();
      modal.hide();
      resolve(false);
    };

    function cleanup() {
      saveBtn.removeEventListener('click', handler);
      cancelBtn.removeEventListener('click', cancelHandler);
    }

    saveBtn.addEventListener('click', handler);
    cancelBtn.addEventListener('click', cancelHandler);
  });
}

export const ModalUI = {
  openInventoryEdit(item: any) {
    return openModal('在庫編集', [
      {
        label: '商品名',
        value: item.name,
        id: 'name',
      },
      {
        label: 'グループ',
        value: item.group || '',
        id: 'group',
      },
      {
        label: '期限',
        value: item.expiry || '',
        id: 'expiry',
      },
    ]);
  },

  openShoppingEdit(item: any) {
    return openModal('買い物編集', [
      {
        label: '商品名',
        value: item.name,
        id: 'name',
      },
    ]);
  },

  confirmAddToShopping(itemName: string) {
    return confirmModal('買い物リスト追加確認', `${itemName} を買い物リストに追加しますか？`);
  },
};

export const UI = {
  renderInventory(data: AppData) {
    const list = document.getElementById('inventoryList')!;
    list.innerHTML = '';

    const sorted = [...data.inventory].sort((a, b) => {
      if (!a.expiry && !b.expiry) return 0;
      if (!a.expiry) return 1;
      if (!b.expiry) return -1;

      return new Date(a.expiry).getTime() - new Date(b.expiry).getTime();
    });

    sorted.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';

      const wrapper = document.createElement('div');
      wrapper.className = 'd-flex flex-column';

      const nameEl = document.createElement('span');
      nameEl.className = 'fw-semibold';
      nameEl.textContent = item.name;

      const meta = document.createElement('div');
      meta.className = 'small text-muted';

      const groupSpan = document.createElement('span');
      groupSpan.textContent = item.group || '未分類';

      const expirySpan = document.createElement('span');
      expirySpan.className = getExpiryClass(item.expiry);
      expirySpan.textContent = item.expiry || '期限なし';

      meta.appendChild(groupSpan);
      meta.appendChild(document.createTextNode(' / '));
      meta.appendChild(expirySpan);

      wrapper.appendChild(nameEl);
      wrapper.appendChild(meta);

      // ボタン群
      const btnGroup = document.createElement('div');

      const editBtn = document.createElement('button');
      editBtn.textContent = '編集';
      editBtn.className = 'btn btn-sm btn-secondary me-2';
      editBtn.onclick = () => App.editInventory(item.id);

      const useBtn = document.createElement('button');
      useBtn.textContent = '使用';
      useBtn.className = 'btn btn-sm btn-success';
      useBtn.onclick = () => App.useItem(item.id);

      btnGroup.appendChild(editBtn);
      btnGroup.appendChild(useBtn);

      li.appendChild(wrapper);
      li.appendChild(btnGroup);
      list.appendChild(li);
    });
  },

  renderShopping(data: AppData) {
    const list = document.getElementById('shoppingList')!;
    list.innerHTML = '';

    data.shopping.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';

      const nameEl = document.createElement('span');
      nameEl.className = 'fw-semibold';
      nameEl.textContent = item.name;

      const btnGroup = document.createElement('div');

      const editBtn = document.createElement('button');
      editBtn.textContent = '編集';
      editBtn.className = 'btn btn-sm btn-secondary me-2';
      editBtn.onclick = () => App.editShopping(item.id);

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '削除';
      deleteBtn.className = 'btn btn-sm btn-danger';
      deleteBtn.onclick = () => App.removeShopping(item.id);

      btnGroup.appendChild(editBtn);
      btnGroup.appendChild(deleteBtn);

      li.appendChild(nameEl);
      li.appendChild(btnGroup);
      list.appendChild(li);
    });
  },
};
