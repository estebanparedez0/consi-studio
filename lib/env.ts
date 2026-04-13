const DEFAULT_CATALOG_API_URL = "https://hook.us1.make.com/0yj7wtd83l0ndymto95wzvmywb1rbq1e";

function getOptional(name: string) {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value : undefined;
}

export const env = {
  catalogApiUrl: getOptional("CATALOG_API_URL") ?? DEFAULT_CATALOG_API_URL,
  siteUrl: getOptional("NEXT_PUBLIC_SITE_URL"),
  whatsappNumber: getOptional("NEXT_PUBLIC_WHATSAPP_NUMBER")
};
