'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Image from 'next/image';
import { motion } from 'framer-motion';

const AboutSection = () => {
    return (
        <Box sx={{ py: { xs: 6, md: 10 } }}>
            <Grid container spacing={4} alignItems="center">
                {/* Profile picture */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}>
                        <Paper
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                textAlign: 'center',
                                border: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            <Box
                                sx={{
                                    width: { xs: 180, md: 220 },
                                    height: { xs: 180, md: 220 },
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    mx: 'auto',
                                    mb: 2,
                                    border: '3px solid',
                                    borderColor: 'primary.main',
                                    boxShadow: (theme) =>
                                        theme.palette.mode === 'dark'
                                            ? '0 18px 40px rgba(0,0,0,0.7)'
                                            : '0 18px 40px rgba(15,23,42,0.16)',
                                }}
                            >
                                <Image
                                    src="/profilePicture.jpg"
                                    alt="Danny Nguyen, web developer based in Toronto"
                                    width={220}
                                    height={220}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </Box>

                            <Typography variant="h5" fontWeight={700}>
                                Gia Bao (Danny) Nguyen
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Web Developer • Frontend & Full-Stack
                            </Typography>

                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{ mt: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}
                            >
                                <Box
                                    sx={{
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: 999,
                                        bgcolor: 'primary.main',
                                        color: 'primary.contrastText',
                                        fontSize: 12,
                                        fontWeight: 600,
                                    }}
                                >
                                    Toronto, ON • Local & remote
                                </Box>
                                <Box
                                    sx={{
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: 999,
                                        bgcolor: (theme) =>
                                            theme.palette.mode === 'dark'
                                                ? 'rgba(148,163,184,0.2)'
                                                : 'rgba(15,23,42,0.04)',
                                        fontSize: 12,
                                        fontWeight: 500,
                                        color: 'text.secondary',
                                    }}
                                >
                                    Strong communication • Curious & people-focused
                                </Box>
                            </Stack>
                        </Paper>
                    </motion.div>
                </Grid>

                {/* Personal touch / summary */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}>
                        <Paper
                            sx={{
                                p: { xs: 3, md: 4 },
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            <Stack spacing={2.25}>
                                <Typography variant="h4" color="text.primary">
                                    A Little About Me
                                </Typography>

                                <Typography variant="body1" color="text.secondary">
                                    Hi, I&apos;m Danny — a Toronto-based web developer who builds clean, modern
                                    websites that are easy to maintain and simple to scale as your business grows.
                                    Outside of work, I share my home with two cats and a dog, enjoy gaming with
                                    friends, and genuinely like meeting new people.
                                </Typography>

                                <Typography variant="body1" color="text.secondary">
                                    I&apos;ve spent time in both customer-facing roles and technical roles —
                                    including IT support at Seneca Polytechnic and frontend development at a
                                    shipping platform. That mix means I&apos;m just as comfortable explaining options
                                    in plain language as I am digging into code. Talking to me is easy: no buzzwords,
                                    no pressure, just honest guidance about what will actually help your business.
                                </Typography>

                                <Typography variant="body1" color="text.secondary">
                                    I care a lot about long-term maintainability. I focus on fast load times,
                                    modern best practices, and clean architecture so your site stays easy to update
                                    — whether you keep working with me or bring in another developer later.
                                </Typography>

                                <Stack direction="row" spacing={1.5} sx={{ pt: 1, flexWrap: 'wrap' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        • Customer service & IT support background
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        • Frontend & full-stack project experience
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        • Curious, patient, and detail-oriented
                                    </Typography>
                                </Stack>

                                <Button
                                    variant="outlined"
                                    size="large"
                                    href="/about"
                                    color="primary"
                                    sx={{ alignSelf: 'flex-start', textTransform: 'none', borderRadius: 2 }}
                                >
                                    Read the full About page
                                </Button>
                            </Stack>
                        </Paper>
                    </motion.div>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AboutSection;
