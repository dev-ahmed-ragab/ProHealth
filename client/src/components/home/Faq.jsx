import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FaqSection = () => {
  const [expanded, setExpanded] = useState('');

  const handleToggle = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : '');
  };

  const faqs = [
    {
      id: 'faq1',
      question: 'What services does ProHealth offer?',
      answer:
        'ProHealth offers a wide range of healthcare services, including primary care, specialist consultations, diagnostic tests, and preventive health programs.',
    },
    {
      id: 'faq2',
      question: 'How do I schedule an appointment with ProHealth?',
      answer:
        'You can schedule an appointment by visiting our website, calling our office at 1-800-PRO-HEALTH, or using our mobile app.',
    },
    {
      id: 'faq3',
      question: 'Do you accept insurance?',
      answer:
        'Yes, we accept most major insurance plans. Please check your specific plan details or contact us for more information.',
    },
    {
      id: 'faq4',
      question: 'What should I bring to my appointment?',
      answer:
        'Please bring your insurance card, identification, any relevant medical records, and a list of current medications.',
    },
    {
      id: 'faq5',
      question: 'How do I request a prescription refill?',
      answer:
        'To request a prescription refill, log into your patient portal, call our pharmacy department, or speak with your healthcare provider during your next visit.',
    },
  ];

  return (
    <Box
      sx={{
        maxWidth: '800px',
        mx: 'auto',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 6, md: 8 },
        backgroundColor: 'transparent',
      }}
      role="region"
      aria-label="Frequently Asked Questions Section"
    >
      <Typography
        variant="h3"
        sx={{
          fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3rem' },
          fontWeight: 700,
          lineHeight: 1.3,
          letterSpacing: '-0.5px',
          color: '#005C97',
          textAlign: 'center',
          mb: 4,
          pl: { xs: 0, md: 3 },
        }}
      >
        Frequently Asked Questions
      </Typography>
      <Box sx={{ mt: 2 }}>
        {faqs.map((faq) => (
          <Accordion
            key={faq.id}
            expanded={expanded === faq.id}
            onChange={handleToggle(faq.id)}
            sx={{
              borderRadius: '12px',
              background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              mb: 2,
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
              },
            }}
            role="article"
            aria-label={`FAQ: ${faq.question}`}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon sx={{ fontSize: 28, color: '#00ACC1' }} />
              }
              aria-controls={`${faq.id}-content`}
              id={`${faq.id}-header`}
              sx={{
                px: 2.5,
                py: 1.5,
                '& .MuiTypography-root': {
                  fontSize: { xs: '0.95rem', md: '1.1rem' },
                  fontWeight: 600,
                  color: '#1A3C5A',
                },
              }}
            >
              <Typography>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 2.5, pt: 1, pb: 2.5 }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                  color: '#4A6B8A',
                }}
              >
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

export default FaqSection;
