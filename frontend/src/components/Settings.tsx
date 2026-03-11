import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Settings: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', background: '#050505', pt: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 800, color: '#f8f8f8', letterSpacing: '-0.02em' }}
          >
            Settings
          </Typography>
          <Box
            sx={{
              p: 5,
              borderRadius: 4,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8f8f8', mb: 1 }}>
              Coming Soon
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
              Application settings and preferences will be available here.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Settings;