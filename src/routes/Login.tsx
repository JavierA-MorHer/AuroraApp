import { Page, Container } from '@/design-system'
import { LoginForm } from '@/features/auth/components/LoginForm'

export default function Login() {
  return (
    <Page starDensity={60} padding="48px 24px">
      <Container size="sm">
        <div
          style={{
            minHeight: 'calc(100vh - 96px)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <LoginForm />
        </div>
      </Container>
    </Page>
  )
}
