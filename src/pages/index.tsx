import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function IconBriefcase(): ReactNode {
  return (
    <svg
      className={styles.cardIconSvg}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}

function IconBarChart(): ReactNode {
  return (
    <svg
      className={styles.cardIconSvg}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden>
      <rect x="3" y="12" width="4" height="8" rx="1" />
      <rect x="10" y="8" width="4" height="12" rx="1" />
      <rect x="17" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const brandUrl = useBaseUrl('/img/brand-3pts.png');

  return (
    <Layout
      title={siteConfig.title}
      description="Módulo de Carreira Hunter — documentação por trilha: Colaborador e RH Tech People.">
      <div className={styles.landing}>
        <header className={styles.brand}>
          <img
            className={styles.brandMark}
            src={brandUrl}
            alt="3pts"
          />
        </header>

        <section className={styles.cards} aria-label="Trilhas de documentação">
          <article
            className={clsx(styles.card, styles.cardCollaborator)}
            id="colaborador">
            <div className={clsx(styles.iconWrap, styles.iconWrapGreen)}>
              <IconBriefcase />
            </div>
            <Heading as="h2" className={styles.cardTitle}>
              Colaborador
            </Heading>
            <p className={styles.cardLead}>
              Acesse seu perfil, PDI, feedbacks, OKRs e acompanhe seu
              desenvolvimento profissional.
            </p>
            <ul className={clsx(styles.featureList, styles.featureListGreen)}>
              <li>Dashboard personalizado</li>
              <li>Plano de Desenvolvimento Individual (PDI)</li>
              <li>Gestão de OKRs e metas</li>
              <li>Feedback contínuo (Pulse)</li>
            </ul>
            <Link
              className={clsx(styles.cardCta, styles.cardCtaGreen)}
              to="/docs/modulo-carreira/colaborador">
              Acessar módulo →
            </Link>
          </article>

          <article
            className={clsx(styles.card, styles.cardHr)}
            id="rh-tech-people">
            <div className={clsx(styles.iconWrap, styles.iconWrapBlue)}>
              <IconBarChart />
            </div>
            <Heading as="h2" className={styles.cardTitle}>
              RH Tech People
            </Heading>
            <p className={styles.cardLead}>
              Gerencie pessoas, analise métricas organizacionais e tome decisões
              estratégicas baseadas em dados.
            </p>
            <ul className={clsx(styles.featureList, styles.featureListBlue)}>
              <li>People Analytics avançado</li>
              <li>Métricas de engajamento</li>
              <li>Análise de turnover</li>
              <li>Gestão de talentos</li>
            </ul>
            <Link
              className={clsx(styles.cardCta, styles.cardCtaBlue)}
              to="/docs/modulo-carreira/rh-tech-people">
              Acessar módulo →
            </Link>
          </article>
        </section>
      </div>
    </Layout>
  );
}
