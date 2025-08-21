"use client";
import React, { createContext, useContext, useState } from "react";

// Define ModalState to represent the state of modals
interface ModalState {
  [key: string]: boolean;
}
interface ModalDataState {
  [key: string]: any;
}

// Define ModalContextType explicitly without extending ModalState
interface ModalContextType {
  modals: ModalState;
  openModal: (modalName: string, data?: any) => void;
  toggleModal: (modalName: string, data?: any) => void;
  closeAllModals: () => void;
  updateModalData: (modalName: string, data: any) => void;
  modalData: any;
  closeModal: (modalName: string) => void;
}

// Create the ModalContext
const initialValue: ModalContextType = {
  modals: {},
  toggleModal: () => {},
  closeAllModals: () => {},
  updateModalData: () => {},
  modalData: {},
  closeModal: () => {},
  openModal: () => {},
};

const ModalContext = createContext<ModalContextType>(initialValue);

// Custom hook for consuming the context
export const useSettingModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a SettingModalProvider");
  }
  return context;
};

// Modal provider component
export const SettingModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [modals, setModals] = useState<ModalState>({
    friendProfileModal: false,
    userSearchModal: false,
    newChannelModal: false,
    newRoomModal: false,
    newGroupModal: false,
    groupSider: false,
    inviteAdminsModal: false,
    groupDetailsModal: false,
    bfKycRequiredModal: false,
    joinedGroupModal: false,
    detailsUpdatedModal: false,
    fundInviteReceivedModal: false,
    approveModal: false,
    rejectModal: false,
    campaignSuccessModal: false,
    inviteEndorsersModal: false,
  });
  const [modalData, setModalData] = useState<ModalDataState>({});

  const toggleModal = (modalName: string, data?: any) => {
    setModals((prev) => {
      const updated = { ...prev, [modalName]: !prev[modalName] };
      Object.keys(updated).forEach((key) => {
        if (key !== modalName) updated[key] = false;
      });
      return updated;
    });
    if (data) {
      setModalData((prev) => ({ ...prev, [modalName]: data }));
    }
  };

  const openModal = (modalName: string, data?: any) => {
    setModals((prev) => {
      const updated = { ...prev, [modalName]: true };
      return updated;
    });
    if (data) {
      setModalData((prev) => ({ ...prev, [modalName]: data }));
    }
  };

  const updateModalData = (modalName: string, data: any) => {
    setModalData((prev) => ({
      ...prev,
      [modalName]: prev[modalName] ? { ...prev[modalName], ...data } : data,
    }));
  };

  const closeAllModals = () => {
    setModals(
      Object.keys(modals).reduce((acc, key) => ({ ...acc, [key]: false }), {})
    );
  };
  const closeModal = (modalName: string) => {
    setModals((prev) => ({ ...prev, [modalName]: false }));
    
    // Delay clearing modal data to allow components to read it
    setTimeout(() => {
      setModalData((prev) => ({ ...prev, [modalName]: null }));
    }, 200);
  };

  return (
    <ModalContext.Provider
      value={{
        modals,
        toggleModal,
        closeAllModals,
        updateModalData,
        modalData,
        closeModal,
        openModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
