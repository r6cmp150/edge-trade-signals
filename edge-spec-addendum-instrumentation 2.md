# EDGE Trade Signals — Spec Addendum: Scoring Instrumentation
### (For Claude Code — append to existing spec, next version bump)

## Why This Addendum Exists

The June 2026 trade history (11 trades) showed a pattern worth tracking: winning
trades had *lower* avg RSI, *lower* volume ratio, and *lower* signal score than
losing trades — the opposite of what the scoring formula currently rewards. The
sample is too small to justify reweighting the formula yet, but the app currently
has no way to surface this pattern automatically — it had to be reverse-engineered
by hand from the raw trade log.

This addendum adds **logging and reporting only**. It does not change any scoring
weights, thresholds, or formulas. Goal: by the next Claude Report (after ~25-30
trades), the report should show these relationships without manual analysis.

---

## CHANGE 1: Log "Near-Miss" Signal Data

**Problem:** VOL_BUILD and MEAN_REVERSION fired on only 3 of 11 trades combined.
We can't tell yet whether the thresholds are well-calibrated or just rarely met,
because we don't record how close a stock got when it *didn't* fire.

**Requirement:**
At the time a stock is scored (whether or not it's bought), if VOL_BUILD or
MEAN_REVERSION did NOT fire, calculate and store how close it came:

- **VOL_BUILD near-miss:** if the rule requires 3 consecutive days rising volume
  + today ≥1.3x avg, store the actual consecutive-day count and the actual
  volume ratio, even when the rule doesn't fire.
- **MEAN_REVERSION near-miss:** if the rule requires price 8–15% below MA with
  RSI <45 turning up, store the actual % below MA and actual RSI, even when the
  rule doesn't fire.

This data only needs to be stored on stocks the user actually buys (attach to
the Portfolio entry record), not the full screener universe — keep it cheap.

**Add to Portfolio entry record (and carry through to Sold record):**
```
volBuildNearMiss: { consecutiveDays: N, volRatio: X }
meanReversionNearMiss: { pctBelowMA: X, rsi: X }
```

---

## CHANGE 2: Add RSI/Volume Buckets to the Claude Report

**Problem:** The report currently shows avg RSI and avg volume ratio for wins
vs losses as single numbers. A single average can hide the shape of the
relationship (e.g., "lower is better" vs "there's a sweet spot in the middle").

**Requirement:**
In the Generate Claude Report output, add bucketed breakdowns alongside the
existing averages:

```
RSI at purchase — win rate by bucket:
  <45:     {N} trades | {X}% win rate | avg outcome {X}%
  45–55:   {N} trades | {X}% win rate | avg outcome {X}%
  55–65:   {N} trades | {X}% win rate | avg outcome {X}%
  65+:     {N} trades | {X}% win rate | avg outcome {X}%

Volume ratio at purchase — win rate by bucket:
  <1.0x:   {N} trades | {X}% win rate | avg outcome {X}%
  1.0–2x:  {N} trades | {X}% win rate | avg outcome {X}%
  2–3x:    {N} trades | {X}% win rate | avg outcome {X}%
  3x+:     {N} trades | {X}% win rate | avg outcome {X}%

Signal score at purchase — win rate by bucket (already exists, keep as-is)
```

Buckets can be empty (0 trades) early on — that's fine, just show "N=0."

---

## CHANGE 3: Track Near-Miss Outcomes in the Report

**Requirement:**
Add a new report section using the data from Change 1:

```
=== NEAR-MISS SIGNAL ANALYSIS ===

VOL_BUILD near-misses (signal didn't fire, but close):
  Trades where consecutive days was 2 (needed 3): {N} | win rate {X}%
  Trades where vol ratio was 1.0–1.3x (needed 1.3x+): {N} | win rate {X}%

MEAN_REVERSION near-misses:
  Trades where price was 4–8% below MA (needed 8–15%): {N} | win rate {X}%
  Trades where RSI was 45–50 (needed <45): {N} | win rate {X}%
```

This tells us later whether the thresholds are roughly right (near-misses
perform worse than full fires) or too strict (near-misses perform just as
well, meaning the threshold should loosen).

---

## CHANGE 4: Don't Change Yet — Just Flag

**Requirement:**
At the top of the Generate Claude Report output, add an auto-generated flags
section that calls out when wins/losses diverge from what the formula assumes,
so this doesn't require manual digging in future reports:

```
=== AUTO-FLAGGED PATTERNS (informational only — not yet acted on) ===
{For each of RSI, volume ratio, signal score: if avg(losses) and avg(wins)
differ by more than 15% in either direction, print a one-line flag, e.g.:}

⚠ Avg RSI at purchase: wins {X} vs losses {X} — wins had LOWER RSI than losses.
  Current scoring rewards RSI 50-65 with 20pts. Sample size: {N} trades.
  Consider re-evaluating once sample reaches 25-30 trades.
```

This is purely descriptive — it should never auto-adjust scoring. It exists so
patterns get caught early without re-deriving them from the raw trade list
every time.

---

## CHANGE 5: Show Live Recalculated Target on Portfolio Cards

**Problem:** The target price recorded at purchase is frozen — it never updates.
But the target is calculated from ATR (the stock's average daily price range over
the last 14 days), which changes every scan. If a stock becomes more or less
volatile after you buy it, the original target is stale and potentially misleading.

**How the current target is calculated (from calcEntryTargetStop, line 1924):**
- Entry = current price
- ATR floor = max(ATR, price × 2%) — guarantees a minimum move even for
  low-volatility stocks
- Target multiplier by duration:
  - DAY  (RSI >68 or vol >3×):               1.0× ATR above entry
  - 3-DAY (RSI 52–68, vol 1.5–3×):           2.0× ATR above entry
  - WEEK  (RSI 48–60, trending, vol 1.2–1.8×): 3.5× ATR above entry
- Target = max(entry + ATR_floor × multiplier, entry × 1.02)
  — hard floor of 2% above entry regardless of ATR
- Stop-loss uses same ATR floor at 0.75×/1.0×/1.5× multiplier,
  capped at 5% below entry (entry × 0.95)

**Requirement:**
On each Portfolio card, show both the original frozen target AND a live
recalculated target using the same formula above but with today's current
price and today's recalculated ATR:

```
Original target: $6.18  →  Live target: $6.34  ⚠ Shifted
```

- If live target is within 5% of original: show only the original (no clutter)
- If live target has shifted more than 5% from original: show both, with a
  small "⚠ Shifted" flag next to the live target
- The existing sell warning "within 3% of target" should continue to use the
  ORIGINAL frozen target — do not change sell warning logic
- The live target is display-only and informational — it does not trigger any
  warnings or affect any other logic

**Also record in the Claude Report:**
```
Target drift at time of sale:
  Trades where live target was >5% higher than original:  {N} | win rate {X}%
  Trades where live target was >5% lower than original:   {N} | win rate {X}%
  Trades where live target was within 5% of original:     {N} | win rate {X}%
```

This will tell us over time whether target drift is a useful signal — e.g. if
stocks where the live target shifted significantly higher tend to win more, that's
a signal worth acting on in a future version.

---

## CHANGE 6: Cap Target at Nearest Resistance Level

**✅ DONE — implemented in v1.2.0 (2026-07-06).** Note: the 52-week-high
resistance level uses whatever bars are available at scoring time (~100-125
trading days in the screener/Portfolio paths, since `fetchMultiBars` hardcodes
a 180-day lookback regardless of the `limit` passed in) rather than a true
252-day window — a deliberate approximation (Option A) agreed on to avoid
widening the shared bars-fetch for the whole screener. The stock detail
modal's fallback path *does* get a true 252-day high52 since it already
fetches 300 bars independently. Swing high (10-day) and 20-day MA capping are
unaffected by this and are exact per spec.

**Problem:** The current target formula (calcEntryTargetStop, line 1924) is
calculated purely from ATR × multiplier with no awareness of where the stock
has actually traded recently. This means the formula routinely sets targets
above the stock's 52-week high, or above a recent price ceiling the stock
has failed to break through multiple times — levels that are very unlikely to
be reached in a 1–7 day hold window.

The app already fetches 90 days of historical OHLCV data per the spec
(screener step 4: "fetch 90-day historical OHLCV for RSI, ATR, chart, volume
averages, 52-week high/low"). The spec also displays 52-week high in the Stock
Detail Modal. This data is already available — it just isn't being used in the
target calculation.

**Requirement:**
Modify calcEntryTargetStop to calculate three resistance levels from existing
data, then cap the raw ATR-based target at the nearest one above entry:

**Resistance Level 1 — 52-week high:**
Already calculated and displayed in the modal. If the ATR-based target exceeds
the 52-week high, cap target at (52-week high × 0.98) — leaving a 2% buffer
below it since stocks often stall just before retesting a 52-week high.

**Resistance Level 2 — Recent swing high:**
From the 90-day OHLCV data already fetched, find the highest daily high in the
last 10 trading days (excluding today). This is the most recent price ceiling
the stock has encountered. If the ATR-based target exceeds this level, cap
target at (10-day swing high × 0.99) — a 1% buffer.

**Resistance Level 3 — 20-day MA when price is below it:**
If the current price is BELOW the 20-day MA (which is already calculated for
the "Above 20-day MA" scoring signal), the 20-day MA itself acts as resistance.
Cap target at (20-day MA × 0.99) in this case.

**Capping logic (apply in this order):**
```
rawTarget = entry + (ATR_floor × multiplier)   // existing formula unchanged

// Find the nearest resistance ceiling above entry price
resistanceLevels = [
  52weekHigh × 0.98,
  tenDaySwingHigh × 0.99,
  (price < MA20) ? MA20 × 0.99 : null
].filter(level => level > entry && level !== null)

nearestResistance = min(resistanceLevels)  // closest ceiling above entry

// Cap: if rawTarget exceeds nearest resistance, use resistance instead
finalTarget = (nearestResistance && rawTarget > nearestResistance)
  ? nearestResistance
  : rawTarget

// Preserve existing 2% floor — target must always be at least 2% above entry
finalTarget = max(finalTarget, entry × 1.02)
```

**On the stock card and detail modal:**
If the target was capped by a resistance level, show a small label explaining
why, e.g.:
- "Target capped at 52wk high"
- "Target capped at recent swing high"
- "Target capped at 20-day MA"

This helps Roman understand why a target looks conservative and builds trust
in the formula rather than leaving it unexplained.

**Also record in the Claude Report:**
```
Target capping at time of purchase:
  Trades where target was capped by 52-week high:    {N} | win rate {X}%
  Trades where target was capped by swing high:      {N} | win rate {X}%
  Trades where target was capped by 20-day MA:       {N} | win rate {X}%
  Trades where target was NOT capped (ATR ruled):    {N} | win rate {X}%
```

---

## CHANGE 7: Use Trimmed ATR to Exclude Spike Day Outliers

**✅ DONE — implemented in v1.2.0 (2026-07-06).** New `calcTrimmedATR` function
added; every `calcEntryTargetStop` call site (screener scoring, stock detail
modal, and the Change 5 live-target recalculation) now passes the trimmed
ATR. `calcATR` (simple/untrimmed) is unchanged and still feeds the Risk Score
formula at both its call sites, exactly as specified.

**Problem:** The current ATR calculation (spec section "ATR Calculation") uses
a simple 14-day average of True Range values. For the low-priced, volatile
stocks in the seed list (biotech, meme-adjacent, energy penny stocks), a single
abnormal spike day — e.g. an FDA announcement or short squeeze — can inflate
ATR significantly for the following 14 trading days even after the stock returns
to normal behavior. This causes targets to be set based on a level of volatility
that no longer exists.

**Current ATR formula (from spec):**
```
ATR = sum of 14 True Range values / 14
```

**Requirement:**
Replace the simple average with a trimmed average that excludes the single
highest True Range day before averaging. This is a one-line change to the
ATR calculation:

```
// Current (simple average):
ATR = sum(trueRanges[0..13]) / 14

// New (trimmed average — drop the single highest day):
sortedRanges = trueRanges.sort(ascending)
ATR = sum(sortedRanges[0..12]) / 13   // 13 values, highest excluded
```

**Why only trim the top 1:**
Trimming more than one outlier starts to underestimate true volatility on
legitimately active stocks. Trimming just the single highest day removes the
most distorting event while preserving the real character of the stock's
movement.

**Impact on stop-loss:**
The same trimmed ATR should be used for stop-loss calculation (also in
calcEntryTargetStop) — a calmer ATR means a tighter stop, which is correct
behavior since we don't want the stop set based on a one-time spike.

**What this does NOT change:**
- The ATR-as-%-of-price calculation used in the Risk Score formula should
  continue using the SIMPLE (untrimmed) ATR — because for risk scoring we
  WANT to know if a stock recently had a violent move, that's relevant risk
  information. Only the target/stop calculation uses the trimmed ATR.

**Also record in the Claude Report:**
```
ATR trimming impact at time of purchase:
  Avg raw ATR across all trades:     {X}
  Avg trimmed ATR across all trades: {X}
  Avg reduction from trimming:       {X}% smaller
```

This tells us over time whether the trimming is making a meaningful difference
or whether spike days are rare enough that it barely matters.

---

## What This Addendum Does NOT Do

- Does not change point values in the Scoring System
- Does not change Risk Score formula (Risk Score keeps using simple/untrimmed ATR
  — see Change 7 for why this is intentional)
- Does not change Trade Duration classification thresholds
- Does not change VOL_BUILD / MEAN_REVERSION firing thresholds
- Does not change sell warning logic — SELL NOW / SELL SOON warnings continue
  to use the original frozen target recorded at purchase
- Does not act on any scoring pattern automatically — flags are for Roman to
  read and decide on manually
- Change 5 (live target display) is display-only — it triggers no warnings

## What This Addendum DOES Change to the Target Formula

Changes 6 and 7 modify calcEntryTargetStop directly:

- **Change 6** caps the ATR-based target at the nearest resistance level above
  entry (52-week high, 10-day swing high, or 20-day MA if price is below it)
- **Change 7** replaces the simple 14-day ATR average with a trimmed 13-day
  average that excludes the single highest True Range day

These two changes work together: Change 7 produces a more realistic ATR, and
Change 6 ensures the resulting target never exceeds a price level the stock
has historically struggled to break through.

---

## Version Note

Changes 1–5 are logging and display additions only (no formula changes).
Changes 6–7 modify the target price calculation in calcEntryTargetStop.
Recommend implementing in two separate Claude Code sessions:
  - Session 1: Changes 1–5 (safe, no formula risk)
  - Session 2: Changes 6–7 (formula changes, review carefully before committing)

Each session should be a separate version bump.
