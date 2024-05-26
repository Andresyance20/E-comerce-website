//basic profile page
import UserProfile from '../Components/profileForm';
import NavbarOther from './NavbarOther';

//method for profile page
const Profile = () => {
  return (
    <div>
      <NavbarOther />
      <div style={{ marginTop: '20px' }}>
        <UserProfile />
      </div>
    </div>
  );
};

export default Profile;
