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
      primary: paletteColor.primary || { main: mode === 'dark' ? '#90caf9' : '#1976d2' },
      secondary: paletteColor.secondary || { main: mode === 'dark' ? '#f48fb1' : '#9c27b0' },
      text: {
        primary: paletteColor.grey[7] || '#595959',
        secondary: paletteColor.grey[5] || '#8c8c8c',
        disabled: paletteColor.grey[4] || '#bfbfbf'
      },
      action: {
        disabled: paletteColor.grey[3] || '#d9d9d9'
      },
      divider: paletteColor.grey[2] || '#f0f0f0',
      background: {
        paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
        default: mode === 'dark' ? '#121212' : '#fafafa'
      }
    }
  });
}
