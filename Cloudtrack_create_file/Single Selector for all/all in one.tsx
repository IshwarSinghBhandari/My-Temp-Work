"use client";

import React, { useEffect, useRef, useState } from "react";
import { Label } from "@/app/components/ui/label";
import { Combobox } from "../../ui/combobox";
import { useDebounce } from "@/hooks/useDebounce";
import { useDispatch } from "react-redux";
import {
  getMasterLocations,
  getMasterRoutes,
  getMasterVehicleTypes,
  getMasterVehicles,
} from "@/utils/services/masterAPI";
import { getIAMUser } from "@/utils/services/iamAPI";
import useTripFormSelectors from "@/hooks/useTripFormSelectors";
import { setSearchQuery } from "@/store/slices/tripSearchSlice";
import { DropdownOption } from "@/types/trips-type";
import { Vehicle, VehicleType } from "@/types/common";

type EntityType =
  | "vehicle"
  | "vehicleType"
  | "location"
  | "route"
  | "driver"
  | "transporter";

type UnifiedEntitySelectorProps = {
  type: EntityType;
  selectedId: string | null;
  onSelect: (id: string) => void;
  reset?: number;
  label?: string;
  id?: string;
  searchKey?:
    | "vehicle"
    | "vehicleType"
    | "location"
    | "route"
    | "driver"
    | "transporter";
  roleId?: string; // required for driver/transporter
};

const UnifiedEntitySelector: React.FC<UnifiedEntitySelectorProps> = ({
  type,
  selectedId,
  onSelect,
  reset = 0,
  label,
  id,
  searchKey,
  roleId,
}) => {
  const dispatch = useDispatch();
  const {
    vehicleOptions,
    vehicleSearchOptions,
    vehiclePagination,
    vehicleTypeOptions,
    vehicleTypeSearchOptions,
    vehicleTypePagination,
    locationOptions,
    locationSearchOptions,
    locationPagination,
    routeOptions,
    routeSearchOptions,
    routePagination,
    driverOptions,
    driverSearchOptions,
    driverPagination,
    transporterOptions,
    transporterSearchOptions,
    transporterPagination,
  } = useTripFormSelectors();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const prevSearchRef = useRef("");

  // API function selection
  const fetchAPI = (
    pageNo?: number,
    searchQuery?: string
  ): void => {
    const trimmed = searchQuery?.trim() || "";
    switch (type) {
      case "vehicle":
        getMasterVehicles(dispatch, {
          pageNo,
          searchQuery: trimmed || undefined,
        });
        break;
      case "vehicleType":
        getMasterVehicleTypes(dispatch, {
          pageNo,
          searchQuery: trimmed || undefined,
        });
        break;
      case "route":
        getMasterRoutes(dispatch, {
          pageNo,
          searchQuery: trimmed || undefined,
        } as any);
        break;
      case "location":
        getMasterLocations(dispatch, {
          pageNo,
          searchQuery: trimmed || undefined,
        });
        break;
      case "driver":
      case "transporter":
        getIAMUser(
          { roleId, pageNo, searchQuery: trimmed || undefined },
          dispatch
        );
        break;
    }
  };

  // Select options/search/pagination from store
  let options: any[] = [];
  let searchOptions: any[] = [];
  let pagination: any = null;
  switch (type) {
    case "vehicle":
      options = vehicleOptions;
      searchOptions = vehicleSearchOptions;
      pagination = vehiclePagination;
      break;
    case "vehicleType":
      options = vehicleTypeOptions;
      searchOptions = vehicleTypeSearchOptions;
      pagination = vehicleTypePagination;
      break;
    case "route":
      options = routeOptions;
      searchOptions = routeSearchOptions;
      pagination = routePagination;
      break;
    case "driver":
      options = driverOptions;
      searchOptions = driverSearchOptions;
      pagination = driverPagination;
      break;
    case "transporter":
      options = transporterOptions;
      searchOptions = transporterSearchOptions;
      pagination = transporterPagination;
      break;
    default:
      options = locationOptions;
      searchOptions = locationSearchOptions;
      pagination = locationPagination;
  }

  // initial load
  useEffect(() => {
    if (!options?.length) {
      fetchAPI(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  // debounced search
  useEffect(() => {
    const trimmed = debouncedSearchTerm.trim();
    if (trimmed === prevSearchRef.current) return;
    prevSearchRef.current = trimmed;
    setPage(1);
    fetchAPI(1, trimmed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, type, roleId]);

  // load more
  const handleLoadMore = () => {
    const totalPages = pagination?.totalPages || 0;
    const nextPage = page + 1;
    if (nextPage > totalPages) return;
    setPage(nextPage);
    fetchAPI(nextPage, searchTerm);
  };

  const currentOptions = searchTerm.trim() ? searchOptions : options;
  const selectedItem = currentOptions.find((v) => v._id === selectedId);

  const resolveLabel = (item: any): string => {
    if (!item) return "";
    switch (type) {
      case "vehicle": {
        const vehicle = item as Vehicle;
        return (
          vehicle?.name?.trim() ||
          vehicle?.registrationNo?.trim() ||
          item?._id ||
          ""
        );
      }
      case "vehicleType":
        return (item as VehicleType)?.name || "";
      case "driver":
      case "transporter":
      case "location":
      case "route": {
        const op = item as DropdownOption;
        return op?.name || op?._id || "";
      }
    }
  };

  const selectedLabel = resolveLabel(selectedItem);

  // Reset
  useEffect(() => {
    if (reset) setSearchTerm("");
  }, [reset]);

  // label text
  const labelText = label
    ? label
    : type === "vehicle"
    ? "Vehicle"
    : type === "vehicleType"
    ? "Vehicle Type"
    : type === "driver"
    ? "Driver"
    : type === "transporter"
    ? "Transporter"
    : type === "route"
    ? "Route"
    : "Location";

  const controlId = id ?? `${type}-select`;

  // resolve search key (redux)
  const resolvedSearchKey =
    searchKey ||
    (type === "vehicle"
      ? "vehicle"
      : type === "vehicleType"
      ? "vehicleType"
      : type === "driver"
      ? "driver"
      : type === "transporter"
      ? "transporter"
      : type === "route"
      ? "route"
      : "location");

  return (
    <div className="grid gap-2">
      <Label htmlFor={controlId}>{labelText}</Label>
      <Combobox
        id={controlId}
        options={currentOptions
          .map((o) => resolveLabel(o))
          .filter((v) => v.length > 0)}
        selected={selectedLabel}
        onSelect={(label) => {
          const match = currentOptions.find((item) => resolveLabel(item) === label);
          if (match?._id) onSelect(match._id);
        }}
        onSearchChange={(value) => {
          setSearchTerm(value);
          dispatch(setSearchQuery({ key: resolvedSearchKey, value }));
        }}
        hasMore={pagination?.totalPages ? page < pagination.totalPages : false}
        onLoadMore={handleLoadMore}
        reset={reset}
      />
    </div>
  );
};

export default UnifiedEntitySelector;


