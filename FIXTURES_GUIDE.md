# Fixture & Ballot Generator

Draws the fixtures for a tournament: a seeded knockout bracket, or a league
stage whose qualifiers feed a knockout.

Open it at **`/fixtures`** (also in the navigation drawer, "Fixtures").
Everything runs in the browser and is kept in that browser's local storage -
nothing is uploaded, and an unfinished draw survives a refresh.

---

## 1. Entering the field

**Ranked players** are typed in ranking order - row 1 is the #1 seed. Eight rows
are offered by default; add or remove rows for any number of seeds.

**Unranked players** go in as one player per line:

```
Arun Kumar, LASA
Priya S - Spin Academy
Rahul (Ace TT)
```

Comma, dash, pipe, tab and brackets all separate the club, and list numbering
(`1.`, `2)`, `-`) is stripped automatically.

**From a photo** - "Read names from a photo" runs text recognition on a picture
of the entry sheet and drops the result into the same box, where it can be
corrected before the draw. The recognition model is fetched on first use, so
the first photo of a session takes about a minute and needs an internet
connection; later photos are quick. Always check the names: handwriting and
unusual spellings get misread.

Repeated names are flagged - usually a line entered twice or a sheet
photographed twice.

---

## 2. Knockout draw

Seed positions are generated recursively, so one rule set covers 4, 8, 16, 32,
64 and 128-player brackets:

```
order(2)  = [1, 2]
order(2n) = for every seed s in order(n) -> [s, 2n + 1 - s]
```

which gives the traditional bracket:

| Bracket | First-round pairings |
| --- | --- |
| 8 | 1-8, 4-5, 2-7, 3-6 |
| 16 | 1-16, 8-9, 4-13, 5-12, 2-15, 7-10, 3-14, 6-11 |
| 32 | 1-32, 16-17, 8-25, 9-24, 4-29, 13-20, 5-28, 12-21, 2-31, 15-18, 7-26, 10-23, 3-30, 14-19, 6-27, 11-22 |

`#1` and `#2` sit in opposite halves and can only meet in the final, the top 4
land in different quarters and the top 8 in different eighths.

**Byes.** A field that is not a power of two is padded up to the next one - 13
players play a 16-slot bracket with 3 byes - and the byes go to the strongest
seeds (#1, #2, #3 here), never at random. Bye winners are pre-advanced into
round two.

**Ranked vs unranked.** The seeds take their protected positions first;
everyone else is drawn at random into what is left. Whenever the bracket is at
least twice the number of seeds (8 seeds in a 16+ bracket), that automatically
means every seed opens against an unranked player.

**Club rule.** Two players from the same club are kept apart in round one. The
draw repairs a clash by swapping interchangeable players only - an unranked
player for another unranked player - so no seed is ever moved out of position.
When a clash genuinely cannot be resolved, it is reported on the page rather
than quietly allowed.

**Draw seed.** Every draw carries a seed number. Entering the same seed
reproduces the identical draw, so a published draw can be re-checked afterwards.

---

## 3. League + knockout

Set the number of groups, how many qualify from each, and the points for a win
and a draw.

**Group sizes** differ by at most one - 30 players in 4 groups gives 8, 8, 7, 7.

**Ranked players** are spread by serpentine (snake) seeding, so no group
collects all the strength:

```
A    B    C    D
#1   #2   #3   #4
#8   #7   #6   #5
```

**Everyone else** is drawn at random into the remaining seats, preferring a
group that does not already hold a club-mate. When every group already holds
one - more club-mates than groups - the page says so.

**Fixtures** are single round robin by default (n x (n-1) / 2 matches),
optionally home and away. They are laid out in rounds, so nobody is scheduled
twice in the same round.

**Standings** update as results are typed in, ordered by points, then the
head-to-head mini-league between the tied players, then difference, then games
scored, then name.

**Qualifiers** are ranked globally: all group winners first (best winner is seed
1), then all runners-up, each block ordered by points, difference and games
scored. Those seeds go into the same knockout engine with one extra rule -
**two players from the same group cannot meet in the first knockout round** - so
a four-group, two-qualifier event comes out as A1 v B2, B1 v D2, C1 v A2,
D1 v C2 rather than A1 v A2.

---

## Output

Each draw can be copied as plain text (the form that gets pasted into a group
chat), downloaded as JSON, or printed - the print layout drops the controls and
keeps the brackets and tables.

---

## Where the code lives

| File | Purpose |
| --- | --- |
| `src/utils/fixtures/seeding.js` | Recursive seed order, byes, clash repair, bracket rounds |
| `src/utils/fixtures/league.js` | Groups, round robin, standings, qualifiers |
| `src/utils/fixtures/players.js` | Parsing pasted text and reading photos |
| `src/components/Fixtures/` | The page: player entry, knockout panel, league panel, bracket |
| `src/pages/Fixtures/FixturesPage.js` | Route target for `/fixtures` |

The three files under `src/utils/fixtures/` are plain functions with no React in
them, so they can be exercised from Node or a test runner on their own.
