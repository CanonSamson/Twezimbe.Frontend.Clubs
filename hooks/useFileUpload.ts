import { useState } from 'react'

export const useFileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileUpload = async (files: FileList) => {
    // Create FormData
    const formData = new FormData()
    Array.from(files).forEach(file => {
      formData.append('files', file)
    })

    try {
      // Replace with your actual upload API endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      return await response.json()
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  }

  return { handleFileUpload, uploadProgress }
}
