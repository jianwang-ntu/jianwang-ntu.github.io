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
    intro: 'At 58.com I worked on the shared web layer behind several mobile and web products. Two parts of that work were an asynchronous web framework and a traffic router implemented as a custom Nginx module.',
    frameworkTitle: 'Shared web framework',
    frameworkIntro: [
      'App-facing services, Mobile WAP, and business sites needed the same basic request plumbing. Implementing it separately in every product created duplicated work and inconsistent behaviour.',
      'I worked on an asynchronous framework that put the request lifecycle, middleware, and calls to common components behind a shared interface. Product-specific handlers stayed with each business line.',
    ],
    frameworkAlt: 'App-facing services, Mobile WAP, and business lines use a shared asynchronous web framework to reach business and platform services.',
    frameworkCaption: 'The shared layer handled request processing and common components; each product kept its own business logic.',
    viewDiagram: 'View full-size diagram ↗',
    implementationTitle: 'How it worked',
    implementationText: 'The framework used asynchronous I/O for downstream waits. Middleware exposed reusable capabilities through stable interfaces, while business handlers remained outside the framework. This kept one request path without forcing every product into the same application design.',
    frameworkChallengeTitle: 'Engineering trade-offs',
    frameworkChallengeText: 'A shared component removed repeated work, but it also increased the impact of a regression. Compatibility between teams moving at different speeds, per-request overhead, and failure isolation all mattered more than they would in a single site.',
    scaleMetric: '100M+ daily requests',
    scaleTitle: 'Production scale',
    scaleText: 'The framework handled more than 100 million requests per day in production. At that volume, small costs in the middleware chain were multiplied across the platform, so the common path had to remain short and predictable.',
    scaleNote: 'I no longer have the original latency and CPU reports, so I only include the production scale that is still documented.',
    routerTitle: 'Traffic routing in Nginx',
    routerIntro: [
      'I also designed a company traffic router as a custom Nginx module. It applied shared routing policy before a request reached an application service and selected the appropriate upstream business pool.',
      'The module read the request attributes needed for routing, matched centrally managed rules, selected an upstream, and followed an explicit fallback when a rule or destination was unavailable.',
    ],
    routerAlt: 'Requests enter Nginx, pass through a custom routing module, and are sent to different business service pools.',
    routerCaption: 'Routing decisions were made in the Nginx request path before traffic reached an application service.',
    openResty: 'The design is comparable to OpenResty in one specific sense: both add programmable behaviour to the Nginx request lifecycle. This project used a custom module; it was not an OpenResty or Lua implementation.',
    routerChallengeTitle: 'What was difficult',
    routerChallengeText: 'Rule matching ran on the hot path, so its cost had to stay bounded as the rule set grew. Configuration changes also had to take effect without disturbing active traffic. Centralising routing simplified policy, but made isolation and fallback behaviour more important.',
  },
  zh: {
    lang: 'zh-CN',
    path: '/zh/work/58-web-infrastructure',
    alternatePath: '/work/58-web-infrastructure',
    title: '58同城的 Web 基础设施',
    description: '在 58同城参与的两个基础设施项目：面向多业务线的异步 Web 框架，以及运行在 Nginx 内的流量路由模块。',
    back: '← 项目列表',
    overline: '58同城 · 后端工程师 · 北京 · 2011–2017',
    intro: '在 58同城期间，我主要做移动 Web 与后端基础设施。这里整理两个代表性项目：面向多个业务线的异步 Web 框架，以及运行在 Nginx 内部的公司级流量路由模块。',
    frameworkTitle: '共享 Web 框架',
    frameworkIntro: [
      '当时 App、Mobile WAP 和各业务站点都需要相似的请求处理能力。如果每条业务线各自实现，不但重复建设，接口和运行方式也会逐渐分化。',
      '我的工作是把请求生命周期、中间件机制和公共组件调用下沉到同一层。具体业务处理仍由各团队维护，通过统一接口接入框架。',
    ],
    frameworkAlt: 'App、Mobile WAP 和多个业务线通过共享异步 Web 框架访问业务服务与平台服务。',
    frameworkCaption: '共享层负责请求处理和公共组件；每条业务线保留自己的业务逻辑。',
    viewDiagram: '查看原图 ↗',
    implementationTitle: '实现方式',
    implementationText: '框架使用异步 I/O 处理下游等待，公共能力以中间件形式组合，并通过稳定接口向业务方提供。这样可以复用同一套请求处理基础设施，又不需要把具体业务写进框架。',
    frameworkChallengeTitle: '工程难点',
    frameworkChallengeText: '公共组件的改动会同时影响多个业务线，因此兼容性、单次请求开销和故障隔离都比单个站点更重要。各团队升级节奏不同，接口还需要允许新旧版本并行迁移。',
    scaleMetric: '日请求量 1 亿+',
    scaleTitle: '生产规模',
    scaleText: '该框架在生产环境承载每天超过 1 亿次请求。在这个量级，中间件链路上的微小开销都会被整体流量放大，因此公共路径必须保持短而稳定。',
    scaleNote: '原始的延迟和 CPU 报表目前不在手边，因此这里只保留仍有记录的请求规模。',
    routerTitle: 'Nginx 内的流量路由',
    routerIntro: [
      '另一个项目是公司级流量路由器，以自定义 Nginx 模块运行在代理层。它在请求进入应用服务之前执行统一路由策略，并把流量转发到对应的业务服务池。',
      '模块读取路由所需的请求字段，匹配集中管理的规则，选择上游服务；当规则异常或目标不可用时，则进入明确的回退路径。',
    ],
    routerAlt: '请求进入 Nginx 后经过自定义流量路由模块，再被转发到不同的业务服务池。',
    routerCaption: '路由决策发生在 Nginx 请求链路内，业务服务仍是普通的上游节点。',
    openResty: '从设计思路看，它与 OpenResty 的相似点是在 Nginx 请求生命周期中加入可编程逻辑。当时的实现是自定义模块，并不是使用 OpenResty 或 Lua。',
    routerChallengeTitle: '工程难点',
    routerChallengeText: '规则匹配位于请求热路径，计算量不能随着业务规则增长而失控；配置更新不能打断正在处理的流量；路由集中以后，故障影响范围也更大，因此必须准备隔离与回退机制。',
  },
};

