import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return <div>Please log in to view your favorites.</div>;

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      listing: {
        include: {
          agent: true,
          owner: true,
        },
      },
    },
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">My Favorite Properties</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {favorites.map((fav) => (
          <Card key={fav.id}>
            <CardHeader>
              <CardTitle>{fav.listing.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{fav.listing.description}</p>
              <Link href={`/properties/${fav.listing.id}`}>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">View Details</button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}