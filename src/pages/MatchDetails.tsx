// src/pages/MatchDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { MatchDetails, Match, Innings, PlayerBat, PlayerBowl } from "../types/ViewerMatch";
import defaultMatches from "../utils/DefaultMatchesData.json"; // fallback list

const Spinner: React.FC = () => (
  <div className="flex items-center justify-center py-10">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300" />
  </div>
);

const buildFallbackDetails = (m: Match): MatchDetails => {
  // create a minimal fallback innings list using match.score
  const scores = Array.isArray(m.score) ? m.score : [];
  // map score entries to innings objects
  const innings: Innings[] = scores.map((s: any) => ({
    inningLabel: s.inning ?? "",
    runs: s.r,
    wickets: s.w,
    overs: s.o,
    batting: [], // no player-level data in fallback
    bowling: [],
    extras: s.extras ?? "",
  }));

  return {
    id: m.id,
    match: m,
    innings,
    scorecardUpdatedAt: new Date().toISOString(),
  };
};

const formatShort = (v?: any) => (v === undefined || v === null ? "-" : String(v));

const BattingTable: React.FC<{ rows: PlayerBat[] }> = ({ rows }) => (
  <table className="w-full text-sm">
    <thead>
      <tr className="text-left text-xs text-gray-500">
        <th className="pb-2">Batsman</th>
        <th className="pb-2 text-right">R</th>
        <th className="pb-2 text-right">B</th>
        <th className="pb-2 text-right">4s</th>
        <th className="pb-2 text-right">6s</th>
        <th className="pb-2 text-right">SR</th>
      </tr>
    </thead>
    <tbody>
      {rows.length === 0 ? (
        <tr><td colSpan={6} className="py-4 text-center text-gray-400">No batting data</td></tr>
      ) : rows.map((p, i) => (
        <tr key={i} className="border-b last:border-b-0">
          <td className="py-2">{p.name}<div className="text-xs text-gray-400">{p.dismissal ?? ""}</div></td>
          <td className="py-2 text-right">{p.runs ?? "-"}</td>
          <td className="py-2 text-right">{p.balls ?? "-"}</td>
          <td className="py-2 text-right">{p.fours ?? "-"}</td>
          <td className="py-2 text-right">{p.sixes ?? "-"}</td>
          <td className="py-2 text-right">{p.sr ?? "-"}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const BowlingTable: React.FC<{ rows: PlayerBowl[] }> = ({ rows }) => (
  <table className="w-full text-sm">
    <thead>
      <tr className="text-left text-xs text-gray-500">
        <th className="pb-2">Bowler</th>
        <th className="pb-2 text-right">O</th>
        <th className="pb-2 text-right">M</th>
        <th className="pb-2 text-right">R</th>
        <th className="pb-2 text-right">W</th>
        <th className="pb-2 text-right">Econ</th>
      </tr>
    </thead>
    <tbody>
      {rows.length === 0 ? (
        <tr><td colSpan={6} className="py-4 text-center text-gray-400">No bowling data</td></tr>
      ) : rows.map((p, i) => (
        <tr key={i} className="border-b last:border-b-0">
          <td className="py-2">{p.name}</td>
          <td className="py-2 text-right">{p.overs ?? "-"}</td>
          <td className="py-2 text-right">{p.maidens ?? "-"}</td>
          <td className="py-2 text-right">{p.runs ?? "-"}</td>
          <td className="py-2 text-right">{p.wickets ?? "-"}</td>
          <td className="py-2 text-right">{p.econ ?? "-"}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const MatchDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<MatchDetails | null>(null);
  const [activeInningIdx, setActiveInningIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setErr("Invalid match id");
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      setErr(null);
      try {
        // try to fetch detailed JSON from public folder (optional)
        const resp = await fetch(`/data/matchDetails/${id}.json`);
        if (resp.ok) {
          const json = await resp.json();
          setData(json as MatchDetails);
          setActiveInningIdx(0);
        } else {
          // fallback - find in defaultMatches (basic) and build details
          const found = (defaultMatches as Match[]).find((m) => m.id === id);
          if (found) {
            setData(buildFallbackDetails(found));
            setActiveInningIdx(0);
          } else {
            setErr("Match not found locally");
          }
        }
      } catch (e) {
        // fallback to defaultMatches
        const found = (defaultMatches as Match[]).find((m) => m.id === id);
        if (found) {
          setData(buildFallbackDetails(found));
        } else {
          setErr("Failed to load match details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) return <Spinner />;
  if (err) return <div className="p-6 text-center text-red-500">{err}</div>;
  if (!data) return <div className="p-6 text-center text-gray-500">No data</div>;

  const innings = data.innings ?? [];
  const active = innings[activeInningIdx];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-start gap-6">
        {/* Left: main detail */}
        <div className="flex-1">
          {/* header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">{data.match.name}</h1>
              <div className="text-sm text-gray-500">{data.match.venue} • {data.match.date}</div>
              <div className="mt-2 text-sm text-blue-600">{data.match.status}</div>
            </div>

            <div className="flex flex-col items-end space-y-2">
              <div className="text-sm text-gray-600">Updated: <span className="font-medium">{data.scorecardUpdatedAt ? new Date(data.scorecardUpdatedAt).toLocaleString() : "-"}</span></div>
              <div className="flex gap-2">
                <Link to="/" className="px-3 py-1 border rounded text-sm hover:bg-gray-50">Back</Link>
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Full scorecard</button>
              </div>
            </div>
          </div>

          {/* Innings tabs */}
          <div className="mb-4">
            <div className="flex gap-2 flex-wrap">
              {innings.length === 0 && <div className="text-gray-400">No innings data</div>}
              {innings.map((inn, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveInningIdx(idx)}
                  className={`px-3 py-1 text-sm rounded ${idx === activeInningIdx ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
                >
                  {inn.inningLabel ?? `Inning ${idx + 1}`} • {formatShort(inn.runs)}-{formatShort(inn.wickets)} ({formatShort(inn.overs)})
                </button>
              ))}
            </div>
          </div>

          {/* Score + batting + bowling */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 border rounded p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Score</div>
                    <div className="text-lg font-semibold">{active ? `${formatShort(active.runs)}-${formatShort(active.wickets)} (${formatShort(active.overs)})` : "-"}</div>
                  </div>
                  <div className="text-sm text-gray-500">Extras: {active?.extras ?? "-"}</div>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Batting</h3>
                  <BattingTable rows={(active?.batting ?? []) as any} />
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Bowling</h3>
                  <BowlingTable rows={(active?.bowling ?? []) as any} />
                </div>
              </div>
            </div>

            {/* Right column: summary and other info */}
            <aside className="space-y-4">
              <div className="bg-white dark:bg-gray-800 border rounded p-4 shadow-sm">
                <div className="text-sm text-gray-500">Match Summary</div>
                <div className="mt-2 text-sm">
                  <div><strong>{data.match.teams?.[0]}</strong> vs <strong>{data.match.teams?.[1]}</strong></div>
                  <div className="text-gray-500 text-sm mt-1">{data.match.venue}</div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 border rounded p-4 shadow-sm">
                <div className="text-sm text-gray-500">Quick Links</div>
                <ul className="mt-2 text-sm space-y-1">
                  <li><a className="text-blue-600">Full Scorecard</a></li>
                  <li><a className="text-blue-600">Match Commentary</a></li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetail;
