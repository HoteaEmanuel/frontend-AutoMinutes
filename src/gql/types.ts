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

export type AiResults = {
  __typename?: 'AIResults';
  actionItems: Array<ActionItem>;
  attendees: Array<Attendee>;
  decisions?: Maybe<Array<Scalars['String']['output']>>;
  detailedNotes?: Maybe<Scalars['String']['output']>;
  followUpNotes?: Maybe<Scalars['String']['output']>;
  meetingId: Scalars['ID']['output'];
  summary: Scalars['String']['output'];
};

export type ActionItem = {
  __typename?: 'ActionItem';
  aiGenerated: Scalars['Boolean']['output'];
  assignee?: Maybe<Attendee>;
  deadline?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  meetingId: Scalars['ID']['output'];
  status: ActionItemStatus;
  title: Scalars['String']['output'];
};

export type ActionItemStatus =
  | 'DONE'
  | 'IN_PROGRESS'
  | 'OPEN'
  | 'UNKNOWN';

export type Attendee = {
  __typename?: 'Attendee';
  aiGenerated: Scalars['Boolean']['output'];
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  meetingId: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  role: AttendeeRole;
  userId?: Maybe<Scalars['ID']['output']>;
};

export type AttendeeRole =
  | 'ORGANIZER'
  | 'PARTICIPANT'
  | 'UNKNOWN';

export type CreateActionItemDto = {
  aiGenerated: Scalars['Boolean']['input'];
  assigneeId?: InputMaybe<Scalars['String']['input']>;
  deadline?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  meetingId: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreateMeetingDto = {
  description?: InputMaybe<Scalars['String']['input']>;
  scheduledAt: Scalars['DateTime']['input'];
  title: Scalars['String']['input'];
  transcript?: InputMaybe<Scalars['String']['input']>;
};

export type DeleteActionItemDto = {
  actionItemId: Scalars['String']['input'];
  meetingId: Scalars['String']['input'];
};

export type Meeting = {
  __typename?: 'Meeting';
  actionItems: Array<ActionItem>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  findMeetingTranscript?: Maybe<Transcript>;
  id: Scalars['ID']['output'];
  scheduledAt: Scalars['DateTime']['output'];
  status: MeetingStatus;
  title: Scalars['String']['output'];
  transcript?: Maybe<Transcript>;
  updatedAt: Scalars['DateTime']['output'];
};


export type MeetingFindMeetingTranscriptArgs = {
  meetingId: Scalars['String']['input'];
};

export type MeetingStatus =
  | 'COMPLETED'
  | 'FAILED'
  | 'PENDING'
  | 'PROCESSING';

export type Mutation = {
  __typename?: 'Mutation';
  addAttendee: Attendee;
  createMeeting: Meeting;
  createNewActionItem: ActionItem;
  deleteActionItem: ActionItem;
  deleteAttendee: Attendee;
  deleteMeeting: Meeting;
  generateAIResults: AiResults;
  updateActionItem: ActionItem;
};


export type MutationAddAttendeeArgs = {
  addAttendeeDto: AddAttendeeDto;
};


export type MutationCreateMeetingArgs = {
  createMeetingInput: CreateMeetingDto;
};


export type MutationCreateNewActionItemArgs = {
  createActionItem: CreateActionItemDto;
};


export type MutationDeleteActionItemArgs = {
  deleteActionItemDto: DeleteActionItemDto;
};


export type MutationDeleteAttendeeArgs = {
  deleteAttendeeDto: DeleteAttendeeDto;
};


export type MutationDeleteMeetingArgs = {
  id: Scalars['String']['input'];
};


export type MutationGenerateAiResultsArgs = {
  aiInput: AiResultsDto;
};


export type MutationUpdateActionItemArgs = {
  updateActionItemDto: UpdateActionItemDto;
};

export type PaginatedMeetings = {
  __typename?: 'PaginatedMeetings';
  meetings: Array<Meeting>;
  pageNo: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
};

export type PaginatedMeetingsDto = {
  pageNo: Scalars['Float']['input'];
  pageSize: Scalars['Float']['input'];
  scheduledFrom?: InputMaybe<Scalars['DateTime']['input']>;
  scheduledTo?: InputMaybe<Scalars['DateTime']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sortDateOrder?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<MeetingStatus>;
};

export type Query = {
  __typename?: 'Query';
  findAll: Array<Meeting>;
  findMeeting: Meeting;
  findUserMeetings: PaginatedMeetings;
  getAIResults: AiResults;
  getActionItems: Array<ActionItem>;
  getAttendees: Array<Attendee>;
  getTranscript?: Maybe<Transcript>;
};


export type QueryFindMeetingArgs = {
  id: Scalars['String']['input'];
};


export type QueryFindUserMeetingsArgs = {
  input: PaginatedMeetingsDto;
};


export type QueryGetAiResultsArgs = {
  meetingId: Scalars['String']['input'];
};


export type QueryGetActionItemsArgs = {
  meetingId: Scalars['String']['input'];
};


export type QueryGetAttendeesArgs = {
  meetingId: Scalars['String']['input'];
};


export type QueryGetTranscriptArgs = {
  meetingId: Scalars['String']['input'];
};

export type Transcript = {
  __typename?: 'Transcript';
  content: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  meetingId: Scalars['ID']['output'];
};

export type UpdateActionItemDto = {
  actionItemId: Scalars['String']['input'];
  assigneeId?: InputMaybe<Scalars['String']['input']>;
  deadline?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  meetingId: Scalars['String']['input'];
  status?: InputMaybe<ActionItemStatus>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type AddAttendeeDto = {
  aiGenerated?: InputMaybe<Scalars['Boolean']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  meetingId: Scalars['String']['input'];
  name: Scalars['String']['input'];
  role?: InputMaybe<AttendeeRole>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type AiResultsDto = {
  meetingId: Scalars['String']['input'];
  transcript: Scalars['String']['input'];
};

export type DeleteAttendeeDto = {
  attendeeId: Scalars['String']['input'];
};
