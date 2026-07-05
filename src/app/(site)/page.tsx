export const dynamic = "force-dynamic";

import { Hero, ErpIntro } from "@/components/home/hero";
import { Solutions, FeatureShowcase } from "@/components/home/solutions";
import { CaseStudies, WebsiteProjects } from "@/components/home/showcase";
import { Partners } from "@/components/home/partners";
import { Testimonials, TeamGallery, SocialSection, NewsSection } from "@/components/home/social-proof";
import { getHome, getProjects } from "@/lib/content";

export default async function Home() {
  const c = await getHome();
  const { projects } = await getProjects();
  const digital = projects.filter((p) => p.category !== "Website Du Lịch");
  const websites = projects.filter((p) => p.category === "Website Du Lịch");

  return (
    <>
      <Hero data={c.hero} />
      <ErpIntro data={c.erp} />
      <Solutions data={c.solutions} />
      <FeatureShowcase introImage={c.featureIntroImage} features={c.features} />
      <WebsiteProjects meta={c.websites} items={websites} />
      <CaseStudies meta={c.caseStudies} items={digital} />
      <Partners data={c.partners} />
      <Testimonials data={c.testimonials} />
      <TeamGallery data={c.gallery} />
      <SocialSection data={c.social} />
      <NewsSection data={c.news} />
    </>
  );
}
