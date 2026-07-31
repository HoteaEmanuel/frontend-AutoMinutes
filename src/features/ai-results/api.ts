import { gqlRequest } from '@/lib/graphql';
import { Mutation, Query } from '@/gql/types';

const FIND_AI_RESULTS = `
query findAIResults( $meetingId: String!) {
  getAIResults(meetingId: $meetingId) {
    summary
    decisions
    detailedNotes
    followUpNotes
    actionItems {
      id
      title
      description
      status
      deadline
      aiGenerated
      assignee {
        name
      }
    }
  }
}
`;

const GENERATE_AI_RESULTS = `
  mutation GenerateAIResults($meetingId: String!) {
    generateAIResults(aiInput: { meetingId: $meetingId }) {
      summary
    }
  }
`;

const FIND_AI_RESULTS_HISTORY = `
  query FindAIResultsHistory($meetingId: String!) {
    getAIResultsHistory(meetingId: $meetingId) {
      id
      createdAt
      summary
      decisions
      detailedNotes
      followUpNotes
      generatedActionItems {
        description
        assignee
        deadline
        status
      }
      generatedAttendees {
        name
        email
        role
      }
    }
  }
`;

export const findAIMeetingResults = async (meetingId: string) => {
  const data = await gqlRequest<Pick<Query, 'getAIResults'>>(FIND_AI_RESULTS, {
    meetingId: meetingId,
  });
  return data.getAIResults;
};

export const generateAIResults = async (meetingId: string) => {
  const data = await gqlRequest<Pick<Mutation, 'generateAIResults'>>(GENERATE_AI_RESULTS, {
    meetingId,
  });
  return data.generateAIResults;
};

export const findAIResultsHistory = async (meetingId: string) => {
  const data = await gqlRequest<Pick<Query, 'getAIResultsHistory'>>(FIND_AI_RESULTS_HISTORY, {
    meetingId,
  });
  return data.getAIResultsHistory;
};
