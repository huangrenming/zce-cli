import * as config from './config'
import path from 'path'
const pkg = require('../../../package.json')

test('unit:core:helpers:config:get', async () => {
  const conf1 = await config.get()
  expect(conf1).toEqual({})

  pkg.name = 'fakkkkkker'
  pkg.bin = './bin/foo.js'
  const conf2 = await config.get()
  expect(conf2).toEqual({})
})

test('unit:core:helpers:config:get:name', async () => {
  const conf = await config.get('fakkkkkker')
  expect(conf).toEqual({})
})

test('unit:core:helpers:config:get:from', async () => {
  const conf = await config.get('test', path.join(__dirname, '../../../test/fixtures'))
  expect(conf).toEqual({ foo: 'bar' })
})

test('unit:core:helpers:config:get:options', async () => {
  const conf = await config.get('fakkkkkker', process.cwd(), { cache: false })
  expect(conf).toEqual({})
})

test('unit:core:helpers:config:ini', async () => {
  const conf = await config.ini(path.join(__dirname, '../../../test/fixtures/test.ini'))
  expect(conf).toEqual({ foo: 'bar' })
})

test('unit:core:helpers:config:npm', async () => {
  const conf = await config.npm()
  expect(conf).toBeTruthy()
})

test('unit:core:helpers:config:yarn', async () => {
  const conf = await config.yarn()
  expect(conf).toBeTruthy()
})

test('unit:core:helpers:config:git', async () => {
  const conf = await config.git()
  expect(conf).toBeTruthy()
})

test('unit:core:helpers:config:username', async () => {
  const username = await config.username()
  expect(username).toBeTruthy()
})

test('unit:core:helpers:config:fullname', async () => {
  const fullname = await config.fullname()
  expect(fullname).toBeTruthy()
})
