import { useSettingModal } from "@/contexts/modal-setting";
import { formatAmount } from "@/utils/functions/formatAmount";
import React from "react";

const DetailSection = () => {
  const { modalData } = useSettingModal();

  const caseData = modalData?.caseDisbursementModal?.disbursement?.case;
  const disbursement = modalData?.caseDisbursementModal?.disbursement;

  const details = [
    {
      item: "Benefits Payable",
      amount: `UGX ${formatAmount(
        Number(disbursement?.amount || 0).toFixed(2)
      )}`,
    },
    {
      item: "Total case contributions",
      amount: `UGX ${formatAmount(String(caseData?.totalcontributions))}`,
    },
    {
      item: "Case Target Amount",
      amount: `UGX ${formatAmount(
        Number(caseData?.targetAmount || 0).toFixed(2)
      )}`,
      bold: true,
    },
    {
      item: "Current Disbursement total",
      amount: `UGX ${formatAmount(
        Number(disbursement?.amount || 0).toFixed(2)
      )}`,
      bold: true,
    },
  ];

  return (
    <div className="flex flex-col py-5 min-h-[200px]">
      <table className="table-auto w-full text-sm text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2 font-semibold">Item</th>
            <th className="py-2 font-semibold">Amount</th>
            <th className="py-2 font-semibold">Remark</th>
          </tr>
        </thead>
        <tbody>
          {details.map(({ item, amount, bold }, index) => (
            <tr key={index} className="border-b">
              <td className={`py-2 ${bold ? "font-bold" : ""}`}>{item}</td>
              <td className={`py-2 ${bold ? "font-bold" : ""}`}>{amount}</td>
              <td className="py-2">-</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DetailSection;
