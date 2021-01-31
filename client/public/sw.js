if (!self.define) {
  const e = (e) => {
      "require" !== e && (e += ".js");
      let c = Promise.resolve();
      return (
        i[e] ||
          (c = new Promise(async (c) => {
            if ("document" in self) {
              const i = document.createElement("script");
              (i.src = e), document.head.appendChild(i), (i.onload = c);
            } else importScripts(e), c();
          })),
        c.then(() => {
          if (!i[e]) throw new Error(`Module ${e} didn’t register its module`);
          return i[e];
        })
      );
    },
    c = (c, i) => {
      Promise.all(c.map(e)).then((e) => i(1 === e.length ? e[0] : e));
    },
    i = { require: Promise.resolve(c) };
  self.define = (c, s, a) => {
    i[c] ||
      (i[c] = Promise.resolve().then(() => {
        let i = {};
        const d = { uri: location.origin + c.slice(1) };
        return Promise.all(
          s.map((c) => {
            switch (c) {
              case "exports":
                return i;
              case "module":
                return d;
              default:
                return e(c);
            }
          })
        ).then((e) => {
          const c = a(...e);
          return i.default || (i.default = c), i;
        });
      }));
  };
}
define("./sw.js", ["./workbox-c39f0ebe"], function (e) {
  "use strict";
  self.addEventListener("message", (e) => {
    e.data && "SKIP_WAITING" === e.data.type && self.skipWaiting();
  }),
    e.precacheAndRoute(
      [
        {
          url: "asset-manifest.json",
          revision: "9ff3eb70e7bdcedeb4779d6abe386c3f",
        },
        { url: "favicon.ico", revision: "c92b85a5b907c70211f4ec25e29a8c4a" },
        { url: "index.html", revision: "bda7fedba46c0bd610dd27358d6f02c7" },
        { url: "logo192.png", revision: "33dbdd0177549353eeeb785d02c294af" },
        { url: "logo512.png", revision: "917515db74ea8d1aee6a246cfbcc0b45" },
        { url: "manifest.json", revision: "89be60895176466398d53bd4a693d9f6" },
        { url: "robots.txt", revision: "61c27d2cd39a713f7829422c3d9edcc7" },
        {
          url: "static/css/6.fb207e70.chunk.css",
          revision: "b623260a7131515f38f45607604599db",
        },
        {
          url: "static/css/7.c296b83f.chunk.css",
          revision: "e5805dc24c8126f235a8ce64a5c310cb",
        },
        {
          url: "static/css/9.89b5ae0a.chunk.css",
          revision: "5fd8a121f50fcbbce22510243c25daef",
        },
        {
          url: "static/css/main.c575ece0.chunk.css",
          revision: "1f5e50352676f2839aee96e038736b94",
        },
        {
          url: "static/js/0.d8b34924.chunk.js",
          revision: "61addb9196845908d534bdb9e668ae68",
        },
        {
          url: "static/js/1.1cb4b53b.chunk.js",
          revision: "3978cf0c19128727f086cd9196fc1c4d",
        },
        {
          url: "static/js/10.b6d5225e.chunk.js",
          revision: "042e264ecd51d02ba511663e438c7100",
        },
        {
          url: "static/js/10.b6d5225e.chunk.js.LICENSE.txt",
          revision: "8e7fa176b006150306288bd092a696c0",
        },
        {
          url: "static/js/11.07be386e.chunk.js",
          revision: "9b4b4707d4f21842b5a004d70269e474",
        },
        {
          url: "static/js/12.95bce095.chunk.js",
          revision: "2f7c783f8c123bdf30788012631e9848",
        },
        {
          url: "static/js/13.564bcd4f.chunk.js",
          revision: "0346002195bdd755f8b689512d7228f3",
        },
        {
          url: "static/js/14.86263b32.chunk.js",
          revision: "c984f1566b4ad18b31bf8c0a043d5f68",
        },
        {
          url: "static/js/15.4b0c9178.chunk.js",
          revision: "a55f313dc8c3d89a7f47176ed40fb3b4",
        },
        {
          url: "static/js/16.649938cc.chunk.js",
          revision: "2cb51c13cb22dd9104b0ff83f9ffe652",
        },
        {
          url: "static/js/17.5c700f65.chunk.js",
          revision: "5f6e56c0cb9921fb2399a6daea716897",
        },
        {
          url: "static/js/2.09fba28f.chunk.js",
          revision: "257a6937c68556ea3da91b561152f92a",
        },
        {
          url: "static/js/3.87c5e094.chunk.js",
          revision: "4bbacb18e516ff995ea6b27debb2cf4b",
        },
        {
          url: "static/js/6.42526005.chunk.js",
          revision: "74cc9c71044c7a298999e7dc8d9e92e3",
        },
        {
          url: "static/js/6.42526005.chunk.js.LICENSE.txt",
          revision: "19fbd0f41e4ab41365f21d407fba58fd",
        },
        {
          url: "static/js/7.369c514c.chunk.js",
          revision: "487e2359116cd4cb7d8dea912b1e50b0",
        },
        {
          url: "static/js/7.369c514c.chunk.js.LICENSE.txt",
          revision: "80d866c934aadf5330278b59eb16292d",
        },
        {
          url: "static/js/8.52f441d7.chunk.js",
          revision: "f9530899c684003e276e9e823180e091",
        },
        {
          url: "static/js/9.d3e017ec.chunk.js",
          revision: "4e05a042ea9c173c6757ecf836a15eb7",
        },
        {
          url: "static/js/main.f360212e.chunk.js",
          revision: "fc61cccd168ba26e837218f9e647cbca",
        },
        {
          url: "static/js/runtime-main.6100eeb9.js",
          revision: "fae98252f78051106e07803cd74aad00",
        },
        {
          url: "static/media/brand-icons.278156e4.woff2",
          revision: "e8c322de9658cbeb8a774b6624167c2c",
        },
        {
          url: "static/media/brand-icons.65a2fb6d.ttf",
          revision: "c5ebe0b32dc1b5cc449a76c4204d13bb",
        },
        {
          url: "static/media/brand-icons.6729d297.svg",
          revision: "a1a749e89f578a49306ec2b055c073da",
        },
        {
          url: "static/media/brand-icons.cac87dc0.woff",
          revision: "a046592bac8f2fd96e994733faf3858c",
        },
        {
          url: "static/media/brand-icons.d68fa3e6.eot",
          revision: "13db00b7a34fee4d819ab7f9838cc428",
        },
        {
          url: "static/media/flags.99f63ae7.png",
          revision: "9c74e172f87984c48ddf5c8108cabe67",
        },
        {
          url: "static/media/icons.38c6d8ba.woff2",
          revision: "0ab54153eeeca0ce03978cc463b257f7",
        },
        {
          url: "static/media/icons.425399f8.woff",
          revision: "faff92145777a3cbaf8e7367b4807987",
        },
        {
          url: "static/media/icons.62d9dae4.svg",
          revision: "962a1bf31c081691065fe333d9fa8105",
        },
        {
          url: "static/media/icons.a01e3f2d.eot",
          revision: "8e3c7f5520f5ae906c6cf6d7f3ddcd19",
        },
        {
          url: "static/media/icons.c656b8ca.ttf",
          revision: "b87b9ba532ace76ae9f6edfe9f72ded2",
        },
        {
          url: "static/media/outline-icons.53671035.ttf",
          revision: "ad97afd3337e8cda302d10ff5a4026b8",
        },
        {
          url: "static/media/outline-icons.687a4990.woff2",
          revision: "cd6c777f1945164224dee082abaea03a",
        },
        {
          url: "static/media/outline-icons.752905fa.eot",
          revision: "701ae6abd4719e9c2ada3535a497b341",
        },
        {
          url: "static/media/outline-icons.9c4845b4.svg",
          revision: "82f60bd0b94a1ed68b1e6e309ce2e8c3",
        },
        {
          url: "static/media/outline-icons.ddae9b1b.woff",
          revision: "ef60a4f6c25ef7f39f2d25a748dbecfe",
        },
      ],
      {}
    );
});
//# sourceMappingURL=sw.js.map
