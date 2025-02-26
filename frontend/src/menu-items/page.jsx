// assets
import { LoginOutlined, ProfileOutlined, TableOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  TableOutlined 
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'authentication',
  title: 'authentication',
  type: 'group',
  children: [
    {
      id: 'login1',
      title: 'Login',
      type: 'item',
      url: '/login',
      icon: icons.LoginOutlined
    },
    {
      id: 'register1',
      title: 'Register',
      type: 'item',
      url: '/register',
      icon: icons.ProfileOutlined
    },
    {
      id: 'buy_data1',
      title: 'Buy Data',
      type: 'item',
      url: '/buy-data',
      icon: icons.TableOutlined
    },
    {
      id: 'sell_data1',
      title: 'Sell Data',
      type: 'item',
      url: '/sell-data',
      icon: icons.TableOutlined
    },
  ]
};


export default pages;