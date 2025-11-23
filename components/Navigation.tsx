'use client';
import React from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Link from '@mui/material/Link';
import ThemeToggleBtn from './ThemeToggleBtn';
import Image from 'next/image';

const Navigation = () => {
    const pages = [
        { title: 'Home', link: '/' },
        { title: 'Services', link: 'services' },
        { title: 'Pricing', link: 'pricing' },
        { title: 'About Us', link: 'about' },
        { title: 'Contact', link: 'contact' }];

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };


    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };



    return (
        <AppBar position="sticky">
            <Container maxWidth="xl">
                <Toolbar
                    disableGutters
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Link href="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', paddingY: 1, color: 'inherit' }}>
                        <Image width={75} height={75} src={'../logoNiceGuyServices.svg'} alt='nice guy services logo' />
                    </Link>

                    {/* <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Nice Guy Services
                    </Typography> */}

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.title} onClick={handleCloseNavMenu}>
                                    <Link href={page.link} sx={{ textAlign: 'center' }}>{page.title}</Link>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'none', md: 'flex' },
                            justifyContent: 'center',
                            gap: 6,
                        }}
                    >
                        {pages.map((page) => (
                            <Link
                                key={page.title}
                                href={page.link}
                                onClick={handleCloseNavMenu}
                                sx={{
                                    my: 2,
                                    color: 'white',
                                    display: 'block',
                                    textDecoration: 'none',
                                    p: 1,
                                    '&:hover': {
                                        color: 'text.secondary',
                                        p: 1,
                                        boxShadow: '1px 1px 5px rgba(0,0,0,0.2)',
                                        backgroundColor: 'background.default',
                                        borderRadius: 1,

                                    },
                                }}
                            >
                                {page.title}
                            </Link>
                        ))}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                        <ThemeToggleBtn />
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}





export default Navigation