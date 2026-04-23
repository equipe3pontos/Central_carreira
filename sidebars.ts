import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * IA do site alinhada a hubs de documentação por produto (ex.: StackSpot Docs —
 * entrada com índice, conceitos e glossário antes dos capítulos longos).
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Módulo de Carreira',
      link: {
        type: 'doc',
        id: 'modulo-carreira/home',
      },
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Começar aqui',
          collapsed: false,
          items: [
            'modulo-carreira/home',
            'modulo-carreira/conceitos',
            'modulo-carreira/glossario',
          ],
        },
        {
          type: 'category',
          label: 'Fundamentos',
          collapsed: false,
          items: [
            'modulo-carreira/overview',
            'modulo-carreira/problema-proposta',
            'modulo-carreira/modelos-negocio',
            'modulo-carreira/escopo-metricas',
            'modulo-carreira/arquitetura-decisoes',
            'modulo-carreira/rotas-prototipo',
            'modulo-carreira/diagramas-e-jornadas',
          ],
        },
        {
          type: 'category',
          label: 'Perfis',
          collapsed: false,
          items: [
            {
              type: 'category',
              label: 'Colaborador',
              link: {
                type: 'doc',
                id: 'modulo-carreira/colaborador/index',
              },
              collapsed: false,
              items: [
                {
                  type: 'category',
                  label: 'Dashboard',
                  link: {
                    type: 'doc',
                    id: 'modulo-carreira/colaborador/dashboard',
                  },
                  collapsed: false,
                  items: [
                    'modulo-carreira/colaborador/dashboard/experiencia',
                    'modulo-carreira/colaborador/dashboard/decisoes-validacao',
                    'modulo-carreira/colaborador/dashboard/referencia-prototipo',
                  ],
                },
                'modulo-carreira/colaborador/pulse',
                'modulo-carreira/colaborador/projetos',
                'modulo-carreira/colaborador/squads',
                'modulo-carreira/colaborador/perfil-visao-geral',
                'modulo-carreira/colaborador/perfil-jornada',
                'modulo-carreira/colaborador/perfil-jornada-badges',
                'modulo-carreira/colaborador/perfil-experiencia',
                'modulo-carreira/colaborador/perfil-pdi',
                {
                  type: 'category',
                  label: 'Skills',
                  link: {
                    type: 'generated-index',
                    description: 'Matriz de competências, hard skills, soft skills e gaps — diagnóstico de evolução do colaborador.',
                  },
                  collapsed: false,
                  items: [
                    'modulo-carreira/colaborador/skills/matriz',
                    'modulo-carreira/colaborador/skills/hard',
                    'modulo-carreira/colaborador/skills/soft',
                    'modulo-carreira/colaborador/skills/gaps',
                  ],
                },
                'modulo-carreira/colaborador/perfil-performance-review',
                'modulo-carreira/colaborador/modais-inventario',
              ],
            },
            'modulo-carreira/rh-tech-people',
          ],
        },
      ],
    },
  ],
};

export default sidebars;
