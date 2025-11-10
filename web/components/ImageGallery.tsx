'use client';

import { useState } from 'react';
import { getExecutionImageUrl } from '@/lib/aws';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  executionId: string;
}

export function ImageGallery({ images, executionId }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!images || images.length === 0) {
    return <div className="text-center text-gray-500 py-8">No images available</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => {
          const imageName = image.split('/').pop() || `image-${index}.jpg`;
          const imageUrl = getExecutionImageUrl(executionId, imageName);
          
          return (
            <button
              key={index}
              onClick={() => setSelectedImage(imageUrl)}
              className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 transition-transform hover:scale-105 dark:border-gray-800"
            >
              <Image
                src={imageUrl}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
                onError={(e) => {
                  // Fallback to original URL if S3 URL fails
                  const target = e.target as HTMLImageElement;
                  target.src = image;
                }}
              />
            </button>
          );
        })}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-full max-w-full">
            <Image
              src={selectedImage}
              alt="Selected image"
              width={1200}
              height={800}
              className="max-h-[90vh] max-w-full object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 rounded-full bg-white p-2 text-gray-900 shadow-lg hover:bg-gray-100"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


