import { useEffect, useState, useRef } from 'react';
import apiClient from '../utils/api';

/**
 * Example 1: Basic Event Stream Usage
 * This shows the simplest way to use the event stream
 */
export const BasicEventStreamExample = () => {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const streamRef = useRef<{ close: () => void } | null>(null);

    useEffect(() => {
        // Start the event stream
        streamRef.current = apiClient.event('/matches/123/live-score', {
            onOpen: () => {
                console.log('Stream connected');
                setIsConnected(true);
                setError(null);
            },
            onMessage: (data) => {
                console.log('Received data:', data);
                setData(data);
            },
            onError: (error) => {
                console.error('Stream error:', error);
                setError(error.message);
                setIsConnected(false);
            },
            onComplete: () => {
                console.log('Stream closed');
                setIsConnected(false);
            },
        });

        // Cleanup: close the stream when component unmounts
        return () => {
            if (streamRef.current) {
                streamRef.current.close();
            }
        };
    }, []);

    return (
        <div>
            <h2>Live Score Stream</h2>
            <p>Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
            <button onClick={() => streamRef.current?.close()}>
                Close Stream
            </button>
        </div>
    );
};

/**
 * Example 2: Typed Event Stream with Query Parameters
 * This shows how to use TypeScript types and query parameters
 */
interface MatchScore {
    matchId: string;
    runs: number;
    wickets: number;
    overs: number;
    currentBatsman: string;
    currentBowler: string;
}

export const TypedEventStreamExample = ({ matchId }: { matchId: string }) => {
    const [score, setScore] = useState<MatchScore | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
    const streamRef = useRef<{ close: () => void } | null>(null);

    useEffect(() => {
        streamRef.current = apiClient.event<MatchScore>(
            `/matches/${matchId}/live-score`,
            {
                params: {
                    includeStats: true,
                    format: 'detailed',
                },
                onOpen: () => {
                    setConnectionStatus('connected');
                },
                onMessage: (data) => {
                    setScore(data);
                },
                onError: (error) => {
                    console.error('Connection error:', error);
                    setConnectionStatus('disconnected');
                },
                onComplete: () => {
                    setConnectionStatus('disconnected');
                },
            }
        );

        return () => {
            streamRef.current?.close();
        };
    }, [matchId]);

    return (
        <div>
            <h2>Match Score (Typed)</h2>
            <p>Status: {connectionStatus}</p>
            {score && (
                <div>
                    <p>Runs: {score.runs}/{score.wickets}</p>
                    <p>Overs: {score.overs}</p>
                    <p>Batsman: {score.currentBatsman}</p>
                    <p>Bowler: {score.currentBowler}</p>
                </div>
            )}
        </div>
    );
};

/**
 * Example 3: Multiple Event Streams
 * This shows how to handle multiple streams simultaneously
 */
