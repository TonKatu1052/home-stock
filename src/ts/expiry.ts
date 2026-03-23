export type ExpiryStatus = 'expired' | 'expiring' | 'safe';

// 期限ステータス判定（コアロジック）
export function checkExpiry(expiry?: string): ExpiryStatus {
  if (!expiry) return 'safe';

  const diff = (new Date(expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24);

  if (diff < 0) return 'expired';
  if (diff <= 2) return 'expiring';
  return 'safe';
}

// UI用クラス取得
export function getExpiryClass(expiry?: string): string {
  const status = checkExpiry(expiry);

  if (status === 'expired') return 'text-danger';
  if (status === 'expiring') return 'text-warning';

  return '';
}

// 通知対象かどうか
export function isNotifyTarget(status: ExpiryStatus): boolean {
  return status === 'expired' || status === 'expiring';
}

// 通知メッセージ生成
export function getExpiryMessage(
  status: ExpiryStatus,
  name: string
): {
  title: string;
  body: string;
} | null {
  if (status === 'expiring') {
    return {
      title: '期限が近い',
      body: name,
    };
  }

  if (status === 'expired') {
    return {
      title: '期限切れ',
      body: name,
    };
  }

  return null;
}

// 通知対象一覧取得（まとめて使う用）
export function getNotifyItems(
  items: {
    name: string;
    expiry?: string;
  }[]
) {
  return items
    .map((item) => {
      const status = checkExpiry(item.expiry);
      const message = getExpiryMessage(status, item.name);

      if (!message) return null;

      return {
        ...item,
        status,
        ...message,
      };
    })
    .filter((v) => v !== null) as {
    name: string;
    expiry?: string;
    status: ExpiryStatus;
    title: string;
    body: string;
  }[];
}
