'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import PageHeader from './PageHeader';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

// NEW: icons for highlight/checklist areas
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import LoopIcon from '@mui/icons-material/Loop';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BrushIcon from '@mui/icons-material/Brush';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Pricing = () => {
    const [breakdownOpen, setBreakdownOpen] = useState(false);

    const handleOpenBreakdown = () => setBreakdownOpen(true);
    const handleCloseBreakdown = () => setBreakdownOpen(false);

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
                                    position: 'relative',
                                }}
                            >
                                <Chip
                                    label="One-time • Full build"
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        top: 16,
                                        right: 16,
                                        fontSize: 11,
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.4,
                                    }}
                                />
                                <Stack spacing={2}>
                                    <Typography variant="h4" color="text.primary">
                                        Lump-Sum Website Build
                                    </Typography>
                                    <Typography variant="h5" fontWeight={700}>
                                        $1,600
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        40 hours × $40/hr — best if you want a professional build with predictable
                                        cost and already have (or plan to hire) someone who can maintain the site later.
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
                                            • Clean, documented codebase for future developers
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
                                            • Ongoing security monitoring
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

                                    {/* NEW: “Perfect if” highlight box */}
                                    <Box
                                        mt={2}
                                        sx={{
                                            p: 1.75,
                                            borderRadius: 2,
                                            bgcolor: 'action.hover',
                                        }}
                                    >
                                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                            <CheckCircleOutlineIcon fontSize="small" color="primary" />
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                    Perfect if you:
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    • Prefer a clear, one-time project cost
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    • Have in-house or trusted technical help for future updates
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    • Want a strong foundation you can grow on over time
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Box>

                                    <Box mt={1}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Best for clients who prefer a one-time project cost and have internal or
                                            planned technical support.
                                        </Typography>
                                    </Box>

                                    <Box sx={{ mt: 2 }}>
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            justifyContent="space-between"
                                            alignItems="center"
                                        >
                                            <Button
                                                variant="contained"
                                                size="large"
                                                color="primary"
                                                fullWidth
                                                startIcon={<MailOutlineIcon />}
                                                href="/contact"
                                                aria-label="Request Quote for Lump-Sum Website Build"
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
                                    position: 'relative',
                                }}
                            >
                                <Chip
                                    label="Most popular"
                                    color="primary"
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        top: 16,
                                        right: 16,
                                        fontSize: 11,
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.4,
                                    }}
                                />
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
                                            $0 upfront. Cancel anytime.
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

                                    {/* NEW: “Perfect if” highlight box focused on long-term relationship */}
                                    <Box
                                        mt={2}
                                        sx={{
                                            p: 1.75,
                                            borderRadius: 2,
                                            bgcolor: 'action.hover',
                                        }}
                                    >
                                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                            <LoopIcon fontSize="small" color="primary" />
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                    Perfect if you:
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    • Want a long-term partner, not just a one-off website
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    • Never want to worry about tech, security, or updates
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    • Prefer a predictable monthly cost over a large upfront payment
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Box>

                                    <Box mt={1}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Perfect for small businesses, nonprofits, and anyone who never wants to
                                            touch the tech side of their website and values an ongoing partnership.
                                        </Typography>
                                    </Box>

                                    <Box sx={{ mt: 2 }}>
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            justifyContent="space-between"
                                            alignItems="center"
                                        >
                                            <Button
                                                variant="contained"
                                                size="large"
                                                color="primary"
                                                fullWidth
                                                startIcon={<MailOutlineIcon />}
                                                href="/contact"
                                                aria-label="Request Quote for Subscription Website Plan"
                                                sx={{ textTransform: 'none', boxShadow: 'none' }}
                                            >
                                                Request Quote
                                            </Button>
                                        </Stack>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Grid>

                        {/* WordPress vs Your Stack Comparison */}
                        <Grid size={12} sx={{ mt: { xs: 4, md: 6 } }}>
                            <Paper
                                elevation={6}
                                sx={{
                                    borderRadius: 3,
                                    p: { xs: 3, md: 4 },
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <Stack spacing={3}>
                                    <Box>
                                        <Typography variant="h5" color="text.primary" sx={{ fontWeight: 700 }}>
                                            WordPress Template vs Custom Modern Stack
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                            Your biggest question might be: “Why $1,600 when I can buy a WordPress template
                                            for $50?” This comparison looks at total cost, not just the sticker price.
                                        </Typography>
                                    </Box>

                                    <Grid container spacing={3}>
                                        {/* WordPress / Template */}
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <Paper
                                                sx={{
                                                    borderRadius: 3,
                                                    p: 3,
                                                    height: '100%',
                                                    backgroundColor: 'background.paper',
                                                    color: 'text.primary',
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        opacity: 0.12,
                                                        background:
                                                            'radial-gradient(circle at bottom right, #ffffff, transparent 60%)',
                                                    }}
                                                />
                                                <Stack spacing={1.5} sx={{ position: 'relative' }}>
                                                    <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 1.2 }}>
                                                        Option A
                                                    </Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                                        WordPress Template Setup
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        • Template: ~<strong>$50</strong> one-time
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        • Developer setup (10–20 hours): often <strong>$600–$1,600</strong>
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        • Hosting & premium plugins: <strong>$20–$60/month</strong>
                                                    </Typography>
                                                    <Divider sx={{ my: 1.5, borderColor: 'rgba(248,250,252,0.4)' }} />
                                                    <Typography variant="body2">
                                                        You get a premade design that still needs customization, plugins, and
                                                        ongoing updates. Performance and security depend heavily on plugin
                                                        choices and whoever sets it up.
                                                    </Typography>
                                                </Stack>
                                            </Paper>
                                        </Grid>

                                        {/* Your Custom Stack */}
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <Paper
                                                sx={{
                                                    borderRadius: 3,
                                                    p: 3,
                                                    height: '100%',
                                                    backgroundColor: 'background.default',
                                                    color: 'text.primary',
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        opacity: 0.12,
                                                        background:
                                                            'radial-gradient(circle at bottom right, #ffffff, transparent 60%)',
                                                    }}
                                                />
                                                <Stack spacing={1.5} sx={{ position: 'relative' }}>
                                                    <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 1.2 }}>
                                                        Option B
                                                    </Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                                        Custom Modern Build (React / Next.js)
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        • One-time build: <strong>$1,600</strong> (up to 5 pages)
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        • Modern stack: Next.js, React, MUI, API integrations
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        • Hosting (Vercel & email): typically <strong>$20–$30/month</strong>
                                                    </Typography>
                                                    <Divider sx={{ my: 1.5, borderColor: 'rgba(248,250,252,0.4)' }} />
                                                    <Typography variant="body2">
                                                        You get a fast, lightweight site built on a modern framework with clean,
                                                        well-structured code. Easier to maintain, scale, and hand off to another
                                                        developer later without plugin chaos.
                                                    </Typography>
                                                </Stack>
                                            </Paper>
                                        </Grid>
                                    </Grid>

                                    {/* Long-term cost breakdown */}
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                            Long-Term Cost Snapshot (Approximate)
                                        </Typography>
                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                borderRadius: 3,
                                                p: 2.5,
                                                overflowX: 'auto',
                                            }}
                                        >
                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 12, md: 4 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                        Year 1 Total
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                        WordPress Template: ~<strong>$1,000–$2,200</strong>{' '}
                                                        (template + setup + hosting + plugins)
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Custom Build: ~<strong>$1,900–$2,000</strong>{' '}
                                                        (build + hosting/email)
                                                    </Typography>
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 4 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                        3-Year Estimate
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                        WordPress Template: ~<strong>$2,500–$4,500+</strong>{' '}
                                                        including updates, plugin renewals, and dev fixes.
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Custom Build: ~<strong>$2,500–$3,500</strong> depending on
                                                        how many new features or pages you add.
                                                    </Typography>
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 4 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                        Biggest Difference
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                        WordPress can look cheap at first but often becomes more expensive
                                                        and fragile over time due to plugins and maintenance.
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        A modern, lean stack costs a bit more upfront but is easier to scale,
                                                        maintain, and keep fast and secure.
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Box>

                                    <Box sx={{ mt: 2, textAlign: { xs: 'left', md: 'right' } }}>
                                        <Button
                                            variant="outlined"
                                            size="medium"
                                            color="primary"
                                            onClick={handleOpenBreakdown}
                                            sx={{ textTransform: 'none', borderRadius: 2 }}
                                        >
                                            View Full Cost Breakdown
                                        </Button>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Grid>

                        {/* Why the Subscription Model Works */}
                        <Grid size={12} sx={{ mt: 4 }}>
                            <Paper
                                elevation={4}
                                sx={{
                                    borderRadius: 3,
                                    p: { xs: 3, md: 4 },
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    backgroundColor: 'background.paper',
                                }}
                            >
                                <Stack spacing={3}>
                                    <Typography variant="h5" fontWeight={700} color="text.primary">
                                        Why Clients Choose the Subscription Model
                                    </Typography>

                                    {/* NEW: three highlight “cards” instead of one long block */}
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <Paper
                                                variant="outlined"
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    height: '100%',
                                                }}
                                            >
                                                <Stack spacing={1.25}>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <TrendingUpIcon fontSize="small" color="primary" />
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                            Easier on Cash Flow
                                                        </Typography>
                                                    </Stack>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Most people expect custom websites to cost <strong>$2,500+</strong>{' '}
                                                        upfront. With my subscription model, you get a fully custom, modern
                                                        website for <strong>$140/month</strong> instead of a large upfront
                                                        payment.
                                                    </Typography>
                                                </Stack>
                                            </Paper>
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <Paper
                                                variant="outlined"
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    height: '100%',
                                                }}
                                            >
                                                <Stack spacing={1.25}>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <SecurityIcon fontSize="small" color="primary" />
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                            Everything Managed for You
                                                        </Typography>
                                                    </Stack>
                                                    <Typography variant="body2" color="text.secondary">
                                                        No surprise fees, no plugin headaches, no worrying about security
                                                        or performance. I handle updates, fixes, backups, and small changes
                                                        so you can focus on running your business.
                                                    </Typography>
                                                </Stack>
                                            </Paper>
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <Paper
                                                variant="outlined"
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    height: '100%',
                                                }}
                                            >
                                                <Stack spacing={1.25}>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <ScheduleIcon fontSize="small" color="primary" />
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                            Built for Long-Term Growth
                                                        </Typography>
                                                    </Stack>
                                                    <Typography variant="body2" color="text.secondary">
                                                        It usually takes <strong>6–12 months</strong> for Google to fully
                                                        rank and trust a website. The subscription model is designed for
                                                        business owners who see their website as a long-term investment,
                                                        not a quick one-time purchase.
                                                    </Typography>
                                                </Stack>
                                            </Paper>
                                        </Grid>
                                    </Grid>

                                    {/* NEW: one short “relationship” paragraph, no IP/cancel clause */}
                                    <Typography variant="body1" color="text.secondary">
                                        I do my best work with clients who want a partner, not just a one-off project. If
                                        you&apos;re serious about growing your business over the next year and beyond, the
                                        subscription plan lets us iterate together, improve based on real results, and keep
                                        your website in top shape as your needs evolve.
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        size="large"
                                        color="primary"
                                        startIcon={<MailOutlineIcon />}
                                        href="/contact"
                                        sx={{ textTransform: 'none', alignSelf: 'flex-start', mt: 1 }}
                                    >
                                        Talk to Me About the Subscription Plan
                                    </Button>
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
                                <Stack spacing={2.5}>
                                    <Typography variant="h5" color="text.primary" sx={{ fontWeight: 700 }}>
                                        Add-Ons
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary">
                                        These are typical ranges based on scope. We&apos;ll talk through your goals first, then I&apos;ll give
                                        you a clear, fixed estimate before starting.
                                    </Typography>

                                    <Grid container spacing={3}>
                                        {/* Extra Pages */}
                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <Paper
                                                variant="outlined"
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    height: '100%',
                                                }}
                                            >
                                                <Stack spacing={1.5}>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <AddCircleOutlineIcon color="primary" fontSize="small" />
                                                        <Typography variant="subtitle1" fontWeight={600}>
                                                            Extra Pages
                                                        </Typography>
                                                    </Stack>

                                                    <Stack spacing={0.5}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            • Standard page: <strong>$80–$120</strong>
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            • Complex / feature page: <strong>$150–$300</strong>
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            • Dynamic / functional page: <strong>$300–$600</strong>
                                                        </Typography>
                                                    </Stack>

                                                    <Typography variant="body2" color="text.secondary">
                                                        Great when your business grows and you need new services, locations, or information
                                                        pages without rebuilding your site.
                                                    </Typography>
                                                </Stack>
                                            </Paper>
                                        </Grid>

                                        {/* Design & Campaigns */}
                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <Paper
                                                variant="outlined"
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    height: '100%',
                                                }}
                                            >
                                                <Stack spacing={1.5}>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <BrushIcon color="primary" fontSize="small" />
                                                        <Typography variant="subtitle1" fontWeight={600}>
                                                            Design & Campaigns
                                                        </Typography>
                                                    </Stack>

                                                    <Stack spacing={0.5}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            • Theme variations (holiday / seasonal): <strong>$100–$250</strong>
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            • Campaign landing pages: <strong>$250–$600</strong>
                                                        </Typography>
                                                    </Stack>

                                                    <Typography variant="body2" color="text.secondary">
                                                        Ideal for promos, launches, and seasonal pushes when you want your site to match your
                                                        marketing without touching templates yourself.
                                                    </Typography>
                                                </Stack>
                                            </Paper>
                                        </Grid>

                                        {/* E-Commerce Add-Ons */}
                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <Paper
                                                variant="outlined"
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    height: '100%',
                                                }}
                                            >
                                                <Stack spacing={1.5}>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <ShoppingCartIcon color="primary" fontSize="small" />
                                                        <Typography variant="subtitle1" fontWeight={600}>
                                                            E-Commerce Add-Ons
                                                        </Typography>
                                                    </Stack>

                                                    <Stack spacing={0.5}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            • Basic catalog: <strong>$300–$500</strong>
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            • Full checkout: <strong>$600–$1,200</strong>
                                                        </Typography>
                                                    </Stack>

                                                    <Typography variant="body2" color="text.secondary">
                                                        Perfect if you&apos;re ready to start selling online or want to upgrade from simple
                                                        inquiry forms to real orders and payment flows.
                                                    </Typography>
                                                </Stack>
                                            </Paper>
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ mt: 2 }}>
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            justifyContent="space-between"
                                            alignItems="center"
                                        >
                                            <Button
                                                variant="contained"
                                                size="large"
                                                color="primary"
                                                startIcon={<MailOutlineIcon />}
                                                href="/contact"
                                                aria-label="Request Quote for Add-Ons"
                                                sx={{ textTransform: 'none', boxShadow: 'none' }}
                                            >
                                                Request Quote
                                            </Button>
                                        </Stack>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Grid>


                        {/* CTA section */}
                        <Grid size={{ xs: 12, md: 10 }} sx={{ mt: 5 }}>
                            <Paper elevation={3} sx={{ borderRadius: 3, p: { xs: 2.5, md: 3 } }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={{ xs: 12, md: 8 }}>
                                        <Typography component={'h4'} variant="h6" sx={{ fontWeight: 800 }}>
                                            Not sure which option fits you best?
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            Tell me about your business, how you get customers today, and what&apos;s
                                            not working with your current website (or lack of one). I&apos;ll recommend
                                            the simplest option that makes sense — even if it&apos;s not the most expensive.
                                        </Typography>
                                    </Grid>

                                    <Grid
                                        size={{ xs: 12, md: 4 }}
                                        sx={{ textAlign: { xs: 'left', md: 'right' } }}
                                    >
                                        <Button
                                            variant="outlined"
                                            size="large"
                                            href="/contact"
                                            color="primary"
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

            {/* Full Cost Breakdown Dialog */}
            <Dialog
                open={breakdownOpen}
                onClose={handleCloseBreakdown}
                aria-labelledby="cost-breakdown-title"
                fullWidth
                maxWidth="md"
            >
                <DialogTitle id="cost-breakdown-title">
                    Full Cost Breakdown: Template vs Custom Modern Build
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2.5}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            1. WordPress Template Route (Typical Scenario)
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            This is what usually happens when a business buys a $50 template:
                        </Typography>
                        <ul style={{ paddingLeft: '1.2rem', marginTop: 4 }}>
                            <li>
                                <Typography variant="body2" color="text.secondary">
                                    Template purchase: ~<strong>$50</strong>
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body2" color="text.secondary">
                                    Developer or freelancer to install, customize, and configure plugins:
                                    often 10–20 hours of work.
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body2" color="text.secondary">
                                    At $60–$80/hr, that&apos;s <strong>$600–$1,600</strong> just to get your site to a
                                    “launchable” state.
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body2" color="text.secondary">
                                    Ongoing plugin renewals, premium add-ons, and maintenance can add another
                                    <strong> $200–$400/year</strong>.
                                </Typography>
                            </li>
                        </ul>

                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 1 }}>
                            2. Custom Modern Stack (My Approach)
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Instead of stacking plugins and templates, I build your site using a modern,
                            performance-focused stack:
                        </Typography>
                        <ul style={{ paddingLeft: '1.2rem', marginTop: 4 }}>
                            <li>
                                <Typography variant="body2" color="text.secondary">
                                    Next.js + React for fast load times and great SEO out of the box.
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body2" color="text.secondary">
                                    MUI as a design system, so future changes stay consistent and efficient.
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body2" color="text.secondary">
                                    Clean, documented code so any junior or self-taught developer can pick it
                                    up later.
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body2" color="text.secondary">
                                    Hosting on platforms like Vercel, with automatic SSL, CI, and strong performance.
                                </Typography>
                            </li>
                        </ul>

                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 1 }}>
                            3. Why Your Site Still Costs More Than a $50 Template
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            The $50 template is just the starting point. What you&apos;re really paying for is:
                        </Typography>
                        <ul style={{ paddingLeft: '1.2rem', marginTop: 4 }}>
                            <li>
                                <Typography variant="body2" color="text.secondary">
                                    Planning your structure, pages, and user flows.
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body2" color="text.secondary">
                                    Designing something that actually fits your brand and goals.
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body2" color="text.secondary">
                                    Implementing, testing, and deploying a site that&apos;s fast, accessible, and secure.
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body2" color="text.secondary">
                                    Setting up hosting, domains, DNS, SSL, analytics, and forms so everything works
                                    end-to-end.
                                </Typography>
                            </li>
                        </ul>

                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 1 }}>
                            4. When Each Option Makes Sense
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <strong>WordPress Template</strong> is fine if:
                        </Typography>
                        <ul style={{ paddingLeft: '1.2rem', marginTop: 4 }}>
                            <li>
                                <Typography variant="body2" color="text.secondary">
                                    You&apos;re very budget-constrained and don&apos;t mind a generic look.
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body2" color="text.secondary">
                                    You already have a trusted WordPress developer on retainer.
                                </Typography>
                            </li>
                        </ul>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            <strong>Custom Modern Build</strong> makes more sense if:
                        </Typography>
                        <ul style={{ paddingLeft: '1.2rem', marginTop: 4 }}>
                            <li>
                                <Typography variant="body2" color="text.secondary">
                                    You care about performance, longevity, and maintainability.
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body2" color="text.secondary">
                                    You want something that&apos;s easy to scale and doesn&apos;t turn into a plugin
                                    maintenance nightmare.
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body2" color="text.secondary">
                                    You&apos;d rather pay for a solid foundation once than patch issues every year.
                                </Typography>
                            </li>
                        </ul>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseBreakdown} sx={{ textTransform: 'none' }}>
                        Close
                    </Button>
                    <Button
                        onClick={() => {
                            handleCloseBreakdown();
                            window.location.href = '/contact';
                        }}
                        variant="contained"
                        color="primary"
                        sx={{ textTransform: 'none' }}
                    >
                        Talk About My Project
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Pricing;
