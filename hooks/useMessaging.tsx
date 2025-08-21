import { useContext } from 'react';
import { MessagingContext } from '@/contexts/messaging';

// ==============================|| Messaging - HOOKS ||============================== //

const useMessaging = () => useContext(MessagingContext);

export default useMessaging;
