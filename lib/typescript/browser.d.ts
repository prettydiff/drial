/* lib/typescript/browser.d - TypeScript interfaces used by browser specific libraries. */

interface module_remote {
    action: testBrowserAction;
    delay: (config:testBrowserItem) => void;
    domFailure: boolean;
    error: (message:string, source:string, line:number, col:number, error:Error) => void;
    evaluate: (test:testBrowserTest) => [boolean, string, string];
    event: (item:testBrowserRoute, pageLoad:boolean) => void;
    getProperty: (test:testBrowserTest) => primitive;
    index: number;
    keyAlt: boolean;
    keyControl: boolean;
    keyShift: boolean;
    node: (dom:testBrowserDOM, property:string) => Element;
    parse: (testString:string) => void;
    report: (test:testBrowserTest[], index:number) => void;
    send: (payload:[boolean, string, string][], index:number, task:testBrowserAction) => void;
    serverPort: number;
    stringify: (primitive:primitive) => string;
}