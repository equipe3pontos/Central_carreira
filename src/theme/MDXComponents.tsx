import type {MDXComponentsObject} from '@docusaurus/theme-common';
import MDXComponents from '@theme-original/MDXComponents';
import {AnaliseProduto, ReferenciaProtótipo} from '@site/src/components/docs/DocSections';
import {FlowchartSteps} from '@site/src/components/docs/FlowchartSteps';
import {DiagramaZoom} from '@site/src/components/docs/DiagramaZoom';

const Extended: MDXComponentsObject = {
  ...MDXComponents,
  AnaliseProduto,
  ReferenciaProtótipo,
  FlowchartSteps,
  DiagramaZoom,
};

export default Extended;
