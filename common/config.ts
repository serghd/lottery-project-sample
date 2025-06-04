export function getEnv(key: string) {
   const envKey = process.env[key];
   if (!envKey) {
      throw new Error(`Please set your ${key} in a env-file`);
   }
   return envKey;
}

export function toBoolean(value: string | undefined): boolean {
   return value?.toLowerCase() === "true";
}
