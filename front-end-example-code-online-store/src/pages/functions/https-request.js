export const apiBaseUrl = (import.meta.env.VITE_HTTPBASE || '').replace(/\/+$/, '');

function isPublicEndpoint(url) {
  const pathname = new URL(url, window.location.origin).pathname;
  return /\/(login|register|token)$/.test(pathname);
}

export async function httpFetch(method, url, payload, token) {
  const publicEndpoint = isPublicEndpoint(url);
  const sessionToken = token || (!publicEndpoint ? window.sessionStorage.getItem('token') : null);
  const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData;
  const headers = {};
  const options = { method, headers };

  if (sessionToken) {
    headers.Authorization = `Bearer ${sessionToken}`;
  }
  if (payload !== undefined && payload !== null) {
    if (isFormData) {
      options.body = payload;
    } else {
      headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(payload);
    }
  }

  try {
    const response = await fetch(url, options);
    const responseText = await response.text();
    let data = {};
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { msg: responseText };
      }
    }

    if (response.status === 401 && sessionToken && !publicEndpoint) {
      window.sessionStorage.removeItem('token');
      window.sessionStorage.removeItem('dados');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/token') {
        window.location.assign('/login');
      }
    }

    if (Array.isArray(data)) {
      data.status = response.status;
      return data;
    }

    return {
      ...data,
      status: response.status,
      msg: data.msg || data.error || (response.ok ? '' : `A solicitação falhou (${response.status}).`),
    };
  } catch {
    return {
      status: 0,
      msg: 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
    };
  }
}
