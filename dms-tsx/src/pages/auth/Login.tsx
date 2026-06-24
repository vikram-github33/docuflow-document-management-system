import React, { useState } from 'react';
import {
  Box, Paper, Typography, TextField, Button,
  Divider, FormControlLabel, Checkbox, Alert,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GoogleIcon       from '@mui/icons-material/Google';

interface LoginProps { onLogin: () => void }

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email,    setEmail]    = useState<string>('admin@company.com');
  const [password, setPassword] = useState<string>('password');
  const [mfa,      setMfa]      = useState<boolean>(false);
  const [code,     setCode]     = useState<string>('');
  const [error,    setError]    = useState<string>('');

  const handleLogin = (): void => {
    if (!email || !password) { setError('Please enter email and password.'); return; }
    setError('');
    setMfa(true);
    onLogin();
  };

  const handleVerify = (): void => { setError(''); onLogin(); };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Paper elevation={0} sx={{ width: '100%', maxWidth: 400, p: 4, border: '1px solid', borderColor: 'grey.200', borderRadius: 3 }}>

        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 3 }}>
          <Box sx={{ width: 40, height: 40, bgcolor: 'primary.main', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 20 }}>D</Typography>
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: 20, color: 'text.primary' }}>DocuFlow</Typography>
        </Box>

        {
        // !mfa ? 
        (
          <>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5, textAlign: 'center' }}>Welcome back</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, textAlign: 'center' }}>Sign in to your enterprise account</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TextField
              label="Work email" type="email" fullWidth size="small"
              value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }}
            />
            <TextField
              label="Password" type="password" fullWidth size="small"
              value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 1.5 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <FormControlLabel
                control={<Checkbox size="small" />}
                label={<Typography variant="caption">Remember me</Typography>}
              />
              <Typography variant="caption" sx={{ color: 'primary.main', cursor: 'pointer' }}>
                Forgot password?
              </Typography>
            </Box>

            <Button variant="contained" fullWidth onClick={handleLogin} sx={{ mb: 1.5, py: 1, fontWeight: 600 }}>
              Sign in
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="caption" color="text.secondary">or</Typography>
            </Divider>

            <Button variant="outlined" fullWidth startIcon={<GoogleIcon />} sx={{ py: 1, color: 'text.secondary', borderColor: 'grey.300' }}>
              Continue with SSO
            </Button>
            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: 'grey.400' }}>
              Demo: any email + password works
            </Typography>
          </>
        ) 
        // : (
        //   <>
        //     <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        //       <Box sx={{ width: 48, height: 48, bgcolor: '#EDE9FE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        //         <LockOutlinedIcon sx={{ color: '#7C3AED' }} />
        //       </Box>
        //     </Box>
        //     <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5, textAlign: 'center' }}>Verify identity</Typography>
        //     <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, textAlign: 'center' }}>
        //       Enter the 6-digit code from your authenticator app
        //     </Typography>

        //     <TextField
        //       label="6-digit code" fullWidth size="small"
        //       value={code} onChange={(e) => setCode(e.target.value)}
        //       inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: 22, letterSpacing: 12 } }}
        //       placeholder="000000" sx={{ mb: 2 }}
        //     />

        //     <Button variant="contained" fullWidth onClick={handleVerify} sx={{ mb: 1.5, py: 1, fontWeight: 600 }}>
        //       Verify & Sign in
        //     </Button>
        //     <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: 'text.secondary' }}>
        //       Didn't get a code?{' '}
        //       <Box component="span" sx={{ color: 'primary.main', cursor: 'pointer' }}>Resend</Box>
        //     </Typography>
        //   </>
        // )
        }
      </Paper>
    </Box>
  );
};

export default Login;
