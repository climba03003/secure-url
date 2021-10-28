const t = require("tap");
const SecureURL = require("../lib");

t.plan(9);
t.test("invalid option", function (t) {
  t.plan(2);

  t.test("throw for mode", function (t) {
    t.plan(2);
    try {
      // eslint-disable-next-line
      new SecureURL("invalid", { mode: "invalid" });
    } catch (err) {
      t.type(err, "Error");
      t.equal(
        err.message,
        '"mode" is expected to be "path", "relax" or "insecure", but recieved "invalid"'
      );
    }
  });

  t.test("throw for keepPort", function (t) {
    t.plan(2);
    try {
      // eslint-disable-next-line
      new SecureURL("invalid", { keepPort: "invalid" });
    } catch (err) {
      t.type(err, "Error");
      t.equal(
        err.message,
        '"keepPort" is expected to be boolean, but recieved "invalid"'
      );
    }
  });
});

t.test("constructor", function (t) {
  t.plan(1);
  // eslint-disable-next-line
  const url = SecureURL("https://localhost.local/");
  t.equal(url instanceof SecureURL, true);
});

t.test("SecureURL or URL as base and path", function (t) {
  const cases = [
    {
      name: "should be allowed",
      path: new SecureURL("https://foo.bar/hello/world", { mode: "relax" }),
      base: new SecureURL("https://localhost.local/", { mode: "relax" }),
      option: { mode: "path", keepPort: false },
      expected: {
        href: "https://localhost.local/hello/world",
      },
    },
    {
      name: "should be allowed",
      path: new SecureURL("https://foo.bar/hello/world", { mode: "relax" }),
      base: new SecureURL("https://localhost.local/", { mode: "relax" }),
      option: { mode: "relax", keepPort: false },
      expected: {
        href: "https://foo.bar/hello/world",
      },
    },
    {
      name: "should be allowed",
      path: new URL("https://foo.bar/hello/world"),
      base: new URL("https://localhost.local/"),
      option: { mode: "path", keepPort: false },
      expected: {
        href: "https://localhost.local/hello/world",
      },
    },
    {
      name: "should be allowed",
      path: new URL("https://foo.bar/hello/world"),
      base: new URL("https://localhost.local/"),
      option: { mode: "relax", keepPort: false },
      expected: {
        href: "https://foo.bar/hello/world",
      },
    },
  ];

  t.plan(cases.length);

  for (let i = 0; i < cases.length; i++) {
    const kase = cases[i];
    t.test(kase, function (t) {
      const keys = Object.keys(kase.expected);
      t.plan(keys.length);
      const url = new SecureURL(kase.path, kase.base, kase.option);
      for (const key in keys) {
        t.equal(url[key], kase.expected[key]);
      }
    });
  }
});

t.test("path mode and not keep port", function (t) {
  const cases = [
    {
      name: "should not update host",
      path: "https://foo.bar/hello/world",
      base: "https://localhost.local/",
      option: { mode: "path", keepPort: false },
      expected: {
        href: "https://localhost.local/hello/world",
      },
    },
    {
      name: "should not update host",
      path: "https://foo.bar/hello/world",
      base: "https://foo@localhost.local/",
      option: { mode: "path", keepPort: false },
      expected: {
        href: "https://foo@localhost.local/hello/world",
      },
    },
    {
      name: "should not update host",
      path: "https://foo.bar/hello/world",
      base: "https://foo:bar@localhost.local/",
      option: { mode: "path", keepPort: false },
      expected: {
        href: "https://foo:bar@localhost.local/hello/world",
      },
    },
    {
      name: "merging search and hash",
      path: "https://foo.bar/hello/world?foo=bar#hash",
      base: "https://localhost.local/",
      option: { mode: "path", keepPort: false },
      expected: {
        href: "https://localhost.local/hello/world?foo=bar#hash",
      },
    },
    {
      name: "do not keep port",
      path: "https://foo.bar/hello/world?foo=bar#hash",
      base: "https://localhost.local:443/",
      option: { mode: "path", keepPort: false },
      expected: {
        href: "https://localhost.local/hello/world?foo=bar#hash",
      },
    },
    {
      name: "sanitize path",
      path: "//foo.bar/hello/world?foo=bar#hash",
      base: "https://localhost.local:443/",
      option: { mode: "path", keepPort: false },
      expected: {
        href: "https://localhost.local/foo.bar/hello/world?foo=bar#hash",
      },
    },
    {
      name: "sanitize path",
      path: "//\\//\\foo.bar/hello/world?foo=bar#hash",
      base: "https://localhost.local:443/",
      option: { mode: "path", keepPort: false },
      expected: {
        href: "https://localhost.local/foo.bar/hello/world?foo=bar#hash",
      },
    },
  ];

  t.plan(cases.length);

  for (let i = 0; i < cases.length; i++) {
    const kase = cases[i];
    t.test(kase, function (t) {
      const keys = Object.keys(kase.expected);
      t.plan(keys.length);
      const url = new SecureURL(kase.path, kase.base, kase.option);
      for (const key in keys) {
        t.equal(url[key], kase.expected[key]);
      }
    });
  }
});

