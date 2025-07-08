'use client'

import { useState } from 'react'
import { ServiceStatus, ServiceType } from '@/mocks/data'
import { Button } from 'antd'

type Status = 'All' | ServiceStatus
type Type = 'All' | ServiceType

interface Props {
  onFilterChange: (params: { name: string; status: Status; type: Type }) => void
}

export default function ServiceFilterBar({ onFilterChange }: Props) {
  const [name, setName] = useState('')
  const [status, setStatus] = useState<Status>('All')
  const [type, setType] = useState<Type>('All')

  const handleFilterChange = (newName = name, newStatus = status, newType = type) => {
    onFilterChange({ name: newName, status: newStatus, type: newType })
  }

  const handleClearFilters = () => {
    setName('')
    setStatus('All')
    setType('All')
    onFilterChange({ name: '', status: 'All', type: 'All' })
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <input
        type="text"
        placeholder="Search by name..."
        value={name}
        onChange={(e) => {
          setName(e.target.value)
          handleFilterChange(e.target.value, status, type)
        }}
        className="border border-gray-300 px-3 py-2 rounded w-full sm:w-1/2"
      />
      <select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value as Status)
          handleFilterChange(name, e.target.value as Status, type)
        }}
        className="border border-gray-300 px-3 py-2 rounded w-full sm:w-48"
      >
        <option value="All">All Statuses</option>
        <option value="Online">Online</option>
        <option value="Offline">Offline</option>
        <option value="Degraded">Degraded</option>
      </select>

      <select
        value={type}
        onChange={(e) => {
          setType(e.target.value as Type)
          handleFilterChange(name, status, e.target.value as Type)
        }}
        className="border border-gray-300 px-3 py-2 rounded w-full sm:w-48"
      >
        <option value="All">All Types</option>
        <option value="API">API</option>
        <option value="Database">Database</option>
        <option value="Worker">Worker</option>
        <option value="Cache">Cache</option>
        <option value="Queue">Queue</option>
      </select>
      <Button
        onClick={handleClearFilters}
        disabled={name === '' && status === 'All' && type === 'All'}
      >
        Clear Filter
      </Button>
    </div>
  )
}