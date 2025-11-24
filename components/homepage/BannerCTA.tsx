import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
const BannerCTA = () => {
    return (
        <Paper
            elevation={4}
            sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
            }}
        >
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    Ready to start your project?
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                    I’ll walk you through everything — timelines, options, and the
                    simplest way to get a clean, modern website built.
                </Typography>
            </Box>

            <Button
                variant="outlined"
                size="large"
                href="/contact"
                color="primary"
                sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    minWidth: 180
                }}
            >
                Try a Free Consultation
            </Button>
        </Paper>
    );
};


export default BannerCTA;
