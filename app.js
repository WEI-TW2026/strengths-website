const state = {
  articles: [],
  category: "全部",
  query: "",
  sort: "newest"
};

const categoryColors = {
  "學會介紹": "#3d7f6b",
  "理論與實務": "#2e6f91",
  "文獻資源": "#7a65a8",
  "研究成果": "#b46b39",
  "案例與影音": "#c05f69",
  "專業人物": "#547b3f",
  "活動與研討會": "#b88725",
  "督導認證": "#546f80"
};

const elements = {
  grid: document.querySelector("#article-grid"),
  featured: document.querySelector("#featured-grid"),
  filters: document.querySelector("#category-filters"),
  search: document.querySelector("#search-input"),
  sort: document.querySelector("#sort-select"),
  count: document.querySelector("#result-count"),
  clear: document.querySelector("#clear-filters"),
  empty: document.querySelector("#empty-state"),
  emptyClear: document.querySelector("#empty-clear"),
  template: document.querySelector("#article-card-template"),
  articleTotal: document.querySelector("#article-total"),
  categoryTotal: document.querySelector("#category-total")
};

const formatDate = (date) =>
  new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(`${date}T00:00:00`));

const normalize = (value) =>
  String(value ?? "")
    .normalize("NFKC")
    .toLocaleLowerCase("zh-Hant")
    .replace(/\s+/g, " ")
    .trim();

function searchableText(article) {
  return normalize(
    [
      article.title,
      article.sourceTitle,
      article.summary,
      article.category,
      article.format,
      article.status,
      ...(article.tags ?? [])
    ].join(" ")
  );
}

function getVisibleArticles() {
  const query = normalize(state.query);
  const filtered = state.articles.filter((article) => {
    const categoryMatches = state.category === "全部" || article.category === state.category;
    const queryMatches = !query || searchableText(article).includes(query);
    return categoryMatches && queryMatches;
  });

  return filtered.sort((a, b) => {
    if (state.sort === "oldest") return a.date.localeCompare(b.date);
    if (state.sort === "title") return a.title.localeCompare(b.title, "zh-Hant");
    return b.date.localeCompare(a.date);
  });
}

function renderFeatured() {
  const featured = state.articles
    .filter((article) => article.pinned)
    .sort((a, b) => b.date.localeCompare(a.date));

  elements.featured.replaceChildren(
    ...featured.map((article) => {
      const card = document.createElement("article");
      card.className = "featured-card";

      const meta = document.createElement("div");
      meta.className = "featured-meta";
      meta.innerHTML = `<span>${article.category}</span><time datetime="${article.date}">${formatDate(article.date)}</time>`;

      const title = document.createElement("h3");
      title.textContent = article.title;

      const summary = document.createElement("p");
      summary.textContent = article.summary;

      const link = document.createElement("a");
      link.href = article.url;
      link.textContent = "閱讀全文";

      card.append(meta, title, summary, link);
      return card;
    })
  );
}

function renderFilters() {
  const counts = state.articles.reduce((accumulator, article) => {
    accumulator[article.category] = (accumulator[article.category] || 0) + 1;
    return accumulator;
  }, {});

  const categories = ["全部", ...Object.keys(counts).sort((a, b) => a.localeCompare(b, "zh-Hant"))];
  const buttons = categories.map((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-chip";
    button.dataset.category = category;
    button.setAttribute("aria-pressed", String(state.category === category));
    const count = category === "全部" ? state.articles.length : counts[category];
    button.textContent = `${category} ${count}`;
    button.addEventListener("click", () => {
      state.category = category;
      syncUrl();
      renderFilters();
      renderArticles();
    });
    return button;
  });

  elements.filters.replaceChildren(...buttons);
  elements.categoryTotal.textContent = String(Object.keys(counts).length);
}

