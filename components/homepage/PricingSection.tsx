'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LoopIcon from '@mui/icons-material/Loop';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion, Variants } from 'framer-motion';

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.55,
            ease: 'easeOut',
            staggerChildren: 0.12,
        },
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 14, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.45,
            ease: 'easeOut',
        },
    },
};

const PricingSection = () => {
    return (
        <Box sx={{ py: { xs: 6, md: 10 } }}>
            {/* Section header */}
            <Stack spacing={1.2} sx={{ mb: { xs: 4, md: 5 }, maxWidth: 720 }}>
                <Typography
                    variant="overline"
                    color="text.secondary"
                    sx={{ letterSpacing: 2, textTransform: 'uppercase' }}
                >
                    Pricing Overview
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    Simple pricing, two ways to work together
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Choose between a one-time build or a fully managed subscription — both built
                    on the same modern stack, with clear expectations and no hidden surprises.
                </Typography>
            </Stack>

            {/* Animated container (no component=Grid here) */}
            <MotionBox
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
            >
                <Grid container spacing={3}>
                    {/* Lump-sum card */}
                    <Grid size={{ xs: 12, md: 6 }} >
                        <MotionPaper
                            elevation={4}
                            variants={cardVariants}
                            whileHover={{
                                y: -6,
                                boxShadow: '0 18px 40px rgba(15,23,42,0.22)',
                            }}
                            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                            sx={(theme) => ({
                                borderRadius: 3,
                                p: { xs: 3, md: 4 },
                                height: '100%',
                                border: '1px solid',
                                borderColor: 'divider',
                                position: 'relative',
                                background:
                                    theme.palette.mode === 'dark'
                                        ? 'linear-gradient(135deg,#020617,#020617,#020617)'
                                        : 'linear-gradient(135deg,#ffffff,#f9fafb)',
                            })}
                        >
                            <Chip
                                label="One-time build"
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
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                    Lump-Sum Website Build
                                </Typography>

                                <Stack direction="row" spacing={1} alignItems="baseline">
                                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                        $1,600
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        one-time • up to 5 pages
                                    </Typography>
                                </Stack>

                                <Typography variant="body2" color="text.secondary">
                                    40 hours × $40/hr — ideal if you want a professional build with predictable
                                    cost and already have (or plan to hire) someone to maintain the site later.
                                </Typography>

                                <Stack spacing={0.5} sx={{ mt: 1 }}>
                                    <Typography component={'h6'} variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        You get:
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        • Responsive, modern design tailored to your brand
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        • Deployment, DNS, and SSL fully set up for you
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        • Clean, documented codebase for future developers
                                    </Typography>
                                </Stack>

                                {/* mini “perfect if” highlight */}
                                <Box
                                    mt={2}
                                    sx={{
                                        p: 1.75,
                                        borderRadius: 2,
                                        bgcolor: 'action.hover',
                                    }}
                                >
                                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                        <CheckCircleOutlineIcon fontSize="small" />
                                        <Box>
                                            <Typography component={'h6'} variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                Perfect if you:
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                • Prefer a clear, one-time project cost
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                • Have in-house or trusted technical help
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                • Want a solid foundation you can grow on
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Box>

                                <Button
                                    variant="outlined"
                                    size="large"
                                    href="/pricing"
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{ textTransform: 'none', mt: 1, alignSelf: 'flex-start' }}
                                >
                                    See full pricing details
                                </Button>
                            </Stack>
                        </MotionPaper>
                    </Grid>

                    {/* Subscription card */}
                    <Grid size={{ xs: 12, md: 6 }} >
                        <MotionPaper
                            elevation={6}
                            variants={cardVariants}
                            whileHover={{
                                y: -6,
                                boxShadow: '0 22px 50px rgba(15,23,42,0.28)',
                                scale: 1.01,
                            }}
                            transition={{ type: 'spring', stiffness: 230, damping: 24 }}
                            sx={(theme) => ({
                                borderRadius: 3,
                                p: { xs: 3, md: 4 },
                                height: '100%',
                                border: '2px solid',
                                borderColor: 'primary.main',
                                position: 'relative',
                                background:
                                    theme.palette.mode === 'dark'
                                        ? 'linear-gradient(135deg,#020617,#0b1120)'
                                        : 'linear-gradient(135deg,#e0f2fe,#ffffff)',
                            })}
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

                            <Stack spacing={2}>
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                    Subscription Website Plan
                                </Typography>

                                <Stack spacing={0.5}>
                                    <Stack direction="row" spacing={1} alignItems="baseline">
                                        <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                            $140
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            / month
                                        </Typography>
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary">
                                        + Hosting (~$25/month) → around $165/month, $0 upfront.
                                    </Typography>
                                </Stack>

                                <Typography variant="body2" color="text.secondary">
                                    Website-as-a-Service — the tech, security, and updates are fully managed for you,
                                    so you can focus on running your business.
                                </Typography>

                                <Stack spacing={0.5} sx={{ mt: 1 }}>
                                    <Typography component={'h6'} variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        You get:
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        • Full custom build with no upfront fee
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        • 24/7 support & unlimited small updates
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        • Security patches, backups, and uptime monitoring
                                    </Typography>
                                </Stack>

                                <Box
                                    mt={2}
                                    sx={{
                                        p: 1.75,
                                        borderRadius: 2,
                                        bgcolor: 'action.hover',
                                    }}
                                >
                                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                        <LoopIcon fontSize="small" />
                                        <Box>
                                            <Typography component={'h6'} variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                Perfect if you:
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                • Want a long-term partner, not just a one-off project
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                • Never want to worry about tech or security
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                • Prefer a predictable monthly cost
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Box>

                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={1.5}
                                    sx={{ mt: 1 }}
                                    alignItems={{ xs: 'stretch', sm: 'center' }}
                                >
                                    <Button
                                        variant="contained"
                                        size="large"
                                        color="primary"
                                        fullWidth
                                        startIcon={<MailOutlineIcon />}
                                        href="/contact"
                                        sx={{ textTransform: 'none', boxShadow: 'none' }}
                                    >
                                        Talk about the subscription plan
                                    </Button>
                                    <Button
                                        variant="text"
                                        size="medium"
                                        href="/pricing"
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{ textTransform: 'none', alignSelf: 'flex-start' }}
                                    >
                                        Compare plans in detail
                                    </Button>
                                </Stack>
                            </Stack>
                        </MotionPaper>
                    </Grid>
                </Grid>
            </MotionBox>
        </Box>
    );
};

export default PricingSection;
