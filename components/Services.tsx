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
                'I build full-stack websites using Next.js, React, and MUI — so you get a fast, modern site that feels great to use and stays easy to maintain, even as your business grows.',
            includes: [
                'A fast, SEO-ready website that loads quickly and is friendly to Google',
                'A layout tailored to your services instead of a generic WordPress/theme template',
                'Mobile-first responsive design so it looks great on phones, tablets, and desktops',
                'Clear navigation and calls-to-action that help visitors contact you or book faster',
                'If needed, a fully wired e-commerce or booking flow that actually works for your use case',
                'Clean, documented code that any junior or self-taught developer can safely work on later',
            ],
            process: [
                { step: 'Discovery', desc: 'Understanding your business, customers, and goals' },
                { step: 'Planning', desc: 'Deciding page structure, content priorities, and tech stack' },
                { step: 'Design', desc: 'Wireframes and visual design for your approval' },
                { step: 'Development', desc: 'Building the site with regular check-ins and previews' },
                { step: 'Testing', desc: 'Verifying everything works across devices and browsers' },
                { step: 'Launch', desc: 'Deployment, DNS, SSL, and basic training on how to use it' },
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
            headline: 'Design That Feels Good and Works Hard',
            description:
                'Good design isn’t just about looking pretty — it should make it easy for visitors to understand what you do, trust you, and take the next step.',
            includes: [
                'Clear page layouts that guide visitors toward calling, booking, or filling out a form',
                'User flows that make it obvious where to click next instead of leaving people confused',
                'Modern, professional visuals that match your brand and don’t look like a generic template',
                'Theme variants like dark mode or seasonal/holiday layouts for campaigns and promotions',
                'Responsive designs that stay usable and readable on all screen sizes',
                'Design system thinking, so new pages in the future still feel consistent and on-brand',
            ],
            process: [
                { step: 'Research', desc: 'Understanding your audience and looking at competitors' },
                { step: 'Wireframing', desc: 'Planning structure and hierarchy before visuals' },
                { step: 'Design', desc: 'Creating polished mockups and reusable components' },
                { step: 'Feedback', desc: 'Iterating with your input until it feels right' },
                { step: 'Handoff', desc: 'Delivering assets, specs, and notes for development' },
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
            headline: 'The Reliable, Technical Backbone of Your Site',
            description:
                "I handle all the technical complexity behind the scenes so you don't have to think about servers, certificates, or strange error messages.",
            includes: [
                'Hosting configured on modern platforms like Vercel or Netlify for speed and reliability',
                'Domain, DNS, and SSL setup so your site loads securely at the right address',
                'Performance tuning to hit strong Lighthouse scores (speed, SEO, best practices)',
                'Accessibility improvements so more people can use your site — and you meet WCAG/AODA expectations',
                'Solid integrations with APIs, webhooks, or third-party tools your business already relies on',
                'Automated backups and sensible security practices so you’re less likely to wake up to a broken site',
            ],
            process: [
                { step: 'Setup', desc: 'Connecting your domain, DNS, and SSL to modern hosting' },
                { step: 'Optimization', desc: 'Improving load times, caching, and performance scores' },
                { step: 'Integration', desc: 'Connecting payment, forms, CRMs, or other external tools' },
                { step: 'Security', desc: 'Setting up backups, monitoring, and basic hardening' },
                { step: 'Documentation', desc: 'Recording what’s set up so future devs can understand it' },
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
            headline: 'Peace of Mind, Without the Tech Headaches',
            description:
                'Websites need care over time. I keep your site updated, secure, and running smoothly so you can focus on running the business.',
            includes: [
                'Regular updates to frameworks, libraries, and dependencies to stay current and secure',
                'Bug fixes and troubleshooting when something breaks or doesn’t behave as expected',
                'Security patches and monitoring to reduce the risk of downtime or hacks',
                'Performance checks so the site doesn’t slowly get bloated and sluggish over time',
                'Priority support for urgent issues that affect sales, leads, or bookings',
                'Clear communication so you know what changed and why it mattered',
            ],
            process: [
                { step: 'Monitoring', desc: 'Keeping an eye on uptime, errors, and performance' },
                { step: 'Updates', desc: 'Rolling out safe updates on a regular schedule' },
                { step: 'Security', desc: 'Applying patches and watching for suspicious behavior' },
                { step: 'Support', desc: 'Being available for questions and issues as they come up' },
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
            headline: 'Turn Website Traffic into Real Leads',
            description:
                "A good-looking site is only part of the story. I help you set up the tools that turn visitors into calls, bookings, and repeat customers.",
            includes: [
                'Resend or similar email service setup so contact forms reliably reach your inbox',
                'Well-designed contact forms with validation and thank-you states that feel professional',
                'Lightweight CRM or lead tracking setup so you don’t lose track of who reached out and when',
                'Google Analytics and basic dashboarding so you can see where traffic comes from',
                'SEO and Google Search Console basics so Google can properly index and understand your site',
                'Simple automations (like confirmation emails or notifications) so you respond faster with less manual work',
            ],
            process: [
                { step: 'Strategy', desc: 'Clarifying what a “lead” or “conversion” actually means for you' },
                { step: 'Setup', desc: 'Configuring email, forms, analytics, and basic CRM tools' },
                { step: 'Integration', desc: 'Connecting your forms and website flows into those tools' },
                { step: 'Optimization', desc: 'Improving wording, layout, and steps to lift conversion rates' },
                { step: 'Reporting', desc: 'Giving you simple numbers you can check without being “techy”' },
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
            headline: 'Built Around Your Business, Not a Template',
            description:
                "When your needs don’t fit into a standard template or drag-and-drop builder, I design and build custom solutions around how your business actually works.",
            includes: [
                'Custom web applications with logic and workflows specific to your business',
                'Bespoke themes and components that reflect your brand instead of looking like everyone else',
                'Deep integrations with third-party tools, CRMs, or internal systems you already use',
                'Campaign-specific landing pages designed to maximize signups, calls, or sales',
                'Microsites for events, launches, or side projects that need their own identity',
                'White-label or partner-friendly builds if you’re an agency or collaborator',
            ],
            process: [
                { step: 'Consultation', desc: 'Digging into your requirements, constraints, and ideas' },
                { step: 'Proposal', desc: 'Defining scope, milestones, and pricing for custom work' },
                { step: 'Design', desc: 'Designing flows and visuals tailored specifically to your use case' },
                { step: 'Development', desc: 'Implementing features in stages with ongoing feedback' },
                { step: 'Delivery', desc: 'Launching and documenting the system so it’s maintainable long term' },
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
                id="services-header"
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
                                                    {card.icon && (
                                                        <card.icon
                                                            fontSize="large"
                                                            sx={(theme) => ({
                                                                color:
                                                                    theme.palette.mode === 'dark'
                                                                        ? theme.palette.primary.light
                                                                        : theme.palette.primary.main,
                                                            })}
                                                        />
                                                    )}
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
                                                fullWidth
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
                                    <Typography component={'h4'} variant="h6" sx={{ fontWeight: 800 }}>
                                        Why choose this approach?
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        Clean, documented code — built with maintainability in mind so any junior or
                                        self-taught developer can pick it up. Predictable pricing, fast performance,
                                        and accessibility best practices baked in.
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
                                                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
                                                            {service.title}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
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
                                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                                                        What You Get
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
                                                        endIcon={<MailOutlineIcon sx={{ fontSize: 18 }} />}
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
                            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5 }}>
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
