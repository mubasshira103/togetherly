export type EventItem = {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  imageURL: string;
  location: string;
  eventDate: string;
  creatorEmail: string;
  createdAt?: string;
  updatedAt?: string;
};

export type JoinedEvent = {
  _id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventImage: string;
  location: string;
  userEmail: string;
  userName: string;
  joinedAt: string;
};
