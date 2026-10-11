import { SignupForm } from './SignupForm';

export function App() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 420, margin: '48px auto', padding: '0 16px' }}>
      <h1>Create your account</h1>
      <SignupForm />
    </main>
  );
}
