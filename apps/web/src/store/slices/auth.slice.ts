import { createMongoAbility, PureAbility } from '@casl/ability';
import type { TokenPayload } from '@opendatacapture/schemas/auth';
import type { AppAction, AppSubjectName } from '@opendatacapture/schemas/core';
import { jwtDecode } from 'jwt-decode';

import type { AuthSlice, SliceCreator } from '../types';

export const createAuthSlice: SliceCreator<AuthSlice> = (set, get) => ({
  accessToken: null,
  changeGroup: (group) => {
    set({ currentGroup: group, currentSession: null });
  },
  currentGroup: null,
  currentUser: null,
  login: (accessToken) => {
    const { groups, permissions, ...rest } = jwtDecode<TokenPayload>(accessToken);
    const ability = createMongoAbility<PureAbility<[AppAction, AppSubjectName], any>>(permissions);
    set({
      accessToken,
      currentGroup: groups[0],
      currentUser: { ability, groups, ...rest }
    });
  },
  logout: () => {
    get().endSession();
    set((state) => {
      state.accessToken = null;
      state.currentGroup = null;
      state.currentUser = null;
      state.isDisclaimerAccepted = false;
    });
  }
});
