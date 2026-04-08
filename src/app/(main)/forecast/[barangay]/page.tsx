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

  useEffect(() => {
    // Set the selected barangay in the store when this page loads
    if (barangay) {
      setSelectedBarangay(decodeURIComponent(barangay))
      setIsReady(true)
    }
  }, [barangay, setSelectedBarangay])

  if (!isReady) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center text-muted-foreground">
        Loading forecast...
      </div>
    )
  }

  return <ForecastingPanel />
}
