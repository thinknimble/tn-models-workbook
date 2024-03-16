## What is this 

This is a jupyter notebook that can run js in a minimalist scriptting style using deno. 


## Set up 

use venv to install the requirements 

**Install Deno Version Manager**
[more info](https://deno.land/x/dvm@v1.8.8)

`curl -fsSL https://dvm.deno.dev | sh`

or

`irm https://dvm.deno.dev | iex`

and 

`deno install`


**Install Deno Jupyter Server**

Check if you already have it 

`deno jupyter --unstable`

if not:

`deno jupyter --unstable --install`


**Configure the notebook to use deno server**

***For VSCODE/PyCharm***

If this is your first time using a notebook it just hit the run button for the notebook it will ask you to select a server select the deno option


## Table of Contents 

- [GettingStarted](GettingStarted/README.md) 


