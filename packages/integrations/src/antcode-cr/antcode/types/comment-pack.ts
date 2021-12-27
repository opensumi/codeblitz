import { Note } from './note';
import { Review } from './review';

export interface CommentPack {
  notes: Note[];
  committedReviews: Review[];
  pendingReview?: Review;
  currentFetchedAt: number;
}
