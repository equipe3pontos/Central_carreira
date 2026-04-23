import type {ReactNode} from 'react';
import clsx from 'clsx';
import styles from './DocSections.module.css';

type SectionProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Bloco semântico para texto de especificação (produto / decisões / rastreabilidade).
 * Alinhado à persona em AGENTS.md — separa análise do inventário de UI.
 */
export function AnaliseProduto({children, className}: SectionProps): ReactNode {
  return (
    <section
      className={clsx(styles.block, className)}
      aria-labelledby="heading-analise-produto">
      <h2 id="heading-analise-produto" className={styles.blockTitle}>
        Análise de produto
      </h2>
      <div>{children}</div>
    </section>
  );
}

/**
 * Bloco para copy e tabelas tiradas do protótipo (`UserContext`, mocks).
 */
export function ReferenciaProtótipo({children, className}: SectionProps): ReactNode {
  return (
    <section
      className={clsx(styles.block, className)}
      aria-labelledby="heading-referencia-prototipo">
      <h2 id="heading-referencia-prototipo" className={styles.blockTitle}>
        Conteúdo de referência (protótipo)
      </h2>
      <div>{children}</div>
    </section>
  );
}
