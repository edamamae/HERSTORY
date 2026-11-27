/* =====================================
   SAFE STORAGE HELPERS
===================================== */

function safeGetStorage(key) {
    try {
        return window.localStorage.getItem(key);
    } catch (error) {
        return null;
    }
}

function safeSetStorage(key, value) {
    try {
        window.localStorage.setItem(key, value);
    } catch (error) {
        // Ignore storage errors in restricted browsing contexts
    }
}


/* =====================================
   NIGHT MODE TOGGLE (TOP LEFT, ALL PAGES)
===================================== */

(function () {

    const STORAGE_KEY = "herstory_night_mode";

    function updateButtonLabel(btn, isNight) {
        if (!btn) return;
        btn.innerHTML = isNight
            ? '<span class="night-icon" aria-hidden="true">&#9728;</span><span class="night-label">Day Mode</span>'
            : '<span class="night-icon" aria-hidden="true">&#9790;</span><span class="night-label">Night Mode</span>';
        btn.setAttribute("aria-pressed", String(isNight));
        btn.setAttribute(
            "title",
            isNight ? "Switch to Day Mode" : "Switch to Night Mode"
        );
    }

    function applyNightMode(isNight) {
        document.documentElement.classList.toggle("night-mode", isNight);
        if (document.body) {
            document.body.classList.toggle("night-mode", isNight);
        }

        const toggleBtn =
            document.getElementById("nightModeToggle") ||
            document.getElementById("nightToggleBtn");
        updateButtonLabel(toggleBtn, isNight);
    }

    applyNightMode(safeGetStorage(STORAGE_KEY) === "true");

    function mountToggleButton() {
        const isNight = safeGetStorage(STORAGE_KEY) === "true";
        applyNightMode(isNight);

        const existingBtn =
            document.getElementById("nightModeToggle") ||
            document.getElementById("nightToggleBtn");

        if (existingBtn) {
            updateButtonLabel(existingBtn, isNight);
            return;
        }

        const headerEl = document.querySelector("header");
        const targetParent = headerEl || document.querySelector(".navbar") || document.body;

        if (targetParent) {
            const toggleBtn = document.createElement("button");
            toggleBtn.type = "button";
            toggleBtn.id = "nightModeToggle";
            toggleBtn.className = "night-toggle-btn";
            updateButtonLabel(toggleBtn, document.documentElement.classList.contains("night-mode"));

            toggleBtn.addEventListener("click", function () {
                const nextState = !document.documentElement.classList.contains("night-mode");
                safeSetStorage(STORAGE_KEY, String(nextState));
                applyNightMode(nextState);
            });

            targetParent.prepend(toggleBtn);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", mountToggleButton);
    } else {
        mountToggleButton();
    }

})();


/* =====================================
   SCROLL PROGRESS INDICATOR
===================================== */

(function () {

    function updateScrollProgress() {
        const scrollProgress = document.getElementById("scroll-progress");
        if (!scrollProgress) return;

        const scrollTop =
            window.scrollY ||
            window.pageYOffset ||
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            0;

        const scrollContainerHeight = Math.max(
            document.documentElement.scrollHeight,
            document.body ? document.body.scrollHeight : 0
        );

        const documentHeight = scrollContainerHeight - window.innerHeight;
        const progress = documentHeight > 0
            ? Math.min(100, Math.max(0, (scrollTop / documentHeight) * 100))
            : 0;

        scrollProgress.style.width = progress + "%";
    }

    function initScrollProgress() {
        updateScrollProgress();
        window.addEventListener("scroll", updateScrollProgress, { passive: true });
        window.addEventListener("resize", updateScrollProgress);
        window.addEventListener("load", updateScrollProgress);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initScrollProgress);
    } else {
        initScrollProgress();
    }

})();


/* =====================================
   FLOWER SNOW EFFECT
===================================== */

(function () {

    function initPetals() {
        const petalContainer = document.querySelector(".petal-container");
        if (!petalContainer || petalContainer.children.length > 0) return;

        const totalPetals = 30;
        const symbols = ["❀", "✿", "❁"];

        for (let i = 0; i < totalPetals; i++) {
            const petal = document.createElement("span");

            petal.className = "petal";
            petal.textContent = symbols[i % symbols.length];

            petal.style.left = Math.random() * 100 + "%";
            petal.style.fontSize = (9 + Math.random() * 13) + "px";
            petal.style.animationDuration = (7 + Math.random() * 9) + "s";
            petal.style.animationDelay = (Math.random() * 12) + "s";
            petal.style.setProperty("--drift", (Math.random() * 160 - 80) + "px");
            petal.style.opacity = String(0.3 + Math.random() * 0.5);

            petalContainer.appendChild(petal);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initPetals);
    } else {
        initPetals();
    }

})();