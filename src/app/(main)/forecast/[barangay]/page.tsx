"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ForecastingPanel } from "../_components/forecasting-panel"
import { useBarangayStore } from "@/app/(main)/map/_stores/barangayStore"

export default function ForecastBarangayPage() {
  const params = useParams()
  const barangay = params.barangay as string
  const { setSelectedBarangay } = useBarangayStore()
  const [isReady, setIsReady] = useState(false)
  const [decodedBarangay, setDecodedBarangay] = useState<string | null>(null)

  useEffect(() => {
    // Set the selected barangay in the store when this page loads
    if (barangay) {
      const decoded = decodeURIComponent(barangay)
      setSelectedBarangay(decoded)
      setDecodedBarangay(decoded)
      setIsReady(true)
    }
  }, [barangay, setSelectedBarangay])

  if (!isReady || !decodedBarangay) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center text-muted-foreground">
        Loading forecast...
      </div>
    )
  }

  return <ForecastingPanel selectedBarangay={decodedBarangay} />
}
