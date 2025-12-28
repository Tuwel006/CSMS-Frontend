import React, { useRef, useState } from 'react';
import ConfirmDialog from './ConfirmDialog';

type Player = {
  id: string;
  label: string; // original label (could be player name or role)
  short: string;
  x: number; // percent [0..100]
  y: number; // percent [0..100]
  color?: string;
  assignedPosition?: string; // current fielding position name
  role?: 'fielder' | 'batsman' | 'umpire';
};

const clamp = (v: number, a = 0, b = 100) => Math.max(a, Math.min(b, v));

function shortName(label: string) {
  return label
    .split(' ')
    .map((p) => p[0])
    .slice(0, 3)
    .join('')
    .toUpperCase();
}

export default function CricketField({ width = 900, height = 700 }: { width?: number; height?: number }) {
  // named fixed positions on the field (expanded to match the reference diagram)
  // Coordinates are approximate percent positions inside the circular field.
  // NOTE: we flip the vertical axis (y -> 100 - y) below so the diagram's
  // bottom corresponds to the bowler side and the top to the batsman side
  // (matches the provided reference orientation).
  const _rawPositions: { id: string; name: string; x: number; y: number; type: 'field' | 'batting' | 'umpire' }[] = [
    { id: 'bowler', name: 'Bowler', x: 50, y: 42, type: 'field' },
    { id: 'batsman1', name: 'Striker', x: 50, y: 58, type: 'batting' },
    { id: 'batsman2', name: 'Non-Striker', x: 50, y: 36, type: 'batting' },
    { id: 'keeper', name: 'Keeper', x: 50, y: 74, type: 'field' },
    { id: 'slip', name: 'Slip', x: 46, y: 68, type: 'field' },
    { id: 'gully', name: 'Gully', x: 44, y: 62, type: 'field' },
    { id: 'point', name: 'Point', x: 34, y: 58, type: 'field' },
    { id: 'deep_point', name: 'Deep Point', x: 26, y: 52, type: 'field' },
    { id: 'cover', name: 'Cover', x: 30, y: 46, type: 'field' },
    { id: 'extra_cover', name: 'Extra Cover', x: 28, y: 40, type: 'field' },
    { id: 'mid_off', name: 'Mid-off', x: 36, y: 32, type: 'field' },
    { id: 'mid_on', name: 'Mid-on', x: 64, y: 32, type: 'field' },
    { id: 'square_leg', name: 'Square Leg', x: 68, y: 58, type: 'field' },
    { id: 'fine_leg', name: 'Fine Leg', x: 74, y: 78, type: 'field' },
    { id: 'third_man', name: 'Third Man', x: 82, y: 54, type: 'field' },
    { id: 'short_third_man', name: 'Short Third Man', x: 70, y: 44, type: 'field' },
    { id: 'deep_cover', name: 'Deep Cover', x: 18, y: 74, type: 'field' },
    { id: 'deep_extra_cover', name: 'Deep Extra Cover', x: 18, y: 62, type: 'field' },
    { id: 'long_off', name: 'Long Off', x: 26, y: 19, type: 'field' },
    { id: 'long_on', name: 'Long On', x: 74, y: 19, type: 'field' },
    { id: 'deep_mid_wicket', name: 'Deep Mid-Wicket', x: 68, y: 80, type: 'field' },
    { id: 'forward_square_leg', name: 'Forward Sq. Leg', x: 76, y: 58, type: 'field' },
    { id: 'deep_square', name: 'Deep Square', x: 82, y: 68, type: 'field' },
    // umpires
    { id: 'umpire1', name: 'U-1', x: 50, y: 30, type: 'umpire' },
    { id: 'umpire2', name: 'U-2', x: 60, y: 58, type: 'umpire' },
  ];

  // flip vertical axis so top/bottom orientation matches reference image
  const positions = _rawPositions.map((p) => ({ ...p, y: 100 - p.y }));

  // derive display positions (clamped) from the positions
  const displayPositions = positions.map((pos) => ({ ...pos }));

  // Indian batting team substitutes
  const initialBattingSubstitutes: Player[] = [
    { id: 'batSub1', label: 'Ishan Kishan', short: shortName('Ishan Kishan'), x: 0, y: 0, color: '#ffe082', role: 'batsman' },
    { id: 'batSub2', label: 'Suryakumar Yadav', short: shortName('Suryakumar Yadav'), x: 0, y: 0, color: '#ffd1dc', role: 'batsman' },
    { id: 'batSub3', label: 'Rishabh Pant', short: shortName('Rishabh Pant'), x: 0, y: 0, color: '#c8e6c9', role: 'batsman' },
  ];

  // Australian fielding team (playing 11)
  const initialFieldingTeam = [
    { id: 'field1', name: 'David Warner' },
    { id: 'field2', name: 'Travis Head' },
    { id: 'field3', name: 'Marnus Labuschagne' },
    { id: 'field4', name: 'Steve Smith' },
    { id: 'field5', name: 'Glenn Maxwell' },
    { id: 'field6', name: 'Alex Carey' },
    { id: 'field7', name: 'Pat Cummins' },
    { id: 'field8', name: 'Mitchell Starc' },
    { id: 'field9', name: 'Josh Hazlewood' },
    { id: 'field10', name: 'Adam Zampa' },
    { id: 'field11', name: 'Sean Abbott' },
  ];

  // Australian substitutes
  const initialFieldingSubstitutes: Player[] = [
    { id: 'fieldSub1', label: 'Marcus Stoinis', short: shortName('Marcus Stoinis'), x: 0, y: 0, color: '#ffe082', role: 'fielder' },
    { id: 'fieldSub2', label: 'Cameron Green', short: shortName('Cameron Green'), x: 0, y: 0, color: '#ffd1dc', role: 'fielder' },
    { id: 'fieldSub3', label: 'Matthew Short', short: shortName('Matthew Short'), x: 0, y: 0, color: '#c8e6c9', role: 'fielder' },
    { id: 'fieldSub4', label: 'Josh Inglis', short: shortName('Josh Inglis'), x: 0, y: 0, color: '#b2dfdb', role: 'fielder' },
  ];

  // start with an empty field — we'll place players from the upcoming list
  const [playersOnField, setPlayersOnField] = useState<Player[]>([]);
  const [battingSubstitutes] = useState<Player[]>(initialBattingSubstitutes);
  const [fieldingTeam, setFieldingTeam] = useState(initialFieldingTeam);
  const [fieldingSubstitutes, setFieldingSubstitutes] = useState<Player[]>(initialFieldingSubstitutes);
  const [selectedStandbyId, setSelectedStandbyId] = useState<string | null>(null);
  const [selectedOnFieldId, setSelectedOnFieldId] = useState<string | null>(null);
  const [selectedBattingId, setSelectedBattingId] = useState<string | null>(null);
  const [selectedFieldingId, setSelectedFieldingId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(true);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(true);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [showRegions, setShowRegions] = useState(true);

  // Ball mode / magic
  const [ballMode, setBallMode] = useState(false);
  const [isBallDragging, setIsBallDragging] = useState(false);
  const [ballStart, setBallStart] = useState<{ x: number; y: number } | null>(null);
  const [ballCurrent, setBallCurrent] = useState<{ x: number; y: number } | null>(null);
  const [showOutcomeDialog, setShowOutcomeDialog] = useState(false);
  const [landingOutsideBoundary, setLandingOutsideBoundary] = useState(false);
  const [pendingOutcome, setPendingOutcome] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeBatsmanId, setActiveBatsmanId] = useState<string | null>(null);

  // 3D-like controls
  const [tilt, setTilt] = useState(0); // degrees of rotateX
  const [zoom, setZoom] = useState(1);
  const [rotateY, setRotateY] = useState(0); // degrees rotateY
  const rotatingRef = useRef<{ startX: number; startY: number; startTilt: number; startRotateY: number } | null>(null);
  const [rotateActive, setRotateActive] = useState(false);
  const touchTimerRef = useRef<number | null>(null);

  // Team India batting lineup
  const initialBattingTeam = [
    { id: 'batTeam1', name: 'Rohit Sharma' },
    { id: 'batTeam2', name: 'Shubman Gill' },
    { id: 'batTeam3', name: 'Virat Kohli' },
    { id: 'batTeam4', name: 'Shreyas Iyer' },
    { id: 'batTeam5', name: 'KL Rahul' },
    { id: 'batTeam6', name: 'Hardik Pandya' },
    { id: 'batTeam7', name: 'Ravindra Jadeja' },
    { id: 'batTeam8', name: 'Mohammed Shami' },
    { id: 'batTeam9', name: 'Kuldeep Yadav' },
    { id: 'batTeam10', name: 'Jasprit Bumrah' },
    { id: 'batTeam11', name: 'Mohammed Siraj' },
  ];
  // split batting list into upcoming, out (outs), substitutes (standby already exists)
  const [upcomingBatters, setUpcomingBatters] = useState(initialBattingTeam.map(b => ({ id: b.id, name: b.name })));
  const [outPlayers, setOutPlayers] = useState<{ id: string; name: string }[]>([]);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const draggingRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const pendingDownRef = useRef<{ id: string; startX: number; startY: number } | null>(null);

  const toSvgCoords = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const inv = ctm.inverse();
    const loc = pt.matrixTransform(inv);
    // convert to percent
    return { x: (loc.x / width) * 100, y: (loc.y / height) * 100 };
  };

  // clamp a percent position to inside the circular boundary
  // threshold in percent to snap to a named position
  const SNAP_THRESHOLD = 6; // percent (smaller regions)

  const clampToBoundary = (xPercent: number, yPercent: number) => {
    // compute and clamp in pixel-space so the visual circle (which uses
    // Math.min(width,height) for radius) matches the math used here
    const cxPx = (centerX / 100) * width;
    const cyPx = (centerY / 100) * height;
    const xPx = (xPercent / 100) * width;
    const yPx = (yPercent / 100) * height;
    const rPx = (boundaryRadius / 100) * Math.min(width, height);

    const dx = xPx - cxPx;
    const dy = yPx - cyPx;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d <= rPx) {
      return { x: xPercent, y: yPercent };
    }
    const scale = rPx / d;
    const nx = cxPx + dx * scale;
    const ny = cyPx + dy * scale;
    return { x: (nx / width) * 100, y: (ny / height) * 100 };
  };

  const handlePointerDown = (e: React.PointerEvent, p: Player) => {
    // If ball mode is on, initiate a ball drag starting from the bowler location
    if (ballMode) {
      // Only Striker can initiate ball drags in ball mode
      if (p.role === 'batsman' && p.assignedPosition === 'Striker') {
        if (activeBatsmanId === p.id) {
          // begin ball drag from striker
          setBallStart({ x: p.x, y: p.y });
          setBallCurrent({ x: p.x, y: p.y });
          setIsBallDragging(true);
          return;
        }
        // set striker as active
        setActiveBatsmanId(p.id);
        pendingDownRef.current = { id: p.id, startX: (e as any).clientX, startY: (e as any).clientY };
        return;
      }
      // Non-Striker cannot initiate ball drags
      if (p.role === 'batsman' && p.assignedPosition === 'Non-Striker') {
        return;
      }
      // otherwise start a ball drag (default bowler start)
      const bowler = playersOnField.find((pl) => pl.assignedPosition === 'Bowler');
      const start = bowler ? { x: bowler.x, y: bowler.y } : toSvgCoords(e.clientX, e.clientY);
      setBallStart(start);
      setBallCurrent(start);
      setIsBallDragging(true);
      // prevent player drag
      return;
    }

    // Umpires and batsmen are fixed - not draggable
    if (p.role === 'umpire' || p.role === 'batsman') return;
    (e.target as Element).setPointerCapture(e.pointerId);
    const start = toSvgCoords(e.clientX, e.clientY);
    draggingRef.current = { id: p.id, offsetX: start.x - p.x, offsetY: start.y - p.y };
  };

  // place a selected player onto a named position/region
  const handleRegionClick = (pos: { id: string; name: string; x: number; y: number; type: string }) => {
    // Handle batting team placement (only on batting positions)
    if (selectedBattingId && pos.type === 'batting') {
      const upcoming = upcomingBatters.find(u => u.id === selectedBattingId);
      if (!upcoming) return;
      const newPlayer: Player = {
        id: upcoming.id,
        label: upcoming.name,
        short: shortName(upcoming.name),
        x: pos.x,
        y: pos.y,
        color: '#ffd54f',
        assignedPosition: pos.name,
        role: 'batsman',
      };
      setPlayersOnField(prev => [...prev, newPlayer]);
      setUpcomingBatters(prev => prev.filter(u => u.id !== upcoming.id));
      setSelectedBattingId(null);
      return;
    }
    
    // Handle fielding team placement (only on field positions)
    if (selectedFieldingId && pos.type === 'field') {
      const fielder = fieldingTeam.find(f => f.id === selectedFieldingId);
      if (!fielder) return;
      const newPlayer: Player = {
        id: fielder.id,
        label: fielder.name,
        short: shortName(fielder.name),
        x: pos.x,
        y: pos.y,
        color: '#4fc3f7',
        assignedPosition: pos.name,
        role: 'fielder',
      };
      setPlayersOnField(prev => [...prev, newPlayer]);
      setFieldingTeam(prev => prev.filter(f => f.id !== fielder.id));
      setSelectedFieldingId(null);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // rotation mode if set
    if (rotatingRef.current) {
      const svg = svgRef.current;
      if (!svg) return;
      const dx = e.clientX - rotatingRef.current.startX;
      const dy = e.clientY - rotatingRef.current.startY;
      // horizontal drag -> rotateY, vertical drag -> tilt
      setRotateY(rotatingRef.current.startRotateY + dx * 0.2);
      setTilt(Math.max(-45, Math.min(45, rotatingRef.current.startTilt - dy * 0.2)));
      return;
    }
    // if there's a pending down (after activating a batsman) check for small movement to start a ball drag
    if (pendingDownRef.current && ballMode && !isBallDragging) {
      const dx = e.clientX - pendingDownRef.current.startX;
      const dy = e.clientY - pendingDownRef.current.startY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 6) {
        // start ball drag from that batsman
        const player = playersOnField.find((pl) => pl.id === pendingDownRef.current!.id);
        if (player) {
          setBallStart({ x: player.x, y: player.y });
          setBallCurrent({ x: player.x, y: player.y });
          setIsBallDragging(true);
        }
        pendingDownRef.current = null;
      }
    }
    if (!draggingRef.current) return;
    const pt = toSvgCoords(e.clientX, e.clientY);
    const { id, offsetX, offsetY } = draggingRef.current;
    const rawX = pt.x - offsetX;
    const rawY = pt.y - offsetY;
    const clamped = clampToBoundary(clamp(rawX), clamp(rawY));
    setPlayersOnField((prev) => prev.map((pl) => (pl.id === id ? { ...pl, x: clamped.x, y: clamped.y } : pl)));
  };

  // Ball drag move (when ball mode is active)
  const handleBallPointerMove = (e: React.PointerEvent) => {
    if (!isBallDragging) return;
    const pt = toSvgCoords(e.clientX, e.clientY);
    setBallCurrent({ x: pt.x, y: pt.y });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    // finish rotating if active
    if (rotatingRef.current) {
      rotatingRef.current = null;
      return;
    }
    // if ball dragging, finish ball flow
    if (isBallDragging) {
      setIsBallDragging(false);
      // compute raw drop location
      const pt = toSvgCoords(e.clientX, e.clientY);
      // compute pixel-space center and radius
      const cxPx = (centerX / 100) * width;
      const cyPx = (centerY / 100) * height;
      const xPx = (pt.x / 100) * width;
      const yPx = (pt.y / 100) * height;
      const rPx = (boundaryRadius / 100) * Math.min(width, height);
      const dx = xPx - cxPx;
      const dy = yPx - cyPx;
      const d = Math.sqrt(dx * dx + dy * dy);
      const outside = d >= rPx - 1; // near boundary or outside
      setLandingOutsideBoundary(outside);
      // show outcome dialog according to location
      setShowOutcomeDialog(true);
      // clear batsman active state when a ball has been delivered
      setActiveBatsmanId(null);
      return;
    }
    if (!draggingRef.current) return;
    const drag = draggingRef.current;
    const draggedId = drag.id;
    // compute drop location
    const pt = toSvgCoords(e.clientX, e.clientY);

    // find nearest named position (use displayPositions which are clamped)
    let nearest = displayPositions[0];
    let bestD = Infinity;
    for (const pos of displayPositions) {
      const dx = pos.x - pt.x;
      const dy = pos.y - pt.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < bestD) {
        bestD = d;
        nearest = pos;
      }
    }

  // threshold in percent to snap (shared constant)
  // const SNAP_THRESHOLD = 10; // percent

    setPlayersOnField((prev) => {
      const dragged = prev.find((p) => p.id === draggedId);
      if (!dragged) return prev;

      // if nearest is close enough, snap and update assignedPosition. If occupied, swap.
      if (bestD <= SNAP_THRESHOLD) {
          // enforce type compatibility: dragged player's role must be allowed at nearest.position.type
          const draggedPlayer = prev.find((pp) => pp.id === draggedId);
          if (!draggedPlayer) return prev;
          const role = draggedPlayer.role || 'fielder';
          const allowed = ((): boolean => {
            if (nearest.type === 'umpire') return role === 'umpire';
            if (nearest.type === 'batting') return role === 'batsman';
            return role === 'fielder' || role === 'batsman'; // allow batsmen to be field? we prevent by mapping batting positions only; here keep field open to both if desired
          })();
          if (!allowed) {
            // not allowed to occupy this position -> keep at dropped location (no snap)
            return prev.map((p) => (p.id === draggedId ? { ...p, x: clamp(pt.x - drag.offsetX), y: clamp(pt.y - drag.offsetY) } : p));
          }

          // find players already assigned to this named position
          const already = prev.filter((p) => p.assignedPosition === nearest.name && p.id !== draggedId);

          // If position already has someone, and role compatibility allows a swap,
          // perform swap; otherwise place the new player nearby (offset) so they
          // appear close to the named position but not stacked exactly.
          if (already.length > 0) {
            const occupied = already[0];
            const occupiedAllowed = ((): boolean => {
              const occRole = occupied.role || 'fielder';
              if (nearest.type === 'umpire') return occRole === 'umpire';
              if (nearest.type === 'batting') return occRole === 'batsman';
              return occRole === 'fielder' || occRole === 'batsman';
            })();
            if (occupiedAllowed) {
              // swap with the first occupant
              return prev.map((p) => {
                if (p.id === draggedId) return { ...p, x: occupied.x, y: occupied.y, assignedPosition: occupied.assignedPosition };
                if (p.id === occupied.id) return { ...p, x: dragged.x, y: dragged.y, assignedPosition: dragged.assignedPosition };
                return p;
              });
            }
            // not allowed to swap; fall through to place nearby
          }

          // place player near the named position with a small offset to avoid stacking
          const offsetStep = 2; // percent offset between stacked players (smaller)
          const baseCount = already.length;
          // arrange offsets in a circular pattern around the named position
          const angle = (baseCount * 60) * (Math.PI / 180);
          const ox = Math.cos(angle) * offsetStep;
          const oy = Math.sin(angle) * offsetStep;
          const placedX = clamp(nearest.x + ox);
          const placedY = clamp(nearest.y + oy);
          return prev.map((p) => (p.id === draggedId ? { ...p, x: placedX, y: placedY, assignedPosition: nearest.name } : p));
      }

  // otherwise revert to previous assigned position (do not allow arbitrary placement)
  return prev.map((p) => (p.id === draggedId ? { ...p, x: p.x, y: p.y } : p));
    });

    try { (e.target as Element).releasePointerCapture(e.pointerId); } catch {}
    draggingRef.current = null;
    // clear any pending down after finishing interaction
    pendingDownRef.current = null;
  };

  // handle user selecting an outcome option
  const handleSelectOutcome = (opt: string) => {
    setPendingOutcome(opt);
    setShowConfirm(true);
  };

  const handleConfirmOutcome = () => {
    // TODO: persist or emit result (for now log)
    console.log('Ball outcome confirmed:', pendingOutcome, { landingOutsideBoundary, ballStart, ballCurrent });
    setShowConfirm(false);
    setShowOutcomeDialog(false);
    setPendingOutcome(null);
    // if desired, disable ball mode automatically
    // setBallMode(false);
  };

  const handleCancelOutcome = () => {
    setShowConfirm(false);
    setPendingOutcome(null);
  };

  // swap a fielding substitute into the clicked on-field player slot
  const swapIn = (standbyId: string, onFieldId: string) => {
    const s = fieldingSubstitutes.find((st) => st.id === standbyId);
    const on = playersOnField.find((pl) => pl.id === onFieldId);
    if (!s || !on) return;
    // enforce role compatibility: substitute.role must be allowed at on.assignedPosition's type
    const pos = positions.find((p) => p.name === on.assignedPosition);
    const posType = pos?.type || 'field';
    const allowed = ((): boolean => {
      if (posType === 'umpire') return s.role === 'umpire';
      if (posType === 'batting') return s.role === 'batsman';
      return s.role === 'fielder' || s.role === 'batsman';
    })();
    if (!allowed) return; // ignore swap if role incompatible

    // add replaced player to out list
    setOutPlayers(prev => [{ id: on.id, name: on.label }, ...prev]);

    // new substitute list: replace selected substitute with the 'out' player (keep minimal role info)
    setFieldingSubstitutes((prev) => prev.map((st) => (st.id === standbyId ? { id: on.id, label: on.label, short: shortName(on.label), x: 0, y: 0, color: on.color, role: on.role } : st)));

    // new on-field: replace the on-field player with substitute's data but keep position coordinates and assignedPosition
    setPlayersOnField((prev) => prev.map((pl) => (pl.id === onFieldId ? { ...pl, id: s.id, label: s.label, short: s.short, color: s.color, role: s.role } : pl)));

    setSelectedStandbyId(null);
  };

  const swapOnField = (idA: string, idB: string) => {
    if (idA === idB) return;
    const a = playersOnField.find((p) => p.id === idA);
    const b = playersOnField.find((p) => p.id === idB);
    if (!a || !b) return;
    // role rules: batsman can swap only with batsman; umpire only with umpire
    if (a.role === 'batsman' || b.role === 'batsman') {
      if (!(a.role === 'batsman' && b.role === 'batsman')) return;
    }
    if (a.role === 'umpire' || b.role === 'umpire') {
      if (!(a.role === 'umpire' && b.role === 'umpire')) return;
    }

    setPlayersOnField((prev) =>
      prev.map((p) => {
        if (p.id === a.id) return { ...p, x: b.x, y: b.y, assignedPosition: b.assignedPosition };
        if (p.id === b.id) return { ...p, x: a.x, y: a.y, assignedPosition: a.assignedPosition };
        return p;
      })
    );
    setSelectedOnFieldId(null);
  };

  // Field metrics (percent coords)
  const centerX = 50;
  const centerY = 50;
  const boundaryRadius = 45; // percent
  const pitchWidth = 8; // percent wide
  const pitchHeight = 24; // percent long

  return (
    <>
    <style>{`@keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.2; } 100% { opacity: 1; } }`}</style>
    <div style={{ display: 'flex', justifyContent: 'center', padding: 12, position: 'relative', userSelect: 'none' }}>
      
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
  style={{ background: 'linear-gradient(#1b5e20,#2e7d32)', borderRadius: 12, transform: `perspective(900px) rotateX(${tilt}deg) rotateY(${rotateY}deg) scale(${zoom})`, transformOrigin: 'center center', display: 'block', cursor: (rotateActive || rotatingRef.current) ? 'grab' : 'default' }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
  onPointerMoveCapture={(e)=>{ if (ballMode && isBallDragging) { handleBallPointerMove(e as any); } }}
        onWheel={(e)=>{
          e.preventDefault();
          const delta = e.deltaY > 0 ? -0.05 : 0.05;
          setZoom((z)=>Math.max(0.6, Math.min(1.6, +(z+delta).toFixed(2))));
        }}
  // double-click intentionally disabled to avoid accidental toggle; use the Enable/Disable button
        onMouseDown={(e)=>{
          // start rotate only when rotate mode is active, otherwise ignore; keep shift fallback
          if (rotateActive || e.shiftKey) {
            rotatingRef.current = { startX: e.clientX, startY: e.clientY, startTilt: tilt, startRotateY: rotateY };
          }
        }}
        onMouseUp={()=>{ rotatingRef.current = null; }}
        onTouchStart={(e)=>{
          // if rotateActive is already enabled via the button, start rotating immediately
          if (rotateActive) {
            const t = e.touches && e.touches[0];
            if (t) rotatingRef.current = { startX: t.clientX, startY: t.clientY, startTilt: tilt, startRotateY: rotateY };
            return;
          }
          // start long-press timer (1s) - do NOT toggle rotateActive automatically;
          // instead begin a rotating gesture for this touch without changing global state.
          touchTimerRef.current = window.setTimeout(()=>{
            const t = e.touches && e.touches[0];
            if (t) rotatingRef.current = { startX: t.clientX, startY: t.clientY, startTilt: tilt, startRotateY: rotateY };
            touchTimerRef.current = null;
          }, 1000);
        }}
        onTouchEnd={()=>{
          if (touchTimerRef.current) { window.clearTimeout(touchTimerRef.current); touchTimerRef.current = null; }
          rotatingRef.current = null;
        }}
        onTouchCancel={()=>{ if (touchTimerRef.current) { window.clearTimeout(touchTimerRef.current); touchTimerRef.current = null; } rotatingRef.current = null; }}
      >
        {/* background capture rect for rotate drag (behind everything) */}
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="transparent"
          onMouseDown={(e)=>{
            // If Ball Mode is enabled, start a ball drag from the active batsman (if set)
            if (ballMode) {
              const active = activeBatsmanId ? playersOnField.find((pl) => pl.id === activeBatsmanId) : null;
              const bowler = playersOnField.find((pl) => pl.assignedPosition === 'Bowler');
              const start = active ? { x: active.x, y: active.y } : bowler ? { x: bowler.x, y: bowler.y } : toSvgCoords(e.clientX, e.clientY);
              setBallStart(start);
              setBallCurrent(start);
              setIsBallDragging(true);
              return;
            }
            // start rotate on background drag only if rotateActive
            if (rotateActive) {
              rotatingRef.current = { startX: e.clientX, startY: e.clientY, startTilt: tilt, startRotateY: rotateY };
            }
          }}
          onTouchStart={(e)=>{
            // If Ball Mode is enabled, start a ball drag on touch as well (prefer active batsman)
            if (ballMode) {
              const t = e.touches && e.touches[0];
              const active = activeBatsmanId ? playersOnField.find((pl) => pl.id === activeBatsmanId) : null;
              const bowler = playersOnField.find((pl) => pl.assignedPosition === 'Bowler');
              const start = active ? { x: active.x, y: active.y } : bowler ? { x: bowler.x, y: bowler.y } : t ? toSvgCoords(t.clientX, t.clientY) : null;
              if (start) {
                setBallStart(start);
                setBallCurrent(start);
                setIsBallDragging(true);
                return;
              }
            }
            // if rotateActive, start rotating on touch
            if (rotateActive) {
              const t = e.touches && e.touches[0];
              if (t) rotatingRef.current = { startX: t.clientX, startY: t.clientY, startTilt: tilt, startRotateY: rotateY };
            }
          }}
        />
        <defs>
          <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Boundary */}
        <g>
          <circle
            cx={(centerX / 100) * width}
            cy={(centerY / 100) * height}
            r={(boundaryRadius / 100) * Math.min(width, height)}
            fill="#2e7d32"
            stroke="#ffffff"
            strokeWidth={2}
            opacity={0.15}
          />
          <circle
            cx={(centerX / 100) * width}
            cy={(centerY / 100) * height}
            r={(boundaryRadius / 100) * Math.min(width, height)}
            fill="none"
            stroke="#ffffff"
            strokeDasharray="6 6"
            strokeWidth={1}
            opacity={0.9}
          />
        </g>

        {/* Powerplay / inner circle (typical 30-yard circle) */}
        <g>
          <circle
            cx={(centerX / 100) * width}
            cy={(centerY / 100) * height}
            r={(30 / 100) * Math.min(width, height)}
            fill="none"
            stroke="#ffffff"
            strokeWidth={1}
            opacity={0.6}
          />
        </g>

        {/* Pitch rectangle */}
        <g>
          <rect
            x={((centerX - pitchWidth / 2) / 100) * width}
            y={((centerY - pitchHeight / 2) / 100) * height}
            width={(pitchWidth / 100) * width}
            height={(pitchHeight / 100) * height}
            fill="#cbb08b"
            stroke="#fff7ea"
            strokeWidth={1}
            rx={6}
          />

          {/* Creases */}
          <line
            x1={((centerX - pitchWidth / 2 - 1) / 100) * width}
            x2={((centerX + pitchWidth / 2 + 1) / 100) * width}
            y1={((centerY - pitchHeight / 2 + 4) / 100) * height}
            y2={((centerY - pitchHeight / 2 + 4) / 100) * height}
            stroke="#ffffff"
            strokeWidth={2}
          />
          <line
            x1={((centerX - pitchWidth / 2 - 1) / 100) * width}
            x2={((centerX + pitchWidth / 2 + 1) / 100) * width}
            y1={((centerY + pitchHeight / 2 - 4) / 100) * height}
            y2={((centerY + pitchHeight / 2 - 4) / 100) * height}
            stroke="#ffffff"
            strokeWidth={2}
          />

          {/* Wide line (example offset) */}
          <line
            x1={((centerX - pitchWidth / 2 - 10) / 100) * width}
            x2={((centerX + pitchWidth / 2 + 10) / 100) * width}
            y1={((centerY - pitchHeight / 2 + 2) / 100) * height}
            y2={((centerY - pitchHeight / 2 + 2) / 100) * height}
            stroke="#ff6b6b"
            strokeWidth={1}
            opacity={0.6}
          />
        </g>

        {/* Stump markers (tiny) */}
        <g>
          <rect
            x={((centerX - 0.6) / 100) * width}
            y={((centerY - pitchHeight / 2 + 1) / 100) * height}
            width={(1.2 / 100) * width}
            height={(1 / 100) * height}
            fill="#4e342e"
          />
          <rect
            x={((centerX - 0.6) / 100) * width}
            y={((centerY + pitchHeight / 2 - 2) / 100) * height}
            width={(1.2 / 100) * width}
            height={(1 / 100) * height}
            fill="#4e342e"
          />
        </g>

        {/* Labels for boundary - small */}
        <text x={10} y={20} fill="#ffffff" fontSize={12} opacity={0.85}>Boundary</text>

  {/* Position regions (snap areas) */}
  {showRegions && (
  <g>
          {displayPositions.filter(p => p.type !== 'umpire').map((pos) => {
            // ensure the region center is clamped to the visible boundary
            const cl = clampToBoundary(pos.x, pos.y);
            const px = (cl.x / 100) * width;
            const py = (cl.y / 100) * height;
            const snapR = (SNAP_THRESHOLD / 100) * Math.min(width, height) * 0.7; // slightly smaller visual
            // Batting positions clickable when batsman selected, field positions when fielder selected
            const isBattingPosition = pos.type === 'batting';
            const isFieldPosition = pos.type === 'field';
            const isClickable = (selectedBattingId !== null && isBattingPosition) || (selectedFieldingId !== null && isFieldPosition);
            return (
              <g key={pos.id} style={{ cursor: isClickable ? 'pointer' : 'default' }}>
                {/* subtle translucent ring */}
                <circle 
                  cx={px} 
                  cy={py} 
                  r={snapR} 
                  fill={isClickable ? 'rgba(255,255,0,0.1)' : 'rgba(255,255,255,0.02)'} 
                  stroke={isClickable ? 'rgba(255,255,0,0.3)' : 'rgba(255,255,255,0.05)'} 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isClickable) handleRegionClick(pos);
                  }}
                />
                {/* small position dot */}
                <circle 
                  cx={px} 
                  cy={py} 
                  r={4} 
                  fill={isClickable ? '#ffeb3b' : '#ff8a65'} 
                  stroke="rgba(0,0,0,0.15)" 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isClickable) handleRegionClick(pos);
                  }}
                />
                <text x={px + 8} y={py + 4} fontSize={10} fill="#fff" opacity={0.95}>{pos.name}</text>
              </g>
            );
          })}
  </g>
  )}

  {/* Render umpire icons (no region) */}
  {displayPositions.filter(p => p.type === 'umpire').map((pos) => {
    const cl = clampToBoundary(pos.x, pos.y);
    const px = (cl.x / 100) * width;
    const py = (cl.y / 100) * height;
    return (
      <g key={pos.id} pointerEvents="none">
        <circle cx={px} cy={py} r={8} fill="#263238" stroke="#fff" strokeWidth={0.8} opacity={0.95} />
        <text x={px} y={py + 4} fontSize={10} textAnchor="middle" fill="#fff" pointerEvents="none">U</text>
      </g>
    );
  })}

        {/* Player tokens */}
        {playersOnField.map((p) => {
          const xPx = (p.x / 100) * width;
          const yPx = (p.y / 100) * height;
          const isSelectedStandby = selectedStandbyId !== null;
          const isUmpire = p.role === 'umpire';
          return (
            <g
              key={p.id}
              transform={`translate(${xPx}, ${yPx})`}
              style={{ cursor: isUmpire ? 'default' : 'grab' }}
              onPointerDown={(e) => { e.stopPropagation(); handlePointerDown(e, p); }}
                onClick={(e) => {
                  e.stopPropagation();
                  // If a standby is selected, swap them in
                  if (selectedStandbyId) {
                    swapIn(selectedStandbyId, p.id);
                    return;
                  }

                    // If we're in the middle of selecting an upcoming batter, replace this on-field player
                    if (selectedBattingId) {
                      // replace this player's label/short with selected batter
                      setPlayersOnField(prev => prev.map(pl => pl.id === p.id ? { ...pl, label: upcomingBatters.find(u=>u.id===selectedBattingId)?.name || pl.label, short: shortName(upcomingBatters.find(u=>u.id===selectedBattingId)?.name || pl.label) } : pl));
                      // mark this player as out
                      setOutPlayers(prev => [{ id: p.id, name: p.label }, ...prev]);
                      // remove selected from upcoming
                      setUpcomingBatters(prev => prev.filter(u => u.id !== selectedBattingId));
                      setSelectedBattingId(null);
                      return;
                    }

                    // If clicking on a fixed-role player (batsman or umpire), allow selection for swapping
                    if (p.role === 'batsman' || p.role === 'umpire') {
                      if (!selectedOnFieldId) {
                        setSelectedOnFieldId(p.id);
                      } else {
                        // Attempt swap with previously selected on-field
                        swapOnField(selectedOnFieldId, p.id);
                      }
                    }
                }}
            >
                <title>{isUmpire ? 'Umpire (fixed)' : p.assignedPosition || p.label}</title>
              <circle cx={0} cy={0} r={14} fill={p.color || '#ffd700'} stroke="#222" strokeWidth={isSelectedStandby ? 3 : 1} filter="url(#soft)" opacity={isUmpire ? 0.95 : 1} />
              <text x={0} y={5} fontSize={9} textAnchor="middle" fill="#111" style={{ fontWeight: 700, pointerEvents: 'none' }}>{p.short}</text>
              <rect x={18} y={-12} width={90} height={22} rx={6} fill="rgba(0,0,0,0.55)" stroke="#ffffff" strokeWidth={0.5} pointerEvents="none" />
                <text x={63} y={2} fontSize={11} textAnchor="middle" fill="#fff" pointerEvents="none">{p.label}</text>
                {isUmpire && (
                  <text x={-28} y={-14} fontSize={10} fill="#fff" pointerEvents="none">🔒</text>
                )}
                  {selectedOnFieldId === p.id && (
                    <circle cx={0} cy={0} r={18} fill="none" stroke="#00e5ff" strokeWidth={2} pointerEvents="none" />
                  )}
                  {activeBatsmanId === p.id && (
                    // blinking indicator
                    <circle cx={0} cy={0} r={20} fill="none" stroke="#ffd54f" strokeWidth={3} pointerEvents="none" style={{ animation: 'blink 1s infinite' }} />
                  )}
            </g>
          );
        })}

          {/* Active batsman corner options */}
          {activeBatsmanId && ballMode && (
            <foreignObject x={10} y={10} width={220} height={120} pointerEvents="none">
              <div style={{ pointerEvents: 'auto', display: 'flex', gap: 8, flexDirection: 'column' }}>
                <div style={{ fontWeight: 800, color: '#fff' }}>Batsman Action</div>
                <div className='flex-col' style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => handleSelectOutcome('Stumped')} className="px-2 py-1 rounded bg-purple-600">Stumped</button>
                  <button onClick={() => handleSelectOutcome('Missed')} className="px-2 py-1 rounded bg-gray-600">Missed</button>
                  <button onClick={() => handleSelectOutcome('Bowled')} className="px-2 py-1 rounded bg-red-600">Bowled</button>
                  <button onClick={() => handleSelectOutcome('LBW')} className="px-2 py-1 rounded bg-orange-600">LBW</button>
                </div>
              </div>
            </foreignObject>
          )}

        {/* small footer */}
        <text x={width - 220} y={height - 10} fill="#ffffff" fontSize={10} opacity={0.6}>Drag tokens to reposition • Click a standby then click a player to swap</text>
      </svg>

      {/* Ball dragging visuals */}
      {isBallDragging && ballStart && ballCurrent && (
        <svg width={width} height={height} style={{ position: 'absolute', left: '50%', top: 12, transform: `translateX(-50%) translateZ(0)` , pointerEvents: 'none' }}>
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodOpacity="0.6" />
            </filter>
          </defs>
          {/* if the start came from an active batsman, offset slightly to mimic bat contact */}
          {(() => {
            const startIsFromActive = !!activeBatsmanId;
            const sx = (ballStart.x / 100) * width + (startIsFromActive ? 12 : 0);
            const sy = (ballStart.y / 100) * height - (startIsFromActive ? 4 : 0);
            const cx = (ballCurrent.x / 100) * width;
            const cy = (ballCurrent.y / 100) * height;
            return (
              <>
                <line x1={sx} y1={sy} x2={cx} y2={cy} stroke="#fff" strokeWidth={2} opacity={0.9} strokeDasharray="6 4" />
                <circle cx={cx} cy={cy} r={10} fill="#ffd54f" stroke="#ff6f00" strokeWidth={2} filter="url(#glow)" />
              </>
            );
          })()}
        </svg>
      )}

  {/* Right-side panel with controls and fielding team */}
  <div style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: rightSidebarCollapsed ? 40 : 320, background: 'linear-gradient(180deg, rgba(0,100,200,0.9) 0%, rgba(255,193,7,0.9) 100%)', padding: rightSidebarCollapsed ? 8 : 16, zIndex: 40, display: 'flex', flexDirection: 'column', borderLeft: '2px solid rgba(255,255,255,0.2)', overflowY: 'auto', transition: 'width 0.3s ease' }}>
    {/* Collapse button */}
    <button 
      onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
      style={{ 
        position: 'absolute', 
        left: rightSidebarCollapsed ? 8 : 16, 
        top: 16, 
        width: 24, 
        height: 24, 
        background: 'rgba(255,255,255,0.2)', 
        border: 'none', 
        borderRadius: 4, 
        color: '#fff', 
        cursor: 'pointer', 
        fontSize: 12,
        zIndex: 50
      }}
    >
      {rightSidebarCollapsed ? '◀' : '▶'}
    </button>
        {!rightSidebarCollapsed && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 12, padding: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 8, marginTop: 40 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 2 }}>🇦🇺 AUSTRALIA</div>
              <div style={{ fontSize: 11, color: '#fff', opacity: 0.9 }}>Fielding Team</div>
            </div>
            <div style={{ marginBottom: 8, color: '#fff', fontWeight: 800, fontSize: 14 }}>⚙️ Controls</div>
        <div style={{ background: 'rgba(0,0,0,0.6)', padding: 10, borderRadius: 8, color: '#fff', marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>View</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: 12 }}>{rotateActive ? 'Rotate: ON' : 'Rotate: OFF'}</div>
            <button onClick={()=>setRotateActive(r=>!r)} style={{ padding: '4px 6px' }}>{rotateActive ? 'Disable' : 'Enable'}</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: 12 }}>{showRegions ? 'Regions: Visible' : 'Regions: Hidden'}</div>
            <button onClick={() => setShowRegions(s => !s)} style={{ padding: '4px 6px' }}>{showRegions ? 'Hide' : 'Show'}</button>
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            <label style={{ fontSize: 12 }}>Tilt</label>
            <input type="range" min={-30} max={30} value={tilt} onChange={(e)=>setTilt(Number(e.target.value))} />
          </div>
          <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 12 }}>Ball Mode</div>
            <button onClick={() => setBallMode(b => !b)} style={{ padding: '6px 8px' }}>{ballMode ? 'Disable' : 'Enable'}</button>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <label style={{ fontSize: 12 }}>Zoom</label>
            <input type="range" min={0.7} max={1.4} step={0.05} value={zoom} onChange={(e)=>setZoom(Number(e.target.value))} />
          </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 8, flex: 1, marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ fontWeight: 800, color: '#fff', fontSize: 14 }}>🏏 Playing XI</div>
            <button onClick={() => setRightDrawerOpen(!rightDrawerOpen)} style={{ padding: '2px 4px', fontSize: 10, background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}>{rightDrawerOpen ? '▼' : '▶'}</button>
          </div>
          {rightDrawerOpen && (
            <div style={{ maxHeight: 200, overflowY: 'auto' }}>
              {fieldingTeam.map((f) => (
                <div key={f.id} style={{ padding: 6, borderRadius: 4, marginBottom: 4, background: selectedFieldingId === f.id ? 'rgba(255,235,59,0.3)' : 'rgba(255,255,255,0.1)', cursor: 'pointer', border: selectedFieldingId === f.id ? '2px solid #ffeb3b' : '1px solid rgba(255,255,255,0.2)', transition: 'all 0.2s' }} onClick={() => {
                  setSelectedFieldingId(selectedFieldingId === f.id ? null : f.id);
                }}>
                  <div style={{ fontWeight: 600, color: '#fff', fontSize: 12 }}>{f.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 8, color: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>🔄 Substitutes</div>
            <button onClick={() => setDrawerOpen(!drawerOpen)} style={{ padding: '2px 4px', fontSize: 10, background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}>{drawerOpen ? '▼' : '▶'}</button>
          </div>
          {drawerOpen && (
            <div style={{ maxHeight: 150, overflowY: 'auto' }}>
              {fieldingSubstitutes.map((s) => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: 4, borderRadius: 4, marginBottom: 3, background: selectedStandbyId === s.id ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setSelectedStandbyId(selectedStandbyId === s.id ? null : s.id)}>
                  <div style={{ width: 24, height: 24, borderRadius: 12, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111', fontWeight: 700, fontSize: 8 }}>{s.short}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {drawerOpen && <div style={{ marginTop: 6, fontSize: 10, opacity: 0.8 }}>Selected: {selectedStandbyId ? fieldingSubstitutes.find(s => s.id === selectedStandbyId)?.label : 'none'}</div>}
        </div>
          </>
        )}
      </div>
    </div>

      {/* Left side - Team India (Batting) */}
      <div style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: leftSidebarCollapsed ? 40 : 280, background: 'linear-gradient(180deg, rgba(255,153,51,0.9) 0%, rgba(19,136,8,0.9) 100%)', padding: leftSidebarCollapsed ? 8 : 16, zIndex: 40, display: 'flex', flexDirection: 'column', borderRight: '2px solid rgba(255,255,255,0.2)', transition: 'width 0.3s ease' }}>
        {/* Collapse button */}
        <button 
          onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
          style={{ 
            position: 'absolute', 
            right: leftSidebarCollapsed ? 8 : 16, 
            top: 16, 
            width: 24, 
            height: 24, 
            background: 'rgba(255,255,255,0.2)', 
            border: 'none', 
            borderRadius: 4, 
            color: '#fff', 
            cursor: 'pointer', 
            fontSize: 12,
            zIndex: 50
          }}
        >
          {leftSidebarCollapsed ? '▶' : '◀'}
        </button>
        {!leftSidebarCollapsed && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 12, padding: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 8, marginTop: 40 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 2 }}>🇮🇳 TEAM INDIA</div>
              <div style={{ fontSize: 11, color: '#fff', opacity: 0.9 }}>Batting Team</div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 8, flex: upcomingBatters.length }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: 13 }}>🏏 Upcoming Batters ({upcomingBatters.length})</div>
              <button onClick={() => setLeftDrawerOpen(!leftDrawerOpen)} style={{ padding: '2px 4px', fontSize: 10, background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}>{leftDrawerOpen ? '▼' : '▶'}</button>
            </div>
            {leftDrawerOpen && (
              <div style={{ overflowY: 'auto' }}>
                {upcomingBatters.map((b) => (
                  <div key={b.id} style={{ padding: 6, borderRadius: 4, marginBottom: 4, background: selectedBattingId === b.id ? 'rgba(255,235,59,0.3)' : 'rgba(255,255,255,0.1)', cursor: 'pointer', border: selectedBattingId === b.id ? '2px solid #ffeb3b' : '1px solid rgba(255,255,255,0.2)', transition: 'all 0.2s' }} onClick={() => {
                    if (selectedOnFieldId) {
                      setPlayersOnField(prev => prev.map(pl => pl.id === selectedOnFieldId ? { ...pl, label: b.name, short: shortName(b.name) } : pl));
                      const replaced = playersOnField.find(pl => pl.id === selectedOnFieldId);
                      if (replaced) setOutPlayers(prev => [{ id: replaced.id, name: replaced.label }, ...prev]);
                      setUpcomingBatters(prev => prev.filter(u => u.id !== b.id));
                      setSelectedOnFieldId(null);
                    } else {
                      setSelectedBattingId(selectedBattingId === b.id ? null : b.id);
                    }
                  }}>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: 12 }}>{b.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 8, flex: outPlayers.length || 0.1 }}>
            <div style={{ fontWeight: 800, marginBottom: 6, color: '#fff', fontSize: 13 }}>❌ Out ({outPlayers.length})</div>
            <div style={{ overflowY: 'auto' }}>
              {outPlayers.map((o) => (
                <div key={o.id} style={{ padding: 4, borderRadius: 3, marginBottom: 2, background: 'rgba(255,255,255,0.05)', color: '#fff', opacity: 0.7, fontSize: 11 }}>{o.name}</div>
              ))}
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 8 }}>
            <div style={{ fontWeight: 800, marginBottom: 6, color: '#fff', fontSize: 13 }}>🔄 Batting Substitutes</div>
            <div style={{ maxHeight: 100, overflowY: 'auto' }}>
              {battingSubstitutes.map((s) => (
                <div key={s.id} style={{ display: 'flex', gap: 6, alignItems: 'center', padding: 4, borderRadius: 4, marginBottom: 3, background: 'rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                  <div style={{ width: 24, height: 24, borderRadius: 12, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 8 }}>{s.short}</div>
                  <div style={{ flex: 1, color: '#fff', fontSize: 11, fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
            </div>
          </>
        )}
      </div>

    {/* Outcome dialog shown after ball drop */}
    {showOutcomeDialog && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div style={{ background: 'rgba(0,0,0,0.7)', padding: 16, borderRadius: 10, color: '#fff', minWidth: 320 }}>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Ball Result</div>
          <div style={{ marginBottom: 8 }}>Choose an outcome for the delivered ball:</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            {/* inside boundary options */}
            {!landingOutsideBoundary ? (
              <>
                <button onClick={() => handleSelectOutcome('0')} className="px-3 py-2 rounded bg-gray-500">0</button>
                <button onClick={() => handleSelectOutcome('1')} className="px-3 py-2 rounded bg-green-500">1</button>
                <button onClick={() => handleSelectOutcome('2')} className="px-3 py-2 rounded bg-green-600">2</button>
                <button onClick={() => handleSelectOutcome('3')} className="px-3 py-2 rounded bg-green-700">3</button>
                <button onClick={() => handleSelectOutcome('4')} className="px-3 py-2 rounded bg-blue-500">4</button>
                <button onClick={() => handleSelectOutcome('Catch')} className="px-3 py-2 rounded bg-red-500">Catch</button>
                <button onClick={() => handleSelectOutcome('Run Out')} className="px-3 py-2 rounded bg-orange-500">Run Out</button>
              </>
            ) : (
              // boundary or outside -> 4 or 6
              <>
                <button onClick={() => handleSelectOutcome('4')} className="px-3 py-2 rounded bg-blue-500">4</button>
                <button onClick={() => handleSelectOutcome('6')} className="px-3 py-2 rounded bg-yellow-500">6</button>
              </>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button onClick={() => { setShowOutcomeDialog(false); setPendingOutcome(null); }} className="px-3 py-2 rounded bg-gray-600">Cancel</button>
          </div>
        </div>
      </div>
    )}

    {/* Confirmation using existing ConfirmDialog */}
    {showConfirm && pendingOutcome && (
      <ConfirmDialog
        message={`Confirm outcome: ${pendingOutcome}.`}
        onConfirm={handleConfirmOutcome}
        onCancel={handleCancelOutcome}
      />
    )}
    </>
  );
}
