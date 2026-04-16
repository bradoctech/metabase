import { getSubpathSafeUrl } from "metabase/lib/urls";
import { PLUGIN_LOGO_ICON_COMPONENTS } from "metabase/plugins";

/** Served from `resources/frontend_client/app/assets/img/logo.svg` */
const RESOURCE_LOGO_PATH = "app/assets/img/logo.svg";

interface LogoIconProps {
  width?: number;
  height?: number;
  dark?: boolean;
  fill?: string;
}

export const DefaultLogoIcon = ({
  height = 32,
  width,
  dark: _dark,
  fill: _fill,
}: LogoIconProps) => {
  const src = getSubpathSafeUrl(RESOURCE_LOGO_PATH);

  return (
    <img
      src={src}
      alt=""
      className="Icon"
      data-testid="main-logo"
      height={height}
      width={width}
      style={{
        display: "block",
        objectFit: "contain",
        width: width ?? "auto",
        maxHeight: height,
      }}
    />
  );
};

export function LogoIcon(props: LogoIconProps) {
  const [Component = DefaultLogoIcon] = PLUGIN_LOGO_ICON_COMPONENTS;
  return <Component {...props} />;
}
