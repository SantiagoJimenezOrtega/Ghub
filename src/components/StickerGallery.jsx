// StickerGallery.jsx
import React from 'react';

const PREMIUM_STICKERS = [
  { id: 1, url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJwamZoaDZreXp3eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1z/3o7TKMGpx4WFjg8A00/giphy.gif', name: 'Party' },
  { id: 2, url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJwamZoaDZreXp3eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1z/l41lTfuxx4g5cZZ9C/giphy.gif', name: 'Cool' },
  { id: 3, url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJwamZoaDZreXp3eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1z/3o7TKVUn7iM8FMEU24/giphy.gif', name: 'Love' },
  { id: 4, url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJwamZoaDZreXp3eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1z/3o7TKDkDbIDJieKbVm/giphy.gif', name: 'Congrats' },
  { id: 5, url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJwamZoaDZreXp3eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1z/l0HlIDW6p2Eksm3JK/giphy.gif', name: 'Rocket' },
  { id: 6, url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJwamZoaDZreXp3eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1z/3o7TKDkDbIDJieKbVm/giphy.gif', name: 'Fire' }
];

function StickerGallery() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium text-white">Galería de Stickers Animados</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {PREMIUM_STICKERS.map(sticker => (
          <div key={sticker.id} className="glass-card p-4 group cursor-pointer overflow-hidden">
            <img
              src={sticker.url}
              alt={sticker.name}
              className="w-full h-32 object-contain transform group-hover:scale-110 transition duration-300"
            />
            <div className="mt-4 text-center">
              <span className="text-xs font-semibold text-slate-400 group-hover:text-violet-400 transition">
                USAR STICKER
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StickerGallery;