"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { DateRangePicker } from "@/app/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { SearchIcon, Funnel, X } from "lucide-react";
import { ReusableFilterProps } from "@/types/trips-type";
import { DataTableViewOptions } from "@/app/components/common/table/dataTableViewOptions";
import FilterTabs from "./FilterTabs";
import { SESSION_STORAGE_KEY } from "@/utils/constants";

export default function TableFilterBar<TData>({
  onFiltersApply,
  initialFilters,
  createNewButton,
  onCreateNew,
  onAllFilter,
  table,
  isDateRangePickerEnabled,
  searchQueryPlaceholder,
  options = [],
  selected = "",
  onSelect = () => { },
  enableTabs,
  isFilterMode,
  FilterHide = false,
  HideView = false,
  HideSearchInput = false,
  tabSelectInLocalStorage = "",
}: ReusableFilterProps<TData>) {
  const [searchQuery, setSearchQuery] = useState(
    initialFilters?.searchQuery || ""
  );
  const [lastAppliedRange, setLastAppliedRange] = useState<DateRange | undefined>(undefined);

  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    initialFilters?.tripStartDate && initialFilters?.tripEndDate
      ? {
        from: new Date(initialFilters.tripStartDate),
        to: new Date(initialFilters.tripEndDate),
      }
      : initialFilters?.tripStartDate
        ? { from: new Date(initialFilters.tripStartDate), to: undefined }
        : undefined
  );

  function convertLocalDateToUTCISOString(date: Date): string {
    const utcDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
    );
    return utcDate.toISOString();
  }

  const applyFilters = useCallback(
    (overrideSearchQuery?: string) => {
      const trimmedSearch = (overrideSearchQuery ?? searchQuery).trim();
      const isClearingAll = overrideSearchQuery === "";

      onFiltersApply?.({
        searchQuery: isClearingAll ? "" : trimmedSearch,
        tripStartDate: isClearingAll
          ? ""
          : dateRange?.from
            ? convertLocalDateToUTCISOString(dateRange.from)
            : "",
        tripEndDate: isClearingAll
          ? ""
          : dateRange?.to
            ? convertLocalDateToUTCISOString(dateRange.to)
            : "",
      });
    },
    [onFiltersApply, searchQuery, dateRange]
  );

  useEffect(() => {
    if (
      dateRange?.from &&
      dateRange?.to &&
      (lastAppliedRange?.from?.toDateString() !== dateRange.from.toDateString() ||
        lastAppliedRange?.to?.toDateString() !== dateRange.to.toDateString())
    ) {
      applyFilters();
      setLastAppliedRange(dateRange);
    }
  }, [dateRange, lastAppliedRange, applyFilters]);

  return (
    <div className="flex flex-wrap justify-between gap-y-2 pt-[24px] pb-[16px]">
      <div className="flex gap-x-4">
        {/* for controltower only */}
        {enableTabs && options.length > 0 && onSelect && (
          <FilterTabs
            options={options}
            selected={selected}
            onSelect={onSelect}
            isFilterMode={isFilterMode}
            tabSelectInLocalStorage={tabSelectInLocalStorage}
          />
        )}

        {!HideSearchInput && (
          <div
            className={`relative flex ${tabSelectInLocalStorage === SESSION_STORAGE_KEY.SO_FILTER_TAB_SELECTION
              ? "md:w-[40%]"
              : "md:min-w-[500px]"
              }`}
          >
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchQueryPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                setSearchQuery(value);

                // If input is cleared manually
                if (value.trim() === "") {
                  applyFilters("");
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyFilters();
              }}
              className="pl-10 pr-10 h-full rounded-[4px]"
            />
            {searchQuery && (
              <div
                onClick={() => {
                  setSearchQuery("");
                  applyFilters("");
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-gray-900"
              >
                <X className="w-[16px] h-[16px]" />
              </div>
            )}
          </div>
        )}

        {isDateRangePickerEnabled && (
          <DateRangePicker
            dateRange={dateRange}
            setDateRange={setDateRange}
            placeholder="Select a date range"
            onClear={() => {
              setDateRange(undefined);
              applyFilters("");
            }}
          />
        )}
      </div>

      <div className="flex gap-x-4">
        {createNewButton && (
          <Button
            onClick={onCreateNew}
            variant="default"
            className="h-auto bg-blue-600 flex gap-[8px] px-[16px]! text-white font-medium text-sm rounded"
          >
            {createNewButton}
          </Button>
        )}
        {(onAllFilter && !FilterHide) && (
          <Button
            onClick={onAllFilter}
            variant="outline"
            className="px-[12px] h-auto rounded-sm flex gap-[8px] cursor-pointer"
          >
            Filter
            <Funnel className="h-4 w-4" />
          </Button>
        )}

        {(table && !HideView) && (
          <>
            {/* column filter */}
            <DataTableViewOptions table={table} />
          </>
        )}
      </div>
    </div>
  );
}
