'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import PageHeader from './PageHeader';

const businessTypes = [
    'Landscaping',
    'Construction / Trades',
    'Cleaning Services',
    'Restaurant / Café',
    'Fitness / Wellness',
    'Retail / Local Shop',
    'E-commerce',
    'Professional Services',
    'Non-profit / Community',
    'Other',
];

const budgetRanges = [
    'Under $1,500',
    '$1,500 – $3,000',
    '$3,000 – $5,000',
    '$5,000+',
    'Not sure yet',
];

const servicesOffered = [
    'New website',
    'Redesign / upgrade',
    'E-commerce',
    'Landing page / campaign',
    'SEO & Analytics',
    'Ongoing maintenance',
    'Something custom',
];

type FormState = {
    name: string;
    email: string;
    phone: string;
    businessName: string;
    businessType: string;
    budget: string;
    services: string[];
    message: string;
    wantsMeeting: boolean;
};

const initialFormState: FormState = {
    name: '',
    email: '',
    phone: '',
    businessName: '',
    businessType: '',
    budget: '',
    services: [],
    message: '',
    wantsMeeting: false,
};

export default function ContactPage() {
    const [form, setForm] = useState<FormState>(initialFormState);
    const [submitting, setSubmitting] = useState(false);
    const [thankOpen, setThankOpen] = useState(false);

    const theme = useTheme();
    const fullScreenDialog = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange =
        (field: keyof FormState) =>
            (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                const value =
                    field === 'wantsMeeting'
                        ? (event as React.ChangeEvent<HTMLInputElement>).target.checked
                        : event.target.value;
                setForm((prev) => ({ ...prev, [field]: value as any }));
            };

    const handleServiceToggle = (service: string) => () => {
        setForm((prev) => {
            const exists = prev.services.includes(service);
            return {
                ...prev,
                services: exists
                    ? prev.services.filter((s) => s !== service)
                    : [...prev.services, service],
            };
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setSubmitting(true);

        try {
            // TODO: Replace this with your actual API call / Resend email / backend endpoint.
            // Example:
            // await fetch('/api/contact', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(form),
            // });

            console.log('Form submitted:', form);

            setSubmitting(false);
            setThankOpen(true);
            setForm(initialFormState);
        } catch (error) {
            console.error('Error submitting contact form:', error);
            setSubmitting(false);
            alert('Something went wrong sending your message. Please try again or email me directly.');
        }
    };

    const handleCloseThankYou = () => {
        setThankOpen(false);
    };

    return (
        <Box
            component="section"
            aria-labelledby="contact-header"
            sx={(theme) => ({
                py: { xs: 6, md: 10 },
                px: { xs: 2, md: 6 },
                background:
                    theme.palette.mode === 'dark'
                        ? 'linear-gradient(180deg,#020617 0%, #050b1c 100%)'
                        : 'linear-gradient(180deg,#ffffff 0%, #f7fbff 100%)',
            })}
        >
            <Grid container justifyContent="center">
                <Grid size={{ xs: 12, md: 10 }}>
                    <PageHeader
                        title="Contact"
                        subtitle="Tell me a bit about your business and I’ll follow up within 24 hours."
                    />
                </Grid>

                {/* Main layout */}
                <Grid size={{ xs: 12, md: 10 }} sx={{ mt: 4 }}>
                    <Grid container spacing={4}>
                        {/* Left – intro, promise, voicemail */}
                        <Grid size={{ xs: 12, md: 5 }}>
                            <Stack spacing={3}>
                                <Typography component={'h4'} variant="h5" sx={{ fontWeight: 800 }} color='text.primary'>
                                    Let&apos;s build something that actually helps your business.
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Whether you need your first website, a redesign of something that&apos;s
                                    holding you back, or a more scalable setup for a growing business —
                                    this is the place to start. I&apos;ll keep the process simple, transparent,
                                    and focused on business outcomes, not just code.
                                </Typography>

                                <Stack spacing={1.5}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Chip size="small" label="< 24 hour response" variant="outlined" />
                                        <Typography variant="body2" color="text.secondary">
                                            I respond to all inquiries within one business day.
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Chip size="small" label="No pressure" variant="outlined" />
                                        <Typography variant="body2" color="text.secondary">
                                            Ask anything — this starts as a conversation, not a hard sell.
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Chip size="small" label="Toronto & remote" variant="outlined" />
                                        <Typography variant="body2" color="text.secondary">
                                            Based in Toronto, working with local and remote businesses.
                                        </Typography>
                                    </Stack>
                                </Stack>

                                <Divider sx={{ my: 2 }} />

                                <Paper
                                    elevation={2}
                                    sx={{
                                        borderRadius: 3,
                                        p: 2.5,
                                        background: (theme) =>
                                            theme.palette.mode === 'dark'
                                                ? 'rgba(15,23,42,0.8)'
                                                : 'rgba(255,255,255,0.95)',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                    }}
                                >
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                                        Prefer to talk or leave a voicemail?
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        You can call or leave a voicemail using the phone number listed on this
                                        page. I&apos;ll return your call within 24 hours, usually sooner.
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                                        If you&apos;d like to book a meeting as part of this inquiry, just check the
                                        &quot;I&apos;d like to book a meeting&quot; option in the form — I&apos;ll follow up with
                                        available times.
                                    </Typography>
                                </Paper>
                            </Stack>
                        </Grid>

                        {/* Right – form */}
                        <Grid size={{ xs: 12, md: 7 }}>
                            <Paper
                                elevation={4}
                                sx={{
                                    borderRadius: 3,
                                    p: { xs: 3, md: 4 },
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <Box component={'form'} onSubmit={handleSubmit}>
                                    <Stack spacing={3}>
                                        {/* Name + Email */}
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    label="Full name"
                                                    value={form.name}
                                                    onChange={handleChange('name')}
                                                    required
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    label="Email"
                                                    type="email"
                                                    value={form.email}
                                                    onChange={handleChange('email')}
                                                    required
                                                    fullWidth
                                                />
                                            </Grid>
                                        </Grid>

                                        {/* Phone + Business name */}
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    label="Phone (optional)"
                                                    value={form.phone}
                                                    onChange={handleChange('phone')}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    label="Business name (optional)"
                                                    value={form.businessName}
                                                    onChange={handleChange('businessName')}
                                                    fullWidth
                                                />
                                            </Grid>
                                        </Grid>

                                        {/* Business type + Budget */}
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    select
                                                    label="Business type"
                                                    value={form.businessType}
                                                    onChange={handleChange('businessType')}
                                                    fullWidth
                                                >
                                                    {businessTypes.map((type) => (
                                                        <MenuItem key={type} value={type}>
                                                            {type}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    select
                                                    label="Estimated budget"
                                                    value={form.budget}
                                                    onChange={handleChange('budget')}
                                                    fullWidth
                                                >
                                                    {budgetRanges.map((range) => (
                                                        <MenuItem key={range} value={range}>
                                                            {range}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                        </Grid>

                                        {/* Services */}
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                                                What do you need help with?
                                            </Typography>
                                            <FormGroup
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    flexWrap: 'wrap',
                                                    gap: 1,
                                                }}
                                            >
                                                {servicesOffered.map((service) => (
                                                    <FormControlLabel
                                                        key={service}
                                                        control={
                                                            <Checkbox
                                                                checked={form.services.includes(service)}
                                                                onChange={handleServiceToggle(service)}
                                                                size="small"
                                                            />
                                                        }
                                                        label={
                                                            <Typography variant="body2" color="text.secondary">
                                                                {service}
                                                            </Typography>
                                                        }
                                                    />
                                                ))}
                                            </FormGroup>
                                        </Box>

                                        {/* Message */}
                                        <TextField
                                            label="Tell me a bit about your project or what you’re trying to fix"
                                            value={form.message}
                                            onChange={handleChange('message')}
                                            required
                                            fullWidth
                                            multiline
                                            minRows={4}
                                        />

                                        {/* Book a meeting */}
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={form.wantsMeeting}
                                                    onChange={(e) =>
                                                        setForm((prev) => ({
                                                            ...prev,
                                                            wantsMeeting: e.target.checked,
                                                        }))
                                                    }
                                                />
                                            }
                                            label={
                                                <Typography variant="body2" color="text.secondary">
                                                    I&apos;d like to book an in-person meeting as part of this inquiry.
                                                </Typography>
                                            }
                                        />

                                        <Stack direction="row" justifyContent="flex-end">
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                size="large"
                                                disabled={submitting}
                                                sx={{ textTransform: 'none', borderRadius: 2, minWidth: 140 }}
                                            >
                                                {submitting ? 'Sending…' : 'Submit'}
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            {/* Thank-you modal */}
            <Dialog
                open={thankOpen}
                onClose={handleCloseThankYou}
                fullScreen={fullScreenDialog}
                aria-labelledby="thank-you-title"
            >
                <DialogTitle id="thank-you-title">Thank you for reaching out</DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body1" sx={{ mb: 1.5 }}>
                        I&apos;ve received your message and will get back to you within 24 hours.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        If you requested a meeting, I&apos;ll include a few available time slots in my
                        reply and a link where you can pick what works best for you.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseThankYou} autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
