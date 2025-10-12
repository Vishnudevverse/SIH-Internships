import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { TagInput } from '../TagInput';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, skills }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      // Redirect to login after successful registration
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 pt-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>Sign up to discover personalized internship opportunities</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <TagInput
                tags={skills}
                onTagsChange={setSkills}
                placeholder="Type a skill and press Enter"
              />
              <p className="text-xs text-muted-foreground">
                Add your skills to get personalized recommendations
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? 'Creating account...' : 'Register'}
            </Button>
            
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login here
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}