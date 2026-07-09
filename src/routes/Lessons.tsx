import { useNavigate } from 'react-router-dom'
import { Lock, Sparkles, CheckCircle } from 'lucide-react'
import { Container, Stack, SkeletonCard, tokens } from '@/design-system'
import { useThemeStore } from '@/stores/useThemeStore'
import { LessonCard } from '@/features/lessons/components/LessonCard'
import { useLessons } from '@/features/lessons/hooks/useLessons'
import type { LevelGroup } from '@/features/lessons/types'

const TOP_BAR_H = 60
const BOTTOM_NAV_H = 70

function LevelSection({ group, prevLevelName, onLessonClick }: {
  group: LevelGroup
  prevLevelName: string | null
  onLessonClick: (id: string) => void
}) {
  const { c } = useThemeStore()
  const { level, name, modules, status } = group

  const isLocked  = status === 'locked'
  const isEmpty   = status === 'empty'
  const isDone    = status === 'completed'

  const totalLessons     = modules.flatMap((m) => m.lessons).length
  const completedLessons = modules.flatMap((m) => m.lessons).filter((l) => l.status === 'completed').length

  // Color del nivel
  const levelColor =
    isDone  ? c.success :
    isLocked || isEmpty ? c.textFaint :
    c.primary

  return (
    <div>
      {/* ── Cabecera de nivel ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          marginBottom: 16,
        }}
      >
        {/* Badge de nivel */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: tokens.radius.md,
            background: isLocked || isEmpty
              ? c.bgSurfaceRaised
              : isDone
              ? `${c.success}22`
              : `${c.primary}22`,
            border: `2px solid ${isLocked || isEmpty ? c.border : levelColor + '66'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {isLocked ? (
            <Lock size={20} color={c.textFaint} />
          ) : isDone ? (
            <CheckCircle size={22} color={c.success} />
          ) : (
            <span
              style={{
                fontFamily: tokens.font.mono,
                fontSize: 15,
                fontWeight: 800,
                color: levelColor,
              }}
            >
              {level}
            </span>
          )}
        </div>

        {/* Texto */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontFamily: tokens.font.mono,
                fontSize: 10,
                fontWeight: 700,
                color: levelColor,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              Nivel {level}
            </span>
          </div>
          <p
            style={{
              fontFamily: tokens.font.display,
              fontSize: 17,
              fontWeight: 700,
              color: isLocked || isEmpty ? c.textMuted : c.text,
              margin: '2px 0 0',
            }}
          >
            {name}
          </p>
          {!isEmpty && totalLessons > 0 && (
            <p
              style={{
                fontFamily: tokens.font.mono,
                fontSize: 11,
                color: c.textFaint,
                margin: '2px 0 0',
              }}
            >
              {completedLessons} / {totalLessons} lecciones
            </p>
          )}
        </div>
      </div>

      {/* ── Barra de progreso del nivel ── */}
      {!isEmpty && totalLessons > 0 && (
        <div
          style={{
            height: 4,
            background: c.bgSurfaceRaised,
            borderRadius: tokens.radius.full,
            overflow: 'hidden',
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: `${(completedLessons / totalLessons) * 100}%`,
              height: '100%',
              background: isDone
                ? c.success
                : `linear-gradient(90deg, ${c.secondary}, ${c.glow})`,
              borderRadius: tokens.radius.full,
              transition: 'width 0.6s ease',
            }}
          />
        </div>
      )}

      {/* ── Contenido según estado ── */}
      {isEmpty ? (
        <ComingSoonCard />
      ) : isLocked ? (
        <LockedLevelCard prevLevelName={prevLevelName} />
      ) : (
        <Stack gap={6}>
          {modules.map((module) => {
            const moduleDone = module.lessons.filter((l) => l.status === 'completed').length
            return (
              <Stack key={module.id} gap={3}>
                {/* Módulo header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: moduleDone === module.lessons.length && module.lessons.length > 0
                        ? c.success
                        : moduleDone > 0
                        ? c.primary
                        : c.bgSurfaceRaised,
                      border: `2px solid ${moduleDone > 0 ? 'transparent' : c.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: tokens.font.mono,
                        fontSize: 11,
                        fontWeight: 700,
                        color: moduleDone > 0 ? '#fff' : c.textFaint,
                      }}
                    >
                      {module.order}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: tokens.font.display,
                        fontSize: 14,
                        fontWeight: 600,
                        color: c.text,
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {module.title}
                    </p>
                    <p
                      style={{
                        fontFamily: tokens.font.mono,
                        fontSize: 10,
                        color: c.textFaint,
                        margin: 0,
                      }}
                    >
                      {moduleDone} / {module.lessons.length}
                    </p>
                  </div>
                </div>

                {/* Lecciones */}
                <div style={{ paddingLeft: 36 }}>
                  <Stack gap={2}>
                    {module.lessons.map((lesson) => (
                      <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        onClick={
                          lesson.status !== 'locked'
                            ? () => onLessonClick(lesson.id)
                            : undefined
                        }
                      />
                    ))}
                  </Stack>
                </div>
              </Stack>
            )
          })}
        </Stack>
      )}
    </div>
  )
}

