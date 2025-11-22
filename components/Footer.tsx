'use client';

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Image from 'next/image';

const Footer = () => {
    const pages = [
        { title: 'Home', link: '/' },
        { title: 'Services', link: 'services' },
        { title: 'Pricing', link: 'pricing' },
        { title: 'About Us', link: 'about' },
        { title: 'Contact', link: 'contact' },
    ];

    return (
        <AppBar
            position="static"
            sx={{
                mt: { xs: 6, md: 8 },
                borderTop: '1px solid',

            }}
        >
            <Container sx={{ height: 'inherit' }} maxWidth="xl">
                <Box
                    sx={{
                        py: 2,
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: { xs: 'flex-start', md: 'center' },
                        justifyContent: 'space-between',
                        gap: 2,
                    }}
                >
                    <Box>
                        {/* <Typography variant="subtitle1" fontWeight={600}>
                            Nice Guy Services
                        </Typography> */}

                        <Link href="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                            <Image width={50} height={50} src={'../logoNiceGuyServices.svg'} alt='nice guy services logo' />

                        </Link>

                        <Typography variant="body2">
                            Clean, modern websites for local businesses in Toronto and beyond.
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                            © {new Date().getFullYear()} Nice Guy Services. All rights reserved.
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 4,
                            justifyContent: { xs: 'flex-start', md: 'flex-end' },
                            height: 'inerhit',

                        }}
                    >
                        {pages.map((page) => (
                            <Link
                                key={page.title}
                                href={page.link}
                                sx={{
                                    fontSize: 14,
                                    color: 'white',
                                    textDecoration: 'none',
                                    p: 1,
                                    '&:hover': {
                                        color: 'text.secondary', p: 1, boxShadow: '1px 1px 5px rgba(0,0,0,0.2)',
                                        backgroundColor: 'background.default',
                                        borderRadius: 1,

                                    },
                                }}
                            >
                                {page.title}
                            </Link>
                        ))}
                    </Box>
                </Box>
            </Container>
        </AppBar>
    );
};

export default Footer;