export const MultipleStreamsExample = ({ matchId }: { matchId: string }) => {
    const [scoreData, setScoreData] = useState<any>(null);
    const [commentaryData, setCommentaryData] = useState<any[]>([]);
    const scoreStreamRef = useRef<{ close: () => void } | null>(null);
    const commentaryStreamRef = useRef<{ close: () => void } | null>(null);

    useEffect(() => {
        // Stream 1: Live Score
        scoreStreamRef.current = apiClient.event(`/matches/${matchId}/live-score`, {
            onMessage: (data) => {
                setScoreData(data);
            },
            onError: (error) => {
                console.error('Score stream error:', error);
            },
        });

        // Stream 2: Live Commentary
        commentaryStreamRef.current = apiClient.event(`/matches/${matchId}/commentary`, {
            onMessage: (data) => {
                setCommentaryData((prev) => [data, ...prev].slice(0, 10)); // Keep last 10 items
            },
            onError: (error) => {
                console.error('Commentary stream error:', error);
            },
        });

        // Cleanup both streams
        return () => {
            scoreStreamRef.current?.close();
            commentaryStreamRef.current?.close();
        };
    }, [matchId]);

    return (
        <div>
            <h2>Multiple Streams</h2>
            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <h3>Live Score</h3>
                    {scoreData && <pre>{JSON.stringify(scoreData, null, 2)}</pre>}
                </div>
                <div style={{ flex: 1 }}>
                    <h3>Commentary</h3>
                    {commentaryData.map((comment, index) => (
                        <div key={index}>{JSON.stringify(comment)}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

/**
 * Example 4: Reconnecting Event Stream
 * This shows how to implement auto-reconnection on errors
 */
export const ReconnectingStreamExample = ({ matchId }: { matchId: string }) => {
    const [data, setData] = useState<any>(null);
    const [reconnectCount, setReconnectCount] = useState(0);
    const streamRef = useRef<{ close: () => void } | null>(null);
    const reconnectTimeoutRef = useRef<number | null>(null);
    const maxReconnectAttempts = 5;

    const connectStream = () => {
        streamRef.current = apiClient.event(`/matches/${matchId}/live-score`, {
            onOpen: () => {
                console.log('Connected successfully');
                setReconnectCount(0); // Reset on successful connection
            },
            onMessage: (data) => {
                setData(data);
            },
            onError: (error) => {
                console.error('Stream error:', error);

                // Attempt to reconnect
                if (reconnectCount < maxReconnectAttempts) {
                    const delay = Math.min(1000 * Math.pow(2, reconnectCount), 30000); // Exponential backoff
                    console.log(`Reconnecting in ${delay}ms... (Attempt ${reconnectCount + 1}/${maxReconnectAttempts})`);

                    reconnectTimeoutRef.current = setTimeout(() => {
                        setReconnectCount((prev) => prev + 1);
                        connectStream();
                    }, delay);
                } else {
                    console.error('Max reconnection attempts reached');
                }
            },
        });
    };

    useEffect(() => {
        connectStream();

        return () => {
            streamRef.current?.close();
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [matchId]);

    return (
        <div>
            <h2>Auto-Reconnecting Stream</h2>
            <p>Reconnect attempts: {reconnectCount}/{maxReconnectAttempts}</p>
            {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
        </div>
    );
};

/**
 * Example 5: Custom Hook for Event Streams
 * This shows how to create a reusable hook
 */
export const useEventStream = <T,>(
    path: string,
    options?: {
        params?: Record<string, any>;
        autoReconnect?: boolean;
        maxReconnectAttempts?: number;
    }
) => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [reconnectCount, setReconnectCount] = useState(0);
    const streamRef = useRef<{ close: () => void } | null>(null);
    const reconnectTimeoutRef = useRef<number | null>(null);

    const maxAttempts = options?.maxReconnectAttempts || 5;

    const connect = () => {
        streamRef.current = apiClient.event<T>(path, {
            params: options?.params,
            onOpen: () => {
                setIsConnected(true);
                setError(null);
                setReconnectCount(0);
            },
            onMessage: (data) => {
                setData(data);
            },
            onError: (err) => {
                setError(err.message);
                setIsConnected(false);

                if (options?.autoReconnect && reconnectCount < maxAttempts) {
                    const delay = Math.min(1000 * Math.pow(2, reconnectCount), 30000);
                    reconnectTimeoutRef.current = setTimeout(() => {
                        setReconnectCount((prev) => prev + 1);
                        connect();
                    }, delay);
                }
            },
            onComplete: () => {
                setIsConnected(false);
            },
        });
    };

    useEffect(() => {
        connect();

        return () => {
            streamRef.current?.close();
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [path]);

    const close = () => {
        streamRef.current?.close();
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
    };

    return { data, error, isConnected, reconnectCount, close };
};

/**
 * Example 6: Using the Custom Hook
 */
export const CustomHookExample = ({ matchId }: { matchId: string }) => {
    const { data, error, isConnected, reconnectCount, close } = useEventStream<MatchScore>(
        `/matches/${matchId}/live-score`,
        {
            params: { includeStats: true },
            autoReconnect: true,
            maxReconnectAttempts: 5,
        }
    );

    return (
        <div>
            <h2>Using Custom Hook</h2>
            <p>Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>
            {reconnectCount > 0 && <p>Reconnect attempts: {reconnectCount}</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {data && (
                <div>
                    <p>Runs: {data.runs}/{data.wickets}</p>
                    <p>Overs: {data.overs}</p>
                </div>
            )}
            <button onClick={close}>Close Stream</button>
        </div>
    );
};
