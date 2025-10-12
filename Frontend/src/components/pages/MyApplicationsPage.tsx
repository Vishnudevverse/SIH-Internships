import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface Application {
  title: string;
  company: string;
  application_date: string;
  status: string;
}

export function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:3001/api/user/applications', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      setApplications(data);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="container mx-auto">
          <div className="text-center">Loading your applications...</div>
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
      <div className="container mx-auto max-w-4xl">
        <h1 className="mb-6">My Applications</h1>

        {applications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              You haven't applied to any internships yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-blue-600">{app.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{app.company}</p>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <div>
                    <p className="text-sm">Applied on: {new Date(app.application_date).toLocaleDateString()}</p>
                  </div>
                  <Badge>{app.status}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
