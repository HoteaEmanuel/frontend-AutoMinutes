export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: string; output: string; }
};

export type CreateMeetingDto = {
  description?: InputMaybe<Scalars['String']['input']>;
  scheduledAt: Scalars['DateTime']['input'];
  title: Scalars['String']['input'];
  transcript?: InputMaybe<Scalars['String']['input']>;
};

export type Meeting = {
  __typename?: 'Meeting';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  scheduledAt: Scalars['DateTime']['output'];
  status: MeetingStatus;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type MeetingStatus =
  | 'COMPLETED'
  | 'FAILED'
  | 'PENDING'
  | 'PROCESSING';

export type Mutation = {
  __typename?: 'Mutation';
  createMeeting: Meeting;
  deleteMeeting: Meeting;
};


export type MutationCreateMeetingArgs = {
  createMeetingInput: CreateMeetingDto;
};


export type MutationDeleteMeetingArgs = {
  id: Scalars['String']['input'];
};

export type PaginatedMeetings = {
  __typename?: 'PaginatedMeetings';
  meetings: Array<Meeting>;
  pageNo: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
};

export type PaginatedMeetingsDto = {
  contentLike?: InputMaybe<Scalars['String']['input']>;
  pageNo: Scalars['Float']['input'];
  pageSize: Scalars['Float']['input'];
  scheduledFrom?: InputMaybe<Scalars['DateTime']['input']>;
  scheduledTo?: InputMaybe<Scalars['DateTime']['input']>;
  sortDateOrder?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<MeetingStatus>;
};

export type Query = {
  __typename?: 'Query';
  findAll: Array<Meeting>;
  findMeeting: Meeting;
  findUserMeetings: PaginatedMeetings;
};


export type QueryFindMeetingArgs = {
  id: Scalars['String']['input'];
};


export type QueryFindUserMeetingsArgs = {
  input: PaginatedMeetingsDto;
};
