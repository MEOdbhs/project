(() => {
    const STORAGE_KEY = 'shared-theme-mode';
    const THEMES = {
        dark: 'dark',
        light: 'light'
    };

    function normalizeTheme(value) {
        return value === THEMES.light ? THEMES.light : THEMES.dark;
    }

    function getTheme() {
        return normalizeTheme(localStorage.getItem(STORAGE_KEY));
    }

    function setTheme(theme) {
        const next = normalizeTheme(theme);
        document.documentElement.dataset.theme = next;
        localStorage.setItem(STORAGE_KEY, next);
        syncToggles(next);
    }

    function toggleTheme() {
        const current = normalizeTheme(document.documentElement.dataset.theme || getTheme());
        setTheme(current === THEMES.light ? THEMES.dark : THEMES.light);
    }

    function syncToggles(theme) {
        const toggles = document.querySelectorAll('.js-toggle-mode');
        const isLight = theme === THEMES.light;
        toggles.forEach((btn) => {
            btn.textContent = isLight ? 'NIGHT' : 'DAY';
            btn.setAttribute('aria-pressed', String(isLight));
        });
    }

    setTheme(getTheme());

    document.addEventListener('click', (e) => {
        const toggle = e.target.closest('.js-toggle-mode');
        if (!toggle) return;
        e.preventDefault();
        toggleTheme();
    });

    document.addEventListener('DOMContentLoaded', () => {
        syncToggles(normalizeTheme(document.documentElement.dataset.theme));
    });
})();
