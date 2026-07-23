import { gqlRequest } from '@/lib/graphql';
import { CreateMeetingDto, Mutation, PaginatedMeetingsDto, Query } from '@/gql/types';

const FIND_USER_MEETINGS = `
  query FindUserMeetings($input: PaginatedMeetingsDto!) {
    findUserMeetings(input: $input) {
    totalCount,
    meetings {
      id
      title
      description
      status
      scheduledAt
      createdAt
      updatedAt
}
    }
  }
`;

export const fetchUserMeetings = async (input: PaginatedMeetingsDto) => {
  const data = await gqlRequest<Pick<Query, 'findUserMeetings'>>(FIND_USER_MEETINGS, {
    input: input,
  });
  return data.findUserMeetings;
};

const FIND_MEETING_BY_ID = `
  query FindMeetingById($findMeetingId: String!){
  findMeeting(id: $findMeetingId) {
    id
    title
    status
    scheduledAt
    createdAt
    description
  }
}
`;

export const fetchMeeting = async (input: string) => {
  const data = await gqlRequest<Pick<Query, 'findMeeting'>>(FIND_MEETING_BY_ID, {
    findMeetingId: input,
  });
  return data.findMeeting;
};

const FIND_ALL_MEETINGS = `
query FindAll {
findAll {
      id
      title
      description
      status
      scheduledAt
      createdAt
      updatedAt
    }
  }`;

export const fetchAllMeetings = async () => {
  const data = await gqlRequest<Pick<Query, 'findAll'>>(FIND_ALL_MEETINGS);
  return data.findAll;
};

const CREATE_MEETING = `
mutation ($createMeetingInput: CreateMeetingDto!) {
  createMeeting(createMeetingInput: $createMeetingInput) {
    id
    title
    description
    status
    createdAt
    updatedAt
  }
}`;

export const createMeeting = async (input: CreateMeetingDto) => {
  const data = await gqlRequest<Pick<Mutation, 'createMeeting'>>(CREATE_MEETING, {
    createMeetingInput: input,
  });
  return data.createMeeting;
};

const FIND_TRANSCRIPT = `
query ($meetingId: String!) {
  getTranscript(meetingId: $meetingId) {
    content
  }
}
`;

export const findTranscript = async (meetingId: string) => {
  const data = await gqlRequest<Pick<Query, 'getTranscript'>>(FIND_TRANSCRIPT, {
    meetingId: meetingId,
  });

  return data.getTranscript;
};
