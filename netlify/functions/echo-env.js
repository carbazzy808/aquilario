export const handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      url: process.env.SUPABASE_URL || "MISSING_URL",
      role: process.env.SUPABASE_SERVICE_ROLE ? "FOUND" : "MISSING"
    })
  };
};
