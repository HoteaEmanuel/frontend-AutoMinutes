import { gqlRequest } from '@/lib/graphql';
import {
  CreateMeetingDto,
  Mutation,
  PaginatedMeetingsDto,
  Query,
  UpdateMeetingDto,
  UploadTranscriptDto,
} from '@/gql/types';

const FIND_USER_MEETINGS = `
  query FindUserMeetings($input: PaginatedMeetingsDto!) {
    findUserMeetings(input: $input) {
      totalCount
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
  query FindMeetingById($findMeetingId: String!) {
    findMeeting(id: $findMeetingId) {
      id
      title
      status
      scheduledAt
      createdAt
      description
      actionItems {
        id
      }
    }
  }
`;

export const fetchMeeting = async (input: string) => {
  const data = await gqlRequest<Pick<Query, 'findMeeting'>>(FIND_MEETING_BY_ID, {
    findMeetingId: input,
  });
  return data.findMeeting;
};

const GET_USER_MEETINGS = `
  query GetUserMeetings {
    getUserMeetings {
      id
      title
    }
  }
`;

export const fetchUserMeetingOptions = async () => {
  const data = await gqlRequest<Pick<Query, 'getUserMeetings'>>(GET_USER_MEETINGS);
  return data.getUserMeetings;
};

const GET_USER_MEETINGS_FOR_EXPORT = `
  query GetUserMeetingsForExport {
    getUserMeetings {
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

export const fetchAllMeetingsForExport = async () => {
  const data = await gqlRequest<Pick<Query, 'getUserMeetings'>>(GET_USER_MEETINGS_FOR_EXPORT);
  return data.getUserMeetings;
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

export const createMeeting = async (input: CreateMeetingDto) => {
  const data = await gqlRequest<Pick<Mutation, 'createMeeting'>>(CREATE_MEETING, {
    createMeetingInput: input,
  });
  return data.createMeeting;
};

const UPDATE_MEETING = `
  mutation UpdateMeeting($updateMeetingInput: UpdateMeetingDto!) {
    updateMeeting(updateMeetingInput: $updateMeetingInput) {
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

export const updateMeeting = async (input: UpdateMeetingDto) => {
  const data = await gqlRequest<Pick<Mutation, 'updateMeeting'>>(UPDATE_MEETING, {
    updateMeetingInput: input,
  });
  return data.updateMeeting;
};

const DELETE_MEETING = `
mutation ($id: String!) {
  deleteMeeting(id: $id) {
    id
  }
}`;

export const deleteMeeting = async (id: string) => {
  const data = await gqlRequest<Pick<Mutation, 'deleteMeeting'>>(DELETE_MEETING, { id });
  return data.deleteMeeting;
};

const FIND_TRANSCRIPT = `
  query FindTranscript($meetingId: String!) {
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

const UPLOAD_TRANSCRIPT = `
  mutation UploadTranscript($uploadTranscriptDto: UploadTranscriptDto!) {
    uploadTranscript(uploadTranscriptDto: $uploadTranscriptDto) {
      id
      content
    }
  }
`;

export const uploadTranscript = async (input: UploadTranscriptDto) => {
  const data = await gqlRequest<Pick<Mutation, 'uploadTranscript'>>(UPLOAD_TRANSCRIPT, {
    uploadTranscriptDto: input,
  });

  return data.uploadTranscript;
};

const GET_TRANSCRIPT_VERSIONS = `
  query GetTranscriptVersions($meetingId: String!) {
    getTranscriptVersions(meetingId: $meetingId) {
      id
      content
      isActive
      createdAt
    }
  }
`;

export const findTranscriptVersions = async (meetingId: string) => {
  const data = await gqlRequest<Pick<Query, 'getTranscriptVersions'>>(GET_TRANSCRIPT_VERSIONS, {
    meetingId,
  });

  return data.getTranscriptVersions;
};

const SELECT_TRANSCRIPT_VERSION = `
  mutation SelectTranscriptVersion($transcriptId: String!) {
    selectTranscriptVersion(transcriptId: $transcriptId) {
      id
      content
      isActive
      createdAt
    }
  }
`;

export const selectTranscriptVersion = async (transcriptId: string) => {
  const data = await gqlRequest<Pick<Mutation, 'selectTranscriptVersion'>>(
    SELECT_TRANSCRIPT_VERSION,
    { transcriptId },
  );

  return data.selectTranscriptVersion;
};
