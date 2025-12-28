import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box, Plane } from '@react-three/drei';
import * as THREE from 'three';

interface GameState {
  score: number;
  wickets: number;
  overs: number;
  balls: number;
  ballInMotion: boolean;
  gameMode: 'batting' | 'bowling';
  power: number;
  angle: number;
  commentary: string[];
}

// 3D Cricket Stadium
function Stadium() {
  return (
    <group>
      {/* Ground */}
      <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <meshLambertMaterial color="#2d5016" />
      </Plane>
      
      {/* Pitch */}
      <Plane args={[22, 3]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshLambertMaterial color="#8B4513" />
      </Plane>
      
      {/* Boundary Circle */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[35, 36, 64]} />
        <meshBasicMaterial color="white" />
      </mesh>
      
      {/* Stumps */}
      <group position={[0, 0.5, -10]}>
        <Box args={[0.1, 1, 0.1]} position={[-0.2, 0, 0]}><meshLambertMaterial color="#8B4513" /></Box>
        <Box args={[0.1, 1, 0.1]} position={[0, 0, 0]}><meshLambertMaterial color="#8B4513" /></Box>
        <Box args={[0.1, 1, 0.1]} position={[0.2, 0, 0]}><meshLambertMaterial color="#8B4513" /></Box>
      </group>
      
      <group position={[0, 0.5, 10]}>
        <Box args={[0.1, 1, 0.1]} position={[-0.2, 0, 0]}><meshLambertMaterial color="#8B4513" /></Box>
        <Box args={[0.1, 1, 0.1]} position={[0, 0, 0]}><meshLambertMaterial color="#8B4513" /></Box>
        <Box args={[0.1, 1, 0.1]} position={[0.2, 0, 0]}><meshLambertMaterial color="#8B4513" /></Box>
      </group>
      
      {/* Stadium Stands */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 45;
        const z = Math.sin(angle) * 45;
        return (
          <Box key={i} args={[8, 6, 3]} position={[x, 3, z]}>
            <meshLambertMaterial color="#666" />
          </Box>
        );
      })}
    </group>
  );
}

// 3D Cricket Ball with Physics
function CricketBall({ position, onHit, gameState, onWicket }: { 
  position: [number, number, number], 
  onHit: (runs: number) => void, 
  gameState: GameState,
  onWicket: () => void 
}) {
  const ballRef = useRef<THREE.Mesh>(null!);
  const [ballPosition, setBallPosition] = useState<THREE.Vector3>(new THREE.Vector3(...position));
  const [velocity, setVelocity] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const [isMoving, setIsMoving] = useState(false);
  const [isBatted, setIsBatted] = useState(false);

  useEffect(() => {
    if (gameState.ballInMotion && !isMoving) {
      setIsMoving(true);
      setIsBatted(false);
      setBallPosition(new THREE.Vector3(...position));
      setVelocity(new THREE.Vector3((Math.random() - 0.5) * 2, 1, 15)); // Initial bowling speed
    }
  }, [gameState.ballInMotion, isMoving, position]);
  
  useFrame((_state, delta) => {
    if (isMoving && ballRef.current) {
      const newPos = ballPosition.clone();
      const newVel = velocity.clone();
      
      newVel.y -= 9.8 * delta;
      newPos.add(newVel.clone().multiplyScalar(delta));
      
      if (newPos.y <= 0.2) {
        newPos.y = 0.2;
        newVel.y *= -0.6;
        newVel.x *= 0.8;
        newVel.z *= 0.8;
        
        const distance = Math.sqrt(newPos.x * newPos.x + newPos.z * newPos.z);
        if (isBatted && distance > 35) {
          onHit(6);
          setIsMoving(false);
        } else if (isBatted && distance > 30) {
          onHit(4);
          setIsMoving(false);
        }
      }
      
      if (!isBatted && newPos.z < -10) {
        setIsMoving(false);
        onWicket();
      }
      
      if (isBatted && newVel.length() < 0.5 && newPos.y <= 0.3) {
        setIsMoving(false);
        onHit(Math.floor(Math.random() * 3) + 1);
      }
      
      setBallPosition(newPos);
      setVelocity(newVel);
      ballRef.current.position.copy(newPos);
    }
  });
  
  const hitBall = () => {
    if (isMoving && !isBatted && ballPosition.z < -8) {
      setIsBatted(true);
      const power = gameState.power / 100;
      const angleRad = (gameState.angle * Math.PI) / 180;
      
      const vel = new THREE.Vector3(
        Math.sin(angleRad) * power * 30,
        power * 20,
        -Math.cos(angleRad) * power * 30
      );
      
      setVelocity(vel);
    }
  };
  
  return (
    <Sphere ref={ballRef} args={[0.2]} position={ballPosition.toArray()} onClick={hitBall}>
      <meshLambertMaterial color="#ff4444" />
    </Sphere>
  );
}

