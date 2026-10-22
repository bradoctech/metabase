import { EntityIcon } from "metabase/common/components/EntityIcon";
import type { IconData } from "metabase/common/utils/icon";
import { Box, Ellipsified, Text } from "metabase/ui";

import { HomeCard } from "../HomeCard";

interface HomeModelCardProps {
  title: string;
  badge?: string;
  icon: IconData;
  url: string;
}

export const HomeModelCard = ({
  title,
  badge,
  icon,
  url,
}: HomeModelCardProps): JSX.Element => {
  const showBadge = badge != null && badge !== title;

  return (
    <HomeCard url={url}>
      <Box
        display="flex"
        style={{ flexDirection: "column", gap: "0.5rem" }}
        maw="100%"
        miw={0}
      >
        {showBadge && (
          <Text
            component="span"
            fz="0.7rem"
            fw={600}
            c="brand"
            bg="background-brand"
            px="0.5rem"
            py="0.2rem"
            style={{
              borderRadius: "0.25rem",
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "inline-block",
              width: "fit-content",
            }}
          >
            {badge}
          </Text>
        )}
        <Box display="flex" style={{ alignItems: "center" }} miw={0}>
          <Box display="flex" flex="0 0 auto">
            <EntityIcon {...icon} color="core-brand" />
          </Box>
          <Ellipsified c="text-primary" fz="md" fw="bold" ml="lg" maw="100%">
            {title}
          </Ellipsified>
        </Box>
      </Box>
    </HomeCard>
  );
};
