import { useState, useRef, useCallback, useEffect } from 'react';
import { haversineDistance } from '../utils/speedUtils';

export interface TripData {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  distance: number;
  maxSpeed: number;
  avgSpeed: number;
  unit: string;
}

interface PositionData {
  lat: number;
  lon: number;
  speed: number | null;
  accuracy: number;
  timestamp: number;
}

const SMOOTHING_WINDOW = 3;
const STORAGE_KEY = 'speedotrack_trips';

function loadTrips(): TripData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTrips(trips: TripData[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}

export function useGPS() {
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [maxSpeed, setMaxSpeed] = useState(0);
  const [avgSpeed, setAvgSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trips, setTrips] = useState<TripData[]>(loadTrips);
  const [sessionStart, setSessionStart] = useState<Date | null>(null);
  const [duration, setDuration] = useState(0);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'acquiring' | 'active' | 'error'>('idle');

  const watchIdRef = useRef<number | null>(null);
  const positionsRef = useRef<PositionData[]>([]);
  const speedBufferRef = useRef<number[]>([]);
  const totalDistanceRef = useRef(0);
  const speedSumRef = useRef(0);
  const speedCountRef = useRef(0);
  const maxSpeedRef = useRef(0);
  const sessionStartRef = useRef<Date | null>(null);
  const timerRef = useRef<number | null>(null);
  const retryCountRef = useRef(0);
  const hasReceivedFixRef = useRef(false);

  const smoothSpeed = useCallback((rawSpeed: number): number => {
    speedBufferRef.current.push(rawSpeed);
    if (speedBufferRef.current.length > SMOOTHING_WINDOW) {
      speedBufferRef.current.shift();
    }
    return speedBufferRef.current.reduce((a, b) => a + b, 0) / speedBufferRef.current.length;
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      if (sessionStartRef.current) {
        setDuration(Math.floor((Date.now() - sessionStartRef.current.getTime()) / 1000));
      }
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const clearWatch = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setGpsStatus('error');
      return;
    }

    clearWatch();
    setError(null);
    positionsRef.current = [];
    speedBufferRef.current = [];
    totalDistanceRef.current = 0;
    speedSumRef.current = 0;
    speedCountRef.current = 0;
    maxSpeedRef.current = 0;
    retryCountRef.current = 0;
    hasReceivedFixRef.current = false;
    setCurrentSpeed(0);
    setMaxSpeed(0);
    setAvgSpeed(0);
    setDistance(0);
    setAccuracy(0);
    setDuration(0);

    const now = new Date();
    sessionStartRef.current = now;
    setSessionStart(now);
    setIsTracking(true);
    setGpsStatus('acquiring');
    startTimer();

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, speed, accuracy: acc } = position.coords;
        const timestamp = position.timestamp;

        hasReceivedFixRef.current = true;
        retryCountRef.current = 0;
        setGpsStatus('active');
        setAccuracy(acc);

        const newPos: PositionData = {
          lat: latitude,
          lon: longitude,
          speed,
          accuracy: acc,
          timestamp,
        };

        let calculatedSpeed: number = speed ?? 0;

        if (speed === null || speed === undefined) {
          if (positionsRef.current.length > 0) {
            const last = positionsRef.current[positionsRef.current.length - 1];
            const dist = haversineDistance(last.lat, last.lon, latitude, longitude);
            const timeDiff = (timestamp - last.timestamp) / 1000;
            if (timeDiff > 0) {
              calculatedSpeed = dist / timeDiff;
            } else {
              calculatedSpeed = 0;
            }
          } else {
            calculatedSpeed = 0;
          }
        }

        const smoothed = smoothSpeed(calculatedSpeed);
        setCurrentSpeed(smoothed);

        if (smoothed > maxSpeedRef.current) {
          maxSpeedRef.current = smoothed;
          setMaxSpeed(smoothed);
        }

        speedSumRef.current += smoothed;
        speedCountRef.current += 1;
        setAvgSpeed(speedSumRef.current / speedCountRef.current);

        if (positionsRef.current.length > 0) {
          const last = positionsRef.current[positionsRef.current.length - 1];
          const dist = haversineDistance(last.lat, last.lon, latitude, longitude);
          if (dist < 500) {
            totalDistanceRef.current += dist;
            setDistance(totalDistanceRef.current);
          }
        }

        positionsRef.current.push(newPos);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setIsTracking(false);
          stopTimer();
          clearWatch();
          setError('Location permission denied. Please enable location access in your browser settings.');
          setGpsStatus('error');
          return;
        }

        // For TIMEOUT or POSITION_UNAVAILABLE, don't stop tracking.
        // These are often transient — the watchPosition will keep trying.
        // Only show a warning if we've never received a fix and retried many times.
        retryCountRef.current += 1;

        if (!hasReceivedFixRef.current && retryCountRef.current > 5) {
          setIsTracking(false);
          stopTimer();
          clearWatch();
          if (err.code === err.TIMEOUT) {
            setError('Unable to get GPS signal. Please make sure you are outdoors with a clear view of the sky, then try again.');
          } else {
            setError('Location information is unavailable. Please check that your device GPS is enabled and try again.');
          }
          setGpsStatus('error');
        }
        // Otherwise, keep tracking — watchPosition will retry automatically
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 15000,
      }
    );
  }, [smoothSpeed, startTimer, stopTimer, clearWatch]);

  const stopTracking = useCallback(() => {
    clearWatch();
    stopTimer();
    setIsTracking(false);
    setGpsStatus('idle');

    if (sessionStartRef.current && speedCountRef.current > 0) {
      const trip: TripData = {
        id: crypto.randomUUID(),
        startTime: sessionStartRef.current.toISOString(),
        endTime: new Date().toISOString(),
        duration: Math.floor((Date.now() - sessionStartRef.current.getTime()) / 1000),
        distance: totalDistanceRef.current,
        maxSpeed: maxSpeedRef.current,
        avgSpeed: speedSumRef.current / speedCountRef.current,
        unit: 'm/s',
      };

      setTrips((prev) => {
        const updated = [trip, ...prev];
        saveTrips(updated);
        return updated;
      });
    }

    sessionStartRef.current = null;
    setSessionStart(null);
  }, [stopTimer, clearWatch]);

  const deleteTrip = useCallback((id: string) => {
    setTrips((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveTrips(updated);
      return updated;
    });
  }, []);

  const clearAllTrips = useCallback(() => {
    setTrips([]);
    saveTrips([]);
  }, []);

  const retryPermission = useCallback(() => {
    setError(null);
    setGpsStatus('idle');
    startTracking();
  }, [startTracking]);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      stopTimer();
    };
  }, [stopTimer]);

  return {
    currentSpeed,
    maxSpeed,
    avgSpeed,
    distance,
    accuracy,
    isTracking,
    error,
    sessionStart,
    duration,
    trips,
    gpsStatus,
    startTracking,
    stopTracking,
    deleteTrip,
    clearAllTrips,
    retryPermission,
  };
}