// 3D Player Models
function Player({ position, color, name, isBatsman, isBowler, animationState }: { 
  position: [number, number, number], 
  color: string, 
  name: string, 
  isBatsman?: boolean,
  isBowler?: boolean,
  animationState?: string
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const batRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (isBatsman && animationState === 'batting' && batRef.current) {
      const t = state.clock.getElapsedTime();
      batRef.current.rotation.z = Math.sin(t * 50) * -1.5;
      setTimeout(() => {
        if (batRef.current) batRef.current.rotation.z = 0;
      }, 200);
    }
    
    if (isBowler && animationState === 'bowling' && groupRef.current) {
      const t = (state.clock.getElapsedTime() % 1);
      groupRef.current.position.z = position[2] - t * 4;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Box args={[0.6, 1.5, 0.4]} position={[0, 0.75, 0]}><meshLambertMaterial color={color} /></Box>
      <Sphere args={[0.3]} position={[0, 1.65, 0]}><meshLambertMaterial color="#ffdbac" /></Sphere>
      <Box args={[0.2, 0.8, 0.2]} position={[-0.15, -0.4, 0]}><meshLambertMaterial color="#333" /></Box>
      <Box args={[0.2, 0.8, 0.2]} position={[0.15, -0.4, 0]}><meshLambertMaterial color="#333" /></Box>
      <Box args={[0.2, 0.7, 0.2]} position={[-0.4, 0.8, 0]} rotation={[0, 0, 0.5]}><meshLambertMaterial color={color} /></Box>
      <Box args={[0.2, 0.7, 0.2]} position={[0.4, 0.8, 0]} rotation={[0, 0, -0.5]}><meshLambertMaterial color={color} /></Box>
      
      {isBatsman && (
        <mesh ref={batRef} position={[0.6, 0.8, 0.2]} rotation={[0, 0.2, -0.8]}>
          <cylinderGeometry args={[0.05, 0.08, 1.2, 8]} />
          <meshLambertMaterial color="#8B4513" />
        </mesh>
      )}

      <Text position={[0, 2.2, 0]} fontSize={0.3} color="white" anchorX="center">{name}</Text>
    </group>
  );
}

// 3D Scene Component
function CricketScene({ gameState, onHit, onWicket, animationState }: { 
  gameState: GameState, 
  onHit: (runs: number) => void, 
  onWicket: () => void, 
  animationState: string 
}) {
  const fielders = [
    { name: 'Mid-Off', position: [-8, 0, 5] }, { name: 'Mid-On', position: [8, 0, 5] },
    { name: 'Cover', position: [-15, 0, -5] }, { name: 'Mid-Wicket', position: [15, 0, -5] },
    { name: 'Fine Leg', position: [12, 0, -20] }, { name: 'Third Man', position: [-12, 0, -20] },
  ];

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Stadium />
      <CricketBall position={[0, 0.2, 8]} onHit={onHit} onWicket={onWicket} gameState={gameState} />
      <Player position={[0, 0, -10]} color="#0066cc" name="Batsman" isBatsman={true} animationState={animationState} />
      <Player position={[0, 0, 10]} color="#cc6600" name="Bowler" isBowler={true} animationState={animationState} />
      <Player position={[2, 0, -10]} color="#0066cc" name="Non-Striker" />
      
      {fielders.map(fielder => (
        <Player key={fielder.name} position={fielder.position as [number, number, number]} color="#cc6600" name={fielder.name} />
      ))}

      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </>
  );
}

