import Quill from 'quill'
import { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  editChannelMessage,
  MessageBody,
  sendChannelMessage
} from '@/api/messaging/group'

import Editor, { EditorValue } from '../../components/input/Editor'
import { useParams } from 'next/navigation'
import { useUser } from '@/contexts/user'
import useGroup from '@/hooks/userGroup'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { RootState } from '@/lib/store'
import { removeMesageInReply } from '@/lib/features/groups/groupMessageInReplySlice'
import { removeMesageInEdit } from '@/lib/features/groups/groupMessageInEditSlice'
import { addNewMessages } from '@/lib/features/groups/groupMessageSlice'
import { v4 } from 'uuid'

interface ChatInputProps {
  placeholder: string
  access: boolean
  scrollToBottom: () => void
  isAtBottonArea: boolean
}

const ChatInput = ({
  placeholder,
  access,
  scrollToBottom,
  isAtBottonArea
}: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null)
  const { groupId, channelId } = useParams()
  const { currentUser } = useUser({})
  const { handleClearFiles } = useGroup()
  const { fileUrls } = useGroup()

  const messageInReply = useAppSelector(
    (state: RootState) =>
      state.groupMessageInReply.messages?.[groupId as string]?.[
        channelId as string
      ]
  )
  const messageInEdit = useAppSelector(
    (state: RootState) =>
      state.groupMessageInEdit.messages?.[groupId as string]?.[
        channelId as string
      ]
  )
  const dispatch = useAppDispatch()

  const [isPending, setIsPending] = useState(false)

  const { mutate } = useMutation({
    mutationFn: (data: MessageBody) =>
      messageInEdit
        ? editChannelMessage(groupId as string, channelId as string, {
            ...data,
            ...(messageInEdit.id && { id: messageInEdit.id })
          })
        : sendChannelMessage(groupId as string, channelId as string, {
            ...data,
            replyMessageId: messageInReply?.id,
            replyMessage: messageInReply ? messageInReply : undefined
          }),
    onSuccess: () => {
      editorRef.current?.setContents([{ insert: '\n' }])
      editorRef.current?.focus()
      dispatch(
        removeMesageInReply({
          groupId: groupId as string,
          channelId: channelId as string
        })
      )
      dispatch(
        removeMesageInEdit({
          groupId: groupId as string,
          channelId: channelId as string
        })
      )
      handleClearFiles()
    },
    onMutate (variables) {
      try {
        setIsPending(true)

        // Create a serializable version of the message data
        const messageData = {
          // Only include serializable primitive values and plain objects
          user: {
            id: variables.user?.id,
            profile: {
              firstName: variables.user?.profile?.firstName,
              lastName: variables.user?.profile?.lastName,
              userName: variables.user?.profile?.userName,
              profileImage: variables.user?.profile?.profileImage
            }
          },
          channelId: channelId as string,
          groupId: groupId as string,
          id: variables.id,
          userId: currentUser?.id,
          text: variables.text,
          system: false,
          // Ensure files is serializable (plain array/object)
          files: variables?.files
            ? JSON.parse(JSON.stringify(variables.files))
            : null,
          // Only include serializable reply message data
          ...(messageInReply?.id && {
            replyMessageId: messageInReply.id,
            replyMessage: messageInReply
              ? {
                  ...messageInReply,
                  id: messageInReply.id,
                  text: messageInReply.text
                }
              : undefined
          })
        }

        if (!messageInEdit) {
          dispatch(
            addNewMessages({
              channelId,
              groupId,
              text: variables.text,
              message: messageData
            })
          )
        } 

      
      } finally {
        setIsPending(false)
      }
    }
  })

  const handleSubmit = ({ body }: EditorValue) => {
    if (!access) return

    const messageId = v4()

    mutate({
      type: 'TEXT',
      user: {
        id: currentUser?.id,
        profile: {
          firstName: currentUser?.profile.firstName as string,
          lastName: currentUser?.profile.lastName as string,
          userName: currentUser?.profile.userName as string,
          profileImage: currentUser?.profile.profileImage as string
        }
      },
      channelId: channelId as string,
      groupId: groupId as string,
      id: messageId,
      userId: currentUser?.id as string,
      text: body,
      files: Object.values(fileUrls)?.length ? Object.values(fileUrls) : null
    })
  }

  const handleRemoveMessageInReply = () => {
    dispatch(
      removeMesageInReply({
        groupId: groupId as string,
        channelId: channelId as string
      })
    )
  }

  const handleRemoveMessageInEdit = () => {
    dispatch(
      removeMesageInEdit({
        groupId: groupId as string,
        channelId: channelId as string
      })
    )
  }

  return (
    <Editor
      disabled={isPending || !access}
      varient='create'
      placeholder={placeholder}
      onSubmit={handleSubmit}
      innerRef={editorRef}
      access={access}
      scrollToBottom={scrollToBottom}
      isAtBottonArea={isAtBottonArea}
      handleRemoveMessageInReply={handleRemoveMessageInReply}
      handleRemoveMessageInEdit={handleRemoveMessageInEdit}
      messageInEdit={messageInEdit}
      messageInReply={messageInReply}
    />
  )
}

export default ChatInput
