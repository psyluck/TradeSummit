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
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var email = document.getElementById("email").value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        note.textContent = "Please enter a valid email address.";
        note.className = "cta__note cta__note--err";
        return;
      }
      note.textContent = "You're on the list. We'll reach out before the first trading window opens.";
      note.className = "cta__note cta__note--ok";
      form.reset();
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
      if (label) label.textContent = live ? "Live" : "Snapshot";
    }
    renderTerm(prices, live);
  }

  function quoteFor(prices, sym) {
    return (prices && prices[sym]) || snapshot[sym] || { price: 0, change: 0 };
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
      book.innerHTML = list.slice(0, 4).map(function (a, i) {
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

  function fetchGecko() {
    var ids = tickerAssets.map(function (a) { return a.id; }).join(",");
    return fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=" + encodeURIComponent(ids) +
      "&vs_currencies=usd&include_24hr_change=true"
    )
      .then(function (r) { if (!r.ok) throw new Error("gecko " + r.status); return r.json(); })
      .then(applyGecko);
  }

  function applyCap(data) {
    var map = {};
    data.forEach(function (a) {
      map[a.symbol.toUpperCase()] = {
        price: parseFloat(a.priceUsd),
        change: parseFloat(a.changePercent24Hr)
      };
    });
    return map;
  }

  function fetchCap() {
    var ids = tickerAssets.map(function (a) {
      if (a.id === "binancecoin") return "binance-coin";
      if (a.id === "avalanche-2") return "avalanche";
      return a.id;
    }).join(",");
    return fetch("https://api.coincap.io/v2/assets?ids=" + encodeURIComponent(ids))
      .then(function (r) { if (!r.ok) throw new Error("coincap " + r.status); return r.json(); })
      .then(function (j) { return applyCap(j.data || []); });
  }

  function updateTicker() {
    var prices = null;
    var live = false;
    fetchGecko()
      .catch(function () { return fetchCap(); })
      .then(function (p) {
        if (p && typeof p === "object") { prices = p; live = true; }
      })
      .catch(function () { prices = null; live = false; })
      .finally(function () { render(prices, live); });
  }

  render(null, false);
  tickClock();
  updateTicker();
  setInterval(updateTicker, 60000);
  setInterval(tickClock, 1000);
})();