## Wordpress Plugin InjectGUARD
As the name suggests, this plugin, when activated, goes through your pending comments in the **Administration Panel of Wordpress** and determines if they are malicious by means of a static analysis. 

It then tells you which comments you should accept and which ones you should get rid of.


## Compose.yaml
Contains a docker architecture to run a wordpress image and test the plugin code or tweak it to your needs.

There is a `restore` service in the docker compose that I created. You can use it to restore the database of an existing Wordpress website if you have one already.
