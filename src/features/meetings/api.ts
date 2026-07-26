import { gqlRequest } from '@/lib/graphql';
import { CreateMeetingDto, Meeting, PaginatedMeetingsDto, Query } from '@/gql/types';

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

type NewMeetingAttendee = {
  firstName: string;
  lastName: string;
  email: string;
};

type CreateNewMeetingInput = {
  meeting: CreateMeetingDto;
  attendees: NewMeetingAttendee[];
};

const CREATE_MEETING = `
  mutation CreateMeeting($createMeetingInput: CreateMeetingDto!) {
    createMeeting(createMeetingInput: $createMeetingInput) {
      id
      title
      description
      status
      scheduledAt
      createdAt
      updatedAt
    }
  }
`;

const ADD_ATTENDEE = `
  mutation AddAttendee($addAttendeeDto: addAttendeeDto!) {
    addAttendee(addAttendeeDto: $addAttendeeDto) {
      id
      name
      email
      meetingId
      role
    }
  }
`;

const addAttendee = async (meetingId: string, attendee: NewMeetingAttendee) => {
  return gqlRequest(ADD_ATTENDEE, {
    addAttendeeDto: {
      meetingId,
      name: `${attendee.firstName} ${attendee.lastName}`.trim(),
      email: attendee.email,
      role: 'PARTICIPANT',
      aiGenerated: false,
    },
  });
};

export const createNewMeeting = async ({ meeting, attendees }: CreateNewMeetingInput) => {
  const data = await gqlRequest<{ createMeeting: Meeting }>(CREATE_MEETING, {
    createMeetingInput: meeting,
  });

  await Promise.all(
    attendees.map((attendee) => addAttendee(data.createMeeting.id, attendee)),
  );

  return data.createMeeting;
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
