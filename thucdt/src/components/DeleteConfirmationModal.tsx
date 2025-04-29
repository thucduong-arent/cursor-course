interface DeleteConfirmationModalProps {
  deleteConfirmProjectId: string | null
  isLoading: boolean
  setDeleteConfirmProjectId: (projectId: string | null) => void
  handleDeleteProject: (projectId: string) => void
}

export default function DeleteConfirmationModal({
  deleteConfirmProjectId,
  isLoading,
  setDeleteConfirmProjectId,
  handleDeleteProject
}: DeleteConfirmationModalProps) {
  if (!deleteConfirmProjectId) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium mb-4">Delete Project</h3>
        <p className="mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => setDeleteConfirmProjectId(null)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
            onClick={() => handleDeleteProject(deleteConfirmProjectId)}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
} 