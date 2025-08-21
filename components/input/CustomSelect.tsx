import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface CustomCustomSelectProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange?: (value: string) => void;
  className?: string;
  error?: string | undefined | false;
  options: Option[];
  optionPlaceHolder?: string;
  selectTriggerClassName?: string;
  showStar?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  optionClassName?: string;
  isSearchable?: boolean;
}

const CustomSelect: React.FC<CustomCustomSelectProps> = ({
  placeholder,
  error,
  className,
  label,
  options,
  optionPlaceHolder,
  selectTriggerClassName,
  disabled = false,
  onChange,
  value,
  showStar,
  optionClassName,
  isLoading,
  isSearchable = false,
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [visibleCount, setVisibleCount] = React.useState(10);
  const selectContentRef = React.useRef<HTMLDivElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle scroll events for infinite loading
  const handleScroll = () => {
    if (selectContentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        selectContentRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        // Load more when 20px from bottom
        setVisibleCount((prev) => Math.min(prev + 10, filteredOptions.length));
      }
    }
  };

  // Reset visible count when options change or dropdown opens
  React.useEffect(() => {
    setVisibleCount(10);
  }, [filteredOptions.length, isOpen]);

  // Handle opening/closing of select
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // setSearchTerm("");
      setVisibleCount(10); // Reset visible count when closing
    }
  };

  const displayedOptions = !!isSearchable
    ? filteredOptions.slice(0, visibleCount)
    : options;

  return (
    <div className={`flex flex-col relative ${className}`}>
      {label && (
        <label>
          {label} <span className="text-red-600">{showStar && "*"}</span>
        </label>
      )}
      <Select
        value={isSearchable ? "" : value}
        onValueChange={onChange}
        open={isOpen}
        onOpenChange={handleOpenChange}
      >
        <SelectTrigger
          disabled={disabled}
          className={`w-full ${selectTriggerClassName}`}
        >
          <SelectValue
            className="text-red-700"
            placeholder={placeholder || "Select"}
          />
        </SelectTrigger>
        <SelectContent
          className="bg-white z-[60] max-h-[300px]"
          ref={selectContentRef}
          onScroll={handleScroll}
        >
          {isSearchable && (
            <div className="sticky top-0 bg-white z-10 px-2 py-1 border-b">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 outline-none"
                autoFocus
              />
            </div>
          )}
          <SelectGroup>
            <SelectLabel>
              {!!isSearchable && isLoading ? (
                <>Loading...</>
              ) : displayedOptions.length === 0 ? (
                "No options found"
              ) : (
                optionPlaceHolder
              )}
            </SelectLabel>

            {displayedOptions.map((opt, i) => (
              <SelectItem key={i} value={opt.value} className={optionClassName}>
                <div className="flex items-center gap-2">
                  {opt.icon}
                  <span>{opt.label}</span>
                </div>
              </SelectItem>
            ))}
            {!!isSearchable && visibleCount < displayedOptions.length && (
              <div className="p-2 text-center text-sm text-gray-500">
                Scroll to load more...
              </div>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && <p className="text-negative mt-2 capitalize">{error}</p>}
    </div>
  );
};

export default CustomSelect;
