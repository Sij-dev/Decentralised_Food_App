# Avoiding common attacks

Objective of this document is to explain the measures taken to avoid common attacks.

### Logic Bugs
- Implemented unit testcases to test the scenarios using truffle automated testing framework.
- Followed coding standards and best practices.

### Recursive call
- Limited externally accessible storage variables. Most of critical storage variables are either private or internal.
- Very limited external accessable function(external, public) calls implemented considering the project requirements.

### Integer arithmetic overflow
- Used require() in integer arithmetic functionalities to avoid overflow/underflow.
- Used uint for integer to avoid overflow, instead of uint8. (considered the cons for this usage)

### Poison Data 
- Used require() in the entry point to sanitize user input wherever applicable.

### Exposure 
- No sensitive data are stored in blockchain.  
- Functions/state variables, which are not required to access from external, made as private or internal. 

### Minor vulnerabilities 
- Critical functionalities has no dependency on timestamps

### Cross chain replay attacks
- Not applicable in this usecase (project)

### Powerful contract administration

This is a know issue in the current implementation. Needs to implement mutisig contract owner and Programmable upgrade policies using “Timedupdatable” (TODO)



