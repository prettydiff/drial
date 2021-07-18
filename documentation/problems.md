
<!-- documentation/problems - A list of problems I have encountered and have not solved. -->

# drial - Problems
This is a list of unsolved problems I have encountered:

## drial
A list of problems or shortcomings identified to this application.

* The CDP allows for access to various windows, tabs, and pages simultaneously via a loaderId and frameId.  I have not provided access to anything beyond the primary page frame that opens as the browser window opens.  This will require some additional logic to identify various frames by frameId and I will need to update the TypeScript interface for the campaigns to allow users to identify different frames.
  - Challenge: The challenge is that these various containers are identified using a dynamic hash scheme.  Associating that back to a static document that is maintained by end users requires some planning.
  - Business Case: An interaction that spawns a popup or new tab should allow testing in both the originating page as well as the spawned page.
* Missing feature: page navigation via page history, such as clicking a back button or forward button in the browser.

## Chrome
A list of problems attributed to the Chrome browser.

* Setting the flag `--auto-open-devtools-for-tabs` causes the browser to error when a page address is specified via CDP.  This appears to be a Chrome developer tools defect after reading the Chromium project source code at the indicated location
  - Error message: `[16280:17676:0718/142416.732:ERROR:devtools_ui_bindings.cc(1651)] Attempt to navigate to an invalid DevTools front-end URL: https://www.bankofamerica.com/`
  - Defect report: https://bugs.chromium.org/p/chromium/issues/detail?id=1230398

## Firefox
A list of problems attributed to the Firefox browser.

* Launching the browser with port 0 is permitted.  The behavior is the same as Chrome and Node.js in that the application will listen on a randomly available TCP port, but nobody knows how to identify what that port number is, including Firefox developers.
  - Work around: a post must always be specified when using Firefox.
* Sometimes Firefox employs behaviors that cause a domain to auto-redirect to https.  If this happens to `localhost` the browser is dead to testing.  The browser is only listening on http scheme, but all traffic to localhost at the specified Firefox port becomes a HTTPS request, which will always time out.  When this happens it applies to requests in the browser, devtools, and the shell.  These are things I have tried:
  - Forget the domain from browsing history
  - In `about:config` set these keys to false: browser.urlbar.autoFill, browser.fixup.fallback-to-https, network.stricttransportsecurity.preloadlist
  - Investigated in a private browsing window