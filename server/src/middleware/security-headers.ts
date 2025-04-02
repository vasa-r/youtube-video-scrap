import helmet from "helmet";
import cors from "cors";
import { envConfig } from "../config/env-config";

const corsOptions = {
  origin:
    envConfig.server.env === "development"
      ? "http://localhost:3000"
      : envConfig.server.allowedOrigins || "",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://apis.google.com"],
      styleSrc: null,
      imgSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "same-origin" },
  referrerPolicy: { policy: "no-referrer" },
  frameguard: { action: "deny" },
  hsts: { maxAge: 86400, includeSubDomains: false },
  noSniff: true,
  dnsPrefetchControl: { allow: false },
  permittedCrossDomainPolicies: { permittedPolicies: "none" },
  xssFilter: true,
});

const applySecurity = [cors(corsOptions), securityHeaders];

export default applySecurity;
