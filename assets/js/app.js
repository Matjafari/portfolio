
/* Main page behavior */
(function(){
  const { getLang, setLang } = window.I18N_API;

  // ---------- Your links ----------
  const LINKS = {
    behance: "https://www.behance.net/matjafari",
    instagram: "https://www.instagram.com/matjafari/",
    telegram: "https://t.me/matjafarii",
    aparat: "https://www.aparat.com/",
    chess: "https://www.chess.com/member/matjafari",
    goodreadsProfile: "https://www.goodreads.com/user/show/53684401-mat",
    goodreadsRSS: "https://www.goodreads.com/review/list_rss/53684401?shelf=read"
  };

  // ---------- Content (placeholders you can refine) ----------
  const FILMS = [
    "Hotel short-form vertical reels (concept → shoot → edit)",
    "Room tours with story beats (not just 'look, a bed')",
    "Behind-the-scenes: production, lighting, and workflow"
  ];

  const WORK = [
    "Japanese language teaching",
    "English teaching at a language school",
    "Marketing manager (current) — luxury hospitality"
  ];

  // ---------- Init ----------
  const lang = getLang();
  setLang(lang);

  document.querySelectorAll(".pill[data-lang]").forEach(btn=>{
    btn.addEventListener("click", ()=> setLang(btn.dataset.lang));
  });

  // Apply links
  const beh = document.getElementById("behanceLink");
  if(beh) beh.href = LINKS.behance;

  const ig = document.getElementById("igLink");
  if(ig) ig.href = LINKS.instagram;

  const tg = document.getElementById("tgLink");
  if(tg) tg.href = LINKS.telegram;

  const ap = document.getElementById("apLink");
  if(ap) ap.href = LINKS.aparat;

  const ch = document.getElementById("chessLink");
  if(ch) ch.href = LINKS.chess;

  // Footer year
  const year = document.getElementById("year");
  if(year) year.textContent = new Date().getFullYear();

  // Film list
  const filmList = document.getElementById("filmList");
  if(filmList){
    FILMS.forEach(item=>{
      const li = document.createElement("li");
      li.textContent = item;
      filmList.appendChild(li);
    });
  }

  // Work list
  const workList = document.getElementById("workList");
  if(workList){
    WORK.forEach(item=>{
      const li = document.createElement("li");
      li.textContent = item;
      workList.appendChild(li);
    });
  }

  // Floating title
  const title = document.querySelector(".floatTitle");
  if(title){
    title.animate(
      [{transform:"translateY(0px)"},{transform:"translateY(-10px)"}],
      {duration:2200, direction:"alternate", iterations:Infinity, easing:"ease-in-out"}
    );
  }

  // Books preview (Goodreads "read" shelf)
  const ul = document.getElementById("booksPreviewList");
  if(ul){
    loadGoodreadsPreview(LINKS.goodreadsRSS, LINKS.goodreadsProfile, ul, 5);
  }

  // ---------- Animations ----------
  // Parallax stickers with GSAP ScrollTrigger
  if(window.gsap && window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(".s1",{x:-24, y:-40, rotate:-10, scrollTrigger:{trigger:".hero", start:"top top", end:"bottom top", scrub:true}});
    gsap.to(".s2",{x:36, y:-22, rotate:12, scrollTrigger:{trigger:".hero", start:"top top", end:"bottom top", scrub:true}});
    gsap.to(".s3",{x:-30, y:30, rotate:8, scrollTrigger:{trigger:".hero", start:"top top", end:"bottom top", scrub:true}});
    gsap.to(".s4",{x:28, y:36, rotate:-14, scrollTrigger:{trigger:".hero", start:"top top", end:"bottom top", scrub:true}});

    // Timeline grow
    const line = document.querySelector(".timeline .line");
    if(line){
      gsap.to(line, {
        height:"100%",
        ease:"none",
        scrollTrigger:{ trigger:"#timeline", start:"top 80%", end:"bottom 35%", scrub:true }
      });
      gsap.utils.toArray(".milestone .dot").forEach((dot)=>{
        gsap.to(dot, { opacity:1, scale:1, scrollTrigger:{trigger:dot, start:"top 85%", toggleActions:"play none none reverse"} });
      });
      gsap.utils.toArray(".milestone .content").forEach((card)=>{
        gsap.to(card, { opacity:1, y:0, scrollTrigger:{trigger:card, start:"top 85%", toggleActions:"play none none reverse"} });
      });
    }
  }

  // Language bars animate with IntersectionObserver
  const bars = document.getElementById("langBars");
  if(bars){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          document.querySelectorAll(".barRow").forEach(row=>{
            const pct = row.getAttribute("data-pct") || "0";
            row.querySelector(".barFill").style.width = pct + "%";
          });
          io.disconnect();
        }
      });
    }, {threshold:0.25});
    io.observe(bars);
  }

  // ---------- Goodreads RSS preview loader ----------
  async function loadGoodreadsPreview(rssUrl, profileUrl, listEl, maxItems){
    listEl.innerHTML = `<li class="previewItem"><div class="cover"></div><div><h4>Goodreads</h4><p class="muted">Loading your “read” shelf…</p></div></li>`;
    try{
      const res = await fetch(rssUrl, { cache:"no-store" });
      if(!res.ok) throw new Error("HTTP " + res.status);
      const xmlText = await res.text();
      const doc = new DOMParser().parseFromString(xmlText, "text/xml");
      const items = Array.from(doc.querySelectorAll("item")).slice(0, maxItems);

      if(items.length === 0) throw new Error("No items in RSS");

      listEl.innerHTML = "";
      items.forEach((item, i)=>{
        const rawTitle = item.querySelector("title")?.textContent?.trim() || "Untitled";
        const link = item.querySelector("link")?.textContent?.trim() || profileUrl;

        const smallImg = item.querySelector("book_small_image_url")?.textContent?.trim()
          || item.querySelector("book_image_url")?.textContent?.trim()
          || "";

        const note = item.querySelector("user_review")?.textContent?.trim()
          || item.querySelector("description")?.textContent?.trim()
          || "Open on Goodreads";

        const li = document.createElement("li");
        li.className = "previewItem";
        li.innerHTML = `
          <div class="cover">${smallImg ? `<img src="${escapeAttr(smallImg)}" alt="">` : `<img src="assets/images/book-${(i%3)+1}.svg" alt="">`}</div>
          <div>
            <h4>${escapeHtml(rawTitle)}</h4>
            <p>${escapeHtml(shorten(cleanText(note), 120))}</p>
            <p class="muted tiny"><a class="link" href="${escapeAttr(link)}" target="_blank" rel="noopener">Open on Goodreads →</a></p>
          </div>
        `;
        listEl.appendChild(li);
      });
    }catch(err){
      listEl.innerHTML = `
        <li class="previewItem">
          <div class="cover"><img src="assets/images/book-1.svg" alt=""></div>
          <div>
            <h4>Goodreads preview</h4>
            <p class="muted">Couldn’t load the feed in this browser (CORS/network). Click to open your shelf.</p>
            <p class="muted tiny"><a class="link" href="${escapeAttr(profileUrl)}" target="_blank" rel="noopener">Open Goodreads →</a></p>
          </div>
        </li>
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
