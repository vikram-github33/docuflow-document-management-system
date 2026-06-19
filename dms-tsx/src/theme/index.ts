import { createTheme, Theme } from '@mui/material/styles';

const theme: Theme = createTheme({
  palette: {
    mode: 'light',
    primary:    { main: '#2563EB', light: '#3B82F6', dark: '#1D4ED8', contrastText: '#fff' },
    secondary:  { main: '#6B7280', light: '#9CA3AF', dark: '#374151' },
    success:    { main: '#059669', light: '#ECFDF5', contrastText: '#fff' },
    warning:    { main: '#D97706', light: '#FFFBEB', contrastText: '#fff' },
    error:      { main: '#DC2626', light: '#FEF2F2', contrastText: '#fff' },
    background: { default: '#F9FAFB', paper: '#FFFFFF' },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", -apple-system, sans-serif',
    fontSize: 13,
    h1: { fontSize: '1.5rem',  fontWeight: 600 },
    h2: { fontSize: '1.25rem', fontWeight: 600 },
    h3: { fontSize: '1.1rem',  fontWeight: 600 },
    h4: { fontSize: '1rem',    fontWeight: 600 },
    h5: { fontSize: '0.9rem',  fontWeight: 600 },
    h6: { fontSize: '0.85rem', fontWeight: 600 },
    body1:   { fontSize: '0.875rem' },
    body2:   { fontSize: '0.8125rem' },
    caption: { fontSize: '0.75rem' },
    overline: { fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.06em' },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 500, borderRadius: 8, fontSize: '0.8125rem' },
        sizeSmall: { fontSize: '0.75rem', padding: '4px 10px' },
      },
    },
    MuiPaper:   { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280', backgroundColor: '#F9FAFB' },
        body: { fontSize: '0.8125rem' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 20, fontSize: '0.6875rem', fontWeight: 600, height: 22 },
        label: { paddingLeft: 8, paddingRight: 8 },
      },
    },
    MuiListItemButton: {
      styleOverrides: { root: { borderRadius: 8, margin: '1px 0' } },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 8 },
        notchedOutline: { borderColor: '#E5E7EB' },
      },
    },
    MuiDrawer: { styleOverrides: { paper: { backgroundImage: 'none' } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 12 } } },
    MuiTab:    { styleOverrides: { root: { textTransform: 'none', fontWeight: 500, fontSize: '0.8125rem' } } },
    MuiAlert:  { styleOverrides: { root: { borderRadius: 8, fontSize: '0.8125rem' } } },
  },
});

export default theme;
