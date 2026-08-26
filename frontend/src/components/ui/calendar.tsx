import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col gap-4 sm:flex-row",
        month_grid: "w-full border-collapse space-y-1",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        button_previous: cn(
          buttonVariants({ variant: "outline", size: "icon-sm" }),
          "absolute left-1 size-7 bg-transparent p-0 opacity-70 hover:opacity-100"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline", size: "icon-sm" }),
          "absolute right-1 size-7 bg-transparent p-0 opacity-70 hover:opacity-100"
        ),
        month_caption: "flex h-7 w-full items-center justify-center",
        weekday:
          "w-9 text-[0.8rem] font-normal text-muted-foreground",
        day: "relative h-9 w-9 p-0 text-center text-sm focus-within:relative focus-within:z-20",
        day_button: cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "size-9 rounded-md p-0 font-normal aria-selected:opacity-100"
        ),
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        today: "bg-accent text-accent-foreground",
        outside:
          "text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        disabled: "text-muted-foreground opacity-50",
        hidden: "invisible",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        range_end: "range-end",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className, ...chevronProps }) =>
          orientation === "left" ? (
            <ChevronLeftIcon className={cn("size-4", className)} {...chevronProps} />
          ) : (
            <ChevronRightIcon className={cn("size-4", className)} {...chevronProps} />
          ),
      }}
      {...props}
    />
  )
}

export { Calendar }
