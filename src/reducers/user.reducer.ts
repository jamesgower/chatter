import { UsersState } from "../interfaces/components.i";
import { SET_USER, SetUserAction } from "../interfaces/actions.i";

type UsersActionsTypes = SetUserAction;

const defaultUserState: UsersState = {
  id: null,
  name: null,
  activeRoom: null,
};

export default (state = defaultUserState, action: UsersActionsTypes): UsersState => {
  switch (action.type) {
    case SET_USER:
      return action.user;
    default:
      return state;
  }
};
