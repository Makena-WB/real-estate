"use client"
import { useEffect } from "react"

export default function PropertyViewTracker({ propertyId }: { propertyId: string }) {
  useEffect(() => {
    fetch(`/api/properties/${propertyId}`, {
      method: "GET"
    })
  }, [propertyId])
  return null
}
