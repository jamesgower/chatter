import { SET_USER, SetUserAction } from "../interfaces/actions.i";
import { UserProps } from "../utils/interfaces/user.i";

export const setUser = (user: UserProps): SetUserAction => ({
  type: SET_USER,
  user,
});
