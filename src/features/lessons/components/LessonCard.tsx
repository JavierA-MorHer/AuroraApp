import {
  BookOpen,
  PenLine,
  Headphones,
  Mic,
  Lock,
  CheckCircle,
  PlayCircle,
  Clock,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import { Badge, ProgressBar, tokens } from '@/design-system'
import type { Lesson, LessonCategory, LessonLevel } from '../types'

const CATEGORY_ICON: Record<LessonCategory, LucideIcon> = {
  vocabulary: BookOpen,
  grammar: PenLine,
  listening: Headphones,
  speaking: Mic,
}

const LEVEL_VARIANT: Record<LessonLevel, 'default' | 'success' | 'glow'> = {
  A1: 'success',
  A2: 'glow',
  B1: 'default',
  B2: 'default',
}

interface LessonCardProps {
  lesson: Lesson
  onClick?: () => void
}

export function LessonCard({ lesson, onClick }: LessonCardProps) {
  const { c } = useThemeStore()

  const {
    title,
    description,
    level,
    category,
    durationMin,
    exerciseCount,
    completedCount,
    status,
  } = lesson

  const Icon = CATEGORY_ICON[category]
  const isLocked = status === 'locked'
  const isCompleted = status === 'completed'
  const isInProgress = status === 'in_progress'

  const iconBg: Record<LessonCategory, string> = {
    vocabulary: `${c.secondary}22`,
    grammar: `${c.primary}22`,
    listening: `${c.glow}22`,
    speaking: `${c.warning}22`,
  }
  const iconColor: Record<LessonCategory, string> = {
    vocabulary: c.secondary,
    grammar: c.primary,
    listening: c.glow,
    speaking: c.warning,
  }

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !isLocked ? 0 : undefined}
      onClick={isLocked ? undefined : onClick}
      onKeyDown={
        onClick && !isLocked
          ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } }
          : undefined
      }
      className={onClick && !isLocked ? 'aurora-focusable' : undefined}
      style={{
        background: c.bgSurface,
        border: `1px solid ${isInProgress ? c.primary + '55' : c.border}`,
        borderRadius: tokens.radius.lg,
        padding: '16px',
        opacity: isLocked ? 0.5 : 1,
        cursor: isLocked ? 'default' : onClick ? 'pointer' : 'default',
        transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
        boxShadow: isInProgress ? `0 0 0 1px ${c.primary}33, ${c.shadowSm}` : c.shadowSm,
      }}
    >
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        {/* Category icon */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: tokens.radius.md,
            background: isLocked ? c.bgSurfaceRaised : iconBg[category],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={20} color={isLocked ? c.textFaint : iconColor[category]} strokeWidth={1.8} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
            <span
              style={{
                fontFamily: tokens.font.display,
                fontSize: 15,
                fontWeight: 600,
                color: isLocked ? c.textMuted : c.text,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {title}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <Badge variant={isLocked ? 'default' : LEVEL_VARIANT[level]}>{level}</Badge>
              {isLocked && <Lock size={14} color={c.textFaint} />}
              {isCompleted && <CheckCircle size={16} color={c.success} />}
              {isInProgress && <PlayCircle size={16} color={c.primary} />}
            </div>
          </div>

          {/* Description */}
          <p
            style={{
              fontFamily: tokens.font.body,
              fontSize: 13,
              color: c.textFaint,
              margin: '0 0 10px',
              lineHeight: 1.4,
            }}
          >
            {description}
          </p>

          {/* Progress bar — only in_progress */}
          {isInProgress && (
            <div style={{ marginBottom: 10 }}>
              <ProgressBar value={completedCount} max={exerciseCount} />
            </div>
          )}

          {/* Meta: duration + exercises */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontFamily: tokens.font.mono,
                fontSize: 11,
                color: c.textFaint,
              }}
            >
              <Clock size={11} />
              {durationMin} min
            </span>
            <span
              style={{
                fontFamily: tokens.font.mono,
                fontSize: 11,
                color: isInProgress ? c.primary : c.textFaint,
              }}
            >
              {isInProgress ? `${completedCount} / ${exerciseCount} ejercicios` : `${exerciseCount} ejercicios`}
            </span>
            {isCompleted && (
              <span style={{ fontFamily: tokens.font.mono, fontSize: 11, color: c.success }}>
                Completada
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