function SystemFigure({ src, alt, caption, viewLabel, priority = false }) {
  return (
    <figure className="xp-result f8-system-figure">
      <img
        src={src}
        width="1440"
        height="900"
        loading={priority ? 'eager' : 'lazy'}
        fetchpriority={priority ? 'high' : undefined}
        decoding="async"
        alt={alt}
      />
      <figcaption>
        {caption}
        <a href={src} target="_blank" rel="noreferrer" className="f8-fullsize-link">
          {viewLabel}
        </a>
      </figcaption>
    </figure>
  );
}

function Detail({ title, children }) {
  return (
    <section className="f8-detail">
      <h3>{title}</h3>
      <p>{children}</p>
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
        <article className="industry-case-study f8-project" lang={copy.lang}>
          <div className="f8-page-tools">
            <Link to="/work" className="xp-back">{copy.back}</Link>
            <nav className="f8-language" aria-label={isZh ? '语言选择' : 'Language'}>
              {isZh ? <a href={copy.alternatePath}>EN</a> : <span aria-current="page">EN</span>}
              <span aria-hidden="true">/</span>
              {isZh ? <span aria-current="page">中文</span> : <a href={copy.alternatePath}>中文</a>}
            </nav>
          </div>

          <header className="xp-hero f8-hero">
            <p className="xp-overline">{copy.overline}</p>
            <h1>{copy.title}</h1>
            <p className="xp-dek">{copy.intro}</p>
          </header>

          <section className="xp-section f8-section" aria-labelledby="framework-title">
            <h2 id="framework-title">{copy.frameworkTitle}</h2>
            <div className="f8-section-copy">
              {copy.frameworkIntro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <SystemFigure
              src={isZh
                ? '/images/projects/58/shared-middleware-architecture-zh.svg'
                : '/images/projects/58/shared-middleware-architecture.svg'}
              alt={copy.frameworkAlt}
              caption={copy.frameworkCaption}
              viewLabel={copy.viewDiagram}
              priority
            />
            <div className="f8-detail-grid">
              <Detail title={copy.implementationTitle}>{copy.implementationText}</Detail>
              <Detail title={copy.frameworkChallengeTitle}>{copy.frameworkChallengeText}</Detail>
            </div>
          </section>

          <section className="f8-scale" aria-labelledby="scale-title">
            <p className="f8-scale-metric">{copy.scaleMetric}</p>
            <div>
              <h2 id="scale-title">{copy.scaleTitle}</h2>
              <p>{copy.scaleText}</p>
              <p className="f8-source-note">{copy.scaleNote}</p>
            </div>
          </section>

          <section className="xp-section f8-section" aria-labelledby="router-title">
            <h2 id="router-title">{copy.routerTitle}</h2>
            <div className="f8-section-copy">
              {copy.routerIntro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <SystemFigure
              src={isZh
                ? '/images/projects/58/nginx-traffic-router-zh.svg'
                : '/images/projects/58/nginx-traffic-router.svg'}
              alt={copy.routerAlt}
              caption={copy.routerCaption}
              viewLabel={copy.viewDiagram}
            />
            <p className="f8-openresty-note">{copy.openResty}</p>
            <Detail title={copy.routerChallengeTitle}>{copy.routerChallengeText}</Detail>
          </section>
        </article>
      </SiteFrame>
      <Footer />
    </div>
  );
}
