export function parseJwt(token) {
  try {
    const base64 = token.split('.')[1];
    if (!base64) return null;
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  const payload = parseJwt(token);
  if (!payload?.exp) return false;
  return Date.now() >= payload.exp * 1000;
}

export function userFromToken(token) {
  const payload = parseJwt(token);
  if (!payload?.id) return null;
  return {
    id: payload.id,
    email: payload.email,
    role: payload.role,
  };
}

export function clearStoredAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpiresIn');
  localStorage.removeItem('user');
}

export function persistAuth(token, user) {
  localStorage.setItem('token', token);
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
}

export function readCachedUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function buildInitialAuthState() {
  const token = localStorage.getItem('token');

  if (!token || isTokenExpired(token)) {
    if (token) clearStoredAuth();
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      authInitialized: false,
      sessionLoading: false,
      loading: false,
      error: null,
    };
  }

  const user = userFromToken(token) || readCachedUser();

  return {
    user,
    token,
    isAuthenticated: true,
    authInitialized: false,
    sessionLoading: true,
    loading: false,
    error: null,
  };
}

export { buildInitialAuthState };
