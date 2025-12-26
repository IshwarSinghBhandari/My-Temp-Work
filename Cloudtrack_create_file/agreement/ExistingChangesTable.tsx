"use client";

import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Input } from "@/app/components/ui/input";
import { ArchiveRestore, Trash2, Pencil, Check, X, CalendarIcon } from "lucide-react";
import { ParseDateTime } from "@/utils/common/parseDateTime";
import { useAppSelector } from "@/store/hooks";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { Calendar } from "@/app/components/ui/calendar";
import { cn } from "@/lib/utils";
import VehicleAndVehicleTypeSelectionField from "@/app/components/common/selectorForForms/VehicleAndVehicleTypeSelectionField";
import { MASTER_FORM_FIELD_TYPES } from "@/utils/constants";
import {
  ChargeEntry,
  ChargeRow,
  DetentionChargeRow,
  ExistingChangesTableProps,
} from "@/types/agreement";
import {
  getTableColumns,
  isVehicleChargeRow,
  isRouteChargeRow,
  isDetentionChargeRow,
  mapChargeCodeToType,
} from "@/app/components/billing/agreement/util/chargeHelpers";
import { ConfirmDialogBox } from "@/app/components/common/ConfirmDialogBox";

export function ExistingChangesTable({
  chargeType,
  onRemove,
  onBulkRemove,
}: ExistingChangesTableProps) {
  const { details, detailsLoading, detailsError, chargeTypes } = useAppSelector(
    (state) => state.agreement
  );

  const data: ChargeRow[] = useMemo(() => {
    if (!details?.details?.length || !chargeTypes.length) return [];

    // Map API chargeTypeId (string) to ChargeType enum via charge type lookup
    const detail = details.details.find((item) => {
      const chargeTypeItem = chargeTypes.find((ct) => ct.id === item.chargeTypeId);
      if (!chargeTypeItem) return false;
      const mappedType = mapChargeCodeToType(chargeTypeItem.code);
      return mappedType === chargeType;
    });
    if (!detail) return [];

    return detail.charges.map((charge: ChargeEntry) => {
      const base = {
        id: charge.chargeEntryId,
        charges: charge.charges.toString(),
        startDate: new Date(charge.startDate),
        endDate: new Date(charge.endDate),
      } as const;

      switch (chargeType) {
        case "vehicle-non-placement":
        case "cancellation-arrival":
          return {
            ...base,
            vehicleType: charge.vehicleTypeId || "-",
          };

        case "multi-point-pick":
        case "multi-point-drop":
          return {
            ...base,
            source: charge.sourceId || "-",
            destination: charge.destinationId || "-",
          };

        case "detention-source":
        case "detention-destination":
        case "late-delivery": {
          const start = charge.startTime ?? "";
          const end = charge.endTime ?? "";
          const timePeriod =
            start !== "" && end !== "" ? `${start}:00 - ${end}:00` : "-";

          return {
            ...base,
            vehicleType: charge.vehicleTypeId || "-",
            day: charge.day?.toString() || "-",
            timePeriod,
          };
        }

        default:
          return base as unknown as ChargeRow;
      }
    });
  }, [chargeType, details]);

  const columns = useMemo(() => getTableColumns(chargeType), [chargeType]);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{ type: "single" | "bulk"; indexes: number[] }>({
    type: "single",
    indexes: [],
  });
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<Partial<ChargeRow>>({});
  const [resetCount, setResetCount] = useState(0);

  const { allSelected, someSelected } = useMemo(() => {
    const all = data.length > 0 && selectedRows.size === data.length;
    const some = selectedRows.size > 0 && selectedRows.size < data.length;
    return { allSelected: all, someSelected: some };
  }, [data.length, selectedRows]);

  const toggleRow = (index: number, checked: boolean) => {
    const updated = new Set(selectedRows);
    if (checked) updated.add(index);
    else updated.delete(index);
    setSelectedRows(updated);
  };

  const toggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(data.map((_, idx) => idx)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const openConfirm = (indexes: number[], type: "single" | "bulk") => {
    setPendingDelete({ type, indexes });
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (pendingDelete.type === "bulk") {
      onBulkRemove?.(pendingDelete.indexes);
      setSelectedRows(new Set());
    } else {
      const idx = pendingDelete.indexes[0];
      if (idx !== undefined) onRemove?.(idx);
    }
    setConfirmOpen(false);
  };

  const handleStartEdit = (index: number, row: ChargeRow) => {
    setEditingRow(index);
    setEditedData({ ...row });
    setResetCount((prev) => prev + 1);
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditedData({});
    setResetCount((prev) => prev + 1);
  };

  const handleSaveEdit = async (index: number) => {
    // TODO: Call API to update the charge
    // For now, just exit edit mode
    // You can add: await updateAgreementCharge(agreementId, chargeType, editedData);
    setEditingRow(null);
    setEditedData({});
    // Optionally refresh data after update
  };

  const handleFieldChange = (field: string, value: string | Date) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (detailsLoading) {
    return <div className="text-sm text-muted-foreground">Loading existing charges...</div>;
  }

  if (detailsError) {
    return <div className="text-sm text-destructive">Failed to load existing charges.</div>;
  }

  return (
    <div className="border-t mt-2 pt-4 overflow-hidden flex flex-col gap-2">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-sm font-semibold px-2 py-2 rounded-md ">
          <ArchiveRestore className="w-4 h-4 text-primary" />
          <span>Existing charges</span>
        </div>
        {selectedRows.size > 1 && editingRow === null && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() =>
              openConfirm(Array.from(selectedRows.values()).sort((a, b) => a - b), "bulk")
            }
          >
            Delete Selected ({selectedRows.size})
          </Button>
        )}
      </div>

      <div className="border-y">
        <div className="max-h-[250px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background">
              <TableRow className="bg-muted hover:bg-muted/80">
                <TableHead className="w-12 px-4">
                  <Checkbox
                    checked={allSelected || (someSelected && "indeterminate")}
                    onCheckedChange={(checked) => toggleAll(!!checked)}
                    aria-label="Select all"
                  />
                </TableHead>
                {columns.map((column) => (
                  <TableHead
                    key={column}
                    className={`font-semibold px-4 ${column === "Actions" ? "text-right" : ""}`}
                  >
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="text-center py-4 text-sm text-gray-500"
                  >
                    No charges added yet
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, index) => {
                  const charges = row.charges;
                  const startDate = row.startDate;
                  const endDate = row.endDate;
                  const isSelected = selectedRows.has(index);

                  if (isVehicleChargeRow(row)) {
                    const isEditing = editingRow === index;
                    const editRow = isEditing ? (editedData as typeof row) : row;

                    return (
                      <TableRow key={row.id || index} className="hover:bg-transparent">
                        <TableCell className="w-12 px-4">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => toggleRow(index, !!checked)}
                            aria-label="Select row"
                            disabled={isEditing}
                          />
                        </TableCell>
                        <TableCell className="text-[12px] px-4">
                          {isEditing ? (
                            <div className="w-full min-w-[150px]">
                              <VehicleAndVehicleTypeSelectionField
                                type={MASTER_FORM_FIELD_TYPES.VEHICLE_TYPE}
                                selectedId={editRow.vehicleTypeId || editRow.vehicleType || ""}
                                onSelect={(val) => {
                                  handleFieldChange("vehicleTypeId", val);
                                  handleFieldChange("vehicleType", val);
                                }}
                                reset={resetCount}
                                label=""
                                searchKey="vehicleType"
                                id="vehicleType"
                              />
                            </div>
                          ) : (
                            row.vehicleType
                          )}
                        </TableCell>
                        <TableCell className="text-[12px] px-4">
                          {isEditing ? (
                            <Input
                              type="number"
                              step="0.01"
                              value={editRow.charges || ""}
                              onChange={(e) => handleFieldChange("charges", e.target.value)}
                              className="h-8 text-[12px]"
                            />
                          ) : (
                            charges
                          )}
                        </TableCell>
                        <TableCell className="text-[12px] px-4">
                          {isEditing ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "h-8 w-full justify-start text-left font-normal text-[12px]",
                                    !editRow.startDate && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {editRow.startDate ? (
                                    format(new Date(editRow.startDate), "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={editRow.startDate ? new Date(editRow.startDate) : undefined}
                                  onSelect={(date) => handleFieldChange("startDate", date || new Date())}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          ) : (
                            <ParseDateTime value={startDate} />
                          )}
                        </TableCell>
                        <TableCell className="text-[12px] px-4">
                          {isEditing ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "h-8 w-full justify-start text-left font-normal text-[12px]",
                                    !editRow.endDate && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {editRow.endDate ? (
                                    format(new Date(editRow.endDate), "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={editRow.endDate ? new Date(editRow.endDate) : undefined}
                                  onSelect={(date) => handleFieldChange("endDate", date || new Date())}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          ) : (
                            <ParseDateTime value={endDate} />
                          )}
                        </TableCell>
                        <TableCell className="text-right px-4">
                          <div className="flex items-center justify-end gap-1">
                            {isEditing ? (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleSaveEdit(index)}
                                  className="h-8 w-8 cursor-pointer"
                                >
                                  <Check className="w-4 h-4 text-green-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={handleCancelEdit}
                                  className="h-8 w-8 cursor-pointer"
                                >
                                  <X className="w-4 h-4 text-red-600" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleStartEdit(index, row)}
                                  className="h-8 w-8 cursor-pointer"
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openConfirm([index], "single")}
                                  className="h-8 w-8 cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  }

                  if (isRouteChargeRow(row)) {
                    const isEditing = editingRow === index;
                    const editRow = isEditing ? (editedData as typeof row) : row;

                    return (
                      <TableRow key={row.id || index} className="hover:bg-transparent">
                        <TableCell className="w-12 px-4">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => toggleRow(index, !!checked)}
                            aria-label="Select row"
                            disabled={isEditing}
                          />
                        </TableCell>
                        <TableCell className="text-[12px] px-4">
                          {isEditing ? (
                            <Input
                              type="text"
                              value={editRow.source || ""}
                              onChange={(e) => handleFieldChange("source", e.target.value)}
                              className="h-8 text-[12px]"
                            />
                          ) : (
                            row.source
                          )}
                        </TableCell>
                        <TableCell className="text-[12px] px-4">
                          {isEditing ? (
                            <Input
                              type="text"
                              value={editRow.destination || ""}
                              onChange={(e) => handleFieldChange("destination", e.target.value)}
                              className="h-8 text-[12px]"
                            />
                          ) : (
                            row.destination
                          )}
                        </TableCell>
                        <TableCell className="text-[12px] px-4">
                          {isEditing ? (
                            <Input
                              type="number"
                              step="0.01"
                              value={editRow.charges || ""}
                              onChange={(e) => handleFieldChange("charges", e.target.value)}
                              className="h-8 text-[12px]"
                            />
                          ) : (
                            charges
                          )}
                        </TableCell>
                        <TableCell className="text-[12px] px-4">
                          {isEditing ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "h-8 w-full justify-start text-left font-normal text-[12px]",
                                    !editRow.startDate && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {editRow.startDate ? (
                                    format(new Date(editRow.startDate), "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={editRow.startDate ? new Date(editRow.startDate) : undefined}
                                  onSelect={(date) => handleFieldChange("startDate", date || new Date())}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          ) : (
                            <ParseDateTime value={startDate} />
                          )}
                        </TableCell>
                        <TableCell className="text-[12px] px-4">
                          {isEditing ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "h-8 w-full justify-start text-left font-normal text-[12px]",
                                    !editRow.endDate && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {editRow.endDate ? (
                                    format(new Date(editRow.endDate), "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={editRow.endDate ? new Date(editRow.endDate) : undefined}
                                  onSelect={(date) => handleFieldChange("endDate", date || new Date())}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          ) : (
                            <ParseDateTime value={endDate} />
                          )}
                        </TableCell>
                        <TableCell className="text-right px-4">
                          <div className="flex items-center justify-end gap-1">
                            {isEditing ? (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleSaveEdit(index)}
                                  className="h-8 w-8 cursor-pointer"
                                >
                                  <Check className="w-4 h-4 text-green-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={handleCancelEdit}
                                  className="h-8 w-8 cursor-pointer"
                                >
                                  <X className="w-4 h-4 text-red-600" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleStartEdit(index, row)}
                                  className="h-8 w-8 cursor-pointer"
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openConfirm([index], "single")}
                                  className="h-8 w-8 cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  }

                  if (isDetentionChargeRow(row)) {
                    const detentionRow = row as DetentionChargeRow;
                    const isEditing = editingRow === index;
                    const editRow = isEditing ? (editedData as DetentionChargeRow) : detentionRow;

                    return (
                      <TableRow key={index} className="hover:bg-transparent">
                        <TableCell className="w-12 px-4">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => toggleRow(index, !!checked)}
                            aria-label="Select row"
                            disabled={isEditing}
                          />
                        </TableCell>
                        <TableCell className="text-[12px] px-4">
                          {isEditing ? (
                            <div className="w-full min-w-[150px]">
                              <VehicleAndVehicleTypeSelectionField
                                type={MASTER_FORM_FIELD_TYPES.VEHICLE_TYPE}
                                selectedId={editRow.vehicleTypeId || editRow.vehicleType || ""}
                                onSelect={(val) => {
                                  handleFieldChange("vehicleTypeId", val);
                                  handleFieldChange("vehicleType", val);
                                }}
                                reset={resetCount}
                                label=""
                                searchKey="vehicleType"
                                id="vehicleType"
                              />
                            </div>
                          ) : (
                            detentionRow.vehicleType
                          )}
                        </TableCell>
                        <TableCell className="text-[12px] px-4">
                          {isEditing ? (
                            <Input
                              type="text"
                              value={editRow.day || ""}
                              onChange={(e) => handleFieldChange("day", e.target.value)}
                              className="h-8 text-[12px]"
                            />
                          ) : (
                            detentionRow.day
                          )}
                        </TableCell>
                        <TableCell className="text-[12px] px-4">
                          {isEditing ? (
                            <Input
                              type="number"
                              step="0.01"
                              value={editRow.charges || ""}
                              onChange={(e) => handleFieldChange("charges", e.target.value)}
                              className="h-8 text-[12px]"
                            />
                          ) : (
                            charges
                          )}
                        </TableCell>
                        <TableCell className="text-[12px] px-4">
                          {isEditing ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "h-8 w-full justify-start text-left font-normal text-[12px]",
                                    !editRow.startDate && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {editRow.startDate ? (
                                    format(new Date(editRow.startDate), "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={editRow.startDate ? new Date(editRow.startDate) : undefined}
                                  onSelect={(date) => handleFieldChange("startDate", date || new Date())}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          ) : (
                            <ParseDateTime value={startDate} />
                          )}
                        </TableCell>
                        <TableCell className="text-[12px] px-4">
                          {isEditing ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "h-8 w-full justify-start text-left font-normal text-[12px]",
                                    !editRow.endDate && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {editRow.endDate ? (
                                    format(new Date(editRow.endDate), "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={editRow.endDate ? new Date(editRow.endDate) : undefined}
                                  onSelect={(date) => handleFieldChange("endDate", date || new Date())}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          ) : (
                            <ParseDateTime value={endDate} />
                          )}
                        </TableCell>
                        <TableCell className="text-[12px] px-4">
                          {isEditing ? (
                            <Input
                              type="text"
                              value={editRow.timePeriod || ""}
                              onChange={(e) => handleFieldChange("timePeriod", e.target.value)}
                              className="h-8 text-[12px]"
                            />
                          ) : (
                            detentionRow.timePeriod
                          )}
                        </TableCell>
                        <TableCell className="text-right px-4">
                          <div className="flex items-center justify-end gap-1">
                            {isEditing ? (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleSaveEdit(index)}
                                  className="h-8 w-8 cursor-pointer"
                                >
                                  <Check className="w-4 h-4 text-green-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={handleCancelEdit}
                                  className="h-8 w-8 cursor-pointer"
                                >
                                  <X className="w-4 h-4 text-red-600" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleStartEdit(index, row)}
                                  className="h-8 w-8 cursor-pointer"
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openConfirm([index], "single")}
                                  className="h-8 w-8 cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  }

                  return null;
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ConfirmDialogBox
        open={confirmOpen}
        setOpen={setConfirmOpen}
        title="Delete charges?"
        description="This action will permanently remove the selected charge(s)."
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

