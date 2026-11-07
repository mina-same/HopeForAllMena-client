# SEO Plan — Hope For All Mena

Site: https://www.hopeforallmena.com · Languages: English (`/`) and Arabic (`/ar/`) · Stack: Gatsby 5

## 1. Where we are (November 2026)

The live site was scored **54%** by Seobility, mainly because the server sent an empty HTML page:
0 words, no title, no description, no H1, no language tag. Google had to run JavaScript to see
anything, and social previews (WhatsApp, Facebook) showed nothing.

**Fixed in code (deploy needed to go live):**

| Item | Status |
|---|---|
| Pages rendered on the server (real HTML for crawlers) | Done (`layout.jsx`) |
| Title + meta description on every public page | Done, 54/54 pages |
| One H1 per page | Done, 54/54 pages |
| `<html lang>` + `dir="rtl"` for Arabic | Done |
| Canonical URL + hreflang (en / ar / x-default) | Done |
| Open Graph + Twitter cards for social sharing | Done (image = logo for now) |
| NGO structured data (schema.org JSON-LD) | Done |
| `sitemap-index.xml` (54 public URLs, private pages excluded) | Done |
| `robots.txt` (blocks admin, login, test pages) | Done |
| Image alt text on content images and logos | Done |
| Template leftovers ("Charity React Next Template") removed from titles | Done |
| Broken FAQ accordion (`Accordion.Toggle`) | Fixed |

All text used for titles, descriptions and alts was taken from the existing locale files. No copy was rewritten.

## 2. How it will look in Google

```
www.hopeforallmena.com
Hope For All Mena
Empowering church leaders across the Middle East and North Africa to
transform communities through intentional discipleship

www.hopeforallmena.com › training
Training - Hope For All Mena Ministry
Our goal is to train local churches through evangelistic and discipleship
curricula for the new generation...

www.hopeforallmena.com › ar › books
الكتب || Hope For All Mena Ministry
استكشف مجموعتنا الشاملة من الكتب المسيحية والموارد اللاهوتية...
```

When a page is shared on WhatsApp or Facebook it now shows the title, description and logo.

## 3. How people will find the site

| Channel | What to do |
|---|---|
| Google search (EN + AR) | Deploy the fixes, then submit the sitemap in Google Search Console |
| Bing / DuckDuckGo / Copilot | Submit the sitemap in Bing Webmaster Tools |
| Brand searches ("Hope For All Mena", "رجاء للجميع") | Create a Google Business Profile for the Cairo (Abbasiya) and Alexandria (Attarin) offices |
| Social sharing | Already works; add a 1200×630 share image later for better previews |
| Partner links | Ask partner churches, seminaries and ministries to link to the site (only 1 backlink today) |
| AI search (ChatGPT, Google AI Overviews) | Clear, factual page text helps; keep About / Training / Bible College pages detailed |

### Search terms to target (to be validated in Search Console after launch)

| Page | English | Arabic |
|---|---|---|
| Home | church leadership training Middle East | تدريب قادة الكنائس الشرق الأوسط |
| /training/ | church discipleship training Egypt | تدريب التلمذة للكنائس |
| /alexandria-bible-college/ | Alexandria Bible College | كلية الإسكندرية للكتاب المقدس |
| /evangelism-discipleship/ | children discipleship curriculum | منهج تلمذة الأطفال |
| /publishing-house/ , /books/ | Arabic Christian books | كتب مسيحية عربية |
| /magazines/ | Magazines of Hope | مجلات الرجاء |
| /sudanese-refugees/ | Sudanese refugees ministry Egypt | خدمة اللاجئين السودانيين في مصر |
| /development-department/ | church community development projects | مشروعات تنموية كنسية |

These are starting points, not measured volumes. Keep the ones that bring impressions in Search Console after 4–8 weeks.

## 4. Roadmap

**Phase 1 — Launch (week 1)**
1. Deploy the current build.
2. Re-run Seobility on the homepage (expect title, description, H1, language errors gone).
3. Verify the domain in Google Search Console and Bing Webmaster Tools; submit `https://www.hopeforallmena.com/sitemap-index.xml`.
4. Use URL Inspection → "Request indexing" for the home, training, books and Bible College pages.

**Phase 2 — Content clean-up (weeks 2–4) — needs text from the team**
1. Replace the Lorem Ipsum placeholder text on **/about/** (1 block) and **/causes/** (6 blocks).
2. Provide Arabic titles for the 7 pages that show English titles in Arabic:
   Causes, Events, Gallery, Services, Volunteers, Map, Become a Volunteer.
3. Provide a short description for the 12 pages still using the default description
   (About, Causes, Courses, Events, Gallery, Map, Services, Volunteers, Become a Volunteer, Enrollment, Magazine request, Training follow-up).
4. Decide on the theme demo pages (`/index-2/`, `/causes/`, `/gallery/`, `/volunteers/`): keep and fill with real content, or remove.

**Phase 3 — Technical polish (month 2)**
1. Reduce HTML size (~840 KB per page, mostly inlined CSS) for faster loading.
2. Create a 1200×630 share image (Open Graph image) for the homepage and main sections.
3. Add per-item structured data: `Book` on book pages, `Event` on event pages, `Course` on courses, `Article` on news.
4. Make book / news / event detail pages pre-rendered or server-rendered so each item gets its own indexable URL.
5. Rename odd URLs (`/bookDetils/`, `/Calendar/Calendar/`, `/TrainingSelectionPage/`) with redirects from the old paths.

**Phase 4 — Authority (months 3–12)**
1. Publish news/stories regularly (1–2 per month, in both languages).
2. Get listed by partner churches, seminaries and Christian directories in the region.
3. Keep Google Business Profiles updated with photos and events.

## 5. Targets

| Metric | Now | 3 months | 6 months | 12 months |
|---|---|---|---|---|
| Seobility on-page score (home) | 54% | 85%+ | 90%+ | 90%+ |
| Pages indexed in Google | unknown | 40+ | 50+ | all public pages |
| Referring domains | 1 | 5 | 15 | 30 |
| Monthly organic clicks (Search Console) | unknown | baseline | +50% | +150% |

## 6. How to re-check after any change

```bash
npx gatsby build
# then check public/index.html (and other pages) contain <title>, meta description, one <h1>, lang, canonical
```
Free external checks: Seobility SEO Checker, Google Rich Results Test (structured data),
PageSpeed Insights (speed), and Search Console → Pages report (indexing).
