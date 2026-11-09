const APP_BASE_URL = new URL("../", import.meta.url);
const APP_BASE_PATH = APP_BASE_URL.pathname.replace(/\/$/, "");
const DATA_URL = new URL("data/site-data.json", APP_BASE_URL).href;
const STORAGE_KEYS = {
  cart: "tea-demo-cart-v1",
  theme: "tea-demo-theme-v1"
};

const STOCK_RANK = {
  "in-stock": 0,
  "low-stock": 1,
  expected: 2,
  "out-of-stock": 3
};

const ICONS = {
  cart: '<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 8h13l-2 8H8.2L7 8Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M4 5h2.2L7 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="9" cy="20" r="1.4" fill="currentColor"/><circle cx="17" cy="20" r="1.4" fill="currentColor"/></svg>',
  cup: '<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 9h11v4a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5V9Z" stroke="currentColor" stroke-width="1.8"/><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M8 5c-.8-1 .2-2 .8-2.6M12 5c-.8-1 .2-2 .8-2.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  menu: '<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  search: '<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  moon: '<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 15.3A7.7 7.7 0 0 1 8.7 4a8.5 8.5 0 1 0 11.3 11.3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  sun: '<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M12 2v2.2M12 19.8V22M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2 12h2.2M19.8 12H22M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  arrow: '<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  plus: '<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  minus: '<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  trash: '<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 7h14M10 11v6M14 11v6M8 7l1 12h6l1-12M10 7V5h4v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  close: '<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  filter: '<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  star: '<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
  review: '<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 5h14v10H9l-4 4V5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8 9h8M8 12h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatPrice(value) {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(value));
}

function normalizeText(value) {
  return String(value ?? "").trim().toLowerCase();
}

function stripBasePath(pathname) {
  if (APP_BASE_PATH && (pathname === APP_BASE_PATH || pathname.startsWith(`${APP_BASE_PATH}/`))) {
    return pathname.slice(APP_BASE_PATH.length) || "/";
  }
  return pathname || "/";
}

