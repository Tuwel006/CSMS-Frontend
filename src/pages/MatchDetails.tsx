// src/pages/MatchDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import type { MatchDetails, Innings, PlayerBat, PlayerBowl } from "../types/ViewerMatch";
import type { Match } from "../context/CurrentMatchContext";
import defaultMatches from "../utils/DefaultMatchesData.json";
import { MatchService } from "../services/matchService";
import ScoreCard from "../components/ui/ScoreCard";

const Spinner: React.FC = () => (
  <div className="flex items-center justify-center py-10">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300" />
  </div>
);

const buildFallbackDetails = (m: Match): MatchDetails => {
  const scores = Array.isArray(m.score) ? m.score : [];
  const innings: Innings[] = scores.map((s) => ({
    inningLabel: s.inning ?? "",
    runs: s.r,
    wickets: s.w,
    overs: s.o,
    batting: [],
    bowling: [],
    extras: "",
  }));

  return {
    id: m.id,
    match: m as unknown as import("../types/ViewerMatch").Match,
    innings,
    scorecardUpdatedAt: new Date().toISOString(),
  };
};

const formatShort = (v?: string | number) => (v === undefined || v === null ? "-" : String(v));

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
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      setErr(null);
      try {
        const resp = await fetch(`/data/matchDetails/${id}.json`);
        if (resp.ok) {
          const json = await resp.json();
          setData(json as MatchDetails);
          setActiveInningIdx(0);
        } else {
          const found = (defaultMatches as Match[]).find((m) => m.id === id);
          if (found) {
            setData(buildFallbackDetails(found));
            setActiveInningIdx(0);
          } else {
            setErr("Match not found locally");
          }
        }
      } catch {
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

  useEffect(() => {
    const fetchMatches = async () => {
      setLoadingMatches(true);
      const activeMatchToken = localStorage.getItem('activeMatchToken');
      
      if (!activeMatchToken) {
        setMatches(defaultMatches as Match[]);
        setLoadingMatches(false);
        return;
      }

      try {
        const response = await MatchService.getMatchScore(activeMatchToken);
        if (response.data) {
          const matchWithScore: Match = {
            id: activeMatchToken,
            name: 'Current Match',
            matchType: response.data.meta.format,
            status: response.data.meta.status,
            venue: '',
            date: '',
            dateTimeGMT: response.data.meta.lastUpdated,
            teams: [response.data.teams.A.name, response.data.teams.B.name],
            teamInfo: [
              { name: response.data.teams.A.name, short: response.data.teams.A.short, shortname: response.data.teams.A.short, img: '' },
              { name: response.data.teams.B.name, short: response.data.teams.B.short, shortname: response.data.teams.B.short, img: '' }
            ],
            score: response.data.innings.map(inn => ({
              r: inn.score.r,
              w: inn.score.w,
              o: inn.score.o,
              inning: inn.battingTeam
            })),
            series_id: '',
            fantasyEnabled: false,
            bbbEnabled: false,
            hasSquad: false,
            matchStarted: true,
            matchEnded: response.data.meta.status === 'completed'
          };
          setMatches([matchWithScore]);
        } else {
          setMatches(defaultMatches as Match[]);
        }
      } catch {
        setMatches(defaultMatches as Match[]);
      } finally {
        setLoadingMatches(false);
      }
    };
    fetchMatches();
  }, []);

  const innings = data?.innings ?? [];
  const active = innings[activeInningIdx];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Match Cards Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Active Match</h2>
          <Link 
            to="/admin/team-management-new" 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <span>🎯</span>
            Try New Team Management Flow
          </Link>
        </div>
        {loadingMatches ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((match) => (
              <ScoreCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>

      {/* Match Detail Section - Only show if id exists */}
      {id && (
        <>
          {loading && <Spinner />}
          {err && <div className="p-6 text-center text-red-500">{err}</div>}
          {!loading && !err && data && (
            <div className="border-t pt-8">
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
                  <BattingTable rows={(active?.batting ?? []) as PlayerBat[]} />
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Bowling</h3>
                  <BowlingTable rows={(active?.bowling ?? []) as PlayerBowl[]} />
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
          )}
        </>
      )}
    </div>
  );
};

export default MatchDetail;
