import React, { useState, useEffect, useRef } from 'react';
import { Home, BookOpen, BarChart3, User, Settings, Mic, Volume2, Headphones, PenLine, MessageCircle, Languages, RotateCcw, Repeat, Flame, Star, Trophy, Award, Target, Zap, TrendingUp, Crown, Gem, Check, CircleCheck, X, CircleX, AlertTriangle, Info, Lightbulb, ChevronRight, ChevronDown, ChevronUp, ChevronLeft, ArrowRight, MoreVertical, Play, Pause, Plus, Search, Filter, Bell, Trash2, Heart, Sparkles, Share2, Users, MessageSquare, Gift, Download, Lock, PartyPopper } from 'lucide-react';

// ============================================
// AURORA DESIGN SYSTEM
// Práctica diaria de inglés — cada palabra aprendida enciende una estrella
// ============================================

// ---------- TOKENS (light + dark) ----------
// Misma esencia Aurora: violeta-magenta + glow rosa + estrellas.
// En dark, el glow brilla contra la noche. En light, el glow es un acento
// saturado contra superficies lavanda suaves — el contraste vive en la
// saturación del color, no en la oscuridad del fondo.
const themes = {
  dark: {
    bgDeep: '#1A0E2E',
    bgSurface: '#2A1B45',
    bgSurfaceRaised: '#35225A',
    primary: '#C13FCC',
    primaryDim: '#8C2E94',
    secondary: '#7C4DFF',
    glow: '#FF8FE3',
    glowSoft: '#FF8FE333',
    success: '#4ADE80',
    warning: '#FBBF24',
    danger: '#FB7185',
    text: '#F5F0FF',
    textMuted: '#B8A9D9',
    textFaint: '#7A6896',
    border: '#3F2B63',
    starColor: '#FFFFFF',
    heroGradient: 'linear-gradient(135deg, #fff, #FF8FE3)',
    shadowSm: '0 2px 6px rgba(0,0,0,0.2)',
    shadow: '0 4px 16px rgba(0,0,0,0.25)',
    shadowLg: '0 20px 60px rgba(0,0,0,0.5)',
    shadowXl: '0 28px 80px rgba(0,0,0,0.6)',
    focusRing: '#FF8FE3',
  },
  light: {
    bgDeep: '#FBF7FF',
    bgSurface: '#FFFFFF',
    bgSurfaceRaised: '#F6EEFC',
    primary: '#B82FC2',
    primaryDim: '#9421A0',
    secondary: '#6C3CE9',
    glow: '#E0249A',
    glowSoft: '#E0249A22',
    success: '#16A34A',
    warning: '#D97706',
    danger: '#E11D48',
    text: '#2B1B42',
    textMuted: '#6B5A85',
    textFaint: '#9C8BB5',
    border: '#E7D9F4',
    starColor: '#B82FC2',
    heroGradient: 'linear-gradient(135deg, #B82FC2, #6C3CE9)',
    shadowSm: '0 1px 4px rgba(120,60,160,0.06)',
    shadow: '0 2px 12px rgba(120,60,160,0.08)',
    shadowLg: '0 20px 60px rgba(120,60,160,0.18)',
    shadowXl: '0 28px 90px rgba(120,60,160,0.24)',
    focusRing: '#B82FC2',
  },
};

const ThemeContext = React.createContext({ mode: 'dark', c: themes.dark });
const useTheme = () => React.useContext(ThemeContext);

const tokens = {
  font: {
    display: "'Fraunces', serif",
    body: "'Inter', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  radius: { sm: '8px', md: '14px', lg: '22px', full: '999px' },
  space: [0, 4, 8, 12, 16, 24, 32, 48, 64],

  // Tamaños de ícono estandarizados — evita números sueltos por componente
  iconSize: { sm: 16, md: 20, lg: 24, xl: 32 },

  // Escala de profundidad — qué se superpone a qué
  zIndex: {
    base: 0,
    dropdown: 30,
    sticky: 40,
    overlay: 90,
    modal: 100,
    toast: 200,
    tooltip: 250,
  },

  // Puntos de quiebre para responsive
  breakpoint: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },

  // Movimiento: duración + easing nombrados, no valores sueltos por componente
  motion: {
    duration: { fast: '0.15s', base: '0.25s', slow: '0.4s' },
    easing: {
      standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
      decelerate: 'cubic-bezier(0.16, 1, 0.3, 1)',  // entradas: modal, toast
      accelerate: 'cubic-bezier(0.4, 0, 1, 1)',      // salidas
      bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',   // streak / celebración
    },
  },

  // Estados interactivos — mismos valores en todos los componentes
  state: {
    hoverScale: 'scale(1.02)',
    activeScale: 'scale(0.97)',
    hoverLift: 'translateY(-2px)',
    disabledOpacity: 0.4,
    pressedOpacity: 0.85,
  },

  // Accesibilidad — área mínima tocable en móvil (WCAG 2.5.5 / Apple HIG: 44px)
  touchTarget: { min: 44 },

  // Ancho máximo de contenido — mismo límite en toda la app, no valores sueltos por pantalla
  container: { sm: '480px', md: '720px', lg: '960px', full: '100%' },
};

// Anillo de foco accesible — visible en ambos temas, nunca lo quites con outline:none sin reemplazo
function focusRingStyle(c) {
  return `0 0 0 2px ${c.bgSurface}, 0 0 0 4px ${c.focusRing}`;
}

const FONT_IMPORT = "@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');";

