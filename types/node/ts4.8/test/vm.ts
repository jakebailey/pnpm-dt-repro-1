import {
    createContext,
    isContext,
    Script,
    runInNewContext,
    runInThisContext,
    compileFunction,
    measureMemory,
    MemoryMeasurement,
    SourceTextModule,
    SyntheticModule,
} from 'node:vm';
import { inspect } from 'node:util';

{
    const sandbox = {
        animal: 'cat',
        count: 2
    };

    const context = createContext(sandbox, {
        name: 'test',
        origin: 'file://test.js',
        codeGeneration: {
            strings: true,
            wasm: true,
        },
    });
    console.log(isContext(context));
    const script = new Script('count += 1; name = "kitty"');

    for (let i = 0; i < 10; ++i) {
        script.runInContext(context);
    }

    console.log(inspect(sandbox));

    runInNewContext('count += 1; name = "kitty"', sandbox);
    console.log(inspect(sandbox));
}

{
    const sandboxes = [{}, {}, {}];

    const script = new Script('globalVar = "set"');

    sandboxes.forEach((sandbox) => {
        script.runInNewContext(sandbox);
        script.runInThisContext();
    });

    console.log(inspect(sandboxes));

    const localVar = 'initial value';
    runInThisContext('localVar = "vm";');

    console.log(localVar);
}

{
    runInThisContext('console.log("hello world"', './my-file.js');
}

{
    const fn: Function = compileFunction('console.log("test")', [] as ReadonlyArray<string>, {
        parsingContext: createContext(),
        contextExtensions: [{
            a: 1,
        }],
        produceCachedData: false,
        cachedData: Buffer.from('nope'),
    });
}

{
    const usage = measureMemory({
        mode: 'detailed',
        execution: 'eager',
    }).then((data: MemoryMeasurement) => { });
}

{
    runInNewContext(
      'blah',
      { },
      { timeout: 5, microtaskMode: 'afterEvaluate' }
    );
}

{
    const script = new Script('foo()', { cachedData: Buffer.from([]) });
    console.log(script.cachedDataProduced);
    console.log(script.cachedDataRejected);
    console.log(script.cachedData);
}

{
    // createContext accepts microtaskMode param
    const sandbox = {
        animal: 'cat',
        count: 2
    };

    const context = createContext(sandbox, {
        name: 'test',
        origin: 'file://test.js',
        codeGeneration: {
            strings: true,
            wasm: true,
        },
        microtaskMode: 'afterEvaluate'
    });
    console.log(isContext(context));
}

(async () => {
    const contextifiedObject = createContext({
        secret: 42,
        print: console.log,
    });

    const bar = new SourceTextModule(`
        import s from 'foo';
        s;
        print(s);
    `, { context: contextifiedObject });

    await bar.link(async function linker(specifier, referencingModule) {
        if (specifier === 'foo') {
            return new SourceTextModule(`
                // The "secret" variable refers to the global variable we added to
                // "contextifiedObject" when creating the context.
                export default secret;
            `, { context: referencingModule.context });
        }
        throw new Error(`Unable to resolve dependency: ${specifier}`);
    });

    await bar.evaluate();
});

(async () => {
    const source = '{ "a": 1 }';
    const module = new SyntheticModule(['default'], function() {
        const obj = JSON.parse(source);
        this.setExport('default', obj);
    });
});