import { Link } from 'react-router-dom'
import Brand from '../../components/Brand'
import Icon, { type IconName } from '../../components/Icon'

const features: {
  icon: IconName
  title: string
  description: string
}[] = [
  {
    icon: 'calendar',
    title: 'Planeje sua rotina',
    description:
      'Organize sessões de estudo em um cronograma pensado para o seu dia a dia.',
  },
  {
    icon: 'book',
    title: 'Explore aulas e prática',
    description:
      'Encontre conteúdos e atividades para desenvolver diferentes habilidades.',
  },
  {
    icon: 'chart',
    title: 'Acompanhe sua jornada',
    description:
      'Visualize metas e progresso à medida que novas ferramentas forem construídas.',
  },
]

function WelcomePage() {
  return (
    <div className="welcome-shell">
      <div className="page-shell">
        <header className="site-header">
          <Brand />
          <nav aria-label="Navegação principal" className="header-links">
            <Link to="/">Voltar ao início</Link>
          </nav>
        </header>

        <main className="welcome-main">
          <section aria-labelledby="welcome-title" className="welcome-hero">
            <div className="welcome-copy">
              <span className="eyebrow">
                <span aria-hidden="true" className="eyebrow-dot" />
                Seu espaço de aprendizagem
              </span>
              <h1 id="welcome-title">Welcome to Fluent Journey!</h1>
              <p>
                Olá, professor. Este é o começo de um espaço para planejar,
                aprender e ensinar inglês com mais intenção. A plataforma está
                sendo construída por etapas, com você no centro da jornada.
              </p>
              <div className="welcome-actions">
                <Link className="button button-primary" to="/dashboard">
                  Acessar o painel principal
                  <Icon name="arrow" />
                </Link>
                <Link className="button button-secondary" to="/">
                  Voltar à apresentação
                </Link>
              </div>
            </div>

            <div aria-label="Ilustração da jornada de aprendizagem" className="welcome-art" role="img">
              <div aria-hidden="true" className="art-orbit" />
              <span className="art-label art-label-top">One step at a time</span>
              <span aria-hidden="true" className="art-center">
                <svg fill="none" viewBox="0 0 48 48">
                  <path
                    d="m24 5 4.8 14.2L43 24l-14.2 4.8L24 43l-4.8-14.2L5 24l14.2-4.8L24 5Z"
                    stroke="currentColor"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                  <circle cx="24" cy="24" r="4" fill="currentColor" />
                </svg>
              </span>
              <span className="art-label art-label-bottom">Your journey, your pace</span>
            </div>
          </section>

          <section aria-labelledby="features-title">
            <div className="welcome-section-title">
              <span className="eyebrow">Feito para evoluir com você</span>
              <h2 id="features-title">Tudo o que sua jornada vai reunir.</h2>
            </div>
            <div className="welcome-features">
              {features.map((feature) => (
                <article className="welcome-feature" key={feature.title}>
                  <div className="welcome-feature-top">
                    <span aria-hidden="true" className="highlight-icon">
                      <Icon name={feature.icon} />
                    </span>
                    <span className="coming-soon">Próximas etapas</span>
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              ))}
            </div>
          </section>
        </main>

        <footer className="site-footer">
          <span>Fluent Journey</span>
          <span>Keep going. You are closer than you think.</span>
        </footer>
      </div>
    </div>
  )
}

export default WelcomePage
