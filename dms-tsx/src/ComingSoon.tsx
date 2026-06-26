import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, TextField, Button, Chip } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

// ── Set your real launch date here ──────────────────────────────────────────
const LAUNCH_DATE = new Date(Date.now() + 42 * 24 * 60 * 60 * 1000);

interface TimeLeft { days: number; hours: number; minutes: number; seconds: number }

function getTimeLeft(): TimeLeft {
  const diff = Math.max(0, LAUNCH_DATE.getTime() - Date.now());
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000)  / 60000),
    seconds: Math.floor((diff % 60000)    / 1000),
  };
}

function pad(n: number) { return String(n).padStart(2, '0'); }

// ── Floating dots canvas (light theme) ───────────────────────────────────────
function FloatingCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d')!;

    const dots = Array.from({ length: 48 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00015,
      vy: (Math.random() - 0.5) * 0.00015,
      r: Math.random() * 3 + 1.5,
      a: Math.random() * 0.18 + 0.06,
      color: Math.random() > 0.5 ? '#7F77DD' : '#1976d2',
    }));

    function resize() {
      if (!cv) return;
      cv.width  = cv.offsetWidth;
      cv.height = cv.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    let raf: number;
    function draw() {
      if (!cv) return;
      const W = cv.width, H = cv.height;
      ctx.clearRect(0, 0, W, H);

      // Draw connecting lines between nearby dots
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = (dots[i].x - dots[j].x) * W;
          const dy = (dots[i].y - dots[j].y) * H;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x * W, dots[i].y * H);
            ctx.lineTo(dots[j].x * W, dots[j].y * H);
            ctx.strokeStyle = `rgba(127,119,221,${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > 1) d.vx *= -1;
        if (d.y < 0 || d.y > 1) d.vy *= -1;
        const hex = Math.round(d.a * 255).toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.arc(d.x * W, d.y * H, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.color + hex;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
}

// ── Countdown unit card ───────────────────────────────────────────────────────
function CountUnit({ value, label }: { value: number; label: string }) {
  return (
    <Box sx={{
      bgcolor: 'background.paper',
      border: '0.5px solid',
      borderColor: 'divider',
      borderRadius: 3,
      px: { xs: 1.5, sm: 2.5 },
      py: 2,
      textAlign: 'center',
      minWidth: { xs: 64, sm: 80 },
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      <Typography sx={{
        fontSize: { xs: 28, sm: 36 },
        fontWeight: 500,
        color: 'primary.main',
        lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
        fontFamily: 'monospace',
      }}>
        {pad(value)}
      </Typography>
      <Typography sx={{
        fontSize: 10,
        color: 'text.disabled',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        mt: 0.75,
      }}>
        {label}
      </Typography>
    </Box>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
const ComingSoon: React.FC = () => {
  const [time, setTime]         = useState<TimeLeft>(getTimeLeft());
  const [email, setEmail]       = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]       = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleNotify = () => {
    if (!email.trim() || !email.includes('@')) {
      setError(true);
      setTimeout(() => setError(false), 1800);
      return;
    }
    // TODO: wire to your API — e.g. await apiClient.post('/api/notify', { email })
    setSubmitted(true);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        px: 2,
      }}
    >
      <FloatingCanvas />

      {/* Subtle top accent line */}
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 3,
        background: 'linear-gradient(90deg, transparent, #7F77DD 40%, #1976d2 60%, transparent)',
        opacity: 0.7,
      }} />

      {/* Content */}
      <Box sx={{
        position: 'relative', zIndex: 2,
        textAlign: 'center', maxWidth: 520, width: '100%',
        py: 6,
      }}>

        {/* Icon */}
        <Box sx={{
          width: 56, height: 56, borderRadius: 3,
          bgcolor: 'primary.50' as any,
          border: '0.5px solid',
          borderColor: 'primary.100' as any,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          mx: 'auto', mb: 3,
        }}>
          <RocketLaunchIcon sx={{ color: 'primary.main', fontSize: 26 }} />
        </Box>

        {/* Badge */}
        <Chip
          label="Launching soon"
          size="small"
          sx={{
            bgcolor: '#EEEDFE',
            color: '#534AB7',
            border: '0.5px solid #AFA9EC',
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.04em',
            mb: 2.5,
            '& .MuiChip-label': { px: 1.5 },
          }}
        />

        {/* Heading */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: 32, sm: 44 },
            fontWeight: 600,
            color: 'text.primary',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            mb: 1.5,
          }}
        >
          Something{' '}
          <Box component="span" sx={{ color: 'primary.main' }}>
            great
          </Box>{' '}
          is on its way
        </Typography>

        {/* Subtext */}
        <Typography sx={{
          fontSize: 15, color: 'text.secondary',
          lineHeight: 1.7, mb: 4,
          maxWidth: 400, mx: 'auto',
        }}>
          We're working hard to bring you an amazing experience.
          Drop your email and we'll let you know the moment we go live.
        </Typography>

        {/* Countdown */}
        <Box sx={{
          display: 'flex', gap: { xs: 1, sm: 1.5 },
          justifyContent: 'center', mb: 4,
          flexWrap: 'wrap',
        }}>
          <CountUnit value={time.days}    label="Days"    />
          <CountUnit value={time.hours}   label="Hours"   />
          <CountUnit value={time.minutes} label="Minutes" />
          <CountUnit value={time.seconds} label="Seconds" />
        </Box>

        {/* Progress bar */}
        <Box sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
              Development progress
            </Typography>
            <Typography sx={{ fontSize: 12, color: 'primary.main', fontWeight: 500 }}>
              68%
            </Typography>
          </Box>
          <Box sx={{
            height: 4, bgcolor: 'grey.100',
            borderRadius: 2, overflow: 'hidden',
            border: '0.5px solid', borderColor: 'divider',
          }}>
            <Box sx={{
              height: '100%', bgcolor: 'primary.main',
              borderRadius: 2, width: '68%',
              transition: 'width 1.5s cubic-bezier(0.4,0,0.2,1)',
            }} />
          </Box>
        </Box>

        {/* Email signup */}
        {!submitted ? (
          <Box sx={{ maxWidth: 400, mx: 'auto', mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleNotify()}
                error={error}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontSize: 13,
                    bgcolor: 'background.paper',
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleNotify}
                disableElevation
                sx={{
                  borderRadius: 2,
                  px: 2.5,
                  fontSize: 13,
                  fontWeight: 500,
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                Notify me
              </Button>
            </Box>
            {error && (
              <Typography sx={{ fontSize: 11, color: 'error.main', mt: 0.75, textAlign: 'left' }}>
                Please enter a valid email address.
              </Typography>
            )}
          </Box>
        ) : (
          <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 1, mb: 2,
          }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 18, color: 'success.main' }} />
            <Typography sx={{ fontSize: 13, color: 'success.main', fontWeight: 500 }}>
              You're on the list — we'll be in touch!
            </Typography>
          </Box>
        )}

        {/* Fine print */}
        <Typography sx={{ fontSize: 12, color: 'text.disabled' }}>
          No spam, ever. Unsubscribe anytime.
        </Typography>

        {/* Divider + feature hints */}
        <Box sx={{
          mt: 5, pt: 4,
          borderTop: '0.5px solid', borderColor: 'divider',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 2,
        }}>
          {[
            { icon: '⚡', title: 'Fast', desc: 'Built for speed from day one' },
            { icon: '🔒', title: 'Secure', desc: 'Enterprise-grade security' },
            { icon: '🎯', title: 'Simple', desc: 'Intuitive by design' },
          ].map(f => (
            <Box key={f.title}>
              <Typography sx={{ fontSize: 20, mb: 0.5 }}>{f.icon}</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: 'text.primary', mb: 0.25 }}>
                {f.title}
              </Typography>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.5 }}>
                {f.desc}
              </Typography>
            </Box>
          ))}
        </Box>

      </Box>
    </Box>
  );
};

export default ComingSoon;
