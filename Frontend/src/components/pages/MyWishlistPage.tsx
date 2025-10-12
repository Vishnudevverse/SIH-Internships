import { useState, useEffect } from 'react';
import { InternshipCard } from '../InternshipCard';
import { toast } from 'sonner@2.0.3';

interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  domain: string;
  description: string;
  requiredSkills: string[];
}

export function MyWishlistPage() {
  const [wishlist, setWishlist] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:3001/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }

      const data = await response.json();
      setWishlist(data);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistToggle = async (internshipId: string, isWishlisted: boolean) => {
    if (!isWishlisted) return; // Should not happen on this page

    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`http://localhost:3001/api/wishlist/${internshipId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove from wishlist');
      }

      setWishlist(currentWishlist => currentWishlist.filter(item => item.id !== internshipId));
      toast('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast('Failed to remove from wishlist');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="container mx-auto">
          <div className="text-center">Loading your wishlist...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="container mx-auto">
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 bg-gray-50">
      <div className="container mx-auto">
        <h1 className="mb-6">My Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Your wishlist is empty.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((internship) => (
              <InternshipCard
                key={internship.id}
                id={internship.id}
                title={internship.title}
                company={internship.company}
                location={internship.location}
                domain={internship.domain}
                description={internship.description}
                requiredSkills={internship.requiredSkills}
                isWishlisted={true}
                onWishlistToggle={handleWishlistToggle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
