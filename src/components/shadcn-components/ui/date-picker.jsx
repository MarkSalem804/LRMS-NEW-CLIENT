import * as React from "react";
import PropTypes from "prop-types";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/shadcn-components/ui/button";
import { Calendar } from "@/components/shadcn-components/ui/calendar";
import { Input } from "@/components/shadcn-components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn-components/ui/popover";

function formatDateForInput(date) {
  if (!date) {
    return "";
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isValidDate(date) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

export function DatePicker({
  value,
  onChange,
  name,
  id,
  placeholder,
  required,
  className,
}) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState(value ? new Date(value) : undefined);
  const [month, setMonth] = React.useState(date || new Date());

  React.useEffect(() => {
    if (value) {
      const dateObj = new Date(value);
      if (isValidDate(dateObj)) {
        setDate(dateObj);
        setMonth(dateObj);
      } else {
        setDate(undefined);
      }
    } else {
      setDate(undefined);
    }
  }, [value]);

  const handleDateSelect = (selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
      setMonth(selectedDate);
      const dateString = formatDateForInput(selectedDate);

      if (onChange) {
        onChange({
          target: {
            name: name || id || "date",
            value: dateString,
          },
        });
      }
      setOpen(false);
    }
  };

  const handleInputChange = (e) => {
    const inputVal = e.target.value;

    if (inputVal) {
      const dateObj = new Date(inputVal);
      if (isValidDate(dateObj)) {
        setDate(dateObj);
        setMonth(dateObj);
      }
    } else {
      setDate(undefined);
    }

    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={`relative ${className || ""}`}>
      <Input
        id={id}
        name={name || id}
        type="text"
        value={date ? formatDateForInput(date) : value || ""}
        onChange={handleInputChange}
        placeholder={placeholder || "dd/mm/yyyy"}
        required={required}
        className="pr-10"
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={(e) => {
              e.preventDefault();
              setOpen(true);
            }}
          >
            <CalendarIcon className="h-4 w-4" />
            <span className="sr-only">Open calendar</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            month={month}
            onMonthChange={setMonth}
            captionLayout="dropdown"
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

DatePicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
};
