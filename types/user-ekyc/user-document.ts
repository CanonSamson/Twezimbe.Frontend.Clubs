export type CreateDocumentInfoType = {
  documentType: string
  IdNumber: string
  image: string
}

export type DocumentInfoType = {
  documentType: string
  IdNumber: string
  frontImage?: string
  backImage?: string
}

export type UpdateDocumentInfoType = {
  documentType?: string
  IdNumber?: string
  image?: string
  frontImage: string | null
  backImage: string | null
}

