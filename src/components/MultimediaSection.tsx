import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const videos = [
  {
    title: "Crush (크러쉬) - 'UP ALL NITE (Feat. SUMIN)' MV",
    artist: "Crush",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop"
  },
  {
    title: "Baby DONT Cry - 'F Girl' MV",
    artist: "Baby DONT Cry",
    thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop"
  },
  {
    title: "TNX - '아 진짜 (For Real?)' MV",
    artist: "TNX",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop"
  },
  {
    title: "HEIZE - 'FALLIN'' MV",
    artist: "HEIZE",
    thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop"
  },
  {
    title: "HWASA - 'NA' MV",
    artist: "HWASA",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop"
  },
  {
    title: "An Shinae - 'Hold Me Now' MV",
    artist: "An Shinae",
    thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop"
  }
];

export default function MultimediaSection() {
  return (
    <section id="multimedia" className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">MULTIMEDIA</h2>
          <div className="w-24 h-1 bg-red-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {videos.map((video, index) => (
            <Card 
              key={index}
              className="bg-gray-900 border-gray-700 hover:border-red-500 transition-all duration-300 group cursor-pointer"
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">{video.title}</h3>
                  <p className="text-gray-400 text-sm">{video.artist}</p>
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