import React, { useState } from 'react';
import { List, Card, Skeleton, Button, Badge, Typography } from 'antd';
import { ClockCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { useEvents } from '../../app/hooks/useEvents';
import AtomicPagination from '../Atomic/Pagination';
import CrashReportGraph from './CrashReportGraph';

const { Text, Title } = Typography;

interface EventListProps {
  serviceId: string;
  serviceName?: string;
}

export default function EventList({ serviceId, serviceName }: EventListProps) {
  const { events, loading, error, refresh } = useEvents(serviceId);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const total = events.length;
  const pagedEvents = events.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePaginationChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const eventTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - eventTime.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getEventTypeColor = (message: string) => {
    if (message.includes('offline') || message.includes('crashed') || message.includes('failed')) {
      return 'red';
    }
    if (message.includes('degraded') || message.includes('timeout') || message.includes('slow')) {
      return 'orange';
    }
    if (message.includes('online') || message.includes('recovered') || message.includes('success')) {
      return 'green';
    }
    return 'blue';
  };

  return (
    <div style={{ padding: '16px', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '16px', 
        width: '100%' 
      }}>
        <Title level={4} style={{ margin: 0 }}>
          {serviceName}
        </Title>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <AtomicPagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={handlePaginationChange}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={refresh}
            loading={loading}
            size="small"
          >
            Refresh
          </Button>
        </div>
      </div>
      
      <CrashReportGraph serviceId={serviceId} />

      {error && (
        <div style={{ marginBottom: '16px', padding: '8px', backgroundColor: '#fff2f0', border: '1px solid #ffccc7', borderRadius: '4px' }}>
          <Text type="danger">Error: {error}</Text>
        </div>
      )}

      <List
        dataSource={pagedEvents}
        renderItem={event => (
          <List.Item key={event.id}>
            <Card
              size="small"
              style={{ width: '100%', backgroundColor: '#f0f0f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', backgroundColor: '#f0f0f0' }}>
                <div style={{ flex: 1 }}>
                  <Badge
                    color={getEventTypeColor(event.message)}
                    text={
                      <span style={{ fontSize: '16px', color: '#000' }}>
                        {event.message}
                      </span>
                    }
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginLeft: '12px' }}>
                  <Text style={{ color: '#888', fontSize: '12px' }}>
                    <ClockCircleOutlined style={{ marginRight: '4px' }} />
                    {formatRelativeTime(event.timestamp)}
                  </Text>
                  <Text style={{ color: '#888', fontSize: '11px' }}>
                    {new Date(event.timestamp).toLocaleString()}
                  </Text>
                </div>
              </div>
            </Card>
          </List.Item>
        )}
        loading={loading}
        locale={{ emptyText: loading ? <Skeleton active /> : 'No events found' }}
        style={{ marginTop: '8px' }}
      />
    </div>
  );
}