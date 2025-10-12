import { useState, useEffect } from 'react';
import { InternshipCard } from '../InternshipCard';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-bec93c94/api/recommendations`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

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
                title={internship.title}
                company={internship.company}
                location={internship.location}
                domain={internship.domain}
                description={internship.description}
                requiredSkills={internship.requiredSkills}
                matchScore={internship.matchScore}
                matchingSkills={internship.matchingSkills}
                showRecommendation={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
