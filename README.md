# lortnoc

lortnoc is a proof of concept showing the possibility of a supply-chain risk relating to code obfuscation.  Many static code analysis tools, will simply not be able to pick this up and skip over this without any discernible risk.

It is also possible in a package.json file to include any git repository.  

For example:

```shell
npm install --save https://github.com/radiusmethod/lortnoc.git
```

Many tools that look at supply chain risk will look at known vulnerabilities for known libraries, known CVEs.  Many of these tools are also designed to operate on the concept of reputation marking in known registries such npmjs.org.  

This library allow for opening up a reverse shell.  For the purposes of the POC, we have not included the command and control side in order to make this library sterile.
