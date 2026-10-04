import Hero from '../components/Hero'
import DecisionForm from '../components/DecisionForm'

export default function Home({ onSubmit }) {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-10 lg:grid-cols-[1.1fr_1fr] lg:py-20">
      <Hero />
      <DecisionForm onSubmit={onSubmit} />
    </section>
  )
}
