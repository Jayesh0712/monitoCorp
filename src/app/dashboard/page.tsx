'use client'

import DashboardCards from '@/components/Organisms/DashboardCards'

export default function Dashboard() {
  return (
    <main className="max-w-6xl flex-col items-start p-6 ml-24">
      <h1 className="text-3xl font-bold mb-10">SRE Dashboard</h1>
      <DashboardCards />
    </main>
  );
}
