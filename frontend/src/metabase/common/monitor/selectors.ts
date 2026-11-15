import {
  getUser,
  getUserIsAdmin,
  getUserIsAnalyst,
} from "metabase/current-user";
import { PLUGIN_MONITOR } from "metabase/plugins";
import type { State } from "metabase/redux/store";
import { SP_COMMERCIAL_POLICY } from "metabase/sp/commercial-policy";
import { isWithinIframe } from "metabase/utils/iframe";

export function canAccessMonitorDiagnostics(state: State) {
  if (isWithinIframe()) {
    return false;
  }
  return getUserIsAdmin(state) || getUserIsAnalyst(state);
}

export function canAccessMonitoringTools(state: State) {
  if (isWithinIframe()) {
    return false;
  }
  return (
    getUserIsAdmin(state) ||
    (getUser(state)?.permissions?.can_access_monitoring ?? false)
  );
}

export function canAccessAlertsManagement(state: State) {
  if (isWithinIframe()) {
    return false;
  }
  return getUserIsAdmin(state);
}

export function canAccessAiAuditing(state: State) {
  if (isWithinIframe()) {
    return false;
  }
  return getUserIsAdmin(state);
}

export function canAccessMonitor(state: State) {
  return getMonitorInitialSection(state) !== null;
}

/** Keep the app switcher and landing page aligned with the visible sections. */
export function getMonitorInitialSection(
  state: State,
): "diagnostics" | "tasks" | "alerts" | null {
  if (
    canAccessMonitorDiagnostics(state) &&
    (SP_COMMERCIAL_POLICY.showUpsells ||
      PLUGIN_MONITOR.isDependencyDiagnosticsEnabled)
  ) {
    return "diagnostics";
  }
  if (canAccessMonitoringTools(state)) {
    return "tasks";
  }
  if (canAccessAlertsManagement(state)) {
    return "alerts";
  }
  return null;
}
