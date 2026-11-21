export type EventItem = {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  imageURL: string;
  location: string;
  eventDate: string;
  creatorId?: string;
  creatorEmail: string;
  creatorName?: string;
  createdAt?: string;
  updatedAt?: string;
};
