import { gqlRequest } from '@/lib/graphql';
import {
  ActionItemsFilterDto,
  CreateActionItemDto,
  DeleteActionItemDto,
  Mutation,
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

const GET_USER_ACTION_ITEMS = `
  query GetUserActionItems($filter: ActionItemsFilterDto) {
    getUserActionItems(filter: $filter) {
      ${ACTION_ITEM_FIELDS}
    }
  }
`;

export const fetchUserActionItems = async (filter: ActionItemsFilterDto) => {
  const data = await gqlRequest<Pick<Query, 'getUserActionItems'>>(GET_USER_ACTION_ITEMS, {
    filter,
  });
  return data.getUserActionItems;
};

const GET_USER_ACTION_ITEM_ASSIGNEES = `
  query GetUserActionItemAssignees {
    getUserActionItemAssignees {
      id
      name
    }
  }
`;

export const fetchUserActionItemAssignees = async () => {
  const data = await gqlRequest<Pick<Query, 'getUserActionItemAssignees'>>(
    GET_USER_ACTION_ITEM_ASSIGNEES,
  );
  return data.getUserActionItemAssignees;
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