t.test("path mode and keep port", function (t) {
  const cases = [
    {
      name: "should not update host",
      path: "https://foo.bar/hello/world",
      base: "https://localhost.local/",
      option: { mode: "path", keepPort: true },
      expected: {
        href: "https://localhost.local/hello/world",
      },
    },
    {
      name: "should not update host",
      path: "https://foo.bar/hello/world",
      base: "https://foo@localhost.local/",
      option: { mode: "path", keepPort: true },
      expected: {
        href: "https://foo@localhost.local/hello/world",
      },
    },
    {
      name: "should not update host",
      path: "https://foo.bar/hello/world",
      base: "https://foo:bar@localhost.local/",
      option: { mode: "path", keepPort: true },
      expected: {
        href: "https://foo:bar@localhost.local/hello/world",
      },
    },
    {
      name: "merging search and hash",
      path: "https://foo.bar/hello/world?foo=bar#hash",
      base: "https://localhost.local/",
      option: { mode: "path", keepPort: true },
      expected: {
        href: "https://localhost.local/hello/world?foo=bar#hash",
      },
    },
    {
      name: "do keep port",
      path: "https://foo.bar/hello/world?foo=bar#hash",
      base: "https://localhost.local:443/",
      option: { mode: "path", keepPort: true },
      expected: {
        href: "https://localhost.local:443/hello/world?foo=bar#hash",
      },
    },
    {
      name: "sanitize path",
      path: "//foo.bar/hello/world?foo=bar#hash",
      base: "https://localhost.local:443/",
      option: { mode: "path", keepPort: true },
      expected: {
        href: "https://localhost.local:443/foo.bar/hello/world?foo=bar#hash",
      },
    },
    {
      name: "sanitize path",
      path: "//\\//\\foo.bar/hello/world?foo=bar#hash",
      base: "https://localhost.local:443/",
      option: { mode: "path", keepPort: true },
      expected: {
        href: "https://localhost.local:443/foo.bar/hello/world?foo=bar#hash",
      },
    },
  ];

  t.plan(cases.length);

  for (let i = 0; i < cases.length; i++) {
    const kase = cases[i];
    t.test(kase, function (t) {
      const keys = Object.keys(kase.expected);
      t.plan(keys.length);
      const url = new SecureURL(kase.path, kase.base, kase.option);
      for (const key in keys) {
        t.equal(url[key], kase.expected[key]);
      }
    });
  }
});

t.test("relax mode and not keep port", function (t) {
  const cases = [
    {
      name: "should update host",
      path: "https://foo.bar/hello/world",
      base: "https://localhost.local/",
      option: { mode: "relax", keepPort: false },
      expected: {
        href: "https://foo.bar/hello/world",
      },
    },
    {
      name: "should update host",
      path: "https://foo.bar/hello/world",
      base: "https://foo@localhost.local/",
      option: { mode: "relax", keepPort: false },
      expected: {
        href: "https://foo.bar/hello/world",
      },
    },
    {
      name: "should update host",
      path: "https://foo.bar/hello/world",
      base: "https://foo:bar@localhost.local/",
      option: { mode: "relax", keepPort: false },
      expected: {
        href: "https://foo.bar/hello/world",
      },
    },
    {
      name: "merging search and hash",
      path: "https://foo.bar/hello/world?foo=bar#hash",
      base: "https://localhost.local/",
      option: { mode: "relax", keepPort: false },
      expected: {
        href: "https://foo.bar/hello/world?foo=bar#hash",
      },
    },
    {
      name: "do not keep port",
      path: "https://foo.bar/hello/world?foo=bar#hash",
      base: "https://localhost.local:443/",
      option: { mode: "relax", keepPort: false },
      expected: {
        href: "https://foo.bar/hello/world?foo=bar#hash",
      },
    },
    {
      name: "sanitize path",
      path: "//foo.bar/hello/world?foo=bar#hash",
      base: "https://localhost.local:443/",
      option: { mode: "relax", keepPort: false },
      expected: {
        href: "https://localhost.local/foo.bar/hello/world?foo=bar#hash",
      },
    },
    {
      name: "sanitize path",
      path: "//\\//\\foo.bar/hello/world?foo=bar#hash",
      base: "https://localhost.local:443/",
      option: { mode: "relax", keepPort: false },
      expected: {
        href: "https://localhost.local/foo.bar/hello/world?foo=bar#hash",
      },
    },
  ];

  t.plan(cases.length);

  for (let i = 0; i < cases.length; i++) {
    const kase = cases[i];
    t.test(kase, function (t) {
      const keys = Object.keys(kase.expected);
      t.plan(keys.length);
      const url = new SecureURL(kase.path, kase.base, kase.option);
      for (const key in keys) {
        t.equal(url[key], kase.expected[key]);
      }
    });
  }
});

