'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Image from 'next/image';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const benefits = [
    'No more website headaches',
    'Done-for-you updates',
    'Built to grow with you',
];

const SectionHeader = ({ contentHeight }: { contentHeight: number }) => {
    return (
        <Box
            component="section"
            sx={(theme) => ({
                position: 'relative',
                minHeight: contentHeight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                py: { xs: 8, md: 10 },
                px: { xs: 2, md: 4 },
            })}
        >
            {/* Decorative background elements */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.06,
                    backgroundSize: '18px 18px',
                    pointerEvents: 'none',
                }}
            />
            <Box
                sx={(theme) => ({
                    position: 'absolute',
                    top: { xs: 40, md: 80 },
                    right: { xs: -40, md: -20 },
                    width: 260,
                    height: 260,
                    borderRadius: '50%',
                    filter: 'blur(40px)',

                    pointerEvents: 'none',
                })}
            />
            <Box
                sx={(theme) => ({
                    position: 'absolute',
                    bottom: { xs: -40, md: -20 },
                    left: { xs: -40, md: -10 },
                    width: 320,
                    height: 320,
                    borderRadius: '50%',
                    filter: 'blur(50px)',

                    pointerEvents: 'none',
                })}
            />

            <Box
                sx={{
                    position: 'relative',
                    maxWidth: '1200px',
                    width: '100%',
                    mx: 'auto',
                    zIndex: 1,
                }}
            >
                <Grid
                    container
                    spacing={{ xs: 6, md: 8 }}
                    alignItems="center"
                >
                    {/* Left: content */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <MotionBox
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            viewport={{ once: true, amount: 0.4 }}
                        >
                            <Stack spacing={3}>
                                <Stack spacing={1.5}>
                                    {/* Badge / tag */}
                                    <Chip
                                        label="Built for busy business owners"
                                        size="small"
                                        sx={(theme) => ({
                                            alignSelf: 'flex-start',
                                            borderRadius: 999,
                                            fontSize: 11,
                                            textTransform: 'uppercase',
                                            letterSpacing: 1.5,
                                            borderColor:
                                                theme.palette.mode === 'dark'
                                                    ? 'rgba(59,130,246,0.6)'
                                                    : 'rgba(37,99,235,0.4)',
                                            bgcolor:
                                                theme.palette.mode === 'dark'
                                                    ? 'rgba(37,99,235,0.16)'
                                                    : 'rgba(59,130,246,0.08)',
                                            color: 'text.primary',
                                        })}
                                        variant="outlined"
                                    />

                                    <Typography
                                        variant="h3"
                                        sx={{
                                            fontWeight: 800,
                                            fontSize: { xs: 32, md: 40, lg: 46 },
                                            lineHeight: 1.15,
                                        }}
                                    >
                                        Nice Guy {' '}
                                        <Box
                                            component="span"
                                            sx={(theme) => ({
                                                backgroundImage:
                                                    theme.palette.mode === 'dark'
                                                        ? 'linear-gradient(to right, #38bdf8, #a855f7)'
                                                        : 'linear-gradient(to right, #2563eb, #22c55e)',
                                                backgroundClip: 'text',
                                                WebkitBackgroundClip: 'text',
                                                color: 'transparent',
                                            })}
                                        >
                                            Services
                                        </Box>
                                    </Typography>
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            fontWeight: 800,
                                            fontSize: { xs: 32, md: 40, lg: 46 },
                                            lineHeight: 1.15,
                                        }}
                                    >
                                        A Web Development Company
                                    </Typography>
                                    <Stack spacing={0.75}>
                                        <Typography
                                            component="h2"
                                            variant="subtitle1"
                                            color="text.secondary"
                                            sx={{
                                                textTransform: 'uppercase',
                                                letterSpacing: 2,
                                                fontWeight: 600,
                                            }}
                                        >
                                            Your website, fully managed
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            color="text.secondary"
                                            sx={{ maxWidth: 520 }}
                                        >
                                            I handle the technical side with clean code, reliable updates, and
                                            long-term care — giving you peace of mind and more time to focus on
                                            your business goals.
                                        </Typography>
                                    </Stack>
                                </Stack>

                                {/* Benefit chips */}
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    flexWrap="wrap"
                                    useFlexGap
                                >
                                    {benefits.map((benefit, index) => (
                                        <Chip
                                            key={benefit}
                                            label={benefit}
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                borderRadius: 2,
                                                px: 1.5,
                                                py: 0.25,
                                                fontSize: 12,
                                                opacity: 0,
                                                transform: 'translateY(8px)',
                                                animation: `fadeUp 0.4s ease-out forwards`,
                                                animationDelay: `${0.2 + index * 0.08}s`,
                                                '@keyframes fadeUp': {
                                                    to: {
                                                        opacity: 1,
                                                        transform: 'translateY(0)',
                                                    },
                                                },
                                            }}
                                        />
                                    ))}
                                </Stack>

                                {/* CTAs */}
                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={1.5}
                                    sx={{ pt: 1 }}
                                >
                                    <Button
                                        variant="contained"
                                        size="large"
                                        color="primary"
                                        startIcon={<MailOutlineIcon />}
                                        href="/contact"
                                        sx={{
                                            textTransform: 'none',
                                            boxShadow: 'none',
                                            borderRadius: 999,
                                            px: 3,
                                        }}
                                    >
                                        Try a free consultation
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        size="large"
                                        href="/pricing"
                                        sx={{
                                            textTransform: 'none',
                                            borderRadius: 999,
                                            px: 3,
                                        }}
                                    >
                                        See pricing options
                                    </Button>
                                </Stack>
                            </Stack>
                        </MotionBox>
                    </Grid>

                    {/* Right: hero image + stat card */}
                    <Grid size={{ xs: 12, md: 6 }} >
                        <MotionBox
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
                            viewport={{ once: true, amount: 0.4 }}
                            sx={{
                                position: 'relative',
                                height: { xs: 320, sm: 380, md: 600 },
                                width: 800
                            }}
                        >
                            <Box
                                sx={(theme) => ({
                                    position: 'relative',
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    bgcolor: 'background.paper',
                                })}
                            >
                                {/* Overlay gradient */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        inset: 0,
                                        zIndex: 1,
                                    }}
                                />

                                {/* Hero image */}
                                <Image
                                    src="/imageheader.png"
                                    alt="Professional freelance web developer workspace with laptop, coffee, cat and dog."
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    priority
                                />

                                {/* Floating stat card */}
                                <MotionBox
                                    initial={{ y: 8, opacity: 0 }}
                                    animate={{ y: [-4, 4, -4], opacity: 1 }}
                                    transition={{
                                        duration: 5,
                                        repeat: Infinity,
                                        repeatType: 'mirror',
                                        ease: 'easeInOut',
                                        delay: 0.4,
                                    }}
                                    sx={(theme) => ({
                                        position: 'absolute',
                                        left: { xs: 16, md: 20 },
                                        right: { xs: 16, md: 'auto' },
                                        bottom: { xs: 16, md: 20 },
                                        maxWidth: 320,
                                        zIndex: 2,
                                    })}
                                >
                                    <Paper
                                        elevation={4}
                                        sx={{
                                            borderRadius: 3,
                                            p: 2,
                                            backdropFilter: 'blur(12px)',
                                            border: '1px solid',
                                            borderColor: 'rgba(148,163,184,0.4)',
                                        }}
                                    >
                                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                            <Box
                                                sx={(theme) => ({
                                                    p: 1,
                                                    borderRadius: 2,
                                                    color: 'text.primary',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                })}
                                            >
                                                <AccessTimeIcon fontSize="small" />
                                            </Box>
                                            <Box>
                                                <Typography
                                                    variant="body2"
                                                    sx={{ fontWeight: 700, mb: 0.3 }}
                                                    color="text.primary"
                                                >
                                                    Save hours every week
                                                </Typography>
                                                <Typography variant="caption" color="text.primary">
                                                    No more DIY fixes or plugin drama.
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Paper>
                                </MotionBox>


                            </Box>
                        </MotionBox>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default SectionHeader;
