import { useEffect, useState } from "react";
import { t } from "ttag";

import { useLocale } from "metabase/common/hooks/use-locale";
import type { EngineKey } from "metabase-types/api";

import { ENGINE_DOC_MAP } from "./constants";

export const useEngineDocMarkdownContent = (engineKey: EngineKey) => {
  const { locale } = useLocale();
  const [markdownContent, setMarkdownContent] = useState<string>();
  const [loadingError, setLoadingError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const docFileName = ENGINE_DOC_MAP[engineKey];

    if (!docFileName) {
      setMarkdownContent(undefined);
      setLoadingError(t`Failed to load detailed documentation`);
      return;
    }

    setIsLoading(true);
    setLoadingError(undefined);

    const loadDocumentation =
      engineKey === "postgres" &&
      locale?.replace(/_/g, "-").toLowerCase() === "pt-br"
        ? import("docs/databases/connections/postgresql.pt-BR.md")
        : import(`docs/databases/connections/${docFileName}.md`);

    loadDocumentation
      .then((result: { default: string }) => {
        setMarkdownContent(result.default);
      })
      .catch((err) => {
        setMarkdownContent(undefined);
        setLoadingError(t`Failed to load detailed documentation`);
        console.error(
          "Failed to load documentation for engine:",
          engineKey,
          err,
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [engineKey, locale]);

  return { markdownContent, loadingError, isLoading };
};
