
const API_URL = (
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
).replace(/\/$/, '');

export function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(options.headers);

  const telegram = window.Telegram?.WebApp as (typeof window.Telegram.WebApp & {
  initData?: string;
}) | undefined;
  const initData = telegram?.initData;

  console.log('[API AUTH]', {
    telegramExists: Boolean(telegram),
    initDataExists: Boolean(initData),
    initDataLength: initData?.length ?? 0,
    request: path,
  });

  if (initData) {
    headers.set('X-Telegram-Init-Data', initData);
  }

  return fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
}

export default API_URL;
