'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import PageHeader from './PageHeader';
import Button from '@mui/material/Button';

const About = () => {
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
                        title="About Us"
                        subtitle="Professional, warm, and focused on building clean, modern websites that are easy to maintain and scale."
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 10 }}>
                    <Stack spacing={4}>
                        {/* Intro */}
                        <Paper
                            elevation={4}
                            sx={{
                                p: { xs: 3, md: 4 },
                                borderRadius: 3,
                                bgcolor: 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            <Stack spacing={2.5}>
                                <Typography component={"h4"} variant="h5" color="text.primary">
                                    About Me — Professional, Warm, and Client-Focused
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Hi, I'm Danny — a Toronto-based web developer who builds clean, modern websites
                                    that are easy to maintain and even easier to scale.
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    I help businesses, nonprofits, and creators transform outdated, slow, or confusing
                                    websites into fast, secure, and user-friendly experiences. I specialize in modern
                                    frameworks like React, Next.js, Supabase, Python, and Angular — giving
                                    you the right balance of speed, flexibility, and long-term reliability.
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    My approach is simple: I build websites that are clean and well-structured that it is easy to
                                    maintain. You site stays future-proof, readable, and inexpensive to update.
                                </Typography>
                            </Stack>
                        </Paper>

                        <Paper
                            elevation={4}
                            sx={{
                                p: { xs: 3, md: 4 },
                                borderRadius: 3,
                                bgcolor: 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            <Stack spacing={2.5}>
                                <Typography component={"h4"} variant="h5" color="text.primary">
                                    What Working With Me Is Like
                                </Typography>

                                <Box>
                                    <Typography component={"h5"} variant="subtitle1" fontWeight={600}>
                                        I’m easy to work with & communicate clearly
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        I’ve supported students and faculty at Seneca Polytechnic, worked in agile teams,
                                        and collaborated with designers and backend engineers. You’ll always know what’s
                                        happening and what to expect.
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography component={"h5"} variant="subtitle1" fontWeight={600}>
                                        I turn complex requirements into simple, user-friendly solutions
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Whether it was secure payment flows at Shipvista or real-time gameplay in my
                                        Pokémon project, I’m comfortable solving hard problems and making them
                                        understandable for clients.
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography component={"h5"} variant="subtitle1" fontWeight={600}>
                                        I care about long-term maintainability
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        I don’t just build something that “works for now.” I focus on fast load times,
                                        modern best practices, clean architecture, and patterns that stay easy to
                                        maintain years from now.
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography component={"h5"} variant="subtitle1" fontWeight={600}>
                                        I combine practical industry experience with creative projects
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        I’ve worked professionally on real shipping and payment systems and personally
                                        built full-stack apps with multiplayer logic, scalable APIs, secure
                                        authentication, and high-quality UI design. That balance lets me think like an
                                        engineer and a designer.
                                    </Typography>
                                </Box>
                            </Stack>
                        </Paper>

                        {/* Background + socials */}
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Paper
                                    elevation={3}
                                    sx={{
                                        p: { xs: 3, md: 4 },
                                        borderRadius: 3,
                                        height: '100%',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                    }}
                                >
                                    <Stack spacing={2}>
                                        <Typography component={"h5"} variant="h6" color="text.primary">
                                            My Background
                                        </Typography>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                Professional Experience
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Junior Developer @ Shipvista (2021–2022)</strong> — Built secure
                                                UI flows, payment interfaces, real-time shipping updates, and modern React
                                                components. Collaborated with backend teams and handled code reviews
                                                using Azure DevOps.
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" mt={1}>
                                                <strong>IT Service Desk @ Seneca Polytechnic (2019)</strong> — Helped
                                                hundreds of students and faculty with tech issues, building strong
                                                communication skills and the ability to explain technical concepts in
                                                plain language.
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                Education
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Computer Programming Diploma — Seneca Polytechnic
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Paper>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <Paper
                                    elevation={3}
                                    sx={{
                                        p: { xs: 3, md: 4 },
                                        borderRadius: 3,
                                        height: '100%',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                    }}
                                >
                                    <Stack spacing={2}>
                                        <Typography variant="h6" color="text.primary">
                                            Socials & Portfolio
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Follow along or reach out on any of these platforms:
                                        </Typography>
                                        <Stack spacing={1}>
                                            <Typography variant="body2" color='text.primary'>
                                                Twitter/X:{' '}
                                                <Link href="https://x.com/BaoGiaNguyen" target="_blank" rel="noopener" color='text.primary'>
                                                    @BaoGiaNguyen
                                                </Link>
                                            </Typography>
                                            <Typography variant="body2" color='text.primary'>
                                                LinkedIn:{' '}
                                                <Link
                                                    href="https://www.linkedin.com/in/gia-bao-danny-nguyen"
                                                    target="_blank"
                                                    rel="noopener"
                                                    color='text.primary'
                                                >
                                                    Gia Bao (Danny) Nguyen
                                                </Link>
                                            </Typography>
                                            <Typography variant="body2" color='text.primary'>
                                                Portfolio:{' '}
                                                <Link
                                                    href="https://portfolio-black-two-97.vercel.app"
                                                    target="_blank"
                                                    rel="noopener"
                                                    color='text.primary'
                                                >
                                                    View my work
                                                </Link>
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Paper>
                            </Grid>
                        </Grid>
                        {/* action button */}
                        <Grid size={{ xs: 12, md: 10 }} sx={{ mt: 5 }}>
                            <Paper elevation={3} sx={{ borderRadius: 3, p: { xs: 2.5, md: 3 } }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={{ xs: 12, md: 8 }} >
                                        <Typography component={"h4"} variant="h6" sx={{ fontWeight: 800 }}>
                                            Want to learn more about who I am and how I can help your business?
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            Contact us for a free consultation and let’s discuss your business needs.
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
                                            Get in Contact
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default About;