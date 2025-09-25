import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const releases = [
  {
    title: "CRUSH EP [FANG]",
    artist: "Crush",
    date: "08-28",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
  },
  {
    title: "HWASA SINGLE [NA]",
    artist: "HWASA",
    date: "07-15",
    cover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=400&fit=crop"
  },
  {
    title: "TNX ALBUM [WAY UP]",
    artist: "TNX",
    date: "06-20",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
  },
  {
    title: "HEIZE EP [FALLIN']",
    artist: "HEIZE",
    date: "05-10",
    cover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=400&fit=crop"
  }
];

export default function ReleasesSection() {
  return (
    <section id="releases" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">RELEASES</h2>
          <div className="w-24 h-1 bg-red-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {releases.map((release, index) => (
            <Card 
              key={index}
              className="bg-black/50 border-gray-700 hover:border-red-500 transition-all duration-300 group cursor-pointer"
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img 
                    src={release.cover} 
                    alt={release.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                    {release.date}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <h3 className="text-white font-bold text-sm mb-1">{release.title}</h3>
                    <p className="text-gray-300 text-xs">{release.artist}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            variant="outline" 
            size="lg"
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
          >
            VIEW ALL
          </Button>
        </div>
      </div>
    </section>
  );
}