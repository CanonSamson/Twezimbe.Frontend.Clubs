import React from 'react'

export interface CustomAvatarProps {
  className?: string
  imageClassName?: string
  labelClassName?: string
  iconClassName?: string
  image: string
  alt: string
  showText: boolean
  disableFileUpload?: boolean
}

export interface DirectUser {
  image: React.ReactElement<CustomAvatarProps>
  user: string
  userName?: string
  text: string
  time: string
  online: boolean
  count: number
}

export interface DirectUserSimple {
  image: React.ReactElement<CustomAvatarProps>
  user: string
  online: boolean
}

export interface EnableUser {
  image: React.ReactElement<CustomAvatarProps>
  name: string
}