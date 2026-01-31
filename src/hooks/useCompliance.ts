import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, type ComplianceCategory, type ComplianceItem, type Deadline } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

// ============================================
// Compliance Categories & Items
// ============================================

export function useComplianceData() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['compliance', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated')

      // Fetch categories
      const { data: categories, error: catError } = await supabase
        .from('compliance_categories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at')

      if (catError) throw catError

      // Fetch all items
      const { data: items, error: itemsError } = await supabase
        .from('compliance_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at')

      if (itemsError) throw itemsError

      // Group items by category
      const categoriesWithItems = categories?.map(cat => ({
        ...cat,
        items: items?.filter(item => item.category_id === cat.id) || []
      })) || []

      return { categories: categoriesWithItems, items: items || [] }
    },
    enabled: !!user,
  })
}

export function useUpdateItemStatus() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({ 
      itemId, 
      status 
    }: { 
      itemId: string
      status: 'done' | 'warning' | 'pending' 
    }) => {
      const { error } = await supabase
        .from('compliance_items')
        .update({ status })
        .eq('id', itemId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance', user?.id] })
    },
  })
}

// Calculate compliance score
export function useComplianceScore() {
  const { data } = useComplianceData()

  if (!data?.items) return 0

  const total = data.items.length
  if (total === 0) return 100

  const completed = data.items.filter(item => item.status === 'done').length
  return Math.round((completed / total) * 100)
}

// ============================================
// Deadlines
// ============================================

export function useDeadlines() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['deadlines', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('deadlines')
        .select('*')
        .eq('user_id', user.id)
        .order('deadline_date')

      if (error) throw error
      return data as Deadline[]
    },
    enabled: !!user,
  })
}

export function useAddDeadline() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (deadline: Omit<Deadline, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('deadlines')
        .insert({
          ...deadline,
          user_id: user.id,
        })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deadlines', user?.id] })
    },
  })
}

export function useDeleteDeadline() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (deadlineId: string) => {
      const { error } = await supabase
        .from('deadlines')
        .delete()
        .eq('id', deadlineId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deadlines', user?.id] })
    },
  })
}

export function useToggleDeadlineComplete() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({ id, isCompleted }: { id: string; isCompleted: boolean }) => {
      const { error } = await supabase
        .from('deadlines')
        .update({ is_completed: isCompleted })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deadlines', user?.id] })
    },
  })
}

// ============================================
// Saved Documents
// ============================================

export function useSavedDocuments() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['saved-documents', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('saved_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!user,
  })
}

export function useSaveDocument() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (document: {
      document_type: string
      document_name: string
      company_data: Record<string, any>
      extra_data?: Record<string, any>
    }) => {
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('saved_documents')
        .insert({
          ...document,
          user_id: user.id,
        })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-documents', user?.id] })
    },
  })
}

export function useDeleteDocument() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (documentId: string) => {
      const { error } = await supabase
        .from('saved_documents')
        .delete()
        .eq('id', documentId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-documents', user?.id] })
    },
  })
}