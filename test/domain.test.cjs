const { test } = require('node:test');
const assert = require('node:assert/strict');
const serve = require('./http.cjs');

test('room inventory adjustments require internal credentials', async t => {
  process.env.INTERNAL_SERVICE_TOKEN = 'internal-test-secret';
  const request = await serve(t, require('../server'));
  for (const action of ['increase', 'decrease']) {
    const response = await request(`/accommodations/507f1f77bcf86cd799439011/room-types/${action}`, { method: 'PUT' });
    assert.equal(response.status, 401);
  }
});

test('hotel update cannot change another provider record or transfer ownership', async t => {
  const Model = require('../src/models/Accommodation');
  let query;
  t.mock.method(Model, 'findOneAndUpdate', async (filter, data) => { query = filter; assert.equal(data.userId, undefined); return null; });
  const req = { params: { id: '507f1f77bcf86cd799439011' }, user: { username: 'owner' }, body: { userId: 'intruder', name: 'New name' } };
  let status;
  await require('../src/controllers/accommodationController').updateAccommodation(req, { status(c) { status = c; return this; }, json() {} });
  assert.deepEqual(query, { _id: req.params.id, userId: 'owner' });
  assert.equal(status, 404);
});
