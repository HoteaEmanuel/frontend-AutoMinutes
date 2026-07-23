import { gqlRequest } from '@/lib/graphql';
import {
  CreateActionItemDto,
  DeleteActionItemDto,
  Mutation,
  PaginatedMeetingsDto,
  Query,
  UpdateActionItemDto,
} from '@/gql/types';

const ACTION_ITEM_FIELDS = `
  id
  title
  description
  status
  deadline
  meetingId
  assignee {
    id
    name
    email
  }
`;

const FIND_ACTION_ITEMS_BOARD = `
  query FindActionItemsBoard($input: PaginatedMeetingsDto!) {
    findUserMeetings(input: $input) {
      totalCount
      meetings {
        id
        title
        actionItems {
          ${ACTION_ITEM_FIELDS}
        }
      }
    }
  }
`;

export const fetchActionItemsBoard = async (input: PaginatedMeetingsDto) => {
  const data = await gqlRequest<Pick<Query, 'findUserMeetings'>>(FIND_ACTION_ITEMS_BOARD, {
    input,
  });
  return data.findUserMeetings;
};

const CREATE_ACTION_ITEM = `
  mutation CreateNewActionItem($createActionItem: CreateActionItemDto!) {
    createNewActionItem(createActionItem: $createActionItem) {
      ${ACTION_ITEM_FIELDS}
    }
  }
`;

export const createActionItem = async (input: CreateActionItemDto) => {
  const data = await gqlRequest<Pick<Mutation, 'createNewActionItem'>>(CREATE_ACTION_ITEM, {
    createActionItem: input,
  });
  return data.createNewActionItem;
};

const UPDATE_ACTION_ITEM = `
  mutation UpdateActionItem($updateActionItemDto: UpdateActionItemDto!) {
    updateActionItem(updateActionItemDto: $updateActionItemDto) {
      ${ACTION_ITEM_FIELDS}
    }
  }
`;

export const updateActionItem = async (input: UpdateActionItemDto) => {
  const data = await gqlRequest<Pick<Mutation, 'updateActionItem'>>(UPDATE_ACTION_ITEM, {
    updateActionItemDto: input,
  });
  return data.updateActionItem;
};

const DELETE_ACTION_ITEM = `
  mutation DeleteActionItem($deleteActionItemDto: DeleteActionItemDto!) {
    deleteActionItem(deleteActionItemDto: $deleteActionItemDto) {
      id
      meetingId
    }
  }
`;

export const deleteActionItem = async (input: DeleteActionItemDto) => {
  const data = await gqlRequest<Pick<Mutation, 'deleteActionItem'>>(DELETE_ACTION_ITEM, {
    deleteActionItemDto: input,
  });
  return data.deleteActionItem;
};
