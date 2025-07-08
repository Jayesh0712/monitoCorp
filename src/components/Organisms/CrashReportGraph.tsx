import React from 'react';
import { ServiceEvent } from '@/mocks/data';
import { useQuery } from '@tanstack/react-query';
import { Spin, Typography } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CrashReportGraphProps {
  serviceId?: string;
  title?: string;
  margin?: string;
}

async function fetchEvents(serviceId?: string, page = 1, limit = 1000) {
  const url = serviceId 
    ? `/api/services/${serviceId}/events?limit=${limit}`
    : `/api/events?page=${page}&limit=${limit}`;
    
  return fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error('Failed to fetch events');
      return res.json();
    });
}

function groupCrashes(events: ServiceEvent[]) {
  const crashTypes = ['crash', 'offline', 'error', 'fail'];
  const counts: { [key: string]: number } = {};
  events.forEach((evt: ServiceEvent) => {
    const isCrash = crashTypes.some((type: string) => (evt.message || '').toLowerCase().includes(type));
    if (isCrash) {
      const d = new Date(evt.timestamp);
      const day = d.toISOString().slice(0, 10);
      counts[day] = (counts[day] || 0) + 1;
    }
  });
  return Object.entries(counts)
    .map(([day, count]) => ({ day, count }))
    .sort((a, b) => a.day.localeCompare(b.day));
}

export default function CrashReportGraph({ 
  serviceId, 
  title = "Crash Reports Over Time",
  margin = "24px 0"
}: CrashReportGraphProps) {
  const { data: events, isLoading, error } = useQuery({
    queryKey: serviceId 
      ? ['service-events', serviceId, 'crash-graph']
      : ['events', 'crash-graph'],
    queryFn: () => fetchEvents(serviceId, 1, 100),
    refetchInterval: 10000,
    staleTime: 8000,
    enabled: !serviceId || !!serviceId, 
  });

  const data = React.useMemo(() => (events ? groupCrashes(events) : []), [events]);

  return (
    <div style={{ 
      background: '#fff', 
      border: '1.5px solid #e0e7ef', 
      borderRadius: 12, 
      padding: 16, 
      margin: serviceId ? '0 0 16px 0' : margin,
      boxShadow: '0 2px 8px 0 rgba(0,0,0,0.03)' 
    }}>
      <Typography.Title level={5} style={{ margin: 0, marginBottom: 8 }}>
        {title}
      </Typography.Title>
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <Spin />
        </div>
      ) : error ? (
        <Typography.Text type="danger">Failed to load crash data.</Typography.Text>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}