function LockedLevelCard({ prevLevelName }: { prevLevelName: string | null }) {
  const { c } = useThemeStore()

  return (
    <div
      style={{
        background: c.bgSurface,
        border: `1px dashed ${c.border}`,
        borderRadius: tokens.radius.lg,
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        opacity: 0.7,
      }}
    >
      <Lock size={20} color={c.textFaint} />
      <p style={{ fontFamily: tokens.font.body, fontSize: 14, color: c.textMuted, margin: 0 }}>
        {prevLevelName
          ? <>Completa <strong style={{ color: c.text }}>{prevLevelName}</strong> para desbloquear este nivel.</>
          : 'Completa el nivel anterior para desbloquear este.'}
      </p>
    </div>
  )
}

function ComingSoonCard() {
  const { c } = useThemeStore()

  return (
    <div
      style={{
        background: c.bgSurface,
        border: `1px dashed ${c.border}`,
        borderRadius: tokens.radius.lg,
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <Sparkles size={28} color={c.glow} style={{ marginBottom: 10 }} />
      <p
        style={{
          fontFamily: tokens.font.display,
          fontSize: 15,
          fontWeight: 600,
          color: c.text,
          margin: '0 0 4px',
        }}
      >
        Próximamente
      </p>
      <p style={{ fontFamily: tokens.font.body, fontSize: 13, color: c.textFaint, margin: 0 }}>
        Las lecciones de este nivel se publicarán pronto.
      </p>
    </div>
  )
}

// ─────────────────────────────────────────
export default function Lessons() {
  const { c } = useThemeStore()
  const { levels, completedCount, totalCount, isLoading } = useLessons()
  const navigate = useNavigate()

  return (
    <>
      <Container size="sm">
        <div
          style={{
            paddingTop: TOP_BAR_H + 24,
            paddingBottom: BOTTOM_NAV_H + 24,
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          <Stack gap={6}>
            {/* Header */}
            <div>
              <h1
                style={{
                  fontFamily: tokens.font.display,
                  fontWeight: 700,
                  fontSize: 'clamp(24px, 5vw, 32px)',
                  background: c.heroGradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  margin: '0 0 6px',
                  letterSpacing: -0.5,
                }}
              >
                Lecciones
              </h1>
              <p style={{ fontFamily: tokens.font.body, fontSize: 14, color: c.textMuted, margin: 0 }}>
                {completedCount} de {totalCount} completadas
              </p>
            </div>

            {/* Barra de progreso global */}
            <div
              style={{
                height: 6,
                background: c.bgSurfaceRaised,
                borderRadius: tokens.radius.full,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%',
                  height: '100%',
                  background: `linear-gradient(90deg, ${c.secondary}, ${c.glow})`,
                  borderRadius: tokens.radius.full,
                  boxShadow: `0 0 8px ${c.glow}aa`,
                  transition: 'width 0.6s ease',
                }}
              />
            </div>

            {/* Secciones por nivel */}
            {isLoading ? (
              <Stack gap={3}>
                {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
              </Stack>
            ) : (
              <Stack gap={0}>
                {levels.map((group, i) => (
                  <div key={group.level}>
                    {i > 0 && (
                      <div style={{ height: 1, background: c.border, margin: '28px 0' }} />
                    )}
                    <LevelSection
                      group={group}
                      prevLevelName={i > 0 ? levels[i - 1].name : null}
                      onLessonClick={(id) => navigate(`/lesson/${id}`)}
                    />
                  </div>
                ))}
              </Stack>
            )}
          </Stack>
        </div>
      </Container>
    </>
  )
}
