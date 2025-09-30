// src/components/MatchCard/MatchCard.tsx
import React from "react";
import { type Match } from "../../context/CurrentMatchContext";
import { Link } from "react-router-dom";

interface Props {
  match: Match;
  widthPx?: number;
  heightPx?: number;
  debug?: boolean;
}

/**
 * Reliable MatchCard
 * - Matches score entries to teams by shortname (primary) then full name (secondary).
 * - Only uses score entries where `r` (runs) is present.
 * - For Test: shows up to last 2 matched innings per team.
 * - Inning subtitle is taken from score.inning (no static text).
 * - Fixed-width score column to avoid layout shift.
 */
const MatchCard: React.FC<Props> = ({ match, widthPx = 260, heightPx = 150, debug = false }) => {
  const theme = typeof window !== "undefined" ? localStorage.getItem("theme") : "light";
  const isDark = theme === "dark";

  const scores: any[] = Array.isArray(match.score) ? match.score : [];

  if (debug && process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log("[MatchCard debug] scores raw:", scores);
  }

  // Normalize helpers
  const normalize = (s?: string) => (s ?? "").toString().trim().toLowerCase();

  // Return only score objects that have a runs value (defensive)
  const scoredEntries = scores.filter((s) => s && (s.r !== undefined && s.r !== null));

  // Strict matching: prefer shortname match (exact token) then full name substring.
  // We treat the inning string as source to search tokens.
  const matchesInningForShort = (inning: string, short?: string) => {
    if (!inning || !short) return false;
    const inn = normalize(inning);
    const tok = normalize(short);
    // token boundary check: ensure shortname appears as a whole token within inning text
    // e.g., "Zimbabwe Inning 1" contains "zim" ? not typical — but shortnames like "IND","AUS" should match.
    // We'll check word boundaries by surrounding with non-word char or start/end.
    const regex = new RegExp(`(^|[^a-z0-9])${escapeRegex(tok)}([^a-z0-9]|$)`, "i");
    return regex.test(inn);
  };

  const matchesInningForName = (inning: string, name?: string) => {
    if (!inning || !name) return false;
    const inn = normalize(inning);
    const nm = normalize(name);
    return inn.includes(nm);
  };

  // escape regex helper
  const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Get score entries that belong to a team, prioritizing shortname exact token matches
  const getTeamScores = (team?: { name?: string; shortname?: string }) => {
    if (!team) return [];
    const short = team.shortname ?? "";
    const name = team.name ?? "";

    // 1) shortname token matches
    const byShort = scoredEntries.filter((s) => typeof s.inning === "string" && matchesInningForShort(s.inning, short));
    if (byShort.length > 0) return byShort;

    // 2) fallback to full name substring match
    const byName = scoredEntries.filter((s) => typeof s.inning === "string" && matchesInningForName(s.inning, name));
    if (byName.length > 0) return byName;

    // 3) fallback: if counts equal to two teams and scoredEntries length equals 2, try to map by index
    // (this handles some APIs that use index ordering)
    if (scoredEntries.length >= 2 && match.teamInfo && match.teamInfo.length >= 2) {
      // try find which index this team occupies
      const idx = match.teamInfo.findIndex((t: any) => normalize(t.shortname) === normalize(short) || normalize(t.name) === normalize(name));
      if (idx >= 0 && scoredEntries[idx]) return [scoredEntries[idx]];
    }

    // 4) fallback single entry if only one available
    if (scoredEntries.length === 1) return [scoredEntries[0]];

    return [];
  };

  // Format helpers
  const formatFull = (s?: any) => {
    if (!s) return "-";
    const r = s.r ?? "-";
    const w = s.w ?? "-";
    const o = s.o ?? "-";
    return `${r}-${w} (${o})`;
  };

  const inningLabel = (s?: any) => {
    if (!s?.inning) return "";
    return String(s.inning).trim();
  };

  // Defensive team objects
  const teamA = match.teamInfo?.[0] ?? { shortname: match.teams?.[0], name: match.teams?.[0], img: "" };
  const teamB = match.teamInfo?.[1] ?? { shortname: match.teams?.[1], name: match.teams?.[1], img: "" };

  // Get matched scores per team (strict)
  const teamAScores = getTeamScores(teamA);
  const teamBScores = getTeamScores(teamB);

  // Prevent cross-assignment: if both lists point to same score objects, disambiguate by index fallback
  // (This rare case may occur if inning string is ambiguous). We'll attempt index mapping:
  const ensureDistinct = () => {
    if (teamAScores.length === 0 || teamBScores.length === 0) return;
    const same = teamAScores.some((a) => teamBScores.includes(a));
    if (!same) return;

    // prefer strict shortname mapping by index
    const byIndexA = scoredEntries[0] ? [scoredEntries[0]] : [];
    const byIndexB = scoredEntries[1] ? [scoredEntries[1]] : [];
    if (byIndexA.length && byIndexB.length) {
      // use index mapping only if it likely matches different teams
      return { a: byIndexA, b: byIndexB };
    }
    // as last resort keep original but slice to distinct by removing duplicates
    const uniqueA = teamAScores.filter((s) => !teamBScores.includes(s));
    const uniqueB = teamBScores.filter((s) => !teamAScores.includes(s));
    return { a: uniqueA.length ? uniqueA : teamAScores, b: uniqueB.length ? uniqueB : teamBScores };
  };

  const disambiguated = ensureDistinct();
  let displayA = teamAScores;
  let displayB = teamBScores;
  if (disambiguated) {
    displayA = disambiguated.a;
    displayB = disambiguated.b;
  }

  // Test match: show up to last 2 innings (most recent last)
  const isTest = String(match.matchType ?? "").toLowerCase().includes("test");
  const lastN = (arr: any[], n: number) => (arr.length <= n ? arr.slice() : arr.slice(arr.length - n));

  const renderForTeam = (team: any, matched: any[]) => {
    const use = isTest ? lastN(matched, 2) : matched.length ? [matched[matched.length - 1]] : [];
    return use;
  };

  const renderA = renderForTeam(teamA, displayA);
  const renderB = renderForTeam(teamB, displayB);

  if (debug && process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log("[MatchCard debug] A matches:", teamA.shortname, renderA, "B matches:", teamB.shortname, renderB);
  }

  return (
    <Link to={`/match/${match.id}`} target="_blank" rel="noopener noreferrer"
      className={`relative transform transition-transform duration-200 hover:scale-[1.03] ${isDark ? "text-gray-200" : "text-gray-800"}`}
      style={{ width: `${widthPx}px` }}
    >
      {/* floating pill */}
      <div
        className={`absolute -top-3 left-4 px-2 py-0.5 rounded-full text-[12px] font-medium shadow-sm ${isDark ? "bg-gray-700 text-gray-100" : "bg-white text-gray-700"}`}
      >
        {match.matchType ? String(match.matchType).toUpperCase() : "TBD"}
      </div>

      <div
        className="rounded-sm overflow-hidden border p-2"
        style={{
          height: `${heightPx}px`,
          boxSizing: "border-box",
          background: isDark ? "#0b1220" : "#ffffff",
          borderColor: isDark ? "#374151" : "#e5e7eb",
          boxShadow: isDark ? "0 10px 25px rgba(2,6,23,0.6)" : "0 40px 40px rgba(13,38,59,0.08)",
        }}
      >
        <div className="mb-1">
          <div className="text-[12px] font-semibold leading-tight truncate" title={match.name}>
            {match.name}
          </div>
        </div>

        <div className="grid gap-2" style={{ gridTemplateRows: "1fr 1fr", height: `calc(${heightPx}px - 56px)` }}>
          {[{ team: teamA, rows: renderA }, { team: teamB, rows: renderB }].map((row, i) => (
            <div key={i} className="flex items-center justify-between">
              {/* left: logo + shortname */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {row.team.img ? (
                  <img
                    src={row.team.img}
                    alt={row.team.name}
                    className="w-4 h-4 rounded-sm object-cover flex-shrink-0"
                    onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                  />
                ) : (
                  <div className="w-4 h-4 bg-gray-300 rounded-sm flex-shrink-0" />
                )}

                <div className="min-w-0">
                  <div className="text-[11px] font-medium truncate">{row.team.shortname ?? row.team.name}</div>
                  <div className="text-[10px] text-gray-400 truncate" title={row.rows.length ? inningLabel(row.rows[row.rows.length - 1]) : ""}>
                    {row.rows.length ? inningLabel(row.rows[row.rows.length - 1]) : ""}
                  </div>
                </div>
              </div>

              {/* right: fixed score column */}
              <div className="flex-shrink-0 ml-3 text-right" style={{ width: 92 }}>
                {row.rows && row.rows.length > 1 ? (
                  // stacked (older first, latest last)
                  <div className="flex flex-col items-end gap-0.5">
                    {row.rows.map((s: any, idx: number) => (
                      <div key={idx} className="text-[11px] leading-none font-medium" title={formatFull(s)}>
                        {formatFull(s)}
                      </div>
                    ))}
                  </div>
                ) : row.rows && row.rows.length === 1 ? (
                  <div className="text-[13px] font-bold" style={{ color: isDark ? "#fff" : "#111827" }}>
                    {formatFull(row.rows[0])}
                  </div>
                ) : (
                  <div className="text-[12px] text-gray-400">-</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* bottom */}
        <div className="mt-2 flex items-center justify-between text-[11px]">
          <div className="text-[11px] text-red-500 truncate" style={{ maxWidth: "62%" }}>
            {match.status}
          </div>
          <div className="flex gap-2 text-[11px] text-gray-400">
            <button className="px-2 py-0.5 rounded hover:underline">POINTS</button>
            <button className="px-2 py-0.5 rounded hover:underline">SCHEDULE</button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MatchCard;
