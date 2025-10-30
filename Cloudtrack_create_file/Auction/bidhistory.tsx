"use client";

import React, { useEffect, useMemo, useState } from "react";
import { SortingState } from "@tanstack/react-table";
import DataTable from "@/app/components/common/table/dataTable";
import { BID_STATUS, LIMIT_SESSION_STORAGE_ROW_PER_PAGE } from "@/utils/constants";
import { Bid, BidsDataResponse } from "@/types/auction";
import { buildBidColumns } from "./bidColumns";

interface BidHistoryProps {
  bidsData: BidsDataResponse;
  isOpen: boolean;
  onAccept: (rank: string) => void;
  formatDate: (ts: string) => string;
  onFetch?: (page: number, limit: number, sort: "asc" | "desc") => Promise<void>;
  rowsPerPageStorageKey?: string;
}

export default function BidHistoryDataTable({
  bidsData,
  isOpen,
  onAccept,
  formatDate,
  onFetch,

}: BidHistoryProps) {
  const [pageNo, setPageNo] = useState<number>(bidsData?.pagination?.pageNo || 1);
  const [limit, setLimit] = useState<number>(bidsData?.pagination?.limit || 10);
  const [totalItems, setTotalItems] = useState<number>(bidsData?.pagination?.totalItems || 0);
  const [sorting, setSorting] = useState<SortingState>([]);

  // Compute simple load-bearing values
  const bids = useMemo<Bid[]>(() => bidsData?.bids || [], [bidsData]);

  useEffect(() => {
    setTotalItems(bidsData?.pagination?.totalItems || 0);
    setPageNo(bidsData?.pagination?.pageNo || 1);
    setLimit(bidsData?.pagination?.limit || limit);
  }, [bidsData]);

  // Determine lowest bid numeric value
  const lowestBid = useMemo(() => {
    if (!bids || bids.length === 0) return null;
    // find numeric minimum of bidPricePerTon
    let min = bids[0].bidPricePerTon;
    for (let i = 1; i < bids.length; i++) {
      if (bids[i].bidPricePerTon < min) min = bids[i].bidPricePerTon;
    }
    return min;
  }, [bids]);

  // check if any accepted bid exists
  const acceptedExists = useMemo(() => bids.some(b => b.action === BID_STATUS.ACCEPTED), [bids]);

  // When page/limit/sort changes, call onFetch if provided
  useEffect(() => {
    const sortParam = (() => {
      if (sorting.length === 0) return "desc";
      return sorting[0].desc ? "asc" : "desc";
    })() as "asc" | "desc";

    if (onFetch) {
      onFetch(pageNo, limit, sortParam).catch((e) => {
        console.error("Error fetching bids on page/limit change:", e);
      });
    }
  }, [pageNo, limit, sorting]);

  const columns = useMemo(
    () =>
      buildBidColumns({
        isOpen,
        onAccept,
        lowestBid,
        acceptedExists,
        formatDate,
      }),
    [isOpen, onAccept, lowestBid, acceptedExists, formatDate]
  );

  // const transformedData = useMemo(() => {
  //   return bids.map((b) => {
  //     const isAccepted = b.action === BID_STATUS.ACCEPTED;
  //     const isLowest = b.bidPricePerTon === lowestBid;
  //     let rowClass = "";
  //     if (isAccepted) rowClass = "bg-green-200 text-gray-900";
  //     else if (isLowest) rowClass = "bg-green-50 text-gray-900";
  //     return { ...b, _rowClass: rowClass };
  //   });
  // }, [bids, lowestBid]);


  return (
    <div className="w-full  pt-4">
      <DataTable<Bid, unknown>
        columns={columns}
        data={bids}
        pageNo={pageNo}
        setPageNo={setPageNo}
        totalItems={totalItems}
        limit={limit}
        setLimit={setLimit}
        onSortChange={(newSorting: SortingState) => setSorting(newSorting)}
        sorting={sorting}
        onFiltersApply={() => { }}
        initialFilters={{}}
        onCreateNew={() => { }}
        hideFilterBar={true}
        rowsPerPageStorageKey={LIMIT_SESSION_STORAGE_ROW_PER_PAGE.AUCTION_DETAILS}
      />
    </div>
  );
}
