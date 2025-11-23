'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { motion, Variants } from 'framer-motion';

const MotionPaper = motion(Paper);

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    visible: (custom: number = 0) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.45,
            delay: custom,
            ease: 'easeOut',
        },
    }),
};

const ExperiencesSection = () => {
    return (
        <Box sx={{ py: { xs: 6, md: 10 } }}>
            {/* Section header */}
            <Stack
                spacing={1}
                sx={{ mb: { xs: 4, md: 6 }, maxWidth: 720 }}
            >
                <Typography
                    variant="overline"
                    color="text.secondary"
                    sx={{ letterSpacing: 2, textTransform: 'uppercase' }}
                >
                    Experience & Collaboration
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    What I bring, and what it’s like to work together
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    A mix of frontend engineering, support experience, and long-term thinking —
                    focused on building websites that feel good to use and easy to maintain.
                </Typography>
            </Stack>

            <Grid container spacing={6}>
                {/* ROW 1 — What I Bring to Your Project */}
                <Grid size={{ xs: 12 }}>
                    <MotionPaper
                        elevation={4}
                        sx={{
                            p: { xs: 3, md: 4 },
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            maxWidth: { xs: '100%', md: '80%' },
                        }}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        custom={0}
                        viewport={{ once: true, amount: 0.25 }}
                    >
                        <Stack spacing={2.5}>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                What I bring to your project
                            </Typography>

                            <Typography variant="body1" color="text.secondary">
                                I combine hands-on frontend development with real customer-facing support
                                experience — so the websites I build work well for both your users and your team.
                            </Typography>

                            {/* Experience Grid */}
                            <Grid container spacing={3} sx={{ pt: 1 }}>
                                {/* Column 1 */}
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Stack
                                        spacing={1.25}
                                        sx={{
                                            borderRadius: 2,
                                            p: 2,
                                            bgcolor: (theme) =>
                                                theme.palette.mode === 'dark'
                                                    ? 'rgba(255,255,255,0.04)'
                                                    : 'rgba(0,0,0,0.02)',
                                            height: '100%',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                        }}
                                    >
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            Frontend development
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Built modern React and Next.js features at Shipvista, including secure
                                            payment flows and real-time shipping updates.
                                        </Typography>

                                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                            <Chip label="React" size="small" />
                                            <Chip label="Next.js" size="small" />
                                            <Chip label="Real-time UIs" size="small" />
                                        </Stack>
                                    </Stack>
                                </Grid>

                                {/* Column 2 */}
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Stack
                                        spacing={1.25}
                                        sx={{
                                            borderRadius: 2,
                                            p: 2,
                                            bgcolor: (theme) =>
                                                theme.palette.mode === 'dark'
                                                    ? 'rgba(255,255,255,0.04)'
                                                    : 'rgba(0,0,0,0.02)',
                                            height: '100%',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                        }}
                                    >
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            Communication & support
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            IT Service Desk at Seneca Polytechnic taught me how to explain technical
                                            concepts clearly and stay calm under pressure.
                                        </Typography>

                                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                            <Chip label="Support" size="small" />
                                            <Chip label="Clear communication" size="small" />
                                        </Stack>
                                    </Stack>
                                </Grid>

                                {/* Column 3 */}
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Stack
                                        spacing={1.25}
                                        sx={{
                                            borderRadius: 2,
                                            p: 2,
                                            bgcolor: (theme) =>
                                                theme.palette.mode === 'dark'
                                                    ? 'rgba(255,255,255,0.04)'
                                                    : 'rgba(0,0,0,0.02)',
                                            height: '100%',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                        }}
                                    >
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            Foundation & mindset
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Diploma in Computer Programming plus a people-focused background that makes
                                            collaboration comfortable and straightforward.
                                        </Typography>

                                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                            <Chip label="Seneca College" size="small" />
                                            <Chip label="Problem-solving" size="small" />
                                        </Stack>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Stack>
                    </MotionPaper>
                </Grid>

                {/* ROW 2 — What It’s Like to Work With Me */}
                <Grid size={{ xs: 12 }}>
                    <MotionPaper
                        elevation={4}
                        sx={{
                            p: { xs: 3, md: 4 },
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            maxWidth: { xs: '100%', md: '80%' },
                            ml: { xs: 0, md: 'auto' },
                        }}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        custom={0.15}
                        viewport={{ once: true, amount: 0.25 }}
                    >
                        <Stack spacing={2.5}>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                What it’s like to work with me
                            </Typography>

                            <Typography variant="body1" color="text.secondary">
                                A calm, collaborative process where you always know whatʼs happening and why
                                — with a focus on long-term maintainability.
                            </Typography>

                            {/* Instead of dividers, use soft cards for each point */}
                            <Grid container spacing={2.5} sx={{ pt: 1 }}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Stack
                                        spacing={1}
                                        sx={{
                                            borderRadius: 2,
                                            p: 2,

                                            border: '1px solid',
                                            borderColor: 'divider',
                                        }}
                                    >
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            Clear, honest communication
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            You always know what’s happening, why decisions are made, and what’s
                                            coming next — no guesswork.
                                        </Typography>
                                    </Stack>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Stack
                                        spacing={1}
                                        sx={{
                                            borderRadius: 2,
                                            p: 2,

                                            border: '1px solid',
                                            borderColor: 'divider',
                                        }}
                                    >
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            Calm and easy to work with
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            My support background helps me stay patient and solution-focused, even
                                            when things get complex.
                                        </Typography>
                                    </Stack>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Stack
                                        spacing={1}
                                        sx={{
                                            borderRadius: 2,
                                            p: 2,

                                            border: '1px solid',
                                            borderColor: 'divider',
                                        }}
                                    >
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            Built for the long term
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Clean architecture and modern best practices so your website stays easy
                                            to update years from now.
                                        </Typography>
                                    </Stack>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Stack
                                        spacing={1}
                                        sx={{
                                            borderRadius: 2,
                                            p: 2,

                                            border: '1px solid',
                                            borderColor: 'divider',
                                        }}
                                    >
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            Curiosity that moves projects forward
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            If your project needs new tools or APIs, I lean in and learn quickly —
                                            so your solution stays modern instead of stuck.
                                        </Typography>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Stack>
                    </MotionPaper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ExperiencesSection;
