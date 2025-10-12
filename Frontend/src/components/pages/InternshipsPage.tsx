import { useState, useEffect } from 'react';
import { InternshipCard } from '../InternshipCard';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search } from 'lucide-react';
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

export function InternshipsPage() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInternships();
    fetchWishlist();
  }, []);

  useEffect(() => {
    filterInternships();
  }, [searchQuery, locationFilter, domainFilter, internships]);

  const fetchInternships = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/internships');

      if (!response.ok) {
        throw new Error('Failed to fetch internships');
      }

      const data = await response.json();
      setInternships(data);
      setFilteredInternships(data);
    } catch (err) {
      console.error('Error fetching internships:', err);
      setError('Failed to load internships');
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    const accessToken = localStorage.getItem('accessToken');
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
    const accessToken = localStorage.getItem('accessToken');
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

  const filterInternships = () => {
    let filtered = [...internships];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (internship) =>
          internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          internship.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Location filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter((internship) => internship.location === locationFilter);
    }

    // Domain filter
    if (domainFilter !== 'all') {
      filtered = filtered.filter((internship) => internship.domain === domainFilter);
    }

    setFilteredInternships(filtered);
  };

  // Extract unique locations and domains for filters
  const locations = ['all', ...Array.from(new Set(internships.map((i) => i.location)))];
  const domains = ['all', ...Array.from(new Set(internships.map((i) => i.domain)))];

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="container mx-auto">
          <div className="text-center">Loading internships...</div>
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
          <h1 className="mb-6">Explore All Internships</h1>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by title or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Location filter */}
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location === 'all' ? 'All Locations' : location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Domain filter */}
            <Select value={domainFilter} onValueChange={setDomainFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by domain" />
              </SelectTrigger>
              <SelectContent>
                {domains.map((domain) => (
                  <SelectItem key={domain} value={domain}>
                    {domain === 'all' ? 'All Domains' : domain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredInternships.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No internships found matching your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInternships.map((internship) => (
              <InternshipCard
                key={internship.id}
                id={internship.id}
                title={internship.title}
                company={internship.company}
                location={internship.location}
                domain={internship.domain}
                description={internship.description}
                requiredSkills={internship.requiredSkills}
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
