import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LandingNav } from '@/components/landing/LandingNav'
import { HeroSection } from '@/components/landing/HeroSection'
import {
  StatsBar,
  FeaturesSection,
  HowItWorksSection,
  PipelineSection,
  CTASection,
  LandingFooter,
} from '@/components/landing/LandingSections'

gsap.registerPlugin(ScrollTrigger)

export default function LandingPage() {
  return (
    <div className="relative bg-[#1C1917] min-h-screen">
      <LandingNav />
      <HeroSection />
      <StatsBar />
      <FeaturesSection />
      <HowItWorksSection />
      <PipelineSection />
      <CTASection />
      <LandingFooter />
    </div>
  )
}
