import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Seo from '../components/Seo.jsx';
import SiteFrame from '../components/SiteFrame.jsx';

const PROJECT_SOCIAL_IMAGE = 'https://www.wj2ai.com/images/projects/58/shared-web-infrastructure.png';

const COPY = {
  en: {
    lang: 'en',
    path: '/work/58-web-infrastructure',
    alternatePath: '/zh/work/58-web-infrastructure',
    title: 'Web Infrastructure at 58.com',
    description: 'Two infrastructure projects from 58.com: a shared asynchronous web framework and a custom traffic-routing module for Nginx.',
    back: '← Work & Projects',
    overline: '58.com · Backend Engineer · Beijing · 2011–2017',
    intro: 'At 58.com I worked on the shared web layer behind several mobile and web products. This page covers two connected projects: an asynchronous framework for reusable request handling, and a company traffic router implemented as a custom Nginx module.',
    labels: {
      implementation: 'Implementation.',
      efficiency: 'Efficiency.',
      difficulty: 'What was difficult.',
    },
    viewDiagram: 'View full-size diagram ↗',
    framework: {
      title: 'Shared web framework',
      intro: [
        'App-facing services, Mobile WAP, and business sites needed the same request plumbing. Implementing it separately in every product created duplicated work and inconsistent behaviour.',
        'The framework separated shared request handling from product-specific business logic. That gave teams one common path while allowing each business line to keep its own application design and release cadence.',
      ],
      image: '/images/projects/58/shared-middleware-architecture.svg',
      alt: 'App-facing services, Mobile WAP, and business lines use a shared asynchronous web framework to reach business and platform services.',
      caption: 'The shared layer handled request processing and common components; each product kept its own business logic.',
      implementation: 'Asynchronous I/O covered downstream waits. A middleware chain exposed authentication, request parsing, service access, caching, and response handling through stable interfaces to common components; business handlers stayed outside the framework.',
      efficiency: 'The documented production system handled 100M+ daily requests. Because even a small middleware cost was multiplied across that volume, the common request path had to remain short and predictable.',
      difficulty: 'A shared component removed repeated work but also increased the impact of a regression. Backward compatibility across teams moving at different speeds, per-request overhead, and failure isolation all had to be handled at the shared boundary.',
      evidence: 'The original latency and CPU reports are no longer available, so this page retains the documented request scale without reconstructing performance measurements.',
    },
    router: {
      title: 'Traffic routing in Nginx',
      intro: [
        'The traffic router applied shared policy before a request reached an application service. It selected an upstream business pool in the Nginx request path instead of asking every downstream service to repeat the same routing decisions.',
        'Its programming goal was comparable to OpenResty in one specific sense: both add programmable behaviour to the Nginx lifecycle. This system used a custom module; it was not an OpenResty or Lua implementation.',
      ],
      image: '/images/projects/58/nginx-traffic-router.svg',
      alt: 'Requests enter Nginx, pass through a custom routing module, and are sent to different business service pools.',
      caption: 'Routing decisions were made in the Nginx request path before traffic reached an application service.',
      implementation: 'The module read the request attributes required by policy, matched centrally managed rules, selected an upstream, and followed an explicit fallback when a rule or destination was unavailable.',
      efficiency: 'Rule matching sat on the hot path, so its cost needed to stay bounded as the rule set grew. Configuration changes also needed to become visible without interrupting active traffic.',
      difficulty: 'Centralising routing simplified policy management but concentrated risk. Safe rule updates, isolation between destinations, and predictable fallback behaviour therefore had to be defined explicitly.',
    },
  },
  zh: {
    lang: 'zh-CN',
    path: '/zh/work/58-web-infrastructure',
    alternatePath: '/work/58-web-infrastructure',
    title: '58同城的 Web 基础设施',
    description: '在 58同城参与的两个基础设施项目：面向多业务线的异步 Web 框架，以及运行在 Nginx 内的流量路由模块。',
    back: '← 项目列表',
    overline: '58同城 · 后端工程师 · 北京 · 2011–2017',
    intro: '在 58同城期间，我主要做移动 Web 与后端基础设施。这里整理两个相互关联的项目：用于复用请求处理能力的异步 Web 框架，以及作为自定义 Nginx 模块运行的公司级流量路由器。',
    labels: {
      implementation: '实现：',
      efficiency: '效率：',
      difficulty: '难点：',
    },
    viewDiagram: '查看原图 ↗',
    framework: {
      title: '共享 Web 框架',
      intro: [
        '当时 App、Mobile WAP 和各业务站点都需要相似的请求处理能力。如果每条业务线各自实现，不但重复建设，接口和运行方式也会逐渐分化。',
        '框架把公共请求处理与具体业务逻辑分开：业务团队共用一条基础链路，同时保留自己的应用结构和发布节奏。',
      ],
      image: '/images/projects/58/shared-middleware-architecture-zh.svg',
      alt: 'App、Mobile WAP 和多个业务线通过共享异步 Web 框架访问业务服务与平台服务。',
      caption: '共享层负责请求处理和公共组件；每条业务线保留自己的业务逻辑。',
      implementation: '框架使用异步 I/O 处理下游等待。鉴权、请求解析、服务访问、缓存和响应处理等公共能力通过中间件组合，并以稳定接口向业务方提供；具体业务处理不写入框架。',
      efficiency: '该生产系统有记录的规模为日请求量 1 亿+。在这个量级，中间件链路上的微小开销都会被整体流量放大，因此公共路径必须保持短而稳定。',
      difficulty: '公共组件减少了重复建设，也放大了回归影响。不同团队的升级节奏、接口向后兼容、单次请求开销和故障隔离都必须在共享边界内考虑。',
      evidence: '原始的延迟和 CPU 报表目前不在手边，因此这里只保留仍有记录的请求规模，不重建具体性能数据。',
    },
    router: {
      title: 'Nginx 内的流量路由',
      intro: [
        '流量路由器在请求进入应用服务之前执行统一策略，并在 Nginx 请求链路内选择对应的业务服务池，避免每个下游服务重复实现路由判断。',
        '从编程目标看，它与 OpenResty 的相似点是在 Nginx 生命周期中加入可编程逻辑。当时的实现是自定义模块，并不是使用 OpenResty 或 Lua。',
      ],
      image: '/images/projects/58/nginx-traffic-router-zh.svg',
      alt: '请求进入 Nginx 后经过自定义流量路由模块，再被转发到不同的业务服务池。',
      caption: '路由决策发生在 Nginx 请求链路内，业务服务仍是普通的上游节点。',
      implementation: '模块读取路由所需的请求字段，匹配集中管理的规则，选择上游服务；当规则异常或目标不可用时，则进入明确的回退路径。',
      efficiency: '规则匹配位于请求热路径，计算量不能随着业务规则增长而失控；配置更新还需要在不中断活动流量的情况下生效。',
      difficulty: '路由集中以后，策略管理更简单，但故障影响范围也更大。因此，安全更新、目标隔离和可预测的回退行为都属于路由设计本身。',
    },
  },
};

