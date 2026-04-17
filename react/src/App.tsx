import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster, toast } from "sonner";
import Index from "./pages/Index";

const queryClient = new QueryClient();

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    console.log("ErrorBoundary caught:", error);
    toast.error("页面发生错误，请刷新重试");
  }
  render() {
    return this.state.hasError ? (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: `var(--tech-bg)`,
          color: `var(--tech-text-dim)`,
          fontSize: 14,
        }}
      >
        页面发生错误，请刷新重试
      </div>
    ) : (
      this.props.children
    );
  }
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Index />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
    <Toaster position="top-right" />
  </QueryClientProvider>
);

export default App;
