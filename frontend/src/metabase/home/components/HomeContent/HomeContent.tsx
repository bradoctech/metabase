import { useMemo } from "react";
import { t } from "ttag";

import { useListPopularItemsQuery, useListRecentsQuery } from "metabase/api";
import { LoadingAndErrorWrapper } from "metabase/common/components/LoadingAndErrorWrapper";
import { useDatabaseListQuery, useSetting } from "metabase/common/hooks";
import { useSelector } from "metabase/lib/redux";
import { isSyncCompleted } from "metabase/lib/syncing";
import { getUser } from "metabase/selectors/user";
import type Database from "metabase-lib/v1/metadata/Database";
import type { PopularItem, RecentItem, User } from "metabase-types/api";

import { getIsXrayEnabled } from "../../selectors";
import { isWithinWeeks } from "../../utils";
import { EmbedHomepage } from "../EmbedHomepage";
import { HomeCaption } from "../HomeCaption";
import { HomeModelCard } from "../HomeModelCard";
import { HomePopularSection } from "../HomePopularSection";
import { HomeRecentSection, recentsFilter } from "../HomeRecentSection";
import { HomeXrayCard } from "../HomeXrayCard";
import { HomeXraySection } from "../HomeXraySection";
import { SectionBody } from "../HomeXraySection/HomeXraySection.styled";

// DEBUG: Mude para true para ver todos os tipos de card com dados estáticos
const DEBUG_CARDS = false;

const DebugCardsView = () => (
  <div
    style={{
      padding: "0",
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
    }}
  >
    <div>
      <HomeCaption
        primary
      >{t`HomeModelCard (usado em Recentes/Populares)`}</HomeCaption>
      <SectionBody>
        <HomeModelCard
          title="Alertas de Auditoria"
          badge="Auditoria"
          icon={{ name: "table2" }}
          url="#"
        />
        <HomeModelCard
          title="Abono de Permanencia - Dashboard"
          badge="RH"
          icon={{ name: "dashboard" }}
          url="#"
        />
        <HomeModelCard
          title="Desvio a Maior (Pagamentos Indevidos)"
          badge="Desvio a Maior (Pagamentos Indevidos)"
          icon={{ name: "grid" }}
          url="#"
        />
        <HomeModelCard
          title="Relatório de Inconsistências"
          icon={{ name: "table2" }}
          url="#"
        />
        <HomeModelCard
          title="Modelo de Dados eSocial"
          badge="eSocial"
          icon={{ name: "model" }}
          url="#"
        />
      </SectionBody>
    </div>
    <div>
      <HomeCaption
        primary
      >{t`HomeXrayCard (usado na seção de X-ray)`}</HomeCaption>
      <SectionBody $compact>
        <HomeXrayCard title="Orders" url="#" message="A look at" />
        <HomeXrayCard title="People" url="#" message="A summary of" />
        <HomeXrayCard title="Products" url="#" message="A glance at" />
        <HomeXrayCard title="Reviews" url="#" message="Some insights about" />
      </SectionBody>
    </div>
  </div>
);

export const HomeContent = (): JSX.Element | null => {
  if (DEBUG_CARDS) {
    return <DebugCardsView />;
  }
  return <HomeContentInner />;
};

const HomeContentInner = (): JSX.Element | null => {
  const user = useSelector(getUser);
  const embeddingHomepage = useSetting("embedding-homepage");
  const isXrayEnabled = useSelector(getIsXrayEnabled);

  const { data: databases, error: databasesError } = useDatabaseListQuery();
  const { data: recentItemsRaw, error: recentItemsError } = useListRecentsQuery(
    undefined,
    { refetchOnMountOrArgChange: true },
  );
  const { data: popularItems, error: popularItemsError } =
    useListPopularItemsQuery(undefined, { refetchOnMountOrArgChange: true });
  const error = databasesError || recentItemsError || popularItemsError;

  const recentItems = useMemo(
    () => (recentItemsRaw && recentsFilter(recentItemsRaw)) ?? [],
    [recentItemsRaw],
  );

  if (error) {
    return <LoadingAndErrorWrapper error={error} />;
  }

  if (!user || isLoading(user, databases, recentItems, popularItems)) {
    return <LoadingAndErrorWrapper loading />;
  }

  if (embeddingHomepage === "visible" && user.is_superuser) {
    return <EmbedHomepage />;
  }

  if (isPopularSection(user, recentItems, popularItems)) {
    return <HomePopularSection />;
  }

  if (isRecentSection(user, recentItems)) {
    return <HomeRecentSection />;
  }

  if (isXraySection(databases, isXrayEnabled)) {
    return <HomeXraySection />;
  }

  return null;
};

const isLoading = (
  user: User,
  databases: Database[] | undefined,
  recentItems: RecentItem[] | undefined,
  popularItems: PopularItem[] | undefined,
): boolean => {
  if (!user.has_question_and_dashboard) {
    return databases == null;
  } else if (user.is_installer || !isWithinWeeks(user.first_login, 1)) {
    return databases == null || recentItems == null;
  } else {
    return databases == null || recentItems == null || popularItems == null;
  }
};

const isPopularSection = (
  user: User,
  recentItems: RecentItem[] = [],
  popularItems: PopularItem[] = [],
): boolean => {
  return (
    !user.is_installer &&
    user.has_question_and_dashboard &&
    popularItems.length > 0 &&
    (isWithinWeeks(user.first_login, 1) || !recentItems.length)
  );
};

const isRecentSection = (
  user: User,
  recentItems: RecentItem[] = [],
): boolean => {
  return user.has_question_and_dashboard && recentItems.length > 0;
};

const isXraySection = (
  databases: Database[] = [],
  isXrayEnabled: boolean,
): boolean => {
  return databases.some(isSyncCompleted) && isXrayEnabled;
};
