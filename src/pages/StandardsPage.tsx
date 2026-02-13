/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BNB CHAIN AI TOOLKIT - Standards Page (ERC-8004 & W3AG)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ✨ Original Author: nich
 * 🐦 Twitter/X: x.com/nichxbt
 * 🐙 GitHub: github.com/nirholas
 * 📦 Repository: github.com/nirholas/bnb-chain-toolkit
 *
 * Copyright (c) 2024-2026 nirholas (nich)
 * Licensed under MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { motion } from 'framer-motion';
import {
  Shield,
  Accessibility,
  ExternalLink,
  BookOpen,
  CheckCircle,
  Github,
  ArrowDown,
  Fingerprint,
  Star,
  BadgeCheck,
  Eye,
  MousePointerClick,
  Brain,
  Cpu,
} from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { cn } from '@/lib/utils';
import {
  Spotlight,
  TextGenerateEffect,
  BackgroundGradient,
  TracingBeam,
  BentoGrid,
  BentoGridItem,
  CardContainer,
  CardBody,
  CardItem,
  LampContainer,
  MovingBorder,
} from '@/components/ui';
import {
  erc8004Timeline,
  w3agTimeline,
  erc8004Registries,
  w3agConformanceLevels,
  w3agComponents,
  standardOverviews,
} from '@/data/standards';
import type { TimelineEvent, ConformanceLevel, AccessibleComponent } from '@/data/standards';

// ─── Constants ───────────────────────────────────────────────────────────────

const GITHUB_BASE = 'https://github.com/nirholas/bnb-chain-toolkit';

