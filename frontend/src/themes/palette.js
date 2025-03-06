// material-ui
import { createTheme } from '@mui/material/styles';

// third-party
import { presetPalettes } from '@ant-design/colors';

// project import
import ThemeOption from './theme';

// ==============================|| DEFAULT THEME - PALETTE ||============================== //

export default function Palette(mode = 'light', presetColor = 'default') {
  const colors = { ...presetPalettes };

  // Define a grey color palette to avoid errors
  const greyPrimary = [
    '#ffffff', '#fafafa', '#f5f5f5', '#f0f0f0', '#d9d9d9',
    '#bfbfbf', '#8c8c8c', '#595959', '#262626', '#141414', '#000000'
  ];
  const greyAscent = ['#fafafa', '#bfbfbf', '#434343', '#1f1f1f'];
  const greyConstant = ['#fafafb', '#e6ebf1'];

  colors.grey = [...greyPrimary, ...greyAscent, ...greyConstant];

  // Ensure ThemeOption returns valid colors
  const paletteColor = ThemeOption(colors, presetColor, mode) || {};

  // Ensure grey palette exists in paletteColor
  paletteColor.grey = paletteColor.grey || colors.grey;

  return createTheme({
    palette: {
      mode,
      common: {
        black: '#000',
        white: '#fff'
      },
      primary: paletteColor.primary || { main: '#d32f2f' }, // Red Theme
      secondary: paletteColor.secondary || { main: '#ff7961' }, // Light Red
      text: {
        primary: mode === 'dark' ? '#e0e0e0' : paletteColor.grey[8] || '#212121',
        secondary: mode === 'dark' ? '#bdbdbd' : paletteColor.grey[6] || '#757575',
        disabled: paletteColor.grey[4] || '#bdbdbd'
      },
      action: {
        disabled: paletteColor.grey[3] || '#e0e0e0'
      },
      divider: paletteColor.grey[2] || '#eeeeee',
      background: {
        paper: mode === 'dark' ? '#2c0b0b' : '#ffffff', // Dark Red/White for paper
        default: mode === 'dark' ? '#1a0606' : '#fce8e8' // Darker/Lighter Red for background
      }
    }
  });
}