export default function Game() {
  const initialGameState: GameState = {
    score: 0, wickets: 0, overs: 0, balls: 0, ballInMotion: false,
    gameMode: 'batting', power: 50, angle: 0, commentary: ['Welcome to 3D Cricket!']
  };
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [animationState, setAnimationState] = useState('idle');
  const [isGameOver, setIsGameOver] = useState(false);
  
  const handleHit = (runs: number) => {
    setGameState(prev => {
      const newState = { ...prev, score: prev.score + runs, balls: prev.balls + 1 };
      if (newState.balls >= 6) {
        newState.overs++;
        newState.balls = 0;
      }
      let comment = runs === 6 ? '🎉 SIX! What a shot!' : runs === 4 ? '🔥 FOUR! Brilliant!' : `${runs} run${runs > 1 ? 's' : ''}`;
      newState.commentary = [comment, ...prev.commentary.slice(0, 4)];
      return { ...newState, ballInMotion: false };
    });
  };
  
  const handleWicket = () => {
    setGameState(prev => {
      const newWickets = prev.wickets + 1;
      if (newWickets >= 10) setIsGameOver(true);
      const newState = { ...prev, wickets: newWickets, balls: prev.balls + 1 };
      if (newState.balls >= 6) {
        newState.overs++;
        newState.balls = 0;
      }
      newState.commentary = [newWickets >= 10 ? `GAME OVER! Final Score: ${newState.score}` : 'WICKET!', ...prev.commentary.slice(0, 4)];
      return { ...newState, ballInMotion: false };
    });
  };

  const bowl = () => {
    if (isGameOver || gameState.ballInMotion) return;
    setGameState(prev => ({ ...prev, ballInMotion: true }));
    setAnimationState('bowling');
    setTimeout(() => {
      setAnimationState('batting');
      setTimeout(() => setAnimationState('idle'), 1000);
    }, 1000);
  };

  const restartGame = () => {
    setGameState(initialGameState);
    setIsGameOver(false);
    setAnimationState('idle');
  };
  
  return (
    <div style={{ height: '100vh', background: 'linear-gradient(135deg, #87CEEB 0%, #98FB98 100%)' }}>
      <Canvas camera={{ position: [0, 15, -25], fov: 60 }} style={{ height: '70vh' }}>
        <CricketScene gameState={gameState} onHit={handleHit} onWicket={handleWicket} animationState={animationState} />
      </Canvas>
      
      <div style={{ position: 'absolute', top: 20, left: 20, background: 'rgba(0,0,0,0.8)', color: 'white', padding: 20, borderRadius: 10, minWidth: 250 }}>
        <h2 style={{ margin: 0, marginBottom: 15, color: '#ffd700' }}>🏏 3D Cricket</h2>
        <div style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Score: {gameState.score}/{gameState.wickets}</div>
        <div style={{ marginBottom: 10 }}>Overs: {gameState.overs}.{gameState.balls}</div>
        
        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 5 }}>Power: {gameState.power}%</label>
          <input type="range" min="10" max="100" value={gameState.power}
            onChange={(e) => setGameState(prev => ({ ...prev, power: parseInt(e.target.value) }))}
            style={{ width: '100%' }} />
        </div>
        
        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 5 }}>Angle: {gameState.angle}°</label>
          <input type="range" min="-45" max="45" value={gameState.angle}
            onChange={(e) => setGameState(prev => ({ ...prev, angle: parseInt(e.target.value) }))}
            style={{ width: '100%' }} />
        </div>
        
        <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
          <button onClick={bowl} disabled={isGameOver || gameState.ballInMotion}
            style={{ padding: '10px 15px', background: (isGameOver || gameState.ballInMotion) ? '#999' : '#ff6b6b', color: 'white', border: 'none', borderRadius: 5, cursor: (isGameOver || gameState.ballInMotion) ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
            🎳 Bowl
          </button>
          <button onClick={restartGame}
            style={{ padding: '10px 15px', background: '#4ecdc4', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: 'bold' }}>
            🔄 Restart
          </button>
        </div>
        
        <div>
          <h4 style={{ margin: '0 0 10px 0', color: '#ffd700' }}>📢 Commentary</h4>
          <div style={{ maxHeight: 100, overflowY: 'auto', fontSize: 12 }}>
            {gameState.commentary.map((comment, index) => (
              <div key={index} style={{ marginBottom: 5, opacity: index === 0 ? 1 : 0.7 }}>{comment}</div>
            ))}
          </div>
        </div>
      </div>
      
      <div style={{ position: 'absolute', bottom: 20, right: 20, background: 'rgba(0,0,0,0.8)', color: 'white', padding: 15, borderRadius: 10, maxWidth: 300 }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#ffd700' }}>🎮 Controls</h4>
        <div style={{ fontSize: 12, lineHeight: 1.5 }}>
          • Click on the red ball to hit.<br/>
          • Use sliders to adjust power and direction.<br/>
          • Mouse to rotate camera view.<br/>
          • Scroll to zoom in/out.
        </div>
      </div>
    </div>
  );
}
