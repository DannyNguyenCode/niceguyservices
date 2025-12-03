'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { motion, Variants } from 'framer-motion';
import BannerCTA from './BannerCTA';

const MotionPaper = motion(Paper);

const cardVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 80,
    },
    visible: (delay: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.75,
            delay,
            ease: [0.16, 1, 0.3, 1],
        },
    }),
};

const ExperiencesSection = ({ contentHeight }: { contentHeight: number }) => {
    return (
        <Box
            id="experienceSection"
            sx={{
                minHeight: contentHeight,
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <Grid
                container
                spacing={1}
                alignItems="stretch" // make items in each row same height
            >
                {/* ROW 1 — left text card */}
                <Grid
                    size={{ xs: 12, md: 6 }}
                    sx={{
                        display: 'flex',
                    }}
                >
                    <MotionPaper
                        elevation={4}
                        sx={{
                            p: { xs: 3, md: 4 },
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            width: '100%',
                            display: 'flex',     // allows content to stretch
                        }}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        custom={0}
                        viewport={{ once: true, amount: 0.25 }}
                    >
                        <Stack spacing={2} sx={{ flex: 1 }}>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                What I bring to your project
                            </Typography>

                            <Typography variant="body1" color="text.secondary">
                                I combine hands-on frontend development with real customer-facing support
                                experience — so the websites I build work well for both your users and your team.
                            </Typography>
                        </Stack>
                    </MotionPaper>
                </Grid>

                {/* ROW 1 — right experience grid */}
                <Grid
                    size={{ xs: 12, md: 6 }}
                    sx={{
                        display: 'flex',
                    }}
                >
                    <MotionPaper
                        elevation={4}
                        sx={{
                            p: { xs: 3, md: 4 },
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            width: '100%',
                            display: 'flex',
                        }}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        custom={0.15}
                        viewport={{ once: true, amount: 0.25 }}
                    >
                        <Grid
                            container
                            spacing={3}
                            sx={{ flex: 1 }}
                            alignItems="stretch"
                        >
                            {/* Column 1 */}
                            <Grid
                                size={{ xs: 12, md: 6 }}
                                sx={{ display: 'flex' }}
                            >
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
                            <Grid
                                size={{ xs: 12, md: 6 }}
                                sx={{ display: 'flex' }}
                            >
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
                            <Grid
                                size={{ xs: 12, md: 6 }}
                                sx={{ display: 'flex' }}
                            >
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
                    </MotionPaper>
                </Grid>

                {/* ROW 2 — left text card */}
                <Grid
                    size={{ xs: 12, md: 6 }}
                    sx={{
                        display: 'flex',
                    }}
                >
                    <MotionPaper
                        elevation={4}
                        sx={{
                            p: { xs: 3, md: 4 },
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            width: '100%',
                            display: 'flex',
                        }}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        custom={0.3}
                        viewport={{ once: true, amount: 0.25 }}
                    >
                        <Stack spacing={2.5} sx={{ flex: 1 }}>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                What it’s like to work with me
                            </Typography>

                            <Typography variant="body1" color="text.secondary">
                                A calm, collaborative process where you always know whatʼs happening and why —
                                with a focus on long-term maintainability.
                            </Typography>
                        </Stack>
                    </MotionPaper>
                </Grid>

                {/* ROW 2 — right detail cards */}
                <Grid
                    size={{ xs: 12, md: 6 }}
                    sx={{
                        display: 'flex',
                    }}
                >
                    <MotionPaper
                        elevation={4}
                        sx={{
                            p: { xs: 3, md: 4 },
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            width: '100%',
                            display: 'flex',
                        }}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        custom={0.45}
                        viewport={{ once: true, amount: 0.25 }}
                    >
                        <Grid
                            container
                            spacing={2.5}
                            sx={{ pt: 1, flex: 1 }}
                            alignItems="stretch"
                        >
                            <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
                                <Stack
                                    spacing={1}
                                    sx={{
                                        borderRadius: 2,
                                        p: 2,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        height: '100%',
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

                            <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
                                <Stack
                                    spacing={1}
                                    sx={{
                                        borderRadius: 2,
                                        p: 2,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        height: '100%',
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

                            <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
                                <Stack
                                    spacing={1}
                                    sx={{
                                        borderRadius: 2,
                                        p: 2,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        height: '100%',
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

                            <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
                                <Stack
                                    spacing={1}
                                    sx={{
                                        borderRadius: 2,
                                        p: 2,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        height: '100%',
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
                    </MotionPaper>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <BannerCTA />
                </Grid>
            </Grid>
        </Box>
    );
};

export default ExperiencesSection;
