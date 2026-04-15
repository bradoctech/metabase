import type { ReactNode } from "react";
import { t } from "ttag";

import { useSetting } from "metabase/common/hooks";
import { usePageTitle } from "metabase/hooks/use-page-title";
import { EnableTransformsPage } from "metabase/transforms/pages/EnableTransformsPage/EnableTransformsPage";

import { SectionLayout } from "../../components/SectionLayout";

type TransformsSectionLayoutProps = {
  children?: ReactNode;
};

export function TransformsSectionLayout({
  children,
}: TransformsSectionLayoutProps) {
  usePageTitle(t`Transforms`, { titleIndex: 1 });
  const isTransformsEnabled = useSetting("transforms-enabled");
  const isHosted = useSetting("is-hosted?");

  if (!isTransformsEnabled && !isHosted) {
    return <EnableTransformsPage />;
  }

  return <SectionLayout>{children}</SectionLayout>;
}
