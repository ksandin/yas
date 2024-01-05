import { useMemo, useState } from "react";
import { createApiClient, ApiClientProvider } from "@yas/api-client";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { env } from "./env";
import { AppRoutes } from "./Routes";
import { ThemeProvider } from "./theme/ThemeProvider";
import { usePreferredTheme } from "./theme";
import { ErrorFallback } from "./components/ErrorFallback";

export default function App() {
  const preferredTheme = usePreferredTheme();
  const [theme, setTheme] = useState(preferredTheme);
  const apiClient = useMemo(() => createApiClient(env.apiUrl), []);

  return (
    <ErrorBoundary fallbackRender={ErrorFallback}>
      <BrowserRouter>
        <ApiClientProvider value={apiClient}>
          <ThemeProvider theme={theme} setTheme={setTheme}>
            <AppRoutes />
          </ThemeProvider>
        </ApiClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
