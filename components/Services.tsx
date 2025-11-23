'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import PageHeader from './PageHeader';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import CodeIcon from '@mui/icons-material/Code';
import BuildIcon from '@mui/icons-material/Build';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const serviceCards = [
    {
        id: 'builds',
        title: 'Website Builds',
        icon: RocketLaunchIcon,
        bullets: [
            'Full website (5+ pages)',
            'Landing pages & campaigns',
            'E-commerce websites',
            'Legacy → Modern migrations',
        ],
        description: 'Complete website solutions from concept to launch',
        details: {
            headline: 'Modern, Fast, Maintainable Websites',
            description:
                'I build full-stack websites using Next.js for optimal performance, React for rich interactivity, and MUI for a battle-tested design system. Every site is crafted with clean, documented code that any developer can maintain.',
            includes: [
                'Next.js framework for blazing-fast performance and SEO',
                'React ecosystem with proven, maintained libraries',
                'MUI design system with theme support',
                'E-commerce includes complete backend setup',
                'Mobile-first responsive design',
                'Performance optimization & accessibility built-in',
            ],
            process: [
                { step: 'Discovery', desc: 'Understanding your goals and requirements' },
                { step: 'Planning', desc: 'Architecture, tech stack, and timeline' },
                { step: 'Design', desc: 'Wireframes and visual design approval' },
                { step: 'Development', desc: 'Building with regular progress updates' },
                { step: 'Testing', desc: 'Quality assurance across devices' },
                { step: 'Launch', desc: 'Deployment and post-launch support' },
            ],
        },
    },
    {
        id: 'design',
        title: 'UX / UI & Design',
        icon: DesignServicesIcon,
        bullets: [
            'User flows & wireframes',
            'Modern visual redesigns',
            'Theme variants (dark, seasonal)',
        ],
        description: 'User-centered design that converts visitors into customers',
        details: {
            headline: 'Design That Drives Results',
            description:
                'I create intuitive user experiences through careful planning and iteration. From wireframes to final designs, every decision is made with your users and business goals in mind.',
            includes: [
                'User flow mapping and journey analysis',
                'Low and high-fidelity wireframes',
                'Modern, conversion-focused visual design',
                'Theme variants for different contexts',
                'Responsive design for all screen sizes',
                'Design system documentation',
            ],
            process: [
                { step: 'Research', desc: 'User needs and competitor analysis' },
                { step: 'Wireframing', desc: 'Structure and user flow planning' },
                { step: 'Design', desc: 'Visual design and component creation' },
                { step: 'Feedback', desc: 'Review and refinement iterations' },
                { step: 'Handoff', desc: 'Development-ready specifications' },
            ],
        },
    },
    {
        id: 'technical',
        title: 'Technical Services',
        icon: CodeIcon,
        bullets: [
            'Hosting & CI (Vercel / Netlify)',
            'DNS, SSL, domain setup',
            'Performance (Lighthouse)',
            'Accessibility (WCAG / AODA)',
            'API Integrations & webhooks',
            'Automated backups & security',
        ],
        description: 'Technical excellence for reliability and performance',
        details: {
            headline: 'Technical Excellence, Simplified',
            description:
                "I handle all the technical complexities so you don't have to. From hosting setup to performance optimization, your site will be fast, secure, and accessible.",
            includes: [
                'Hosting on Vercel/Netlify with automatic deployments',
                'Complete DNS and SSL certificate setup',
                'Lighthouse performance optimization (90+ scores)',
                'WCAG/AODA accessibility compliance',
                'Third-party API integrations and webhooks',
                'Automated backups and security monitoring',
            ],
            process: [
                { step: 'Setup', desc: 'Hosting, domain, and SSL configuration' },
                { step: 'Optimization', desc: 'Performance and accessibility tuning' },
                { step: 'Integration', desc: 'APIs, webhooks, and third-party services' },
                { step: 'Security', desc: 'Backups, monitoring, and hardening' },
                { step: 'Documentation', desc: 'Technical documentation and guides' },
            ],
        },
    },
    {
        id: 'maintenance',
        title: 'Maintenance & Support',
        icon: SupportAgentIcon,
        bullets: [
            'Updates & latest versions',
            'Troubleshooting & debugging',
            'Security patches & monitoring',
            'Priority & emergency response',
        ],
        description: 'Ongoing support to keep your site running smoothly',
        details: {
            headline: 'Peace of Mind, Always',
            description:
                'Your website is never "done." I provide ongoing maintenance to keep it secure, fast, and up-to-date with the latest technologies and best practices.',
            includes: [
                'Regular updates to latest framework versions',
                'Proactive security patch management',
                'Performance monitoring and optimization',
                'Bug fixing and troubleshooting',
                'Priority support with fast response times',
                'Emergency support for critical issues',
            ],
            process: [
                { step: 'Monitoring', desc: 'Continuous uptime and performance tracking' },
                { step: 'Updates', desc: 'Regular framework and dependency updates' },
                { step: 'Security', desc: 'Security patches and vulnerability scanning' },
                { step: 'Support', desc: 'Priority response for issues and requests' },
            ],
        },
    },
    {
        id: 'growth',
        title: 'Email, Marketing & Growth',
        icon: TrendingUpIcon,
        bullets: [
            'Email service setup and recommendations',
            'Contact forms & automations',
            'CRM',
            'SEO & Analytics Setup',
        ],
        description: 'Marketing tools to grow your business',
        details: {
            headline: 'Marketing That Converts',
            description:
                "I set up the marketing infrastructure you need to grow. From email services to CRM and analytics, you'll have the tools to understand and engage your audience.",
            includes: [
                'Resend email service setup (reliable, developer-friendly)',
                'MUI contact forms with validation and automation',
                'CRM integration for lead management',
                'Google Analytics for traffic and conversion tracking',
                'SEO optimization and search console setup',
                'Marketing automation workflows',
            ],
            process: [
                { step: 'Strategy', desc: 'Define goals and key metrics' },
                { step: 'Setup', desc: 'Email, CRM, and analytics configuration' },
                { step: 'Integration', desc: 'Connect marketing tools to your site' },
                { step: 'Optimization', desc: 'SEO and conversion rate improvements' },
                { step: 'Reporting', desc: 'Regular performance reports and insights' },
            ],
        },
    },
    {
        id: 'custom',
        title: 'Custom & Premium',
        icon: BuildIcon,
        bullets: [
            'Custom websites & applications',
            'Custom Themes & components',
            'Integrate Third-party services',
            'Campaign landings & microsites',
        ],
        description: 'Tailored solutions for unique business needs',
        details: {
            headline: 'Built for Your Unique Needs',
            description:
                "Sometimes off-the-shelf solutions don't cut it. I create custom applications, themes, and integrations tailored to your specific business requirements.",
            includes: [
                'Custom web applications with complex functionality',
                'Bespoke themes and component libraries',
                'Third-party service integrations and APIs',
                'Campaign landing pages optimized for conversion',
                'Microsites for special projects or events',
                'White-label solutions for agencies',
            ],
            process: [
                { step: 'Consultation', desc: 'Deep dive into your requirements' },
                { step: 'Proposal', desc: 'Detailed scope, timeline, and pricing' },
                { step: 'Design', desc: 'Custom UI/UX tailored to your brand' },
                { step: 'Development', desc: 'Agile development with regular check-ins' },
                { step: 'Delivery', desc: 'Launch with comprehensive documentation' },
            ],
        },
    },
];

