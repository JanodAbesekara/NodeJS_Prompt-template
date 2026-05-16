const required = (name, value) => {
  if (value === undefined || value === null || String(value).trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return String(value);
};

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || "5000",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",

  MONGODB_URI: process.env.MONGODB_URI,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  ADMIN_NAME: process.env.ADMIN_NAME || "Admin User",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,

  validate() {
    required("MONGODB_URI", this.MONGODB_URI);
    required("JWT_ACCESS_SECRET", this.JWT_ACCESS_SECRET);
    required("JWT_REFRESH_SECRET", this.JWT_REFRESH_SECRET);

    if (this.JWT_ACCESS_SECRET.length < 32) {
      throw new Error("JWT_ACCESS_SECRET must be at least 32 characters");
    }
    if (this.JWT_REFRESH_SECRET.length < 32) {
      throw new Error("JWT_REFRESH_SECRET must be at least 32 characters");
    }
  },
};

export default env;
