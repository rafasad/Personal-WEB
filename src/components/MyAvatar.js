// hooks
import useAuth from '../hooks/useAuth';
// utils
import createAvatar from '../utils/createAvatar';
//
import Avatar from './Avatar';

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }) {
  const { user } = useAuth();

  return (
    <Avatar
      src={user?.avatar?.name ? `${process.env.REACT_APP_HOST_API_KEY}/avatar/${user.avatar.name}`: null}
      alt={user?.first_name}
      color={user?.avatar?.name ? 'default' : createAvatar(user?.first_name).color}
      {...other}
    >
      {createAvatar(user?.first_name).name}
    </Avatar>
  );
}
