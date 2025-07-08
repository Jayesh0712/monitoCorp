'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Service } from './useServices'

export function useServiceMutations() {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: async (data: { name: string; type: Service['type'] }) => {
      const res = await fetch('/api/services', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error('Failed to create')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
  })

  const update = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name: string; type: Service['type'] } }) => {
      const res = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error('Failed to update')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
  })

  return { create, update, remove }
}
