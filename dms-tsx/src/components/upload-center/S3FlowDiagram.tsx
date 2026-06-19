import React from 'react';
import { Box, Typography } from '@mui/material';

const STEPS = [
  {
    num: 1,
    title: 'Initiate',
    desc: 'Backend returns a presigned S3 URL with expiry',
    bg: '#E6F1FB',
    color: '#0C447C',
    line: true,
  },
  {
    num: 2,
    title: 'Upload to S3',
    desc: 'File sent directly to AWS — no backend proxy',
    bg: '#FAEEDA',
    color: '#633806',
    line: true,
  },
  {
    num: 3,
    title: 'Confirm',
    desc: 'Backend persists the document record in DB',
    bg: '#EAF3DE',
    color: '#27500A',
    line: false,
  },
];

export const S3FlowDiagram: React.FC = () => (
  <Box>
    <Typography
      variant="caption"
      fontWeight={500}
      color="text.secondary"
      sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 1.5 }}
    >
      S3 upload flow
    </Typography>

    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {STEPS.map((step) => (
        <Box
          key={step.num}
          sx={{ display: 'flex', gap: 1.25, position: 'relative', pb: step.line ? 2 : 0 }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <Box
              sx={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                bgcolor: step.bg,
                color: step.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 500,
                zIndex: 1,
              }}
            >
              {step.num}
            </Box>
            {step.line && (
              <Box sx={{ width: '1.5px', flex: 1, bgcolor: 'divider', mt: 0.5 }} />
            )}
          </Box>

          <Box>
            <Typography variant="body2" fontWeight={500}>
              {step.title}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ lineHeight: 1.5 }}>
              {step.desc}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
);
