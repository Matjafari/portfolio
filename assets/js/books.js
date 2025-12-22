
(function(){
  const { getLang, setLang } = window.I18N_API;

  const LINKS = {
    profile: "https://www.goodreads.com/user/show/53684401-mat",
    rss: "https://www.goodreads.com/review/list_rss/53684401?shelf=read"
  };

  const lang = getLang();
  setLang(lang);

  document.querySelectorAll(".pill[data-lang]").forEach(btn=>{
    btn.addEventListener("click", ()=> setLang(btn.dataset.lang));
  });

  const year = document.getElementById("year");
  if(year) year.textContent = new Date().getFullYear();

  const wrap = document.getElementById("booksList");
  if(wrap){
    loadGoodreadsFull(LINKS.rss, LINKS.profile, wrap, 40);
  }

  async function loadGoodreadsFull(rssUrl, profileUrl, container, maxItems){
    container.innerHTML = `<div class="bookCard"><div class="bookCover"></div><div><h3>Goodreads</h3><p>Loading your “read” shelf…</p></div></div>`;
    try{
      const res = await fetch(rssUrl, { cache:"no-store" });
      if(!res.ok) throw new Error("HTTP " + res.status);
      const xmlText = await res.text();
      const doc = new DOMParser().parseFromString(xmlText, "text/xml");
      const items = Array.from(doc.querySelectorAll("item")).slice(0, maxItems);

      if(items.length === 0) throw new Error("No items in RSS");

      container.innerHTML = "";
      items.forEach((item, i)=>{
        const rawTitle = item.querySelector("title")?.textContent?.trim() || "Untitled";
        const link = item.querySelector("link")?.textContent?.trim() || profileUrl;

        const smallImg = item.querySelector("book_small_image_url")?.textContent?.trim()
          || item.querySelector("book_image_url")?.textContent?.trim()
          || "";

        const noteRaw = item.querySelector("user_review")?.textContent?.trim()
          || item.querySelector("description")?.textContent?.trim()
          || "";

        const card = document.createElement("div");
        card.className = "bookCard";
        card.innerHTML = `
          <div class="bookCover">${smallImg ? `<img src="${escapeAttr(smallImg)}" alt="">` : `<img src="assets/images/book-${(i%3)+1}.svg" alt="">`}</div>
          <div>
            <h3>${escapeHtml(rawTitle)}</h3>
            <p>${escapeHtml(shorten(cleanText(noteRaw), 200))}</p>
            <p class="muted tiny"><a class="link" href="${escapeAttr(link)}" target="_blank" rel="noopener">Open on Goodreads →</a></p>
          </div>
        `;
        container.appendChild(card);
      });
    }catch(err){
      container.innerHTML = `
        <div class="bookCard">
          <div class="bookCover"><img src="assets/images/book-1.svg" alt=""></div>
          <div>
            <h3>Goodreads</h3>
            <p class="muted">Couldn’t load the RSS feed here (CORS/network). Open your shelf directly:</p>
            <p class="muted tiny"><a class="link" href="${escapeAttr(profileUrl)}" target="_blank" rel="noopener">Open Goodreads →</a></p>
          </div>
        </div>
      `;
      console.warn("Goodreads RSS failed:", err);
    }
  }

  function cleanText(s){
    return String(s).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }
  function shorten(s, n){
    if(!s) return "";
    return s.length > n ? s.slice(0, n-1).trim() + "…" : s;
  }
  function escapeHtml(str){
    return String(str)
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }
  function escapeAttr(str){
    return escapeHtml(str).replaceAll("`","&#096;");
  }
})();
