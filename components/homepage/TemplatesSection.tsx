'use client';

import { Box, Grid, Paper, Typography, Button, Stack } from '@mui/material';
import { motion } from 'framer-motion';

const templateVariants = {
    hidden: { opacity: 0, y: 30 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.15, duration: 0.5 },
    }),
};

export default function TemplatesSection() {
    const templates = [
        { title: 'Basic Template', desc: 'Simple, clean, and fast. Great for small services.' },
        { title: 'Medium Template', desc: 'More structure, more content, more flexibility.' },
        { title: 'Complex Template', desc: 'Full layouts, advanced sections, animations, CMS-ready.' },
    ];

    return (
        <Box sx={{ py: { xs: 6, md: 10 } }}>
            <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
                Website Templates (3 Versions)
            </Typography>

            <Grid container spacing={4}>
                {templates.map((t, i) => (
                    <Grid key={i} size={{ xs: 12, md: 4 }}>
                        <motion.div
                            variants={templateVariants}
                            initial="hidden"
                            whileInView="show"
                            custom={i}
                        >
                            <Paper
                                elevation={4}
                                sx={{ p: 3, borderRadius: 3, height: '100%' }}
                            >
                                <Stack spacing={1.5}>
                                    <Typography variant="h5">{t.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {t.desc}
                                    </Typography>
                                </Stack>
                            </Paper>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>

        </Box>
    );
}
