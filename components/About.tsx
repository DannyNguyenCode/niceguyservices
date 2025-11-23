'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Image from 'next/image';
import PageHeader from './PageHeader';

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
                        {/* Who you'll work with – photo + quick intro */}
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
                            <Grid container spacing={3} alignItems="center">
                                <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                                    <Box
                                        sx={{
                                            width: { xs: 180, md: 220 },
                                            height: { xs: 180, md: 220 },
                                            borderRadius: '50%',
                                            overflow: 'hidden',
                                            mx: { xs: 'auto', md: 0 },
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
                                            width={175}
                                            height={175}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12, md: 8 }}>
                                    <Stack spacing={1.5}>
                                        <Typography component="h4" variant="h5" color="text.primary" sx={{ fontWeight: 700 }}>
                                            Who you&apos;ll be working with
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            Hi, I&apos;m Danny — a Toronto-based web developer who builds clean, modern websites
                                            that are easy to maintain and simple to scale as your business grows.
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            Outside of work, I&apos;m a big animal lover — I share my home with{' '}
                                            <strong>two cats and a dog</strong> that I care for and love. I enjoy playing games
                                            with friends and genuinely like talking to people. If there&apos;s something I don&apos;t
                                            know much about, I tend to lean in rather than back away — learning new things is
                                            something that immediately engages me.
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            I&apos;ve spent years in both customer-facing roles and technical roles, which means I&apos;m just
                                            as comfortable explaining options in plain language as I am digging into code.
                                            Talking to me is easy — no buzzwords, no pressure, just honest guidance about what
                                            will actually help your business.
                                        </Typography>
                                        <Stack direction="row" spacing={1.5} sx={{ mt: 1, flexWrap: 'wrap' }}>
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
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Paper>

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
                                <Typography component={'h4'} variant="h5" color="text.primary">
                                    About Me — Professional, Warm, and Client-Focused
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    I help businesses, nonprofits, and creators transform outdated, slow, or confusing
                                    websites into fast, secure, and user-friendly experiences. I specialize in modern
                                    frameworks like React, Next.js, Supabase, Python, and Angular — giving you the
                                    right balance of speed, flexibility, and long-term reliability.
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    My approach is simple: I build websites that are clean and well-structured so they&apos;re easy
                                    to maintain. Your site stays future-proof, readable, and inexpensive to update —
                                    whether I keep working with you or you bring in another developer later.
                                </Typography>
                            </Stack>
                        </Paper>

                        {/* What working with me is like */}
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
                                <Typography component={'h4'} variant="h5" color="text.primary">
                                    What Working With Me Is Like
                                </Typography>

                                <Box>
                                    <Typography component={'h5'} variant="subtitle1" fontWeight={600}>
                                        I’m easy to work with & communicate clearly
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        I have around <strong>2 years of customer service experience</strong>, both front-facing
                                        and over the phone, as well as time spent supporting students and faculty at
                                        Seneca Polytechnic. That taught me how to listen, stay calm under pressure, and
                                        explain technical concepts in plain language. You’ll always know what’s happening,
                                        why decisions are being made, and what to expect next.
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography component={'h5'} variant="subtitle1" fontWeight={600}>
                                        I turn complex requirements into simple, user-friendly solutions
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Whether it was secure payment flows at Shipvista — a shipping company providing
                                        labels and real-time rates — or real-time gameplay logic in my Pokémon project,
                                        I’m comfortable solving hard problems and turning them into experiences your
                                        customers actually enjoy using.
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography component={'h5'} variant="subtitle1" fontWeight={600}>
                                        I care about long-term maintainability
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        I don’t just build something that “works for now.” I focus on fast load times,
                                        modern best practices, clean architecture, and patterns that stay easy to
                                        maintain years from now — even if another developer takes over.
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography component={'h5'} variant="subtitle1" fontWeight={600}>
                                        Curiosity drives how I work
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        I like to learn. When your project needs something I haven&apos;t seen before — a new tool,
                                        API, or workflow — I get genuinely excited to dig in, understand it, and implement
                                        it properly. That curiosity helps your business benefit from modern solutions,
                                        not just the “safe old way” of doing things.
                                    </Typography>
                                </Box>
                            </Stack>
                        </Paper>

                        {/* Team-style card + socials */}
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 7 }}>
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
                                    <Stack spacing={2.5}>
                                        <Typography component="h5" variant="h6" color="text.primary">
                                            Who&apos;s on the team?
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Right now, you&apos;ll be working directly with me — no account managers, no
                                            hand-offs, no getting lost in a big agency pipeline. As the work grows, the
                                            process and codebase are set up so additional developers or designers can be
                                            brought in smoothly.
                                        </Typography>

                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                borderRadius: 3,
                                                p: 2.5,
                                                display: 'flex',
                                                flexDirection: { xs: 'column', sm: 'row' },
                                                alignItems: { xs: 'flex-start', sm: 'center' },
                                                gap: 2,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 72,
                                                    height: 72,
                                                    borderRadius: '50%',
                                                    overflow: 'hidden',
                                                    border: '2px solid',
                                                    borderColor: 'primary.main',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <Image
                                                    src="/profilePicture.jpg"
                                                    alt="Danny Nguyen profile"
                                                    width={75}
                                                    height={75}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            </Box>
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                                    Gia Bao (Danny) Nguyen
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Web Developer • Frontend & Full-Stack
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ mt: 0.5 }}
                                                >
                                                    Diploma in Computer Programming from Seneca College. Experience in
                                                    customer service, IT support, and front-end development for a
                                                    shipping platform.
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ mt: 0.5 }}
                                                >
                                                    Loves: two cats, one dog, gaming with friends, learning new tech, and
                                                    meeting new people.
                                                </Typography>
                                                <Stack direction="row" spacing={1.5} sx={{ mt: 1.5, flexWrap: 'wrap' }}>
                                                    <Link
                                                        href="https://x.com/BaoGiaNguyen"
                                                        target="_blank"
                                                        rel="noopener"
                                                        underline="hover"
                                                        color="primary"
                                                        variant="body2"
                                                    >
                                                        X / Twitter
                                                    </Link>
                                                    <Link
                                                        href="https://www.linkedin.com/in/gia-bao-danny-nguyen"
                                                        target="_blank"
                                                        rel="noopener"
                                                        underline="hover"
                                                        color="primary"
                                                        variant="body2"
                                                    >
                                                        LinkedIn
                                                    </Link>
                                                    <Link
                                                        href="https://portfolio-black-two-97.vercel.app"
                                                        target="_blank"
                                                        rel="noopener"
                                                        underline="hover"
                                                        color="primary"
                                                        variant="body2"
                                                    >
                                                        Portfolio
                                                    </Link>
                                                </Stack>
                                            </Box>
                                        </Paper>
                                    </Stack>
                                </Paper>
                            </Grid>

                            <Grid size={{ xs: 12, md: 5 }}>
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
                                            Meet in person (Toronto)
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            If you&apos;re local to the GTA, I&apos;m happy to meet in person for a project
                                            kickoff or strategy session. We can pick a convenient café or public
                                            workspace in Toronto and walk through your goals together.
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Just mention that you&apos;d like to meet in person when you contact me, and I&apos;ll
                                            suggest a few options and times.
                                        </Typography>

                                        <Box
                                            sx={{
                                                mt: 2,
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                height: 220,
                                            }}
                                        >
                                            <Box
                                                component="iframe"
                                                title="Toronto Meeting Area"
                                                src="https://www.google.com/maps?q=Toronto,%20ON&output=embed"
                                                loading="lazy"
                                                style={{
                                                    border: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                }}
                                            />
                                        </Box>
                                    </Stack>
                                </Paper>
                            </Grid>
                        </Grid>

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
                                        <Typography component={'h5'} variant="h6" color="text.primary">
                                            My Background
                                        </Typography>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                Professional Experience
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Junior Frontend Developer @ Shipvista (1 year)</strong> — Built secure
                                                UI flows, payment interfaces, real-time shipping updates, and modern React
                                                components for a shipping label platform. Collaborated with backend teams and
                                                handled code reviews using Azure DevOps.
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" mt={1}>
                                                <strong>Customer Service & IT Support (~2 years)</strong> — Including IT
                                                Service Desk at Seneca Polytechnic, helping hundreds of students and faculty
                                                with tech issues. These roles strengthened my communication, patience, and
                                                ability to explain technical concepts clearly over the phone and in person.
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                Education
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Diploma in Computer Programming — Seneca College
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
                                            <Typography variant="body2" color="text.primary">
                                                X / Twitter:{' '}
                                                <Link
                                                    href="https://x.com/BaoGiaNguyen"
                                                    target="_blank"
                                                    rel="noopener"
                                                    color="text.primary"
                                                >
                                                    @BaoGiaNguyen
                                                </Link>
                                            </Typography>
                                            <Typography variant="body2" color="text.primary">
                                                LinkedIn:{' '}
                                                <Link
                                                    href="https://www.linkedin.com/in/gia-bao-danny-nguyen"
                                                    target="_blank"
                                                    rel="noopener"
                                                    color="text.primary"
                                                >
                                                    Gia Bao (Danny) Nguyen
                                                </Link>
                                            </Typography>
                                            <Typography variant="body2" color="text.primary">
                                                Portfolio:{' '}
                                                <Link
                                                    href="https://portfolio-black-two-97.vercel.app"
                                                    target="_blank"
                                                    rel="noopener"
                                                    color="text.primary"
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
                                    <Grid size={{ xs: 12, md: 8 }}>
                                        <Typography component={'h4'} variant="h6" sx={{ fontWeight: 800 }}>
                                            Want to talk through your project?
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            Reach out for a free consultation. We can start over email, hop on a call,
                                            or — if you&apos;re local to Toronto — set up a quick in-person chat.
                                        </Typography>
                                    </Grid>

                                    <Grid
                                        size={{ xs: 12, md: 4 }}
                                        sx={{ textAlign: { xs: 'left', md: 'right' } }}
                                    >
                                        <Button
                                            variant="outlined"
                                            size="large"
                                            href="contact"
                                            color="primary"
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
