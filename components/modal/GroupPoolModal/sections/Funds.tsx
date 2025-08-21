"use client";

import Image from "next/image";
import { useState } from "react";
import { IoIosCloseCircleOutline, IoIosArrowRoundBack } from "react-icons/io";
import { IoChevronDownOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import CustomSlideToggle from "@/components/custom/CustomSlideToggle";

function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const Funds: React.FC<{
  handleToggleModal: () => void;
  next: () => void;
  back: () => void;
}> = ({ handleToggleModal, next, back }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [isOn, setIsOn] = useState(false);
  const [preferenceError, setPreferenceError] = useState("");

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const placeholderDate = new Date(2025, 6, 22);
  const [selectedDate, setSelectedDate] = useState<Date>(placeholderDate);

  const [displayMonth, setDisplayMonth] = useState<number>(
    placeholderDate.getMonth()
  );
  const [displayYear, setDisplayYear] = useState<number>(
    placeholderDate.getFullYear()
  );

  const cards = [
    {
      id: "wallet",
      src: "/icon/bluewallet.svg",
      label: "Twezimbe Wallet",
      labelColor: "text-primary",
    },
    {
      id: "card",
      src: "/icon/orangecard.svg",
      label: "Bank Card",
      labelColor: "text-secondary",
    },
    {
      id: "mobile",
      src: "/icon/ashcard.svg",
      label: "Mobile Money",
      labelColor: "text-black",
    },
  ];

  const handleSubmit = () => {
    setPreferenceError("");

    if (!selected) {
      setPreferenceError("Please select a source of funds");
      return;
    }

    next();
  };

  const daysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  const daysArray = Array.from(
    { length: daysInMonth(displayYear, displayMonth) },
    (_, i) => i + 1
  );

  const goToPrevMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear((prev) => prev - 1);
    } else {
      setDisplayMonth((prev) => prev - 1);
    }
  };

  const goToNextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear((prev) => prev + 1);
    } else {
      setDisplayMonth((prev) => prev + 1);
    }
  };

  return (
    <>
      <div className="w-full overflow-y-auto">
        <div className="relative">
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <IoIosArrowRoundBack
              onClick={back}
              className="text-2xl text-gray-500 cursor-pointer hover:text-gray-700"
            />
            <h1 className="text-gray-700 font-medium">Back</h1>
          </div>

          <div className="absolute top-4 right-4">
            <IoIosCloseCircleOutline
              onClick={handleToggleModal}
              className="text-2xl text-gray-500 cursor-pointer hover:text-gray-700"
            />
          </div>
        </div>

        <div className="px-6 py-8 space-y-6 mt-8">
          <div>
            <h1 className="mb-2">Set start date</h1>
            <div className="relative w-full">
              <div
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="w-full border border-gray-300 rounded-lg py-2 pl-3 pr-3 text-gray-700 flex items-center cursor-pointer focus-within:ring-2 focus-within:ring-primary"
              >
                <span className="flex-1">{formatDate(selectedDate)}</span>
                <IoChevronDownOutline className="text-gray-500" size={20} />
              </div>

              {isCalendarOpen && (
                <div className="absolute z-10 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-3 w-full">
                  <div className="flex justify-between items-center mb-2">
                    <button
                      type="button"
                      onClick={goToPrevMonth}
                      className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                    >
                      &lt;
                    </button>
                    <span className="font-semibold">
                      {new Date(displayYear, displayMonth).toLocaleString(
                        "default",
                        { month: "long" }
                      )}{" "}
                      {displayYear}
                    </span>
                    <button
                      type="button"
                      onClick={goToNextMonth}
                      className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                    >
                      &gt;
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {daysArray.map((day) => (
                      <div
                        key={day}
                        onClick={() => {
                          setSelectedDate(
                            new Date(displayYear, displayMonth, day)
                          );
                          setIsCalendarOpen(false);
                        }}
                        className={`w-8 h-8 flex items-center justify-center rounded-md cursor-pointer 
                          ${
                            day === selectedDate.getDate() &&
                            displayMonth === selectedDate.getMonth() &&
                            displayYear === selectedDate.getFullYear()
                              ? "bg-primary text-white"
                              : "hover:bg-gray-200"
                          }`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h1 className="mb-3">Set source of funds</h1>
            <div className="w-full flex justify-between items-center gap-4">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={`relative cursor-pointer border rounded-lg p-1 ${
                    selected === card.id
                      ? "border-primary"
                      : preferenceError
                      ? "border-red-500"
                      : "border-transparent"
                  }`}
                  onClick={() => {
                    setSelected(card.id);
                    setPreferenceError("");
                  }}
                >
                  <Image
                    src={card.src}
                    alt={card.label}
                    width={100}
                    height={100}
                  />
                  <span
                    className={`absolute inset-0 flex items-center justify-center font-bold text-xs whitespace-nowrap ${card.labelColor}`}
                  >
                    {card.label}
                  </span>
                  {selected === card.id && (
                    <div className="absolute top-1 right-1 bg-blue-300 rounded-md border border-gray-400 w-5 h-5 flex items-center justify-center">
                      <FaCheck className="text-primary text-xs" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {preferenceError && (
              <p className="text-red-500 text-sm mt-2">{preferenceError}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <CustomSlideToggle
              isOn={isOn}
              toggle={() => setIsOn((prev) => !prev)}
              disabled={false}
              isLoading={false}
            />
            <h1>Enable Auto-save</h1>
          </div>
        </div>
      </div>

      <div className="w-full p-2 bg-white mt-4">
        <button
          type="button"
          className="w-full py-2 bg-primary text-white rounded-lg"
          onClick={handleSubmit}
        >
          Complete
        </button>
      </div>
    </>
  );
};

export default Funds;
