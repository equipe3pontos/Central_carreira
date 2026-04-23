import {Fragment, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from './FlowchartSteps.module.css';

export type FlowchartStepItem = {
  /** Destino: rota interna (ex. `/modulo-carreira/home`) ou URL absoluta. */
  to: string;
  /** Rótulo do cartão */
  title: string;
  /** Destaca o passo corrente + ícone «você está aqui» */
  isCurrent?: boolean;
  /** Texto curto acima do título quando `isCurrent` (protótipo StackSpot: "You are here!") */
  hereText?: string;
  /** Se true, abre noutro separador (útil para links externos). */
  openInNewTab?: boolean;
};

function isExternal(to: string): boolean {
  return /^https?:\/\//i.test(to);
}

function PinIcon() {
  return (
    <svg viewBox="0 0 512 512" width={16} height={16} aria-hidden>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M236.205 501.647C239.706 507.996 246.369 511.952 253.619 511.988C260.869 512.024 267.571 508.133 271.135 501.819L406.784 261.49C472.247 145.51 388.45 1.98828 255.27 1.9883C122.847 1.98831 38.9687 144.042 102.923 259.997L236.205 501.647ZM371.95 241.829L253.919 450.942L137.949 240.679C88.6981 151.383 153.292 41.9883 255.27 41.9883C357.831 41.9883 422.363 152.513 371.95 241.829ZM227.687 176.434C227.687 160.385 240.697 147.375 256.746 147.375C272.795 147.375 285.805 160.385 285.805 176.434C285.805 192.483 272.795 205.493 256.746 205.493C240.697 205.493 227.687 192.483 227.687 176.434ZM256.746 107.375C218.606 107.375 187.687 138.294 187.687 176.434C187.687 214.575 218.606 245.493 256.746 245.493C294.887 245.493 325.805 214.575 325.805 176.434C325.805 138.294 294.887 107.375 256.746 107.375Z"
      />
    </svg>
  );
}

function ArrowRight() {
  return (
    <div className={styles.arrow} aria-hidden>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </div>
  );
}

type FlowchartStepsProps = {
  steps: FlowchartStepItem[];
  /** Rótulo acessível para o `nav` (ex.: fluxo de onboarding). */
  'aria-label'?: string;
};

/**
 * Sequência horizontal de passos com setas (padrão próximo ao flowchart da StackSpot Docs).
 * Uso em MDX: `<FlowchartSteps steps={[...]} />` (registado em `theme/MDXComponents.tsx`).
 */
export function FlowchartSteps({
  steps,
  'aria-label': ariaLabel = 'Fluxo de passos',
}: FlowchartStepsProps): ReactNode {
  if (!steps?.length) {
    return null;
  }

  return (
    <nav className={styles.grid} aria-label={ariaLabel}>
      {steps.map((step, index) => {
        const external = isExternal(step.to);
        const newTab = step.openInNewTab ?? external;
        const here = step.hereText ?? 'Você está aqui!';
        const card = (
          <div
            className={clsx(styles.card, step.isCurrent && styles.cardCurrent)}>
            {step.isCurrent ? (
              <div className={styles.hereRow}>
                <PinIcon />
                <span>{here}</span>
              </div>
            ) : null}
            <span className={styles.title}>{step.title}</span>
          </div>
        );

        const inner =
          external || newTab ? (
            <a
              href={step.to}
              className={styles.link}
              {...(newTab
                ? {target: '_blank', rel: 'noopener noreferrer'}
                : {})}>
              {card}
            </a>
          ) : (
            <Link className={styles.link} to={step.to}>
              {card}
            </Link>
          );

        return (
          <Fragment key={`${step.to}-${index}`}>
            {index > 0 ? <ArrowRight /> : null}
            {inner}
          </Fragment>
        );
      })}
    </nav>
  );
}
