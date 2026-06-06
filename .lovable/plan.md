
# Thinai360 AI — 4-Module Expansion Plan

You picked four major modules. Together that's ~7 new features, ~6 new tables, and 2 new edge functions. I'll ship in 4 phases so each one is reviewable and testable on its own.

---

## Phase 1 — Profit Prediction & Farm Economics
A calculator-style tool farmers open from the dashboard.

**UI (`src/components/ProfitPredictor.tsx`)**
- Inputs: crop, land area (acres), state/district (prefilled from form)
- Outputs: total investment, expected yield, gross revenue, net profit, ROI%
- "Alternative crops" panel showing 3 higher-profit options for same land/season

**Logic**
- Static per-crop cost & yield baseline (seed, fertilizer, labor, machinery, irrigation) in `src/data/cropEconomics.ts`
- Combined with live `market_prices` table for revenue calc
- Pure client-side math — no edge function needed

**Header tab:** "Profit Calculator"

---

## Phase 2 — Farm Health Score
Dashboard widget + dedicated page.

**UI (`src/components/FarmHealthScore.tsx`)**
- Big circular score (0–100) with sub-scores: Soil, Water, Disease Risk, Crop Performance
- Each sub-score has 2–3 improvement tips

**Logic**
- Scoring function combines user's profile (soil type, water availability, season) + recent disease detections + weather alerts
- No new table — derived from existing `profiles`, `weather_alerts`, etc.

**Header tab:** "Farm Health"

---

## Phase 3 — Cattle Buy & Sell Marketplace
Mirrors the labor/machinery marketplaces.

**New table `cattle_listings`**
- type (cow/buffalo/goat/sheep), breed, age_months, weight_kg, milk_yield_litres, vaccinated (bool), price, location/state/district, photos[], seller user_id, phone, description, status
- RLS: anyone authenticated can read; only owner can insert/update/delete
- GRANTs to authenticated + service_role

**UI (`src/components/CattleMarketplace.tsx`)**
- Browse with filters (type, breed, state)
- "List your cattle" form
- Card view with breed, age, milk yield, vaccination badge, price, contact

**Header tab:** "Livestock"

---

## Phase 4 — Market Intelligence + Expert Consultation + Agri Inputs

### 4a. Market Intelligence (`src/components/MarketIntelligence.tsx`)
- Reads existing `market_prices` table
- Price trend chart per crop (Recharts, already installed)
- "Best selling districts" leaderboard
- 7-day price change %

### 4b. Expert Consultation
- **New table `expert_consultations`**: user_id, subject, description, image_urls[], status (pending/answered), expert_response, created_at, answered_at
- **Edge function `expert-auto-response`**: uses Lovable AI to generate first-pass expert reply, marks status as `ai_answered`; real expert can override later
- UI: submit form + list of user's past consultations with responses

### 4c. Agri Input Marketplace
- **New table `agri_inputs`**: name, category (seed/fertilizer/pesticide/organic), brand, price, unit, stock, seller_id, image, description, verified
- Browse + filter UI; checkout is out-of-scope for this phase (contact seller via phone)

---

## Technical Details

- All new tables use the `GRANT SELECT, INSERT, UPDATE, DELETE ... TO authenticated; GRANT ALL ... TO service_role` pattern; no anon access.
- RLS: owners manage their own rows; authenticated users can read marketplace listings.
- Edge function `expert-auto-response` follows existing pattern (JWT verification, rate limit, Lovable AI Gateway with `google/gemini-2.5-flash`).
- All new tabs registered in `src/components/Header.tsx` and `src/pages/Index.tsx`.
- Reuse existing design tokens — no new colors.

---

## Suggested order
I'll build **Phase 1 first**, you review, then I move to Phase 2, etc. Reply "go" to start Phase 1, or tell me to reorder/skip phases.