// ---------- STARFIELD (signature ambient layer) ----------
function Starfield({ density = 40 }) {
  const { mode, c } = useTheme();
  const [stars] = useState(() =>
    Array.from({ length: density }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.8 + 0.6,
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 2,
    }))
  );
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {stars.map(s => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: c.starColor,
            opacity: mode === 'dark' ? 0.5 : 0.35,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ---------- SIGNATURE COMPONENT: StreakConstellation ----------
function StreakConstellation({ lit = 4, total = 7 }) {
  const { mode, c } = useTheme();
  return (
    <div style={{
      background: `linear-gradient(135deg, ${c.bgSurface}, ${c.bgSurfaceRaised})`,
      border: `1px solid ${c.border}`,
      borderRadius: tokens.radius.lg,
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Starfield density={18} />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <div style={{ fontFamily: tokens.font.mono, fontSize: 12, color: c.textMuted, letterSpacing: 1, textTransform: 'uppercase' }}>Racha actual</div>
          <div style={{ fontFamily: tokens.font.display, fontSize: 32, fontWeight: 600, color: c.text, display: 'flex', alignItems: 'center', gap: 8 }}>
            {lit} días <Flame size={22} color={c.glow} fill={c.glow} />
          </div>
        </div>
      </div>
      <div style={{ position: 'relative', display: 'flex', gap: 10, justifyContent: 'space-between' }}>
        {Array.from({ length: total }).map((_, i) => {
          const isLit = i < lit;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isLit ? `radial-gradient(circle, ${c.glow}, ${c.primary})` : (mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(184,47,194,0.06)'),
                border: isLit ? 'none' : `1px dashed ${c.textFaint}`,
                boxShadow: isLit ? `0 0 16px ${c.glow}99, 0 0 4px ${c.glow}` : 'none',
                transition: 'all 0.4s ease',
              }}>
                <Star size={16} color={isLit ? '#FFFFFF' : c.textFaint} fill={isLit ? '#FFFFFF' : 'none'} />
              </div>
              <span style={{ fontFamily: tokens.font.mono, fontSize: 10, color: isLit ? c.text : c.textFaint }}>
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'][i]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- BUTTONS ----------
function Button({ children, variant = 'primary', size = 'md', icon: Icon, onClick, disabled }) {
  const { c } = useTheme();
  const sizes = { sm: '8px 16px', md: '12px 24px', lg: '16px 32px' };
  const fontSizes = { sm: 13, md: 15, lg: 17 };

  const base = {
    fontFamily: tokens.font.body,
    fontWeight: 600,
    fontSize: fontSizes[size],
    padding: sizes[size],
    borderRadius: tokens.radius.full,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    transition: `transform ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}, box-shadow ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}, opacity ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
    opacity: disabled ? tokens.state.disabledOpacity : 1,
  };

  const variants = {
    primary: {
      background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})`,
      color: '#fff',
      boxShadow: `0 4px 20px ${c.primary}55`,
    },
    secondary: {
      background: c.bgSurfaceRaised,
      color: c.text,
      border: `1px solid ${c.border}`,
    },
    ghost: {
      background: 'transparent',
      color: c.textMuted,
    },
    glow: {
      background: c.glow,
      color: c.bgDeep,
      boxShadow: `0 0 24px ${c.glow}88`,
    },
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className="aurora-focusable"
      style={{ ...base, ...variants[variant] }}
      onMouseEnter={e => !disabled && (e.currentTarget.style.transform = `${tokens.state.hoverLift} ${tokens.state.hoverScale}`)}
      onMouseLeave={e => !disabled && (e.currentTarget.style.transform = 'translateY(0) scale(1)')}
      onMouseDown={e => !disabled && (e.currentTarget.style.transform = tokens.state.activeScale)}
      onMouseUp={e => !disabled && (e.currentTarget.style.transform = `${tokens.state.hoverLift} ${tokens.state.hoverScale}`)}
    >
      {Icon && <Icon size={fontSizes[size] - 1} />}
      {children}
    </button>
  );
}

// ---------- CARD ----------
function Card({ children, padding = 20, glow = false }) {
  const { c } = useTheme();
  return (
    <div style={{
      background: c.bgSurface,
      border: `1px solid ${c.border}`,
      borderRadius: tokens.radius.lg,
      padding,
      boxShadow: glow ? `0 0 30px ${c.primary}33` : c.shadow,
    }}>
      {children}
    </div>
  );
}

// ---------- INPUT ----------
function Input({ label, placeholder, type = 'text', status, message, value, onChange }) {
  const { c } = useTheme();
  const [focused, setFocused] = useState(false);
  const statusColor = status === 'error' ? c.danger : status === 'success' ? c.success : null;
  const borderColor = statusColor || (focused ? c.primary : c.border);
  return (
    <div>
      {label && <label style={{ display: 'block', fontFamily: tokens.font.body, fontSize: 13, fontWeight: 600, color: c.textMuted, marginBottom: 6 }}>{label}</label>}
      <div style={{ position: 'relative' }}>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-invalid={status === 'error' || undefined}
          style={{
            width: '100%',
            background: c.bgDeep,
            border: `1.5px solid ${borderColor}`,
            borderRadius: tokens.radius.sm,
            padding: status ? '11px 40px 11px 14px' : '11px 14px',
            color: c.text,
            fontFamily: tokens.font.body,
            fontSize: 14,
            outline: 'none',
            boxShadow: focused ? `0 0 0 3px ${(statusColor || c.primary)}33` : 'none',
            transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
            boxSizing: 'border-box',
          }}
        />
        {status && (
          <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
            {status === 'error' ? <CircleX size={17} color={c.danger} /> : <CircleCheck size={17} color={c.success} />}
          </div>
        )}
      </div>
      {message && (
        <p style={{
          fontFamily: tokens.font.body, fontSize: 12, marginTop: 6, marginBottom: 0,
          color: statusColor || c.textFaint,
        }}>
          {message}
        </p>
      )}
    </div>
  );
}

// ---------- RADIO GROUP ----------
function RadioGroup({ label, options, defaultValue, name }) {
  const { c } = useTheme();
  const [selected, setSelected] = useState(defaultValue || options[0]);
  const groupName = name || label || 'radio-group';
  return (
    <div role="radiogroup" aria-label={label}>
      {label && <span style={{ display: 'block', fontFamily: tokens.font.body, fontSize: 13, fontWeight: 600, color: c.textMuted, marginBottom: 8 }}>{label}</span>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {options.map(opt => {
          const isSelected = selected === opt;
          return (
            <label
              key={opt}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                padding: '10px 14px', borderRadius: tokens.radius.sm,
                background: isSelected ? c.glowSoft : c.bgSurface,
                border: `1.5px solid ${isSelected ? c.primary : c.border}`,
                transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
                minHeight: tokens.touchTarget.min,
              }}
            >
              <input
                type="radio"
                name={groupName}
                checked={isSelected}
                onChange={() => setSelected(opt)}
                className="aurora-focusable"
                style={{ width: 18, height: 18, accentColor: c.primary, cursor: 'pointer', flexShrink: 0 }}
              />
              <span style={{ fontFamily: tokens.font.body, fontSize: 14, color: c.text }}>{opt}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

// ---------- CHECKBOX ----------
function Checkbox({ label, defaultChecked = false }) {
  const { c } = useTheme();
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', minHeight: tokens.touchTarget.min }}>
      <div style={{ position: 'relative', width: 20, height: 20, flexShrink: 0 }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={() => setChecked(!checked)}
          className="aurora-focusable"
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', margin: 0 }}
        />
        <div style={{
          width: 20, height: 20, borderRadius: 6,
          background: checked ? `linear-gradient(135deg, ${c.primary}, ${c.secondary})` : 'transparent',
          border: `1.5px solid ${checked ? c.primary : c.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
          pointerEvents: 'none',
        }}>
          {checked && <Check size={13} color="#fff" strokeWidth={3} />}
        </div>
      </div>
      <span style={{ fontFamily: tokens.font.body, fontSize: 14, color: c.text }}>{label}</span>
    </label>
  );
}

// ---------- SLIDER ----------
function Slider({ label, min = 0, max = 100, defaultValue = 50, unit = '' }) {
  const { c } = useTheme();
  const [value, setValue] = useState(defaultValue);
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontFamily: tokens.font.body, fontSize: 13, fontWeight: 600, color: c.textMuted }}>{label}</span>
          <span style={{ fontFamily: tokens.font.mono, fontSize: 12, color: c.glow }}>{value}{unit}</span>
        </div>
      )}
      <div style={{ position: 'relative', height: 24, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', width: '100%', height: 6, borderRadius: tokens.radius.full, background: c.bgDeep }} />
        <div style={{
          position: 'absolute', width: `${pct}%`, height: 6, borderRadius: tokens.radius.full,
          background: `linear-gradient(90deg, ${c.secondary}, ${c.glow})`,
        }} />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={e => setValue(Number(e.target.value))}
          className="aurora-focusable"
          style={{
            position: 'relative', width: '100%', height: 24, margin: 0,
            background: 'transparent', appearance: 'none', cursor: 'pointer',
          }}
        />
      </div>
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          appearance: none; width: 20px; height: 20px; border-radius: 50%;
          background: ${c.glow}; box-shadow: 0 0 10px ${c.glow}aa, 0 1px 3px rgba(0,0,0,0.3);
          cursor: pointer; border: 2px solid #fff;
        }
        input[type=range]::-moz-range-thumb {
          width: 20px; height: 20px; border-radius: 50%; border: 2px solid #fff;
          background: ${c.glow}; box-shadow: 0 0 10px ${c.glow}aa; cursor: pointer;
        }
      `}</style>
    </div>
  );
}

// ---------- STEPPER ----------
function Stepper({ steps, current = 0 }) {
  const { c } = useTheme();
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {steps.map((step, i) => {
        const isDone = i < current;
        const isActive = i === current;
        return (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isDone ? `linear-gradient(135deg, ${c.primary}, ${c.secondary})` : isActive ? c.glowSoft : c.bgSurfaceRaised,
                border: isActive ? `2px solid ${c.glow}` : `1.5px solid ${isDone ? 'transparent' : c.border}`,
                transition: `all ${tokens.motion.duration.base} ${tokens.motion.easing.standard}`,
                flexShrink: 0,
              }}>
                {isDone
                  ? <Check size={14} color="#fff" strokeWidth={3} />
                  : <span style={{ fontFamily: tokens.font.mono, fontSize: 12, fontWeight: 600, color: isActive ? c.glow : c.textFaint }}>{i + 1}</span>}
              </div>
              <span style={{ fontFamily: tokens.font.body, fontSize: 11, color: isActive ? c.text : c.textFaint, textAlign: 'center', maxWidth: 70 }}>{step}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 2, marginBottom: 18,
                background: isDone ? c.primary : c.border,
                transition: `background ${tokens.motion.duration.base} ${tokens.motion.easing.standard}`,
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ---------- SKELETON ----------
function Skeleton({ width = '100%', height = 16, radius }) {
  const { c } = useTheme();
  return (
    <div
      style={{
        width, height,
        borderRadius: radius || tokens.radius.sm,
        background: `linear-gradient(90deg, ${c.bgSurfaceRaised} 0%, ${c.glowSoft} 50%, ${c.bgSurfaceRaised} 100%)`,
        backgroundSize: '200% 100%',
        animation: 'skeletonShimmer 1.5s ease-in-out infinite',
      }}
    />
  );
}

function SkeletonCard() {
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Skeleton width={40} height={40} radius="50%" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Skeleton width="60%" height={12} />
          <Skeleton width="40%" height={10} />
        </div>
      </div>
      <Skeleton width="100%" height={10} />
      <div style={{ marginTop: 6 }}><Skeleton width="80%" height={10} /></div>
    </Card>
  );
}

// ---------- EMPTY STATE ----------
function EmptyState({ icon: Icon = BookOpen, title, description, actionLabel, onAction }) {
  const { c } = useTheme();
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px' }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%', margin: '0 auto 18px',
        background: c.glowSoft, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={28} color={c.glow} strokeWidth={1.5} />
      </div>
      <h3 style={{ fontFamily: tokens.font.display, fontSize: 18, fontWeight: 600, color: c.text, marginBottom: 6 }}>{title}</h3>
      <p style={{ fontFamily: tokens.font.body, fontSize: 13.5, color: c.textMuted, maxWidth: 320, margin: '0 auto 20px', lineHeight: 1.6 }}>{description}</p>
      {actionLabel && <Button variant="primary" onClick={onAction}>{actionLabel}</Button>}
    </div>
  );
}

// ---------- BADGE ----------
function Badge({ children, variant = 'default' }) {
  const { c } = useTheme();
  const variants = {
    default: { bg: c.bgSurfaceRaised, color: c.textMuted },
    success: { bg: '#4ADE8022', color: c.success },
    glow: { bg: `${c.glow}22`, color: c.glow },
  };
  const v = variants[variant];
  return (
    <span style={{
      fontFamily: tokens.font.mono, fontSize: 11, fontWeight: 600, letterSpacing: 0.5,
      textTransform: 'uppercase', padding: '4px 10px', borderRadius: tokens.radius.full,
      background: v.bg, color: v.color, display: 'inline-flex', alignItems: 'center', gap: 4,
    }}>
      {children}
    </span>
  );
}

// ---------- PROGRESS BAR ----------
function ProgressBar({ value, max = 100, label }) {
  const { c } = useTheme();
  const pct = (value / max) * 100;
  return (
    <div>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontFamily: tokens.font.body, fontSize: 13, color: c.textMuted }}>{label}</span>
          <span style={{ fontFamily: tokens.font.mono, fontSize: 12, color: c.text }}>{value}/{max}</span>
        </div>
      )}
      <div style={{ height: 8, background: c.bgDeep, borderRadius: tokens.radius.full, overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`, height: '100%',
          background: `linear-gradient(90deg, ${c.secondary}, ${c.glow})`,
          borderRadius: tokens.radius.full,
          boxShadow: `0 0 8px ${c.glow}aa`,
          transition: 'width 0.5s ease',
        }} />
      </div>
    </div>
  );
}

// ---------- WORD CARD (flashcard component) ----------
function WordCard({ word, translation, example }) {
  const { c } = useTheme();
  const [flipped, setFlipped] = useState(false);
  const flip = () => setFlipped(f => !f);
  return (
    <div
      onClick={flip}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } }}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={flipped ? `${word}: ${translation}. ${example}` : `${word}. Toca para traducir`}
      className="aurora-focusable"
      style={{
        background: flipped
          ? `linear-gradient(135deg, ${c.secondary}, ${c.primary})`
          : c.bgSurface,
        border: `1px solid ${c.border}`,
        borderRadius: tokens.radius.lg,
        padding: 24,
        cursor: 'pointer',
        minHeight: 120,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        transition: `background ${tokens.motion.duration.base} ${tokens.motion.easing.standard}`,
      }}
    >
      {!flipped ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: tokens.font.display, fontSize: 26, fontWeight: 600, color: c.text }}>{word}</span>
            <Volume2 size={18} color={c.textMuted} />
          </div>
          <span style={{ fontFamily: tokens.font.mono, fontSize: 11, color: c.textFaint, marginTop: 6 }}>toca para traducir</span>
        </>
      ) : (
        <>
          <span style={{ fontFamily: tokens.font.display, fontSize: 24, fontWeight: 600, color: '#fff' }}>{translation}</span>
          <span style={{ fontFamily: tokens.font.body, fontSize: 13, color: '#ffffffcc', marginTop: 8, fontStyle: 'italic' }}>"{example}"</span>
        </>
      )}
    </div>
  );
}

// ---------- MODAL ----------
function Modal({ open, onClose, title, children, footer }) {
  const { c } = useTheme();
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(10,5,20,0.7)',
        backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: tokens.zIndex.modal, padding: 20,
        animation: `fadeIn ${tokens.motion.duration.base} ${tokens.motion.easing.standard}`,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: `linear-gradient(160deg, ${c.bgSurfaceRaised}, ${c.bgSurface})`,
          border: `1px solid ${c.border}`,
          borderRadius: tokens.radius.lg,
          padding: 28,
          maxWidth: 440,
          width: '100%',
          position: 'relative',
          boxShadow: `${c.shadowXl}, 0 0 40px ${c.primary}22`,
          animation: `scaleIn ${tokens.motion.duration.slow} ${tokens.motion.easing.decelerate}`,
        }}
      >
        <button
          onClick={onClose}
          className="aurora-focusable"
          aria-label="Cerrar"
          style={{
            position: 'absolute', top: 12, right: 12, background: 'transparent',
            border: 'none', cursor: 'pointer', color: c.textFaint,
            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: tokens.radius.full,
          }}
        >
          <X size={18} />
        </button>
        {title && <h3 style={{ fontFamily: tokens.font.display, fontSize: 21, fontWeight: 600, marginBottom: 12, paddingRight: 24 }}>{title}</h3>}
        <div style={{ fontFamily: tokens.font.body, fontSize: 14, color: c.textMuted, lineHeight: 1.6 }}>{children}</div>
        {footer && <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>{footer}</div>}
      </div>
    </div>
  );
}

// ---------- ALERT DIALOG ----------
function AlertDialog({ open, onClose, onConfirm, variant = 'danger', title, description, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar' }) {
  const { c } = useTheme();
  if (!open) return null;
  const icons = { danger: AlertTriangle, success: Trophy, info: Info };
  const colors = { danger: c.danger, success: c.success, info: c.secondary };
  const Icon = icons[variant];
  const color = colors[variant];
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(10,5,20,0.7)',
        backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: tokens.zIndex.modal, padding: 20,
        animation: `fadeIn ${tokens.motion.duration.base} ${tokens.motion.easing.standard}`,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: c.bgSurfaceRaised,
          border: `1px solid ${c.border}`,
          borderRadius: tokens.radius.lg,
          padding: 28,
          maxWidth: 380,
          width: '100%',
          textAlign: 'center',
          animation: `scaleIn ${tokens.motion.duration.base} ${tokens.motion.easing.decelerate}`,
        }}
      >
        <div style={{
          width: 52, height: 52, borderRadius: '50%', background: `${color}22`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
        }}>
          <Icon size={24} color={color} />
        </div>
        <h3 style={{ fontFamily: tokens.font.display, fontSize: 19, fontWeight: 600, marginBottom: 8 }}>{title}</h3>
        <p style={{ fontFamily: tokens.font.body, fontSize: 13.5, color: c.textMuted, lineHeight: 1.5, marginBottom: 22 }}>{description}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" onClick={onClose}>{cancelLabel}</Button>
          <Button variant={variant === 'danger' ? 'primary' : 'glow'} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}

// ---------- TABS ----------
function Tabs({ items, defaultValue }) {
  const { c } = useTheme();
  const [active, setActive] = useState(defaultValue || items[0].value);
  const activeItem = items.find(i => i.value === active);
  return (
    <div>
      <div style={{ display: 'flex', gap: 4, background: c.bgDeep, padding: 4, borderRadius: tokens.radius.full, width: 'fit-content', marginBottom: 18 }}>
        {items.map(item => (
          <button
            key={item.value}
            onClick={() => setActive(item.value)}
            className="aurora-focusable"
            aria-selected={active === item.value}
            style={{
              fontFamily: tokens.font.body, fontSize: 13, fontWeight: 600,
              padding: '7px 16px', borderRadius: tokens.radius.full, border: 'none', cursor: 'pointer',
              background: active === item.value ? c.primary : 'transparent',
              color: active === item.value ? '#fff' : c.textMuted,
              transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`, whiteSpace: 'nowrap',
              minHeight: 36,
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div style={{ fontSize: 13.5, color: c.textMuted, lineHeight: 1.6 }}>{activeItem.content}</div>
    </div>
  );
}

// ---------- TABLE ----------
function Table({ columns, rows }) {
  const { c } = useTheme();
  return (
    <div style={{ overflowX: 'auto', borderRadius: tokens.radius.md, border: `1px solid ${c.border}` }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: tokens.font.body }}>
        <thead>
          <tr style={{ background: c.bgSurfaceRaised }}>
            {columns.map(col => (
              <th key={col} style={{
                textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: 0.5, color: c.textFaint,
                fontFamily: tokens.font.mono, borderBottom: `1px solid ${c.border}`,
              }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              style={{
                background: i % 2 === 0 ? 'transparent' : `${c.bgSurfaceRaised}55`,
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = `${c.primary}1a`}
              onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : `${c.bgSurfaceRaised}55`}
            >
              {row.map((cell, j) => (
                <td key={j} style={{
                  padding: '12px 16px', fontSize: 13.5, color: j === 0 ? c.text : c.textMuted,
                  borderBottom: i < rows.length - 1 ? `1px solid ${c.border}88` : 'none',
                }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------- TOAST ----------
function Toast({ open, onClose, variant = 'success', message }) {
  const { c } = useTheme();
  useEffect(() => {
    if (open) {
      const t = setTimeout(onClose, 3000);
      return () => clearTimeout(t);
    }
  }, [open, onClose]);

  if (!open) return null;
  const colors = { success: c.success, danger: c.danger, info: c.secondary };
  const icons = { success: Check, danger: X, info: Info };
  const Icon = icons[variant];
  const color = colors[variant];

  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      background: c.bgSurfaceRaised, border: `1px solid ${color}55`,
      borderRadius: tokens.radius.md, padding: '12px 18px', display: 'flex',
      alignItems: 'center', gap: 10, boxShadow: `0 8px 30px rgba(0,0,0,0.4), 0 0 20px ${color}33`,
      zIndex: tokens.zIndex.toast, animation: `slideUp ${tokens.motion.duration.base} ${tokens.motion.easing.decelerate}`,
    }}>
      <div style={{ width: 22, height: 22, borderRadius: '50%', background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={13} color={color} />
      </div>
      <span style={{ fontFamily: tokens.font.body, fontSize: 13.5, color: c.text }}>{message}</span>
    </div>
  );
}

// ---------- AVATAR ----------
function Avatar({ initials, size = 40, online = false }) {
  const { c } = useTheme();
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: `linear-gradient(135deg, ${c.secondary}, ${c.primary})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: tokens.font.display, fontWeight: 600, color: '#fff', fontSize: size * 0.38,
      }}>
        {initials}
      </div>
      {online && (
        <div style={{
          position: 'absolute', bottom: 0, right: 0, width: size * 0.28, height: size * 0.28,
          borderRadius: '50%', background: c.success, border: `2px solid ${c.bgSurface}`,
        }} />
      )}
    </div>
  );
}

// ---------- TOOLTIP ----------
function Tooltip({ children, label }) {
  const { c } = useTheme();
  const [show, setShow] = useState(false);
  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)',
          background: c.bgDeep, color: c.text, fontFamily: tokens.font.body,
          fontSize: 12, padding: '6px 10px', borderRadius: tokens.radius.sm, whiteSpace: 'nowrap',
          border: `1px solid ${c.border}`, boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: tokens.zIndex.tooltip, animation: `fadeIn ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
        }}>
          {label}
        </div>
      )}
    </div>
  );
}

// ---------- ACCORDION ----------
function Accordion({ items }) {
  const { c } = useTheme();
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} style={{
            background: c.bgSurface, border: `1px solid ${c.border}`,
            borderRadius: tokens.radius.md, overflow: 'hidden',
          }}>
            <button
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              className="aurora-focusable"
              aria-expanded={isOpen}
              style={{
                width: '100%', background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                fontFamily: tokens.font.body, fontSize: 14, fontWeight: 600, color: c.text,
                minHeight: tokens.touchTarget.min,
              }}
            >
              {item.title}
              <ChevronDown size={16} color={c.textMuted} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: `transform ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}` }} />
            </button>
            {isOpen && (
              <div style={{
                padding: '0 16px 16px', fontSize: 13, color: c.textMuted, lineHeight: 1.6,
                animation: `fadeIn ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
              }}>
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------- SELECT ----------
function Select({ label, options, defaultValue }) {
  const { c } = useTheme();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue || options[0]);
  return (
    <div style={{ position: 'relative' }}>
      {label && <label style={{ display: 'block', fontFamily: tokens.font.body, fontSize: 13, fontWeight: 600, color: c.textMuted, marginBottom: 6 }}>{label}</label>}
      <button
        onClick={() => setOpen(!open)}
        className="aurora-focusable"
        style={{
          width: '100%', background: c.bgDeep, border: `1.5px solid ${open ? c.primary : c.border}`,
          borderRadius: tokens.radius.sm, padding: '11px 14px', color: c.text,
          fontFamily: tokens.font.body, fontSize: 14, display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', cursor: 'pointer', minHeight: tokens.touchTarget.min,
        }}
      >
        {selected}
        <ChevronDown size={15} color={c.textMuted} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: `transform ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}` }} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
          background: c.bgSurfaceRaised, border: `1px solid ${c.border}`,
          borderRadius: tokens.radius.sm, overflow: 'hidden', zIndex: tokens.zIndex.dropdown,
          boxShadow: c.shadowLg, animation: `fadeIn ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
        }}>
          {options.map(opt => (
            <div
              key={opt}
              onClick={() => { setSelected(opt); setOpen(false); }}
              style={{
                padding: '10px 14px', fontSize: 13.5, fontFamily: tokens.font.body, cursor: 'pointer',
                color: opt === selected ? c.glow : c.text,
                background: opt === selected ? `${c.primary}22` : 'transparent',
              }}
              onMouseEnter={e => e.currentTarget.style.background = `${c.primary}33`}
              onMouseLeave={e => e.currentTarget.style.background = opt === selected ? `${c.primary}22` : 'transparent'}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- SWITCH ----------
function Switch({ label, defaultChecked = false }) {
  const { c } = useTheme();
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
      {label && <span style={{ fontFamily: tokens.font.body, fontSize: 14, color: c.text }}>{label}</span>}
      <button
        onClick={() => setChecked(!checked)}
        className="aurora-focusable"
        aria-pressed={checked}
        style={{
          width: 42, height: 24, borderRadius: tokens.radius.full, border: 'none', cursor: 'pointer',
          background: checked ? `linear-gradient(135deg, ${c.primary}, ${c.secondary})` : c.bgSurfaceRaised,
          position: 'relative', transition: `background ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`, flexShrink: 0,
          boxShadow: checked ? `0 0 10px ${c.primary}66` : 'none',
        }}
      >
        <div style={{
          width: 18, height: 18, borderRadius: '50%', background: '#fff',
          position: 'absolute', top: 3, left: checked ? 21 : 3,
          transition: `left ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }} />
      </button>
    </div>
  );
}

// ---------- DROPDOWN MENU ----------
function DropdownMenu({ items }) {
  const { c } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'transparent', border: 'none', cursor: 'pointer', color: c.textMuted,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: tokens.touchTarget.min, height: tokens.touchTarget.min, borderRadius: tokens.radius.full,
          transition: `background ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
        }}
        onMouseEnter={e => e.currentTarget.style.background = c.glowSoft}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <MoreVertical size={18} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', right: 0,
          background: c.bgSurfaceRaised, border: `1px solid ${c.border}`,
          borderRadius: tokens.radius.sm, overflow: 'hidden', zIndex: tokens.zIndex.dropdown, minWidth: 160,
          boxShadow: c.shadowLg, animation: `fadeIn ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
        }}>
          {items.map((item, i) => (
            <div
              key={i}
              onClick={() => { item.onClick?.(); setOpen(false); }}
              style={{
                padding: '10px 14px', fontSize: 13.5, fontFamily: tokens.font.body, cursor: 'pointer',
                color: item.danger ? c.danger : c.text,
                display: 'flex', alignItems: 'center', gap: 8,
              }}
              onMouseEnter={e => e.currentTarget.style.background = `${c.primary}22`}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {item.icon && <item.icon size={14} />}
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- ICON CHIP ----------
function IconChip({ icon: Icon, name }) {
  const { c } = useTheme();
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        padding: '14px 8px', borderRadius: tokens.radius.md,
        background: hover ? c.glowSoft : c.bgSurface,
        border: `1px solid ${hover ? c.glow + '55' : c.border}`,
        transition: 'all 0.15s ease', cursor: 'default',
      }}
    >
      <Icon size={20} strokeWidth={1.75} color={hover ? c.primary : c.textMuted} />
      <span style={{ fontFamily: tokens.font.mono, fontSize: 10, color: c.textFaint, textAlign: 'center', lineHeight: 1.3 }}>{name}</span>
    </div>
  );
}

// ---------- ICON LIBRARY ----------
const ICON_CATEGORIES = [
  {
    label: 'Navegación',
    note: 'Estructura principal de la app — tab bar / sidebar.',
    icons: [
      { Icon: Home, name: 'Home' },
      { Icon: BookOpen, name: 'BookOpen' },
      { Icon: BarChart3, name: 'BarChart3' },
      { Icon: User, name: 'User' },
      { Icon: Settings, name: 'Settings' },
    ],
  },
  {
    label: 'Aprendizaje y práctica',
    note: 'Las cuatro destrezas del idioma + acciones de repaso.',
    icons: [
      { Icon: Mic, name: 'Mic — speaking' },
      { Icon: Volume2, name: 'Volume2 — pronunciación' },
      { Icon: Headphones, name: 'Headphones — listening' },
      { Icon: PenLine, name: 'PenLine — writing' },
      { Icon: MessageCircle, name: 'MessageCircle — conversación' },
      { Icon: Languages, name: 'Languages — traducción' },
      { Icon: RotateCcw, name: 'RotateCcw — reintentar' },
      { Icon: Repeat, name: 'Repeat — repasar' },
    ],
  },
  {
    label: 'Progreso y gamificación',
    note: 'El corazón emocional de Aurora: racha, logros, nivel.',
    icons: [
      { Icon: Flame, name: 'Flame — racha' },
      { Icon: Star, name: 'Star — estrella/XP' },
      { Icon: Trophy, name: 'Trophy — logro' },
      { Icon: Award, name: 'Award — insignia' },
      { Icon: Target, name: 'Target — meta diaria' },
      { Icon: Zap, name: 'Zap — XP rápido' },
      { Icon: TrendingUp, name: 'TrendingUp — progreso' },
      { Icon: Crown, name: 'Crown — nivel top' },
      { Icon: Gem, name: 'Gem — moneda/premium' },
    ],
  },
  {
    label: 'Feedback y estado',
    note: 'Correcto, incorrecto, advertencia — siempre claro, nunca ambiguo.',
    icons: [
      { Icon: Check, name: 'Check' },
      { Icon: CircleCheck, name: 'CircleCheck — correcto' },
      { Icon: X, name: 'X' },
      { Icon: CircleX, name: 'CircleX — incorrecto' },
      { Icon: AlertTriangle, name: 'AlertTriangle — alerta' },
      { Icon: Info, name: 'Info' },
      { Icon: Lightbulb, name: 'Lightbulb — pista/tip' },
    ],
  },
  {
    label: 'Acciones de interfaz',
    note: 'Controles genéricos para listas, reproductor, búsqueda.',
    icons: [
      { Icon: ChevronRight, name: 'ChevronRight' },
      { Icon: ChevronDown, name: 'ChevronDown' },
      { Icon: ArrowRight, name: 'ArrowRight' },
      { Icon: Play, name: 'Play — audio' },
      { Icon: Pause, name: 'Pause' },
      { Icon: Plus, name: 'Plus — agregar' },
      { Icon: Search, name: 'Search' },
      { Icon: Filter, name: 'Filter' },
      { Icon: Bell, name: 'Bell — notificación' },
      { Icon: Trash2, name: 'Trash2' },
      { Icon: MoreVertical, name: 'MoreVertical' },
    ],
  },
  {
    label: 'Social y perfil',
    note: 'Conexión humana dentro de la práctica — quien aprende no está sola.',
    icons: [
      { Icon: Heart, name: 'Heart — favorito/vida' },
      { Icon: Sparkles, name: 'Sparkles — magia/nuevo' },
      { Icon: Share2, name: 'Share2 — compartir logro' },
      { Icon: Users, name: 'Users — comunidad' },
      { Icon: MessageSquare, name: 'MessageSquare — comentario' },
      { Icon: Gift, name: 'Gift — recompensa' },
    ],
  },
];

function IconLibrary() {
  const { c } = useTheme();
  return (
    <div>
      <Card padding={18}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <Lightbulb size={16} color={c.glow} style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 13, color: c.textMuted, lineHeight: 1.6, margin: 0 }}>
            Librería recomendada: <strong style={{ color: c.text }}>Lucide React</strong> (<code style={{ fontFamily: tokens.font.mono, fontSize: 12 }}>npm install lucide-react</code>).
            Trazo fino de 1.5–2px y esquinas redondeadas — combina con el carácter delicado de Aurora sin competir con el glow. Usan <code style={{ fontFamily: tokens.font.mono, fontSize: 12 }}>currentColor</code>, así que heredan el color de tema automáticamente en claro y oscuro.
          </p>
        </div>
      </Card>

      {ICON_CATEGORIES.map(cat => (
        <div key={cat.label} style={{ marginTop: 28 }}>
          <h3 style={{ fontFamily: tokens.font.display, fontSize: 16, fontWeight: 600, color: c.text, marginBottom: 2 }}>{cat.label}</h3>
          <p style={{ fontFamily: tokens.font.body, fontSize: 12.5, color: c.textFaint, marginBottom: 14 }}>{cat.note}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 10 }}>
            {cat.icons.map(item => (
              <IconChip key={item.name} icon={item.Icon} name={item.name} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// REWARD CARDS — sistema de cupones coleccionables
// ============================================

// Cada categoría define: paleta propia (dentro de la familia Aurora),
// nivel de rareza, y una ilustración SVG original dibujada a mano.
const REWARD_CATEGORIES = {
  dinner: {
    label: 'Cena',
    rarity: 'special',
    gradient: ['#FF8FE3', '#C13FCC'],
    Illustration: DinnerIllustration,
  },
  massage: {
    label: 'Masaje',
    rarity: 'special',
    gradient: ['#B794F6', '#7C4DFF'],
    Illustration: MassageIllustration,
  },
  makeup: {
    label: 'Maquillaje',
    rarity: 'rare',
    gradient: ['#FF6FB5', '#FF8FE3'],
    Illustration: MakeupIllustration,
  },
  date: {
    label: 'Plan juntos',
    rarity: 'unique',
    gradient: ['#9D6FFF', '#FF8FE3'],
    Illustration: DateIllustration,
  },
  surprise: {
    label: 'Sorpresa',
    rarity: 'common',
    gradient: ['#7C4DFF', '#C13FCC'],
    Illustration: SurpriseIllustration,
  },
};

const RARITY_LABEL = { common: 'Común', rare: 'Especial', special: 'Especial', unique: 'Única' };

// ---------- ILUSTRACIONES SVG ORIGINALES ----------
// Trazo simple, orgánico, coherente con el lenguaje de Starfield/StreakConstellation.
// Cada una vive dentro de un viewBox 100x100 para componer fácil dentro de la carta.

function DinnerIllustration({ id }) {
  return (
    <g>
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {/* copa de vino */}
      <path d="M 38 28 Q 38 42 50 44 Q 62 42 62 28 Z" fill="none" stroke={`url(#grad-${id})`} strokeWidth="2" strokeLinecap="round" />
      <line x1="50" y1="44" x2="50" y2="62" stroke={`url(#grad-${id})`} strokeWidth="2" strokeLinecap="round" />
      <line x1="41" y1="62" x2="59" y2="62" stroke={`url(#grad-${id})`} strokeWidth="2" strokeLinecap="round" />
      {/* tenedor */}
      <g transform="translate(22, 26)">
        <line x1="0" y1="0" x2="0" y2="34" stroke={`url(#grad-${id})`} strokeWidth="1.8" strokeLinecap="round" />
        <line x1="-3" y1="0" x2="-3" y2="8" stroke={`url(#grad-${id})`} strokeWidth="1.6" strokeLinecap="round" />
        <line x1="3" y1="0" x2="3" y2="8" stroke={`url(#grad-${id})`} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M -3 8 Q 0 12 3 8" fill="none" stroke={`url(#grad-${id})`} strokeWidth="1.6" />
      </g>
      {/* cuchillo */}
      <g transform="translate(78, 26)">
        <line x1="0" y1="0" x2="0" y2="34" stroke={`url(#grad-${id})`} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M -2 0 Q 4 4 0 12 L 0 0 Z" fill={`url(#grad-${id})`} opacity="0.7" />
      </g>
      {/* estrellitas alrededor */}
      <circle cx="20" cy="18" r="1.6" fill="#fff" opacity="0.9" />
      <circle cx="80" cy="20" r="1.2" fill="#fff" opacity="0.7" />
      <circle cx="50" cy="14" r="1.4" fill="#fff" opacity="0.85" />
    </g>
  );
}

function MassageIllustration({ id }) {
  return (
    <g>
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      {/* espiral relajante concéntrica */}
      <circle cx="50" cy="46" r="22" fill="none" stroke={`url(#grad-${id})`} strokeWidth="1.6" opacity="0.5" />
      <circle cx="50" cy="46" r="15" fill="none" stroke={`url(#grad-${id})`} strokeWidth="1.8" opacity="0.7" />
      <circle cx="50" cy="46" r="8" fill="none" stroke={`url(#grad-${id})`} strokeWidth="2" opacity="0.95" />
      {/* gotas/ondas de aroma subiendo */}
      <path d="M 30 24 Q 26 18 30 12 Q 34 18 30 24" fill="none" stroke={`url(#grad-${id})`} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M 70 22 Q 66 15 70 8 Q 74 15 70 22" fill="none" stroke={`url(#grad-${id})`} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="50" cy="46" r="2.4" fill="#fff" />
    </g>
  );
}

function MakeupIllustration({ id }) {
  return (
    <g>
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      {/* espejo de mano */}
      <ellipse cx="44" cy="36" rx="16" ry="20" fill="none" stroke={`url(#grad-${id})`} strokeWidth="2" />
      <line x1="44" y1="56" x2="44" y2="72" stroke={`url(#grad-${id})`} strokeWidth="2" strokeLinecap="round" />
      <line x1="36" y1="72" x2="52" y2="72" stroke={`url(#grad-${id})`} strokeWidth="2" strokeLinecap="round" />
      {/* brocha */}
      <g transform="translate(68, 22) rotate(35)">
        <rect x="-2" y="0" width="4" height="22" rx="2" fill={`url(#grad-${id})`} opacity="0.85" />
        <ellipse cx="0" cy="-4" rx="5" ry="7" fill={`url(#grad-${id})`} opacity="0.95" />
      </g>
      {/* chispas */}
      <circle cx="26" cy="20" r="1.4" fill="#fff" opacity="0.9" />
      <circle cx="78" cy="50" r="1.2" fill="#fff" opacity="0.8" />
    </g>
  );
}

function DateIllustration({ id }) {
  return (
    <g>
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      {/* dos lunas entrelazadas */}
      <path d="M 38 24 A 16 16 0 1 0 38 56 A 12 12 0 1 1 38 24 Z" fill={`url(#grad-${id})`} opacity="0.85" />
      <path d="M 62 24 A 16 16 0 1 1 62 56 A 12 12 0 1 0 62 24 Z" fill="none" stroke={`url(#grad-${id})`} strokeWidth="1.8" opacity="0.9" />
      {/* estrella uniendo */}
      <circle cx="50" cy="40" r="2" fill="#fff" />
      <circle cx="50" cy="16" r="1.3" fill="#fff" opacity="0.8" />
      <circle cx="50" cy="64" r="1.3" fill="#fff" opacity="0.8" />
    </g>
  );
}

function SurpriseIllustration({ id }) {
  return (
    <g>
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      {/* caja de regalo */}
      <rect x="32" y="38" width="36" height="28" rx="2" fill="none" stroke={`url(#grad-${id})`} strokeWidth="2" />
      <line x1="32" y1="50" x2="68" y2="50" stroke={`url(#grad-${id})`} strokeWidth="1.8" />
      <line x1="50" y1="38" x2="50" y2="66" stroke={`url(#grad-${id})`} strokeWidth="1.8" />
      {/* moño */}
      <path d="M 50 38 Q 40 28 32 32 Q 36 40 50 38" fill={`url(#grad-${id})`} opacity="0.8" />
      <path d="M 50 38 Q 60 28 68 32 Q 64 40 50 38" fill={`url(#grad-${id})`} opacity="0.8" />
      {/* constelación arriba */}
      <circle cx="38" cy="16" r="1.6" fill="#fff" opacity="0.9" />
      <circle cx="50" cy="10" r="1.3" fill="#fff" opacity="0.8" />
      <circle cx="62" cy="16" r="1.6" fill="#fff" opacity="0.9" />
      <line x1="38" y1="16" x2="50" y2="10" stroke="#fff" strokeWidth="0.6" opacity="0.5" />
      <line x1="50" y1="10" x2="62" y2="16" stroke="#fff" strokeWidth="0.6" opacity="0.5" />
    </g>
  );
}

// ---------- REWARD CARD (carta coleccionable) ----------
function RewardCard({ category = 'dinner', title, subtitle, code, size = 220 }) {
  const { c, mode } = useTheme();
  const cardId = useRef(`card-${Math.random().toString(36).slice(2, 9)}`).current;
  const cat = REWARD_CATEGORIES[category];
  const [g1, g2] = cat.gradient;
  const Illustration = cat.Illustration;
  const rarityRing = cat.rarity === 'unique' ? 3 : cat.rarity === 'common' ? 1.5 : 2;

  // Construye el SVG completo de la carta como string — así se puede
  // descargar como archivo .svg sin depender de librerías externas
  // de captura de pantalla (html2canvas, etc.) que no están disponibles aquí.
  function buildSvgString() {
    const w = 320, h = 460;
    const bgBase = mode === 'dark' ? '#1A0E2E' : '#FBF7FF';
    const textColor = mode === 'dark' ? '#F5F0FF' : '#2B1B42';
    const mutedColor = mode === 'dark' ? '#B8A9D9' : '#6B5A85';

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="cardBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${g1}" />
      <stop offset="100%" stop-color="${g2}" />
    </linearGradient>
    <radialGradient id="illusBg" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="${g2}" stop-opacity="0.9" />
      <stop offset="100%" stop-color="${g1}" stop-opacity="0.5" />
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" rx="24" fill="${bgBase}" />
  <rect x="3" y="3" width="${w - 6}" height="${h - 6}" rx="21" fill="none" stroke="url(#cardBg)" stroke-width="${rarityRing * 2}" />
  <rect x="20" y="20" width="${w - 40}" height="${h - 110}" rx="16" fill="url(#illusBg)" />
  <g transform="translate(${w / 2 - 60}, 60) scale(1.2)">
    ${renderIllustrationToString(category, cardId)}
  </g>
  <text x="${w / 2}" y="${h - 168}" text-anchor="middle" font-family="Georgia, serif" font-size="13" letter-spacing="3" fill="#ffffffcc">${cat.label.toUpperCase()} · ${RARITY_LABEL[cat.rarity].toUpperCase()}</text>
  <text x="${w / 2}" y="${h - 120}" text-anchor="middle" font-family="Georgia, serif" font-size="24" font-weight="600" fill="${textColor}">${escapeXml(title)}</text>
  <text x="${w / 2}" y="${h - 92}" text-anchor="middle" font-family="Arial, sans-serif" font-size="12.5" fill="${mutedColor}">${escapeXml(subtitle)}</text>
  <line x1="32" y1="${h - 64}" x2="${w - 32}" y2="${h - 64}" stroke="${mutedColor}" stroke-opacity="0.3" stroke-dasharray="3,4" />
  <text x="${w / 2}" y="${h - 38}" text-anchor="middle" font-family="'Courier New', monospace" font-size="13" letter-spacing="2" fill="${textColor}">${escapeXml(code)}</text>
  <text x="${w / 2}" y="${h - 18}" text-anchor="middle" font-family="Arial, sans-serif" font-size="9.5" letter-spacing="1.5" fill="${mutedColor}">AURORA · CARTA DE RECOMPENSA</text>
</svg>`;
  }

  function handleDownload() {
    const svgString = buildSvgString();
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aurora-carta-${category}-${code}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div
        style={{
          width: size, height: size * 1.44,
          borderRadius: 20,
          background: mode === 'dark' ? c.bgDeep : '#FFFFFF',
          border: `${rarityRing}px solid transparent`,
          backgroundImage: `linear-gradient(${mode === 'dark' ? c.bgDeep : '#FFFFFF'}, ${mode === 'dark' ? c.bgDeep : '#FFFFFF'}), linear-gradient(135deg, ${g1}, ${g2})`,
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          boxShadow: `0 12px 36px ${g2}44, ${c.shadowLg}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: 16, position: 'relative', overflow: 'hidden',
        }}
      >
        {/* halo de fondo de la ilustración */}
        <div style={{
          width: '100%', aspectRatio: '1.1', borderRadius: 14, marginBottom: 12,
          background: `radial-gradient(circle at 50% 40%, ${g2}, ${g1})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <Starfield density={10} />
          <svg viewBox="0 0 100 100" width="62%" height="62%" style={{ position: 'relative' }}>
            <Illustration id={cardId} />
          </svg>
        </div>

        <span style={{
          fontFamily: tokens.font.mono, fontSize: 9.5, letterSpacing: 2, color: '#ffffffaa',
          marginBottom: 4, textAlign: 'center',
        }}>
          {cat.label.toUpperCase()} · {RARITY_LABEL[cat.rarity].toUpperCase()}
        </span>
        <h3 style={{ fontFamily: tokens.font.display, fontSize: 17, fontWeight: 600, color: c.text, textAlign: 'center', margin: '0 0 4px', lineHeight: 1.2 }}>
          {title}
        </h3>
        <p style={{ fontFamily: tokens.font.body, fontSize: 11, color: c.textMuted, textAlign: 'center', margin: '0 0 10px', lineHeight: 1.4 }}>
          {subtitle}
        </p>
        <div style={{ width: '100%', borderTop: `1px dashed ${c.border}`, marginBottom: 8 }} />
        <span style={{ fontFamily: tokens.font.mono, fontSize: 11.5, letterSpacing: 1.5, color: c.text }}>{code}</span>
      </div>
      <Button variant="secondary" size="sm" icon={Download} onClick={handleDownload}>Descargar carta</Button>
    </div>
  );
}

// Renderiza la misma ilustración pero como string SVG plano, para incrustar en el archivo descargable
function renderIllustrationToString(category, id) {
  const paths = {
    dinner: `<g>
      <path d="M 38 28 Q 38 42 50 44 Q 62 42 62 28 Z" fill="none" stroke="#ffffffdd" stroke-width="2" stroke-linecap="round" />
      <line x1="50" y1="44" x2="50" y2="62" stroke="#ffffffdd" stroke-width="2" stroke-linecap="round" />
      <line x1="41" y1="62" x2="59" y2="62" stroke="#ffffffdd" stroke-width="2" stroke-linecap="round" />
      <line x1="22" y1="26" x2="22" y2="60" stroke="#ffffffdd" stroke-width="1.8" stroke-linecap="round" />
      <line x1="19" y1="26" x2="19" y2="34" stroke="#ffffffdd" stroke-width="1.6" stroke-linecap="round" />
      <line x1="25" y1="26" x2="25" y2="34" stroke="#ffffffdd" stroke-width="1.6" stroke-linecap="round" />
      <line x1="78" y1="26" x2="78" y2="60" stroke="#ffffffdd" stroke-width="1.8" stroke-linecap="round" />
      <circle cx="20" cy="18" r="1.6" fill="#fff" opacity="0.9" />
      <circle cx="80" cy="20" r="1.2" fill="#fff" opacity="0.7" />
    </g>`,
    massage: `<g>
      <circle cx="50" cy="46" r="22" fill="none" stroke="#ffffffaa" stroke-width="1.6" opacity="0.5" />
      <circle cx="50" cy="46" r="15" fill="none" stroke="#ffffffcc" stroke-width="1.8" opacity="0.7" />
      <circle cx="50" cy="46" r="8" fill="none" stroke="#ffffffee" stroke-width="2" />
      <path d="M 30 24 Q 26 18 30 12 Q 34 18 30 24" fill="none" stroke="#ffffffcc" stroke-width="1.6" stroke-linecap="round" />
      <path d="M 70 22 Q 66 15 70 8 Q 74 15 70 22" fill="none" stroke="#ffffffcc" stroke-width="1.6" stroke-linecap="round" />
      <circle cx="50" cy="46" r="2.4" fill="#fff" />
    </g>`,
    makeup: `<g>
      <ellipse cx="44" cy="36" rx="16" ry="20" fill="none" stroke="#ffffffdd" stroke-width="2" />
      <line x1="44" y1="56" x2="44" y2="72" stroke="#ffffffdd" stroke-width="2" stroke-linecap="round" />
      <line x1="36" y1="72" x2="52" y2="72" stroke="#ffffffdd" stroke-width="2" stroke-linecap="round" />
      <g transform="translate(68, 22) rotate(35)">
        <rect x="-2" y="0" width="4" height="22" rx="2" fill="#ffffffdd" />
        <ellipse cx="0" cy="-4" rx="5" ry="7" fill="#ffffffee" />
      </g>
      <circle cx="26" cy="20" r="1.4" fill="#fff" opacity="0.9" />
      <circle cx="78" cy="50" r="1.2" fill="#fff" opacity="0.8" />
    </g>`,
    date: `<g>
      <path d="M 38 24 A 16 16 0 1 0 38 56 A 12 12 0 1 1 38 24 Z" fill="#ffffffdd" />
      <path d="M 62 24 A 16 16 0 1 1 62 56 A 12 12 0 1 0 62 24 Z" fill="none" stroke="#ffffffee" stroke-width="1.8" />
      <circle cx="50" cy="40" r="2" fill="#fff" />
      <circle cx="50" cy="16" r="1.3" fill="#fff" opacity="0.8" />
      <circle cx="50" cy="64" r="1.3" fill="#fff" opacity="0.8" />
    </g>`,
    surprise: `<g>
      <rect x="32" y="38" width="36" height="28" rx="2" fill="none" stroke="#ffffffdd" stroke-width="2" />
      <line x1="32" y1="50" x2="68" y2="50" stroke="#ffffffcc" stroke-width="1.8" />
      <line x1="50" y1="38" x2="50" y2="66" stroke="#ffffffcc" stroke-width="1.8" />
      <path d="M 50 38 Q 40 28 32 32 Q 36 40 50 38" fill="#ffffffcc" />
      <path d="M 50 38 Q 60 28 68 32 Q 64 40 50 38" fill="#ffffffcc" />
      <circle cx="38" cy="16" r="1.6" fill="#fff" opacity="0.9" />
      <circle cx="62" cy="16" r="1.6" fill="#fff" opacity="0.9" />
    </g>`,
  };
  return paths[category] || paths.surprise;
}

function escapeXml(str = '') {
  return String(str).replace(/[<>&'"]/g, ch => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[ch]));
}

// ---------- PARTICLE BURST (confeti tipo estrella, para la celebración) ----------
function ParticleBurst({ colors }) {
  const [particles] = useState(() =>
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      angle: (i / 24) * 360 + Math.random() * 15,
      distance: 60 + Math.random() * 90,
      size: Math.random() * 4 + 3,
      delay: Math.random() * 0.15,
      duration: 0.9 + Math.random() * 0.6,
      color: colors[i % colors.length],
      isStar: Math.random() > 0.5,
    }))
  );
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map(p => {
        const rad = (p.angle * Math.PI) / 180;
        const x = Math.cos(rad) * p.distance;
        const y = Math.sin(rad) * p.distance;
        return (
          <div
            key={p.id}
            style={{
              position: 'absolute', top: '50%', left: '50%',
              width: p.size, height: p.size,
              background: p.color,
              borderRadius: p.isStar ? '2px' : '50%',
              transform: `rotate(${p.angle}deg)`,
              animation: `burstOut${p.id % 4} ${p.duration}s ${p.delay}s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
              opacity: 0,
              '--tx': `${x}px`,
              '--ty': `${y}px`,
            }}
          />
        );
      })}
      <style>{`
        ${[0, 1, 2, 3].map(i => `
          @keyframes burstOut${i} {
            0% { opacity: 1; transform: translate(-50%, -50%) scale(0.4); }
            70% { opacity: 1; }
            100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1); opacity: 0; }
          }
        `).join('\n')}
      `}</style>
    </div>
  );
}

// ---------- REWARD UNLOCK MODAL (celebración al ganar una carta) ----------
function RewardUnlockModal({ open, onClose, category = 'dinner', title, subtitle, code, onSaveToVault }) {
  const { c } = useTheme();
  const [revealed, setRevealed] = useState(false);
  const cat = REWARD_CATEGORIES[category];

  useEffect(() => {
    if (open) {
      setRevealed(false);
      const t = setTimeout(() => setRevealed(true), 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(8,4,16,0.82)',
        backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: tokens.zIndex.modal, padding: 20,
        animation: `fadeIn ${tokens.motion.duration.base} ${tokens.motion.easing.standard}`,
      }}
    >
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          {revealed && <ParticleBurst colors={[cat.gradient[0], cat.gradient[1], '#FFFFFF']} />}
          <div style={{
            animation: revealed ? `cardPop ${tokens.motion.duration.slow} ${tokens.motion.easing.bounce}` : 'none',
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'scale(1)' : 'scale(0.6)',
            transition: revealed ? 'none' : `opacity ${tokens.motion.duration.fast} ease`,
          }}>
            <RewardCard category={category} title={title} subtitle={subtitle} code={code} size={230} />
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, maxWidth: 300 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 8 }}>
            <PartyPopper size={18} color={c.glow} />
            <span style={{ fontFamily: tokens.font.mono, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: c.glow }}>Nueva carta desbloqueada</span>
          </div>
          <p style={{ fontFamily: tokens.font.body, fontSize: 13.5, color: '#F5F0FFcc', lineHeight: 1.5, marginBottom: 22 }}>
            Completaste el módulo. Esta carta es tuya — guárdala en tu bóveda o descárgala ahora.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <Button variant="secondary" onClick={onClose}>Seguir luego</Button>
            <Button variant="glow" icon={Gem} onClick={() => { onSaveToVault?.(); onClose(); }}>Guardar en bóveda</Button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes cardPop {
          0% { transform: scale(0.6) rotate(-4deg); opacity: 0; }
          60% { transform: scale(1.05) rotate(2deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ---------- REWARD VAULT (la colección/bóveda de cartas ganadas) ----------
function RewardCardMini({ category, title, onClick }) {
  const { c } = useTheme();
  const cat = REWARD_CATEGORIES[category];
  const [g1, g2] = cat.gradient;
  const Illustration = cat.Illustration;
  const id = useRef(`mini-${Math.random().toString(36).slice(2, 9)}`).current;

  return (
    <button
      onClick={onClick}
      className="aurora-focusable"
      style={{
        aspectRatio: '0.69', borderRadius: 16, border: 'none', cursor: 'pointer', padding: 10,
        background: `linear-gradient(160deg, ${g2}, ${g1})`,
        boxShadow: `0 6px 18px ${g2}44`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
        transition: `transform ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
    >
      <svg viewBox="0 0 100 100" width="56%" height="56%">
        <Illustration id={id} />
      </svg>
      <span style={{ fontFamily: tokens.font.body, fontSize: 10.5, fontWeight: 600, color: '#fff', textAlign: 'center', lineHeight: 1.3, padding: '0 4px' }}>
        {title}
      </span>
    </button>
  );
}

function RewardVault({ items }) {
  const { c } = useTheme();
  const [selected, setSelected] = useState(null);
  const earned = items.filter(i => i.earned);
  const locked = items.filter(i => !i.earned);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Gem}
        title="Tu bóveda está vacía"
        description="Completa un módulo de práctica para ganar tu primera carta de recompensa."
      />
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <span style={{ fontFamily: tokens.font.mono, fontSize: 12, color: c.textMuted }}>
          {earned.length} de {items.length} cartas ganadas
        </span>
        <ProgressBarMini value={earned.length} max={items.length} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 12 }}>
        {earned.map((item, i) => (
          <RewardCardMini key={i} category={item.category} title={item.title} onClick={() => setSelected(item)} />
        ))}
        {locked.map((item, i) => (
          <div
            key={`locked-${i}`}
            style={{
              aspectRatio: '0.69', borderRadius: 16,
              border: `2px dashed ${c.border}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: c.bgSurface, padding: 10,
            }}
          >
            <Lock size={18} color={c.textFaint} />
            <span style={{ fontFamily: tokens.font.mono, fontSize: 9.5, color: c.textFaint, textAlign: 'center', lineHeight: 1.3 }}>
              {item.unlockHint || 'Sigue practicando'}
            </span>
          </div>
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
            <RewardCard category={selected.category} title={selected.title} subtitle={selected.subtitle} code={selected.code} size={210} />
          </div>
        )}
      </Modal>
    </div>
  );
}

// Barra de progreso compacta solo para el header de la bóveda
function ProgressBarMini({ value, max }) {
  const { c } = useTheme();
  const pct = (value / max) * 100;
  return (
    <div style={{ width: 100, height: 6, background: c.bgDeep, borderRadius: tokens.radius.full, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${c.secondary}, ${c.glow})`, borderRadius: tokens.radius.full }} />
    </div>
  );
}

// ---------- MOTION DEMO ----------
function MotionDemo() {
  const { c } = useTheme();
  const [runId, setRunId] = useState(0);

  return (
    <Card padding={20}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span style={{ fontFamily: tokens.font.mono, fontSize: 11, color: c.textFaint, textTransform: 'uppercase' }}>Demo en vivo</span>
        <Button variant="secondary" size="sm" onClick={() => setRunId(id => id + 1)}>Reproducir</Button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {Object.entries(tokens.motion.easing).map(([name, value]) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: tokens.font.body, fontSize: 12, color: c.textMuted, width: 90, flexShrink: 0 }}>{name}</span>
            <div style={{ flex: 1, height: 28, background: c.bgDeep, borderRadius: tokens.radius.full, position: 'relative', overflow: 'hidden' }}>
              <div
                key={runId}
                style={{
                  position: 'absolute', top: 4, left: 4, width: 20, height: 20, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${c.glow}, ${c.primary})`,
                  boxShadow: `0 0 10px ${c.glow}88`,
                  animation: `motionTrack ${tokens.motion.duration.slow} ${value} 1`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes motionTrack {
          from { left: 4px; }
          to { left: calc(100% - 24px); }
        }
      `}</style>
    </Card>
  );
}

// ---------- TOKEN SWATCH (for showcase) ----------
function Swatch({ name, hex }) {
  const { c } = useTheme();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: hex, border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }} />
      <div>
        <div style={{ fontFamily: tokens.font.body, fontSize: 12, fontWeight: 600, color: c.text }}>{name}</div>
        <div style={{ fontFamily: tokens.font.mono, fontSize: 11, color: c.textFaint }}>{hex}</div>
      </div>
    </div>
  );
}

// ---------- SECTION WRAPPER ----------
// ---------- CODE BLOCK ----------
function CodeBlock({ code }) {
  const { c } = useTheme();
  return (
    <pre style={{
      background: c.bgDeep,
      border: `1px solid ${c.border}`,
      borderRadius: tokens.radius.sm,
      padding: '14px 16px',
      overflowX: 'auto',
      margin: 0,
    }}>
      <code style={{ fontFamily: tokens.font.mono, fontSize: 12.5, color: c.text, lineHeight: 1.6, whiteSpace: 'pre' }}>{code}</code>
    </pre>
  );
}

// ---------- DO / DON'T ----------
function DoDont({ doText, dontText }) {
  const { c } = useTheme();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
      <div style={{
        background: `${c.success}11`, border: `1px solid ${c.success}44`,
        borderRadius: tokens.radius.md, padding: 14, display: 'flex', gap: 10,
      }}>
        <CircleCheck size={17} color={c.success} style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontFamily: tokens.font.body, fontSize: 13, color: c.text, margin: 0, lineHeight: 1.5 }}>{doText}</p>
      </div>
      <div style={{
        background: `${c.danger}11`, border: `1px solid ${c.danger}44`,
        borderRadius: tokens.radius.md, padding: 14, display: 'flex', gap: 10,
      }}>
        <CircleX size={17} color={c.danger} style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontFamily: tokens.font.body, fontSize: 13, color: c.text, margin: 0, lineHeight: 1.5 }}>{dontText}</p>
      </div>
    </div>
  );
}

// ============================================
// LAYOUT PRIMITIVES
// Los bloques de construcción de cualquier pantalla nueva — evitan que cada
// pantalla reinvente su propio flex/grid a mano con valores sueltos.
// ============================================

// ---------- PAGE ----------
// Wrapper de pantalla completa: fondo con gradiente de tema + starfield + safe area.
// Toda pantalla real de la app debería empezar envolviendo su contenido en <Page>.
function Page({ children, starDensity, padding = '24px' }) {
  const { mode, c } = useTheme();
  return (
    <div style={{
      minHeight: '100vh',
      background: mode === 'dark'
        ? `radial-gradient(ellipse at top, ${c.bgSurface} 0%, ${c.bgDeep} 60%)`
        : `radial-gradient(ellipse at top, #FFFFFF 0%, ${c.bgDeep} 70%)`,
      color: c.text,
      fontFamily: tokens.font.body,
      position: 'relative',
      transition: `background ${tokens.motion.duration.base} ${tokens.motion.easing.standard}`,
    }}>
      <Starfield density={starDensity ?? (mode === 'dark' ? 50 : 26)} />
      <div style={{ position: 'relative', padding, paddingTop: `max(${padding}, env(safe-area-inset-top))`, paddingBottom: `max(${padding}, env(safe-area-inset-bottom))` }}>
        {children}
      </div>
    </div>
  );
}

// ---------- CONTAINER ----------
// Limita el ancho de contenido y lo centra — mismo límite en toda la app.
function Container({ children, size = 'lg' }) {
  return (
    <div style={{ maxWidth: tokens.container[size], margin: '0 auto', width: '100%' }}>
      {children}
    </div>
  );
}

// ---------- STACK ----------
// Apila elementos vertical (default) u horizontalmente con gap consistente.
// Reemplaza el patrón repetido `display:flex, flexDirection, gap` por toda la app.
function Stack({ children, direction = 'vertical', gap = 3, align, justify, wrap = false }) {
  const gapPx = typeof gap === 'number' ? tokens.space[gap] : gap;
  return (
    <div style={{
      display: 'flex',
      flexDirection: direction === 'horizontal' ? 'row' : 'column',
      gap: gapPx,
      alignItems: align,
      justifyContent: justify,
      flexWrap: wrap ? 'wrap' : 'nowrap',
    }}>
      {children}
    </div>
  );
}

// ---------- GRID ----------
// Grilla responsive: columnas fijas o auto-fit con ancho mínimo.
function Grid({ children, columns, minColWidth = 200, gap = 3 }) {
  const gapPx = typeof gap === 'number' ? tokens.space[gap] : gap;
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: columns ? `repeat(${columns}, 1fr)` : `repeat(auto-fit, minmax(${minColWidth}px, 1fr))`,
      gap: gapPx,
    }}>
      {children}
    </div>
  );
}

// ---------- SPACER ----------
// Espaciador flexible simple, para separar secciones sin un margin suelto.
function Spacer({ size = 6, axis = 'vertical' }) {
  const px = typeof size === 'number' ? tokens.space[size] : size;
  return <div style={{ [axis === 'vertical' ? 'height' : 'width']: px, flexShrink: 0 }} />;
}

function Section({ title, subtitle, children }) {
  const { c } = useTheme();
  return (
    <div style={{ marginBottom: 56 }}>
      <h2 style={{ fontFamily: tokens.font.display, fontSize: 22, fontWeight: 600, color: c.text, marginBottom: 4 }}>{title}</h2>
      {subtitle && <p style={{ fontFamily: tokens.font.body, fontSize: 13, color: c.textMuted, marginBottom: 20, maxWidth: 520 }}>{subtitle}</p>}
      {children}
    </div>
  );
}

// ============================================
// MAIN SHOWCASE
// ============================================
export default function AuroraDesignSystem() {
  const [mode, setMode] = useState('dark');
  const c = themes[mode];

  return (
    <ThemeContext.Provider value={{ mode, c }}>
      <AuroraApp mode={mode} setMode={setMode} />
    </ThemeContext.Provider>
  );
}

function AuroraApp({ mode, setMode }) {
  const { c } = useTheme();
  const [tab, setTab] = useState('overview');
  const [modalOpen, setModalOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [vaultItems, setVaultItems] = useState([
    { earned: true, category: 'surprise', title: 'Helado de tu sabor favorito', subtitle: 'Por completar tu primer módulo', code: 'AURORA-001' },
    { earned: false, unlockHint: 'Completa el módulo de Phrasal Verbs' },
    { earned: false, unlockHint: 'Llega a 7 días de racha' },
    { earned: false, unlockHint: 'Completa 5 módulos' },
  ]);

  function unlockNextCard() {
    setVaultItems(items => {
      const idx = items.findIndex(i => !i.earned);
      if (idx === -1) return items;
      const next = [...items];
      next[idx] = { earned: true, category: 'dinner', title: 'Cena en tu lugar favorito', subtitle: 'Por completar el módulo de Phrasal Verbs', code: `AURORA-00${idx + 1}` };
      return next;
    });
  }

  return (
    <Page padding="0" starDensity={mode === 'dark' ? 50 : 26}>
      <style>{`
        ${FONT_IMPORT}
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.4); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, 16px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes skeletonShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        * { box-sizing: border-box; }
        ::selection { background: ${c.glow}55; }

        /* Foco accesible: visible solo en navegación por teclado, nunca por click */
        .aurora-focusable { outline: none; }
        .aurora-focusable:focus-visible {
          box-shadow: ${focusRingStyle(c)};
        }
        button.aurora-focusable:focus-visible,
        a.aurora-focusable:focus-visible {
          border-radius: ${tokens.radius.sm};
        }

        /* Respeta la preferencia del sistema operativo de reducir movimiento */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      {/* THEME TOGGLE */}
      <button
        onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
        className="aurora-focusable"
        aria-label={mode === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
        style={{
          position: 'absolute', top: 20, right: 20, zIndex: tokens.zIndex.sticky,
          display: 'flex', alignItems: 'center', gap: 6,
          background: c.bgSurfaceRaised, border: `1px solid ${c.border}`,
          borderRadius: tokens.radius.full, padding: '8px 14px', cursor: 'pointer',
          fontFamily: tokens.font.body, fontSize: 12.5, fontWeight: 600, color: c.text,
          boxShadow: c.shadow, minHeight: 38,
          transition: `transform ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
        }}
      >
        {mode === 'dark' ? '☀️ Claro' : '🌙 Oscuro'}
      </button>

      {/* HERO */}
      <header style={{ position: 'relative', padding: '64px 24px 40px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          <Sparkles size={16} color={c.glow} />
          <span style={{ fontFamily: tokens.font.mono, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: c.glow }}>Design System</span>
        </div>
        <h1 style={{
          fontFamily: tokens.font.display, fontWeight: 700, fontSize: 'clamp(36px, 6vw, 56px)',
          background: c.heroGradient,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          margin: 0, letterSpacing: -1,
        }}>
          Aurora
        </h1>
        <p style={{ fontFamily: tokens.font.body, fontSize: 15, color: c.textMuted, maxWidth: 460, margin: '12px auto 0' }}>
          Cada palabra que aprendes enciende una estrella. Un sistema de diseño para práctica diaria de inglés.
        </p>
      </header>

      {/* NAV */}
      <nav style={{ position: 'relative', display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 48, flexWrap: 'wrap', padding: '0 16px' }}>
        {['overview', 'tokens', 'system', 'layout', 'components', 'forms', 'rewards', 'advanced', 'icons', 'guide', 'demo'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="aurora-focusable"
            aria-current={tab === t ? 'page' : undefined}
            style={{
              fontFamily: tokens.font.body, fontSize: 13, fontWeight: 600, textTransform: 'capitalize',
              padding: '8px 18px', borderRadius: tokens.radius.full, border: 'none', cursor: 'pointer',
              background: tab === t ? c.primary : 'transparent',
              color: tab === t ? '#fff' : c.textMuted,
              transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
              minHeight: 36,
            }}
          >
            {t === 'overview' ? 'Resumen' : t === 'tokens' ? 'Tokens' : t === 'system' ? 'Sistema' : t === 'layout' ? 'Layout' : t === 'components' ? 'Componentes' : t === 'forms' ? 'Formularios' : t === 'rewards' ? 'Recompensas' : t === 'advanced' ? 'Avanzados' : t === 'icons' ? 'Iconos' : t === 'guide' ? 'Guía' : 'Demo'}
          </button>
        ))}
      </nav>

      <main style={{ position: 'relative', padding: '0 24px 80px' }}>
        <Container size="lg">

        {tab === 'overview' && (
          <>
            <Section title="La pieza firma" subtitle="El componente de racha es el corazón emocional del sistema: convierte la constancia diaria en algo visible y luminoso.">
              <div style={{ maxWidth: 420 }}>
                <StreakConstellation lit={4} total={7} />
              </div>
            </Section>
            <Section title="Principios" subtitle="Tres reglas que guían cada decisión visual.">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                {[
                  { t: 'El brillo se gana', d: 'El glow (#FF8FE3) aparece solo en momentos de logro: racha activa, respuesta correcta, nivel completado. Nunca decorativo porque sí.' },
                  { t: 'Noche profunda, no pastel', d: 'El fondo es un violeta-noche oscuro, no un rosa claro plano. Así cada acento brilla de verdad, como estrellas en el cielo.' },
                  { t: 'Serif con calidez', d: 'Fraunces en títulos da un toque editorial y humano frente al típico sans-serif frío de las apps de productividad.' },
                ].map((p, i) => (
                  <Card key={i}>
                    <h3 style={{ fontFamily: tokens.font.display, fontSize: 17, fontWeight: 600, marginBottom: 8 }}>{p.t}</h3>
                    <p style={{ fontSize: 13, color: c.textMuted, lineHeight: 1.5, margin: 0 }}>{p.d}</p>
                  </Card>
                ))}
              </div>
            </Section>
          </>
        )}

        {tab === 'tokens' && (
          <>
            <Section title="Color" subtitle="Paleta violeta-magenta sobre fondo noche. El glow rosa se reserva para estados de logro.">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                <Swatch name="Background Deep" hex={c.bgDeep} />
                <Swatch name="Surface" hex={c.bgSurface} />
                <Swatch name="Surface Raised" hex={c.bgSurfaceRaised} />
                <Swatch name="Primary" hex={c.primary} />
                <Swatch name="Secondary" hex={c.secondary} />
                <Swatch name="Glow" hex={c.glow} />
                <Swatch name="Success" hex={c.success} />
                <Swatch name="Warning" hex={c.warning} />
                <Swatch name="Danger" hex={c.danger} />
                <Swatch name="Text" hex={c.text} />
                <Swatch name="Text Muted" hex={c.textMuted} />
                <Swatch name="Border" hex={c.border} />
              </div>
            </Section>

            <Section title="Tipografía" subtitle="Fraunces (display) + Inter (UI) + JetBrains Mono (datos/contadores).">
              <Card>
                <div style={{ marginBottom: 18 }}>
                  <span style={{ fontFamily: tokens.font.mono, fontSize: 11, color: c.textFaint, textTransform: 'uppercase' }}>Display — Fraunces 600</span>
                  <div style={{ fontFamily: tokens.font.display, fontSize: 34, fontWeight: 600 }}>Practica un poco hoy</div>
                </div>
                <div style={{ marginBottom: 18 }}>
                  <span style={{ fontFamily: tokens.font.mono, fontSize: 11, color: c.textFaint, textTransform: 'uppercase' }}>Body — Inter 400/600</span>
                  <div style={{ fontFamily: tokens.font.body, fontSize: 15, color: c.textMuted }}>Diez minutos al día construyen fluidez real.</div>
                </div>
                <div>
                  <span style={{ fontFamily: tokens.font.mono, fontSize: 11, color: c.textFaint, textTransform: 'uppercase' }}>Mono — JetBrains Mono 600</span>
                  <div style={{ fontFamily: tokens.font.mono, fontSize: 15, color: c.glow }}>STREAK · 4 DAYS · 87%</div>
                </div>
              </Card>
            </Section>

            <Section title="Espaciado & radios" subtitle="Escala base 4px. Radios generosos para sensación amigable.">
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                <Card>
                  <div style={{ fontFamily: tokens.font.mono, fontSize: 11, color: c.textFaint, marginBottom: 10 }}>SPACE SCALE (px)</div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}>
                    {tokens.space.slice(1).map(s => (
                      <div key={s} style={{ width: s, height: s, background: c.primary, borderRadius: 3 }} title={`${s}px`} />
                    ))}
                  </div>
                </Card>
                <Card>
                  <div style={{ fontFamily: tokens.font.mono, fontSize: 11, color: c.textFaint, marginBottom: 10 }}>RADIUS</div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {Object.entries(tokens.radius).map(([k, v]) => (
                      <div key={k} style={{ textAlign: 'center' }}>
                        <div style={{ width: 40, height: 40, background: c.secondary, borderRadius: v }} />
                        <span style={{ fontFamily: tokens.font.mono, fontSize: 10, color: c.textFaint }}>{k}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </Section>
          </>
        )}

        {tab === 'layout' && (
          <>
            <Section title="Page" subtitle="Wrapper de pantalla completa — fondo con gradiente de tema, starfield y safe area. Toda pantalla nueva de la app empieza aquí, así el fondo nunca se reimplementa a mano.">
              <CodeBlock code={`<Page>\n  <Container size="md">\n    {/* contenido de la pantalla */}\n  </Container>\n</Page>`} />
            </Section>

            <Section title="Container" subtitle="Limita el ancho de contenido y lo centra — mismo límite en toda la app, no un maxWidth distinto por pantalla.">
              <Stack gap={3}>
                {Object.entries(tokens.container).filter(([k]) => k !== 'full').map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontFamily: tokens.font.mono, fontSize: 11, color: c.textFaint, width: 70, flexShrink: 0 }}>{key}</span>
                    <div style={{ maxWidth: value, width: '100%', height: 28, background: c.glowSoft, border: `1px dashed ${c.glow}88`, borderRadius: tokens.radius.sm, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: tokens.font.mono, fontSize: 10.5, color: c.textMuted }}>{value}</span>
                    </div>
                  </div>
                ))}
              </Stack>
            </Section>

            <Section title="Stack" subtitle="Apila elementos vertical u horizontal con gap consistente — reemplaza el flex/gap repetido a mano en cada componente.">
              <Grid minColWidth={260} gap={4}>
                <Card>
                  <span style={{ fontFamily: tokens.font.mono, fontSize: 11, color: c.textFaint, display: 'block', marginBottom: 10 }}>direction="vertical" (default)</span>
                  <Stack gap={2}>
                    <div style={{ height: 28, borderRadius: 6, background: c.glowSoft }} />
                    <div style={{ height: 28, borderRadius: 6, background: c.glowSoft }} />
                    <div style={{ height: 28, borderRadius: 6, background: c.glowSoft }} />
                  </Stack>
                </Card>
                <Card>
                  <span style={{ fontFamily: tokens.font.mono, fontSize: 11, color: c.textFaint, display: 'block', marginBottom: 10 }}>direction="horizontal"</span>
                  <Stack direction="horizontal" gap={2}>
                    <div style={{ height: 28, flex: 1, borderRadius: 6, background: c.glowSoft }} />
                    <div style={{ height: 28, flex: 1, borderRadius: 6, background: c.glowSoft }} />
                    <div style={{ height: 28, flex: 1, borderRadius: 6, background: c.glowSoft }} />
                  </Stack>
                </Card>
              </Grid>
              <div style={{ marginTop: 14 }}>
                <CodeBlock code={`<Stack direction="horizontal" gap={3} align="center">\n  <Avatar initials="MJ" />\n  <span>María José</span>\n</Stack>`} />
              </div>
            </Section>

            <Section title="Grid" subtitle="Grilla responsive — columnas fijas o auto-fit con ancho mínimo, mismo patrón que ya usa cada sección de este showcase.">
              <Grid minColWidth={90} gap={2}>
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} style={{ height: 60, borderRadius: tokens.radius.sm, background: c.bgSurfaceRaised, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: tokens.font.mono, fontSize: 11, color: c.textFaint }}>{n}</span>
                  </div>
                ))}
              </Grid>
              <div style={{ marginTop: 14 }}>
                <CodeBlock code={`<Grid minColWidth={200} gap={3}>\n  <Card>...</Card>\n  <Card>...</Card>\n</Grid>\n\n// o columnas fijas:\n<Grid columns={3} gap={2}>...</Grid>`} />
              </div>
            </Section>

            <Section title="Spacer" subtitle="Espaciador flexible simple — para separar bloques sin un margin suelto en cada uno.">
              <Card>
                <Stack gap={0}>
                  <div style={{ height: 24, borderRadius: 6, background: c.glowSoft }} />
                  <Spacer size={6} />
                  <div style={{ height: 24, borderRadius: 6, background: c.glowSoft }} />
                </Stack>
              </Card>
            </Section>
          </>
        )}

        {tab === 'components' && (
          <>
            <Section title="Botones">
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <Button variant="primary" icon={ArrowRight}>Continuar</Button>
                <Button variant="glow" icon={Flame}>Mantener racha</Button>
                <Button variant="secondary">Más tarde</Button>
                <Button variant="ghost">Saltar</Button>
                <Button variant="primary" disabled>Bloqueado</Button>
              </div>
            </Section>

            <Section title="Badges">
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Badge>Nivel A2</Badge>
                <Badge variant="success">✓ Completado</Badge>
                <Badge variant="glow"><Sparkles size={11} /> Racha activa</Badge>
              </div>
            </Section>

            <Section title="Inputs">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, maxWidth: 600 }}>
                <Input label="Tu respuesta" placeholder="Escribe en inglés..." />
                <Input label="Correo" placeholder="tu@email.com" type="email" />
              </div>
            </Section>

            <Section title="Progreso">
              <div style={{ maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 18 }}>
                <ProgressBar value={65} max={100} label="Lección de hoy" />
                <ProgressBar value={3} max={5} label="Vocabulario semanal" />
              </div>
            </Section>

            <Section title="Word Card" subtitle="Toca para revelar traducción y ejemplo.">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, maxWidth: 600 }}>
                <WordCard word="serendipity" translation="serendipia" example="Finding this café was pure serendipity." />
                <WordCard word="thrive" translation="prosperar" example="She thrives under pressure." />
              </div>
            </Section>
          </>
        )}

        {tab === 'forms' && (
          <>
            <Section title="Input con validación" subtitle="Estados de error y éxito — clave para feedback de ejercicios de escritura.">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, maxWidth: 600 }}>
                <Input label="Tu respuesta" placeholder="Escribe en inglés..." status="error" message="Casi — revisa la conjugación del verbo." defaultValue="She go to school" />
                <Input label="Tu respuesta" placeholder="Escribe en inglés..." status="success" message="¡Correcto!" defaultValue="She goes to school" />
              </div>
            </Section>

            <Section title="Radio Group" subtitle="Selección única — ideal para quizzes de opción múltiple.">
              <div style={{ maxWidth: 340 }}>
                <RadioGroup
                  label="¿Cuál es la traducción correcta de 'thrive'?"
                  options={['Sobrevivir', 'Prosperar', 'Descansar']}
                  defaultValue="Prosperar"
                />
              </div>
            </Section>

            <Section title="Checkbox" subtitle="Selección múltiple — preferencias, filtros de temas a practicar.">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 280 }}>
                <Checkbox label="Vocabulario de viajes" defaultChecked />
                <Checkbox label="Phrasal verbs" defaultChecked />
                <Checkbox label="Tiempos verbales" />
              </div>
            </Section>

            <Section title="Slider" subtitle="Ajustes continuos: velocidad de audio, dificultad, volumen.">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 320 }}>
                <Slider label="Velocidad de audio" min={50} max={150} defaultValue={100} unit="%" />
                <Slider label="Palabras nuevas por día" min={3} max={20} defaultValue={5} />
              </div>
            </Section>

            <Section title="Stepper" subtitle="Progreso a través de varios pasos — onboarding, test de nivel.">
              <Card>
                <Stepper steps={['Bienvenida', 'Nivel', 'Metas', 'Listo']} current={1} />
              </Card>
            </Section>

            <Section title="Empty state" subtitle="Una pantalla vacía es una invitación a actuar, no un hueco sin explicación.">
              <Card padding={0}>
                <EmptyState
                  icon={BookOpen}
                  title="Aún no has guardado palabras"
                  description="Las palabras que marques durante tus lecciones aparecerán aquí para repasarlas cuando quieras."
                  actionLabel="Empezar una lección"
                />
              </Card>
            </Section>

            <Section title="Loading skeleton" subtitle="Mientras carga el audio, el progreso, o el contenido de una lección.">
              <div style={{ maxWidth: 340 }}>
                <SkeletonCard />
              </div>
            </Section>
          </>
        )}

        {tab === 'rewards' && (
          <>
            <Section title="Cartas de recompensa" subtitle="Al completar un módulo, la app entrega una carta coleccionable canjeable por un premio real fuera de la app — cena, masaje, maquillaje, un plan juntos o una sorpresa.">
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {Object.entries(REWARD_CATEGORIES).map(([key, cat]) => (
                  <RewardCard
                    key={key}
                    category={key}
                    title={
                      key === 'dinner' ? 'Cena en tu lugar favorito' :
                      key === 'massage' ? 'Masaje relajante' :
                      key === 'makeup' ? 'Sesión de maquillaje' :
                      key === 'date' ? 'Plan sorpresa juntos' :
                      'Sorpresa misteriosa'
                    }
                    subtitle={`Por completar un módulo · ${RARITY_LABEL[cat.rarity]}`}
                    code={`AURORA-${key.slice(0, 3).toUpperCase()}`}
                    size={180}
                  />
                ))}
              </div>
              <p style={{ fontFamily: tokens.font.body, fontSize: 12.5, color: c.textFaint, marginTop: 18, maxWidth: 480, lineHeight: 1.6 }}>
                Cada categoría tiene su propia paleta e ilustración original (dibujada en SVG, sin fotos ni iconos de stock) para que la colección se sienta variada incluso antes de leer el texto. El botón "Descargar carta" genera un archivo .svg listo para guardar o compartir.
              </p>
            </Section>

            <Section title="Celebración al ganar" subtitle="El momento en que se desbloquea una carta — partículas tipo confeti-estrella, en los mismos colores de la categoría.">
              <Button variant="glow" icon={PartyPopper} onClick={() => setUnlockOpen(true)}>Simular desbloqueo de carta</Button>
              <RewardUnlockModal
                open={unlockOpen}
                onClose={() => setUnlockOpen(false)}
                category="massage"
                title="Masaje relajante"
                subtitle="Por completar el módulo de Listening"
                code="AURORA-MAS"
                onSaveToVault={unlockNextCard}
              />
            </Section>

            <Section title="Bóveda de recompensas" subtitle="Colección persistente — las cartas ganadas se guardan aquí para revisarlas cuando quiera, las que faltan aparecen bloqueadas con una pista.">
              <Card>
                <RewardVault items={vaultItems} />
              </Card>
            </Section>
          </>
        )}

        {tab === 'advanced' && (
          <>
            <Section title="Modal" subtitle="Para confirmaciones contextuales o detalle de una lección.">
              <Button variant="secondary" onClick={() => setModalOpen(true)}>Abrir modal de lección</Button>
              <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Lección: Phrasal Verbs"
                footer={<>
                  <Button variant="secondary" onClick={() => setModalOpen(false)}>Cerrar</Button>
                  <Button variant="primary" onClick={() => setModalOpen(false)}>Empezar</Button>
                </>}
              >
                Esta lección cubre 8 phrasal verbs comunes en conversación cotidiana, con 3 ejercicios de práctica y un audio de pronunciación nativa.
              </Modal>
            </Section>

            <Section title="Alert Dialog" subtitle="Para acciones destructivas o de confirmación importante.">
              <Button variant="ghost" icon={Trash2} onClick={() => setAlertOpen(true)}>Reiniciar progreso</Button>
              <AlertDialog
                open={alertOpen}
                onClose={() => setAlertOpen(false)}
                onConfirm={() => setAlertOpen(false)}
                variant="danger"
                title="¿Reiniciar tu progreso?"
                description="Perderás tu racha de 4 días y el historial de palabras aprendidas. Esta acción no se puede deshacer."
                confirmLabel="Sí, reiniciar"
              />
            </Section>

            <Section title="Toast" subtitle="Confirmaciones breves que desaparecen solas, sin interrumpir el flujo.">
              <Button variant="glow" icon={Trophy} onClick={() => setToastOpen(true)}>Completar lección</Button>
              <Toast open={toastOpen} onClose={() => setToastOpen(false)} variant="success" message="¡Lección completada! +10 XP" />
            </Section>

            <Section title="Tabs">
              <Card>
                <Tabs
                  items={[
                    { value: 'vocab', label: 'Vocabulario', content: 'Repasa las 120 palabras que has aprendido hasta ahora, organizadas por tema: viajes, trabajo, comida y más.' },
                    { value: 'gram', label: 'Gramática', content: 'Ejercicios de tiempos verbales, condicionales y preposiciones, adaptados a tu nivel A2.' },
                    { value: 'speak', label: 'Speaking', content: 'Practica pronunciación con reconocimiento de voz y recibe feedback inmediato.' },
                  ]}
                />
              </Card>
            </Section>

            <Section title="Tabla" subtitle="Historial de sesiones de práctica.">
              <Table
                columns={['Fecha', 'Lección', 'Precisión', 'XP']}
                rows={[
                  ['18 jun', 'Phrasal Verbs', '92%', '+15'],
                  ['17 jun', 'Past Simple', '78%', '+10'],
                  ['16 jun', 'Listening: Café', '88%', '+12'],
                  ['15 jun', 'Vocabulario: Viajes', '95%', '+18'],
                ]}
              />
            </Section>

            <Section title="Accordion" subtitle="Para preguntas frecuentes o detalles colapsables.">
              <Accordion
                items={[
                  { title: '¿Cuánto tiempo debo practicar al día?', content: 'Recomendamos entre 10 y 15 minutos diarios. La constancia importa más que la duración de cada sesión.' },
                  { title: '¿Cómo funciona la racha?', content: 'Cada día que completes al menos una lección, tu racha aumenta. Si faltas un día, se reinicia — pero tu progreso de vocabulario se mantiene.' },
                  { title: '¿Puedo cambiar mi nivel?', content: 'Sí, puedes ajustarlo en cualquier momento desde Configuración → Nivel de inglés.' },
                ]}
              />
            </Section>

            <Section title="Select & Switch">
              <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <div style={{ width: 220 }}>
                  <Select label="Nivel de inglés" options={['A1 · Principiante', 'A2 · Básico', 'B1 · Intermedio', 'B2 · Avanzado']} defaultValue="A2 · Básico" />
                </div>
                <Card padding={16} >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 220 }}>
                    <Switch label="Notificaciones diarias" defaultChecked />
                    <Switch label="Sonido al acertar" defaultChecked />
                    <Switch label="Modo difícil" />
                  </div>
                </Card>
              </div>
            </Section>

            <Section title="Avatar, Tooltip & Dropdown menu">
              <div style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <Avatar initials="MJ" online />
                  <Avatar initials="JL" size={48} />
                </div>
                <Tooltip label="Tu racha más larga: 12 días">
                  <Badge variant="glow"><Flame size={11} /> 4 días</Badge>
                </Tooltip>
                <Card padding={12}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar initials="MJ" size={32} />
                    <span style={{ fontSize: 13.5, fontFamily: tokens.font.body }}>María José</span>
                    <DropdownMenu items={[
                      { label: 'Editar perfil', icon: Settings },
                      { label: 'Eliminar cuenta', icon: Trash2, danger: true },
                    ]} />
                  </div>
                </Card>
              </div>
            </Section>
          </>
        )}

        {tab === 'system' && (
          <>
            <Section title="Profundidad (z-index)" subtitle="Qué se superpone a qué — evita que un modal quede detrás de un toast por accidente.">
              <Card padding={20}>
                <div style={{ position: 'relative', height: 220 }}>
                  {Object.entries(tokens.zIndex).reverse().map(([name, value], i) => (
                    <div
                      key={name}
                      style={{
                        position: 'absolute',
                        top: i * 18,
                        left: i * 22,
                        width: 200,
                        padding: '10px 14px',
                        background: i === 0 ? c.glowSoft : c.bgSurfaceRaised,
                        border: `1px solid ${i === 0 ? c.glow + '88' : c.border}`,
                        borderRadius: tokens.radius.sm,
                        boxShadow: c.shadowSm,
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      }}
                    >
                      <span style={{ fontFamily: tokens.font.body, fontSize: 12.5, fontWeight: 600, color: c.text }}>{name}</span>
                      <span style={{ fontFamily: tokens.font.mono, fontSize: 11, color: c.textFaint }}>{value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </Section>

            <Section title="Breakpoints" subtitle="Puntos de quiebre para responsive — del celular de práctica diaria al desktop.">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                {Object.entries(tokens.breakpoint).map(([name, value]) => (
                  <Card key={name} padding={16}>
                    <div style={{ fontFamily: tokens.font.mono, fontSize: 11, color: c.textFaint, textTransform: 'uppercase', marginBottom: 4 }}>{name}</div>
                    <div style={{ fontFamily: tokens.font.display, fontSize: 20, fontWeight: 600, color: c.text }}>{value}</div>
                  </Card>
                ))}
              </div>
            </Section>

            <Section title="Movimiento" subtitle="Duración y curvas nombradas — el mismo lenguaje de movimiento en toda la app, no valores sueltos por componente.">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                <Card>
                  <div style={{ fontFamily: tokens.font.mono, fontSize: 11, color: c.textFaint, marginBottom: 12, textTransform: 'uppercase' }}>Duración</div>
                  {Object.entries(tokens.motion.duration).map(([name, value]) => (
                    <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: c.text, fontFamily: tokens.font.body }}>{name}</span>
                      <span style={{ fontFamily: tokens.font.mono, fontSize: 12, color: c.glow }}>{value}</span>
                    </div>
                  ))}
                  <p style={{ fontSize: 12, color: c.textFaint, marginTop: 10, lineHeight: 1.5 }}>fast: hover/foco · base: modales/toasts · slow: celebraciones de racha</p>
                </Card>
                <Card>
                  <div style={{ fontFamily: tokens.font.mono, fontSize: 11, color: c.textFaint, marginBottom: 12, textTransform: 'uppercase' }}>Easing</div>
                  {Object.entries(tokens.motion.easing).map(([name, value]) => (
                    <div key={name} style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 13, color: c.text, fontFamily: tokens.font.body }}>{name}</span>
                      </div>
                      <span style={{ fontFamily: tokens.font.mono, fontSize: 10.5, color: c.textFaint }}>{value}</span>
                    </div>
                  ))}
                </Card>
              </div>
              <div style={{ marginTop: 16 }}>
                <MotionDemo />
              </div>
            </Section>

            <Section title="Estados interactivos" subtitle="Hover, presionado, deshabilitado — mismos valores en todos los botones y controles.">
              <Card>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Button variant="primary">Hover / click aquí</Button>
                  <Button variant="primary" disabled>Deshabilitado</Button>
                  <div style={{ fontSize: 12.5, color: c.textMuted, fontFamily: tokens.font.mono, lineHeight: 1.8 }}>
                    hover: {tokens.state.hoverLift} {tokens.state.hoverScale}<br/>
                    active: {tokens.state.activeScale}<br/>
                    disabled: opacity {tokens.state.disabledOpacity}
                  </div>
                </div>
              </Card>
            </Section>

            <Section title="Accesibilidad" subtitle="No decorativo — son requisitos para que ella pueda usar la app cómodamente todos los días.">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                <Card>
                  <div style={{ fontFamily: tokens.font.mono, fontSize: 11, color: c.textFaint, marginBottom: 10, textTransform: 'uppercase' }}>Foco de teclado</div>
                  <p style={{ fontSize: 12.5, color: c.textMuted, marginBottom: 12, lineHeight: 1.5 }}>Visible solo al navegar con teclado (Tab), nunca al hacer click. Prueba con Tab:</p>
                  <Button variant="secondary">Botón de prueba</Button>
                </Card>
                <Card>
                  <div style={{ fontFamily: tokens.font.mono, fontSize: 11, color: c.textFaint, marginBottom: 10, textTransform: 'uppercase' }}>Área tocable mínima</div>
                  <p style={{ fontSize: 12.5, color: c.textMuted, marginBottom: 12, lineHeight: 1.5 }}>{tokens.touchTarget.min}px — el estándar para no fallar el toque en móvil.</p>
                  <div style={{
                    width: tokens.touchTarget.min, height: tokens.touchTarget.min, borderRadius: tokens.radius.full,
                    background: c.glowSoft, border: `1.5px dashed ${c.glow}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Check size={18} color={c.glow} />
                  </div>
                </Card>
                <Card>
                  <div style={{ fontFamily: tokens.font.mono, fontSize: 11, color: c.textFaint, marginBottom: 10, textTransform: 'uppercase' }}>Movimiento reducido</div>
                  <p style={{ fontSize: 12.5, color: c.textMuted, lineHeight: 1.5, margin: 0 }}>El sistema respeta <code style={{ fontFamily: tokens.font.mono, fontSize: 11.5 }}>prefers-reduced-motion</code>: si el sistema operativo lo pide, todas las animaciones se acortan automáticamente.</p>
                </Card>
              </div>
            </Section>
          </>
        )}

        {tab === 'icons' && (
          <Section title="Iconos" subtitle="Set curado de Lucide React, organizado por cómo se usa dentro de la app — no alfabéticamente.">
            <IconLibrary />
          </Section>
        )}

        {tab === 'guide' && (
          <>
            <Section title="Cuándo usar qué" subtitle="Las decisiones que evitan inconsistencia entre quien construya cada pantalla.">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <DoDont
                  doText="Modal para mostrar contenido o detalle que la persona pidió ver (detalle de una lección, perfil)."
                  dontText="No uses Modal para confirmar una acción destructiva — para eso existe AlertDialog, con su propio peso visual de advertencia."
                />
                <DoDont
                  doText="AlertDialog solo para acciones que no se pueden deshacer o que pierden progreso (reiniciar racha, eliminar cuenta)."
                  dontText="No uses AlertDialog para confirmaciones de bajo riesgo — interrumpe más de lo necesario y le resta peso a cuando sí importa."
                />
                <DoDont
                  doText="Toast para confirmar que algo pasó sin que la persona tenga que actuar (+10 XP, lección completada)."
                  dontText="No uses Toast si la persona necesita responder algo — un toast desaparece solo, una decisión no debería desaparecer con él."
                />
                <DoDont
                  doText="Input con status='error' para feedback de un ejercicio específico, en el momento."
                  dontText="No acumules errores en un resumen aparte al final — el feedback de aprendizaje de idioma funciona mejor inmediato, palabra por palabra."
                />
              </div>
            </Section>

            <Section title="Cuándo usar cada tipografía" subtitle="Tres familias, tres trabajos distintos — mezclarlas mal es la forma más rápida de que el sistema se sienta inconsistente.">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                <Card>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
                    <span style={{ fontFamily: tokens.font.display, fontSize: 24, fontWeight: 600, color: c.text }}>Fraunces</span>
                    <Badge>Display</Badge>
                  </div>
                  <p style={{ fontSize: 13, color: c.textMuted, lineHeight: 1.6, margin: '0 0 10px' }}>
                    Para títulos de pantalla, nombres de lección, el momento "ceremonial" — la palabra que aparece grande cuando ganas una carta, el saludo del dashboard. Da la calidez editorial que distingue a Aurora de una app de productividad fría.
                  </p>
                  <DoDont
                    doText="H1/H2 de cada pantalla, título de la carta de recompensa, encabezados de Section."
                    dontText="Nunca en párrafos largos ni en botones — a tamaño de texto corrido pierde legibilidad y se siente pesada."
                  />
                </Card>

                <Card>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
                    <span style={{ fontFamily: tokens.font.body, fontSize: 18, fontWeight: 600, color: c.text }}>Inter</span>
                    <Badge>Body / UI</Badge>
                  </div>
                  <p style={{ fontSize: 13, color: c.textMuted, lineHeight: 1.6, margin: '0 0 10px' }}>
                    El caballo de batalla: párrafos, labels, botones, navegación, mensajes de error. Si dudas qué tipografía usar para algo, es Inter — es la opción por defecto del sistema.
                  </p>
                  <DoDont
                    doText="Todo texto de interfaz: botones, inputs, badges, body copy, navegación."
                    dontText="No la uses para mostrar números de racha o XP destacados — para eso existe Mono, que los hace sentir como datos, no como prosa."
                  />
                </Card>

                <Card>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
                    <span style={{ fontFamily: tokens.font.mono, fontSize: 17, fontWeight: 600, color: c.glow }}>JetBrains Mono</span>
                    <Badge variant="glow">Datos</Badge>
                  </div>
                  <p style={{ fontSize: 13, color: c.textMuted, lineHeight: 1.6, margin: '0 0 10px' }}>
                    Reservada para números y valores que se sienten "medibles": racha, porcentaje, XP, código de cupón, etiquetas tipo "NIVEL A2". El espaciado monoespaciado le da peso de dato real, como un contador de juego.
                  </p>
                  <DoDont
                    doText="Contadores (4 días), códigos (AURORA-001), etiquetas técnicas en mayúsculas (RACHA ACTUAL)."
                    dontText="No la uses para nombres propios o frases — fuera de números/códigos se lee robótica y rompe la calidez del resto del sistema."
                  />
                </Card>
              </div>
            </Section>

            <Section title="Cuándo usar cada color" subtitle="El glow se gana, no se regala — es la regla de color más importante de todo el sistema.">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                <Card>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 7, background: c.glow, boxShadow: `0 0 12px ${c.glow}aa` }} />
                    <strong style={{ fontFamily: tokens.font.body, fontSize: 14, color: c.text }}>Glow (rosa brillante)</strong>
                  </div>
                  <DoDont
                    doText="Solo en momentos de logro: racha activa, respuesta correcta, carta de recompensa desbloqueada, badge destacado."
                    dontText="No lo uses como color decorativo de fondo o en elementos que están ahí todo el tiempo — si todo brilla, nada se siente especial."
                  />
                </Card>

                <Card>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 7, background: c.primary }} />
                    <strong style={{ fontFamily: tokens.font.body, fontSize: 14, color: c.text }}>Primary (magenta)</strong>
                  </div>
                  <DoDont
                    doText="Acción principal de la pantalla: el botón 'Continuar', el tab activo, el estado seleccionado de un input."
                    dontText="No lo repitas más de una vez como acción principal en la misma vista — si hay dos botones magenta, ¿cuál es el importante?"
                  />
                </Card>

                <Card>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 7, background: c.secondary }} />
                    <strong style={{ fontFamily: tokens.font.body, fontSize: 14, color: c.text }}>Secondary (violeta)</strong>
                  </div>
                  <DoDont
                    doText="Acentos de apoyo: la mitad de un gradiente, iconos secundarios, elementos decorativos del fondo (starfield, halos)."
                    dontText="No lo uses solo para una acción que el usuario debe tomar — al no ser el primary, compite por atención sin ganar claridad."
                  />
                </Card>

                <Card>
                  <div style={{ display: 'flex', gap: 14, marginBottom: 8, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 18, height: 18, borderRadius: 5, background: c.success }} />
                      <span style={{ fontFamily: tokens.font.mono, fontSize: 11, color: c.textMuted }}>success</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 18, height: 18, borderRadius: 5, background: c.danger }} />
                      <span style={{ fontFamily: tokens.font.mono, fontSize: 11, color: c.textMuted }}>danger</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 18, height: 18, borderRadius: 5, background: c.warning }} />
                      <span style={{ fontFamily: tokens.font.mono, fontSize: 11, color: c.textMuted }}>warning</span>
                    </div>
                  </div>
                  <DoDont
                    doText="Exclusivamente para estado del sistema: success = respuesta correcta/completado, danger = error/acción destructiva, warning = advertencia antes de perder algo."
                    dontText="No los uses por su valor estético — si verde/rojo aparecen sin que pasó algo correcto/incorrecto, confunden en vez de informar."
                  />
                </Card>

                <Card>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 7, background: c.text, border: `1px solid ${c.border}` }} />
                    <strong style={{ fontFamily: tokens.font.body, fontSize: 14, color: c.text }}>Text / Text Muted / Text Faint</strong>
                  </div>
                  <DoDont
                    doText="text = títulos y contenido principal · textMuted = descripciones y body secundario · textFaint = metadata, placeholders, hints."
                    dontText="No uses textFaint para nada que la persona deba leer para continuar — si es legible solo con esfuerzo, no debería llevar información necesaria."
                  />
                </Card>
              </div>
            </Section>

            <Section title="Voz y tono" subtitle="Cómo le habla Aurora a quien practica — esto es tan parte del sistema como el color.">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                <Card>
                  <h3 style={{ fontFamily: tokens.font.display, fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Voz activa, sin relleno</h3>
                  <p style={{ fontSize: 13, color: c.textMuted, lineHeight: 1.6, margin: 0 }}>Un botón dice lo que hace exactamente: <strong style={{ color: c.text }}>"Guardar palabra"</strong>, no "Enviar". Si el botón dice "Completar lección", el toast que sigue dice "Lección completada" — mismo verbo, todo el camino.</p>
                </Card>
                <Card>
                  <h3 style={{ fontFamily: tokens.font.display, fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Errores sin disculpas</h3>
                  <p style={{ fontSize: 13, color: c.textMuted, lineHeight: 1.6, margin: 0 }}>Nunca <em>"Oops, algo salió mal"</em>. Di qué pasó y qué hacer: <strong style={{ color: c.text }}>"Esa palabra no coincide. Revisa el tiempo verbal."</strong></p>
                </Card>
                <Card>

                  <h3 style={{ fontFamily: tokens.font.display, fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Vacíos como invitación</h3>
                  <p style={{ fontSize: 13, color: c.textMuted, lineHeight: 1.6, margin: 0 }}>Una pantalla vacía explica qué va a aparecer ahí y da un botón para empezar — nunca solo "No hay datos".</p>
                </Card>
                <Card>
                  <h3 style={{ fontFamily: tokens.font.display, fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Cercano, no infantil</h3>
                  <p style={{ fontSize: 13, color: c.textMuted, lineHeight: 1.6, margin: 0 }}>El glow y las estrellas dan calidez sin que el texto tenga que sobre-explicar con exclamaciones. Una racha de 4 días dice <strong style={{ color: c.text }}>"4 días"</strong>, no "¡¡¡Wow, 4 días seguidos!!!"</p>
                </Card>
              </div>
            </Section>

            <Section title="Especificación rápida" subtitle="Props principales de los componentes más usados — copia y pega como punto de partida.">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <h3 style={{ fontFamily: tokens.font.display, fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Button</h3>
                  <CodeBlock code={`<Button variant="primary" size="md" icon={ArrowRight} onClick={fn}>\n  Continuar\n</Button>\n\n// variant: 'primary' | 'secondary' | 'ghost' | 'glow'\n// size: 'sm' | 'md' | 'lg'`} />
                </div>
                <div>
                  <h3 style={{ fontFamily: tokens.font.display, fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Input</h3>
                  <CodeBlock code={`<Input\n  label="Tu respuesta"\n  placeholder="Escribe en inglés..."\n  status="error"        // 'error' | 'success' | undefined\n  message="Revisa el verbo"\n  value={value}\n  onChange={e => setValue(e.target.value)}\n/>`} />
                </div>
                <div>
                  <h3 style={{ fontFamily: tokens.font.display, fontSize: 15, fontWeight: 600, marginBottom: 8 }}>AlertDialog</h3>
                  <CodeBlock code={`<AlertDialog\n  open={open}\n  onClose={() => setOpen(false)}\n  onConfirm={handleConfirm}\n  variant="danger"       // 'danger' | 'success' | 'info'\n  title="¿Reiniciar tu progreso?"\n  description="Esta acción no se puede deshacer."\n/>`} />
                </div>
              </div>
            </Section>

            <Section title="Checklist antes de enviar una pantalla nueva">
              <Card>
                {[
                  'Usa los tokens (c.primary, tokens.radius...) en vez de valores sueltos',
                  'Todo elemento clicable tiene mínimo 44px de área tocable',
                  'El foco de teclado es visible (className="aurora-focusable")',
                  'Hay un estado vacío y uno de carga, no solo el estado "feliz"',
                  'El texto sigue la voz: activo, sin disculpas, mismo verbo de principio a fin',
                  'Se ve bien en tema claro y oscuro',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 0', borderBottom: i < 5 ? `1px solid ${c.border}` : 'none' }}>
                    <CircleCheck size={16} color={c.textFaint} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontFamily: tokens.font.body, fontSize: 13.5, color: c.textMuted }}>{item}</span>
                  </div>
                ))}
              </Card>
            </Section>
          </>
        )}

        {tab === 'demo' && (
          <Section title="Pantalla de ejemplo" subtitle="Cómo se ven los componentes juntos en una sesión de práctica diaria.">
            <Card padding={28}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <Badge variant="glow"><Sparkles size={11} /> Día 4 de racha</Badge>
                  <h2 style={{ fontFamily: tokens.font.display, fontSize: 26, fontWeight: 600, margin: '10px 0 4px' }}>Hola, lista para hoy</h2>
                  <p style={{ fontSize: 13, color: c.textMuted, margin: 0 }}>5 palabras nuevas · 1 ejercicio de speaking</p>
                </div>
                <Heart size={20} color={c.danger} fill={c.danger} />
              </div>

              <div style={{ marginBottom: 24 }}>
                <ProgressBar value={2} max={5} label="Vocabulario de hoy" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
                <WordCard word="resilient" translation="resiliente" example="She remained resilient through every setback." />
                <WordCard word="cozy" translation="acogedor" example="The cabin felt cozy in the snow." />
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
                <Button variant="primary" icon={Mic}>Practicar pronunciación</Button>
                <Button variant="secondary" icon={BookOpen}>Repasar lección</Button>
              </div>

              <StreakConstellation lit={4} total={7} />
            </Card>
          </Section>
        )}

        </Container>
      </main>
    </Page>
  );
}
