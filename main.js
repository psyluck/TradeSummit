(function () {
  "use strict";

  var toggle = document.getElementById("nav-toggle");
  var links = document.getElementById("nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("nav__links--open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  var form = document.getElementById("waitlist-form");
  var note = document.getElementById("cta-note");
  var WAITLIST_ENDPOINT = "/api/waitlist";
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var button = form.querySelector("button[type=submit]");
      var email = document.getElementById("email").value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        note.textContent = "Please enter a valid email address.";
        note.className = "cta__note cta__note--err";
        return;
      }
      var payload = { email: email, source: "landing" };
      if (document.referrer) {
        payload.referrer = document.referrer;
      }
      if (button) {
        button.disabled = true;
      }
      fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error("HTTP " + response.status);
          }
          note.textContent = "You're on the list. We'll reach out before the first trading window opens.";
          note.className = "cta__note cta__note--ok";
          form.reset();
        })
        .catch(function () {
          note.textContent = "Sorry, we couldn't save that just now. Please try again in a moment.";
          note.className = "cta__note cta__note--err";
        })
        .finally(function () {
          if (button) {
            button.disabled = false;
          }
        });
    });
  }

  var targets = document.querySelectorAll(".features .feature, .how .step, .security__list li");
  if ("IntersectionObserver" in window && window.matchMedia("(prefers-reduced-motion: reduce)").matches === false) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    targets.forEach(function (el) {
      el.classList.add("reveal");
      observer.observe(el);
    });
  }

  var tickerAssets = [
    { id: "bitcoin", sym: "BTC" },
    { id: "ethereum", sym: "ETH" },
    { id: "solana", sym: "SOL" },
    { id: "hyperliquid", sym: "HYPE" },
    { id: "ripple", sym: "XRP" },
    { id: "binancecoin", sym: "BNB" },
    { id: "cardano", sym: "ADA" },
    { id: "dogecoin", sym: "DOGE" },
    { id: "avalanche-2", sym: "AVAX" },
    { id: "chainlink", sym: "LINK" },
    { id: "polkadot", sym: "DOT" },
    { id: "tron", sym: "TRX" },
    { id: "litecoin", sym: "LTC" },
    { id: "toncoin", sym: "TON" }
  ];

  var orderBookAssets = [
    { id: "bitcoin", sym: "BTC" },
    { sym: "SPX" },
    { id: "ethereum", sym: "ETH" },
    { sym: "AAPL" },
    { sym: "GOLD" },
    { id: "hyperliquid", sym: "HYPE" },
    { id: "solana", sym: "SOL" },
    { id: "ripple", sym: "XRP" }
  ];

  var snapshot = {
    BTC: { price: 64200.5, change: 2.31 },
    ETH: { price: 3421.8, change: 1.12 },
    SOL: { price: 143.2, change: -0.84 },
    HYPE: { price: 28.64, change: 4.02 },
    XRP: { price: 0.61, change: 0.45 },
    BNB: { price: 584.9, change: -0.32 },
    ADA: { price: 0.4512, change: 1.9 },
    DOGE: { price: 0.1234, change: -2.1 },
    AVAX: { price: 28.9, change: 1.4 },
    LINK: { price: 14.22, change: 0.8 },
    DOT: { price: 6.78, change: -1.2 },
    TRX: { price: 0.132, change: 0.2 },
    LTC: { price: 71.4, change: -0.6 },
    TON: { price: 5.42, change: 2.5 }
  };

  var rwaPerps = {
    SPX: { price: 5620.4, change: 0.62 },
    AAPL: { price: 224.18, change: -0.31 },
    GOLD: { price: 2411.2, change: 0.44 }
  };

  function formatPrice(n) {
    if (n >= 1000) return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (n >= 1) return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    return n.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 6 });
  }

  function itemHtml(sym, quote) {
    var up = (quote.change || 0) >= 0;
    var dir = up ? "up" : "down";
    var arrow = up ? "\u25B2" : "\u25BC";
    var sign = up ? "+" : "";
    return (
      '<span class="ticker__item">' +
      '<span class="ticker__sym">' + sym + '</span>' +
      '<span class="ticker__price ticker__price--' + dir + '">' + formatPrice(quote.price) + '</span>' +
      '<span class="ticker__chg ticker__chg--' + dir + '">' + arrow + ' ' + sign +
      (quote.change || 0).toFixed(2) + '%</span>' +
      '</span>'
    );
  }

  function render(prices, live) {
    var track = document.getElementById("ticker-track");
    if (!track) return;
    var set = tickerAssets.map(function (a) {
      var q = (prices && prices[a.sym]) || snapshot[a.sym] || { price: 0, change: 0 };
      return itemHtml(a.sym, q);
    }).join("");
    track.innerHTML = set + set;
    var status = document.getElementById("ticker-status");
    if (status) {
      status.classList.toggle("ticker__status--stale", !live);
      var label = status.querySelector("span:last-child");
      if (label) label.textContent = live ? "Live" : "Market Data Offline";
    }
    renderTerm(prices, live);
  }

  function quoteFor(prices, sym) {
    return (prices && prices[sym]) || snapshot[sym] || rwaPerps[sym] || { price: 0, change: 0 };
  }

  function renderTerm(prices, live) {
    var rows = document.getElementById("term-rows");
    var list = tickerAssets.slice(0, 8);
    if (rows) {
      rows.innerHTML = list.map(function (a) {
        var q = quoteFor(prices, a.sym);
        var up = (q.change || 0) >= 0;
        var dir = up ? "up" : "down";
        return (
          '<div class="term__row">' +
          '<span class="t-sym">' + a.sym + '</span>' +
          '<span class="t-price ' + dir + '">' + formatPrice(q.price) + '</span>' +
          '<span class="t-chg ' + dir + '">' + (up ? "+" : "") + (q.change || 0).toFixed(2) + '%</span>' +
          '</div>'
        );
      }).join("");
    }

    var book = document.getElementById("term-book");
    if (book) {
      book.innerHTML = orderBookAssets.map(function (a, i) {
        var q = quoteFor(prices, a.sym);
        var bid = q.price * (1 - 0.0008 - i * 0.0004);
        var ask = q.price * (1 + 0.0008 + i * 0.0004);
        return (
          '<div class="term__row">' +
          '<span class="t-sym">' + a.sym + '</span>' +
          '<span class="t-price up">' + formatPrice(bid) + '</span>' +
          '<span class="t-price down">' + formatPrice(ask) + '</span>' +
          '</div>'
        );
      }).join("");
    }

    var foot = document.getElementById("term-foot");
    if (foot) {
      var btc = quoteFor(prices, "BTC");
      var up = (btc.change || 0) >= 0;
      foot.innerHTML =
        "BTC " + formatPrice(btc.price) +
        ' <span class="' + (up ? "up" : "down") + '">' +
        (up ? "\u25B2 +" : "\u25BC -") + Math.abs(btc.change || 0).toFixed(2) +
        "%</span>\u00A0\u00A0LAST " + new Date().toISOString().slice(0, 19).replace("T", " ") +
        ' UTC <span class="cursor" aria-hidden="true">_</span>';
    }
  }

  function tickClock() {
    var el = document.getElementById("term-clock");
    if (el) el.textContent = new Date().toISOString().slice(11, 19) + " UTC";
  }

  function applyGecko(payload) {
    var prices = {};
    tickerAssets.forEach(function (a) {
      var d = payload[a.id];
      if (d && typeof d.usd === "number") {
        prices[a.sym] = { price: d.usd, change: d.usd_24h_change || 0 };
      }
    });
    return Object.keys(prices).length ? prices : null;
  }

  function fetchHyperliquidMids() {
    return fetch("https://api.hyperliquid.xyz/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "allMids" })
    })
      .then(function (r) { if (!r.ok) throw new Error("hl " + r.status); return r.json(); })
      .then(function (j) { return applyHyperliquidMids(j); });
  }

  function applyHyperliquidMids(data) {
    var map = {};
    if (data && typeof data === "object") {
      Object.keys(data).forEach(function (k) {
        var v = data[k];
        var price = parseFloat(v);
        if (!isNaN(price) && isFinite(price)) {
          map[k.toUpperCase()] = { price: price, change: 0 };
        }
      });
    }
    return map;
  }

  function updateTicker() {
    var prices = null;
    var live = false;
    fetchHyperliquidMids()
      .then(function (p) {
        if (p && typeof p === "object") { prices = p; live = true; }
      })
      .catch(function () {
        prices = null;
        live = false;
      })
      .finally(function () { render(prices, live); });
  }

  render(null, false);
  tickClock();
  updateTicker();
  setInterval(updateTicker, 60000);
  setInterval(tickClock, 1000);

  // Dev-only product navigation. The shipped artifact must stay free of
  // absolute refs for IPFS, so these origins are wired at runtime only when
  // the page is served from a local dev origin. Replace the origins with the
  // hosted /app and /admin origins at deploy time.
  var devHosts = ["127.0.0.1", "localhost"];
  // App origins. PROD_LAUNCH is the single, shipped deploy target; it is baked
  // in at runtime so the IPFS artifact keeps no absolute refs in its text.
  // DEV_LAUNCH serves the local offline harness and is applied automatically
  // whenever the page is served from a dev origin (see wireLaunchApp).
  var PROD_LAUNCH = "https://app.tradesummit.online/";
  var DEV_LAUNCH = "http://localhost:5173/";
  function onDevServer() {
    return window.location.port === "8000" || devHosts.indexOf(window.location.hostname) !== -1;
  }
  // The nav's green "Launch App" control redirects the visitor into the
  // product via an explicit navigation (window.location) rather than relying
  // on the static "#cta" anchor, matching prod-origin / dev-origin selection.
  function wireLaunchApp() {
    var launch = document.querySelector(".nav__launch");
    if (!launch) return;
    launch.href =
      "app.tradesummit.online" === window.location.hostname ? PROD_LAUNCH : (onDevServer() ? DEV_LAUNCH : PROD_LAUNCH);
    launch.rel = "noopener";
    launch.addEventListener("click", function (event) {
      event.preventDefault();
      window.location.assign(launch.href);
    });
  }
  wireLaunchApp();
  function wireDevProductLinks() {
    if (!onDevServer()) return;
    var explore = document.querySelector(".btn--ghost");
    if (explore && explore.textContent.indexOf("Explore the platform") !== -1) {
      explore.href = "http://127.0.0.1:5173/";
      explore.target = "_blank";
      explore.rel = "noopener";
    }
    var launch = document.querySelector(".nav__launch");
    if (launch) {
      launch.href = "http://127.0.0.1:5173/";
      launch.target = "_blank";
      launch.rel = "noopener";
    }
    var footer = document.querySelector(".footer__links");
    if (footer && !footer.querySelector(".footer__op-link")) {
      var li = document.createElement("li");
      var link = document.createElement("a");
      link.className = "footer__op-link";
      link.href = "http://127.0.0.1:5174/";
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = "Operator console";
      li.appendChild(link);
      footer.appendChild(li);
    }
  }
  wireDevProductLinks();
})();