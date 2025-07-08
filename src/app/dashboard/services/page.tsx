'use client'

import { useState } from 'react';
import { Service } from '@/mocks/data';
import AtomicPagination from '@/components/Atomic/Pagination';
import { useServices, ServiceStatus, ServiceType } from '../../hooks/useServices';
import ServiceTable from '@/components/Organisms/ServiceTable';
import ServiceFilterBar from '@/components/Molecular/ServiceFilterBar';
import AddEditServiceModal from '@/components/Modal/AddEditServiceModal';
import DeleteServiceModal from '@/components/Modal/DeleteServiceModal';
import { notifySuccess, notifyError } from '@/components/Atomic/Notification';
import { useServiceMutations } from '../../hooks/useServiceMutation';
import { Button, Spin } from 'antd';

export default function ServicesPage() {
  const [filters, setFilters] = useState({ name: '', status: 'All' as 'All' | ServiceStatus, type: 'All' as 'All' | ServiceType });
  const [showAddModal, setShowAddModal] = useState(false);
  // import { Service } from '@/mocks/data';
  const [editTarget, setEditTarget] = useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  const { create, update, remove } = useServiceMutations();

  // Convert 'All' to undefined for API queries
  const statusForQuery = filters.status === 'All' ? undefined : filters.status;
  const typeForQuery = filters.type === 'All' ? undefined : filters.type;
  const nameForQuery = filters.name.trim() === '' ? undefined : filters.name.trim();

  const { data: services, isLoading, error } = useServices({
    name: nameForQuery,
    status: statusForQuery,
    type: typeForQuery,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const total = services?.length || 0;
  const pagedServices = services ? services.slice((currentPage - 1) * pageSize, currentPage * pageSize) : [];

  const handlePaginationChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  // Handlers
  const handleAdd = (data: Service) => {
    create.mutate(data, {
      onSuccess: () => {
        notifySuccess('Service added successfully');
        setShowAddModal(false);
      },
      onError: () => notifyError('Failed to add service'),
    });
  };

  const handleEdit = (data: Service) => {
    if (!editTarget) return;
    update.mutate({ id: editTarget.id, data }, {
      onSuccess: () => {
        notifySuccess('Service updated successfully');
        setEditTarget(null);
      },
      onError: () => notifyError('Failed to update service'),
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    remove.mutate(deleteTarget.id, {
      onSuccess: () => {
        notifySuccess('Service deleted successfully');
        setDeleteTarget(null);
      },
      onError: () => notifyError('Failed to delete service'),
    });
  };

  return (
    <main className="min-h-screen p-6 max-w-5xl ml-24">
      <h1 className="text-2xl font-semibold mb-6">Service List</h1>
      <div className="flex justify-between items-center mb-4 flex-col sm:flex-row gap-4">
        <ServiceFilterBar onFilterChange={setFilters} />
        <Button
          onClick={() => setShowAddModal(true)}
          type='primary'
        >
          + Add Service
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spin size="large" />
        </div>
      ) : error ? (
        <div className="text-red-600">Failed to load services.</div>
      ) : (
        <>
          <ServiceTable
            services={pagedServices}
            onEdit={service => setEditTarget(service)}
            onDelete={service => setDeleteTarget(service)}
            onRowClick={service => window.location.href = `/services/${service.id}`}
          />
          <div className="mt-4 flex justify-end">
            <AtomicPagination
              current={currentPage}
              pageSize={pageSize}
              total={total}
              onChange={handlePaginationChange}
            />
          </div>
        </>
      )}
      <AddEditServiceModal
        open={showAddModal || !!editTarget}
        initialData={editTarget || undefined}
        onClose={() => {
          setShowAddModal(false);
          setEditTarget(null);
        }}
        onSave={editTarget ? handleEdit : handleAdd}
      />
      <DeleteServiceModal
        open={!!deleteTarget}
        serviceName={deleteTarget?.name}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </main>
  );
}