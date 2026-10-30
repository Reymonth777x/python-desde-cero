interface Window {
  turnstile?: {
    render: (container: HTMLElement, options: Record<string, unknown>) => string | undefined;
    remove: (widget: string) => void;
    reset: (widget: string) => void;
  };
  MonacoEnvironment?: {
    baseUrl?: string;
  };
}
