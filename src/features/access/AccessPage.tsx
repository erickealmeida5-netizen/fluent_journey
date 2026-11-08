import { useState } from 'react'
import { Link } from 'react-router-dom'
import Brand from '../../components/Brand'
import Icon from '../../components/Icon'

function AccessPage() {
  const [signupMessage, setSignupMessage] = useState('')

  return (
    <div className="page-shell access-shell">
      <header className="site-header">
        <Brand />
        <nav aria-label="Navegação principal" className="header-links">
          <a href="#how-it-works">A proposta</a>
          <Link className="header-login" to="/welcome">
            Entrar
          </Link>
        </nav>
      </header>

      <main>
        <section aria-labelledby="access-title" className="access-main">
          <div className="access-copy">
            <span className="eyebrow">
              <span aria-hidden="true" className="eyebrow-dot" />
              Um novo jeito de aprender
            </span>
            <h1 id="access-title">
              Seu inglês,
              <br />
              no seu <em>ritmo.</em>
            </h1>
            <p className="access-description">
              Um espaço para transformar curiosidade em confiança — com uma
              jornada de aprendizagem clara, leve e construída por etapas.
            </p>
            <div className="journey-note">
              <span aria-hidden="true" className="note-icon">
                <Icon name="sparkle" />
              </span>
              <div>
                Pequenos passos também levam longe.
                <p>Comece de onde você está. Continue no seu tempo.</p>
              </div>
            </div>
          </div>

          <section aria-labelledby="access-card-title" className="access-card">
            <span className="card-kicker">Bem-vindo ao Fluent Journey</span>
            <h2 id="access-card-title">Sua jornada começa aqui.</h2>
            <p className="access-card-copy">
              Entre no seu espaço de aprendizagem e descubra o próximo passo.
            </p>
            <Link className="button button-primary" to="/welcome">
              Entrar na plataforma
              <Icon name="arrow" />
            </Link>
            <button
              className="button button-secondary"
              onClick={() =>
                setSignupMessage(
                  'O cadastro de alunos será disponibilizado em uma próxima etapa. Por enquanto, você pode entrar no modo de demonstração.',
                )
              }
              type="button"
            >
              Criar cadastro
            </button>
            {signupMessage ? (
              <p aria-live="polite" className="access-feedback" role="status">
                {signupMessage}
              </p>
            ) : null}
            <p className="access-disclaimer">
              Acesso demonstrativo: não é necessário informar usuário ou senha.
            </p>
          </section>
        </section>

        <section
          aria-label="Princípios da plataforma"
          className="access-highlights"
          id="how-it-works"
        >
          <article className="highlight-card">
            <span aria-hidden="true" className="highlight-icon">
              <Icon name="target" />
            </span>
            <div>
              <h3>Aprendizagem com intenção</h3>
              <p>Objetivos claros para tornar cada sessão mais significativa.</p>
            </div>
          </article>
          <article className="highlight-card">
            <span aria-hidden="true" className="highlight-icon">
              <Icon name="calendar" />
            </span>
            <div>
              <h3>Um plano que cabe na rotina</h3>
              <p>Organize seus estudos com flexibilidade e constância.</p>
            </div>
          </article>
          <article className="highlight-card">
            <span aria-hidden="true" className="highlight-icon">
              <Icon name="chart" />
            </span>
            <div>
              <h3>Progresso no seu tempo</h3>
              <p>Uma base feita para acompanhar sua evolução etapa a etapa.</p>
            </div>
          </article>
        </section>
      </main>

      <footer className="site-footer">
        <span>Fluent Journey</span>
        <span>Uma jornada de cada vez.</span>
      </footer>
    </div>
  )
}

export default AccessPage
