export type WalletTypeTypes = | "mobilemoney" | "card";

export const WalletType: WalletTypeTypes[] = [ "mobilemoney", "card"]

export const walletMethodOptions = [ { value: "mobilemoney", label: "Mobile Money" },
    { value: "card", label: "Card" },
]