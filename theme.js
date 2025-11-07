// theme.js — centralizes theme toggle and loads header/footer partials
(function(){
    async function loadPartial(containerSelector, url){
        try{
            const res = await fetch(url, {cache: 'no-store'});
            if(!res.ok) throw new Error('Fetch failed');
            const html = await res.text();
            const container = document.querySelector(containerSelector);
            if(container) container.innerHTML = html;
        }catch(e){
            // fail silently — keep original markup (or empty)
            console.warn('Could not load partial', url, e);
        }
    }

    function initTheme(btn){
        const key = 'ce-theme';
        const root = document.documentElement;

        function setDark(on){
            if(on){
                root.classList.add('dark');
                if(btn) { btn.textContent = '☀️ Light'; btn.setAttribute('aria-pressed','true'); }
            } else {
                root.classList.remove('dark');
                if(btn) { btn.textContent = '🌙 Dark'; btn.setAttribute('aria-pressed','false'); }
            }
            try{ localStorage.setItem(key, on ? 'dark' : 'light'); }catch(e){}
        }

        try{
            const stored = localStorage.getItem(key);
            if(stored === 'dark') setDark(true);
            else if(stored === 'light') setDark(false);
            else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) setDark(true);
            else setDark(false);
        }catch(e){ setDark(false); }

        if(btn){
            btn.addEventListener('click', function(){
                const isDark = document.documentElement.classList.toggle('dark');
                setDark(isDark);
            });
        }
    }

    async function init(){
        // load header and footer partials if placeholders present
        await loadPartial('#site-header','partials/header.html');
        await loadPartial('#site-footer','partials/footer.html');

        // set year in footer
        const yearEl = document.getElementById('year');
        if(yearEl) yearEl.textContent = new Date().getFullYear();

        // theme toggle button may be part of header partial
        const btn = document.getElementById('theme-toggle');
        initTheme(btn);
    }

    // initialize on DOM ready
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

})();
