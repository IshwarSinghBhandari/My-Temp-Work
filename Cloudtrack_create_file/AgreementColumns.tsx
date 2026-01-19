"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { Checkbox } from "@/app/components/ui/checkbox";
import { ChevronsUpDown } from "lucide-react";
import { AgreementCol } from "@/types/agreement";
import { AGREEMENT_TABLE_CONFIG } from "@/utils/constants";
import { ParseDateTime } from "@/utils/common/parseDateTime";
import { Button } from "@/app/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { downloadAgreementPDF, deleteAgreement } from "@/utils/services/agreementAPI";
import { TableDataToolTip } from "@/app/components/common/table/dataToolTip";
import { ConfirmDialogBox } from "@/app/components/common/ConfirmDialogBox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { Route } from "@/utils/routes";

// Create a separate component for clickable cells
function ClickableCell({
  content,
  agreementId,
}: {
  content: React.ReactNode;
  agreementId: string;
}) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`${Route.agreements}/${agreementId}`);
  };

  return (
    <span
      onClick={handleClick}
      className="cursor-pointer hover:border-b-2 border-gray-700 leading-none"
    >
      {content}
    </span>
  );
}

function DownloadPDFButton({ id }: { id: string }) {
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleDownload = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      await downloadAgreementPDF(id);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            onClick={handleDownload}
            disabled={isDownloading}
            variant="ghost"
            className="h-8 w-8"
          >
            <Download className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Download attachment</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function DeleteAgreementButton({ id, onDeleteSuccess }: { id: string; onDeleteSuccess?: () => void }) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      const success = await deleteAgreement(id);
      if (success && onDeleteSuccess) {
        onDeleteSuccess();
      }
    } finally {
      setIsDeleting(false);
      setOpenDialog(false);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setOpenDialog(true);
              }}
              disabled={isDeleting}
              variant="ghost"
              className="h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete agreement</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <ConfirmDialogBox
        open={openDialog}
        setOpen={setOpenDialog}
        description="Are you sure you want to delete this agreement? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </>
  );
}

export function buildAgreementColumns(): ColumnDef<AgreementCol>[] {
  const columns: ColumnDef<AgreementCol>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];

  AGREEMENT_TABLE_CONFIG.forEach(({ key, label, isDate, isCustom, tooltip }) => {
    columns.push({
      accessorKey: key,
      header: () => (
        <div className="flex items-center text-[#64748B] text-[12px] font-normal">
          {label}
          <ChevronsUpDown className="ml-auto size-4" />
        </div>
      ),
      cell: ({ row }: { row: Row<AgreementCol> }) => {
        const value = row.getValue(key);
        const id = row.original.id;
        const agreementId = row.original.agreementId;

        let content: React.ReactNode;

        if (isCustom === "action") {
          content = (
            <div className="flex items-center gap-2">
              <DownloadPDFButton id={id} />
              <DeleteAgreementButton id={id} />
            </div>
          );
        } else if (isDate) {
          content = <ParseDateTime value={value as string | number | Date} />;
        } else if (key === "agreementId") {
          content = <ClickableCell content={value as React.ReactNode} agreementId={agreementId} />;
        } else if (tooltip) {
          const displayValue = typeof value === "string" || typeof value === "number" ? String(value) : "";
          content = <TableDataToolTip value={displayValue} />;
        } else {
          content = <span>{value as string}</span>;
        }
        return <div className="flex items-center h-8">{content}</div>;
      },
    });
  });

  return columns;
}
