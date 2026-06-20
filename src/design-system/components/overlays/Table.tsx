import type { ReactNode } from 'react'
import { useThemeStore } from '@/stores/useThemeStore'
import { tokens } from '@/design-system/tokens'

interface TableProps {
  columns: string[]
  rows: ReactNode[][]
}

export function Table({ columns, rows }: TableProps) {
  const { c } = useThemeStore()

  return (
    <div
      style={{
        overflowX: 'auto',
        borderRadius: tokens.radius.md,
        border: `1px solid ${c.border}`,
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: tokens.font.body }}>
        <thead>
          <tr style={{ background: c.bgSurfaceRaised }}>
            {columns.map((col) => (
              <th
                key={col}
                style={{
                  textAlign: 'left',
                  padding: '12px 16px',
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  color: c.textFaint,
                  fontFamily: tokens.font.mono,
                  borderBottom: `1px solid ${c.border}`,
                }}
              >
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
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = `${c.primary}1a`)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  i % 2 === 0 ? 'transparent' : `${c.bgSurfaceRaised}55`)
              }
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    padding: '12px 16px',
                    fontSize: 13.5,
                    color: j === 0 ? c.text : c.textMuted,
                    borderBottom:
                      i < rows.length - 1 ? `1px solid ${c.border}88` : 'none',
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
