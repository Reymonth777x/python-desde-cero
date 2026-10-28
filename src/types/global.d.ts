interface Window {
  turnstile?: {
    render: (container: HTMLElement, options: Record<string, unknown>) => number;
    remove: (widget: number) => void;
  };
  MonacoEnvironment?: {
    baseUrl?: string;
  };
}
