import { Box, Typography } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';

const CircularIconText = () => {
  const texts = ['Professionals', 'High Quality'];
  const radius = 50; // Increased radius for better text readability
  const totalAngle = 360; // Full circle in degrees
  const words = texts.map((word) => word.split('')); // Split into words, then characters
  const totalChars = words.flat().length + words.length - 1; // Total characters including spaces between words
  const angleStep = totalAngle / totalChars; // Angle per character

  // Calculate positions for each word to ensure even distribution
  let currentCharIndex = 0;

  return (
    <Box
      sx={{
        position: 'relative',
        width: { xs: '100px', sm: '120px', md: '140px' }, // Responsive container size
        height: { xs: '100px', sm: '120px', md: '140px' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        background: 'linear-gradient(145deg, #FFFFFF, #F0F4F8)', // Subtle gradient for depth
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)', // Enhanced shadow for professionalism
        overflow: 'hidden',
      }}
    >
      <VerifiedIcon
        sx={{
          color: '#00ACC1',
          fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
          zIndex: 2,
          '&:before': {
            content: '""',
            position: 'absolute',
            width: '70%',
            height: '70%',
            borderRadius: '50%',
            backgroundColor: '#00ACC1',
            opacity: 0.15,
            zIndex: -1,
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {words.map((word, wordIndex) => {
          const wordChars = word.map((char, charIndex) => {
            const index = currentCharIndex;
            currentCharIndex += 1;
            const angle = index * angleStep - 90; // Start from top
            return (
              <Typography
                key={`${wordIndex}-${charIndex}`}
                variant="body2"
                sx={{
                  position: 'absolute',
                  color: '#1A3C5A',
                  fontWeight: 700,
                  fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
                  // Rotate and translate outward, then adjust to face outward
                  transform: `rotate(${angle}deg) translate(${radius}px) rotate(${
                    -angle + 90
                  }deg)`,
                  transformOrigin: 'center center',
                  zIndex: 1,
                }}
              >
                {char}
              </Typography>
            );
          });

          // Add space between words
          if (wordIndex < words.length - 1) {
            currentCharIndex += 1; // Reserve space for inter-word gap
          }

          return wordChars;
        })}
      </Box>
    </Box>
  );
};

export default CircularIconText;
