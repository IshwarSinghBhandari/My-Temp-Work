"use client"

import { useRouter } from "next/navigation"
import type React from "react"
import type { ColumnDef, Row } from "@tanstack/react-table"
import { Checkbox } from "@/app/components/ui/checkbox"
import { ChevronsUpDown } from "lucide-react"
import { TableDataToolTip } from "../../common/table/dataToolTip"
// import { ParseDateTime } from "@/utils/common/parseDateTime"
import { Route } from "@/utils/routes"
import { useDispatch } from "react-redux"
import { IndentCol } from "@/types/indent-type"
import ActionSection from "../../trips/ActionSection"
import OrderCountDropdown from "./OrderCount"
import FreightTypeBadge from "./FreightTypeBadge"
// import { setIndentId } from "@/store/slices/indentSlice" 
// import ActionSection from "../ActionSection"
// import type { IndentCol } from "@/types/indent-type" 

// Reuse clickable cell
function ClickableCell({
  content,
  indentId,
  refId,
}: {
  content: React.ReactNode
  indentId: string
  refId: string | number
}) {
  const router = useRouter()
  const dispatch = useDispatch()

  const handleClick = () => {
    // dispatch(setIndentId(indentId))
    router.push(`${Route.indent}/${refId}`) // navigate to indent details
  }

  return (
    <span
      onClick={handleClick}
      className="cursor-pointer hover:border-b-2 border-gray-700 leading-none"
    >
      {content}
    </span>
  )
}

export const INDENT_TABLE_CONFIG = [
  { key: "indent", label: "Indent ID", clickable: true },
  { key: "orderCount", label: "Order Count", isCustom: "orderCount" },
  { key: "sourceLocation", label: "Source Location" },
  { key: "destinationLocation", label: "Destination Location" },
  { key: "freightType", label: "Freight Type", isCustom: "freightType" },
  { key: "totalWeight", label: "Total Weight (Kg)" },
  { key: "status", label: "Status", isCustom: "status" },
  { key: "action", label: "Action", isCustom: "action" },
]

export const indentColumns: ColumnDef<IndentCol>[] = [
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
  ...INDENT_TABLE_CONFIG.map(({ key, label, isCustom, clickable }) => {
    return {
      accessorKey: key,
      header: () => (
        <div className="flex items-center text-[#64748B] text-[12px] font-[400]">
          {label}
          <ChevronsUpDown className="ml-auto size-4" />
        </div>
      ),
      cell: ({ row }: { row: Row<IndentCol> }) => {
        const value = row.getValue(key)
        const indentId = row.original.indentId
        const refId = row.original.indent // reference ID

        let content: React.ReactNode

        if (isCustom === "orderCount") {
          content = <OrderCountDropdown count={Number(value)} />
        } else if (isCustom === "freightType") {
          content = <FreightTypeBadge type={String(value)} />
        } else if (isCustom === "status") {

          content = <span className="capitalize">{value as string}</span>
        } else if (isCustom === "action") {
          content = <ActionSection row={row} />
        } else {
          content = <span>{value as string}</span>
        }

        if (clickable) {
          return <ClickableCell content={content} refId={refId} indentId={indentId} />
        }

        return content
      },
    }
  }),
]