function SystemFigure({ project, viewLabel, priority = false }) {
  return (
    <figure className="case-study-figure f8-system-figure">
      <img
        src={project.image}
        width="1440"
        height="900"
        loading={priority ? 'eager' : 'lazy'}
        fetchpriority={priority ? 'high' : undefined}
        decoding="async"
        alt={project.alt}
      />
      <figcaption>
        {project.caption}
        <a href={project.image} target="_blank" rel="noreferrer" className="f8-fullsize-link">
          {viewLabel}
        </a>
      </figcaption>
    </figure>
  );
}

function EngineeringNotes({ project, labels }) {
  return (
    <div className="case-study-notes">
      <p className="case-study-note"><strong>{labels.implementation}</strong> {project.implementation}</p>
      <p className="case-study-note"><strong>{labels.efficiency}</strong> {project.efficiency}</p>
      <p className="case-study-note"><strong>{labels.difficulty}</strong> {project.difficulty}</p>
    </div>
  );
}

function ProjectSection({ project, labels, viewLabel, priority = false }) {
  return (
    <section className="case-study-section">
      <h2>{project.title}</h2>
      {project.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <SystemFigure project={project} viewLabel={viewLabel} priority={priority} />
      <EngineeringNotes project={project} labels={labels} />
      {project.evidence && <p className="case-study-evidence">{project.evidence}</p>}
    </section>
  );
}

export default function FiftyEightWebInfrastructure({ lang = 'en' }) {
  const isZh = lang === 'zh-CN';
  const copy = isZh ? COPY.zh : COPY.en;

  return (
    <div className="page">
      <Seo
        title={copy.title}
        description={copy.description}
        image={PROJECT_SOCIAL_IMAGE}
        path={copy.path}
        lang={copy.lang}
      />
      <Nav skipToContent />
      <SiteFrame mainClassName="case-study-main">
        <article className="editorial-case-study f8-project" lang={copy.lang}>
          <div className="f8-page-tools">
            <Link to="/work" className="case-study-back">{copy.back}</Link>
            <nav className="f8-language" aria-label={isZh ? '语言选择' : 'Language'}>
              {isZh ? <a href={copy.alternatePath}>EN</a> : <span aria-current="page">EN</span>}
              <span aria-hidden="true">/</span>
              {isZh ? <span aria-current="page">中文</span> : <a href={copy.alternatePath}>中文</a>}
            </nav>
          </div>

          <header className="case-study-header">
            <p className="case-study-overline">{copy.overline}</p>
            <h1>{copy.title}</h1>
            <p className="case-study-deck">{copy.intro}</p>
          </header>

          <ProjectSection project={copy.framework} labels={copy.labels} viewLabel={copy.viewDiagram} priority />
          <ProjectSection project={copy.router} labels={copy.labels} viewLabel={copy.viewDiagram} />
        </article>
      </SiteFrame>
      <Footer />
    </div>
  );
}
