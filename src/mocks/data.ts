// /mocks/data.ts

export type ServiceStatus = 'Online' | 'Offline' | 'Degraded';
export type ServiceType = 'API' | 'Database' | 'Worker' | 'Cache' | 'Queue';

export interface Service {
  id: string;
  name: string;
  type: ServiceType;
  status: ServiceStatus;
}

export interface ServiceEvent {
  id: number;
  serviceId: string;
  timestamp: string;
  message: string;
}

// Sample services
export const services: Service[] = [
  { id: '1', name: 'User Service', type: 'API', status: 'Online' },
  { id: '2', name: 'Database Cluster', type: 'Database', status: 'Degraded' },
  { id: '3', name: 'Auth Gateway', type: 'API', status: 'Online' },
  { id: '4', name: 'Redis Cache', type: 'Cache', status: 'Online' },
  { id: '5', name: 'Notification Worker', type: 'Worker', status: 'Offline' },
  { id: '6', name: 'Email Service', type: 'API', status: 'Online' },
  { id: '7', name: 'Payment Processor', type: 'API', status: 'Degraded' },
  { id: '8', name: 'Kafka Broker', type: 'Queue', status: 'Online' },
  { id: '9', name: 'File Storage', type: 'API', status: 'Online' },
  { id: '10', name: 'Metrics Collector', type: 'Worker', status: 'Online' },
];

export interface User {
  id: string
  username: string
  password: string
}

export const users: User[] = [
  { id: 'u1', username: 'Admin', password: 'Admin@123' },
  { id: 'u2', username: 'Viewer', password: 'Viewer@123' },
]

const EVENTS_STORAGE_KEY = 'service_events';

export function getStoredEvents(): ServiceEvent[] {
  try {
    const stored = localStorage.getItem(EVENTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.warn('Failed to parse stored events:', e);
    return [];
  }
}

export function saveEventsToStorage(events: ServiceEvent[]): void {
  try {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  } catch (e) {
    console.warn('Failed to save events to localStorage:', e);
  }
}

export function addEventToStorage(event: ServiceEvent): void {
  const events = getStoredEvents();
  events.unshift(event); 
  
  if (events.length > 1000) {
    events.splice(1000);
  }
  
  saveEventsToStorage(events);
}

export function getEventsForService(serviceId: string): ServiceEvent[] {
  const allEvents = getStoredEvents();
  return allEvents.filter(event => event.serviceId === serviceId);
}

export function clearAllEvents(): void {
  localStorage.removeItem(EVENTS_STORAGE_KEY);
}

export function initializeSampleEvents(): void {
  const existingEvents = getStoredEvents();
  
  if (existingEvents.length === 0) {
    const sampleEvents: ServiceEvent[] = [
      {
        id: 1,
        serviceId: '1',
        timestamp: '2025-07-06T10:00:00Z',
        message: 'Service went offline',
      },
      {
        id: 2,
        serviceId: '2',
        timestamp: '2025-07-06T11:00:00Z',
        message: 'Degraded performance detected',
      },
      {
        id: 3,
        serviceId: '3',
        timestamp: '2025-07-06T08:30:00Z',
        message: 'Worker crashed due to memory leak',
      },
      {
        id: 4,
        serviceId: '4',
        timestamp: '2025-07-06T09:00:00Z',
        message: '3rd party payment gateway timeout',
      },
      {
        id: 5,
        serviceId: '5',
        timestamp: '2025-07-06T10:15:00Z',
        message: 'Cache cleared due to key eviction policy',
      },
    ];
    
    saveEventsToStorage(sampleEvents);
  }
}

// Event simulation function
export function getNextEventId(): number {
  const events = getStoredEvents();
  if (events.length === 0) return 1;
  
  const maxId = Math.max(...events.map(event => event.id));
  return maxId + 1;
}

export function startEventSimulation(): void {
  initializeSampleEvents();
  
  const eventMessages = [
    'Service health check passed',
    'High CPU usage detected',
    'Memory usage spike observed',
    'Response time increased',
    'Connection pool exhausted',
    'Service auto-scaled',
    'Maintenance window started',
    'Database connection timeout',
    'Cache miss rate increased',
    'Queue processing delayed',
    'Service recovered automatically',
    'Load balancer failover triggered',
    'Disk space running low',
    'Network latency detected',
    'Service restarted successfully'
  ];
  
  setInterval(() => {
    const service = services[Math.floor(Math.random() * services.length)];
    const message = eventMessages[Math.floor(Math.random() * eventMessages.length)];
    
    const nextId = getNextEventId();
    
    const event: ServiceEvent = {
      id: nextId,
      serviceId: `${service.id}`,
      timestamp: new Date().toISOString(),
      message: `${message} for ${service.name}`,
    };
    
    console.log('Generated event:', event);
    addEventToStorage(event);
  }, 10000); 
}