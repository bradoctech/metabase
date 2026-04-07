/**
 * Client configuration derived from build-time environment variables.
 *
 * Set MB_CURRENT_CLIENT in your environment or .env file to activate
 * client-specific customizations without affecting other deployments.
 *
 * Example: MB_CURRENT_CLIENT=saopaulo
 */
export const CURRENT_CLIENT = process.env.MB_CURRENT_CLIENT ?? "default";

export const IS_SAOPAULO_CLIENT = CURRENT_CLIENT === "saopaulo";
