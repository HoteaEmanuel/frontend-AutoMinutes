import { gqlRequest } from '@/lib/graphql';
import { Query } from '@/gql/types';

const FIND_AI_RESULTS = `
query findAIResults( $meetingId: String!) {
  getAIResults(meetingId: $meetingId) {
    summary
    decisions
    detailedNotes
    actionItems {
      title
      description
      status
      deadline
      assignee {
        name
      }
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