function routePath(path = "/") {
  const value = String(path || "/");
  if (/^(?:https?:|mailto:|tel:|#)/.test(value)) return value;
  const [, pathname = "", suffix = ""] = value.match(/^([^?#]*)(.*)$/) ?? [];
  if (APP_BASE_PATH && (pathname === APP_BASE_PATH || pathname.startsWith(`${APP_BASE_PATH}/`))) {
    return value;
  }
  const normalized = pathname.replace(/^\/+/, "");
  return normalized ? `${APP_BASE_PATH}/${normalized}${suffix}` : `${APP_BASE_PATH || ""}/${suffix}`;
}

function rootPath(path) {
  if (!path) return "";
  if (/^(?:https?:|data:|blob:)/.test(path)) return path;
  return new URL(String(path).replace(/^\/+/, ""), APP_BASE_URL).href;
}

function getPackKey(pack) {
  return String(pack.label ?? pack.weight);
}

function getPackLabel(pack) {
  return pack.label ?? `${pack.weight} г`;
}

function formatRating(value) {
  if (!value) return "0";
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded).replace(".", ",");
}

function reviewWord(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "отзыв";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "отзыва";
  return "отзывов";
}

function starWord(count) {
  if (count === 1) return "звезда";
  if (count >= 2 && count <= 4) return "звезды";
  return "звезд";
}


function itemMatchesStock(product, filter) {
  if (!filter || filter === "all") return true;
  if (filter === "available") {
    return ["in-stock", "low-stock"].includes(product.availability.status);
  }
  if (filter === "expected") return product.availability.status === "expected";
  if (filter === "out") return product.availability.status === "out-of-stock";
  return true;
}

class TeaApp extends HTMLElement {
  constructor() {
    super();
    this.data = null;
    this.dataError = null;
    this.cart = this.loadCart();
    this.theme = this.loadTheme();
    this.cartOpen = false;
    this.mobileMenuOpen = false;
    this.filtersOpen = false;
    this.toast = "";
    this.tempReviews = new Map();
    this.expandedDescriptions = new Set();
    this.filterTimer = null;
    this.swipeStart = null;
  }

  connectedCallback() {
    this.applyTheme();
    this.renderLoading();
    this.loadData();
    this.addEventListener("click", (event) => this.handleClick(event));
    this.addEventListener("submit", (event) => this.handleSubmit(event));
    this.addEventListener("input", (event) => this.handleInput(event));
    this.addEventListener("change", (event) => this.handleChange(event));
    this.addEventListener("error", (event) => this.handleImageError(event), true);
    this.addEventListener("pointerdown", (event) => this.handlePointerDown(event));
    this.addEventListener("pointerup", (event) => this.handlePointerUp(event));
    this.addEventListener("pointercancel", () => {
      this.swipeStart = null;
    });
    this.addEventListener("touchstart", (event) => this.handleTouchStart(event), { passive: true });
    this.addEventListener("touchend", (event) => this.handleTouchEnd(event), { passive: true });
    this.addEventListener("touchcancel", () => {
      this.swipeStart = null;
    });
    window.addEventListener("scroll", () => this.handleWindowScroll(), { passive: true });
    window.addEventListener("popstate", () => this.render());
  }

  async loadData() {
    try {
      const response = await fetch(DATA_URL);
      if (!response.ok) {
        throw new Error(`Не удалось загрузить каталог: ${response.status}`);
      }
      this.data = this.normalizeData(await response.json());
      this.dataError = null;
    } catch (error) {
      this.dataError = error;
    }
    this.render();
  }

  normalizeData(data) {
    return {
      ...data,
      brandList: Object.values(data.brands),
      categoryMap: new Map(data.categories.map((category) => [category.id, category])),
      effectMap: new Map(data.effects.map((effect) => [effect.id, effect])),
      productMap: new Map(data.products.map((product) => [product.id, product])),
      slugMap: new Map(data.products.map((product) => [product.slug, product])),
      glossaryMap: new Map(data.glossary.map((entry) => [entry.slug, entry]))
    };
  }

  loadCart() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEYS.cart) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  saveCart() {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(this.cart));
  }

  loadTheme() {
    const saved = localStorage.getItem(STORAGE_KEYS.theme);
    if (saved === "light" || saved === "dark") return saved;
    return "light";
  }

  setTheme(theme) {
    this.theme = theme;
    localStorage.setItem(STORAGE_KEYS.theme, theme);
    this.applyTheme();
    this.updateThemeButtons();
  }

  applyTheme() {
    document.documentElement.dataset.theme = this.theme;
  }

  parseRoute() {
    const pathname = stripBasePath(window.location.pathname).replace(/\/(?:index|404)\.html$/, "/");
    const parts = pathname.split("/").filter(Boolean);
    const brandIds = this.data ? Object.keys(this.data.brands) : ["shebang", "chaepitek"];

    if (parts.length === 0) {
      return { brandId: this.data?.meta.defaultBrand ?? "shebang", view: "chooser", slug: "" };
    }

    const brandId = brandIds.includes(parts[0]) ? parts[0] : this.data?.meta.defaultBrand ?? "shebang";
    const view = brandIds.includes(parts[0]) ? parts[1] || "home" : parts[0] || "home";
    const slug = brandIds.includes(parts[0]) ? parts[2] || "" : parts[1] || "";

    return { brandId, view, slug };
  }

  navigate(path, replace = false) {
    const target = routePath(path);
    if (replace) {
      window.history.replaceState({}, "", target);
    } else {
      window.history.pushState({}, "", target);
    }
    this.render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  handleClick(event) {
    const term = event.target.closest(".term");
    if (term && this.isTouchLike()) {
      event.preventDefault();
      this.dismissTransientUi();
      term.classList.add("is-tooltip-open");
      return;
    }
    if (!term) {
      this.dismissTransientUi();
    }

    const link = event.target.closest("a[data-link]");
    if (link) {
      const url = new URL(link.href);
      if (url.origin === window.location.origin) {
        event.preventDefault();
        this.cartOpen = false;
        this.mobileMenuOpen = false;
        this.filtersOpen = false;
        this.navigate(`${stripBasePath(url.pathname)}${url.search}${url.hash}`);
      }
      return;
    }

    const button = event.target.closest("[data-action]");
    if (!button) return;

    const action = button.dataset.action;
    if (action === "toggle-theme") {
      this.setTheme(this.theme === "dark" ? "light" : "dark");
      return;
    }
    if (action === "open-cart") {
      this.setCartOpen(true);
      return;
    }
    if (action === "close-cart") {
      this.setCartOpen(false);
      return;
    }
    if (action === "open-menu") {
      this.setMobileMenuOpen(true);
      return;
    }
    if (action === "close-menu") {
      this.setMobileMenuOpen(false);
      return;
    }
    if (action === "open-filters") {
      if (!this.isMobileLayout()) return;
      this.setFiltersOpen(true);
      return;
    }
    if (action === "close-filters") {
      this.setFiltersOpen(false);
      return;
    }
    if (action === "next-gallery-image") {
      this.advanceMobileGallery(button);
      return;
    }
    if (action === "add-to-cart") {
      this.addToCart(button.dataset.productId, button.dataset.packKey);
      return;
    }
    if (action === "increase") {
      this.changeCartQuantity(button.dataset.productId, button.dataset.packKey, 1);
      return;
    }
    if (action === "decrease") {
      this.changeCartQuantity(button.dataset.productId, button.dataset.packKey, -1);
      return;
    }
    if (action === "remove") {
      this.removeFromCart(button.dataset.productId, button.dataset.packKey);
      return;
    }
    if (action === "clear-cart") {
      this.clearCart();
      return;
    }
    if (action === "clear-filters") {
      const route = this.parseRoute();
      this.filtersOpen = false;
      this.navigate(`/${route.brandId}/catalog`, true);
      return;
    }
    if (action === "toggle-description") {
      const productId = button.dataset.productId;
      if (this.expandedDescriptions.has(productId)) {
        this.expandedDescriptions.delete(productId);
      } else {
        this.expandedDescriptions.add(productId);
      }
      this.render();
    }
  }

  handleInput(event) {
    if (!event.target.matches("[data-filter]")) return;
    clearTimeout(this.filterTimer);
    this.filterTimer = setTimeout(() => this.updateCatalogUrl(), 220);
  }

  handleSubmit(event) {
    const form = event.target.closest("[data-review-form]");
    if (!form) return;

    event.preventDefault();
    const productId = form.dataset.productId;
    const formData = new FormData(form);
    const author = String(formData.get("author") || "").trim() || "Гость";
    const text = String(formData.get("text") || "").trim();
    const rating = Math.min(5, Math.max(1, Number(formData.get("rating")) || 5));

    if (!text) {
      const error = form.querySelector("[data-review-error]");
      if (error) error.textContent = "Напишите пару слов о чае.";
      return;
    }

    const reviews = this.tempReviews.get(productId) ?? [];
    this.tempReviews.set(productId, [{
      id: `draft-${Date.now()}`,
      author,
      rating,
      date: new Date().toISOString().slice(0, 10),
      text
    }, ...reviews]);
    this.render();
    this.showToast("Отзыв добавлен в демке");
  }

  handleChange(event) {
    if (event.target.matches("[data-filter]")) {
      this.updateCatalogUrl({ closeFilters: this.filtersOpen && this.isMobileLayout() });
      return;
    }

    if (event.target.matches("[data-brand-select]")) {
      this.navigate(this.getBrandSwitchUrl(event.target.value, this.parseRoute()));
      return;
    }

    if (event.target.matches("[data-pack-select]")) {
      const productId = event.target.dataset.productId;
      const scope = event.target.closest(".product-card, .buy-panel") ?? this;
      const addButton = scope.querySelector(`[data-action="add-to-cart"][data-product-id="${CSS.escape(productId)}"]`);
      if (addButton) {
        addButton.dataset.packKey = event.target.value;
      }
      this.updateVisiblePrice(event.target);
    }
  }

  handleImageError(event) {
    const image = event.target;
    if (!image.matches?.("img[data-fallback]")) return;
    const fallback = image.dataset.fallback;
    if (fallback && image.src !== new URL(fallback, window.location.href).href) {
      image.src = fallback;
    }
  }

  handlePointerDown(event) {
    this.classList.remove("suppress-hover");

    if (event.pointerType === "mouse") {
      this.swipeStart = null;
      return;
    }

    this.startSwipe(event.target, event.clientX, event.clientY, event.pointerId);
  }

  handlePointerUp(event) {
    this.finishSwipe(event.clientX, event.clientY, event.pointerId);
  }

  handleTouchStart(event) {
    this.classList.remove("suppress-hover");
    const touch = event.touches[0];
    if (!touch) return;
    this.startSwipe(event.target, touch.clientX, touch.clientY, touch.identifier);
  }

  handleTouchEnd(event) {
    const touch = event.changedTouches[0];
    if (!touch) return;
    this.finishSwipe(touch.clientX, touch.clientY, touch.identifier);
  }

  startSwipe(target, x, y, pointerId) {
    const panel = target.closest?.(".cart-drawer, .mobile-menu, .filters-band");
    if (!panel) {
      this.swipeStart = null;
      return;
    }

    this.swipeStart = {
      pointerId,
      x,
      y,
      kind: panel.classList.contains("mobile-menu")
        ? "menu"
        : panel.classList.contains("filters-band")
          ? "filters"
          : "cart"
    };
  }

  finishSwipe(x, y, pointerId) {
    const start = this.swipeStart;
    this.swipeStart = null;
    if (!start || start.pointerId !== pointerId) return;

    const dx = x - start.x;
    const dy = y - start.y;
    const isHorizontalSwipe = Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.15;
    if (!isHorizontalSwipe) return;

    if (start.kind === "menu" && dx < 0) {
      this.setMobileMenuOpen(false);
    }
    if (start.kind === "filters" && dx > 0) {
      this.setFiltersOpen(false);
    }
    if (start.kind === "cart" && dx > 0) {
      this.setCartOpen(false);
    }
  }

  handleWindowScroll() {
    if (!this.isTouchLike()) return;
    this.dismissTransientUi({ blur: true });
    this.classList.add("suppress-hover");
  }

  dismissTransientUi({ blur = false } = {}) {
    this.querySelectorAll(".term.is-tooltip-open").forEach((item) => {
      item.classList.remove("is-tooltip-open");
    });

    if (blur && document.activeElement instanceof HTMLElement && this.contains(document.activeElement)) {
      document.activeElement.blur();
    }
  }

  updateCatalogUrl({ closeFilters = false } = {}) {
    const route = this.parseRoute();
    const params = new URLSearchParams();

    this.querySelectorAll("[data-filter]").forEach((field) => {
      const key = field.dataset.filter;
      const value = field.value.trim();
      if (!value || value === "all" || (key === "sort" && value === "stock")) return;
      params.set(key, value);
    });

    const query = params.toString();
    if (closeFilters) {
      this.filtersOpen = false;
    }
    this.navigate(`/${route.brandId}/catalog${query ? `?${query}` : ""}`, true);
  }

  addToCart(productId, packKey) {
    const product = this.data.productMap.get(productId);
    if (!product || !this.canBuy(product)) return;
    const pack = this.findPack(product, packKey) ?? product.packs[0];
    const key = getPackKey(pack);
    const existing = this.cart.find((item) => item.productId === productId && item.packKey === key);

    if (existing) {
      existing.quantity += 1;
    } else {
      this.cart.push({ productId, packKey: key, quantity: 1 });
    }

    this.saveCart();
    this.refreshCartUi();
    this.showToast(`${product.title} добавлен в корзину`);
  }

  changeCartQuantity(productId, packKey, delta) {
    const item = this.cart.find((cartItem) => cartItem.productId === productId && cartItem.packKey === packKey);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
      this.cart = this.cart.filter((cartItem) => cartItem !== item);
    }
    this.saveCart();
    this.refreshCartUi();
  }

  removeFromCart(productId, packKey) {
    this.cart = this.cart.filter((item) => !(item.productId === productId && item.packKey === packKey));
    this.saveCart();
    this.refreshCartUi();
  }

  clearCart() {
    if (!this.cart.length) return;
    this.cart = [];
    this.saveCart();
    this.refreshCartUi();
    this.showToast("Корзина очищена");
  }

  setCartOpen(open) {
    this.cartOpen = open;
    this.updateBodyLock();
    this.querySelector(".cart-backdrop")?.classList.toggle("is-open", open);
    this.querySelector(".cart-drawer")?.classList.toggle("is-open", open);
  }

  setMobileMenuOpen(open) {
    this.mobileMenuOpen = open;
    this.updateBodyLock();
    this.querySelector(".mobile-menu-backdrop")?.classList.toggle("is-open", open);
    this.querySelector(".mobile-menu")?.classList.toggle("is-open", open);
  }

  setFiltersOpen(open) {
    if (open && !this.isMobileLayout()) return;
    this.filtersOpen = open;
    this.updateBodyLock();
    this.querySelector(".filters-backdrop")?.classList.toggle("is-open", open);
    this.querySelector(".filters-band")?.classList.toggle("is-open", open);
  }

  updateBodyLock() {
    const locked = this.mobileMenuOpen || this.filtersOpen || (this.cartOpen && this.isMobileLayout());
    const scrollbarGap = locked ? Math.max(0, window.innerWidth - document.documentElement.clientWidth) : 0;
    document.body.style.setProperty("--scrollbar-gap", `${scrollbarGap}px`);
    document.body.classList.toggle("cart-locked", locked);
  }

  isMobileLayout() {
    return window.matchMedia?.("(max-width: 820px)").matches ?? false;
  }

  isTouchLike() {
    return window.matchMedia?.("(hover: none), (pointer: coarse)").matches ?? false;
  }

  updateThemeButtons() {
    const icon = this.theme === "dark" ? ICONS.sun : ICONS.moon;
    this.querySelectorAll("[data-theme-icon]").forEach((slot) => {
      slot.innerHTML = icon;
    });
    this.querySelectorAll("[data-theme-label]").forEach((slot) => {
      slot.textContent = this.theme === "dark" ? "Светлая тема" : "Темная тема";
    });
  }

  advanceMobileGallery(button) {
    const gallery = button.closest(".mobile-gallery");
    if (!gallery) return;
    const slides = [...gallery.querySelectorAll(".gallery-slide")];
    if (!slides.length) return;
    const current = Math.round(gallery.scrollLeft / gallery.clientWidth);
    const next = (current + 1) % slides.length;
    gallery.scrollTo({ left: next * gallery.clientWidth, behavior: "smooth" });
  }

  refreshCartUi() {
    if (!this.data) return;
    const route = this.parseRoute();
    const brandId = route.brandId ?? this.data.meta.defaultBrand;
    const details = this.getCartDetails();
    const cartItems = this.querySelector(".cart-items");
    const cartSummary = this.querySelector(".cart-summary");

    if (cartItems) {
      cartItems.innerHTML = this.renderCartItemsContent(brandId, details);
    }
    if (cartSummary) {
      cartSummary.innerHTML = this.renderCartSummaryContent(brandId, details);
    }
    this.updateCartCount(details.count);
  }

  updateVisiblePrice(select) {
    const product = this.data?.productMap.get(select.dataset.productId);
    if (!product) return;
    const pack = this.findPack(product, select.value);
    const card = select.closest(".product-card");
    if (pack && card) {
      const price = card.querySelector(".price");
      if (price) price.textContent = formatPrice(pack.price);
    }
  }

  updateCartCount(count) {
    const button = this.querySelector(".cart-button");
    if (!button) return;
    const existing = button.querySelector(".cart-count");
    if (!count) {
      existing?.remove();
      return;
    }
    if (existing) {
      existing.textContent = String(count);
      return;
    }
    button.insertAdjacentHTML("beforeend", `<span class="cart-count">${count}</span>`);
  }

  showToast(message) {
    let toast = this.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      toast.setAttribute("role", "status");
      this.querySelector(".app-shell")?.append(toast);
    }
    toast.textContent = message;
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => {
      toast.remove();
    }, 2600);
  }

  findPack(product, packKey) {
    return product.packs.find((pack) => getPackKey(pack) === String(packKey));
  }

  getCartDetails() {
    let total = 0;
    let teaWeight = 0;
    let count = 0;
    const items = [];

    for (const item of this.cart) {
      const product = this.data?.productMap.get(item.productId);
      if (!product) continue;
      const pack = this.findPack(product, item.packKey) ?? product.packs[0];
      const quantity = Math.max(1, Number(item.quantity) || 1);
      total += pack.price * quantity;
      count += quantity;
      if (product.kind === "tea") {
        teaWeight += Number(pack.weight) * quantity;
      }
      items.push({ product, pack, quantity });
    }

    return { items, total, teaWeight, count };
  }

  renderLoading() {
    this.innerHTML = `
      <main class="loading-state">
        <div class="state-box">
          ${this.renderLoader()}
          <h1>Завариваем демку</h1>
          <p>Подгружаем каталог, бренды и подсказки.</p>
        </div>
      </main>
    `;
  }

  render() {
    this.updateBodyLock();

    if (this.dataError) {
      this.innerHTML = this.renderError(this.dataError);
      return;
    }

    if (!this.data) {
      this.renderLoading();
      return;
    }

    const route = this.parseRoute();
    const brand = this.data.brands[route.brandId] ?? this.data.brands[this.data.meta.defaultBrand];

    if (route.view === "chooser") {
      document.title = "Демки чайного магазина";
      this.innerHTML = this.renderChooser();
      return;
    }

    document.title = `${brand.name} - ${this.getPageTitle(route)}`;
    this.innerHTML = `
      <div class="app-shell">
        ${this.renderHeader(brand, route)}
        <main class="main">
          ${this.renderRoute(brand, route)}
        </main>
        ${this.renderFooter(brand)}
        ${this.renderCart()}
        ${this.toast ? `<div class="toast" role="status">${escapeHtml(this.toast)}</div>` : ""}
      </div>
    `;
  }

  getPageTitle(route) {
    if (route.view === "catalog") return "Каталог";
    if (route.view === "product") {
      const product = this.data.slugMap.get(route.slug);
      return product?.title ?? "Товар";
    }
    if (route.view === "delivery") return "Доставка";
    if (route.view === "payment") return "Оплата";
    if (route.view === "contacts") return "Контакты";
    if (route.view === "about") return "О нас";
    if (route.view === "checkout") return "Оформление заказа";
    return "Главная";
  }

  href(path) {
    return routePath(path);
  }

  renderRoute(brand, route) {
    if (route.view === "home") return this.renderHome(brand);
    if (route.view === "catalog") return this.renderCatalog(brand);
    if (route.view === "product") return this.renderProductPage(brand, route.slug);
    if (["delivery", "payment", "contacts", "about"].includes(route.view)) return this.renderStaticPage(brand, route.view);
    if (route.view === "checkout") return this.renderCheckout(brand);
    return this.renderNotFound(brand);
  }

  renderChooser() {
    return `
      <div class="app-shell">
        <main class="main brand-chooser">
          <div class="container">
            <p class="eyebrow">Две демки на одном движке</p>
            <div class="page-title">
              <div>
                <h1>Выберите характер чайного магазина</h1>
                <p>Обе версии используют один каталог, корзину, фильтры и карточки. Отличаются тон, подача и брендовые акценты.</p>
              </div>
              <button class="icon-button" type="button" data-action="toggle-theme" aria-label="Переключить тему">
                <span data-theme-icon>${this.theme === "dark" ? ICONS.sun : ICONS.moon}</span>
              </button>
            </div>
            <div class="chooser-grid">
              ${this.data.brandList.map((brand) => `
                <a class="chooser-link" href="${this.href(`/${brand.id}`)}" data-link>
                  <span class="brand-mark">${this.renderLogo()}</span>
                  <h2>${escapeHtml(brand.name)}</h2>
                  <p>${escapeHtml(brand.tagline)}</p>
                </a>
              `).join("")}
            </div>
          </div>
        </main>
      </div>
    `;
  }

  renderHeader(brand, route) {
    const cartDetails = this.getCartDetails();
    const navItems = [
      ["catalog", "Каталог"],
      ["delivery", "Доставка"],
      ["payment", "Оплата"],
      ["contacts", "Контакты"],
      ["about", "О нас"]
    ];

    return `
      <header class="app-header">
        <div class="container header-inner">
          <a class="brand-link" href="${this.href(`/${brand.id}`)}" data-link aria-label="${escapeHtml(brand.name)}">
            <span class="brand-mark">${this.renderLogo()}</span>
            <span>
              <span class="brand-name">${escapeHtml(brand.name)}</span>
              <span class="brand-tagline">${escapeHtml(brand.tagline)}</span>
            </span>
          </a>
          <nav class="main-nav" aria-label="Основная навигация">
            ${navItems.map(([view, label]) => `
              <a class="nav-link ${route.view === view ? "is-active" : ""}" href="${this.href(`/${brand.id}/${view}`)}" data-link>${label}</a>
            `).join("")}
            <select class="brand-select" data-brand-select aria-label="Версия сайта">
              ${this.data.brandList.map((item) => `
                <option value="${item.id}" ${item.id === brand.id ? "selected" : ""}>${escapeHtml(item.name)}</option>
              `).join("")}
            </select>
          </nav>
          <div class="header-actions">
            <button class="icon-button theme-button" type="button" data-action="toggle-theme" aria-label="Переключить тему">
              <span data-theme-icon>${this.theme === "dark" ? ICONS.sun : ICONS.moon}</span>
            </button>
            <button class="text-button cart-button" type="button" data-action="open-cart">
              ${ICONS.cart}
              <span class="button-text">Корзина</span>
              ${cartDetails.count ? `<span class="cart-count">${cartDetails.count}</span>` : ""}
            </button>
            <button class="icon-button mobile-menu-button" type="button" data-action="open-menu" aria-label="Открыть меню">
              ${ICONS.menu}
            </button>
          </div>
        </div>
      </header>
      ${this.renderMobileMenu(brand, route, navItems)}
    `;
  }

  renderMobileMenu(brand, route, navItems) {
    return `
      <div class="mobile-menu-backdrop ${this.mobileMenuOpen ? "is-open" : ""}" data-action="close-menu"></div>
      <aside class="mobile-menu ${this.mobileMenuOpen ? "is-open" : ""}" aria-label="Меню">
        <div class="mobile-menu-head">
          <div class="mobile-menu-head-actions">
            <button class="icon-button" type="button" data-action="close-menu" aria-label="Закрыть меню">${ICONS.close}</button>
            <button class="icon-button" type="button" data-action="toggle-theme" aria-label="Переключить тему">
              <span data-theme-icon>${this.theme === "dark" ? ICONS.sun : ICONS.moon}</span>
            </button>
          </div>
          <strong>${escapeHtml(brand.name)}</strong>
        </div>
        <nav class="mobile-menu-links" aria-label="Мобильная навигация">
          ${navItems.map(([view, label]) => `
            <a class="nav-link ${route.view === view ? "is-active" : ""}" href="${this.href(`/${brand.id}/${view}`)}" data-link>${label}</a>
          `).join("")}
        </nav>
        <div class="mobile-menu-section">
          <span>Версия</span>
          <select class="brand-select" data-brand-select aria-label="Версия сайта">
            ${this.data.brandList.map((item) => `
              <option value="${item.id}" ${item.id === brand.id ? "selected" : ""}>${escapeHtml(item.name)}</option>
            `).join("")}
          </select>
        </div>
      </aside>
    `;
  }

  getBrandSwitchUrl(targetBrandId, route) {
    const suffix = route.view === "home" ? "" : `/${route.view}${route.slug ? `/${route.slug}` : ""}`;
    return `/${targetBrandId}${suffix}${window.location.search}`;
  }

  renderHome(brand) {
    const featured = this.getSortedProducts(this.data.products)
      .filter((product) => product.availability.status !== "out-of-stock")
      .slice(0, 4);

    return `
      <section class="hero">
        <div class="container hero-grid">
          <div>
            <p class="eyebrow">${escapeHtml(brand.tagline)}</p>
            <h1>${escapeHtml(brand.hero.title)}</h1>
            <p>${escapeHtml(brand.hero.text)}</p>
            <div class="hero-actions">
              <a class="primary-button" href="${this.href(`/${brand.id}/catalog`)}" data-link>
                ${ICONS.search}<span>${escapeHtml(brand.hero.cta)}</span>
              </a>
              <button class="ghost-button" type="button" data-action="open-cart">${ICONS.cart}<span>Открыть корзину</span></button>
            </div>
          </div>
          <div class="hero-showcase" aria-label="Ключевые возможности">
            <div class="showcase-tile"><strong>Сначала доступное</strong><span>Товары в наличии поднимаются выше ожидаемых и закончившихся.</span></div>
            <div class="showcase-tile"><strong>Без чайного экзамена</strong><span>Подсказки объясняют термины прямо рядом с выбором.</span></div>
            <div class="showcase-tile"><strong>Ночная тема</strong><span>Темная версия не заставляет щуриться при вечернем выборе.</span></div>
            <div class="showcase-tile"><strong>Корзина локально</strong><span>Добавление, количество и сумма работают без backend.</span></div>
          </div>
        </div>
      </section>
      <section class="section tight">
        <div class="container">
          <div class="category-strip" aria-label="Категории">
            ${this.data.categories.map((category) => `
              <a class="category-chip" href="${this.href(`/${brand.id}/catalog?category=${category.id}`)}" data-link>${escapeHtml(category.title)}</a>
            `).join("")}
          </div>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="page-title">
            <div>
              <h1>С чего начать</h1>
              <p>Несколько позиций, которые показывают основной сценарий: карточка, фасовка, подсказки и добавление в корзину.</p>
            </div>
            <a class="text-button" href="${this.href(`/${brand.id}/catalog`)}" data-link>Весь каталог ${ICONS.arrow}</a>
          </div>
          <div class="product-grid">
            ${featured.map((product) => this.renderProductCard(product, brand)).join("")}
          </div>
        </div>
      </section>
    `;
  }

  renderCatalog(brand) {
    const filters = this.getFilters();
    const products = this.getFilteredProducts(filters);
    const total = this.data.products.length;
    const allTags = this.getAllTasteTags();
    const activeFilterLabels = this.getActiveFilterLabels(filters);
    const hasActiveFilters = activeFilterLabels.length > 0;

    return `
      <section class="container">
        <div class="page-title">
          <div>
            <p class="eyebrow">${escapeHtml(brand.name)}</p>
            <h1>Каталог</h1>
            <p>Фильтры сохраняются в URL, поэтому ссылку на подборку можно отправить другому человеку.</p>
          </div>
        </div>
      </section>
      <div class="filters-backdrop ${this.filtersOpen ? "is-open" : ""}" data-action="close-filters"></div>
      <section class="filters-band">
        <div class="container filters-panel">
          <div class="filters-head">
            <strong>Фильтры</strong>
            <button class="icon-button" type="button" data-action="close-filters" aria-label="Закрыть фильтры">${ICONS.close}</button>
          </div>
          <div class="filters" role="search">
            <div class="field">
              <label for="filter-q">${ICONS.search} Поиск</label>
              <input id="filter-q" data-filter="q" type="search" value="${escapeHtml(filters.q)}" placeholder="Название чая">
            </div>
            <div class="field">
              <label for="filter-category">Тип</label>
              <select id="filter-category" data-filter="category">
                <option value="all">Все типы</option>
                ${this.data.categories.map((category) => `
                  <option value="${category.id}" ${filters.category === category.id ? "selected" : ""}>${escapeHtml(category.title)}</option>
                `).join("")}
              </select>
            </div>
            <div class="field">
              <label for="filter-effect">Эффект</label>
              <select id="filter-effect" data-filter="effect">
                <option value="all">Любой</option>
                ${this.data.effects.map((effect) => `
                  <option value="${effect.id}" ${filters.effect === effect.id ? "selected" : ""}>${escapeHtml(effect.title)}</option>
                `).join("")}
              </select>
            </div>
            <div class="field">
              <label for="filter-tag">Тег вкуса</label>
              <select id="filter-tag" data-filter="tag">
                <option value="all">Любой</option>
                ${allTags.map((tag) => `
                  <option value="${escapeHtml(tag)}" ${filters.tag === tag ? "selected" : ""}>${escapeHtml(tag)}</option>
                `).join("")}
              </select>
            </div>
            <div class="field">
              <label for="filter-stock">Наличие</label>
              <select id="filter-stock" data-filter="stock">
                <option value="all" ${filters.stock === "all" ? "selected" : ""}>Все</option>
                <option value="available" ${filters.stock === "available" ? "selected" : ""}>Можно купить</option>
                <option value="expected" ${filters.stock === "expected" ? "selected" : ""}>Ожидаем</option>
                <option value="out" ${filters.stock === "out" ? "selected" : ""}>Закончилось</option>
              </select>
            </div>
            <div class="field">
              <label>Цена</label>
              <div class="price-fields">
                <input data-filter="priceMin" type="number" min="0" step="10" inputmode="numeric" value="${escapeHtml(filters.priceMin)}" placeholder="от">
                <input data-filter="priceMax" type="number" min="0" step="10" inputmode="numeric" value="${escapeHtml(filters.priceMax)}" placeholder="до">
              </div>
            </div>
            <div class="field">
              <label for="filter-sort">${ICONS.filter} Сортировка</label>
              <select id="filter-sort" data-filter="sort">
                <option value="stock" ${filters.sort === "stock" ? "selected" : ""}>сначала в наличии</option>
                <option value="new" ${filters.sort === "new" ? "selected" : ""}>новинки</option>
                <option value="rating" ${filters.sort === "rating" ? "selected" : ""}>по рейтингу</option>
                <option value="price-asc" ${filters.sort === "price-asc" ? "selected" : ""}>сначала дешевле</option>
                <option value="price-desc" ${filters.sort === "price-desc" ? "selected" : ""}>сначала дороже</option>
              </select>
            </div>
          </div>
        </div>
      </section>
      <section class="section tight">
        <div class="container">
          <div class="catalog-meta">
            <div class="catalog-meta-main">
              <div class="catalog-meta-line">
                <span class="catalog-count">Показано ${products.length} из ${total}</span>
                ${hasActiveFilters ? `<button class="small-button" type="button" data-action="clear-filters">Сбросить</button>` : ""}
              </div>
              ${hasActiveFilters ? `
                <div class="active-filters" aria-label="Активные фильтры">
                  ${activeFilterLabels.map((label) => `<span>${escapeHtml(label)}</span>`).join("")}
                </div>
              ` : ""}
            </div>
            <button class="text-button filter-toggle" type="button" data-action="open-filters">${ICONS.filter}<span>Фильтры</span></button>
          </div>
          ${products.length ? `
            <div class="product-grid">
              ${products.map((product) => this.renderProductCard(product, brand)).join("")}
            </div>
          ` : this.renderEmptyCatalog()}
        </div>
      </section>
    `;
  }

  getFilters() {
    const params = new URLSearchParams(window.location.search);
    return {
      q: params.get("q") ?? "",
      category: params.get("category") ?? "all",
      effect: params.get("effect") ?? "all",
      stock: params.get("stock") ?? "all",
      priceMin: params.get("priceMin") ?? "",
      priceMax: params.get("priceMax") ?? "",
      tag: params.get("tag") ?? "all",
      sort: params.get("sort") ?? "stock"
    };
  }

  getActiveFilterLabels(filters) {
    const labels = [];
    const category = this.data.categoryMap.get(filters.category);
    const effect = this.data.effectMap.get(filters.effect);
    const stockLabels = {
      available: "Можно купить",
      expected: "Ожидаем",
      out: "Закончилось"
    };
    const sortLabels = {
      new: "Новинки",
      rating: "По рейтингу",
      "price-asc": "Сначала дешевле",
      "price-desc": "Сначала дороже"
    };

    if (filters.q) labels.push(`Поиск: ${filters.q}`);
    if (category) labels.push(category.title);
    if (effect) labels.push(effect.title);
    if (filters.tag !== "all") labels.push(`Тег: ${filters.tag}`);
    if (stockLabels[filters.stock]) labels.push(stockLabels[filters.stock]);
    if (filters.priceMin || filters.priceMax) {
      const from = filters.priceMin ? `от ${filters.priceMin}` : "";
      const to = filters.priceMax ? `до ${filters.priceMax}` : "";
      labels.push(`Цена ${[from, to].filter(Boolean).join(" ")}`);
    }
    if (sortLabels[filters.sort]) labels.push(sortLabels[filters.sort]);

    return labels;
  }

  getFilteredProducts(filters) {
    const q = normalizeText(filters.q);
    const min = Number(filters.priceMin) || 0;
    const max = Number(filters.priceMax) || Infinity;

    const filtered = this.data.products.filter((product) => {
      if (q && !normalizeText(product.title).includes(q)) return false;
      if (filters.category !== "all" && product.categoryId !== filters.category) return false;
      if (filters.effect !== "all" && !product.effects.includes(filters.effect)) return false;
      if (filters.tag !== "all" && !(product.tasteNotes ?? []).includes(filters.tag)) return false;
      if (!itemMatchesStock(product, filters.stock)) return false;
      if (product.basePrice < min || product.basePrice > max) return false;
      return true;
    });

    return this.getSortedProducts(filtered, filters.sort);
  }

  getAllTasteTags() {
    const tags = new Set();
    for (const product of this.data.products) {
      for (const tag of product.tasteNotes ?? []) {
        tags.add(tag);
      }
    }
    return [...tags].sort((a, b) => a.localeCompare(b, "ru"));
  }

  getSortedProducts(products, sort = "stock") {
    return [...products].sort((a, b) => {
      const stock = (STOCK_RANK[a.availability.status] ?? 9) - (STOCK_RANK[b.availability.status] ?? 9);
      if (sort === "rating") {
        const aStats = this.getReviewStats(a);
        const bStats = this.getReviewStats(b);
        return stock || bStats.average - aStats.average || bStats.count - aStats.count || new Date(b.addedAt) - new Date(a.addedAt);
      }
      if (sort === "price-asc") return stock || a.basePrice - b.basePrice;
      if (sort === "price-desc") return stock || b.basePrice - a.basePrice;
      if (sort === "new") return stock || new Date(b.addedAt) - new Date(a.addedAt);
      return stock || new Date(b.addedAt) - new Date(a.addedAt);
    });
  }

  renderProductCard(product, brand) {
    const pack = product.packs[0];
    const category = this.data.categoryMap.get(product.categoryId);
    const disabled = !this.canBuy(product);

    return `
      <article class="product-card ${disabled ? "is-unavailable" : ""}">
        <a class="product-media" href="${this.href(`/${brand.id}/product/${product.slug}`)}" data-link aria-label="${escapeHtml(product.title)}">
          ${this.renderImage(product)}
          ${this.renderStatus(product)}
        </a>
        <div class="product-body">
          <div class="product-topline">
            <span class="product-type">${escapeHtml(category?.title ?? product.type)}</span>
            ${this.renderProductMetrics(product)}
          </div>
          <h2 class="product-title">
            <a href="${this.href(`/${brand.id}/product/${product.slug}`)}" data-link>${escapeHtml(product.title)}</a>
          </h2>
          <div class="taste-list">
            ${this.renderTasteTags(product, brand, 3)}
          </div>
        </div>
        <div class="product-footer">
          <div class="price-line">
            <span class="price">${formatPrice(pack.price)}</span>
          </div>
          <div class="card-actions">
            <select class="card-pack-select" data-pack-select data-product-id="${escapeHtml(product.id)}" aria-label="Фасовка ${escapeHtml(product.title)}">
              ${product.packs.map((item) => `
                <option value="${escapeHtml(getPackKey(item))}">${escapeHtml(getPackLabel(item))}</option>
              `).join("")}
            </select>
            <button
              class="primary-button"
              type="button"
              data-action="add-to-cart"
              data-product-id="${escapeHtml(product.id)}"
              data-pack-key="${escapeHtml(getPackKey(pack))}"
              ${disabled ? "disabled" : ""}
            >${ICONS.cart}<span>${disabled ? "Недоступно" : "В корзину"}</span></button>
          </div>
        </div>
      </article>
    `;
  }

  canBuy(product) {
    return ["in-stock", "low-stock"].includes(product.availability.status);
  }

  renderTasteTags(product, brand, limit = Infinity) {
    return (product.tasteNotes ?? []).slice(0, limit).map((note) => `
      <a class="tag" href="${this.href(`/${brand.id}/catalog?tag=${encodeURIComponent(note)}`)}" data-link title="Показать товары с тегом ${escapeHtml(note)}">${escapeHtml(note)}</a>
    `).join("");
  }

  renderProductPage(brand, slug) {
    const product = this.data.slugMap.get(slug);
    if (!product) return this.renderNotFound(brand);

    const category = this.data.categoryMap.get(product.categoryId);
    const description = this.getBrandText(product.description, brand.id);
    const note = this.getBrandText(product.brewing?.notes, brand.id);
    const expanded = this.expandedDescriptions.has(product.id);
    const related = this.getRelatedProducts(product).slice(0, 4);
    const firstPack = product.packs[0];
    const disabled = !this.canBuy(product);
    const galleryKeys = ["main", "leaf", "infusion", "pack"];
    const reviews = this.getReviews(product);

    return `
      <section class="container product-layout">
        <div class="product-gallery">
          <div class="desktop-gallery">
            <div class="main-photo">${this.renderImage(product)}</div>
            <div class="thumb-grid">
              ${galleryKeys.map((key) => this.renderThumb(product, key)).join("")}
            </div>
          </div>
          ${this.renderMobileGallery(product, galleryKeys)}
        </div>
        <article class="product-info">
          <div class="product-info-head">
            <div class="crumbs">
              <a href="${this.href(`/${brand.id}/catalog`)}" data-link>Каталог</a>
              <span>/</span>
              <a href="${this.href(`/${brand.id}/catalog?category=${product.categoryId}`)}" data-link>${escapeHtml(category?.title ?? product.type)}</a>
            </div>
            <a class="small-button back-to-catalog" href="${this.href(`/${brand.id}/catalog`)}" data-link>${ICONS.arrow}<span>В каталог</span></a>
          </div>
          <p class="eyebrow">${this.renderTermForProduct(product)}</p>
          <h1>${escapeHtml(product.title)}</h1>
          <div class="product-status-row">
            ${this.renderStatus(product)}
            ${this.renderProductMetrics(product)}
          </div>
          <div class="product-summary">
            <p>${escapeHtml(product.shortDescription)}</p>
            <div class="tag-list">
              ${this.renderTasteTags(product, brand)}
            </div>
          </div>
          <div class="buy-panel">
            <div class="field">
              <label for="pack-${product.id}">Фасовка</label>
              <select id="pack-${product.id}" data-pack-select data-product-id="${escapeHtml(product.id)}">
                ${product.packs.map((pack) => `
                  <option value="${escapeHtml(getPackKey(pack))}">${escapeHtml(getPackLabel(pack))} - ${formatPrice(pack.price)}</option>
                `).join("")}
              </select>
            </div>
            <button
              class="primary-button"
              type="button"
              data-action="add-to-cart"
              data-product-id="${escapeHtml(product.id)}"
              data-pack-key="${escapeHtml(getPackKey(firstPack))}"
              ${disabled ? "disabled" : ""}
            >${ICONS.cart}<span>${disabled ? "Товар недоступен" : "В корзину"}</span></button>
          </div>
          <section class="content-block">
            <h2>Описание</h2>
            <p class="description-text ${expanded ? "" : "is-clamped"}">${escapeHtml(description)}</p>
            <button class="small-button" type="button" data-action="toggle-description" data-product-id="${escapeHtml(product.id)}">
              ${expanded ? "Свернуть" : "Показать полностью"}
            </button>
          </section>
          <section class="content-block">
            <h2>${product.kind === "teaware" ? "Как использовать" : "Как заваривать"}</h2>
            ${brand.brewingStyle === "story" ? `
              <p>${escapeHtml(note)}</p>
              <div class="brewing-grid" style="margin-top: 12px;">
                ${this.renderBrewingItems(product)}
              </div>
            ` : `
              <div class="brewing-grid">
                ${this.renderBrewingItems(product)}
              </div>
              <p style="margin-top: 12px;">${escapeHtml(note)}</p>
            `}
          </section>
          <section class="content-block">
            <h2>Происхождение</h2>
            <div class="brewing-grid">
              <div class="info-item"><span>Страна</span><strong>${escapeHtml(product.country)}</strong></div>
              <div class="info-item"><span>Провинция</span><strong>${escapeHtml(product.province)}</strong></div>
              <div class="info-item"><span>Год</span><strong>${escapeHtml(product.harvest?.year ?? "")}</strong></div>
              <div class="info-item"><span>Сезон</span><strong>${escapeHtml(product.harvest?.season ?? "")}</strong></div>
            </div>
          </section>
          <section class="content-block">
            <h2>Отзывы</h2>
            <div class="review-list">
              ${reviews.map((review) => this.renderReview(review)).join("")}
            </div>
            ${this.renderReviewForm(product)}
          </section>
        </article>
      </section>
      <section class="section">
        <div class="container">
          <div class="page-title">
            <div>
              <h1>Похожие товары</h1>
              <p>Тот же тип, близкий вкус или похожая задача.</p>
            </div>
          </div>
          <div class="product-grid">
            ${related.map((item) => this.renderProductCard(item, brand)).join("")}
          </div>
        </div>
      </section>
    `;
  }

  renderBrewingItems(product) {
    const brewing = product.brewing ?? {};
    return [
      ["Температура", brewing.temperature],
      [product.kind === "teaware" ? "Вместимость" : "Лист", brewing.leaf],
      ["Вода", brewing.water],
      ["Время", brewing.time]
    ].map(([label, value]) => `
      <div class="brewing-item"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>
    `).join("");
  }

  renderMobileGallery(product, keys) {
    return `
      <div class="mobile-gallery" aria-label="Галерея товара">
        ${keys.map((key) => `
          <button class="gallery-slide" type="button" data-action="next-gallery-image" aria-label="Следующее изображение">
            ${this.renderThumb(product, key)}
          </button>
        `).join("")}
      </div>
    `;
  }

  renderReview(review) {
    return `
      <article class="review">
        <div class="review-head">
          <strong>${escapeHtml(review.author)}</strong>
          <span class="rating">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</span>
        </div>
        <p>${escapeHtml(review.text)}</p>
        <p><small>${formatDate(review.date)}</small></p>
      </article>
    `;
  }

  getReviews(product) {
    return [
      ...(this.tempReviews.get(product.id) ?? []),
      ...(product.reviews ?? [])
    ];
  }

  getReviewStats(product) {
    const reviews = this.getReviews(product);
    const count = reviews.length;
    const average = count
      ? reviews.reduce((sum, review) => sum + (Number(review.rating) || 0), 0) / count
      : 0;
    return { count, average };
  }

  renderProductMetrics(product) {
    const { count, average } = this.getReviewStats(product);
    const ratingLabel = count ? `Средняя оценка ${formatRating(average)} из 5` : "Пока нет оценок";
    const reviewsLabel = `${count} ${reviewWord(count)}`;
    return `
      <span class="product-metrics" aria-label="${escapeHtml(`${ratingLabel}, ${reviewsLabel}`)}">
        <span class="metric" title="${escapeHtml(ratingLabel)}">${ICONS.star}<span>${escapeHtml(formatRating(average))}</span></span>
        <span class="metric" title="${escapeHtml(reviewsLabel)}">${ICONS.review}<span>${count}</span></span>
      </span>
    `;
  }

  renderReviewForm(product) {
    const id = escapeHtml(product.id);
    return `
      <form class="review-form" data-review-form data-product-id="${id}">
        <h3>Оставить отзыв</h3>
        <div class="review-form-grid">
          <div class="field">
            <label for="review-author-${id}">Имя</label>
            <input id="review-author-${id}" name="author" autocomplete="name" placeholder="Как вас зовут">
          </div>
          <div class="field rating-field">
            <span class="field-label">Оценка</span>
            <div class="star-rating" role="radiogroup" aria-label="Оценка">
              ${[5, 4, 3, 2, 1].map((rating) => `
                <input class="star-radio" id="review-rating-${id}-${rating}" type="radio" name="rating" value="${rating}" ${rating === 5 ? "checked" : ""}>
                <label for="review-rating-${id}-${rating}" title="${rating} ${starWord(rating)}">★</label>
              `).join("")}
            </div>
          </div>
        </div>
        <div class="field">
          <label for="review-text-${id}">Отзыв</label>
          <textarea id="review-text-${id}" name="text" rows="4" required placeholder="Что понравилось, как заваривали, кому бы посоветовали"></textarea>
        </div>
        <div class="review-form-actions">
          <button class="primary-button" type="submit"><span>Опубликовать</span></button>
          <span class="form-note" data-review-error>Отзыв появится сразу, но в демке не сохранится после перезагрузки.</span>
        </div>
      </form>
    `;
  }

  getBrandText(value, brandId) {
    if (!value) return "";
    if (typeof value === "string") return value;
    return value[brandId] ?? value.shebang ?? Object.values(value)[0] ?? "";
  }

  renderTermForProduct(product) {
    const map = {
      "Белый чай": "white-tea",
      "Габа чай": "gaba",
      "Улун": "oolong",
      "Шу Пуэр": "shu-puer",
      "Шен Пуэр": "sheng-puer"
    };
    const term = this.data.glossaryMap.get(map[product.type]);
    if (!term) return escapeHtml(product.type);
    return `<button class="term" type="button" data-tooltip="${escapeHtml(term.short)}">${escapeHtml(product.type)}</button>`;
  }

  getRelatedProducts(product) {
    const explicit = (product.relatedProductIds ?? [])
      .map((id) => this.data.productMap.get(id))
      .filter(Boolean);
    if (explicit.length) return explicit;

    return this.getSortedProducts(this.data.products.filter((item) => {
      if (item.id === product.id) return false;
      if (item.categoryId === product.categoryId) return true;
      return item.effects.some((effect) => product.effects.includes(effect));
    })).slice(0, 4);
  }

  renderStaticPage(brand, key) {
    const page = this.data.pages[key];
    const items = page.items ?? [];
    return `
      <section class="container static-page">
        <p class="eyebrow">${escapeHtml(brand.name)}</p>
        <div class="page-title">
          <div>
            <h1>${escapeHtml(page.title)}</h1>
            <p>${escapeHtml(page.text)}</p>
          </div>
        </div>
        <div class="static-grid">
          ${items.map((item) => `<div class="static-item">${escapeHtml(item)}</div>`).join("")}
        </div>
      </section>
    `;
  }

  renderCheckout(brand) {
    const details = this.getCartDetails();
    return `
      <section class="container static-page">
        <p class="eyebrow">${escapeHtml(brand.name)}</p>
        <div class="page-title">
          <div>
            <h1>Оформление заказа</h1>
            <p>В демке заказ не отправляется, но корзина уже считает сумму, вес и количество позиций.</p>
          </div>
        </div>
        <div class="static-grid">
          <div class="static-item">Позиций: ${details.count}</div>
          <div class="static-item">Вес чая: ${details.teaWeight} г</div>
          <div class="static-item">Сумма: ${formatPrice(details.total)}</div>
        </div>
        <p style="margin-top: 24px;">
          <a class="primary-button" href="${this.href(`/${brand.id}/catalog`)}" data-link>${ICONS.arrow}<span>Вернуться в каталог</span></a>
        </p>
      </section>
    `;
  }

  renderCart() {
    const route = this.parseRoute();
    const brandId = route.brandId ?? this.data.meta.defaultBrand;
    const details = this.getCartDetails();

    return `
      <div class="cart-backdrop ${this.cartOpen ? "is-open" : ""}" data-action="close-cart"></div>
      <aside class="cart-drawer ${this.cartOpen ? "is-open" : ""}" aria-label="Корзина">
        <div class="cart-head">
          <h2>Корзина</h2>
          <button class="icon-button" type="button" data-action="close-cart" aria-label="Закрыть корзину">${ICONS.close}</button>
        </div>
        <div class="cart-items">${this.renderCartItemsContent(brandId, details)}</div>
        <div class="cart-summary">
          ${this.renderCartSummaryContent(brandId, details)}
        </div>
      </aside>
    `;
  }

  renderCartItemsContent(brandId, details) {
    if (details.items.length) {
      return details.items.map((item) => this.renderCartItem(item, brandId)).join("");
    }

    return `
      <div class="empty-state" style="min-height: 260px;">
        <div class="state-box">
          <h2>Корзина пуста</h2>
          <p>Добавьте чай из каталога, и он сохранится в браузере.</p>
          <a class="primary-button" href="${this.href(`/${brandId}/catalog`)}" data-link>${ICONS.search}<span>Открыть каталог</span></a>
        </div>
      </div>
    `;
  }

  renderCartSummaryContent(brandId, details) {
    return `
      <div class="summary-row"><span>Позиций</span><strong>${details.count}</strong></div>
      <div class="summary-row"><span>Вес чая</span><strong>${details.teaWeight} г</strong></div>
      <div class="summary-row"><span>Итого</span><strong>${formatPrice(details.total)}</strong></div>
      <div class="cart-summary-actions ${details.count ? "" : "is-single"}">
        ${details.count ? `<button class="danger-button" type="button" data-action="clear-cart">${ICONS.trash}<span>Очистить</span></button>` : ""}
        <a class="primary-button" href="${this.href(`/${brandId}/checkout`)}" data-link>${ICONS.arrow}<span>Оформить заказ</span></a>
      </div>
    `;
  }

  renderCartItem({ product, pack, quantity }, brandId) {
    const packKey = getPackKey(pack);
    const productUrl = this.href(`/${brandId}/product/${product.slug}`);
    return `
      <div class="cart-item">
        <a class="cart-item-media" href="${productUrl}" data-link aria-label="Открыть ${escapeHtml(product.title)}">
          ${this.renderImage(product)}
        </a>
        <div class="cart-item-content">
          <h3><a href="${productUrl}" data-link>${escapeHtml(product.title)}</a></h3>
          <p>${escapeHtml(getPackLabel(pack))} · ${formatPrice(pack.price)}</p>
          <div class="qty-controls">
            <div class="stepper" aria-label="Количество">
              <button type="button" data-action="decrease" data-product-id="${escapeHtml(product.id)}" data-pack-key="${escapeHtml(packKey)}" aria-label="Уменьшить">${ICONS.minus}</button>
              <span>${quantity}</span>
              <button type="button" data-action="increase" data-product-id="${escapeHtml(product.id)}" data-pack-key="${escapeHtml(packKey)}" aria-label="Увеличить">${ICONS.plus}</button>
            </div>
            <button class="icon-button" type="button" data-action="remove" data-product-id="${escapeHtml(product.id)}" data-pack-key="${escapeHtml(packKey)}" aria-label="Удалить">${ICONS.trash}</button>
          </div>
        </div>
      </div>
    `;
  }

  renderFooter(brand) {
    return `
      <footer class="app-footer">
        <div class="container footer-inner">
          <span>${escapeHtml(brand.footerNote)}</span>
          <div class="footer-links">
            <a href="${escapeHtml(brand.contacts.telegram)}">Telegram</a>
            <a href="${escapeHtml(brand.contacts.youtube)}">YouTube</a>
            <a href="${escapeHtml(brand.contacts.vk)}">VK</a>
            <span>${escapeHtml(brand.contacts.phone)}</span>
          </div>
        </div>
      </footer>
    `;
  }

  renderImage(product) {
    const fallback = rootPath(product.kind === "teaware"
      ? "assets/images/placeholders/teaware-default.svg"
      : "assets/images/placeholders/tea-default.svg");
    const src = rootPath(product.images?.main) || fallback;
    const alt = product.imageAlt?.main ?? product.title;
    return `<img src="${escapeHtml(src)}" data-fallback="${fallback}" alt="${escapeHtml(alt)}" loading="lazy">`;
  }

  renderThumb(product, key) {
    const fallback = rootPath(product.kind === "teaware"
      ? "assets/images/placeholders/teaware-default.svg"
      : "assets/images/placeholders/tea-default.svg");
    const src = rootPath(product.images?.[key]) || fallback;
    const alt = product.imageAlt?.[key] ?? product.imageAlt?.main ?? product.title;
    return `<img src="${escapeHtml(src)}" data-fallback="${fallback}" alt="${escapeHtml(alt)}" loading="lazy">`;
  }

  renderStatus(product) {
    const status = product.availability.status;
    return `<span class="status-pill ${escapeHtml(status)}">${escapeHtml(product.availability.label)}</span>`;
  }

  renderLogo() {
    return `
      <svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 10h10v3.8A4.2 4.2 0 0 1 10.8 18H9.2A4.2 4.2 0 0 1 5 13.8V10Z" stroke="currentColor" stroke-width="1.8"/>
        <path d="M15 11h1.6a2.4 2.4 0 0 1 0 4.8H15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M9 7c-.6-.8.1-1.5.7-2.1M12 7c-.6-.8.1-1.5.7-2.1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    `;
  }

  renderLoader() {
    return `
      <svg class="loader-cup" viewBox="0 0 80 80" fill="none" aria-hidden="true">
        <path class="loader-steam" d="M31 25c-5-6 4-9 0-15M43 25c-5-6 4-9 0-15" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
        <path d="M20 34h34v12a15 15 0 0 1-15 15h-4a15 15 0 0 1-15-15V34Z" stroke="currentColor" stroke-width="4"/>
        <path d="M54 38h5a8 8 0 0 1 0 16h-5" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      </svg>
    `;
  }

  renderEmptyCatalog() {
    return `
      <div class="empty-state">
        <div class="state-box">
          <h2>Ничего не нашлось</h2>
          <p>Попробуйте убрать часть фильтров или изменить запрос.</p>
          <button class="primary-button" type="button" data-action="clear-filters">${ICONS.filter}<span>Сбросить фильтры</span></button>
        </div>
      </div>
    `;
  }

  renderNotFound(brand) {
    return `
      <section class="empty-state">
        <div class="state-box">
          <h1>Страница не найдена</h1>
          <p>Такого раздела в демке пока нет.</p>
          <a class="primary-button" href="${this.href(`/${brand.id}/catalog`)}" data-link>${ICONS.search}<span>Открыть каталог</span></a>
        </div>
      </section>
    `;
  }

  renderError(error) {
    return `
      <main class="error-state">
        <div class="state-box">
          <h1>Каталог не загрузился</h1>
          <p>${escapeHtml(error.message)}</p>
        </div>
      </main>
    `;
  }
}

customElements.define("tea-app", TeaApp);
