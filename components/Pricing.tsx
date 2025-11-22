'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PageHeader from './PageHeader';
import Button from '@mui/material/Button';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
const Pricing = () => {
    return (
        <Box
            sx={(theme) => ({
                py: { xs: 6, md: 8 },
                px: { xs: 2, md: 4 },
                pb: { xs: 10, md: 14 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background:
                    theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, #020617 0%, #0b1120 50%, #020617 100%)'
                        : '#f9f9f9',
            })}
        >
            <Grid container justifyContent="center">
                <Grid size={12}>
                    <PageHeader
                        title="Pricing"
                        subtitle="Straightforward options for one-time builds or fully managed websites."
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 10 }}>
                    <Grid container spacing={4}>
                        {/* Lump-sum build */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Paper
                                elevation={5}
                                sx={{
                                    borderRadius: 3,
                                    p: { xs: 3, md: 4 },
                                    height: '100%',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <Stack spacing={2}>
                                    <Typography variant="h4" color="text.primary">
                                        Lump-Sum Website Build
                                    </Typography>
                                    <Typography variant="h5" fontWeight={700}>
                                        $1,600
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        40 hours × $40/hr — ideal if you want full ownership and already have someone
                                        who can maintain the site later.
                                    </Typography>

                                    <Box mt={1}>
                                        <Typography variant="h6" fontWeight={600}>
                                            Includes
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • Full website (up to 5 pages)
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • Responsive, modern design
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • Deployment, DNS, and SSL setup
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • Documentation for future developers
                                        </Typography>
                                    </Box>

                                    <Box mt={1}>
                                        <Typography variant="h6" fontWeight={600}>
                                            Does not include
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • Ongoing support or maintenance
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • New pages or feature development
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • Security monitoring
                                        </Typography>
                                    </Box>

                                    <Box mt={1}>
                                        <Typography variant="h6" fontWeight={600}>
                                            Future changes
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            $40/hr (minimum 2 hours per engagement).
                                        </Typography>
                                    </Box>

                                    <Box mt={1}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Best for clients who want full ownership and have internal or future
                                            technical support.
                                        </Typography>
                                    </Box>
                                    <Box sx={{ alignContent: 'end', alignItems: 'end', height: '100%', py: 1 }}>
                                        {/* actions button */}
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            justifyContent="space-between"
                                            alignItems="center"
                                            sx={{ mt: 2 }}
                                        >
                                            <Button
                                                variant="contained"
                                                size="large"
                                                color="primary"
                                                fullWidth
                                                startIcon={<MailOutlineIcon />}
                                                href="contact"
                                                aria-label={`Request Quote for Subscription Website Plan`}
                                                sx={{ textTransform: 'none', boxShadow: 'none' }}
                                            >
                                                Request Quote
                                            </Button>
                                        </Stack>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Grid>

                        {/* Subscription plan */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Paper
                                elevation={8}
                                sx={{
                                    borderRadius: 3,
                                    p: { xs: 3, md: 4 },
                                    height: '100%',
                                    border: '2px solid',
                                    borderColor: 'text.primary',
                                }}
                            >
                                <Stack spacing={2} height={'inherit'}>
                                    <Typography variant="h4" color="text.primary">
                                        Subscription Website Plan
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Website-as-a-Service — no large upfront cost, fully managed for you.
                                    </Typography>

                                    <Box>
                                        <Typography variant="h5" fontWeight={700}>
                                            $140<span style={{ fontSize: 18 }}> / month</span>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            + Hosting (~$25/month) → total around $165/month
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            $0 upfront.
                                        </Typography>
                                    </Box>

                                    <Box mt={1}>
                                        <Typography variant="h6" fontWeight={600}>
                                            Includes
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • Full website build, no upfront fee
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • 24/7 support & unlimited small updates
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • Security patches, backups, and uptime monitoring
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • Ongoing maintenance and priority response
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • Hosting setup and technical management
                                        </Typography>
                                    </Box>

                                    <Box mt={1}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Perfect for small businesses, nonprofits, and anyone who never wants to
                                            touch the tech side of their website.
                                        </Typography>
                                    </Box>
                                    <Box sx={{ alignContent: 'end', alignItems: 'end', height: '100%', py: 1 }}>
                                        {/* actions button */}
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            justifyContent="space-between"
                                            alignItems="center"
                                            sx={{ mt: 2 }}
                                        >
                                            <Button
                                                variant="contained"
                                                size="large"
                                                color="primary"
                                                fullWidth
                                                startIcon={<MailOutlineIcon />}
                                                href="contact"
                                                aria-label={`Request Quote for Subscription Website Plan`}
                                                sx={{ textTransform: 'none', boxShadow: 'none' }}
                                            >
                                                Request Quote
                                            </Button>
                                        </Stack>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Grid>

                        {/* Add-ons row */}
                        <Grid size={12} sx={{ mt: { xs: 4, md: 6 } }}>
                            <Paper
                                elevation={3}
                                sx={{
                                    borderRadius: 3,
                                    p: { xs: 3, md: 4 },
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <Stack spacing={2}>
                                    <Typography variant="h5" color="text.primary">
                                        Add-Ons
                                    </Typography>

                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                Extra Pages
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Standard page: $80–$120
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Complex/feature page: $150–$300
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Dynamic/functional page: $300–$600
                                            </Typography>
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                Design & Campaigns
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Theme variations (holiday and seasonal layouts): $100–$250
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Campaign landing pages: $250–$600
                                            </Typography>
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                E‑Commerce Add-Ons
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Basic catalog: $300–$500
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Full checkout: $600–$1,200
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Box sx={{ alignContent: 'end', alignItems: 'end', height: '100%', py: 1 }}>
                                        {/* actions button */}
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            justifyContent="space-between"
                                            alignItems="center"
                                            sx={{ mt: 2 }}
                                        >
                                            <Button
                                                variant="contained"
                                                size="large"
                                                color="primary"
                                                startIcon={<MailOutlineIcon />}
                                                href="contact"
                                                aria-label={`Request Quote for Subscription Website Plan`}
                                                sx={{ textTransform: 'none', boxShadow: 'none' }}
                                            >
                                                Request Quote
                                            </Button>
                                        </Stack>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Grid>
                        {/* action button */}
                        <Grid size={{ xs: 12, md: 10 }} sx={{ mt: 5 }}>
                            <Paper elevation={3} sx={{ borderRadius: 3, p: { xs: 2.5, md: 3 } }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={{ xs: 12, md: 8 }} >
                                        <Typography component={"h4"} variant="h6" sx={{ fontWeight: 800 }}>
                                            Not sure which plan suits your business needs?
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            Give us a call for a free consult to discuss your business and what your goals are. We’re here to help!
                                        </Typography>
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                                        <Button
                                            variant="outlined"
                                            size="large"
                                            href="contact"
                                            color='primary'
                                            sx={{ textTransform: 'none', borderRadius: 2 }}
                                        >
                                            Get a Free Consult
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Pricing;