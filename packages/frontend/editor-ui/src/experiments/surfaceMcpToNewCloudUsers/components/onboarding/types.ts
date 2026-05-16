export type MCPOnboardingClient = 'codex' | 'cursor' | 'chatgpt';

export type MCPOnboardingClientOption = {
	value: MCPOnboardingClient;
	slug: string;
	label: string;
};
