'use client';
import ExperiencesSection from './homepage/ExperiencesSection';
import BannerCTA from './homepage/BannerCTA';
import AboutSection from './homepage/AboutSection';
import TemplatesSection from './homepage/TemplatesSection';
import PricingSection from './homepage/PricingSection';
import Box from '@mui/material/Box';
export default function Homepage() {
    return (
        <Box sx={{ px: { xs: 2, md: 12 }, pt: { xs: 4, md: 1 } }}>
            <ExperiencesSection />
            <BannerCTA />
            <AboutSection />
            {/* <TemplatesSection /> */}
            <PricingSection />
        </Box>
    );
}
