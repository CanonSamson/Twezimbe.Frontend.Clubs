'use client'
// PROJECT IMPORTS

// PROJECT IMPORTS
import SiderLoader from '../../components/layout/Sider/loading'
import dynamic from 'next/dynamic'
import CommunityListLoader from '../../components/layout/CommunityList/loader'

const Sider = dynamic(() => import('@/components/layout/Sider'), {
  ssr: false,
  loading: () => <SiderLoader />
})

const CommunityList = dynamic(
  () => import('../../components/layout/CommunityList'),
  {
    ssr: false,
    loading: () => <CommunityListLoader />
  }
)

const NewGroupModal = dynamic(
  () => import('../../components/modal/NewGroupModal')
)
const InviteAdminModal = dynamic(
  () => import('../../components/modal/Invite/InviteAdminModal')
)
const InviteFriendsModal = dynamic(
  () => import('../../components/modal/Invite/InviteFriendsModal')
)
const GroupDetailsModal = dynamic(
  () => import('../../components/modal/GroupDetailsModal')
)
const JoinedGroupModal = dynamic(
  () => import('../../components/modal/JoinedGroupModal')
)
const DetailsUpdatedModal = dynamic(
  () => import('../../components/modal/DetailsUpdatedModal')
)

const BfKycRequiredModal = dynamic(
  () => import('../../components/modal/BfKycRequiredModal')
)
const CrowdfundingKycRequiredModal = dynamic(
  () => import('../../components/modal/CrowdfundingKycRequiredModal')
)
const CreateChannelModal = dynamic(
  () => import('@/components/modal/CreateChannelModal')
)

const WalletDepositModal = dynamic(
  () => import('@/components/modal/WalletDepositModal')
)

const PaySubscriptionModal = dynamic(
  () => import('@/components/modal/PaySubscriptionModal')
)

const ViewFullProfileModal = dynamic(
  () => import('@/components/modal/ViewFullProfileModal')
)
const BereavementFundInfoModal = dynamic(
  () => import('@/components/modal/BereavementFundInfoModal')
)

const RequestToJoinBfModal = dynamic(
  () => import('@/components/modal/RequestToJoinBfModal')
)

const FileCaseModal = dynamic(() => import('@/components/modal/FileCaseModal'))

const PinnedMessageModal = dynamic(
  () => import('@/components/modal/PinnedMessageModal')
)

const SelectModal = dynamic(() => import('@/components/modal/SelectModal'))
const AddBeneficiaryModal = dynamic(
  () => import('@/components/modal/AddBeneficiaryModal')
)

const BeneficiaryModal = dynamic(
  () => import('@/components/modal/BeneficiaryModal')
)

const DetailsModal = dynamic(() => import('@/components/modal/DetailsModal'))

const AddModal = dynamic(() => import('@/components/modal/AddModal'))

const SubmittedModal = dynamic(
  () => import('@/components/modal/SubmittedModal')
)
const PendingPaymentModal = dynamic(
  () => import('@/components/modal/PendingPaymentModal')
)
const InCompleteBeneficiaryKycModal = dynamic(
  () => import('@/components/modal/InCompleteBeneficiaryKycModal')
)
const TierModal = dynamic(() => import('@/components/modal/TierModal'))
const LeaveGroupModal = dynamic(
  () => import('@/components/modal/LeaveGroupModal')
)
const BfLeaveGroupModal = dynamic(
  () => import('@/components/modal/BfLeaveGroupModal')
)
const MessageModal = dynamic(
  () => import('@/components/modal/MessageActionModal')
)
const ConfirmPinMessageModal = dynamic(
  () => import('@/components/modal/ConfirmPinMessageModal')
)

// types
import { GuardProps } from '@/types/auth'
import { GroupProvider } from '@/contexts/group'
import MobileNavigation from '@/components/layout/Sider/mobile'
import { DmProvider } from '@/contexts/dm'

const FundDisbursementModal = dynamic(
  () => import('@/components/modal/bf/FundDisbursementModal')
)

const TransactionWithdrawalModal = dynamic(
  () => import('@/components/modal/transactions/TransactionWithdrawalModal')
)

const TransactionFailedModal = dynamic(
  () => import('@/components/modal/transactions/TransactionFailedModal')
)

const TransactionDepositModal = dynamic(
  () => import('@/components/modal/transactions/TransactionDepositModal')
)

const ContributeFundBfCaseModal = dynamic(
  () => import('@/components/modal/ContributeFundBfCaseModal')
)
const FileCaseReviewModal = dynamic(
  () => import('@/components/modal/FileCaseReviewModal.tsx')
)
const ChannelAboutModal = dynamic(
  () => import('@/components/modal/ChannelAboutModal')
)
const PreviewFilesModal = dynamic(
  () => import('@/components/modal/PreviewFilesModal')
)
const AddChannelMembersModal = dynamic(
  () => import('@/components/modal/AddChannelMembersModal')
)
const DeleteMessageModal = dynamic(
  () => import('@/components/modal/DeleteMessageModal')
)
const GroupDeletionStartedModal = dynamic(
  () => import('@/components/modal/GroupDeletionStartedModal')
)

const ChannelDeletionModal = dynamic(
  () => import('@/components/modal/ChannelDeletionModal')
)

const BfRequestApprovedModal = dynamic(
  () => import('@/components/modal/bf/BfRequestApprovedModal')
)
const DeleteGroupModal = dynamic(
  () => import('@/components/modal/DeleteGroupModal')
)

