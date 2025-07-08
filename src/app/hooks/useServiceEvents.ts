import { useState } from 'react'
import { ServiceEvent } from '@/mocks/data'

export function useServiceEvents(serviceId: string | undefined) {
  const [page, setPage] = useState(1)
  const [events, setEvents] = useState<ServiceEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const loadMore = async () => {
    if (!serviceId || isLoading) return
    setIsLoading(true)
    const res = await fetch(`/api/services/${serviceId}/events?page=${page}&limit=10`)
    if (!res.ok) {
      setIsLoading(false)
      return
    }

    const newEvents = await res.json()
    setEvents((prev) => [...prev, ...newEvents])
    if (newEvents.length < 10) setHasMore(false)
    setPage((p) => p + 1)
    setIsLoading(false)
  }

  return { events, loadMore, isLoading, hasMore }
}
