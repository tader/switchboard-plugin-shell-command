import { test } from 'node:test';
import assert from 'node:assert/strict';
import setup from '../plugins/shell-command/index.ts';
import type { PluginContext } from '../plugins/shell-command/types/api.d.ts';

for (const peer of [false, true, undefined]) {
  test(`shell commands run locally with peer=${peer}`, async () => {
    const context = { settings: { enabled: true }, ...(peer === undefined ? {} : { peer }) } as unknown as PluginContext;
    const plugin = await setup(context);
    try {
      const service = plugin.services![0]; const method = service.authMethods[0];
      assert.equal(method.unavailable, undefined);
      const connected: any = await method.connect!({ config: { command: 'printf "%s" "standalone shell output"' } } as any);
      const connection: any = { id: 'local', name: 'local', serviceId: service.id, methodId: method.id, config: connected.config, credentials: connected.credentials };
      const url = new URL(String(service.baseUrl)); const headers = new Headers();
      await method.authorize!({ url, headers, method: 'GET', body: null }, connection, { force: false });
      const response = await fetch(url, { headers });
      assert.equal(response.status, 200); assert.equal(await response.text(), 'standalone shell output');
      assert.equal(connection.config.command, undefined);
    } finally { await plugin.dispose!(); }
  });
}
test('local administrators must enable shell commands, independently of peer configuration', async () => {
  const plugin = await setup({ settings: { enabled: false } } as unknown as PluginContext);
  try { assert.match(plugin.services![0].authMethods[0].unavailable!, /local administrator/); }
  finally { await plugin.dispose!(); }
});