const TYPE_COLORS: Record<TimelineEvent['type'], string> = {
  milestone: 'bg-[#F0B90B]/20 text-[#F0B90B] border-[#F0B90B]/30',
  technical: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  deployment: 'bg-green-500/20 text-green-400 border-green-500/30',
  community: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const TYPE_LABELS: Record<TimelineEvent['type'], string> = {
  milestone: 'Milestone',
  technical: 'Technical',
  deployment: 'Deployment',
  community: 'Community',
};

const LEVEL_COLORS: Record<string, { border: string; badge: string; glow: string }> = {
  A: {
    border: 'border-green-500/30',
    badge: 'bg-green-500/20 text-green-400',
    glow: 'shadow-green-500/10',
  },
  AA: {
    border: 'border-[#F0B90B]/30',
    badge: 'bg-[#F0B90B]/20 text-[#F0B90B]',
    glow: 'shadow-[#F0B90B]/10',
  },
  AAA: {
    border: 'border-purple-500/30',
    badge: 'bg-purple-500/20 text-purple-400',
    glow: 'shadow-purple-500/10',
  },
};

const PRINCIPLE_ICONS: Record<string, React.ReactNode> = {
  Perceivable: <Eye className="w-5 h-5" />,
  Operable: <MousePointerClick className="w-5 h-5" />,
  Understandable: <Brain className="w-5 h-5" />,
  Robust: <Cpu className="w-5 h-5" />,
};

const REGISTRY_ICONS: React.ReactNode[] = [
  <Fingerprint key="id" className="w-6 h-6 text-[#F0B90B]" />,
  <Star key="rep" className="w-6 h-6 text-[#F0B90B]" />,
  <BadgeCheck key="val" className="w-6 h-6 text-[#F0B90B]" />,
];

// ─── Sub-Components ──────────────────────────────────────────────────────────

function TimelineCard({ event, index }: { event: TimelineEvent; index: number }) {
  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className={cn(
        'relative rounded-2xl border p-6 md:p-8',
        'bg-white/[0.02] dark:bg-white/[0.02]',
        'border-gray-200 dark:border-white/10',
        event.highlight && 'border-[#F0B90B]/30 dark:border-[#F0B90B]/20',
      )}
    >
      {/* Date + type badge row */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <span className="text-sm font-mono font-semibold text-[#F0B90B]">
          {event.date}
        </span>
        <span
          className={cn(
            'text-xs font-medium px-2.5 py-0.5 rounded-full border',
            TYPE_COLORS[event.type],
          )}
        >
          {TYPE_LABELS[event.type]}
        </span>
      </div>

      <h4 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2">
        {event.title}
      </h4>

      <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base">
        {event.description}
      </p>

      {/* Code snippet */}
      {event.codeSnippet && (
        <pre className="mt-4 p-4 rounded-xl bg-black/40 dark:bg-black/60 border border-white/5 overflow-x-auto text-xs md:text-sm font-mono text-gray-300 leading-relaxed">
          <code>{event.codeSnippet}</code>
        </pre>
      )}

      {/* Link */}
      {event.link && (
        <a
          href={event.link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-[#F0B90B] hover:text-[#F0B90B]/80 transition-colors"
        >
          {event.link.label}
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </motion.div>
  );

  if (event.highlight) {
    return (
      <BackgroundGradient className="rounded-2xl" containerClassName="mb-8">
        {inner}
      </BackgroundGradient>
    );
  }

  return <div className="mb-8">{inner}</div>;
}

function ConformanceLevelCard({
  level,
  index,
}: {
  level: ConformanceLevel;
  index: number;
}) {
  const colors = LEVEL_COLORS[level.level] ?? LEVEL_COLORS['A'];

  return (
    <CardContainer containerClassName="py-4">
      <CardBody
        className={cn(
          'relative rounded-2xl border p-6 md:p-8 h-auto w-full',
          'bg-white/[0.02] dark:bg-white/[0.02]',
          colors.border,
          colors.glow,
          'shadow-xl',
        )}
      >
        <CardItem translateZ={40} className="w-full">
          <div className="flex items-center gap-3 mb-4">
            <span
              className={cn(
                'text-xl font-black px-3 py-1 rounded-lg border',
                colors.badge,
              )}
            >
              {level.level}
            </span>
            <div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                Level {level.level} — {level.name}
              </h4>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {level.criteriaCount} criteria · {level.target}
              </span>
            </div>
          </div>
        </CardItem>

        <CardItem translateZ={30} className="w-full">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
            {level.description}
          </p>
        </CardItem>

        <CardItem translateZ={20} className="w-full">
          <ul className="space-y-2">
            {level.examples.map((ex, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + i * 0.05 }}
                className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
              >
                <CheckCircle className="w-4 h-4 text-[#F0B90B] mt-0.5 shrink-0" />
                <span>{ex}</span>
              </motion.li>
            ))}
          </ul>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}

function ComponentShowcaseCard({ comp }: { comp: AccessibleComponent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={cn(
        'rounded-2xl border p-6',
        'bg-white/[0.02] dark:bg-white/[0.02]',
        'border-gray-200 dark:border-white/10',
        'hover:border-[#F0B90B]/30 transition-colors',
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-[#F0B90B]/10">
          {PRINCIPLE_ICONS[comp.principle] ?? <Eye className="w-5 h-5" />}
        </div>
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white">{comp.name}</h4>
          <span className="text-xs text-[#F0B90B] font-medium">{comp.principle}</span>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
        {comp.description}
      </p>
      <div className="space-y-1.5">
        {comp.criteria.map((c, i) => (
          <div
            key={i}
            className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#F0B90B] mt-0.5 shrink-0" />
            <span>{c}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function SectionHeading({
  icon,
  title,
  description,
  id,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  id?: string;
}) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-12 scroll-mt-24"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-[#F0B90B]/10">{icon}</div>
        <h2 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white">
          {title}
        </h2>
      </div>
      <p className="text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function StandardsPage() {
  useSEO({
    title: 'Standards — ERC-8004 & W3AG',
    description:
      'Original Web3 standards created for the BNB Chain AI Toolkit — ERC-8004 Agent Trust Registry and W3AG Web3 Accessibility Guidelines.',
    path: '/standards',
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* ── Section 1: Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[70vh] flex items-center">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 md:py-32 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
              Original{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F0B90B] to-[#F8D12F]">
                Web3 Standards
              </span>
            </h1>
          </motion.div>

          <div className="max-w-2xl mx-auto text-center mb-12">
            <TextGenerateEffect
              words="Two specifications created for this toolkit — agent trust and Web3 accessibility"
              className="text-gray-600 dark:text-gray-400 text-lg md:text-xl"
              duration={0.4}
            />
          </div>

          {/* Hero cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {standardOverviews.map((standard) => (
              <BackgroundGradient
                key={standard.id}
                className="rounded-2xl"
                containerClassName="h-full"
              >
                <div className="rounded-2xl p-6 md:p-8 bg-white/[0.02] dark:bg-black/60 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{standard.iconEmoji}</span>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white">
                        {standard.title}
                      </h3>
                      <span className="text-sm text-[#F0B90B] font-medium">
                        {standard.subtitle}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed flex-1">
                    {standard.description}
                  </p>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {standard.stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-lg bg-white/5 dark:bg-white/5 border border-gray-200 dark:border-white/5 px-3 py-2 text-center"
                      >
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <a
                    href={`#${standard.anchorId}`}
                    className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-[#F0B90B] hover:text-[#F0B90B]/80 transition-colors"
                  >
                    View {standard.title}{' '}
                    <ArrowDown className="w-3.5 h-3.5" />
                  </a>
                </div>
              </BackgroundGradient>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: ERC-8004 Deep Dive ──────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 py-16 md:py-24">
        <SectionHeading
          id="erc-8004-section"
          icon={<Shield className="w-6 h-6 text-[#F0B90B]" />}
          title="ERC-8004: Agent Trust Registry"
          description="An Ethereum EIP enabling open-ended agent economies through on-chain discovery, reputation, and validation. Three lightweight registries compose with ERC-721, EIP-712, and ERC-1271 to give every AI agent a verifiable, portable identity."
        />

        {/* Timeline with TracingBeam */}
        <TracingBeam className="mb-16">
          <div className="pl-4 md:pl-8">
            {erc8004Timeline.map((event, i) => (
              <TimelineCard key={i} event={event} index={i} />
            ))}
          </div>
        </TracingBeam>

        {/* Registries BentoGrid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6">
            The Three Registries
          </h3>
        </motion.div>

        <BentoGrid className="md:grid-cols-3 mb-8">
          {erc8004Registries.map((reg, i) => (
            <BentoGridItem
              key={reg.title}
              title={reg.title}
              description={
                <div>
                  <p className="mb-3 text-sm">{reg.description}</p>
                  <ul className="space-y-1.5">
                    {reg.capabilities.map((cap, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-1.5 text-xs text-gray-500 dark:text-gray-400"
                      >
                        <CheckCircle className="w-3 h-3 text-[#F0B90B] mt-0.5 shrink-0" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              }
              header={
                <div className="flex items-center justify-center h-24 rounded-xl bg-gradient-to-br from-[#F0B90B]/5 to-[#F0B90B]/10 border border-[#F0B90B]/10">
                  <span className="text-4xl">{reg.icon}</span>
                </div>
              }
              icon={REGISTRY_ICONS[i]}
              className="border-gray-200 dark:border-white/10"
            />
          ))}
        </BentoGrid>
      </section>

      {/* ── Section 3: W3AG Deep Dive ──────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 py-16 md:py-24">
        <SectionHeading
          id="w3ag-section"
          icon={<Accessibility className="w-6 h-6 text-[#F0B90B]" />}
          title="W3AG: Web3 Accessibility Guidelines"
          description="The first open standard for making Web3 applications accessible to people with disabilities. 50+ success criteria across 4 principles and 3 conformance levels — modeled after WCAG but purpose-built for blockchain UX patterns like wallet connect, transaction signing, and gas estimation."
        />

        {/* Timeline with TracingBeam */}
        <TracingBeam className="mb-16">
          <div className="pl-4 md:pl-8">
            {w3agTimeline.map((event, i) => (
              <TimelineCard key={i} event={event} index={i} />
            ))}
          </div>
        </TracingBeam>

        {/* Conformance Level 3D Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Conformance Levels
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Three tiers of accessibility — from essential to optimal
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {w3agConformanceLevels.map((level, i) => (
            <ConformanceLevelCard key={level.level} level={level} index={i} />
          ))}
        </div>

        {/* Accessible Component Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Accessible React Components
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Production-ready components that satisfy W3AG and WCAG criteria
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {w3agComponents.map((comp) => (
            <ComponentShowcaseCard key={comp.name} comp={comp} />
          ))}
        </div>
      </section>

      {/* ── Section 4: CTA ─────────────────────────────────────────────── */}
      <section className="relative">
        <LampContainer className="min-h-[50vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center max-w-2xl mx-auto px-4"
          >
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              Contribute to the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F0B90B] to-[#F8D12F]">
                Standards
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm md:text-base leading-relaxed">
              ERC-8004 and W3AG are open standards — built in public and open to
              contributions. Help shape the future of agent trust and Web3
              accessibility.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`${GITHUB_BASE}/tree/main/standards/erc-8004`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MovingBorder
                  duration={3}
                  borderRadius="1rem"
                  containerClassName="h-12"
                  className="bg-white dark:bg-black text-gray-900 dark:text-white font-semibold px-6 flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  View ERC-8004 on GitHub
                </MovingBorder>
              </a>
              <a
                href={`${GITHUB_BASE}/tree/main/standards/w3ag`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MovingBorder
                  duration={3.5}
                  borderRadius="1rem"
                  containerClassName="h-12"
                  className="bg-white dark:bg-black text-gray-900 dark:text-white font-semibold px-6 flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  View W3AG on GitHub
                </MovingBorder>
              </a>
            </div>
          </motion.div>
        </LampContainer>
      </section>
    </div>
  );
}
