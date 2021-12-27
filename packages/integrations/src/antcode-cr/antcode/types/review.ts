import { User } from './user';
import { Note } from './note';

export interface Review {
  id: number;
  author: User;
  pending: boolean;
  pullRequestId: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  reviewNotes: Note[];
}
