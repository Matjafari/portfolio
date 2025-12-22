# Mat Jafari Portfolio (Static · EN/FA/JA)

This is a clean starter version of the website you described:
- English default + Persian + Japanese language switch
- Hero cutout placeholder + 3D-ish sticker parallax on scroll (GSAP)
- Books preview + separate /books page
- Animated language bars
- Behance preview strip (placeholder thumbs + link)
- Filmmaking section + YouTube playlist embed
- Education timeline that grows on scroll
- Work experience, interests (Iaido + chess placeholder), social links

## 1) Links are already set
These are pre-filled:
- Instagram: https://www.instagram.com/matjafari/
- Telegram: https://t.me/matjafarii
- Behance: https://www.behance.net/matjafari
- Chess.com: https://www.chess.com/member/matjafari
- Goodreads: https://www.goodreads.com/user/show/53684401-mat (RSS read shelf preview)

If you want to change Aparat, edit it in `assets/js/app.js`.

## 2) Replace images
 Replace images
All images are in `assets/images/` as SVG placeholders.
Replace:
- `mat-cutout.svg` (your cut-out portrait)
- `mat-books.svg` (you among books)
- `iaido.svg` (your iaido photo)
Optionally replace the sticker SVGs too.

## 3) Preview locally (no setup headaches)
### Option A: VS Code Live Server
- Install extension "Live Server"
- Right click `index.html` → "Open with Live Server"

### Option B: Python (if you have it)
From the folder:
- `python -m http.server 8000`
Then open: http://localhost:8000

## 4) Deploy with GitHub Pages (later)
- Create a repo (e.g. `portfolio`)
- Upload all files
- GitHub → Settings → Pages
- Source: Deploy from branch
- Branch: main / root
Done.

## Notes
Chess.com recent games "live preview" usually needs an API call + CORS handling.
This template keeps it clean with a placeholder and a link, so the site works everywhere.
