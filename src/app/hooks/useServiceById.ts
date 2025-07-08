import { useQuery } from '@tanstack/react-query'
import { Service } from './useServices'

export function useServiceById(id: string | undefined) {
  return useQuery<Service>({
    queryKey: ['service', id],
    queryFn: async () => {
      const res = await fetch(`/api/services/${id}`)
      if (!res.ok) throw new Error('Failed to fetch service')
      return res.json()
    },
    enabled: !!id,
    staleTime: 15_000,
  })
}
