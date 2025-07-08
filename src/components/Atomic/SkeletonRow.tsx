export default function SkeletonRow() {
    return (
      <tr className="animate-pulse border-t border-gray-300">
        <td className="p-2">
          <div className="h-4 bg-gray-200 rounded w-32" />
        </td>
        <td className="p-2">
          <div className="h-4 bg-gray-200 rounded w-24" />
        </td>
        <td className="p-2">
          <div className="h-4 bg-gray-200 rounded w-20" />
        </td>
        <td className="p-2">
          <div className="h-4 bg-gray-200 rounded w-24" />
        </td>
      </tr>
    )
  }
  