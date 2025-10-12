import { FaUser } from 'react-icons/fa';

interface UserIconProps {
  size?: number;
  className?: string;
  color?: string;
}

const UserIcon: React.FC<UserIconProps> = ({
  size = 24,
  className = '',
  color = 'black',
}) => {
  return (
    <FaUser 
      size={size}
      className={className}
      style={{ color }}
    />
  );
};

export default UserIcon;