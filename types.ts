
export enum ConferenceTier {
  A = 'A',
  B = 'B',
  C = 'C',
  OTHER = 'Other'
}

export enum PaperStatus {
  ACCEPTED = 'Accepted',
  SUBMITTED = 'Submitted',
  WRITING = 'Writing',
  TARGET = 'Target',
  REJECTED = 'Rejected'
}

export enum PaperResult {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
  REVISION = 'Revision'
}

export interface PaperRecord {
  id: string;
  title: string;
  conference: string;
  tier: ConferenceTier;
  status: PaperStatus;
  submissionDate: string;
  scoreReleaseDate: string;
  scores: string;
  rebuttalDate: string;
  finalScores: string;
  result: PaperResult;
  content: string;
  createdAt: number;
}
