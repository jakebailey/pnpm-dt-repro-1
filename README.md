To test:

```sh
$ pnpm install
$ pnpm tsc -p types/zipkin-instrumentation-fetch
../../node_modules/.pnpm/form-data@3.0.1/node_modules/form-data/index.d.ts:6:23 - error TS4090: Conflicting definitions for 'node' found at '/home/jabaile/work/dt-repro/node_modules/.pnpm/@types+node@17.0.45/node_modules/@types/node/index.d.ts' and '/home/jabaile/work/dt-repro/types/node/index.d.ts'. Consider installing a specific version of this library to resolve the conflict.
  The file is in the program because:
    Type library referenced via 'node' from file '/home/jabaile/work/dt-repro/types/node-fetch/index.d.ts' with packageId '@types/node/index.d.ts@18.16.99999'
    Type library referenced via 'node' from file '/home/jabaile/work/dt-repro/node_modules/.pnpm/form-data@3.0.1/node_modules/form-data/index.d.ts' with packageId '@types/node/index.d.ts@17.0.45'

6 /// <reference types="node" />
                        ~~~~

  ../node-fetch/index.d.ts:1:23
    1 /// <reference types="node" />
                            ~~~~
    File is included via type library reference here.


Found 1 error in ../../node_modules/.pnpm/form-data@3.0.1/node_modules/form-data/index.d.ts:6

$ echo "shared-workspace-lockfile=false" >> .npmrc
$ git clean -fdx
$ pnpm install
$ pnpm tsc -p types/zipkin-instrumentation-fetch  # Success!
```
