import { Link } from 'react-router-dom'
import Brand from '../../components/Brand'
import Icon from '../../components/Icon'

function DashboardPlaceholder() {
  return (
    <div className="placeholder-shell">
      <div className="page-shell">
        <header className="site-header">
          <Brand />
          <nav aria-label="Navegação principal" className="header-links">
            <Link to="/welcome">Boas-vindas</Link>
          </nav>
        </header>

        <main className="placeholder-main">
          <section
            aria-labelledby="dashboard-placeholder-title"
            className="placeholder-card"
          >
            <span aria-hidden="true" className="highlight-icon">
              <Icon name="sparkle" />
            </span>
            <span className="eyebrow">Próxima etapa</span>
            <h1 id="dashboard-placeholder-title">Seu painel começa aqui.</h1>
            <p>
              O dashboard será desenvolvido na próxima etapa. Seu cronograma,
              aulas, atividades e progresso ainda não foram configurados.
            </p>
            <Link className="button button-primary" to="/welcome">
              Voltar às boas-vindas
              <Icon name="arrow" />
            </Link>
          </section>
        </main>
      </div>
    </div>
  )
}

export default DashboardPlaceholder
