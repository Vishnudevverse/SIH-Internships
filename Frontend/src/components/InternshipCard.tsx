import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, Briefcase } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface InternshipCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  domain: string;
  description: string;
  requiredSkills: string[];
  matchScore?: number;
  matchingSkills?: string[];
  showRecommendation?: boolean;
}

export function InternshipCard({
  id,
  title,
  company,
  location,
  domain,
  description,
  requiredSkills,
  matchScore,
  matchingSkills,
  showRecommendation = false
}: InternshipCardProps) {
  // Determine badge color based on match score
  const getMatchScoreBadgeClass = (score: number) => {
    if (score >= 3) return 'bg-green-500 hover:bg-green-600 text-white';
    if (score >= 2) return 'bg-yellow-500 hover:bg-yellow-600 text-white';
    return 'bg-gray-400 hover:bg-gray-500 text-white';
  };

  const handleApply = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`http://localhost:3001/api/internships/${id}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to apply');
      }

      toast('Application successful!');
    } catch (error) {
      console.error('Error applying:', error);
      toast('Application failed');
    }
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-blue-600">{title}</CardTitle>
        <CardDescription>{company}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-4">
        {/* Location and Domain */}
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {location}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            {domain}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground">{description}</p>

        {/* Required Skills */}
        <div>
          <p className="text-sm mb-2">Required Skills:</p>
          <div className="flex flex-wrap gap-2">
            {requiredSkills.map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex-col items-start gap-3 border-t pt-4 bg-muted/30">
        {showRecommendation && matchScore !== undefined && (
          <div className="flex flex-col items-start gap-3 w-full">
            <div className="flex items-center gap-2">
              <span className="text-sm">Match Score:</span>
              <Badge className={getMatchScoreBadgeClass(matchScore)}>
                {matchScore}
              </Badge>
            </div>
            
            {matchingSkills && matchingSkills.length > 0 && (
              <div className="w-full">
                <p className="text-sm mb-2">Matching Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {matchingSkills.map((skill, index) => (
                    <Badge key={index} variant="default" className="bg-blue-500 hover:bg-blue-600">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <Button onClick={handleApply} className="w-full bg-blue-600 hover:bg-blue-700">Apply Now</Button>
      </CardFooter>
    </Card>
  );
}