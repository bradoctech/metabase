import { LoadingAndErrorWrapper } from "metabase/common/components/LoadingAndErrorWrapper";

import S from "./PermissionsEditor.module.css";
import {
  PermissionsEditorContent,
  type PermissionsEditorContentProps,
} from "./PermissionsEditorContent";

interface PermissionsEditorProps extends PermissionsEditorContentProps {
  isLoading?: boolean;
  error?: string;
}

export const PermissionsEditor = ({
  isLoading,
  error,
  ...contentProps
}: PermissionsEditorProps) => {
  return (
    <div className={S.PermissionsEditorRoot}>
      <LoadingAndErrorWrapper loading={isLoading} error={error} noWrapper>
        <PermissionsEditorContent {...contentProps} />
      </LoadingAndErrorWrapper>
    </div>
  );
};
