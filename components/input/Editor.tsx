import {
  FC,
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import 'react-quill/dist/quill.snow.css'
import { PiTextAa } from 'react-icons/pi'
import { ImageIcon, Smile } from 'lucide-react'
import { MdSend } from 'react-icons/md'
import { Delta, Op } from 'quill/core'
import Quill, { type QuillOptions } from 'quill'
import EmojiPopover from '@/components/emojiPopover'
import Hint from '@/components/Hint'
import useGroup from '@/hooks/userGroup'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { useParams } from 'next/navigation'
import MessageInReply from './editor/MessageInReply'
import MentionMemberCard from './editor/MentionMemberCard'
import { IoChevronDown } from 'react-icons/io5'
import MessageInEdit from './editor/MessageInEdit'
import { IoMdClose } from 'react-icons/io'
import { IoMdCheckmark } from 'react-icons/io'
import { handleEditMessage } from '@/lib/features/groups/groupMessageSlice'
import TypingIndicator from './editor/TypingIndicator'
import { useContextSelector } from 'use-context-selector'
import { UserContext, UserContextType } from '@/contexts/user'
import useMessaging from '@/hooks/useMessaging'
import UploadedFiles from './editor/UploadedFiles'
import { GoPlus } from 'react-icons/go'
import MentionedIndicator from './editor/MentionedIndicator'
import { QuillContext, QuillContextType } from '@/contexts/quill'
import { MessageType } from '@/api/messaging/group'
import { DmMessageType } from '@/api/dms/messaging'

export type EditorValue = {
  body: string
  files: {
    [key: string]: {
      url: string
      id: string
      file: File | null
      uploading: boolean
      completed: boolean
      name: string
      size: number
      type: string
    }
  }
}
interface EditorProps {
  onSubmit: ({ body }: EditorValue) => void
  varient: 'create' | 'update'
  onCancel?: () => void
  placeholder?: string
  innerRef?: MutableRefObject<Quill | null>
  defaultValue?: Delta | Op[]
  disabled?: boolean
  access: boolean
  scrollToBottom: () => void
  isAtBottonArea: boolean
  messageInReply?: DmMessageType | MessageType
  messageInEdit?: DmMessageType | MessageType
  handleRemoveMessageInReply: () => void
  handleRemoveMessageInEdit: () => void
}

const Editor: FC<EditorProps> = ({
  placeholder = 'Text',
  defaultValue = [],
  disabled = false,
  onSubmit,
  varient,
  innerRef,
  access,
  scrollToBottom,
  isAtBottonArea,
  messageInReply,
  messageInEdit,
  handleRemoveMessageInReply,
  handleRemoveMessageInEdit
}) => {
  const placeholderRef = useRef<string>(placeholder)
  const submitRef = useRef(onSubmit)
  const quillState = useContextSelector(
    QuillContext,
    (state: QuillContextType) => state?.quillState
  )
  const setQuillState = useContextSelector(
    QuillContext,
    (state: QuillContextType) => state?.setQuillState
  )

  const defaultValueRef = useRef(defaultValue)
  const disabledRef = useRef(disabled)
  const [text, setText] = useState('')
  const [isToolbarVisible, setIsToolbarVisible] = useState(true)
  const fileElementRef = useRef<HTMLInputElement>(null)
  const { fileUrls, handleAddFiles, handleRemoveFile } = useGroup()
  const { groupId, channelId } = useParams()
  const members = useAppSelector(
    state => state?.groupMembers.members[groupId as string]
  )

  const { socket } = useMessaging()
  const typingTimeout = useRef<NodeJS.Timeout | undefined>(undefined)
  const fileUrlsRef = useRef(fileUrls)

  const containerRef = useRef<HTMLDivElement>(null)

  const [isMentioning, setIsMentioning] = useState(false)

  const currentUser = useContextSelector(
    UserContext,
    (state: UserContextType) => state.currentUser
  )

  const dispatch = useAppDispatch()

  useLayoutEffect(() => {
    submitRef.current = onSubmit
    placeholderRef.current = placeholder
    defaultValueRef.current = defaultValue
    disabledRef.current = disabled
  })

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    const editorContainer = container?.appendChild(
      container?.ownerDocument?.createElement('div')
    )

    const options: QuillOptions = {
      theme: 'snow',
      placeholder: placeholderRef.current,
      modules: {
        toolbar: {
          container: [
            ['bold', 'italic', 'underline', 'strike'],
            ['link'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['clean']
          ]
        },
        keyboard: {
          bindings: {
            enter: {
              key: 'Enter',
              handler: () => {
                const text = quill.getText()
                const currentFileUrls = fileUrlsRef.current

                const isEmpty =
                  Object.values(currentFileUrls).length > 0
                    ? Object.values(currentFileUrls).some(
                        item => item.completed === false
                      )
                    : text.replace(/<(.|\n)*?>/g, '').trim().length === 0
                if (isEmpty) return

                const body = JSON.stringify(quill.getContents())

                if (access) {
                  submitRef.current?.({
                    files: currentFileUrls,
                    body
                  })
                }
              }
            },
            shift_enter: {
              key: 'Enter',
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, '\n')
              }
            }
          }
        }
      }
    }

    const quill = new Quill(editorContainer, options)
    setQuillState(quill)
    quill.focus()

    // Enhanced paste event handler for images
    editorContainer.addEventListener('paste', async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      const imageFiles: File[] = []
      const maxFileSize = 10 * 1024 * 1024 // 10MB limit
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp'
      ]

      // Check all clipboard items for images
      for (let i = 0; i < items.length; i++) {
        const item = items[i]

        if (item.type.indexOf('image') !== -1) {
          e.preventDefault() // Prevent default paste behavior for images
          const file = item.getAsFile()

          if (file) {
            // Validate file type
            if (!allowedTypes.includes(file.type)) {
              console.warn(`Unsupported image type: ${file.type}`)
              continue
            }

            // Validate file size
            if (file.size > maxFileSize) {
              console.warn(
                `Image too large: ${(file.size / 1024 / 1024).toFixed(2)}MB`
              )
              continue
            }

            // Generate a meaningful filename
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
            const extension = file.type.split('/')[1] || 'png'
            const fileName =
              file.name || `pasted-image-${timestamp}.${extension}`

            // Create a new file with proper name
            const renamedFile = new File([file], fileName, { type: file.type })
            imageFiles.push(renamedFile)
          }
        }
      }

      // Add images to file management system
      if (imageFiles.length > 0) {
        try {
          handleAddFiles(imageFiles)

          // Optional: Provide user feedback
          const message =
            imageFiles.length === 1
              ? 'Image pasted successfully'
              : `${imageFiles.length} images pasted successfully`
          console.log(message)

          // Maintain focus on editor
          setTimeout(() => {
            quill.focus()
          }, 100)
        } catch (error) {
          console.error('Error handling pasted images:', error)
        }
      }
    })

    // Handle drop events (keep your existing code)
    editorContainer.addEventListener('drop', (e: DragEvent) => {
      e.preventDefault()
      const files = e.dataTransfer?.files
      if (!files?.length) return
      handleAddFiles(Array.from(files))
    })

    if (innerRef) {
      innerRef.current = quill
    }

    quill.setContents(defaultValueRef.current)
    setText(quill.getText())

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText())
    })

    return () => {
      quill.off(Quill.events.TEXT_CHANGE)
      if (container) {
        container.innerHTML = ''
      }
      if (quillState) {
        setQuillState(null)
      }
      if (innerRef?.current) {
        innerRef.current = null
      }
    }
  }, [innerRef])

  // Optional: Add a utility function to handle keyboard shortcuts for pasting
  // Add this useEffect after your existing ones

  useEffect(() => {
    if (!quillState) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Ctrl+Shift+V or Cmd+Shift+V for paste and upload
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'V') {
        e.preventDefault()

        // Trigger file input for additional paste options
        if (fileElementRef.current) {
          setUpload('image/*')
          setTimeout(() => {
            fileElementRef.current?.click()
          }, 100)
        }
      }
    }

    const editorElement = quillState.container
    editorElement.addEventListener('keydown', handleKeyDown)

    return () => {
      editorElement.removeEventListener('keydown', handleKeyDown)
    }
  }, [quillState])

  // Then update the fileUrls ref whenever it changes (add this useEffect):
  useEffect(() => {
    fileUrlsRef.current = fileUrls
  }, [fileUrls])

  const toggleToolbar = () => {
    setIsToolbarVisible(!isToolbarVisible)
    const toolbarElement = document?.querySelector('.ql-toolbar')
    if (toolbarElement) {
      toolbarElement.classList.toggle('!hidden')
    }
  }

  const isEmpty =
    Object.values(fileUrls).length > 0
      ? Object.values(fileUrls).some(item => item.completed === false)
      : text.replace(/<(.|\n)*?>/g, '').trim().length === 0

  const onEmojiSelect = (emoji: string) => {
    const quill = quillState
    quill?.insertText(quill?.getSelection()?.index || 0, emoji)
  }

  useEffect(() => {
    if (!quillState) return

    const quill = quillState

    const handleTextChange = () => {
      const selection = quill.getSelection()

      if (selection) {
        const { index } = selection
        // Get all text before the cursor
        const textBeforeCursor = quill.getText(0, index)

        // Find the last space before the cursor
        const lastSpaceIndex = textBeforeCursor.lastIndexOf(' ')
        // Get the text after the last space
        const textAfterLastSpace =
          lastSpaceIndex === -1
            ? textBeforeCursor
            : textBeforeCursor.slice(lastSpaceIndex + 1)
        // Check if the text after last space starts with '@' or if the cursor is right after '@'
        setIsMentioning(
          textAfterLastSpace.startsWith('@') ||
            (index > 0 && quill.getText(index - 1, 1) === '@')
        )
      }
    }

    quill.on('text-change', handleTextChange)
    quill.on('selection-change', handleTextChange)

    return () => {
      quill.off('text-change', handleTextChange)
      quill.off('selection-change', handleTextChange)
    }
  }, [quillState])

  const handleOnSelectMention = (userName: string) => {
    const quill = quillState
    const selection = quill?.getSelection()

    if (selection && quill) {
      const { index } = selection
      const textBeforeCursor = quill.getText(0, index)
      const lastSpaceIndex = textBeforeCursor.lastIndexOf(' ')
      const textAfterLastSpace =
        lastSpaceIndex === -1
          ? textBeforeCursor
          : textBeforeCursor.slice(lastSpaceIndex + 1)

      // If we're mentioning and text after last space starts with '@'
      if (textAfterLastSpace.startsWith('@')) {
        // Calculate the start position of the mention
        const mentionStart = lastSpaceIndex === -1 ? 0 : lastSpaceIndex + 1
        // Delete the partial mention
        quill?.deleteText(mentionStart, textAfterLastSpace.length)
        // Insert the complete mention
        quill?.insertText(mentionStart, `@${userName} `)
      } else {
        // If not in mention mode, just insert normally
        quill?.insertText(index, `@${userName} `)
      }
    }
  }

  useEffect(() => {
    if (!quillState) return
    const quill = quillState
    if (messageInEdit?.text) {
      quill.setContents(JSON.parse(messageInEdit?.text as string) as Delta)
      quill.setSelection(messageInEdit?.text?.length)
    }
  }, [messageInEdit, quillState])

  // Handle typing events
  useEffect(() => {
    if (!socket || !groupId || !channelId) return

    const handleTyping = () => {
      socket.emit('user-is-typing', {
        id: `${groupId}${channelId}`,
        currentUser: {
          id: currentUser?.id as string,
          firstName: currentUser?.profile?.firstName,
          lastName: currentUser?.profile?.lastName,
          userName: currentUser?.profile?.userName
        },
        socketId: groupId
      })

      // Clear previous timeout
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current)
      }

      // Set timeout to stop typing
      typingTimeout.current = setTimeout(() => {
        socket.emit('user-stopped-typing', {
          id: `${groupId}${channelId}`,
          currentUser: {
            id: currentUser?.id as string,
            firstName: currentUser?.profile?.firstName,
            lastName: currentUser?.profile?.lastName,
            userName: currentUser?.profile?.userName
          },

          socketId: groupId
        })
      }, 1000) // 1 second delay
    }

    // Listen for typing events
    const quill = quillState
    quill?.on('text-change', handleTyping)

    return () => {
      quill?.off('text-change', handleTyping)
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current)
      }
    }
  }, [socket, groupId, channelId, currentUser, quillState])

  const [upload, setUpload] = useState('*')

  useEffect(() => {
    if (!quillState) return

    const quill = quillState

    const handleTextChange = () => {
      const delta = quill.getContents()
      let index = 0
      console.log(quill?.getContents())
      delta.ops?.forEach(op => {
        if (
          typeof op.insert === 'object' &&
          op.insert !== null &&
          'image' in op.insert
        ) {
          quill.deleteText(index, 1, 'api')
        } else if (typeof op.insert === 'string') {
          index += op.insert.length
        }
      })
    }

    quill.on('text-change', handleTextChange)

    // Cleanup the listener on unmount
    return () => {
      quill.off('text-change', handleTextChange)
    }
  }, [quillState])

  return (
    <div className='flex flex-col justify-end items-end'>
      <input
        type='file'
        accept={upload}
        multiple
        ref={fileElementRef}
        onChange={event =>
          event.target.files && handleAddFiles(Array.from(event.target.files))
        }
        className='hidden'
      />

      <div className='flex flex-col absolute z-20  tablet-lg:px-10 tablet:pb-2  tablet:bottom-2 tablet-lg:bottom-5 w-full right-0  rounded-t tablet:rounded'>
        <div className='  bottom-[100%] gap-2  right-2  tablet:right-10  absolute  flex justify-end pb-2 '>
          <MentionedIndicator />
          <div className='flex items-end gap-2 h-[30px] tablet:h-[40px] '>
            <button
              onClick={scrollToBottom}
              className={`${
                !isAtBottonArea
                  ? 'h-[30px] w-[30px] tablet:h-[40px] tablet:w-[40px]'
                  : 'h-[0px] w-[0px]'
              } bg-primary duration-400 transition-all text-white  flex justify-center  items-center opacity-55 hover:opacity-100 rounded-[10px]`}
            >
              <IoChevronDown className='  size-[24px]' />
            </button>
          </div>
        </div>
        <MentionMemberCard
          handleOnSelectMention={handleOnSelectMention}
          isMentioning={isMentioning}
          members={members}
        />

        <div
          className={` ${
            isMentioning ? 'max-tablet:border-none' : 'border-t border-x'
          }  flex flex-col  tablet:border  bg-white  relative  border-divider duration-500 transition-all rounded-t-md tablet:rounded-md overflow-hidden`}
        >
          <TypingIndicator />

          {messageInReply ? (
            <MessageInReply
              messageInReply={messageInReply}
              handleRemove={handleRemoveMessageInReply}
              members={members}
            />
          ) : messageInEdit ? (
            <MessageInEdit messageInEdit={messageInEdit} members={members} />
          ) : null}

          <div ref={containerRef} className='gl-custom' />

          <UploadedFiles
            removeFile={(id: string) => {
              handleRemoveFile(id)
              fileElementRef.current!.value = ''
            }}
            fileUrls={fileUrls}
          />

          <div className='flex  justify-between px-2 pb-2 x-[5]'>
            <div className='flex items-center gap-1 tablet:gap-2'>
              {varient === 'create' && (
                <Hint
                  label='Add files'
                  handleClick={() => {
                    setUpload('*')
                    setTimeout(() => {
                      fileElementRef.current?.click()
                    }, 200)
                  }}
                  disabled={disabled}
                >
                  <div className='p-1 bg-[#1D1C1D]/10 flex items-center justify-center rounded-full'>
                    <GoPlus className='size-4' />
                  </div>
                </Hint>
              )}
              <button
                onClick={toggleToolbar}
                disabled={disabled}
                className='p-2 rounded-full'
              >
                <PiTextAa className='size-4' />
              </button>

              <EmojiPopover disabled={disabled} onEmojiSelect={onEmojiSelect}>
                <div className='p-2 rounded-full'>
                  <Smile className='size-4' />
                </div>
              </EmojiPopover>
              {varient === 'create' && (
                <Hint
                  label='Add image'
                  handleClick={() => {
                    setUpload('image/*')
                    setTimeout(() => {
                      fileElementRef.current?.click()
                    }, 200)
                  }}
                  disabled={disabled}
                >
                  <div className='p-2 rounded-full'>
                    <ImageIcon className='size-4' />
                  </div>
                </Hint>
              )}
            </div>
            {messageInEdit ? (
              <div className=' flex items-center gap-2'>
                <button
                  onClick={handleRemoveMessageInEdit}
                  disabled={isEmpty || disabled}
                >
                  <IoMdClose className=' size-[20px]' />
                </button>
                <button
                  onClick={() => {
                    dispatch(
                      handleEditMessage({
                        groupId,
                        channelId,
                        messageId: messageInEdit.id,
                        text: JSON.stringify(quillState?.getContents())
                      })
                    )
                    onSubmit({
                      files: fileUrls,
                      body: JSON.stringify(quillState?.getContents())
                    })
                  }}
                  disabled={isEmpty || disabled}
                  id={'submit-button-editor'}
                >
                  <IoMdCheckmark className=' size-[20px]' />
                </button>
              </div>
            ) : (
              <button
                disabled={isEmpty || disabled}
                onClick={() => {
                  onSubmit({
                    files: fileUrls,
                    body: JSON.stringify(quillState?.getContents())
                  })
                }}
                className='bg-primary transition-all duration-300 disabled:bg-gray-100 disabled:text-gray-300 text-white p-2 rounded-[5px]'
              >
                <MdSend className='size-4' />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Editor
