'use client'

import { Service } from '@/mocks/data'
import { useParams } from 'next/navigation'
import { useServiceById } from '@/app/hooks/useServiceById'
import { useServiceEvents } from '@/app/hooks/useServiceEvents'
import { useEffect, useRef } from 'react'
import { Skeleton } from 'antd'
import ServiceDetailsHeader from '@/components/Atomic/ServiceDetailsHeader'
import EventList from '@/components/Organisms/EventList'

export default function ServiceDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { data: service, isLoading: serviceLoading } = useServiceById(id)
  const { events, loadMore, hasMore } = useServiceEvents(id)

  const loaderRef = useRef<HTMLDivElement>(null);
console.log(events);
  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 1 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loaderRef, loadMore, hasMore]);


  if (serviceLoading && !service) {
    return (
      <div className="flex justify-center items-center h-40">
        <Skeleton active paragraph={{ rows: 2 }} title />
      </div>
    );
  }

  return (
    <main className="max-w-6xl p-6 ml-24">
      <ServiceDetailsHeader service={service as Service} />
      <h3 className="text-lg font-semibold mb-2">Event History</h3>
      <EventList serviceId={id} serviceName={service?.name} />
    </main>
  );
}