export default function Services() {
    const handleScrollTop = () => {
        if (typeof window === 'undefined') return;

        const el = document.getElementById('services-header');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    const smoothScrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <>


            <Box
                component="section"
                aria-labelledby="services-header"
                id='services-header'
                sx={(theme) => ({
                    py: { xs: 6, md: 10 },
                    px: { xs: 2, md: 6 },
                    background:
                        theme.palette.mode === 'dark'
                            ? 'linear-gradient(180deg,#020617 0%, #071028 100%)'
                            : '#f9f9f9',
                })}
            >
                {/* Floating Back-to-Top Button */}
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: { xs: 16, md: 24 },
                        right: { xs: 16, md: 24 },
                        zIndex: 1300,
                    }}
                >
                    <Fab
                        color="primary"
                        size="medium"
                        aria-label="Back to top"
                        onClick={handleScrollTop}
                        sx={{
                            boxShadow: 4,
                        }}
                    >
                        <KeyboardArrowUpIcon />
                    </Fab>
                </Box>

                <Grid container justifyContent="center">
                    <Grid size={{ xs: 12, md: 10 }}>
                        <PageHeader
                            title="Services"
                            subtitle="Modern, maintainable websites and engineering services designed for growth."
                        />
                    </Grid>

                    {/* service section */}
                    <Grid size={{ xs: 12, md: 10 }} sx={{ mt: 3 }}>
                        <Grid container spacing={3}>
                            {serviceCards.map((card) => (
                                <Grid key={card.id} size={{ xs: 12, sm: 6, md: 4 }}>
                                    <Paper
                                        elevation={6}
                                        role="article"
                                        sx={{
                                            borderRadius: 3,
                                            p: 3,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            transition: 'transform 220ms ease, box-shadow 220ms ease',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: (t) =>
                                                    `0 18px 40px -12px ${t.palette.mode === 'dark'
                                                        ? 'rgba(0,0,0,0.7)'
                                                        : 'rgba(40,40,80,0.12)'
                                                    }`,
                                            },
                                            overflow: 'hidden',
                                            position: 'relative',
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                width: '6px',
                                                height: '100%',
                                                opacity: 0.14,
                                            },
                                        }}
                                    >
                                        <Stack spacing={2}>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Box
                                                    sx={{
                                                        p: 1,
                                                        borderRadius: 2,
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        bgcolor: (theme) =>
                                                            theme.palette.mode === 'dark'
                                                                ? 'rgba(255,255,255,0.03)'
                                                                : 'rgba(0,0,0,0.03)',
                                                        width: 56,
                                                        height: 56,
                                                    }}
                                                    aria-hidden
                                                >
                                                    {card.icon && <card.icon fontSize="large" sx={(theme) => ({

                                                        color:
                                                            theme.palette.mode === 'dark'
                                                                ? theme.palette.primary.light
                                                                : theme.palette.primary.main,
                                                    })} />}
                                                </Box>

                                                <Box>
                                                    <Typography component="h3" variant="h6" sx={{ fontWeight: 700 }}>
                                                        {card.title}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{ mt: 0.25 }}
                                                    >
                                                        {card.bullets.length} services
                                                    </Typography>
                                                </Box>
                                            </Stack>

                                            <Divider sx={{ my: 1 }} />

                                            <Stack spacing={1}>
                                                {card.bullets.slice(0, 4).map((b, i) => (
                                                    <Box
                                                        key={i}
                                                        sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}
                                                    >
                                                        <Chip
                                                            label={b}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{
                                                                borderRadius: 1.5,
                                                                fontSize: 12,
                                                                px: 1.5,
                                                                py: 0.5,
                                                                borderColor: 'divider',
                                                                background: (theme) =>
                                                                    theme.palette.mode === 'dark'
                                                                        ? 'rgba(255,255,255,0.02)'
                                                                        : '#fff',
                                                            }}
                                                        />
                                                    </Box>
                                                ))}
                                            </Stack>
                                        </Stack>

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
                                                size="small"
                                                color="primary"
                                                startIcon={<MailOutlineIcon />}
                                                href="#contact"
                                                aria-label={`Request ${card.title}`}
                                                sx={{ textTransform: 'none', boxShadow: 'none' }}
                                            >
                                                Request Quote
                                            </Button>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                color="primary"
                                                endIcon={<ArrowForwardIcon />}
                                                onClick={() => smoothScrollTo(`detail-${card.id}`)}
                                                sx={{ textTransform: 'none', boxShadow: 'none' }}
                                            >
                                                Learn More
                                            </Button>

                                        </Stack>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>

                    {/* action button */}
                    <Grid size={{ xs: 12, md: 10 }} sx={{ mt: 5 }}>
                        <Paper elevation={3} sx={{ borderRadius: 3, p: { xs: 2.5, md: 3 } }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{ xs: 12, md: 8 }}>
                                    <Typography
                                        component={'h4'}
                                        variant="h6"
                                        sx={{ fontWeight: 800 }}
                                    >
                                        Why choose this approach?
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        Clean, documented code — built with maintainability in mind so any junior or
                                        self-taught developer can pick it up. Predictable pricing, fast performance, and
                                        accessibility best practices baked in.
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
                                        Get a Proposal
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* detailed service sections */}
                    <Grid size={{ xs: 12, md: 10 }} sx={{ mt: 6 }}>
                        {serviceCards.map((service, index) => {
                            const Icon = service.icon;
                            const isEven = index % 2 === 0;

                            return (
                                <Box
                                    key={service.id}
                                    id={`detail-${service.id}`}
                                    sx={{
                                        scrollMarginTop: { xs: 80, md: 96 },
                                        mb: index < serviceCards.length - 1 ? 10 : 0,
                                    }}
                                >
                                    <Grid
                                        container
                                        spacing={4}
                                        alignItems="flex-start"
                                        direction={{ xs: 'column', lg: isEven ? 'row' : 'row-reverse' }}
                                    >
                                        {/* Content Side */}
                                        <Grid size={{ xs: 12, lg: 6 }}>
                                            <Stack spacing={3}>
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Box
                                                        sx={(theme) => ({
                                                            p: 2,
                                                            borderRadius: 3,
                                                            background:
                                                                theme.palette.mode === 'dark'
                                                                    ? 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))'
                                                                    : 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.08))',
                                                            display: 'inline-flex',
                                                        })}
                                                    >
                                                        <Icon
                                                            sx={(theme) => ({
                                                                fontSize: 32,
                                                                color:
                                                                    theme.palette.mode === 'dark'
                                                                        ? theme.palette.primary.light
                                                                        : theme.palette.primary.main,
                                                            })}
                                                        />
                                                    </Box>
                                                    <Box>
                                                        <Typography
                                                            variant="h5"
                                                            sx={{ fontWeight: 800, mb: 0.5 }}
                                                        >
                                                            {service.title}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            {service.details.headline}
                                                        </Typography>
                                                    </Box>
                                                </Stack>

                                                <Typography
                                                    variant="body1"
                                                    color="text.secondary"
                                                    sx={{ lineHeight: 1.7 }}
                                                >
                                                    {service.details.description}
                                                </Typography>

                                                <Box>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{ fontWeight: 700, mb: 1.5 }}
                                                    >
                                                        What&apos;s Included
                                                    </Typography>
                                                    <Stack spacing={1.2}>
                                                        {service.details.includes.map((item, i) => (
                                                            <Stack
                                                                key={i}
                                                                direction="row"
                                                                spacing={1.5}
                                                                alignItems="flex-start"
                                                            >
                                                                <CheckCircleOutlineIcon
                                                                    sx={{
                                                                        fontSize: 20,
                                                                        color: 'primary.main',
                                                                        mt: '2px',
                                                                    }}
                                                                />
                                                                <Typography
                                                                    variant="body2"
                                                                    color="text.secondary"
                                                                >
                                                                    {item}
                                                                </Typography>
                                                            </Stack>
                                                        ))}
                                                    </Stack>
                                                </Box>

                                                <Box sx={{ pt: 2 }}>
                                                    <Button
                                                        size="large"
                                                        variant="contained"
                                                        color="primary"
                                                        href="#contact"
                                                        fullWidth
                                                        endIcon={
                                                            <MailOutlineIcon sx={{ fontSize: 18 }} />
                                                        }
                                                        sx={{ textTransform: 'none' }}
                                                    >
                                                        Request Quote
                                                    </Button>
                                                </Box>
                                            </Stack>
                                        </Grid>

                                        {/* Process Side */}
                                        <Grid size={{ xs: 12, lg: 6 }}>
                                            <Paper
                                                elevation={1}
                                                sx={{
                                                    borderRadius: 3,
                                                    p: 3,
                                                    height: '100%',
                                                }}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    sx={{ fontWeight: 800, mb: 3 }}
                                                >
                                                    The Process
                                                </Typography>

                                                <Stack spacing={2}>
                                                    {service.details.process.map((step, i) => (
                                                        <Stack
                                                            key={i}
                                                            direction="row"
                                                            spacing={2}
                                                            alignItems="flex-start"
                                                        >
                                                            <Box
                                                                sx={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    alignItems: 'center',
                                                                    mr: 1,
                                                                }}
                                                            >
                                                                <Box
                                                                    sx={(theme) => ({
                                                                        width: 40,
                                                                        height: 40,
                                                                        borderRadius: '50%',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        fontWeight: 700,
                                                                        color: theme.palette.common.white,
                                                                        background:
                                                                            theme.palette.mode === 'dark'
                                                                                ? 'linear-gradient(135deg,#4f46e5,#0ea5e9)'
                                                                                : 'linear-gradient(135deg,#2563eb,#7c3aed)',
                                                                    })}
                                                                >
                                                                    {i + 1}
                                                                </Box>
                                                                {i < service.details.process.length - 1 && (
                                                                    <Box
                                                                        sx={{
                                                                            width: 2,
                                                                            flexGrow: 1,
                                                                            bgcolor: 'divider',
                                                                            mt: 1,
                                                                        }}
                                                                    />
                                                                )}
                                                            </Box>

                                                            <Box sx={{ pb: 2 }}>
                                                                <Typography
                                                                    variant="subtitle1"
                                                                    sx={{ fontWeight: 700 }}
                                                                >
                                                                    {step.step}
                                                                </Typography>
                                                                <Typography
                                                                    variant="body2"
                                                                    color="text.secondary"
                                                                >
                                                                    {step.desc}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
                                                    ))}
                                                </Stack>
                                            </Paper>
                                        </Grid>
                                    </Grid>

                                    {/* Divider between sections */}
                                    {index < serviceCards.length - 1 && (
                                        <Box
                                            sx={{
                                                mt: 10,
                                                borderTop: (theme) =>
                                                    `1px solid ${theme.palette.mode === 'dark'
                                                        ? 'rgba(148,163,184,0.3)'
                                                        : 'rgba(148,163,184,0.4)'
                                                    }`,
                                            }}
                                        />
                                    )}
                                </Box>
                            );
                        })}
                    </Grid>

                    {/* Final CTA */}
                    <Grid size={{ xs: 12, md: 10 }} sx={{ mt: 8, mb: 4 }}>
                        <Paper
                            elevation={1}
                            sx={{
                                borderRadius: 3,
                                p: { xs: 3, md: 4 },
                                textAlign: 'center',
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{ fontWeight: 800, mb: 1.5 }}
                            >
                                Ready to start your project?
                            </Typography>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ mb: 3 }}
                            >
                                Let&apos;s discuss your needs and create something amazing together.
                            </Typography>
                            <Button
                                size="large"
                                variant="contained"
                                color="primary"
                                href="#contact"
                                endIcon={<ArrowForwardIcon sx={{ fontSize: 20 }} />}
                                sx={{ textTransform: 'none' }}
                            >
                                Get in Touch
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

        </>

    );
}