function createArticleCard(article) {
  const fragment = elements.template.content.cloneNode(true);
  const card = fragment.querySelector(".article-card");
  const badge = fragment.querySelector(".category-badge");
  const time = fragment.querySelector("time");
  const title = fragment.querySelector("h3");
  const summary = fragment.querySelector(".card-summary");
  const tags = fragment.querySelector(".tag-list");
  const format = fragment.querySelector(".format-label");
  const link = fragment.querySelector(".card-footer a");

  card.style.setProperty("--card-accent", categoryColors[article.category] || "#4c8d79");
  badge.textContent = article.category;
  time.dateTime = article.date;
  time.textContent = formatDate(article.date);
  title.textContent = article.title;
  summary.textContent = article.summary;
  format.textContent = article.format;
  link.href = article.url;
  link.setAttribute("aria-label", `閱讀「${article.title}」全文`);

  tags.replaceChildren(
    ...(article.tags ?? []).slice(0, 3).map((tag) => {
      const item = document.createElement("span");
      item.textContent = tag;
      return item;
    })
  );

  return fragment;
}

function renderArticles() {
  const articles = getVisibleArticles();
  elements.grid.replaceChildren(...articles.map(createArticleCard));

  const hasFilters = state.category !== "全部" || Boolean(state.query.trim());
  elements.count.textContent = hasFilters
    ? `找到 ${articles.length} 篇文章（共 ${state.articles.length} 篇）`
    : `共 ${state.articles.length} 篇文章`;
  elements.clear.hidden = !hasFilters;
  elements.empty.hidden = articles.length !== 0;
  elements.grid.hidden = articles.length === 0;
}

function clearFilters() {
  state.category = "全部";
  state.query = "";
  elements.search.value = "";
  syncUrl();
  renderFilters();
  renderArticles();
  elements.search.focus();
}

function syncUrl() {
  const params = new URLSearchParams();
  if (state.query.trim()) params.set("q", state.query.trim());
  if (state.category !== "全部") params.set("category", state.category);
  if (state.sort !== "newest") params.set("sort", state.sort);
  const next = params.toString() ? `${location.pathname}?${params}` : location.pathname;
  history.replaceState(null, "", next);
}

function hydrateFromUrl(categories) {
  const params = new URLSearchParams(location.search);
  const category = params.get("category");
  const sort = params.get("sort");
  state.query = params.get("q") || "";
  state.category = category && categories.includes(category) ? category : "全部";
  state.sort = ["newest", "oldest", "title"].includes(sort) ? sort : "newest";
  elements.search.value = state.query;
  elements.sort.value = state.sort;
}

function showLoadError() {
  elements.count.textContent = "文章資料載入失敗";
  elements.empty.hidden = false;
  elements.grid.hidden = true;
  elements.empty.querySelector("h3").textContent = "暫時無法載入資料";
  elements.empty.querySelector("p").textContent = "請透過網站伺服器開啟，或稍後重新整理頁面。";
  elements.emptyClear.hidden = true;
}

async function init() {
  try {
    const payload = JSON.parse(document.querySelector("#catalog-data").textContent);
    state.articles = payload.articles;

    const categories = [...new Set(state.articles.map((article) => article.category))];
    hydrateFromUrl(categories);
    elements.articleTotal.textContent = String(state.articles.length);
    renderFeatured();
    renderFilters();
    renderArticles();
  } catch (error) {
    console.error("Unable to load article archive", error);
    showLoadError();
  }
}

let searchTimer;
elements.search.addEventListener("input", (event) => {
  window.clearTimeout(searchTimer);
  searchTimer = window.setTimeout(() => {
    state.query = event.target.value;
    syncUrl();
    renderArticles();
  }, 120);
});

elements.sort.addEventListener("change", (event) => {
  state.sort = event.target.value;
  syncUrl();
  renderArticles();
});

elements.clear.addEventListener("click", clearFilters);
elements.emptyClear.addEventListener("click", clearFilters);

init();
