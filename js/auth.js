// auth.js
const TOKEN_KEY = 'shri_manibhadra_token';
const USER_KEY = 'shri_manibhadra_user';

const Auth = {
    getToken: () => localStorage.getItem(TOKEN_KEY),
    
    getUser: () => {
        const userStr = localStorage.getItem(USER_KEY);
        try {
            return userStr ? JSON.parse(userStr) : null;
        } catch (e) {
            return null;
        }
    },
    
    saveAuth: (token, user) => {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    
    clearAuth: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },
    
    parseJwt: (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    },
    
    isAuthenticated: () => {
        const token = Auth.getToken();
        if (!token) return false;
        
        const payload = Auth.parseJwt(token);
        if (!payload) return false;
        
        // Check expiry (payload.exp is in seconds)
        if (payload.exp && payload.exp * 1000 < Date.now()) {
            Auth.clearAuth();
            return false;
        }
        
        return true;
    },
    
    authFetch: async (url, options = {}) => {
        const token = Auth.getToken();
        if (!token) {
            window.location.href = '/login.html';
            return;
        }
        
        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };
        if (!(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }
        
        const response = await fetch(url, { ...options, headers });
        
        if (response.status === 401 || response.status === 403) {
            Auth.clearAuth();
            window.location.href = '/login.html';
        }
        
        return response;
    },
    
    handleLogout: () => {
        Auth.clearAuth();
        window.location.href = '/login.html';
    }
};

// Login Page Logic
if (window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('login')) {
    if (Auth.isAuthenticated()) {
        window.location.href = '/admin.html';
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        const loginForm = document.getElementById('login-form');
        const errorDiv = document.getElementById('login-error');
        const toggleBtn = document.getElementById('toggle-password');
        const passwordInput = document.getElementById('password');
        
        if (toggleBtn && passwordInput) {
            toggleBtn.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                toggleBtn.innerHTML = type === 'password' ? '<i data-lucide="eye"></i>' : '<i data-lucide="eye-off"></i>';
                lucide.createIcons();
            });
        }
        
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                errorDiv.style.display = 'none';
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const btn = loginForm.querySelector('button');
                const originalText = btn.textContent;
                btn.textContent = 'Signing in...';
                btn.disabled = true;
                
                try {
                    const response = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                        Auth.saveAuth(data.token, data.user);
                        window.location.href = '/admin.html';
                    } else {
                        errorDiv.textContent = data.message || 'Login failed';
                        errorDiv.style.display = 'block';
                    }
                } catch (error) {
                    errorDiv.textContent = 'Server error. Please try again later.';
                    errorDiv.style.display = 'block';
                } finally {
                    btn.textContent = originalText;
                    btn.disabled = false;
                }
            });
        }
    });
} 
// Admin Page Logic (Auth Check)
else if (window.location.pathname.endsWith('admin.html') || window.location.pathname.endsWith('admin')) {
    if (!Auth.isAuthenticated()) {
        window.location.href = '/login.html';
    }
}
