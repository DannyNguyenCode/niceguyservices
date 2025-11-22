'use client'

import React from 'react'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import PageHeader from './PageHeader';

const Contact = () => {
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
            <Grid
                container
                justifyContent="center"
            >
                <Grid size={12}>
                    <PageHeader title="Contact Us" subtitle="We'd love to hear from you. Reach out directly or send us a message using the form." />
                </Grid>

                <Grid size={{ xs: 12, md: 10 }}>
                    <Paper
                        elevation={6}
                        sx={{
                            width: '100%',
                            p: { xs: 4, md: 5 },
                            borderRadius: 4,
                            mx: 'auto',
                            my: { xs: 4, md: 6 },
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <Grid container spacing={4}>
                            {/* Left side inside paper */}
                            <Grid
                                size={{ xs: 12, md: 5 }}
                                sx={{
                                    borderRight: { md: '1px solid' },
                                    borderColor: { md: 'divider' },
                                    pr: { md: 4 },
                                }}
                            >
                                <Stack direction="column" spacing={2.5}>
                                    <Typography variant="h4" color="text.primary">
                                        Get in Touch
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Have a project in mind or questions about a website for your business?
                                        Reach out and we'll respond within one business day.
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Available 7 days a week for new projects and support.
                                    </Typography>

                                    <Typography variant="h5" display="flex" alignItems="center" gap={1}>
                                        <LocalPhoneIcon />
                                        (647) 760-3458
                                    </Typography>
                                    <Typography variant="h5" display="flex" alignItems="center" gap={1}>
                                        <EmailIcon />
                                        gbnguyenw@gmail.com
                                    </Typography>

                                    <Box mt={1}>
                                        <Typography variant="h6" color="text.primary" gutterBottom>
                                            I can help with
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • New sites for local businesses
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • Redesigns of outdated websites
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • Speed, SEO, and mobile improvements
                                        </Typography>
                                    </Box>

                                    <Box mt={1.5}>
                                        <Typography variant="h6" color="text.primary" gutterBottom>
                                            What happens after you reach out
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            1. I review your message and business goals.
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            2. We schedule a quick call to discuss ideas.
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            3. You receive a clear proposal with timeline and pricing.
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Grid>

                            {/* Right side form inside paper */}
                            <Grid size={{ xs: 12, md: 7 }}>
                                <Stack direction="column" textAlign="center" spacing={2}>
                                    <Typography variant="h4" mb={1}>
                                        Schedule an Appointment
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" mb={2}>
                                        Leave us your details and we’ll get back to you as soon as possible.
                                    </Typography>

                                    <Box
                                        component="form"
                                        sx={{
                                            '& .MuiTextField-root': { my: 1, width: '100%' },
                                            mt: 1,
                                        }}
                                        noValidate
                                        autoComplete="off"
                                    >
                                        <TextField
                                            required
                                            fullWidth
                                            id="appointment-name"
                                            label="Name"
                                        />
                                        <TextField
                                            required
                                            fullWidth
                                            id="appointment-email"
                                            label="Email"
                                        />
                                        <TextField
                                            required
                                            fullWidth
                                            id="appointment-phone"
                                            label="Phone"
                                        />
                                        <TextField
                                            required
                                            fullWidth
                                            id="appointment-message"
                                            rows={4}
                                            label="Message"
                                            multiline
                                            placeholder="Tell us how we can help..."
                                        />
                                        <Box mt={3} display="flex" justifyContent="left">
                                            <Button type="submit" variant="contained" size="large">
                                                Submit
                                            </Button>
                                        </Box>
                                    </Box>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Contact