import AppHeader from '@/app/components/AppHeader'
import ContactForm from './ContactForm'

export const metadata = { title: 'お問い合わせ | ロコミー' }

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader backHref="/" />
      <main className="max-w-lg mx-auto px-4 py-10">
        <ContactForm />
      </main>
    </div>
  )
}
