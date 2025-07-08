import React from 'react';
import { ServiceEvent } from '@/mocks/data';
import { useQuery } from '@tanstack/react-query';
import { Spin, Button, Typography } from 'antd';
import CrashReportGraph from '../Organisms/CrashReportGraph';

async function fetchEvents(page = 1, limit = 20) {
  return fetch(`/api/events?page=${page}&limit=${limit}`)
    .then((res) => {
      if (!res.ok) throw new Error('Failed to fetch events');
      return res.json();
    });
}

export default function EventsSidebar() {
  const {
    data: events,
    isLoading,
    isFetching,
    refetch,
    error,
  } = useQuery({
    queryKey: ['events', 1, 20],
    queryFn: () => fetchEvents(1, 20),
    refetchInterval: 5000,
    staleTime: 4000,
  });

  return (
    <aside
      style={{
        position: 'fixed',
        top: 72,
        right: 0,
        width: 440,
        height: 'calc(100vh - 80px)',
        background: 'rgba(255,255,255,0.97)',
        borderLeft: '1.5px solid #e0e7ef',
        boxShadow: '0 2px 8px 0 rgba(0,0,0,0.03)',
        zIndex: 40,
        padding: '16px 12px 12px 18px',
        overflowY: 'auto',
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <Typography.Title level={5} style={{ margin: 0 }}>Live Events & Logs</Typography.Title>
        <Button size="small" onClick={() => refetch()} loading={isFetching}>
          Refresh
        </Button>
      </div>
      
      {/* Events Section - 60% of available space */}
      <div style={{ 
        flex: '0 0 60%', 
        display: 'flex', 
        flexDirection: 'column',
        marginBottom: 16,
        overflow: 'hidden'
      }}>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Spin />
          </div>
        ) : error ? (
          <Typography.Text type="danger">Failed to load events.</Typography.Text>
        ) : (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 10,
            overflowY: 'auto',
            flex: 1
          }}>
            {events && events.length > 0 ? (
              events.map((evt: ServiceEvent) => (
                <div
                  key={evt.id}
                  style={{
                    background: '#f7fafc',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    padding: '8px 10px',
                    fontSize: 14,
                    color: '#374151',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    flexShrink: 0,
                  }}
                >
                  <span>{evt.message || '-'}</span>
                  <span style={{ fontSize: 12, color: '#6b7280' }}>
                    {new Date(evt.timestamp).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <Typography.Text type="secondary">No recent events.</Typography.Text>
            )}
          </div>
        )}
      </div>

      <div style={{ 
        flex: '0 0 40%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto'
      }}>
        <CrashReportGraph />
      </div>
    </aside>
  );
}