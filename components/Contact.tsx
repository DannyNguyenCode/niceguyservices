"use client";

import React, { useState } from "react";
import PageHeader from "./PageHeader";
import ContactIntro from "./contact/ContactIntro";
import ContactForm from "./contact/ContactForm";
import ThankYouModal from "./contact/ThankYouModal";

export type FormState = {
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

export const initialFormState: FormState = {
    name: "",
    email: "",
    phone: "",
    businessName: "",
    businessType: "",
    budget: "",
    services: [],
    message: "",
    wantsMeeting: false,
};

const Contact: React.FC = () => {
    const [form, setForm] = useState<FormState>(initialFormState);
    const [submitting, setSubmitting] = useState(false);
    const [thankOpen, setThankOpen] = useState(false);

    const handleChange = (field: keyof FormState, value: string | boolean) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleServiceToggle = (service: string) => {
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
            console.log("Form submitted:", form);

            setSubmitting(false);
            setThankOpen(true);
            setForm(initialFormState);
        } catch (error) {
            console.error("Error submitting contact form:", error);
            setSubmitting(false);
            alert(
                "Something went wrong sending your message. Please try again or email me directly."
            );
        }
    };

    return (
        <section
            id="contact"
            aria-labelledby="contact-header"
            className="bg-base-200 py-12 md:py-16 px-4"
        >
            <div className="max-w-6xl mx-auto space-y-8 md:space-y-10">
                <PageHeader
                    title="Contact"
                    subtitle="Tell me a bit about your business and I’ll follow up within 24 hours."
                />

                <div className="grid gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
                    <ContactIntro />
                    <ContactForm
                        form={form}
                        submitting={submitting}
                        onChange={handleChange}
                        onServiceToggle={handleServiceToggle}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>

            <ThankYouModal open={thankOpen} onClose={() => setThankOpen(false)} />
        </section>
    );
};

export default Contact;
