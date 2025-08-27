import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Star, MapPin, DollarSign, User, Home } from "lucide-react";

export default async function PropertyDetailPage(context: { params: { id: string } }) {
  const { params } = await context;
  type PropertyType = {
    id: string;
    title: string;
    description: string;
    location: string;
    price: number;
    images: string | string[]; // <-- Add this line
    agent?: { name?: string | null; email?: string | null } | null;
    owner?: { name?: string | null; email?: string | null } | null;
    reviews: Array<{
      id: string;
      rating: number;
      comment: string;
      renter?: { name?: string | null; email?: string | null } | null;
    }>;
  };

  const property = await prisma.listing.findUnique({
    where: { id: params.id },
    include: {
      agent: { select: { name: true, email: true } },
      owner: { select: { name: true, email: true } },
      reviews: {
        include: {
          renter: { select: { name: true, email: true } }
        }
      },
    },
  }) as PropertyType | null;

  if (!property) return notFound();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
  <h1 className="text-3xl font-bold mb-4 text-slate-900">{property.title}</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Images */}
        <div className="flex-1">
          {property.images && property.images.length > 0 ? (
            <img
              src={Array.isArray(property.images) ? property.images[0] : property.images.split(",")[0]}
              alt={property.title}
              className="w-full h-80 object-cover rounded-xl mb-4"
            />
          ) : (
            <div className="w-full h-80 bg-blue-100 flex items-center justify-center rounded-xl">
              <Home className="w-16 h-16 text-blue-400" />
            </div>
          )}
          {/* Show all images as thumbnails */}
          <div className="flex gap-2">
            {(Array.isArray(property.images) ? property.images : property.images.split(",")).map((url: string, idx: number) => (
              <img key={idx} src={url} alt={`Property image ${idx + 1}`} className="w-16 h-16 object-cover rounded-lg border" />
            ))}
          </div>
        </div>
        {/* Details */}
        <div className="flex-1 space-y-4">
      <div className="flex items-center gap-2 text-slate-800">
            <MapPin className="w-5 h-5" />
            <span>{property.location}</span>
          </div>
      <div className="flex items-center gap-2 text-slate-800">
            <DollarSign className="w-5 h-5" />
            <span className="font-bold text-lg">KES {property.price}</span>
          </div>
          <div>
            <div className="font-semibold text-slate-900 mb-1">Description</div>
            <p className="text-slate-800">{property.description}</p>
          </div>
          <div>
            <div className="font-semibold text-slate-900 mb-1">Agent</div>
            <div className="flex items-center gap-2 text-slate-800">
              <User className="w-4 h-4" />
              <span>{property.agent?.name || property.agent?.email || "N/A"}</span>
            </div>
          </div>
          <div>
            <div className="font-semibold text-slate-900 mb-1">Landlord</div>
            <div className="flex items-center gap-2 text-slate-800">
              <Home className="w-4 h-4" />
              <span>{property.owner?.name || property.owner?.email || "N/A"}</span>
            </div>
          </div>
          {/* Amenities placeholder */}
          <div>
            <div className="font-semibold text-slate-900 mb-1">Amenities</div>
            <ul className="list-disc list-inside text-slate-800">
              <li>24/7 Security</li>
              <li>Parking</li>
              <li>Wi-Fi</li>
              <li>Swimming Pool</li>
              {/* Add more amenities as needed */}
            </ul>
          </div>
        </div>
      </div>
      {/* Reviews */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-500" />
          Reviews ({property.reviews.length})
        </h2>
        {property.reviews.length === 0 ? (
          <p className="text-slate-700">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {property.reviews.map((review: any) => (
              <div key={review.id} className="bg-slate-50 p-4 rounded-xl shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-slate-700" />
                  <span className="font-semibold text-slate-800">{review.renter?.name || review.renter?.email || "Anonymous"}</span>
                  <span className="ml-2 text-yellow-600 font-bold">Rating: {review.rating}/5</span>
                </div>
                <div className="text-slate-700">{review.comment}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Dynamic amenities