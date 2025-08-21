import { GroupContext } from '@/contexts/group'
import { useContextSelector } from 'use-context-selector'

// ==============================|| GROUP - HOOKS ||============================== //

const useGroup = () => useContextSelector(GroupContext, state => state)

export default useGroup
