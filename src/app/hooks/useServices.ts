// src/hooks/useServices.ts
'use client'

import { useQuery } from '@tanstack/react-query'

export type ServiceStatus = 'Online' | 'Offline' | 'Degraded'
export type ServiceType = 'API' | 'Database' | 'Worker' | 'Cache' | 'Queue'

export interface Service {
  id: string
  name: string
  type: ServiceType
  status: ServiceStatus
}

export function useServices(
  filters?: { name?: string; status?: ServiceStatus, type?: ServiceType },
  enabled: boolean = true
) {
  const queryParams = new URLSearchParams()
  if (filters?.name) queryParams.set('name_like', filters.name)
  if (filters?.status) queryParams.set('status', filters.status)
  if (filters?.type) queryParams.set('type', filters.type)

  return useQuery<Service[]>({
    queryKey: ['services', filters],
    queryFn: async () => {
      const res = await fetch(`/api/services?${queryParams.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch services')
      return res.json()
    },
    enabled, 
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
    staleTime: 15000,
    retry: 2,
  })
}
