'use client';
import React, { useEffect, useState } from 'react';
import ExperiencesSection from './homepage/ExperiencesSection';
import BannerCTA from './homepage/BannerCTA';
import AboutSection from './homepage/AboutSection';
import TemplatesSection from './homepage/TemplatesSection';
import PricingSection from './homepage/PricingSection';
import Box from '@mui/material/Box';
import SectionHeader from './homepage/SectionHeader';
export default function Homepage() {
    const [contentHeight, setContentHeight] = useState<number>(0)
    const getElementHeights = (elementId: string) => {
        return document.getElementById(elementId)?.offsetHeight
    }
    useEffect(() => {
        const navHeight: number = getElementHeights('nav') as number;
        // const footerHeight: number = getElementHeights('footer') as number
        const mainHeight = window.innerHeight
        setContentHeight(mainHeight - navHeight)

    }, []);
    useEffect(() => {
        const windowSizeHandler = () => {
            const navHeight: number = getElementHeights('nav') as number;
            // const footerHeight: number = getElementHeights('footer') as number
            const mainHeight = window.innerHeight
            setContentHeight(mainHeight - navHeight)
        };
        window.addEventListener("resize", windowSizeHandler);

        return () => {
            window.removeEventListener("resize", windowSizeHandler);

        };
    }, [contentHeight])
    return (
        <Box sx={{ px: { xs: 2, md: 0 }, pt: { xs: 4, md: 0 } }}>
            <SectionHeader contentHeight={contentHeight} />
            <ExperiencesSection contentHeight={contentHeight} />
            {/* <BannerCTA /> */}
            <AboutSection contentHeight={contentHeight} />
            {/* <TemplatesSection /> */}
            <PricingSection />
        </Box>
    );
}
