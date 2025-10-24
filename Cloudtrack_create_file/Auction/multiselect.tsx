"use client";

import type React from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "./dropdown-menu";
import { Checkbox } from "./checkbox";
import { Plus, Search, X } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";
import { cn } from "@/lib/utils"
import { Spinner } from "./spinner";

interface GenericOption {
  _id: string;
  name?: string;
  value?: string;
  label?: string;
}

interface MultiSelectProps {
  options: GenericOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  onSearchChange?: (val: string) => void;
  loading?: boolean;
  showSearch?: boolean;
  reset?: number;
  onDropdownToggle?: (open: boolean) => void;
  onLoadMore?: (page: number) => void;
  hasMore?: boolean;
  onAddHops?: () => void;
  enableWrap?: boolean;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select...",
  disabled = false,
  onSearchChange,
  loading = false,
  showSearch = true,
  onDropdownToggle,
  hasMore,
  onLoadMore,
  reset,
  onAddHops,
  enableWrap,
}: MultiSelectProps) {
  const [triggerWidth, setTriggerWidth] = useState<number | undefined>(
    undefined
  );
  console.log("MultiDirverTransporterVehicleSelector - mappedOptions:", options);

  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const [allOptions, setAllOptions] = useState<typeof options>([]);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");

  // Store scroll position with better tracking
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);
  const isLoadingMoreRef = useRef<boolean>(false);
  const prevOptionsLengthRef = useRef<number>(0);

  useEffect(() => {
    setSearchValue("");
  }, [reset]);

  // Keep all previously loaded options for rendering tags
  useEffect(() => {
    setAllOptions((prev) => {
      const combined = [...prev];
      options.forEach((opt) => {
        if (!combined.some((p) => p._id === opt._id)) {
          combined.push(opt);
        }
      });
      return combined;
    });
  }, [options]);

  // Set the dropdown width equal to trigger width
  useLayoutEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [selected.length, options.length]);

  // Reset page and scroll on search change
  useEffect(() => {
    setPage(1);
    isLoadingMoreRef.current = false;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
      scrollPositionRef.current = 0;
    }
  }, [searchValue]);

  // Improved scroll position restoration
  useLayoutEffect(() => {
    if (
      scrollContainerRef.current &&
      isLoadingMoreRef.current &&
      options.length > prevOptionsLengthRef.current
    ) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollPositionRef.current;
        }
        isLoadingMoreRef.current = false;
      });
    }
    prevOptionsLengthRef.current = options.length;
  }, [options.length]);

  // Enhanced scroll handler with better position tracking
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    scrollPositionRef.current = target.scrollTop;
  };

  const handleSearch = (val: string) => {
    onSearchChange?.(val.trim());
  };

  const toggleValue = (value: string) => {
    if (disabled) return;
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleRemoveTag = (
    e: React.MouseEvent<HTMLButtonElement>,
    optionId: string
  ) => {
    // Stop all event propagation immediately
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    // Force close dropdown if it's open
    handleDropdownToggle(false);

    // Remove the item
    toggleValue(optionId);

    // Prevent any further event handling
    return false;
  };

  // Handle trigger click - only open if not clicking on a tag
  const handleTriggerClick = (e: React.MouseEvent) => {
    // Check if click is on a remove button or tag
    const target = e.target as HTMLElement;
    if (target.closest("[data-remove-button]")) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    if (!disabled) {
      handleDropdownToggle(!isOpen);
    }
  };
  const handleDropdownToggle = (open: boolean) => {
    setIsOpen(open);
    onDropdownToggle?.(open);
    if (open) {
      setPage(1);
      isLoadingMoreRef.current = false;
      scrollPositionRef.current = 0;
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loading && !isLoadingMoreRef.current) {
      isLoadingMoreRef.current = true;
      const nextPage = page + 1;
      setPage(nextPage);
      onLoadMore?.(nextPage);
    }
  };

  const selectedOptions = allOptions.filter(
    (opt) => opt._id && selected.includes(opt._id)
  );

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleDropdownToggle}>

      <div className="flex items-center ">
        <DropdownMenuTrigger asChild disabled={disabled}>
          <div
            ref={triggerRef}
            onClick={handleTriggerClick}
            className={cn(
              " min-h-[40px] w-full border border-input bg-background px-1.5 py-0 text-left focus:outline-none flex items-center gap-1 overflow-x-auto whitespace-nowrap",

              disabled
                ? "opacity-50 cursor-not-allowed bg-muted"
                : "cursor-pointer",
              onAddHops ? "rounded-l-md rounded-r-none" : "rounded-md",
              enableWrap && "flex-wrap p-2"
            )}
          >
            {selectedOptions.length === 0 ? (
              <span className="text-muted-foreground text-sm">{placeholder}</span>
            ) : (
              selectedOptions.map((opt) => (
                <span
                  key={opt._id}
                  className="flex items-center bg-muted rounded px-2 py-0.5 text-sm mr-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {opt.name}
                  <button
                    type="button"
                    data-remove-button="true"
                    className={`ml-1 hover:text-destructive focus:outline-none focus:ring-1 focus:ring-red-500 rounded ${disabled ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                    onMouseDown={(e) => handleRemoveTag(e, opt._id)}
                    onClick={(e) => handleRemoveTag(e, opt._id)}
                    onPointerDown={(e) => handleRemoveTag(e, opt._id)}
                    aria-label={`Remove ${opt.name}`}
                    disabled={disabled}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))
            )}
          </div>
        </DropdownMenuTrigger>

        {onAddHops && (
          <Button
            onClick={() => onAddHops?.()}
            variant="secondary"
            className={cn("rounded-l-none rounded-r-md border border-l-0 border-input cursor-pointer min-h-[40px]")}
            disabled={disabled}
          >
            <Plus size={18} />
          </Button>
        )}
      </div>

      <DropdownMenuContent
        side="top"
        style={{ width: triggerWidth }}
        className="p-0 max-h-[390px]"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {showSearch && (
          <div className="p-2 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
            <Input
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => {
                const val = e.target.value;
                setSearchValue(val);
                handleSearch(val);
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-full pl-9 border-0 border-b border-gray-300 focus-visible:ring-0 hover:border-b-gray-300 rounded-none"
            />
          </div>
        )}

        {/* Scrollable options */}
        <div
          ref={scrollContainerRef}
          className="max-h-[290px] overflow-auto"
          onScroll={handleScroll}
        >
          {loading && options.length === 0 ? (
            <div className="py-2 px-3 text-sm text-muted-foreground">
              <Spinner size="medium" className="text-blue-500" />
            </div>
          ) : options.length === 0 ? (
            <div className="py-2 px-3 text-sm text-muted-foreground">
              No option found.
            </div>
          ) : (
            <>
              {options.map((opt) => (
                <div
                  key={opt._id}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-muted",
                    disabled ? "opacity-50 cursor-not-allowed" : "",
                    selected.includes(opt._id) && "bg-gray-100"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!disabled && opt._id) {
                      toggleValue(opt._id);
                    }
                  }}
                >
                  <Checkbox
                    checked={selected.includes(opt._id)}
                    onCheckedChange={() => !disabled && toggleValue(opt._id)}
                    disabled={disabled}
                  />
                  <span>{opt.name || opt.label}</span>
                </div>
              ))}
              {loading && options.length > 0 && (
                <div className="py-2 px-3 text-sm text-muted-foreground text-center">
                  Loading more...
                </div>
              )}
            </>
          )}
        </div>

        {/* Load More button */}
        {showSearch && !loading && (
          <div className="text-center border-t">
            <Button
              disabled={!hasMore || loading}
              className="text-sm cursor-pointer hover:bg-transparent no-underline hover:text-blue-800"
              onClick={(e) => {
                e.stopPropagation();
                handleLoadMore();
              }}
              variant="ghost"
            >
              Load more
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
