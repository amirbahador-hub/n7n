import { createComponentRenderer } from '@/__tests__/render';
import userEvent from '@testing-library/user-event';
import MCPOnboardingClientSetup from './MCPOnboardingClientSetup.vue';

const mockClipboardCopy = vi.fn();

vi.mock('@/app/composables/useClipboard', () => ({
	useClipboard: () => ({
		copy: mockClipboardCopy,
		copied: { value: false },
		isSupported: { value: true },
	}),
}));

const renderComponent = createComponentRenderer(MCPOnboardingClientSetup, {
	props: {
		client: 'codex',
		serverUrl: 'https://example.n8n.cloud/mcp-server/http',
	},
});

describe('MCPOnboardingClientSetup', () => {
	beforeEach(() => {
		mockClipboardCopy.mockReset();
	});

	it('renders the Codex prompt with the TOML section and home-dir path', () => {
		const { container } = renderComponent();
		const text = container.textContent ?? '';

		expect(text).toContain('[mcp_servers.n8n]');
		expect(text).toContain('~/.codex/config.toml');
		expect(text).toContain('https://example.n8n.cloud/mcp-server/http');
		expect(text).toContain('complete the n8n OAuth flow');
	});

	it('copies the prompt body and emits copy event on click', async () => {
		const user = userEvent.setup();
		const { getByTestId, emitted } = renderComponent();

		await user.click(getByTestId('mcp-onboarding-copy-prompt-button'));

		expect(mockClipboardCopy).toHaveBeenCalledTimes(1);
		const copiedText = mockClipboardCopy.mock.calls[0][0] as string;
		expect(copiedText).toContain('[mcp_servers.n8n]');
		expect(copiedText).toContain('complete the n8n OAuth flow');

		expect(emitted('copy')).toEqual([['agent-prompt']]);
	});
});
