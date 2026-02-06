import cx from "classnames";
import PropTypes from "prop-types";
import { Component } from "react";

import CS from "metabase/css/core/index.css";
import { PLUGIN_LOGO_ICON_COMPONENTS } from "metabase/plugins";

// São Paulo coat of arms logo
import SaoPauloLogo from "assets/img/logo-sp.svg";

export class DefaultLogoIcon extends Component {
  static defaultProps = {
    height: 32,
  };
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    dark: PropTypes.bool,
    fill: PropTypes.string,
  };

  render() {
    const { dark, height, width } = this.props;
    const aspectRatio = 370.21 / 430.14; // São Paulo logo aspect ratio
    const calculatedWidth = width || height * aspectRatio;
    
    return (
      <img
        src={SaoPauloLogo}
        alt="São Paulo"
        className={cx("Icon")}
        width={calculatedWidth}
        height={height}
        style={{ objectFit: "contain" }}
        data-testid="main-logo"
      />
    );
  }
}

export default function LogoIcon(props) {
  const [Component = DefaultLogoIcon] = PLUGIN_LOGO_ICON_COMPONENTS;
  return <Component {...props} />;
}
