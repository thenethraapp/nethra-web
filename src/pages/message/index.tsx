import Messages from '@/component/features/messages/Messages'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/context/AuthContext'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getConversations, createConversation } from '@/api/messaging'
import { CreateConversationRequest } from '@/api/messaging/conversations/createConversation'
import { Conversation } from '@/types/api/messaging';

const Index = () => {
  const router = useRouter()
  const { otherUserId } = router.query
  const { user } = useAuth()
  const [conversationId, setConversationId] = useState<string | null>(null)

  // Fetch conversations
  const { data: conversationsData, isLoading: isLoadingConversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => getConversations(), // ✅ fix: no params mismatch
    enabled: !!user && !!otherUserId,
  })


  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: (data: CreateConversationRequest) => createConversation(data),
    onSuccess: (data) => {
      setConversationId(data.conversation._id)
    },
  })

  useEffect(() => {
    if (!otherUserId || !user || !conversationsData) return

    // ✅ Type-safe lookup
    const existingConv = conversationsData.conversations?.find(
      (conv: Conversation) =>
        conv.participants.some(
          (p) => p.userId._id === String(otherUserId)
        )
    )

    if (existingConv) {
      setConversationId(existingConv._id)
    } else {
      // Create new conversation
      // createConversationMutation.mutate({
      //   otherUserId: String(otherUserId),
      //   metadata: {},
      // })
      createConversationMutation.mutate({
        otherUserId: String(otherUserId),
        otherUserType: user.role === 'optometrist' ? 'patient' : 'optometrist', // ✅ required field
        metadata: {},
      })

    }
  }, [otherUserId, user, conversationsData, createConversationMutation])

  const isLoading = isLoadingConversations || createConversationMutation.isPending
  const error = createConversationMutation.error

  if (isLoading) {
    return (
      <section className='pt-6'>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading conversation...</div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className='pt-6'>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500 text-center">
            <p>Failed to create or get conversation</p>
            <button
              onClick={() => createConversationMutation.reset()}
              className="mt-2 text-sm text-blue-500 hover:underline"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className='-mt-[100px] h-[calc(100vh)]'>
      <Messages conversationId={conversationId} />
    </section>
  )
}

export default Index
