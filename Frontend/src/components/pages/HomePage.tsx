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
  matchScore: number;
  matchingSkills: string[];
}

interface HomePageProps {
  accessToken: string;
}

export function HomePage({ accessToken }: HomePageProps) {
  const [recommendations, setRecommendations] = useState<Internship[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecommendations();
    fetchWishlist();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/recommendations', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      setRecommendations(data);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/wishlist/ids', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setWishlist(data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const handleWishlistToggle = async (internshipId: string, isWishlisted: boolean) => {
    const method = isWishlisted ? 'DELETE' : 'POST';
    const url = isWishlisted ? `http://localhost:3001/api/wishlist/${internshipId}` : 'http://localhost:3001/api/wishlist';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: isWishlisted ? null : JSON.stringify({ internship_id: internshipId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update wishlist');
      }

      if (isWishlisted) {
        setWishlist(wishlist.filter(id => id !== internshipId));
        toast('Removed from wishlist');
      } else {
        setWishlist([...wishlist, internshipId]);
        toast('Added to wishlist');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast('Failed to update wishlist');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="container mx-auto">
          <div className="text-center">Loading your personalized recommendations...</div>
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
        <div className="mb-8">
          <h1 className="mb-2">Your Personalized Recommendations</h1>
          <p className="text-muted-foreground">
            Based on your skills, here are the best matches for you.
          </p>
        </div>

        {recommendations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No recommendations yet. Add skills to your profile to get personalized matches!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((internship) => (
              <InternshipCard
                key={internship.id}
                id={internship.id}
                title={internship.title}
                company={internship.company}
                location={internship.location}
                domain={internship.domain}
                description={internship.description}
                requiredSkills={internship.requiredSkills}
                matchScore={internship.matchScore}
                matchingSkills={internship.matchingSkills}
                showRecommendation={true}
                isWishlisted={wishlist.includes(internship.id)}
                onWishlistToggle={handleWishlistToggle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
