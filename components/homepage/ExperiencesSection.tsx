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

import CodeIcon from '@mui/icons-material/Code';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ConstructionIcon from '@mui/icons-material/Construction';
import TimelineIcon from '@mui/icons-material/Timeline';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const cardVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 60,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

const ExperiencesSection = ({ contentHeight }: { contentHeight: number }) => {
    return (
        <Box
            id="experienceSection"
            component="section"
            sx={(theme) => ({
                minHeight: contentHeight,
                display: 'flex',
                alignItems: 'center',
                py: { xs: 6, md: 10 },
                px: { xs: 2, md: 4 },
                position: 'relative',
                overflow: 'hidden',
                background:
                    theme.palette.mode === 'dark'
                        ? '#0f172a'
                        : '#f3f4f6',
            })}
        >
            {/* subtle vertical accent line on the left */}
            <Box
                sx={(theme) => ({
                    position: 'absolute',
                    left: '50%',
                    top: 32,
                    bottom: 32,
                    width: 1,
                    opacity: theme.palette.mode === 'dark' ? 0 : 0.08,
                    bgcolor: 'divider',
                    transform: { xs: 'translateX(-50%)', md: 'none' },
                    display: { xs: 'none', md: 'block' },
                })}
            />

            <MotionBox
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                sx={{
                    maxWidth: '90%',
                    width: '100%',
                    mx: 'auto',
                }}
            >
                <Grid
                    container
                    spacing={{ xs: 3, md: 4 }}
                    alignItems="stretch"
                >
                    {/* LEFT COLUMN – Hook + overview */}
                    <Grid
                        size={{ xs: 12, md: 5 }}
                        sx={{ display: 'flex' }}
                    >
                        <MotionPaper
                            variants={cardVariants}
                            elevation={4}
                            sx={(theme) => ({
                                p: { xs: 3, md: 4 },
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor:
                                    theme.palette.mode === 'dark'
                                        ? 'rgba(148,163,184,0.4)'
                                        : 'rgba(148,163,184,0.4)',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2.5,
                            })}
                        >
                            <Stack spacing={1.5}>
                                <Typography
                                    variant="overline"
                                    sx={{
                                        letterSpacing: 2,
                                        textTransform: 'uppercase',
                                        opacity: 0.8,
                                    }}
                                >
                                    Experience & Collaboration
                                </Typography>

                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 800,
                                        lineHeight: 1.25,
                                    }}
                                >
                                    Websites that feel good to use — and easy to look after.
                                </Typography>

                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                >
                                    I blend frontend engineering with real customer-facing support work, so what we
                                    build together is practical, reliable, and comfortable for your team to live with.
                                </Typography>
                            </Stack>

                            {/* credibility chips */}
                            <Stack
                                direction="row"
                                spacing={1}
                                flexWrap="wrap"
                                useFlexGap
                            >
                                <Chip label="React" size="small" />
                                <Chip label="Next.js" size="small" />
                                <Chip label="Real-time UIs" size="small" />
                                <Chip label="Customer support background" size="small" />
                            </Stack>

                            {/* mini process / reassurance block */}
                            <Box
                                sx={(theme) => ({
                                    mt: 1,
                                    p: 2,
                                    borderRadius: 2,
                                    border: '1px dashed',
                                    borderColor:
                                        theme.palette.mode === 'dark'
                                            ? 'rgba(148,163,184,0.6)'
                                            : 'rgba(148,163,184,0.7)',
                                    bgcolor:
                                        theme.palette.mode === 'dark'
                                            ? 'rgba(15,23,42,0.8)'
                                            : 'rgba(239,246,255,0.8)',
                                })}
                            >
                                <Stack spacing={1}>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ fontWeight: 600 }}
                                    >
                                        How I usually help
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Understand your business → ship a clean, modern build → iterate together
                                        based on what&apos;s actually happening with your visitors.
                                    </Typography>
                                </Stack>
                            </Box>
                        </MotionPaper>
                    </Grid>

                    {/* RIGHT COLUMN – Experience & working style cards */}
                    <Grid
                        size={{ xs: 12, md: 7 }}
                        sx={{ display: 'flex' }}
                    >
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3,
                            }}
                        >
                            {/* Top row: what you bring to a project */}
                            <MotionPaper
                                variants={cardVariants}
                                elevation={3}
                                sx={{
                                    p: { xs: 2.5, md: 3 },
                                    borderRadius: 3,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <Stack spacing={1.5}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                        What I bring to your project
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Strong frontend foundations, clear communication, and a mindset that treats
                                        your website as a long-term asset — not a one-off deliverable.
                                    </Typography>
                                </Stack>

                                <Grid
                                    container
                                    spacing={2.5}
                                    sx={{ mt: 1.5 }}
                                >
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Stack
                                            spacing={1}
                                            sx={{
                                                borderRadius: 2,
                                                p: 2,
                                                bgcolor: (theme) =>
                                                    theme.palette.mode === 'dark'
                                                        ? 'rgba(15,23,42,0.9)'
                                                        : 'rgba(248,250,252,0.9)',
                                                height: '100%',
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CodeIcon fontSize="small" />
                                                <Typography variant="subtitle2" fontWeight={600}>
                                                    Frontend development
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Modern React & Next.js builds, including secure flows and real-time
                                                interfaces.
                                            </Typography>
                                        </Stack>
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Stack
                                            spacing={1}
                                            sx={{
                                                borderRadius: 2,
                                                p: 2,
                                                bgcolor: (theme) =>
                                                    theme.palette.mode === 'dark'
                                                        ? 'rgba(15,23,42,0.9)'
                                                        : 'rgba(248,250,252,0.9)',
                                                height: '100%',
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <SupportAgentIcon fontSize="small" />
                                                <Typography variant="subtitle2" fontWeight={600}>
                                                    Communication & support
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Experience on the service desk — staying calm, clear, and patient when
                                                things get busy.
                                            </Typography>
                                        </Stack>
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Stack
                                            spacing={1}
                                            sx={{
                                                borderRadius: 2,
                                                p: 2,
                                                bgcolor: (theme) =>
                                                    theme.palette.mode === 'dark'
                                                        ? 'rgba(15,23,42,0.9)'
                                                        : 'rgba(248,250,252,0.9)',
                                                height: '100%',
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PsychologyAltIcon fontSize="small" />
                                                <Typography variant="subtitle2" fontWeight={600}>
                                                    Foundation & mindset
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Computer programming background plus a people-first approach to
                                                collaboration.
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </MotionPaper>

                            {/* Bottom row: what it's like to work together */}
                            <MotionPaper
                                variants={cardVariants}
                                elevation={3}
                                sx={{
                                    p: { xs: 2.5, md: 3 },
                                    borderRadius: 3,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <Stack spacing={1.5}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                        What it’s like to work with me
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        A calm, collaborative process where you always know what’s happening and why —
                                        with decisions made around your business, not just the code.
                                    </Typography>
                                </Stack>

                                <Grid
                                    container
                                    spacing={2.5}
                                    sx={{ mt: 1.5 }}
                                >
                                    <Grid size={{ xs: 12, sm: 6 }}>
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
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <HandshakeIcon fontSize="small" />
                                                <Typography variant="subtitle2" fontWeight={600}>
                                                    Clear, honest communication
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                You always know what’s happening, why decisions are made, and what’s
                                                coming next — no guesswork.
                                            </Typography>
                                        </Stack>
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6 }}>
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
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <ConstructionIcon fontSize="small" />
                                                <Typography variant="subtitle2" fontWeight={600}>
                                                    Built for the long term
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Clean architecture and modern practices so your site stays easy to
                                                update years from now.
                                            </Typography>
                                        </Stack>
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6 }}>
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
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <TimelineIcon fontSize="small" />
                                                <Typography variant="subtitle2" fontWeight={600}>
                                                    Calm and organized delivery
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Clear steps, realistic timelines, and updates along the way so you never
                                                feel left in the dark.
                                            </Typography>
                                        </Stack>
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6 }}>
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
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PsychologyAltIcon fontSize="small" />
                                                <Typography variant="subtitle2" fontWeight={600}>
                                                    Curiosity that moves projects forward
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                If your project needs new tools or APIs, I lean in and learn quickly —
                                                so your solution keeps up instead of falling behind.
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </MotionPaper>
                        </Box>
                    </Grid>

                    {/* CTA row under the section */}
                    <Grid size={{ xs: 12 }} sx={{ mt: { xs: 3, md: 4 } }}>
                        <BannerCTA />
                    </Grid>
                </Grid>
            </MotionBox>
        </Box>
    );
};

export default ExperiencesSection;
