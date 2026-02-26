export interface Painting {
  id: string;
  title: string;
  artist: string;
  year?: string;
  imageUrl: string;
  description?: string;
  notes?: string;
  collectionId?: string;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}
