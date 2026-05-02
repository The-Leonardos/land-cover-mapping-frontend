"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ForecastingPanel } from "../_components/forecasting-panel"
import { useBarangayStore } from "@/app/(main)/map/_stores/barangayStore"
import { ForecastSkeleton } from "../_skeletons/forecast-skeleton"

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
    return <ForecastSkeleton />
  }

  return <ForecastingPanel selectedBarangay={decodedBarangay} />
}
