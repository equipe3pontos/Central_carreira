/**
 * DiagramaZoom — wrapper de zoom para diagramas Mermaid no Docusaurus.
 *
 * Estratégia final:
 * 1. O bloco mermaid renderiza INLINE normalmente (SVG gerado pelo Docusaurus).
 * 2. Ao clicar Expandir, clona o SVG já renderizado via cloneNode e injeta no
 *    overlay. svg-pan-zoom opera sobre o clone sem conflito com o React VDOM.
 * 3. Ao fechar, destrói o svg-pan-zoom e limpa o clone.
 */

import {type ReactNode, useCallback, useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import styles from './DiagramaZoom.module.css';

type Props = {
  label?: string;
  children: ReactNode;
};

export function DiagramaZoom({label, children}: Props): ReactNode {
  const [open, setOpen]       = useState(false);
  const [mounted, setMounted] = useState(false);

  // ref do wrapper inline — fonte do SVG original
  const inlineRef  = useRef<HTMLDivElement>(null);
  // ref do container no overlay — recebe o clone
  const canvasRef  = useRef<HTMLDivElement>(null);
  // instância do svg-pan-zoom
  // biome-ignore lint/suspicious/noExplicitAny: svg-pan-zoom retorna tipo opaco
  const pzRef      = useRef<any>(null);

  useEffect(() => { setMounted(true); }, []);

  const destroyPZ = useCallback(() => {
    if (pzRef.current) {
      try { pzRef.current.destroy(); } catch (_) {}
      pzRef.current = null;
    }
    if (canvasRef.current) {
      canvasRef.current.innerHTML = '';
    }
  }, []);

  const openOverlay = useCallback(async () => {
    setOpen(true);

    // Aguarda o overlay estar visível no DOM
    await new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())));

    const source = inlineRef.current?.querySelector('svg');
    const canvas = canvasRef.current;
    if (!source || !canvas) return;

    // Clona o SVG e injeta no canvas do overlay
    const clone = source.cloneNode(true) as SVGSVGElement;
    clone.removeAttribute('style');
    clone.removeAttribute('width');
    clone.removeAttribute('height');
    clone.style.display = 'block';
    clone.style.maxWidth = 'none';
    // Dá dimensões explícitas baseadas no viewBox para o svg-pan-zoom ter referência
    const vb = clone.viewBox?.baseVal;
    if (vb && vb.width > 0) {
      clone.setAttribute('width',  String(vb.width));
      clone.setAttribute('height', String(vb.height));
    }
    canvas.appendChild(clone);

    const svgPanZoom = (await import('svg-pan-zoom')).default;
    pzRef.current = svgPanZoom(clone, {
      zoomEnabled:          true,
      panEnabled:           true,
      controlIconsEnabled:  false,
      fit:                  true,
      center:               true,
      minZoom:              0.05,
      maxZoom:              20,
      zoomScaleSensitivity: 0.25,
    });
  }, []);

  const closeOverlay = useCallback(() => {
    destroyPZ();
    setOpen(false);
  }, [destroyPZ]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')             { closeOverlay(); return; }
      if (e.key === '+' || e.key === '=') pzRef.current?.zoomIn();
      if (e.key === '-')                  pzRef.current?.zoomOut();
      if (e.key === '0')                  { pzRef.current?.fit(); pzRef.current?.center(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeOverlay]);

  const portal = mounted ? createPortal(
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal
      aria-label={label ?? 'Diagrama ampliado'}
      style={open ? undefined : {display: 'none'}}>

      <div className={styles.overlayBar}>
        {label && <span className={styles.overlayTitle}>{label}</span>}
        <button type="button" className={styles.btnCtrl}
          onClick={() => pzRef.current?.zoomOut()}
          aria-label="Diminuir zoom">−</button>
        <button type="button" className={styles.btnCtrl}
          onClick={() => { pzRef.current?.fit(); pzRef.current?.center(); }}
          aria-label="Ajustar à tela"
          style={{fontSize: '0.68rem', width: 'auto', padding: '0 0.55rem'}}>
          fit
        </button>
        <button type="button" className={styles.btnCtrl}
          onClick={() => pzRef.current?.zoomIn()}
          aria-label="Aumentar zoom">+</button>
        <button type="button" className={styles.btnClose}
          onClick={closeOverlay}
          aria-label="Fechar">✕</button>
      </div>

      {/* Clone do SVG é injetado aqui por openOverlay() */}
      <div ref={canvasRef} className={styles.overlayCanvas} />

      <div className={styles.hint}>
        Scroll para zoom · arraste para mover · + / − · 0 para ajustar · Esc para fechar
      </div>
    </div>,
    document.body,
  ) : null;

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.toolbar}>
          {label && <span className={styles.label}>{label}</span>}
          <button
            type="button"
            className={styles.btnZoom}
            onClick={openOverlay}
            aria-label="Expandir diagrama em tela cheia">
            ⤢ Expandir
          </button>
        </div>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: clique no diagrama abre o lightbox */}
        <div ref={inlineRef} className={styles.diagram} onClick={openOverlay}>
          {children}
        </div>
      </div>

      {portal}
    </>
  );
}
