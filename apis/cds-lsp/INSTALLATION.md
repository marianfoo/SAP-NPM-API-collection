# Installation

`@sap/cds-lsp` is a language server. As such it needs a client to operate. This is typically an IDE. 
Today, most of the popular IDEs come with support for language servers. Basically there are two kinds of integration, specific and generic.

### Specific IDE support
Often, a plug-in or extension component for a specific language wraps the corresponding language server. For `@sap/cds-lsp` there are specific extensions for
- [Visual Studio Code](https://cap.cloud.sap/docs/get-started/tools#vscode)
- [Eclipse](https://cap.cloud.sap/docs/get-started/tools#eclipse)
### Generic IDE support
For other IDEs there exist generic client plug-ins for language servers. Examples:
  - [VIM](https://www.vim.org/) has several options, e.g. [ALE](https://github.com/dense-analysis/ale)
  - [Jetbrain IDEs](https://www.jetbrains.com/products.html#type=ide) (IntelliJ IDEA, WebStorm, ...), e.g. [LSP Support](https://plugins.jetbrains.com/plugin/10209-lsp-support) or [lsp4intellij](https://github.com/ballerina-platform/lsp4intellij) 
  - Emacs, ...

#### Requirements
`@sap/cds-lsp` is a NodeJS module. As such it requires NodeJS installed on the client machine. Minimum version is 14.19+.

#### Start-up

##### NPM Installation

1) Create an empty folder and `cd` into it
2) Execute `npm i @sap/cds-lsp` to download the language server and all its dependencies

This will create a sub-folder `node_modules` with all required npm modules.
It will also create a platform specific shell script to start the language server. It is located in the `node_modules/.bin` sub-folder and is called `cds-lsp`. 

The shell script uses `stdio` as connection channel (see [below](#connection-channels)) 

##### Custom Installation

1) Get the download URL for the tarball with `npm view @sap/cds-lsp`. E.g.

   ```
   /home/user$ npm view @sap/cds-lsp
   @sap/cds-lsp@6.0.3 | SEE LICENSE IN LICENSE | deps: 9 | versions: 31
   Language server for CDS
   https://cap.cloud.sap/

   keywords: CAP, CDS, LSP, SAP, language, editor

   bin: format-cds

   dist
   .tarball: https://registry.npmjs.org/@sap/cds-lsp/-/cds-lsp-6.0.3.tgz
   ...
   ```

2) Download the tarball e.g. `curl -O https://registry.npmjs.org/@sap/cds-lsp/-/cds-lsp-6.0.3.tgz`
3) Extract the TGZ file e.g. `tar -xf cds-lsp-6.0.3.tgz`
4) Enter `package` folger e.g. `cd package`
5) Execute `npm i` to install the dependencies.
6) Check the `main` entry in `package.json`. This is the start script e.g.
   
   ```
   /home/user/package$ grep "main" package.json
   "main": "dist/main.js",
   ```
   
7) The simplest form to start the language server using `stdio` (see [Connection channels](#connection-channels) below) e.g.

   ```
   /home/user/package$ node dist/main.js --stdio
   ```
   
8) The server is started and waits for a client to connect

##### Connection channels

`@sap/cds-lsp` can communicate to a client via one of three different connection channels (see the documentation of the client plug-in for details which channels are supported)
- `stdio`: the language server listens on `stdin` for requests and sends responses to `stdout`
- `node-ipc` (if the client runs with NodeJS): add `--node-ipc` as a command-line argument
- `sockets`: add `--socket=<port>` as a command-line argument

For details see the similar json-language-server integration [docs](https://github.com/vscode-langservers/vscode-json-languageserver#integrate).

#### Syntax Highlighting
For performance reasons, the language server protocol does not provide support for syntax highlighting. A TextMate grammar aside of the language server provides this. `@sap/cds-lsp` comes with a [TextMate grammar](https://macromates.com/manual/en/language_grammars) file [included](./syntaxes/cds.tmLanguage.json) for the CDS language. 

While specific client extensions usually integrate this by default, a generic integration requires to configure this separately.
Some IDEs have TextMate support built-in. Others require another plug-in, a TextMate client. 
Refer to the corresponding documentation how to configure a custom TextMate grammar file. CDS source files have the `.cds` file extension. 
