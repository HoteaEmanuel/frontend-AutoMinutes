import { gqlRequest } from '@/lib/graphql';
import { api } from '@/lib/axios';
import {
  ChangePasswordInput,
  Mutation,
  Query,
  SetPasswordInput,
  UpdateProfileInput,
} from '@/gql/types';

const USER_FIELDS = `
  id
  firstName
  lastName
  email
  avatar
  provider
  hasPassword
  createdAt
`;

const ME = `
  query Me {
    me {
      ${USER_FIELDS}
    }
  }
`;

export const fetchMe = async () => {
  const data = await gqlRequest<Pick<Query, 'me'>>(ME);
  return data.me;
};

const UPDATE_PROFILE = `
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      ${USER_FIELDS}
    }
  }
`;

export const updateProfile = async (input: UpdateProfileInput) => {
  const data = await gqlRequest<Pick<Mutation, 'updateProfile'>>(UPDATE_PROFILE, { input });
  return data.updateProfile;
};

const CHANGE_PASSWORD = `
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input)
  }
`;

export const changePassword = async (input: ChangePasswordInput) => {
  const data = await gqlRequest<Pick<Mutation, 'changePassword'>>(CHANGE_PASSWORD, { input });
  return data.changePassword;
};

const SET_PASSWORD = `
  mutation SetPassword($input: SetPasswordInput!) {
    setPassword(input: $input)
  }
`;

export const setPassword = async (input: SetPasswordInput) => {
  const data = await gqlRequest<Pick<Mutation, 'setPassword'>>(SET_PASSWORD, { input });
  return data.setPassword;
};

const DELETE_ACCOUNT = `
  mutation DeleteAccount {
    deleteAccount
  }
`;

export const deleteAccount = async () => {
  const data = await gqlRequest<Pick<Mutation, 'deleteAccount'>>(DELETE_ACCOUNT);
  return data.deleteAccount;
};

export const uploadAvatar = async (file: Blob) => {
  const form = new FormData();
  form.append('file', file, 'avatar.webp');
  const { data } = await api.post<{ avatar?: string | null }>('/users/me/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};