t.test("relax mode and keep port", function (t) {
  const cases = [
    {
      name: "should update host",
      path: "https://foo.bar/hello/world",
      base: "https://localhost.local/",
      option: { mode: "relax", keepPort: true },
      expected: {
        href: "https://foo.bar/hello/world",
      },
    },
    {
      name: "should update host",
      path: "https://foo.bar/hello/world",
      base: "https://foo@localhost.local/",
      option: { mode: "relax", keepPort: true },
      expected: {
        href: "https://foo.bar/hello/world",
      },
    },
    {
      name: "should update host",
      path: "https://foo.bar/hello/world",
      base: "https://foo:bar@localhost.local/",
      option: { mode: "relax", keepPort: true },
      expected: {
        href: "https://foo.bar/hello/world",
      },
    },
    {
      name: "merging search and hash",
      path: "https://foo.bar/hello/world?foo=bar#hash",
      base: "https://localhost.local/",
      option: { mode: "relax", keepPort: true },
      expected: {
        href: "https://foo.bar/hello/world?foo=bar#hash",
      },
    },
    {
      name: "do keep port",
      path: "https://foo.bar:443/hello/world?foo=bar#hash",
      base: "https://localhost.local/",
      option: { mode: "relax", keepPort: true },
      expected: {
        href: "https://foo.bar:443/hello/world?foo=bar#hash",
      },
    },
    {
      name: "sanitize path",
      path: "//foo.bar/hello/world?foo=bar#hash",
      base: "https://localhost.local:443/",
      option: { mode: "relax", keepPort: true },
      expected: {
        href: "https://localhost.local:443/foo.bar/hello/world?foo=bar#hash",
      },
    },
    {
      name: "sanitize path",
      path: "//\\//\\foo.bar/hello/world?foo=bar#hash",
      base: "https://localhost.local:443/",
      option: { mode: "relax", keepPort: true },
      expected: {
        href: "https://localhost.local:443/foo.bar/hello/world?foo=bar#hash",
      },
    },
  ];

  t.plan(cases.length);

  for (let i = 0; i < cases.length; i++) {
    const kase = cases[i];
    t.test(kase, function (t) {
      const keys = Object.keys(kase.expected);
      t.plan(keys.length);
      const url = new SecureURL(kase.path, kase.base, kase.option);
      for (const key in keys) {
        t.equal(url[key], kase.expected[key]);
      }
    });
  }
});

t.test("insecure mode", function (t) {
  const cases = [
    {
      name: "allow relative path",
      path: "//foo.bar/hello/world",
      base: "https://localhost.local/",
      option: { mode: "insecure" },
      expected: {
        href: "https://foo.bar/hello/world",
      },
    },
    {
      name: "allow relative path",
      path: "//foo.bar/hello/world",
      base: "https://localhost.local:443/",
      option: { mode: "insecure" },
      expected: {
        href: "https://foo.bar/hello/world",
      },
    },
  ];

  t.plan(cases.length);

  for (let i = 0; i < cases.length; i++) {
    const kase = cases[i];
    t.test(kase, function (t) {
      const keys = Object.keys(kase.expected);
      t.plan(keys.length);
      const url = new SecureURL(kase.path, kase.base, kase.option);
      for (const key in keys) {
        t.equal(url[key], kase.expected[key]);
      }
    });
  }
});

t.test("others", function (t) {
  const cases = [
    {
      name: "non-slash protocols",
      path: "mailto:foo.bar",
      base: "mailto:foo.bar",
      option: { mode: "relax" },
      expected: {
        href: "mailto:foo.bar",
        origin: "null",
      },
    },
  ];

  t.plan(cases.length);

  for (let i = 0; i < cases.length; i++) {
    const kase = cases[i];
    t.test(kase, function (t) {
      const keys = Object.keys(kase.expected);
      t.plan(keys.length);
      const url = new SecureURL(kase.path, kase.base, kase.option);
      for (const key in keys) {
        t.equal(url[key], kase.expected[key]);
      }
    });
  }
});
