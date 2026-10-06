import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// ============================================================
// Real backend clients
// ============================================================
// The gateway service in docker-compose has no configured routes (it's an
// empty Spring Boot skeleton), so the frontend talks to each Spring Boot
// microservice directly on its own port instead of through a single origin.
// auth-service is deployed with server.servlet.context-path=/auth, so its
// real routes are under /auth/api/auth/* rather than /api/auth/*.
const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8081/auth/api';
const PROJECT_BASE_URL = process.env.NEXT_PUBLIC_PROJECT_API_URL || 'http://localhost:8082/api';
const NOTIFICATION_BASE_URL = process.env.NEXT_PUBLIC_NOTIFICATION_API_URL || 'http://localhost:8083/api';

export const DEFAULT_TENANT_ID = process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID || '1';

interface RetryableConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

// Access tokens expire after 15 minutes (see JwtTokenProvider). A single
// shared in-flight refresh promise means concurrent 401/403s from multiple
// requests only trigger one /auth/refresh call, not one per request.
let refreshPromise: Promise<string | null> | null = null;

function clearSession() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('tenant_id');
    localStorage.removeItem('current_user');
}

async function refreshAccessToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return null;

    if (!refreshPromise) {
        refreshPromise = axios
            .post(`${AUTH_BASE_URL}/auth/refresh`, { refreshToken })
            .then((res) => {
                localStorage.setItem('auth_token', res.data.accessToken);
                localStorage.setItem('refresh_token', res.data.refreshToken);
                return res.data.accessToken as string;
            })
            .catch(() => null)
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
}

function createClient(baseURL: string): AxiosInstance {
    const client = axios.create({
        baseURL,
        timeout: 15_000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Attach the bearer token + tenant header to every request.
    client.interceptors.request.use((config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('auth_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            const tenantId = localStorage.getItem('tenant_id') || DEFAULT_TENANT_ID;
            config.headers['X-Tenant-ID'] = tenantId;
        }
        return config;
    });

    // On a 401/403 (expired or invalid JWT — project-service returns 403
    // for both "not authenticated" and "wrong role", since it has no
    // custom AuthenticationEntryPoint), try refreshing the access token
    // once and retrying the original request before giving up.
    client.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const config = error.config as RetryableConfig | undefined;
            const status = error.response?.status;

            if ((status === 401 || status === 403) && config && !config._retry && typeof window !== 'undefined') {
                config._retry = true;
                const newToken = await refreshAccessToken();
                if (newToken) {
                    config.headers = config.headers ?? {};
                    config.headers.Authorization = `Bearer ${newToken}`;
                    return client(config);
                }

                clearSession();
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }

            return Promise.reject(error);
        },
    );

    return client;
}

export const authClient = createClient(AUTH_BASE_URL);
export const projectClient = createClient(PROJECT_BASE_URL);
export const notificationClient = createClient(NOTIFICATION_BASE_URL);

// Kept for anything that still imports the old default export.
export default projectClient;
