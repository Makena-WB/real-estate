"use client"
import PropertyViewTracker from "@/components/PropertyViewTracker"
import PropertyDetailPage from "./page"

export default function PropertyDetailPageWrapper(props: { params: { id: string } }) {
	return (
		<>
			<PropertyViewTracker propertyId={props.params.id} />
			<PropertyDetailPage params={props.params} />
		</>
	)
}
