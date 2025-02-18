// assets
import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'authentication',
  title: 'Authentication',
  type: 'group',
  children: [
    {
      id: 'login1',
      title: 'Login',
      type: 'item',
      url: '/login',
<<<<<<< HEAD
      icon: icons.LoginOutlined
=======
      icon: icons.LoginOutlined,
      target: true
>>>>>>> origin/aditya
    },
    {
      id: 'register1',
      title: 'Register',
      type: 'item',
      url: '/register',
<<<<<<< HEAD
      icon: icons.ProfileOutlined
=======
      icon: icons.ProfileOutlined,
      target: true
>>>>>>> origin/aditya
    }
  ]
};

<<<<<<< HEAD

=======
>>>>>>> origin/aditya
export default pages;
