import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <Box sx={{ width: '100%', mb: { xs: 3, md: 4 } }}>
      <Typography
        textAlign="center"
        py={{ xs: 2, md: 3 }}
        variant="h3"
        sx={{
          fontWeight: 800,
          letterSpacing: '.18em',
          textTransform: 'uppercase',
        }}
        color='text.primary'
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          textAlign="center"
          variant="body1"
          sx={{
            maxWidth: 640,
            mx: 'auto',
            mt: 1,
            color: 'text.secondary',
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default PageHeader;


