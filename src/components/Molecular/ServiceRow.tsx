import { Service } from '../../app/hooks/useServices'
import { BadgeCheck, AlertTriangle, XCircle } from 'lucide-react'

export default function ServiceRow({ service }: { service: Service }) {
  const statusStyles = {
    Online: 'text-green-600 bg-green-100',
    Degraded: 'text-yellow-600 bg-yellow-100',
    Offline: 'text-red-600 bg-red-100',
  }

  const statusIcons = {
    Online: <BadgeCheck className="w-4 h-4 inline-block mr-1" />,
    Degraded: <AlertTriangle className="w-4 h-4 inline-block mr-1" />,
    Offline: <XCircle className="w-4 h-4 inline-block mr-1" />,
  }

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-2 font-medium">{service.name}</td>
      <td className="px-4 py-2 text-sm text-gray-500">{service.type}</td>
      <td className="px-4 py-2">
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-medium ${statusStyles[service.status]}`}>
          {statusIcons[service.status]}
          {service.status}
        </span>
      </td>
    </tr>
  )
}