const NotificationSettingModal = dynamic(
  () => import('@/components/modal/NotificationSettingModal')
)
const GroupAccessModal = dynamic(
  () => import('@/components/modal/GroupAccessModal')
)

const ComingSoonModal = dynamic(
  () => import('@/components/modal/ComingSoonModal')
)

const RemoveGroupMemberModal = dynamic(
  () => import('@/components/modal/RemoveGroupMemberModal')
)

const ConfirmUnPinMessageModal = dynamic(
  () => import('@/components/modal/ConfirmUnPinMessageModal')
)

// const WalletWithdrawalModal = dynamic(
//   () => import("@/components/modal/WalletWithdrawalModal")
// );
const WalletWithdrawalModal = dynamic(
  () => import('@/components/modal/WalletWithdrawalModal')
)

const CaseDisbursementModal = dynamic(
  () => import('@/components/modal/CaseDisbursementModal')
)

const FilePrincipalCaseModal = dynamic(
  () => import('@/components/modal/FilePrincipalCaseModal')
)
const GroupAdminModal = dynamic(
  () => import('@/components/modal/GroupAdminModal')
)
const SuspendAdminModal = dynamic(
  () => import('@/components/modal/SuspendAdminModal')
)
const FundInviteReceivedModal = dynamic(
  () => import('@/components/modal/FundInviteReceivedModal')
)
const TransitionFundModal = dynamic(
  () => import('@/components/modal/TransitionFundModal')
)
const WalletActivationModal = dynamic(
  () => import('@/components/modal/WalletActivationModal')
)
const NewWalletModal = dynamic(
  () => import('@/components/modal/NewWalletModal')
)
const AddGlobalMoneyModal = dynamic(
  () => import('@/components/modal/AddGlobalMoneyModal')
)
const WithdrawGlobalMoneyModal = dynamic(
  () => import('@/components/modal/WithdrawGlobalMoneyModal')
)
const TransactGlobalMoneyModal = dynamic(
  () => import('@/components/modal/TransactGlobalMoneyModal')
)
const DmAboutModal = dynamic(() => import('@/components/modal/DmAboutModal'))
const WaitListModal = dynamic(() => import('@/components/modal/WaitListModal'))
const HomeModal = dynamic(() => import('@/components/modal/HomeModal'))



const GroupPoolModal = dynamic(
  () => import('@/components/modal/GroupPoolModal')
)
const ContributionBalanceModal = dynamic(
  () => import('@/components/modal/ContributionBalanceModal')
)

// ==============================|| DASHBOARD LAYOUT ||============================== //

export default function Layout ({ children }: GuardProps) {
  return (
    <DmProvider>
      <GroupProvider>
        <>
          <Sider />
          <MobileNavigation />
          <CommunityList />
          <div className=' bg-[#F4F4F4]  flex-col max-tablet-lg:overflow-hidden overflow-hidden  h-[100dvh] tablet-lg:z-[20] tablet-lg:relative  flex  w-full    tablet-lg:h-screen  tablet-lg:overflow-hidden'>
            {children}
          </div>
          <ViewFullProfileModal />
          <CreateChannelModal />
          <BereavementFundInfoModal />

          <NewGroupModal />
          <InviteAdminModal />
          <InviteFriendsModal />
          <BfKycRequiredModal />
          <CrowdfundingKycRequiredModal />
          <WalletDepositModal />
          <WalletWithdrawalModal />
          <JoinedGroupModal />
          <DetailsUpdatedModal />
          <RequestToJoinBfModal />
          <TierModal />
          <PaySubscriptionModal />
          <TierModal />
          <AddBeneficiaryModal />
          <BeneficiaryModal />
          <SubmittedModal />
          <SelectModal />
          <AddModal />
          <DetailsModal />
          <FileCaseModal />
          <FilePrincipalCaseModal />
          <PendingPaymentModal />
          <InCompleteBeneficiaryKycModal />
          <LeaveGroupModal />
          <BfLeaveGroupModal />
          <FileCaseReviewModal />
          <ContributeFundBfCaseModal />
          <PreviewFilesModal />
          <AddChannelMembersModal />
          <DeleteMessageModal />
          <GroupDetailsModal />
          <ChannelAboutModal />
          <PinnedMessageModal />
          <GroupDeletionStartedModal />
          <DeleteGroupModal />
          <ChannelDeletionModal />
          <BfRequestApprovedModal />
          <MessageModal />
          <ConfirmPinMessageModal />
          <NotificationSettingModal />
          <GroupAccessModal />
          <ComingSoonModal />
          <RemoveGroupMemberModal />
          <ConfirmUnPinMessageModal />
          <FundDisbursementModal />
          <TransactionDepositModal />
          <TransactionFailedModal />
          <TransactionWithdrawalModal />
          <CaseDisbursementModal />
          <GroupAdminModal />
          <SuspendAdminModal />
          <FundInviteReceivedModal />
          <TransitionFundModal />
          <WalletActivationModal />
          <NewWalletModal />
          <AddGlobalMoneyModal />
          <WithdrawGlobalMoneyModal />
          <TransactGlobalMoneyModal />
          <DmAboutModal />
          <WaitListModal />
          <HomeModal />
          <GroupPoolModal />
          <ContributionBalanceModal />
        </>
      </GroupProvider>
    </DmProvider>
  )
}
