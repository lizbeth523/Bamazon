Bamazon
#######

Overview
********
Bamazon is an Amazon-like storefront that uses MySQL to store the product inventory. The bamazonCustomer app takes in orders from customers and depletes stock from the store's inventory. The bamazonManager app allows the manager to check the store's inventory, add additional inventory to existing products, and to add new products.

Usage
*****
Before using the apps, you must run npm install to install dependencies

.. code:: bash

  $ npm install

bamazonCustomer
===============
.. image:: ./assets/customer.gif

* To start the program, type the following on the command line while in the directory where the program is saved:

.. code:: bash

  	$ node bamazonCustomer.js

* Select the item from the list that you would like to purchase and press enter. You will be asked for the quantity that you would like to purchase and then to confirm your purchase. If there is sufficient inventory in stock of the item selected, then you will be given the total for your order, and the database will be updated with the new quantity in stock.
* After each purchase, you will be asked whether you would like to Keep Shopping or to exit. Highlight your choice using the arrow keys and press enter.