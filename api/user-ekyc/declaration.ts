import {
  CreateDeclarationType,
  DeclarationType,
  UpdateDeclarationType
} from '@/types/user-ekyc/declaration'
import axiosServices from '@/utils/axios'


export type DeclarationInfoResponse = {
  completed: boolean;
  success: boolean;
  data:{
    data:  DeclarationType;
  }
};

export type UpdateDeclarationInfoResponse = {
  data: {
    completed: boolean
    data: DeclarationType
    success: boolean
  }
}

export type CreateDeclarationInfoResponse = {
  data: {
    completed: boolean
    data: DeclarationType
  }
}

export const getDeclarationInfo =
  async (): Promise<DeclarationInfoResponse> => {
    return await axiosServices.get('/v1/ekyc/get/user/declaration')
  }

export const updateDeclarationInfo = async (
  data: UpdateDeclarationType
): Promise<UpdateDeclarationInfoResponse> => {
  return await axiosServices.put('/v1/ekyc/put/user/declaration', data)
}

export const createDeclarationInfo = async (
  data: CreateDeclarationType
): Promise<CreateDeclarationInfoResponse> => {
  return await axiosServices.post('/v1/ekyc/put/user/declaration', data)
}
