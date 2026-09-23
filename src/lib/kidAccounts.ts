/**
 * Kids log in with a username instead of an email address. Supabase auth
 * needs an email, so a username maps to <username>@leerling.aimetspark.nl.
 * These addresses never receive mail; teachers can reset a kid's password.
 */
export const KID_EMAIL_DOMAIN = "leerling.aimetspark.nl";

export const normalizeUsername = (u: string) => u.trim().toLowerCase();

export const isValidUsername = (u: string) => /^[a-z0-9._-]{3,20}$/.test(normalizeUsername(u));

export const loginEmailFor = (identifier: string) =>
  identifier.includes("@") ? identifier.trim().toLowerCase() : `${normalizeUsername(identifier)}@${KID_EMAIL_DOMAIN}`;

export const isKidEmail = (email?: string | null) => !!email && email.endsWith(`@${KID_EMAIL_DOMAIN}`);
