import React, { useEffect, useMemo, useRef, useState } from "react";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { DropdownOption, ExtendedTripFormFieldsProps, FormData } from "@/types/trips-type";
import { DateTimePickerBlock } from "../../ui/DateTimePickerBlock";
import { Checkbox } from "../../ui/checkbox";
import { Combobox } from "../../ui/combobox";
import { useDebounce } from "@/hooks/useDebounce";
import { getIAMUser } from "@/utils/services/iamAPI";
import {
  CREATE_TRIP_SEARCH,
  CREATE_TRIP_SEARCH_DEBOUNCE,
  CREATE_TRIP_SEARCH_KEY,
  ROLE_IDS,
} from "@/utils/constants";
import { useDispatch } from "react-redux";
import { getMasterVehicles } from "@/utils/services/masterAPI";
import useTripFormSelectors from "../../../../hooks/useTripFormSelectors";
import { setSearchQuery } from "@/store/slices/tripSearchSlice";

const TripFormFields: React.FC<ExtendedTripFormFieldsProps> = ({
  formData,
  date,
  time,
  isDatePickerOpen,
  dateTriggerRef,
  datePickerRef,
  handleSelectChange,
  handleDateChange,
  handleTimeChange,
  setIsDatePickerOpen,
  routeOptions,
  freightTypeOptions,
  setMeridiem,
  endDate,
  isEndDatePickerOpen,
  endDateTriggerRef,
  endDatePickerRef,
  handleEndDateChange,
  setIsEndDatePickerOpen,
  endTime,
  handleEndTimeChange,
  setEndMeridiem,
  showEndDateTime,
  setShowEndDateTime,
  reset = 0,
}) => {
  const dispatch = useDispatch();

  const [searchTerms, setSearchTerms] = useState({
    indent: "",
    driver: "",
    transporter: "",
    vehicle: "",
  });

  const [pageNumbers, setPageNumbers] = useState({
    indent: 1,
    driver: 1,
    transporter: 1,
    vehicle: 1,
  });

  const {
    IndentOptions,
    driverOptions,
    transporterOptions,
    vehicleOptions,
    transporterSearchOptions,
    driverSearchOptions,
    vehicleSearchOptions,
    driverPagination,
    transporterPagination,
    vehiclePagination,
    indentPagination,
    masterLoading,
    iamUserLoading,
  } = useTripFormSelectors();

  useEffect(() => {
    const isDataMissing =
      (driverOptions?.length ?? 0) === 0 &&
      (transporterOptions?.length ?? 0) === 0 &&
      (vehicleOptions?.length ?? 0) === 0;

    if (isDataMissing) {
      const fetchAllData = async () => {
        await Promise.all([
          getMasterVehicles(dispatch),
          getIAMUser({ roleId: ROLE_IDS.TRANSPORTER }, dispatch),
          getIAMUser({ roleId: ROLE_IDS.DRIVER }, dispatch),
        ]);
      };
      fetchAllData();
    }
  }, [driverOptions, transporterOptions, vehicleOptions, dispatch]);

  const [currentPages, setCurrentPages] = useState({
    indent: 1,
    driver: driverPagination?.pageNo || 1,
    transporter: transporterPagination?.pageNo || 1,
    vehicle: vehiclePagination?.pageNo || 1,
  });

  useEffect(() => {
    setCurrentPages((prev) => ({
      indent: prev.indent,
      driver: driverPagination?.pageNo || prev.driver,
      transporter: transporterPagination?.pageNo || prev.transporter,
      vehicle: vehiclePagination?.pageNo || prev.vehicle,
    }));
  }, [driverPagination?.pageNo, transporterPagination?.pageNo, vehiclePagination?.pageNo]);

  const handelLoadMore = (field: keyof typeof pageNumbers) => {
    const nextPage = pageNumbers[field] + 1;
    const paginationMap = {
      driver: driverPagination,
      transporter: transporterPagination,
      vehicle: vehiclePagination,
      indent: indentPagination,
    };

    const totalPages = paginationMap[field]?.totalPages || 0;
    if (nextPage > totalPages) return;

    setPageNumbers((prev) => ({
      ...prev,
      [field]: nextPage,
    }));

    const currentSearchQuery = searchTerms[field];

    if (field === CREATE_TRIP_SEARCH[2]) {
      getIAMUser({ roleId: ROLE_IDS.DRIVER, searchQuery: currentSearchQuery, pageNo: nextPage }, dispatch);
    } else if (field === CREATE_TRIP_SEARCH[1]) {
      getIAMUser({ roleId: ROLE_IDS.TRANSPORTER, searchQuery: currentSearchQuery, pageNo: nextPage }, dispatch);
    } else if (field === CREATE_TRIP_SEARCH[3]) {
      getMasterVehicles(dispatch, { searchQuery: currentSearchQuery, pageNo: nextPage });
    }
  };

  const getHasMore = (field: CREATE_TRIP_SEARCH_KEY) => {
    const paginationMap = {
      indent: indentPagination,
      driver: driverPagination,
      transporter: transporterPagination,
      vehicle: vehiclePagination,
    };

    const pagination = paginationMap[field];
    return pagination ? currentPages[field] < pagination.totalPages : false;
  };

  useEffect(() => {
    setSearchTerms({ indent: "", driver: "", transporter: "", vehicle: "" });
  }, [reset]);

  const debouncedDriver = useDebounce(searchTerms.driver, CREATE_TRIP_SEARCH_DEBOUNCE);
  const debouncedTransporter = useDebounce(searchTerms.transporter, CREATE_TRIP_SEARCH_DEBOUNCE);
  const debouncedVehicle = useDebounce(searchTerms.vehicle, CREATE_TRIP_SEARCH_DEBOUNCE);

  const debouncedSearch = useMemo(
    () => ({
      driver: debouncedDriver,
      transporter: debouncedTransporter,
      vehicle: debouncedVehicle,
    }),
    [debouncedDriver, debouncedTransporter, debouncedVehicle]
  );

  const prevDebouncedSearchRef = useRef({
    driver: "",
    transporter: "",
    vehicle: "",
  });

  useEffect(() => {
    const { driver, transporter, vehicle } = debouncedSearch;
    const prev = prevDebouncedSearchRef.current;

    const fetchData = (field: keyof typeof debouncedSearch, roleId?: string) => {
      setPageNumbers((prevPages) => ({ ...prevPages, [field]: 1 }));
      if (field === CREATE_TRIP_SEARCH[2] || field === CREATE_TRIP_SEARCH[1]) {
        getIAMUser({ roleId: roleId!, searchQuery: debouncedSearch[field] || "" }, dispatch);
      } else if (field === CREATE_TRIP_SEARCH[3]) {
        getMasterVehicles(dispatch, { searchQuery: debouncedSearch[field] || "" });
      }
    };

    if (driver && driver !== prev.driver) {
      fetchData(CREATE_TRIP_SEARCH[2], ROLE_IDS.DRIVER);
    }

    if (transporter && transporter !== prev.transporter) {
      fetchData(CREATE_TRIP_SEARCH[1], ROLE_IDS.TRANSPORTER);
    }

    if (vehicle && vehicle !== prev.vehicle) {
      fetchData(CREATE_TRIP_SEARCH[3]);
    }

    prevDebouncedSearchRef.current = { driver, transporter, vehicle };
  }, [debouncedSearch, dispatch]);

  const getDropdownOptions = (field: CREATE_TRIP_SEARCH_KEY): DropdownOption[] => {
    const isSearching = searchTerms[field]?.trim().length > 0;

    switch (field) {
      case CREATE_TRIP_SEARCH[2]:
        return isSearching ? driverSearchOptions : driverOptions;
      case CREATE_TRIP_SEARCH[1]:
        return isSearching ? transporterSearchOptions : transporterOptions;
      case CREATE_TRIP_SEARCH[3]:
        return isSearching ? vehicleSearchOptions : vehicleOptions;
      case CREATE_TRIP_SEARCH[0]:
        return IndentOptions;
      default:
        return [];
    }
  };

  const displayHours = time.hours % 12 === 0 ? 12 : time.hours % 12;
  const displayEndHours = endTime.hours % 12 === 0 ? 12 : endTime.hours % 12;

  return (
    <div className="grid grid-cols-2 gap-4">
      {CREATE_TRIP_SEARCH.map((key) => {
        const rawOptions = getDropdownOptions(key as CREATE_TRIP_SEARCH_KEY);
        const stringOptions = rawOptions.map((opt) =>
          opt.name ||
          `${opt.firstName || ""} ${opt.lastName || ""}`.trim() ||
          opt.registrationNo ||
          opt._id
        );

        const selectedValue = rawOptions.find((opt) => opt._id === formData[key as keyof FormData]);
        const selectedLabel =
          selectedValue?.name ||
          `${selectedValue?.firstName || ""} ${selectedValue?.lastName || ""}`.trim() ||
          selectedValue?.registrationNo ||
          null;

        return (
          <div key={key} className="grid gap-2">
            <Label htmlFor={key}>
              {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
            </Label>
            <Combobox
              options={stringOptions}
              selected={selectedLabel}
              onSelect={(label) => {
                const selected = rawOptions.find(
                  (opt) =>
                    opt.name === label ||
                    `${opt.firstName || ""} ${opt.lastName || ""}`.trim() === label ||
                    opt.registrationNo === label
                );
                if (selected) {
                  handleSelectChange(key as keyof FormData, selected._id);
                }
              }}
              disabled={key === CREATE_TRIP_SEARCH[0]}
              onSearchChange={(value) => {
                if (key !== CREATE_TRIP_SEARCH[0]) {
                  dispatch(setSearchQuery({ key, value }));
                }
                setSearchTerms((prev) => ({ ...prev, [key]: value }));
              }}

              hasMore={getHasMore(key as CREATE_TRIP_SEARCH_KEY)}
              onLoadMore={() => handelLoadMore(key as CREATE_TRIP_SEARCH_KEY)}
              reset={reset}
            />
          </div>
        );
      })}

      <DateTimePickerBlock
        id="start-date-time"
        label="Start Date & Time"
        date={date}
        setDatePickerOpen={setIsDatePickerOpen}
        isDatePickerOpen={isDatePickerOpen}
        dateTriggerRef={dateTriggerRef}
        datePickerRef={datePickerRef}
        onDateChange={handleDateChange}
        hours={displayHours}
        minutes={time.minutes}
        meridiem={time.meridiem}
        onTimeChange={handleTimeChange}
        onMeridiemChange={setMeridiem}
      />

      <div className="grid gap-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="show-end-date-time"
            checked={showEndDateTime}
            onCheckedChange={(checked: boolean) => setShowEndDateTime(checked)}
          />
          <Label htmlFor="show-end-date-time">Add End Date & Time</Label>
        </div>
        {showEndDateTime && (
          <DateTimePickerBlock
            id="end-date-time"
            label="End Date & Time"
            date={endDate}
            setDatePickerOpen={setIsEndDatePickerOpen}
            isDatePickerOpen={isEndDatePickerOpen}
            dateTriggerRef={endDateTriggerRef}
            datePickerRef={endDatePickerRef}
            onDateChange={handleEndDateChange}
            hours={displayEndHours}
            minutes={endTime.minutes}
            meridiem={endTime.meridiem}
            onTimeChange={handleEndTimeChange}
            onMeridiemChange={setEndMeridiem}
          />
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="route-select">Route</Label>
        <Select
          value={formData.route || ""}
          onValueChange={(value) => handleSelectChange("route", value)}
        >
          <SelectTrigger className="w-full" id="route-select">
            <SelectValue placeholder="Select route" />
          </SelectTrigger>
          <SelectContent>
            {routeOptions.map((opt) => (
              <SelectItem
                key={opt._id}
                value={opt._id}
                className="cursor-pointer hover:bg-gray-100 hover:text-gray-800"
              >
                {opt.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="freight-type-select">Freight Type</Label>
        <Select
          value={formData.freightType || ""}
          onValueChange={(value) => handleSelectChange("freightType", value)}
        >
          <SelectTrigger className="w-full" id="freight-type-select">
            <SelectValue placeholder="Select freight type" />
          </SelectTrigger>
          <SelectContent>
            {freightTypeOptions.map((opt) => (
              <SelectItem
                key={opt._id}
                value={opt._id}
                className="cursor-pointer hover:bg-gray-100 hover:text-gray-800"
              >
                {opt.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TripFormFields;
