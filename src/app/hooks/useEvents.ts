// hooks/useEvents.ts
import { useState, useEffect, useCallback } from 'react';
import { ServiceEvent } from '@/mocks/data';

export function useEvents(serviceId: string, refreshInterval: number = 5000) {
  const [events, setEvents] = useState<ServiceEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/services/${serviceId}/events?limit=1000`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    const interval = setInterval(fetchEvents, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchEvents, refreshInterval]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'service_events') {
        fetchEvents();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchEvents]);


  return {
    events,
    loading,
    error,
    refresh: fetchEvents,
  };
}
